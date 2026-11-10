import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Award, BookOpen, Briefcase, Building2, GraduationCap, Plus, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireRole, useAuth } from "@/lib/auth";
import { generateSkillPlan } from "@/lib/skill-ai.functions";
import { buildAssessment, buildRoadmap, type Assessment, type Roadmap } from "@/lib/skill-engine";

export const Route = createFileRoute("/student/dashboard")({
  ssr: false,
  beforeLoad: () => requireRole("student"),
  head: () => ({
    meta: [
      { title: "Student Dashboard — SkillBridge" },
      {
        name: "description",
        content: "Skill mapping, AI roadmaps, tutors, internships and placements for students.",
      },
      { property: "og:title", content: "Student Dashboard — SkillBridge" },
      { property: "og:description", content: "Your SkillBridge student workspace." },
    ],
  }),
  component: StudentDashboard,
});

const tutors = [
  { name: "Dr. Meera Rao", subject: "Data Structures & Algorithms", rating: "4.9", slots: "3 slots this week" },
  { name: "Prof. Arjun Nair", subject: "Machine Learning", rating: "4.8", slots: "2 slots this week" },
  { name: "Dr. Sana Qureshi", subject: "Embedded Systems", rating: "4.7", slots: "5 slots this week" },
];

const internships = [
  { role: "Frontend Intern", company: "Nimbus Tech", mode: "Remote", stipend: "₹25,000/mo", match: 92 },
  { role: "Data Science Intern", company: "Corelytics", mode: "Hybrid · Bengaluru", stipend: "₹30,000/mo", match: 85 },
  { role: "IoT Research Intern", company: "VoltEdge Labs", mode: "On-site · Hyderabad", stipend: "₹20,000/mo", match: 74 },
];

const placements = [
  { role: "Software Engineer", company: "Arclight Systems", ctc: "₹12 LPA", stage: "Interview scheduled" },
  { role: "Product Analyst", company: "Meridian Retail", ctc: "₹9 LPA", stage: "Application under review" },
  { role: "Cloud Engineer", company: "Skyforge Cloud", ctc: "₹14 LPA", stage: "Open · apply by Friday" },
];

function StudentDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [skills, setSkills] = useState<string[]>(user?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [mappingRole, setMappingRole] = useState("");
  const [mapping, setMapping] = useState<{ summary: string; groups: { priority: string; skills: { name: string; reason: string }[] }[] } | null>(null);
  const [mappingBusy, setMappingBusy] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [roleInput, setRoleInput] = useState("");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const runSkillPlan = useServerFn(generateSkillPlan);

  const sectionCopy: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: `Hello${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`, subtitle: "Here is your placement readiness at a glance." },
    skills: { title: "Skill mapping", subtitle: "Enter a target role and AI will compare it with the skills on your profile." },
    tutors: { title: "Academic tutors", subtitle: "Connect with subject experts and strengthen your foundations." },
    internships: { title: "Internships", subtitle: "Explore practical opportunities matched to your skills." },
    placements: { title: "Placements", subtitle: "Track suitable roles and your active applications." },
  };
  const section = sectionCopy[tab] ?? sectionCopy["dashboard"] ?? { title: "Hello", subtitle: "Here is your placement readiness at a glance." };

  async function mapSkills() {
    if (!mappingRole.trim()) {
      toast.error("Enter a target role first");
      return;
    }
    setMappingBusy(true);
    try {
      const result = await runSkillPlan({ data: { kind: "mapping", targetRole: mappingRole.trim(), currentSkills: skills } });
      if ("groups" in result) setMapping(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not map skills. Please try again.");
    } finally {
      setMappingBusy(false);
    }
  }

  function addSkill() {
    const value = skillInput.trim();
    if (!value) return;
    if (skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      toast.info(`${value} is already mapped`);
      return;
    }
    setSkills([...skills, value]);
    setSkillInput("");
    toast.success(`${value} added to your skill map`);
  }

  function startAssessment(skill: string) {
    setAssessment(buildAssessment(skill));
    setAnswers({});
    setScore(null);
  }

  function submitAssessment() {
    if (!assessment) return;
    const correct = assessment.questions.filter((q, i) => answers[i] === q.answerIndex).length;
    const pct = Math.round((correct / assessment.questions.length) * 100);
    setScore(pct);
    toast.success(`${assessment.skill} assessment scored ${pct}%`);
  }

  return (
    <DashboardShell
      role="student"
      referenceLayout
      navigation={[{ label: "Skill mapping", value: "skills", icon: Sparkles },{ label: "Academic tutors", value: "tutors", icon: GraduationCap },{ label: "Internships", value: "internships", icon: Briefcase },{ label: "Placements", value: "placements", icon: Building2 }]}
      active={tab}
      onNavigate={setTab}
      title={section.title}
      subtitle={section.subtitle}
    >
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="sr-only">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="skills">Skill mapping</TabsTrigger>
          <TabsTrigger value="tutors">Academic tutors</TabsTrigger>
          <TabsTrigger value="internships">Internships</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {!user?.profileComplete ? (
            <Card className="border-0 shadow-card">
              <CardContent className="p-6 sm:p-8">
                <p className="text-lg font-semibold">Finish your profile first</p>
                <p className="mt-1 text-muted-foreground">Add your college, skills and a short about section so matches become accurate.</p>
                <Button asChild variant="link" className="mt-2 h-auto px-0 text-sm uppercase"><Link to="/profile">Create profile →</Link></Button>
              </CardContent>
            </Card>
          ) : null}
          {([
            ["Skills in profile", skills.length ? `${skills.length} mapped` : "None yet", "skills"],
            ["Internships open", String(internships.length), "internships"],
            ["Placement drives", String(placements.length), "placements"],
            ["Academic tutors", String(tutors.length), "tutors"],
          ] satisfies [string, string, string][]).map(([label, value, target]) => (
            <Button key={label} variant="ghost" onClick={() => setTab(target)} className="h-auto w-full justify-between rounded-md border border-border bg-card px-5 py-6 text-left shadow-card hover:bg-accent">
              <span className="text-base font-normal text-muted-foreground">{label}</span><span className="font-semibold text-foreground">{value}</span>
            </Button>
          ))}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card className="border-0 shadow-card">
            <CardHeader><CardTitle className="text-lg">Skill mapping by AI</CardTitle><CardDescription>Discover the skills needed for your target role.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <label className="block text-sm font-semibold">Target role<Input className="mt-2 h-12" value={mappingRole} placeholder="e.g. Data Analyst" onChange={(e) => setMappingRole(e.target.value)} /></label>
              <p className="text-sm text-muted-foreground">Your skills: {skills.length ? skills.join(", ") : <>none yet — <Link to="/profile" className="text-primary underline">add them</Link></>}</p>
              <Button className="h-11 rounded-full px-6" onClick={mapSkills} disabled={mappingBusy}>{mappingBusy ? "Mapping…" : "Map my skills"}</Button>
              {mapping ? <div className="space-y-3 border-t border-border pt-4"><p className="text-sm text-muted-foreground">{mapping.summary}</p>{mapping.groups.map((group) => <div key={group.priority}><p className="font-semibold">{group.priority}</p><div className="mt-2 flex flex-wrap gap-2">{group.skills.map((skill) => <Badge key={skill.name} variant="secondary" title={skill.reason}>{skill.name}</Badge>)}</div></div>)}</div> : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-primary" /> Skill assessment
              </CardTitle>
              <CardDescription>Choose a skill from your profile and take a quick assessment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  placeholder="e.g. SQL, Figma, Node.js"
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button key={skill} onClick={() => startAssessment(skill)} className="group">
                    <Badge variant="secondary" className="cursor-pointer px-3 py-1.5 text-sm group-hover:bg-accent group-hover:text-accent-foreground">
                      {skill} · assess
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {assessment ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{assessment.skill} assessment</CardTitle>
                <CardDescription>Answer all questions to get your proficiency score.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {assessment.questions.map((q, qi) => (
                  <div key={qi}>
                    <p className="text-sm font-semibold">
                      {qi + 1}. {q.prompt}
                    </p>
                    <div className="mt-2 grid gap-2">
                      {q.options.map((option, oi) => (
                        <button
                          key={oi}
                          onClick={() => setAnswers({ ...answers, [qi]: oi })}
                          className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                            answers[qi] === oi
                              ? "border-primary bg-accent text-accent-foreground"
                              : "border-border hover:bg-muted"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <Button onClick={submitAssessment}>Submit assessment</Button>
                  {score !== null ? (
                    <span className="text-sm font-semibold text-primary">Score: {score}%</span>
                  ) : null}
                </div>
                {score !== null ? <Progress value={score} /> : null}
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" /> AI roadmap
              </CardTitle>
              <CardDescription>Enter a target role to generate a learning roadmap.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={roleInput}
                  placeholder="e.g. Data Analyst, Full Stack Developer"
                  onChange={(e) => setRoleInput(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (!roleInput.trim()) {
                      toast.error("Enter a target role first");
                      return;
                    }
                    setRoadmap(buildRoadmap(roleInput.trim(), skills));
                    toast.success("Roadmap generated");
                  }}
                >
                  Generate
                </Button>
              </div>
              {roadmap ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{roadmap.summary}</p>
                  {roadmap.phases.map((phase) => (
                    <div key={phase.title} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{phase.title}</p>
                        <Badge variant="outline">{phase.duration}</Badge>
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {phase.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutors" className="grid gap-3 md:grid-cols-2">
          {tutors.map((tutor) => (
            <Card key={tutor.name}>
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <BookOpen className="h-4 w-4 text-primary" /> {tutor.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{tutor.subject}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ★ {tutor.rating} · {tutor.slots}
                  </p>
                </div>
                <Button size="sm" onClick={() => toast.success(`Session requested with ${tutor.name}`)}>
                  Book
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="internships" className="grid gap-3 md:grid-cols-2">
          {internships.map((item) => (
            <Card key={item.role}>
              <CardContent className="space-y-2 p-5">
                <p className="flex items-center gap-2 font-semibold">
                  <Briefcase className="h-4 w-4 text-primary" /> {item.role}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.company} · {item.mode}
                </p>
                <p className="text-sm font-medium">{item.stipend}</p>
                <Progress value={item.match} />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.match}% skill match</span>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Applied to ${item.role}`)}>
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="placements" className="grid gap-3 md:grid-cols-2">
          {placements.map((item) => (
            <Card key={item.role}>
              <CardContent className="space-y-2 p-5">
                <p className="flex items-center gap-2 font-semibold">
                  <GraduationCap className="h-4 w-4 text-primary" /> {item.role}
                </p>
                <p className="text-sm text-muted-foreground">{item.company}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{item.ctc}</Badge>
                  <span className="text-xs text-muted-foreground">{item.stage}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
              <CardDescription>Details shared with tutors and recruiters.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Info label="Name" value={user?.name ?? "-"} />
              <Info label="Email" value={user?.email ?? "-"} />
              <Info label="Account type" value="Student" />
              <Info label="Institution" value={user?.organization ?? "Not added yet"} />
              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
