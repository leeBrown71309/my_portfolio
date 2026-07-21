import { createFileRoute, Link } from "@tanstack/react-router";
import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projectsData } from "../data/projects";
import { Reveal } from "../components/Reveal";
import { FooterCta } from "../components/FooterCta";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [{ title: "Case — LEEEIGHT." }],
  }),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const { i18n } = useLingui();

  const index = projectsData.findIndex((p) => p.id === projectId);
  const project = projectsData[index];

  if (!project) {
    return (
      <section className="flex min-h-[60dvh] flex-col items-start justify-center gap-6 px-4 md:px-8">
        <span className="meta text-accent">404 — Case</span>
        <h1 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-black uppercase leading-[0.85]">
          <Trans>Case not found</Trans>
        </h1>
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="u-link">
            <Trans>Back to the index</Trans>
          </span>
        </Link>
      </section>
    );
  }

  const next = projectsData[(index + 1) % projectsData.length];
  let figureCount = 0;

  return (
    <>
      {/* ——— Case header ——— */}
      <section className="px-4 pt-14 md:px-8 md:pt-24">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="u-link">
              <Trans>Index</Trans>
            </span>
          </Link>
          <span className="meta text-muted">
            Case {String(index + 1).padStart(2, "0")} /{" "}
            {String(projectsData.length).padStart(2, "0")}
          </span>
        </div>

        <Reveal>
          <h1 className="font-display text-[clamp(2.8rem,10vw,9.5rem)] font-black uppercase leading-[0.85] tracking-tight">
            {project.name}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl font-serif text-[clamp(1.15rem,2vw,1.6rem)] italic leading-snug text-ink-soft">
            {i18n._(project.description)}
          </p>
        </Reveal>
      </section>

      {/* ——— Banner ——— */}
      <Reveal className="mt-10 px-4 md:mt-14 md:px-8" y={40}>
        <figure>
          <div className="overflow-hidden border border-line">
            <img
              src={project.banner}
              alt={`${project.name} — banner`}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
          <figcaption className="meta mt-2 flex justify-between text-muted">
            <span>{project.name}</span>
            <span>Fig. {String(++figureCount).padStart(2, "0")}</span>
          </figcaption>
        </figure>
      </Reveal>

      {/* ——— Meta table ——— */}
      <section className="mt-14 grid grid-cols-2 border-y border-line md:mt-20 md:grid-cols-4">
        {[
          {
            label: <Trans>Client</Trans>,
            value: project.client,
          },
          {
            label: <Trans>Year</Trans>,
            value: project.year,
          },
          {
            label: <Trans>Role</Trans>,
            value: i18n._(project.role.role),
          },
          {
            label: <Trans>Category</Trans>,
            value: i18n._(project.mainCategory),
          },
        ].map((cell, i) => (
          <div
            key={i}
            className="border-line px-4 py-5 odd:border-r md:border-r md:px-8 md:py-7 md:last:border-r-0"
          >
            <span className="meta text-muted">{cell.label}</span>
            <p className="mt-2 font-display text-sm font-bold uppercase tracking-wide md:text-base">
              {cell.value}
            </p>
          </div>
        ))}
      </section>

      {/* ——— Responsibility + link ——— */}
      <section className="grid gap-8 px-4 py-14 md:grid-cols-12 md:px-8 md:py-20">
        <div className="md:col-span-4">
          <span className="meta text-muted">
            <Trans>Role &amp; responsibility</Trans>
          </span>
        </div>
        <div className="md:col-span-8">
          <Reveal>
            <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft">
              {i18n._(project.role.responsibility)}
            </p>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex items-center gap-2 border border-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              <Trans>Visit website</Trans>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ——— Case sections ——— */}
      {project.sections.map((section, si) => (
        <section
          key={si}
          className="grid gap-8 border-t border-line px-4 py-14 md:grid-cols-12 md:px-8 md:py-20"
        >
          <div className="md:col-span-4">
            <div className="md:sticky md:top-24">
              <span className="meta text-accent">
                {String(si + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 font-display text-[clamp(1.6rem,3.5vw,2.75rem)] font-black uppercase leading-[0.95] tracking-tight">
                {i18n._(section.title)}
              </h2>
              {i18n._(section.description) ? (
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                  {i18n._(section.description)}
                </p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-6 md:col-span-8">
            {section.images.map((image, ii) => (
              <Reveal key={ii} delay={ii * 0.06} y={40}>
                <figure>
                  <div className="overflow-hidden border border-line">
                    <img
                      src={image}
                      alt={`${project.name} — ${i18n._(section.title)}`}
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="meta mt-2 text-right text-muted">
                    Fig. {String(++figureCount).padStart(2, "0")}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      {/* ——— Stack ——— */}
      <section className="border-t border-line px-4 py-14 md:px-8 md:py-20">
        <span className="meta text-muted">
          <Trans>Technologies</Trans>
        </span>
        <p className="mt-5 font-display text-[clamp(1.2rem,2.6vw,2rem)] font-bold uppercase leading-snug tracking-tight">
          {project.technologies.map((tech, i) => (
            <span key={tech}>
              {i > 0 && <span className="mx-2 text-accent">·</span>}
              {tech}
            </span>
          ))}
        </p>
      </section>

      {/* ——— Next case ——— */}
      <Link
        to="/projects/$projectId"
        params={{ projectId: next.id }}
        className="group block border-t border-line px-4 py-14 md:px-8 md:py-20"
      >
        <span className="meta text-muted">
          <Trans>Next case</Trans>
        </span>
        <div className="mt-4 flex items-start justify-between gap-4">
          <span className="font-display text-[clamp(2.4rem,8vw,7.5rem)] font-black uppercase leading-[0.85] tracking-tight transition-colors duration-500 group-hover:text-accent">
            {next.name}
          </span>
          <ArrowUpRight
            className="mt-2 h-[7vw] w-[7vw] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:text-accent md:h-[4vw] md:w-[4vw]"
            strokeWidth={1}
          />
        </div>
      </Link>

      <FooterCta />
    </>
  );
}
