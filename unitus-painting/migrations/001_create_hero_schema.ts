const { neon } = require('@neondatabase/serverless');
const { readFileSync } = require('fs');
const { join } = require('path');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in .env file');
  process.exit(1);
}

async function runMigration() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('Starting migration...');

    // Drop existing tables
    console.log('Dropping existing tables...');
    await sql`DROP TABLE IF EXISTS hero_buttons`;
    await sql`DROP TABLE IF EXISTS hero_content`;
    await sql`DROP TYPE IF EXISTS button_type`;

    // Create enum
    console.log('Creating button_type enum...');
    await sql`CREATE TYPE button_type AS ENUM ('primary', 'secondary')`;

    // Create hero_content table
    console.log('Creating hero_content table...');
    await sql`
      CREATE TABLE hero_content (
        id SERIAL PRIMARY KEY,
        location_text TEXT NOT NULL,
        main_heading_line1 TEXT NOT NULL,
        main_heading_line2 TEXT NOT NULL,
        subheading TEXT NOT NULL,
        video_url TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create hero_buttons table
    console.log('Creating hero_buttons table...');
    await sql`
      CREATE TABLE hero_buttons (
        id SERIAL PRIMARY KEY,
        hero_id INTEGER REFERENCES hero_content(id) ON DELETE CASCADE,
        button_type button_type NOT NULL,
        text TEXT NOT NULL,
        link TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(hero_id, button_type)
      )
    `;

    // Create updated_at function
    console.log('Creating update_updated_at_column function...');
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    // Create triggers
    console.log('Creating triggers...');
    await sql`
      CREATE TRIGGER update_hero_content_updated_at
          BEFORE UPDATE ON hero_content
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`
      CREATE TRIGGER update_hero_buttons_updated_at
          BEFORE UPDATE ON hero_buttons
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
    `;

    console.log('Migration completed successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });