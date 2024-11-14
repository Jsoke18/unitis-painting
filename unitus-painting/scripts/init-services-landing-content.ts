import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

const sql = neon(process.env.DATABASE_URL);

const content = {
  "heading": "Expert Painting Solutions for Every Space",
  "description": "Unitus Painting Ltd offers a wide range of painting services for commercial, strata, and residential properties. We are committed to delivering professional results while maintaining high standards of quality, safety, and efficiency.",
  "services": [
    {
      "icon": "https://cdn.builder.io/api/v1/image/assets/TEMP/f609be6373b67a1e7974196a374686fb06bda7407dbe85f6522226505a64d686",
      "label": "COMMERCIAL",
      "title": "Commercial Services",
      "description": "At Unitus Painting Ltd, we provide expert commercial painting services to enhance your building's appearance. Whether it's refreshing the exterior, updating interiors, or painting common areas, our skilled team ensures high-quality results that boost your property's aesthetic and professionalism.",
      "imageSrc": "https://cdn.builder.io/api/v1/image/assets/TEMP/d1b5c36af93a6b25b46964e94f894cbae859c1dacce4938ef288dd0342d49ec9",
      "link": "/services/commercial-services"
    },
    {
      "icon": "https://cdn.builder.io/api/v1/image/assets/TEMP/fd2445a0273933dddf4aa9d5fad6ff30e1941c1c1713fa460f07ac89658f9cbd",
      "label": "STRATA",
      "title": "Strata Services", 
      "description": "At Unitus Painting Ltd., we offer specialized strata painting services tailored to enhance the appearance and value of your property. Our experienced team delivers professional results, whether you're refreshing exteriors, updating common areas, or maintaining interior spaces.",
      "imageSrc": "https://cdn.builder.io/api/v1/image/assets/TEMP/6e19be2f4a6bd20a168cbe08a71d4f039386e8a6c28ab19994bc52980b28ee59",
      "link": "/services/strata-services"
    },
    {
      "icon": "https://cdn.builder.io/api/v1/image/assets/TEMP/6063ad228250655345711f681d6b31e4523ef155d6ed94a7a76a8dd4a1b2ec50",
      "label": "RESIDENTIAL",
      "title": "Residential Services",
      "description": "Transform your home with Unitus Painting Ltd.'s expert residential painting services. Whether you're refreshing a single room or giving your entire home a makeover, our experienced painters deliver high-quality, long-lasting results while ensuring minimal disruption to your daily life.",
      "imageSrc": "https://cdn.builder.io/api/v1/image/assets/TEMP/c64b6b1d6cc58d0edfa0d126db56a1f66cec314c83bdebac969ba5b68ea80532",
      "link": "/services/residential"
    }
  ]
};

async function main() {
  try {
    // Create tables
    console.log('Creating tables...');
    await sql`
      CREATE TABLE IF NOT EXISTS landing_services (
        id SERIAL PRIMARY KEY,
        heading TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS service_items (
        id SERIAL PRIMARY KEY,
        landing_services_id INTEGER REFERENCES landing_services(id),
        icon TEXT NOT NULL,
        label TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_src TEXT NOT NULL,
        link TEXT NOT NULL,
        display_order INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Starting data insertion...');
    
    // Insert landing services content
    console.log('Inserting landing services content...');
    const landingResult = await sql`
      INSERT INTO landing_services (
        heading,
        description
      ) VALUES (
        ${content.heading},
        ${content.description}
      )
      RETURNING id
    `;
    
    const landingId = landingResult[0].id;
    console.log('Landing services content inserted with ID:', landingId);

    // Insert service items
    console.log('Inserting service items...');
    for (const [index, service] of content.services.entries()) {
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
          ${landingId},
          ${service.icon},
          ${service.label},
          ${service.title},
          ${service.description},
          ${service.imageSrc},
          ${service.link},
          ${index}
        )
      `;
    }

    console.log('Successfully initialized landing services content');
  } catch (error) {
    console.error('Failed to initialize landing services content:', error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log('Initialization completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Initialization failed:', error);
    process.exit(1);
  });