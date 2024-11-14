import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

const sql = neon(process.env.DATABASE_URL);

const content = {
  "location": {
    "text": "Serving Greater Vancouver, Fraser Valley, BC Interior, and Calgary"
  },
  "mainHeading": {
    "line1": "Transform Your Space",
    "line2": "Professional Painting Services"
  },
  "subheading": "Expert residential and commercial painting solutions delivered with precision, professionalism, and attention to detail.",
  "buttons": {
    "primary": {
      "text": "Explore Our Services",
      "link": "/services"
    },
    "secondary": {
      "text": "Get Free Quote",
      "link": "/contact"
    }
  },
  "videoUrl": "https://storage.googleapis.com/unitis-videos/Banner%20Video.mp4"
};

async function main() {
  try {
    console.log('Starting data insertion...');

    // Insert hero content
    console.log('Inserting hero content...');
    const heroResult = await sql`
      INSERT INTO hero_content (
        location_text,
        main_heading_line1,
        main_heading_line2,
        subheading,
        video_url
      ) VALUES (
        ${content.location.text},
        ${content.mainHeading.line1},
        ${content.mainHeading.line2},
        ${content.subheading},
        ${content.videoUrl}
      )
      RETURNING id
    `;

    const heroId = heroResult[0].id;
    console.log('Hero content inserted with ID:', heroId);

    // Insert buttons
    console.log('Inserting buttons...');
    await sql`
      INSERT INTO hero_buttons (hero_id, button_type, text, link)
      VALUES 
        (${heroId}, 'primary', ${content.buttons.primary.text}, ${content.buttons.primary.link}),
        (${heroId}, 'secondary', ${content.buttons.secondary.text}, ${content.buttons.secondary.link})
    `;

    console.log('Successfully initialized hero content');

  } catch (error) {
    console.error('Failed to initialize hero content:', error);
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