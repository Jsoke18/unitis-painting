import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    console.log('Starting contact page tables creation...');

    // Create contact_page table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_page (
        id SERIAL PRIMARY KEY,
        page_title VARCHAR(255) NOT NULL,
        page_description TEXT NOT NULL,
        opening_hours VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create contact_info table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_info (
        id SERIAL PRIMARY KEY,
        contact_page_id INTEGER REFERENCES contact_page(id),
        info_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        po_box VARCHAR(255),
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        phone_number VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create contact_form_fields table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_form_fields (
        id SERIAL PRIMARY KEY,
        contact_page_id INTEGER REFERENCES contact_page(id),
        name VARCHAR(255) NOT NULL,
        label VARCHAR(255) NOT NULL,
        field_type VARCHAR(50) NOT NULL,
        placeholder VARCHAR(255),
        validation_required BOOLEAN DEFAULT true,
        validation_min_length INTEGER,
        validation_pattern VARCHAR(255),
        validation_error_message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Tables created successfully');

    // Insert initial contact page content
    console.log('Inserting contact page content...');
    const contactResult = await sql`
      INSERT INTO contact_page (
        page_title,
        page_description,
        opening_hours
      ) VALUES (
        'Get in Touch',
        'Have a question or ready to transform your space? We''re here to help!',
        '8:00 am - 5:00 pm'
      )
      RETURNING id
    `;

    const contactId = contactResult[0].id;

    // Insert phone contact
    await sql`
      INSERT INTO contact_info (
        contact_page_id,
        info_type,
        title,
        phone_number
      ) VALUES (
        ${contactId},
        'phone',
        'Phone',
        '604-357-4787'
      )
    `;

    // Insert head office
    await sql`
      INSERT INTO contact_info (
        contact_page_id,
        info_type,
        title,
        company_name,
        po_box,
        address_line1,
        address_line2
      ) VALUES (
        ${contactId},
        'head_office',
        'Head Office',
        'Unitus Painting Ltd.',
        'PO Box 21126',
        'Maple Ridge Square RPO',
        'Maple Ridge, BC V2X 1P7'
      )
    `;

    // Insert calgary office
    await sql`
      INSERT INTO contact_info (
        contact_page_id,
        info_type,
        title,
        company_name,
        po_box,
        address_line1,
        address_line2
      ) VALUES (
        ${contactId},
        'calgary_office',
        'Calgary Office',
        'Unitus Painting Ltd.',
        'PO Box 81041',
        'RPO Lake Bonavista',
        'Calgary, AB T2J 7C9'
      )
    `;

    // Insert form fields
    const formFields = [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'John',
        validation: {
          required: true,
          minLength: 2,
          errorMessage: 'First name must be at least 2 characters'
        }
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Doe',
        validation: {
          required: true,
          minLength: 2,
          errorMessage: 'Last name must be at least 2 characters'
        }
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'john@example.com',
        validation: {
          required: true,
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          errorMessage: 'Please enter a valid email address'
        }
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '(123) 456-7890',
        validation: {
          required: true,
          pattern: '^\\(\\d{3}\\) \\d{3}-\\d{4}$',
          errorMessage: 'Please enter a valid phone number'
        }
      },
      {
        name: 'message',
        label: 'Your Message',
        type: 'textarea',
        placeholder: 'How can we help you?',
        validation: {
          required: true,
          minLength: 10,
          errorMessage: 'Message must be at least 10 characters'
        }
      }
    ];

    for (const field of formFields) {
      await sql`
        INSERT INTO contact_form_fields (
          contact_page_id,
          name,
          label,
          field_type,
          placeholder,
          validation_required,
          validation_min_length,
          validation_pattern,
          validation_error_message
        ) VALUES (
          ${contactId},
          ${field.name},
          ${field.label},
          ${field.type},
          ${field.placeholder},
          ${field.validation.required},
          ${field.validation.minLength || null},
          ${field.validation.pattern || null},
          ${field.validation.errorMessage}
        )
      `;
    }

    console.log('Successfully initialized contact page content');
  } catch (error) {
    console.error('Failed to initialize contact page:', error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log('Contact page initialization completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Contact page initialization failed:', error);
    process.exit(1);
  });