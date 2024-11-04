// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

interface ProjectImage {
  url: string;
  alt?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

const projectsPath = path.join(process.cwd(), 'public/data/projects.json');

async function saveProjects(projects: Project[]) {
  await writeFile(projectsPath, JSON.stringify({ projects }, null, 2));
}

export async function GET() {
  try {
    const fileContent = await readFile(projectsPath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { projects } = await req.json();
    await saveProjects(projects);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save projects' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { project } = await req.json();
    const fileContent = await readFile(projectsPath, 'utf-8');
    const data = JSON.parse(fileContent);
    const projects = data.projects || [];
    
    const index = projects.findIndex((p: Project) => p.id === project.id);
    if (index !== -1) {
      projects[index] = {
        ...project,
        updatedAt: new Date().toISOString()
      };
      await saveProjects(projects);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const fileContent = await readFile(projectsPath, 'utf-8');
    const data = JSON.parse(fileContent);
    const projects = data.projects || [];
    
    const filteredProjects = projects.filter((p: Project) => p.id !== parseInt(id));
    await saveProjects(filteredProjects);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}