import type { MessageDescriptor } from "@lingui/core";

export interface ProjectSection {
  title: string | MessageDescriptor;
  description: string | MessageDescriptor;
  images: string[];
}

export interface ProjectRole {
  role: string | MessageDescriptor;
  responsibility: string | MessageDescriptor;
}

export interface Project {
  id: string;
  banner: string;
  preview: string;
  name: string;
  mainCategory: string | MessageDescriptor;
  categories: (string | MessageDescriptor)[];
  description: string | MessageDescriptor;
  url?: string;
  client: string;
  year: string;
  role: ProjectRole;
  sections: ProjectSection[];
  technologies: string[];
}
