// lib/db/projects.ts
import { db } from '@/lib/db';
import { ProjectContent } from '@/app/types/projects';

export async function getProjectContent(): Promise<ProjectContent> {
  const result = await db.query(`
    WITH latest_content AS (
      SELECT * FROM projects_content
      ORDER BY created_at DESC
      LIMIT 1
    )
    SELECT 
      pc.*,
      (
        SELECT json_agg(
          json_build_object(
            'id', pi.id,
            'title', pi.title,
            'category', pi.category,
            'description', pi.description,
            'imageSrc', pi.image_src,
            'location', pi.location,
            'completionDate', pi.completion_date
          ) ORDER BY pi.display_order
        )
        FROM project_items pi
        WHERE pi.projects_content_id = pc.id
      ) as projects
    FROM latest_content pc
  `);

  if (result.rows.length === 0) {
    throw new Error('No project content found');
  }

  return result.rows[0];
}

export async function updateProjectContent(content: ProjectContent): Promise<ProjectContent> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    // Insert new content
    const projectsResult = await client.query(`
      INSERT INTO projects_content (
        heading,
        description
      ) VALUES ($1, $2)
      RETURNING id
    `, [
      content.heading,
      content.description
    ]);

    const projectsId = projectsResult.rows[0].id;

    // Insert all project items
    for (const [index, project] of content.projects.entries()) {
      await client.query(`
        INSERT INTO project_items (
          projects_content_id,
          title,
          category,
          description,
          image_src,
          location,
          completion_date,
          display_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        projectsId,
        project.title,
        project.category,
        project.description,
        project.imageSrc,
        project.location || 'Location TBA',
        project.completionDate || new Date().getFullYear().toString(),
        index
      ]);
    }

    await client.query('COMMIT');

    return getProjectContent();
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteProject(id: number): Promise<void> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    // Get the project's content ID before deletion
    const projectResult = await client.query(`
      SELECT projects_content_id
      FROM project_items
      WHERE id = $1
    `, [id]);

    if (projectResult.rows.length === 0) {
      throw new Error('Project not found');
    }

    const contentId = projectResult.rows[0].projects_content_id;

    // Delete the project
    await client.query(`
      DELETE FROM project_items 
      WHERE id = $1
    `, [id]);

    // Check if this was the last project in the content
    const remainingProjects = await client.query(`
      SELECT COUNT(*)
      FROM project_items
      WHERE projects_content_id = $1
    `, [contentId]);

    // If this was the last project, delete the content
    if (parseInt(remainingProjects.rows[0].count) === 0) {
      await client.query(`
        DELETE FROM projects_content
        WHERE id = $1
      `, [contentId]);
    } else {
      // Reorder remaining projects
      await client.query(`
        WITH numbered_items AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY display_order) - 1 as new_order
          FROM project_items
          WHERE projects_content_id = $1
        )
        UPDATE project_items
        SET display_order = numbered_items.new_order
        FROM numbered_items
        WHERE project_items.id = numbered_items.id
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

export async function reorderProjects(projectIds: number[]): Promise<void> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    // Update display order for each project
    for (const [index, id] of projectIds.entries()) {
      await client.query(`
        UPDATE project_items
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