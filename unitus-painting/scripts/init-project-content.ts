import { Storage } from '@google-cloud/storage';
import { neon } from '@neondatabase/serverless';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as dotenv from 'dotenv';

dotenv.config();

interface Project {
  title: string;
  description: string;
  imageSrc: string;
  category: string;
  location: string;
  completionDate: string;
}

interface ContentData {
  heading: string;
  description: string;
  projects: Project[];
}

const storage = new Storage({
  keyFilename: 'C:/Users/mucky/Documents/GitHub/unitis-painting/hidden-terrain-439216-q7-2c71aad589a1.json',
  projectId: 'hidden-terrain-439216'
});

const bucketName = 'unitis-videos';
const bucket = storage.bucket(bucketName);

// Verify bucket access and configuration
async function verifyBucketAccess() {
  try {
    console.log('Verifying bucket access and configuration...');
    
    const [exists] = await bucket.exists();
    if (!exists) {
      throw new Error(`Bucket ${bucketName} does not exist`);
    }
    
    const [metadata] = await bucket.getMetadata();
    console.log('Bucket configuration:', {
      name: metadata.name,
      iamConfiguration: metadata.iamConfiguration,
      location: metadata.location,
    });
    
    console.log('Successfully verified bucket access');
  } catch (error) {
    console.error('Bucket verification failed:', error);
    throw error;
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}
const sql = neon(process.env.DATABASE_URL);

const content = {
  "heading": "Our Project Portfolio",
  "description": "Explore our diverse range of professional painting projects across Greater Vancouver. From commercial buildings to residential properties, our work demonstrates our commitment to quality and excellence.",
  "projects": [
    {
      "title": "Coal Harbour Strata",
      "description": "Multiple projects at this 41 floor property including balcony membranes replaced.",
      "imageSrc": "/uploads/1730762997334-3784dde4ab6f5538.webp",
      "category": "Strata and Condo",
      "location": "Coal Harbour, Vancouver",
      "completionDate": "2024"
    },
    {
      "title": "London Drugs",
      "description": "Commercial painting services for London Drugs locations.",
      "imageSrc": "/uploads/1730766679462-8114f4ed3e4b0460.jpg",
      "category": "Commercial",
      "location": "Various Locations",
      "completionDate": "2024"
    },
    {
      "title": "Twin Towers near Lougheed Mall",
      "description": "Comprehensive painting project for residential towers.",
      "imageSrc": "/uploads/1730767333795-a8f7f43e38c86bfb.jpg",
      "category": "Strata and Condo",
      "location": "Burnaby",
      "completionDate": "2024"
    },
    {
      "title": "Superstore",
      "description": "Commercial painting services for Superstore locations.",
      "imageSrc": "/uploads/1730767400562-8bf34383dba9b405.jpg",
      "category": "Commercial",
      "location": "Various Locations",
      "completionDate": "2024"
    },
    {
      "title": "Storage Facilities",
      "description": "We currently serve several storage companies throughout the lower mainland. It starts with understanding the needs of every unique company. No two companies are alike, but all want the best possible results at a competitive price.",
      "imageSrc": "/uploads/1730768182618-a9a63f8f29287327.webp",
      "category": "Commercial",
      "location": "Lower Mainland",
      "completionDate": "2024"
    },
    {
      "title": "Save on Foods",
      "description": "Commercial painting services for Save on Foods locations.",
      "imageSrc": "/uploads/1730769235671-61e5a531677e0961.jpg",
      "category": "Commercial",
      "location": "Various Locations",
      "completionDate": "2024"
    },
    {
      "title": "Best Buy Richmond",
      "description": "This was a midnight and early morning project while no customers on site at BEST BUY Lansdowne. Both interior and exterior painting. Interior ceiling what changed from white to black for that \"Man Cave\" look.",
      "imageSrc": "/uploads/1730769286581-84a94810d096ce5c.webp",
      "category": "Commercial",
      "location": "Richmond",
      "completionDate": "2024"
    },
    {
      "title": "Maple Ridge Strata",
      "description": "Repairs and repainting 104 Alpine inspired townhomes. Project completed in summer of 2020.",
      "imageSrc": "/uploads/1730813907570-1d05a29d46181cc4.webp",
      "category": "Strata and Condo",
      "location": "Maple Ridge",
      "completionDate": "2020"
    },
    {
      "title": "Best Western Sands Hotel",
      "description": "Best Western Sands Hotel in downtown Vancouver. Concrete repairs and complete repainting.",
      "imageSrc": "/uploads/1730813991158-649f330be0cddfc9.webp",
      "category": "Hospitality",
      "location": "Downtown Vancouver",
      "completionDate": "2024"
    }
  ]
};
async function uploadFile(localPath: string): Promise<string> {
  try {
    // Clean up the file path
    const normalizedPath = path.normalize(localPath).replace(/^[\/\\]+/, '');
    const filename = path.basename(normalizedPath);
    const fullLocalPath = path.join(process.cwd(), 'public', normalizedPath);
    
    // Log the paths for debugging
    console.log('File paths:', {
      normalizedPath,
      filename,
      fullLocalPath
    });
    
    // Verify file exists
    try {
      await fs.access(fullLocalPath);
      console.log('Found file at:', fullLocalPath);
    } catch (error) {
      throw new Error(`File not found at path: ${fullLocalPath}`);
    }
    
    // Upload the file without any ACL settings
    const [file] = await bucket.upload(fullLocalPath, {
      destination: filename,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
      // No ACL settings since we're using uniform bucket-level access
    });
    
    // Get the public URL using the bucket's public status
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    console.log('File uploaded successfully:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading file ${localPath}:`, error);
    throw error;
  }
}

async function processAndUploadImages(): Promise<ContentData> {
  const updatedProjects: Project[] = [];
  
  for (const project of content.projects) {
    try {
      console.log(`\nProcessing image for ${project.title}...`);
      const newImageUrl = await uploadFile(project.imageSrc);
      console.log(`Successfully uploaded image for ${project.title} to ${newImageUrl}`);
      
      updatedProjects.push({
        ...project,
        imageSrc: newImageUrl
      });
    } catch (error) {
      console.error(`Failed to process image for ${project.title}:`, error);
      throw error;
    }
  }
  
  return {
    ...content,
    projects: updatedProjects
  };
}

async function insertDataToDatabase(processedContent: ContentData): Promise<void> {
  try {
    console.log('Deleting existing data...');
    await sql`DELETE FROM project_items`;
    await sql`DELETE FROM projects_content`;
    
    await sql`ALTER SEQUENCE projects_content_id_seq RESTART WITH 1`;
    await sql`ALTER SEQUENCE project_items_id_seq RESTART WITH 1`;

    console.log('Starting new data insertion...');

    const projectsResult = await sql`
      INSERT INTO projects_content (
        heading,
        description
      ) VALUES (
        ${processedContent.heading},
        ${processedContent.description}
      )
      RETURNING id
    `;

    const projectsId = projectsResult[0].id;
    console.log('Projects content inserted with ID:', projectsId);

    for (const [index, project] of processedContent.projects.entries()) {
      await sql`
        INSERT INTO project_items (
          projects_content_id,
          title,
          location,
          category,
          description,
          image_src,
          completion_date,
          display_order
        ) VALUES (
          ${projectsId},
          ${project.title},
          ${project.location},
          ${project.category},
          ${project.description},
          ${project.imageSrc},
          ${project.completionDate},
          ${index}
        )
      `;
      console.log(`Inserted project: ${project.title}`);
    }

    console.log('Successfully initialized projects content');
  } catch (error) {
    console.error('Failed to initialize projects content:', error);
    throw error;
  }
}

async function main() {
  try {
    // First verify bucket access and configuration
    await verifyBucketAccess();
    
    console.log('Starting image upload process...');
    const processedContent = await processAndUploadImages();
    
    console.log('Starting database insertion...');
    await insertDataToDatabase(processedContent);
    
    console.log('All operations completed successfully');
  } catch (error) {
    console.error('Process failed:', error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });