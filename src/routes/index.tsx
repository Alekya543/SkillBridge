import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Building2, GraduationCap, Users } from "lucide-react";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Card, CardContent } from "@/components/ui/card";
import { ROLES, roleMeta } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge — Academia x Industry x Innovation" },
      {
        name: "description",
        content:
          "One platform connecting students, academicians, industrialists and institutions for skills, research, internships and collaboration.",
      },
      { property: "og:title", content: "SkillBridge — Academia x Industry x Innovation" },
      {
        property: "og:description",
        content:
          "Choose your role and access skill mapping, mentorship, research collaboration and hiring in one place.",
      },
    ],
  }),
  component: Landing,
});

const icons = {
  student: GraduationCap,
  academician: Users,
  industrialist: Briefcase,
  institutionalist: Building2,
};

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-20">
        <div className="flex flex-col items-center text-center">
          <BrandMark className="h-16 w-16" />
          <BrandWordmark className="mt-4 text-4xl sm:text-5xl" />
          <p className="mt-2 text-sm font-semibold tracking-wide text-muted-foreground">
            Academia × Industry × Innovation
          </p>
          <h1 className="mt-8 text-2xl font-bold sm:text-3xl">Choose your account type</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Sign in or create an account to reach your dashboard.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {ROLES.map((role) => {
            const Icon = icons[role];
            const meta = roleMeta[role];
            return (
              <Link key={role} to="/login/$role" params={{ role }} className="group">
                <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-[var(--shadow-brand)]">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 font-display text-lg font-semibold">
                        {meta.label}
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
