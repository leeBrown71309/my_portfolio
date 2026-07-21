import type { MessageDescriptor } from "@lingui/core";

export interface ProjectSection {
  title: MessageDescriptor;
  description: MessageDescriptor;
  images: string[];
}

export interface Project {
  id: string;
  banner: string;
  preview: string;
  name: string;
  mainCategory: MessageDescriptor;
  categories: MessageDescriptor[];
  description: MessageDescriptor;
  url: string;
  client: string;
  year: string;
  role: {
    role: MessageDescriptor;
    responsibility: MessageDescriptor;
  };
  sections: ProjectSection[];
  technologies: string[];
}
