import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { DATA } from "@/data/resume";

export default function ContactSection() {
  return (
    <div className="contact-card relative overflow-hidden rounded-2xl border border-border p-10">
      <div className="relative flex flex-col items-center gap-5 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-500">
          Contact
        </span>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Get in <span className="text-orange-500">Touch</span>
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground text-balance">
          Have a project in mind or want to work together? Email me at{" "}
          <Link
            href={DATA.contact.social.email.url}
            className="text-foreground underline decoration-orange-500/60 underline-offset-4 hover:decoration-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            {DATA.contact.email}
          </Link>{" "}
          or check out my work on{" "}
          <Link
            href={DATA.contact.social.GitHub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-orange-500/60 underline-offset-4 hover:decoration-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            GitHub
          </Link>
          .
        </p>
        <Link
          href={DATA.contact.social.email.url}
          className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Mail className="size-4" aria-hidden />
          Say hello
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
