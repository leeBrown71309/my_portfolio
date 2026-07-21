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
      category: msg`Web Foundation`,
      items: ["HTML", "CSS", "Tailwind CSS", "Bootstrap"],
    },
    {
      category: msg`Languages`,
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
      category: msg`Architecture & Data`,
      items: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Supabase", "UML"],
    },
    {
      category: msg`Tools & CMS`,
      items: ["Figma", "Git", "GitHub", "GitLab", "WordPress"],
    },
  ],
  expertise: [
    {
      label: msg`Front-end Dev`,
      years: msg`5 years`,
    },
    {
      label: msg`Back-end Dev`,
      years: msg`2 years`,
    },
    {
      label: msg`Mobile Dev`,
      years: msg`3 years`,
    },
    {
      label: msg`UI/UX Design`,
      years: msg`3 years`,
    },
  ],
};

export const socials = [
  { label: "LinkedIn", url: "https://linkedin.com/in/leemakosso" },
  { label: "GitHub", url: "https://github.com/leeeight" },
  { label: "Instagram", url: "https://instagram.com/leeeight" },
  { label: "Dribbble", url: "https://dribbble.com/lee-eight" },
];

export const EMAIL = "leeeight71@gmail.com";
export const CONTACT_EMAIL = "hello@leeeight.com";
