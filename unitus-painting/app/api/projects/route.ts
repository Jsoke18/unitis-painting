import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Force dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function validateProject(content: any): Promise<boolean> {
  return !!(
    content.heading &&
    content.description &&
    Array.isArray(content.projects)
  );
}

async function getProjectsFromDatabase() {
  const sql = neon(process.env.DATABASE_URL!);

  const result = await sql`
    WITH latest_projects AS (
      SELECT * FROM projects_content
      ORDER BY created_at DESC
      LIMIT 1
    ),
    projects_with_items AS (
      SELECT 
        pc.*,
        (
          SELECT json_agg(
            json_build_object(
              'id', pi.id,
              'title', pi.title,
              'category', pi.category,
              'description', pi.description,
              'imageSrc', pi.image_src,
              'location', pi.location,
              'completionDate', pi.completion_date
            ) ORDER BY pi.display_order
          )
          FROM project_items pi
          WHERE pi.projects_content_id = pc.id
        ) as projects
      FROM latest_projects pc
    )
    SELECT 
      json_build_object(
        'heading', heading,
        'description', description,
        'projects', COALESCE(projects, '[]'::json)
      ) as data
    FROM projects_with_items
  `;

  if (result.length === 0) {
    return {
      heading: "",
      description: "",
      projects: []
    };
  }

  return result[0].data;
}

export async function GET() {
  try {
    const content = await getProjectsFromDatabase();
    return NextResponse.json(content);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to read projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const content = await req.json();
    if (!await validateProject(content)) {
      throw new Error('Invalid project data');
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Insert projects content
    const projectsResult = await sql`
      INSERT INTO projects_content (heading, description) 
      VALUES (${content.heading}, ${content.description}) 
      RETURNING id
    `;

    const projectsId = projectsResult[0].id;

    // Insert project items
    for (let i = 0; i < content.projects.length; i++) {
      const project = content.projects[i];
      await sql`
        INSERT INTO project_items (
          projects_content_id,
          title,
          category,
          description,
          image_src,
          location,
          completion_date,
          display_order
        ) VALUES (
          ${projectsId},
          ${project.title},
          ${project.category},
          ${project.description},
          ${project.imageSrc},
          ${project.location},
          ${project.completionDate},
          ${i}
        )
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to save projects' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const content = await req.json();
    if (!await validateProject(content)) {
      throw new Error('Invalid project data');
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Insert new content
    const projectsResult = await sql`
      INSERT INTO projects_content (heading, description) 
      VALUES (${content.heading}, ${content.description}) 
      RETURNING id
    `;

    const projectsId = projectsResult[0].id;

    // Insert new project items
    for (let i = 0; i < content.projects.length; i++) {
      const project = content.projects[i];
      await sql`
        INSERT INTO project_items (
          projects_content_id,
          title,
          category,
          description,
          image_src,
          location,
          completion_date,
          display_order
        ) VALUES (
          ${projectsId},
          ${project.title},
          ${project.category},
          ${project.description},
          ${project.imageSrc},
          ${project.location},
          ${project.completionDate},
          ${i}
        )
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update projects' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      DELETE FROM project_items 
      WHERE id = ${parseInt(id)} 
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}