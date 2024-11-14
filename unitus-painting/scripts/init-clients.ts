import { Storage } from '@google-cloud/storage';
import { neon } from '@neondatabase/serverless';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as dotenv from 'dotenv';

dotenv.config();

interface Client {
  src: string;
  alt: string;
}

interface ClientsData {
  heading: string;
  clients: Client[];
}

const storage = new Storage({
  keyFilename: 'C:/Users/mucky/Documents/GitHub/unitis-painting/hidden-terrain-439216-q7-2c71aad589a1.json',  // Update this path
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

const content: ClientsData = {
  "heading": "Notable Clients",
  "clients": [
    {
        "src": "https://cdn.builder.io/api/v1/image/assets/TEMP/0057f7c4d4561963734f5078a3464f4d4f0af798c40d4a924a58b830b4ccfe9d?apiKey=a05a9fe5da54475091abff9f564d40f8&",
        "alt": "Staples"
      },
      {
        "src": "https://cdn.builder.io/api/v1/image/assets/TEMP/23e45d0ae41deb68f3a4886e27af289f43b8a92d7f244d0372457c1157ff9ca2?apiKey=a05a9fe5da54475091abff9f564d40f8&",
        "alt": "Best Buy"
      },
      {
        "src": "https://cdn.builder.io/api/v1/image/assets/TEMP/7aa19ae66818b5dc74ed754a7bd4356c6e3d9a4131664e24b27c51154ef7e8cb?apiKey=a05a9fe5da54475091abff9f564d40f8&",
        "alt": "Shoppers Drug Mart"
      },
      {
        "src": "https://cdn.builder.io/api/v1/image/assets/TEMP/a8c6de74e7315654a3462be197bf2fe564cdb8aee213d0ce07eb6d99341b9d59?apiKey=a05a9fe5da54475091abff9f564d40f8&",
        "alt": "Real Canadian Superstore"
      },
      {
        "src": "https://cdn.builder.io/api/v1/image/assets/TEMP/a3319b354ea81da0086bfd6959b6a3a8ddca4939377fa04e0b036aad4d56216e?apiKey=a05a9fe5da54475091abff9f564d40f8&",
        "alt": "Save On Foods"
      },
      {
        "src": "https://cdn.builder.io/api/v1/image/assets/TEMP/a31d639dda1fcd12e87def942d33b49296f0a7062659d83adc2280b32f839258?apiKey=a05a9fe5da54475091abff9f564d40f8&",
        "alt": "Costco"
      },
      {
        "src": "/photos/bentallgreenoak-logo-vector.png",
        "alt": "BentallGreenOak"
      },
      {
        "src": "/photos/U-Haul_logo.svg.png",
        "alt": "U-Haul"
      },
      {
        "src": "/photos/8c06fe178644610f128fd0f4fe9bfee6.png",
        "alt": "Client Logo"
      },
      {
        "src": "/photos/991f54639ff69806a441ffc039296a53.webp",
        "alt": "Client Logo"
      },
      {
        "src": "/photos/Four-Seasons-Logo.png",
        "alt": "Four Seasons"
      },
      {
        "src": "/photos/home-depot.png",
        "alt": "Home Depot"
      },
      {
        "src": "/photos/Honda-logo-1920x1080.webp",
        "alt": "Honda"
      },
      {
        "src": "/photos/Houle_Electric.jpg",
        "alt": "Houle Electric"
      },
      {
        "src": "/photos/icbc.png",
        "alt": "ICBC"
      },
      {
        "src": "/photos/images (1).png",
        "alt": "Client Logo"
      },
      {
        "src": "/photos/images.jpg",
        "alt": "Client Logo"
      },
      {
        "src": "/photos/images.png",
        "alt": "Client Logo"
      },
      {
        "src": "/photos/loblaws.png",
        "alt": "Loblaws"
      },
      {
        "src": "/photos/Public_Storage_Logo.svg.png",
        "alt": "Public Storage"
      },
      {
        "src": "/photos/Rancho-Management.png",
        "alt": "Rancho Management"
      }
  ]
};

async function uploadFile(localPath: string): Promise<string> {
  try {
    // Handle already uploaded files (URLs)
    if (localPath.startsWith('http')) {
      return localPath;
    }

    // Clean up the file path
    const normalizedPath = path.normalize(localPath).replace(/^[\/\\]+/, '');
    const filename = path.basename(normalizedPath);
    const fullLocalPath = path.join(process.cwd(), 'public', normalizedPath);
    
    console.log('File paths:', {
      normalizedPath,
      filename,
      fullLocalPath
    });
    
    try {
      await fs.access(fullLocalPath);
      console.log('Found file at:', fullLocalPath);
    } catch (error) {
      throw new Error(`File not found at path: ${fullLocalPath}`);
    }
    
    const [file] = await bucket.upload(fullLocalPath, {
      destination: filename,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
    
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    console.log('File uploaded successfully:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading file ${localPath}:`, error);
    throw error;
  }
}

async function processAndUploadImages(): Promise<ClientsData> {
  const updatedClients: Client[] = [];
  
  for (const client of content.clients) {
    try {
      console.log(`\nProcessing image for ${client.alt}...`);
      const newImageUrl = await uploadFile(client.src);
      console.log(`Successfully uploaded image for ${client.alt} to ${newImageUrl}`);
      
      updatedClients.push({
        ...client,
        src: newImageUrl
      });
    } catch (error) {
      console.error(`Failed to process image for ${client.alt}:`, error);
      throw error;
    }
  }
  
  return {
    ...content,
    clients: updatedClients
  };
}

async function createTablesIfNotExist(): Promise<void> {
  try {
    // Create clients_content table
    await sql`
      CREATE TABLE IF NOT EXISTS clients_content (
        id SERIAL PRIMARY KEY,
        heading TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create client_items table
    await sql`
      CREATE TABLE IF NOT EXISTS client_items (
        id SERIAL PRIMARY KEY,
        clients_content_id INTEGER REFERENCES clients_content(id),
        image_src TEXT NOT NULL,
        alt_text TEXT NOT NULL,
        display_order INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Failed to create tables:', error);
    throw error;
  }
}

async function insertDataToDatabase(processedContent: ClientsData): Promise<void> {
  try {
    console.log('Deleting existing data...');
    await sql`DELETE FROM client_items`;
    await sql`DELETE FROM clients_content`;
    
    await sql`ALTER SEQUENCE clients_content_id_seq RESTART WITH 1`;
    await sql`ALTER SEQUENCE client_items_id_seq RESTART WITH 1`;

    console.log('Starting new data insertion...');

    const clientsResult = await sql`
      INSERT INTO clients_content (
        heading
      ) VALUES (
        ${processedContent.heading}
      )
      RETURNING id
    `;

    const clientsId = clientsResult[0].id;
    console.log('Clients content inserted with ID:', clientsId);

    for (const [index, client] of processedContent.clients.entries()) {
      await sql`
        INSERT INTO client_items (
          clients_content_id,
          image_src,
          alt_text,
          display_order
        ) VALUES (
          ${clientsId},
          ${client.src},
          ${client.alt},
          ${index}
        )
      `;
      console.log(`Inserted client: ${client.alt}`);
    }

    console.log('Successfully initialized clients content');
  } catch (error) {
    console.error('Failed to initialize clients content:', error);
    throw error;
  }
}

async function main() {
  try {
    await verifyBucketAccess();
    
    console.log('Creating tables if they don\'t exist...');
    await createTablesIfNotExist();
    
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