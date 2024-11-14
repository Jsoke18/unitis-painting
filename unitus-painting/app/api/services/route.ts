import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Force dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function validateServicesContent(content: unknown) {
  console.log('Validating content:', JSON.stringify(content, null, 2));

  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content structure');
  }

  const servicesContent = content as any;

  // Log each field we're checking
  console.log('Checking fields:', {
    hasHeading: !!servicesContent.heading,
    hasDescription: !!servicesContent.description,
    hasServices: Array.isArray(servicesContent.services),
  });

  if (!servicesContent.heading ||
      !servicesContent.description ||
      !Array.isArray(servicesContent.services)) {
    throw new Error('Missing required fields');
  }

  // Validate each service item
  servicesContent.services.forEach((service: any) => {
    if (!service.icon ||
        !service.label ||
        !service.title ||
        !service.description ||
        !service.imageSrc ||
        !service.link) {
      throw new Error('Missing required fields in service item');
    }
  });

  return servicesContent;
}

async function getServicesFromDatabase() {
  const sql = neon(process.env.DATABASE_URL!);

  const result = await sql`
    WITH latest_services AS (
      SELECT * FROM landing_services
      ORDER BY created_at DESC
      LIMIT 1
    ),
    services_with_items AS (
      SELECT 
        ls.*,
        (
          SELECT json_agg(
            json_build_object(
              'icon', si.icon,
              'label', si.label,
              'title', si.title,
              'description', si.description,
              'imageSrc', si.image_src,
              'link', si.link
            ) ORDER BY si.display_order
          )
          FROM service_items si
          WHERE si.landing_services_id = ls.id
        ) as services
      FROM latest_services ls
    )
    SELECT 
      json_build_object(
        'heading', heading,
        'description', description,
        'services', services
      ) as content
    FROM services_with_items
  `;

  if (result.length === 0) {
    throw new Error('No services content found in database');
  }

  return result[0].content;
}

export async function GET() {
  try {
    console.log('Starting GET request');
    const content = await getServicesFromDatabase();

    console.log('Received content from database:', JSON.stringify(content, null, 2));

    const validatedContent = await validateServicesContent(content);

    console.log('Sending validated content:', JSON.stringify(validatedContent, null, 2));

    return new NextResponse(JSON.stringify(validatedContent), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to fetch services content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const content = await request.json();
    const validatedContent = await validateServicesContent(content);

    const sql = neon(process.env.DATABASE_URL!);

    // Insert new services content
    const servicesResult = await sql`
      INSERT INTO landing_services (
        heading,
        description
      ) VALUES (
        ${validatedContent.heading},
        ${validatedContent.description}
      )
      RETURNING id
    `;

    const servicesId = servicesResult[0].id;

    // Insert service items
    for (let i = 0; i < validatedContent.services.length; i++) {
      const service = validatedContent.services[i];
      await sql`
        INSERT INTO service_items (
          landing_services_id,
          icon,
          label,
          title,
          description,
          image_src,
          link,
          display_order
        ) VALUES (
          ${servicesId},
          ${service.icon},
          ${service.label},
          ${service.title},
          ${service.description},
          ${service.imageSrc},
          ${service.link},
          ${i}
        )
      `;
    }

    // Return the newly created content
    const updatedContent = await getServicesFromDatabase();

    return new NextResponse(JSON.stringify(updatedContent), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update services content' },
      { status: 500 }
    );
  }
}