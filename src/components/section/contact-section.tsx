import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Icons } from "@/components/icons";
import { DATA } from "@/data/resume";

export default function ContactSection() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border px-6 py-12 text-center">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
        Get in <span className="text-brand">Touch</span>
      </h2>
      <p className="max-w-md text-muted-foreground text-balance">
        Have a project in mind or want to work together? Reach out.
      </p>
      <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={DATA.contact.social.email.url}
          className="group inline-flex items-center gap-2 rounded-full bg-brand-solid px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-solid-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Mail className="size-4" aria-hidden />
          {DATA.contact.email}
        </Link>
        <Link
          href={DATA.contact.social.GitHub.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Icons.github className="size-4" aria-hidden />
          GitHub
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
