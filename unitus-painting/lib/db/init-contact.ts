import { neon } from '@neondatabase/serverless';

export interface ContactFormField {
  name: string;
  label: string;
  fieldType: string;
  placeholder?: string;
  validation: {
    required: boolean;
    minLength?: number;
    pattern?: string;
    errorMessage: string;
  };
}

export interface ContactInfo {
  infoType: string;
  title: string;
  companyName?: string;
  poBox?: string;
  addressLine1?: string;
  addressLine2?: string;
  phoneNumber?: string;
}

export interface ContactPageContent {
  pageTitle: string;
  pageDescription: string;
  openingHours: string;
  contactInfo: ContactInfo[];
  formFields: ContactFormField[];
}

export async function getContactContent(): Promise<ContactPageContent> {
  const sql = neon(process.env.DATABASE_URL!);

  const result = await sql`
    WITH contact_data AS (
      SELECT 
        cp.*,
        json_agg(
          json_build_object(
            'infoType', ci.info_type,
            'title', ci.title,
            'companyName', ci.company_name,
            'poBox', ci.po_box,
            'addressLine1', ci.address_line1,
            'addressLine2', ci.address_line2,
            'phoneNumber', ci.phone_number
          )
        ) as contact_info,
        json_agg(
          json_build_object(
            'name', cf.name,
            'label', cf.label,
            'fieldType', cf.field_type,
            'placeholder', cf.placeholder,
            'validation', json_build_object(
              'required', cf.validation_required,
              'minLength', cf.validation_min_length,
              'pattern', cf.validation_pattern,
              'errorMessage', cf.validation_error_message
            )
          )
        ) as form_fields
      FROM contact_page cp
      LEFT JOIN contact_info ci ON ci.contact_page_id = cp.id
      LEFT JOIN contact_form_fields cf ON cf.contact_page_id = cp.id
      GROUP BY cp.id
      ORDER BY cp.created_at DESC
      LIMIT 1
    )
    SELECT 
      page_title as "pageTitle",
      page_description as "pageDescription",
      opening_hours as "openingHours",
      contact_info as "contactInfo",
      form_fields as "formFields"
    FROM contact_data
  `;

  if (result.length === 0) {
    throw new Error('No contact page content found');
  }

  return result[0];
}

export async function updateContactContent(content: ContactPageContent): Promise<ContactPageContent> {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    // First create the contact page
    const contactPageResult = await sql`
      INSERT INTO contact_page (
        page_title,
        page_description,
        opening_hours
      ) VALUES (
        ${content.pageTitle},
        ${content.pageDescription},
        ${content.openingHours}
      )
      RETURNING id
    `;

    const contactPageId = contactPageResult[0].id;

    // Insert contact info entries one by one to ensure proper handling of fields
    for (const info of content.contactInfo) {
      await sql`
        INSERT INTO contact_info (
          contact_page_id,
          info_type,
          title,
          company_name,
          po_box,
          address_line1,
          address_line2,
          phone_number
        ) VALUES (
          ${contactPageId},
          ${info.infoType},
          ${info.title},
          ${info.companyName || null},
          ${info.poBox || null},
          ${info.addressLine1 || null},
          ${info.addressLine2 || null},
          ${info.phoneNumber || null}
        )
      `;
    }

    // Insert form fields if any exist
    if (content.formFields && content.formFields.length > 0) {
      for (const field of content.formFields) {
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
            ${contactPageId},
            ${field.name},
            ${field.label},
            ${field.fieldType},
            ${field.placeholder || null},
            ${field.validation.required},
            ${field.validation.minLength || null},
            ${field.validation.pattern || null},
            ${field.validation.errorMessage}
          )
        `;
      }
    }

    // Return the newly created content
    return getContactContent();
  } catch (error) {
    console.error('Error updating contact content:', error);
    throw error;
  }
}