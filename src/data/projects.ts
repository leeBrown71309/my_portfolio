import { msg } from "@lingui/macro";
import type { Project } from "../types/project";

export const projectsData: Project[] = [
  {
    id: "minimal-editorial",
    banner: "/images/projects/minimal-editorial/5.png",
    preview: "/images/projects/minimal-editorial/5.png",
    name: "Minimal Editorial",
    mainCategory: msg`Web Design`,
    categories: [msg`UX/UI Design`, msg`Frontend Development`],
    description: msg`Une plateforme de contenu minimaliste axée sur la typographie et l'expérience de lecture.`,
    url: "https://example.com",
    client: "Studio Archi",
    year: "2024",
    role: {
      role: msg`Lead Creative Developer`,
      responsibility: msg`Design du système de design et implémentation React/Framer Motion.`,
    },
    sections: [
      {
        title: msg`Le Concept`,
        description: msg`L'idée était de créer une interface qui disparaît au profit du contenu.`,
        images: [
          "/images/projects/minimal-editorial/1.png",
          "/images/projects/minimal-editorial/2.png",
          "/images/projects/minimal-editorial/3.png",
          "/images/projects/minimal-editorial/4.png",
        ],
      },
      {
        title: msg`The quiet revolution minimalist`,
        description: msg`L'idée était de créer une interface qui disparaît au profit du contenu.`,
        images: [
          "/images/projects/minimal-editorial/6.png",
          "/images/projects/minimal-editorial/banner.jpg",
        ],
      },
    ],
    technologies: ["React", "TypeScript", "Framer Motion", "Tailwind CSS"],
  },
  {
    id: "itnet-technologies",
    banner: "/images/projects/itnet-technologies/i1-6.webp",
    preview: "/images/projects/itnet-technologies/i1-1.webp",
    name: "ITNET Technologies",
    mainCategory: msg`Site web (Vitrine)`,
    categories: [msg`UX/UI Design`, msg`Frontend Development`],
    description: msg`ITNET Technologies est une entreprise spécialisée dans les solutions en cybersécurité et en cloud écologique afin d'assurer la protection des données de ses clients.`,
    url: "https://www.itnet-technologies.com/en",
    client: "ITNET Technologies",
    year: "2025",
    role: {
      role: msg`Développeur Frontend`,
      responsibility: msg`Développement et maintenance des diverse interfacesdu site web, mise en place de PostHog, Google Tag Manager et Google Analytics 4.`,
    },
    sections: [
      {
        title: msg`Le Concept`,
        description: msg`L'idée était de créer une interface qui disparaît au profit du contenu.`,
        images: [
          "/images/projects/itnet-technologies/i1-2.webp",
          "/images/projects/itnet-technologies/i1-3.webp",
        ],
      },
      {
        title: msg`Le refroidissement par immersion`,
        description: msg`ITNET Technologies est spécialisée dans la fourniture de solutions de refroidissement par immersion pour les centres de données. Cette technologie permet de réduire considérablement la consommation d'énergie et d'améliorer les performances des serveurs.`,
        images: [
          "/images/projects/itnet-technologies/i1-4.webp",
          "/images/projects/itnet-technologies/i1-5.webp",
        ],
      },
      {
        title: msg`ITNET Technologies, votre solution tout-en-un`,
        description: msg``,
        images: ["/images/projects/itnet-technologies/i1-6.webp"],
      },
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Framer Motion",
      "Tailwind CSS",
      "scss",
      "MongoDB",
      "Docker",
      "PostHog ",
      "Google Tag Manager",
      "Google Analytics 4 ",
    ],
  },
];
