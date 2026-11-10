import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { BriefcaseBusiness, CheckCircle2, UserRound } from "lucide-react";
import { BrandLockup } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStoredUser, roleMeta, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  ssr: false,
  beforeLoad: () => {
    const user = getStoredUser();
    if (!user) throw redirect({ to: "/" });
    return { user };
  },
  head: () => ({ meta: [
    { title: "Create Profile — SkillBridge" },
    { name: "description", content: "Complete your SkillBridge role profile." },
    { property: "og:title", content: "Create Profile — SkillBridge" },
    { property: "og:description", content: "Complete your SkillBridge role profile." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const initial = user ?? Route.useRouteContext().user;
  const navigate = useNavigate();
  const [name, setName] = useState(initial.name);
  const [organization, setOrganization] = useState(initial.organization ?? "");
  const [title, setTitle] = useState(initial.title ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [bio, setBio] = useState(initial.bio ?? "");
  const [skills, setSkills] = useState((initial.skills ?? []).join(", "));

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <BrandLockup />
        <Card className="mt-6 overflow-hidden border-border shadow-card">
          <div className="h-1.5 bg-primary" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary"><UserRound /></span>
              <div><CardTitle className="text-xl">Create your {roleMeta[initial.role].label} profile</CardTitle><p className="mt-1 text-sm text-muted-foreground">A quick profile helps the right people find and connect with you.</p></div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => {
              event.preventDefault();
               updateProfile({ name: name.trim(), organization: organization.trim(), title: title.trim(), phone: phone.trim(), bio: bio.trim(), skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean), profileComplete: true });
              navigate({ to: roleMeta[initial.role].dashboard, replace: true });
            }}>
              <Field label="Full name"><Input required value={name} onChange={(e) => setName(e.target.value)} /></Field>
              <Field label={initial.role === "institutionalist" ? "Institution name" : "College / company"}><Input required value={organization} onChange={(e) => setOrganization(e.target.value)} /></Field>
              <Field label="Role / position"><Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. CSE Student, Professor" /></Field>
              <Field label="Phone (optional)"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
               {initial.role === "student" ? <div className="sm:col-span-2"><Field label="Skills"><Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. React, Python, SQL" /></Field></div> : null}
              <div className="sm:col-span-2"><Label>Short introduction</Label><textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your focus, interests, or goals" /></div>
              <div className="sm:col-span-2 flex justify-end"><Button type="submit" className="h-11 px-6"><CheckCircle2 /> Save profile & continue</Button></div>
            </form>
          </CardContent>
        </Card>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"><BriefcaseBusiness className="h-4 w-4" /> You can update these details later.</p>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label><div className="mt-2">{children}</div></div>;
}