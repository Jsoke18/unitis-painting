import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

const sql = neon(process.env.DATABASE_URL);

const content = {
  testimonials: [
    {
        "name": "Dietrich Tiessen",
        "location": "Calgary, AB",
        "avatarSrc": "/avatar1.jpg",
        "rating": 5,
        "date": "2024-10-13",
        "content": "Working with Keith has been amazing, he understands his craft and his communication skills are on point.",
        "id": 1
      },
      {
        "name": "Prokopios Klimos",
        "location": "Calgary, AB",
        "avatarSrc": "/avatar2.jpg",
        "rating": 5,
        "date": "2024-02-03",
        "content": "We've worked with Keith from Unitus Painting several times (residential, and commercial for our strata building) and he and his teams have delivered for us every time—great work. Keith's extensive knowledge of painting products and installation helped us feel confident throughout the projects. We have recommended Unitus Painting to our friends and will continue to do so!\n",
        "id": 2
      },
      {
        "name": "Jorge Lobo",
        "location": "Vancouver, BC",
        "avatarSrc": "/avatar3.jpg",
        "rating": 5,
        "date": "2024-01-20",
        "content": "They have great experience and knowledge. You’ll be in good hands. They were happy to repair a broken gutter flange in my old house.",
        "id": 3
      },
      {
        "name": "Lou Gialleonardo",
        "location": "Calgary, AB",
        "avatarSrc": "/avatar1.jpg",
        "rating": 5,
        "date": "2024-08-19",
        "content": "Working with Kieth and his team was a very smooth process, they did great work and I would highly recommend them to any one who needs any type of painting. Thanks again guys.",
        "id": 4
      },
      {
        "name": "Alena Swope",
        "location": "Calgary, AB",
        "avatarSrc": "/avatar1.jpg",
        "rating": 5,
        "date": "2024-11-03",
        "content": "The painters at Unitus were extremely professional, knowledgeable and did a wonderful job on the interior of my home. I was so happy with their services, I rebooked them to paint the stucco on the exterior as well. They did a great job, I highly recommended them.",
        "id": 5
      },
      {
        "name": "Aleisha Vilimek",
        "location": "Maple Ridge, B.C",
        "avatarSrc": "/avatar1.jpg",
        "rating": 5,
        "date": "2024-11-03",
        "content": "Unitus painting is profesional, friendly and is great to work with. Their crews were careful to protect their surroundings and cleaned everything up nicely. It was a pleasure working with them and I highly recommend their work to anyone who is considering giving their home a new fresh look!\n",
        "id": 6
      },
      {
        "name": "Ray W",
        "location": "Vancouver, BC",
        "avatarSrc": "/avatar1.jpg",
        "rating": 5,
        "date": "2024-05-14",
        "content": "I had Unitus come to refresh our entire house and they exceeded our expectations. Keith and his team were very professional, punctual and price fit our budget. Will definitely use them again.\n",
        "id": 7
      },
      {
        "name": "Alam K",
        "location": "Calgary, AB",
        "avatarSrc": "/avatar1.jpg",
        "rating": 5,
        "date": "2024-02-27",
        "content": "Unitus came highly recommended to me by a colleague and I can see why! Had an excellent experience with Keith, from initial response to final product. My go to painting company from now on!",
        "id": 8
      },
      {
        "name": "Amy F",
        "location": "Vancouver, BC",
        "avatarSrc": "/avatar1.jpg",
        "rating": 5,
        "date": "2024-11-03",
        "content": "I can’t say enough good things about Unitus painting. When my grandmother needed her house painted and some minor repairs done in order to get the house ready for sale some years back, we looked into quite a few different companies for quotes. It was completely new territory for our family and was very daunting and overwhelming. Unitus not only had the most reasonable quote, they also sent a fantastic crew who got the job done beautifully and quickly. Bryce, the project manager, was also SO helpful and patient with all of our (many) questions along the way, and really gave us the impression that he genuinely cares about each client’s individual needs. His knowledge and reassurance was invaluable to us during that time. So naturally when we needed some pretty extensive exterior painting work done on our own property it was Unitus we went with. Once again they exceeded our expectations and knocked it out of the park,  getting the job done on time, on budget and while always being amazingly responsive to any questions we had during the job. We’re extremely pleased with the quality of work that Unitus has consistently provided us, and will continue to use their services for as long as our house stands! I honestly cannot recommend them enough. Thanks Unitus team!\n",
        "id": 9
      }
    ],
    "stats": {
      "totalProjects": 1,
      "yearsInBusiness": 15,
      "serviceAreas": 12,
      "averageRating": 5,
      "customerSatisfaction": 100,
      "featuredAvatars": [
        "/avatar1.jpg",
        "/avatar2.jpg",
        "/avatar3.jpg",
        "/avatar1.jpg",
        "/avatar1.jpg",
        "/avatar1.jpg",
        "/avatar1.jpg",
        "/avatar1.jpg",
        "/avatar1.jpg"
      ]
    }
};

async function main() {
  try {
    // Create tables
    console.log('Creating tables...');
    await sql`
      CREATE TABLE IF NOT EXISTS company_stats (
        id SERIAL PRIMARY KEY,
        total_projects INTEGER NOT NULL,
        years_in_business INTEGER NOT NULL,
        service_areas INTEGER NOT NULL,
        average_rating DECIMAL(3,2) NOT NULL,
        customer_satisfaction INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS featured_avatars (
        id SERIAL PRIMARY KEY,
        company_stats_id INTEGER REFERENCES company_stats(id),
        avatar_src TEXT NOT NULL,
        display_order INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        avatar_src TEXT NOT NULL,
        rating INTEGER NOT NULL,
        review_date DATE NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Starting data insertion...');
    
    // Insert company stats
    console.log('Inserting company stats...');
    const statsResult = await sql`
      INSERT INTO company_stats (
        total_projects,
        years_in_business,
        service_areas,
        average_rating,
        customer_satisfaction
      ) VALUES (
        ${content.stats.totalProjects},
        ${content.stats.yearsInBusiness},
        ${content.stats.serviceAreas},
        ${content.stats.averageRating},
        ${content.stats.customerSatisfaction}
      )
      RETURNING id
    `;
    
    const statsId = statsResult[0].id;
    console.log('Company stats inserted with ID:', statsId);

    // Insert featured avatars
    console.log('Inserting featured avatars...');
    for (const [index, avatarSrc] of content.stats.featuredAvatars.entries()) {
      await sql`
        INSERT INTO featured_avatars (
          company_stats_id,
          avatar_src,
          display_order
        ) VALUES (
          ${statsId},
          ${avatarSrc},
          ${index}
        )
      `;
    }

    // Insert testimonials
    console.log('Inserting testimonials...');
    for (const testimonial of content.testimonials) {
      await sql`
        INSERT INTO testimonials (
          name,
          location,
          avatar_src,
          rating,
          review_date,
          content
        ) VALUES (
          ${testimonial.name},
          ${testimonial.location},
          ${testimonial.avatarSrc},
          ${testimonial.rating},
          ${testimonial.date},
          ${testimonial.content}
        )
      `;
    }

    console.log('Successfully initialized testimonials and stats content');
  } catch (error) {
    console.error('Failed to initialize testimonials and stats content:', error);
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