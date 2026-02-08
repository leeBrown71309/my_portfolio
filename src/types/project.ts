export interface ProjectSection {
  title: string;
  description: string;
  images: string[];
}

export interface ProjectRole {
  role: string;
  responsibility: string;
}

export interface Project {
  id: string;
  banner: string;
  name: string;
  mainCategory: string;
  categories: string[];
  description: string;
  url?: string;
  client: string;
  year: string;
  role: ProjectRole;
  sections: ProjectSection[];
  technologies: string[];
}
