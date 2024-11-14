import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

const sql = neon(process.env.DATABASE_URL);

const content = {
  "badge": {
    "text": "Expect The Best"
  },
  "heading": "We Deliver Quality and Excellence",
  "videoUrl": "https://player.vimeo.com/video/1025605255",
  "paragraphs": [
    "Unitus Painting Ltd. was founded in 2013. We are trusted professionals, offering high-quality painting services across Greater Vancouver, Fraser Valley, BC Interior, and Calgary.",
    "With over 11 years of experience, we specialize in commercial, strata, and residential painting, while also offering services like caulking, wood replacement, power washing, and more. Our clients appreciate our professionalism, attention to detail, and competitive pricing."
  ],
  "bulletPoints": [
    "Complete painting and repair services",
    "Skilled and qualified professionals",
    "Full workmanship guarantee",
    "Exceptional customer service"
  ]
};

async function main() {
  try {
    // Create tables first
    console.log('Creating tables...');
    await sql`
      CREATE TABLE IF NOT EXISTS about_content (
        id SERIAL PRIMARY KEY,
        badge_text TEXT NOT NULL,
        heading TEXT NOT NULL,
        video_url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS about_paragraphs (
        id SERIAL PRIMARY KEY,
        about_id INTEGER REFERENCES about_content(id),
        content TEXT NOT NULL,
        display_order INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS about_bullet_points (
        id SERIAL PRIMARY KEY,
        about_id INTEGER REFERENCES about_content(id),
        content TEXT NOT NULL,
        display_order INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Starting data insertion...');

    // Insert about content
    console.log('Inserting about content...');
    const aboutResult = await sql`
      INSERT INTO about_content (
        badge_text,
        heading,
        video_url
      ) VALUES (
        ${content.badge.text},
        ${content.heading},
        ${content.videoUrl}
      )
      RETURNING id
    `;

    const aboutId = aboutResult[0].id;
    console.log('About content inserted with ID:', aboutId);

    // Insert paragraphs
    console.log('Inserting paragraphs...');
    for (const [index, paragraph] of content.paragraphs.entries()) {
      await sql`
        INSERT INTO about_paragraphs (about_id, content, display_order)
        VALUES (${aboutId}, ${paragraph}, ${index})
      `;
    }

    // Insert bullet points
    console.log('Inserting bullet points...');
    for (const [index, point] of content.bulletPoints.entries()) {
      await sql`
        INSERT INTO about_bullet_points (about_id, content, display_order)
        VALUES (${aboutId}, ${point}, ${index})
      `;
    }

    console.log('Successfully initialized about content');

  } catch (error) {
    console.error('Failed to initialize about content:', error);
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