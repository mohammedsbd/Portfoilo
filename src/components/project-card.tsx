"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import { DitherGlow } from "@/components/dither-glow";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  links,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "group relative flex flex-col sm:flex-row border border-border rounded-xl overflow-hidden hover:ring-2 hover:ring-muted transition-all duration-200",
        className
      )}
    >
      <DitherGlow
        seed={[...title].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)}
        className="h-36 w-full shrink-0 border-b border-border sm:h-auto sm:w-52 sm:border-b-0 sm:border-r"
      />
      <div className="p-5 flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">
              <Link
                href={href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0 focus-visible:outline-none"
              >
                {title}
              </Link>
            </h3>
            {dates && <time className="text-xs text-muted-foreground">{dates}</time>}
          </div>
          <div className="relative z-10 flex shrink-0 items-center gap-2">
            {links?.map((link, idx) => (
              <Link
                href={link.href}
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge
                  className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  variant="default"
                >
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
            <ArrowUpRight
              className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden
            />
          </div>
        </div>
        <div className="text-xs prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="text-[11px] font-medium border border-border h-6 w-fit px-2"
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
