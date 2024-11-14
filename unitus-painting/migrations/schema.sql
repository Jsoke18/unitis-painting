-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS hero_buttons;
DROP TABLE IF EXISTS hero_content;
DROP TYPE IF EXISTS button_type;

-- Create button type enum
CREATE TYPE button_type AS ENUM ('primary', 'secondary');

-- Create hero_content table
CREATE TABLE hero_content (
  id SERIAL PRIMARY KEY,
  location_text TEXT NOT NULL,
  main_heading_line1 TEXT NOT NULL,
  main_heading_line2 TEXT NOT NULL,
  subheading TEXT NOT NULL,
  video_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create hero_buttons table
CREATE TABLE hero_buttons (
  id SERIAL PRIMARY KEY,
  hero_id INTEGER REFERENCES hero_content(id) ON DELETE CASCADE,
  button_type button_type NOT NULL,
  text TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(hero_id, button_type)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_hero_content_updated_at
    BEFORE UPDATE ON hero_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_buttons_updated_at
    BEFORE UPDATE ON hero_buttons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();