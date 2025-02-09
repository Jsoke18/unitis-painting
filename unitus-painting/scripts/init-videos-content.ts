import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}
const sql = neon(process.env.DATABASE_URL);

const videosContent = [
  { name: "Intro Video", videodate: "2023-01-01", url: "https://example.com/intro.mp4" },
  { name: "Tutorial", videodate: "2023-02-15", url: "https://example.com/tutorial.mp4" },
  { name: "Demo Reel", videodate: "2023-03-20", url: "https://example.com/demo.mp4" },
];

async function createVideosTable() {
  try {
    console.log("Creating videos table if it doesn't exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        videodate DATE NOT NULL,
        url TEXT NOT NULL
      )
    `;
    console.log("Videos table is ready.");
  } catch (error) {
    console.error("Error creating videos table:", error);
    throw error;
  }
}

async function initVideos() {
  try {
    // Drop the table first to ensure clean schema
    console.log("Dropping existing videos table...");
    await sql`DROP TABLE IF EXISTS videos`;
    
    // Create the table with correct schema
    await createVideosTable();
    
    console.log("Inserting new dummy video data...");
    for (const video of videosContent) {
      await sql`
        INSERT INTO videos (name, videodate, url)
        VALUES (${video.name}, ${video.videodate}::DATE, ${video.url})
      `;
      console.log(`Inserted video: ${video.name}`);
    }

    console.log("Successfully initialized videos data.");
  } catch (error) {
    console.error("Failed to initialize videos content:", error);
    process.exit(1);
  }
}

async function main() {
  await initVideos();
  process.exit(0);
}

main(); 