import { db } from '@/lib/db';

export interface ClientItem {
  id: number;
  alt: string;
  src: string;
}

export interface ClientContent {
  id: number;
  heading: string;
  clients: ClientItem[];
}

export async function getClientContent(): Promise<ClientContent> {
  const result = await db.query(`
    WITH latest_content AS (
      SELECT * FROM clients_content
      ORDER BY created_at DESC
      LIMIT 1
    )
    SELECT 
      cc.*,
      (
        SELECT json_agg(
          json_build_object(
            'id', ci.id,
            'alt', ci.alt_text,
            'src', ci.image_src
          ) ORDER BY ci.display_order
        )
        FROM client_items ci
        WHERE ci.clients_content_id = cc.id
      ) as clients
    FROM latest_content cc
  `);

  if (result.rows.length === 0) {
    throw new Error('No client content found');
  }

  return result.rows[0];
}

export async function updateClientContent(content: ClientContent): Promise<ClientContent> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    const clientsResult = await client.query(`
      INSERT INTO clients_content (
        heading
      ) VALUES ($1)
      RETURNING id
    `, [content.heading]);

    const clientsId = clientsResult.rows[0].id;

    for (const [index, clientItem] of content.clients.entries()) {
      await client.query(`
        INSERT INTO client_items (
          clients_content_id,
          image_src,
          alt_text,
          display_order
        ) VALUES ($1, $2, $3, $4)
      `, [
        clientsId,
        clientItem.src,
        clientItem.alt,
        index
      ]);
    }

    await client.query('COMMIT');

    return getClientContent();
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteClient(id: number): Promise<void> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    const clientResult = await client.query(`
      SELECT clients_content_id
      FROM client_items
      WHERE id = $1
    `, [id]);

    if (clientResult.rows.length === 0) {
      throw new Error('Client not found');
    }

    const contentId = clientResult.rows[0].clients_content_id;

    await client.query(`
      DELETE FROM client_items 
      WHERE id = $1
    `, [id]);

    const remainingClients = await client.query(`
      SELECT COUNT(*)
      FROM client_items
      WHERE clients_content_id = $1
    `, [contentId]);

    if (parseInt(remainingClients.rows[0].count) === 0) {
      await client.query(`
        DELETE FROM clients_content
        WHERE id = $1
      `, [contentId]);
    } else {
      await client.query(`
        WITH numbered_items AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY display_order) - 1 as new_order
          FROM client_items
          WHERE clients_content_id = $1
        )
        UPDATE client_items
        SET display_order = numbered_items.new_order
        FROM numbered_items
        WHERE client_items.id = numbered_items.id
      `, [contentId]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function reorderClients(clientIds: number[]): Promise<void> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    for (const [index, id] of clientIds.entries()) {
      await client.query(`
        UPDATE client_items
        SET display_order = $1
        WHERE id = $2
      `, [index, id]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}