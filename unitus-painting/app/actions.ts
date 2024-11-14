// app/actions.ts
"use server";

import { db, timedQuery } from '@/lib/db';

export async function getData() {
  return timedQuery(async () => {
    const result = await db.query('SELECT * FROM your_table');
    return result.rows;
  });
}

export async function createData(name: string, value: number) {
  return timedQuery(async () => {
    const result = await db.query(
      'INSERT INTO your_table (name, value) VALUES ($1, $2) RETURNING *',
      [name, value]
    );
    return result.rows[0];
  });
}

// Example of a transaction
export async function transferData(fromId: number, toId: number, amount: number) {
  return timedQuery(async () => {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      await client.query(
        'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
        [amount, fromId]
      );
      
      await client.query(
        'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
        [amount, toId]
      );
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  });
}