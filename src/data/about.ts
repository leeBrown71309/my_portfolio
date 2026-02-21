import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";

export interface SkillCategory {
  category: string | MessageDescriptor;
  items: string[];
}

export interface ExpertiseItem {
  label: string | MessageDescriptor;
  years: string | MessageDescriptor;
}

export interface AboutData {
  skills: SkillCategory[];
  expertise: ExpertiseItem[];
}

export const aboutData: AboutData = {
  skills: [
    {
      category: msg`Fondamentaux Web`,
      items: ["HTML", "CSS", "Tailwind CSS", "Bootstrap"],
    },
    {
      category: msg`Langages`,
      items: ["JavaScript", "TypeScript", "PHP", "Python", "Dart", "Java", "C"],
    },
    {
      category: msg`Frameworks`,
      items: [
        "React.js",
        "Next.js",
        "Vue.js",
        "Nuxt.js",
        "Nest.js",
        "Flutter",
        "React Native",
        "Angular",
      ],
    },
    {
      category: msg`Architecture & Données`,
      items: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Supabase", "UML"],
    },
    {
      category: msg`Outils & CMS`,
      items: ["Figma", "Git", "GitHub", "GitLab", "WordPress"],
    },
  ],
  expertise: [
    {
      label: msg`Dév Front-end`,
      years: msg`5 ans`,
    },
    {
      label: msg`Dév Back-end`,
      years: msg`2 ans`,
    },
    {
      label: msg`Dév Mobile`,
      years: msg`3 ans`,
    },
    {
      label: msg`Design UI/UX`,
      years: msg`3 ans`,
    },
  ],
};
