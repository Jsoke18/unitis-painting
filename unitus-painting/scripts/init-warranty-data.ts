import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not defined in .env file');
  throw new Error('DATABASE_URL is not defined in .env file');
}

console.log('✅ Database URL found');

const sql = neon(process.env.DATABASE_URL);

const content = {
  "hero": {
    "title": "We've Got You Covered",
    "subtitle": "Our warranty reflects our commitment to quality and customer satisfaction."
  },
  "sections": [
    {
      "title": "Two-Year Warranty",
      "icon": "Shield",
      "content": [
        "At Unitus Painting, we believe a warranty should be straightforward and easy to understand. That's why our two-year warranty covers all labor and materials.",
        "If any surface we've worked on peels or fails during this period, we'll fix it—completely hassle-free and at no additional cost to you."
      ]
    },
    {
      "title": "Our Commitment to Quality",
      "icon": "Shield",
      "content": [
        "Why can we offer this warranty with confidence? It's simple: we never cut corners.",
        "We ensure that every surface is properly prepared and use the right products for every project. This commitment to quality is the Unitus way."
      ]
    }
  ]
};

async function main() {
  console.log('🚀 Starting warranty page setup and initialization process...');
  
  try {
    // Step 1: Create tables
    console.log('\n📝 Step 1: Creating database tables...');
    
    console.log('Creating warranty_content table...');
    await sql`
      CREATE TABLE IF NOT EXISTS warranty_content (
        id SERIAL PRIMARY KEY,
        hero_title TEXT NOT NULL,
        hero_subtitle TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ warranty_content table created successfully');

    console.log('Creating warranty_sections table...');
    await sql`
      CREATE TABLE IF NOT EXISTS warranty_sections (
        id SERIAL PRIMARY KEY,
        warranty_id INTEGER REFERENCES warranty_content(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        icon TEXT NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ warranty_sections table created successfully');

    // Step 2: Clear existing data (if any)
    console.log('\n📝 Step 2: Clearing existing data...');
    await sql`DELETE FROM warranty_sections`;
    await sql`DELETE FROM warranty_content`;
    console.log('✅ Existing data cleared successfully');

    // Step 3: Insert warranty page main content
    console.log('\n📝 Step 3: Inserting main warranty content...');
    console.log('Data to insert:', {
      title: content.hero.title,
      subtitle: content.hero.subtitle
    });

    const warrantyResult = await sql`
      INSERT INTO warranty_content (
        hero_title,
        hero_subtitle
      ) VALUES (
        ${content.hero.title},
        ${content.hero.subtitle}
      )
      RETURNING id
    `;

    const warrantyId = warrantyResult[0].id;
    console.log('✅ Main warranty content inserted successfully');
    console.log(`📌 Generated warranty ID: ${warrantyId}`);

    // Step 4: Insert warranty sections
    console.log('\n📝 Step 4: Inserting warranty sections...');
    
    for (let i = 0; i < content.sections.length; i++) {
      const section = content.sections[i];
      console.log(`\nInserting section ${i + 1}/${content.sections.length}:`);
      console.log('Title:', section.title);
      console.log('Icon:', section.icon);
      console.log('Content length:', section.content.length, 'paragraphs');

      try {
        await sql`
          INSERT INTO warranty_sections (
            warranty_id,
            title,
            icon,
            content
          ) VALUES (
            ${warrantyId},
            ${section.title},
            ${section.icon},
            ${JSON.stringify(section.content)}
          )
        `;
        console.log(`✅ Section "${section.title}" inserted successfully`);
      } catch (error) {
        const e = error as Error;
        console.error(`❌ Failed to insert section "${section.title}":`, e.message);
        throw error;
      }
    }

    console.log('\n✨ All warranty sections inserted successfully');
    console.log('\n🎉 Warranty page setup and initialization completed successfully');
    
    // Log summary
    console.log('\n📊 Summary:');
    console.log('- Database tables created');
    console.log('- Existing data cleared');
    console.log(`- Main warranty content inserted with ID: ${warrantyId}`);
    console.log(`- ${content.sections.length} sections inserted`);

  } catch (error) {
    const e = error as Error;
    console.error('\n❌ Error during warranty setup and initialization:');
    console.error('Error details:', e);
    console.error('Error message:', e.message);
    if ('stack' in e) {
      console.error('Stack trace:', e.stack);
    }
    process.exit(1);
  }
}

// Execute the main function
console.log('🏁 Starting initialization script...');

main()
  .then(() => {
    console.log('\n✅ Script execution completed successfully');
    process.exit(0);
  })
  .catch((error: unknown) => {
    const e = error as Error;
    console.error('\n❌ Script execution failed:');
    console.error('Error details:', e.message);
    process.exit(1);
  });