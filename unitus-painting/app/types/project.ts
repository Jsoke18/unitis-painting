// app/types/projects.ts
export interface Project {
    id?: number;
    title: string;
    category: string;
    description: string;
    imageSrc: string;
    location?: string;
    completionDate?: string;
  }
  
  export interface ProjectContent {
    id?: number;
    heading: string;
    description: string;
    projects: Project[];
    created_at?: Date;
  }