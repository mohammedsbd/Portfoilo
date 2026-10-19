import { ArrowUpRight, FileText } from "lucide-react";

export function ResumeButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="resume-btn group w-fit"
    >
      <span className="resume-btn-inner">
        <FileText className="size-4 transition-transform duration-300 group-hover:-rotate-6" aria-hidden />
        View my résumé
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </span>
    </a>
  );
}
