// scripts/init-auth.ts
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as argon2 from 'argon2';

dotenv.config();

const DEFAULT_ADMIN = {
  email: 'admin@unitus.com',
  password: 'admin123',
};

async function initAuth() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env file');
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Creating admin authentication...');

    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
      )
    `;

    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE email = ${DEFAULT_ADMIN.email}
    `;

    if (existingAdmin.length === 0) {
      console.log('Creating default admin user...');
      const hashedPassword = await argon2.hash(DEFAULT_ADMIN.password);
      
      await sql`
        INSERT INTO admin_users (email, password_hash)
        VALUES (${DEFAULT_ADMIN.email}, ${hashedPassword})
      `;

      console.log('\nAdmin user created successfully!');
      console.log('Email:', DEFAULT_ADMIN.email);
      console.log('Password:', DEFAULT_ADMIN.password);
      console.log('\nIMPORTANT: Please change these credentials after first login!');
    } else {
      console.log('Admin user already exists, skipping creation.');
    }

  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
}

initAuth()
  .then(() => {
    console.log('Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });