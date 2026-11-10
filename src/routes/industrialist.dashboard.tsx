import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Briefcase, Building2, FlaskConical, Handshake, Search, Target, UserRoundSearch } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireRole, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/industrialist/dashboard")({
  ssr: false,
  beforeLoad: () => requireRole("industrialist"),
  head: () => ({
    meta: [
      { title: "Industrialist Dashboard — SkillBridge" },
      {
        name: "description",
        content: "Post industry challenges, find academicians, manage collaborations, projects and hiring.",
      },
      { property: "og:title", content: "Industrialist Dashboard — SkillBridge" },
      { property: "og:description", content: "Your SkillBridge industry workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: IndustrialistDashboard,
});

const challenges = [
  { title: "Reduce line downtime with predictive models", posted: "6 days ago", proposals: 9 },
  { title: "Recyclable packaging for cold chain", posted: "2 weeks ago", proposals: 4 },
  { title: "Computer vision for defect detection", posted: "Today", proposals: 1 },
];

const academicians = [
  { name: "Dr. Meera Rao", area: "Applied ML & optimisation", institute: "NIT Warangal", match: 94 },
  { name: "Prof. Arjun Nair", area: "Materials & sustainability", institute: "IIT Madras", match: 88 },
  { name: "Dr. Sana Qureshi", area: "Embedded & IoT", institute: "BITS Pilani", match: 81 },
];

const requests = [
  { from: "Dr. Anil Kumar", topic: "Joint lab for robotics", status: "Awaiting your reply" },
  { from: "Meridian Institute", topic: "Capstone project sponsorship", status: "Approved" },
];

const projects = [
  { title: "Smart factory pilot", partner: "NIT Warangal", progress: 62, budget: "₹40L" },
  { title: "Battery thermal study", partner: "IIT Madras", progress: 35, budget: "₹22L" },
];

const openings = [
  { role: "Summer Intern — Data", type: "Internship", applicants: 48 },
  { role: "Graduate Engineer Trainee", type: "Job", applicants: 130 },
  { role: "R&D Associate", type: "Job", applicants: 27 },
];

function IndustrialistDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const sectionCopy: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
    dashboard: { eyebrow: "Industry workspace", title: `Welcome, ${user?.name ?? "Industrialist"}`, subtitle: "Find the right academic expertise and solve real-world challenges." },
    challenges: { eyebrow: "Industry challenges", title: "Post a Challenge", subtitle: "Share a real-world problem and invite solutions from academia." },
    find: { eyebrow: "Academic network", title: "Find Academicians", subtitle: "Discover specialists whose expertise matches your industry needs." },
    requests: { eyebrow: "Partnership inbox", title: "Collaboration Requests", subtitle: "Review and respond to new collaboration opportunities." },
    projects: { eyebrow: "Active work", title: "Projects", subtitle: "Track your ongoing academia–industry projects and delivery progress." },
    hiring: { eyebrow: "Talent pipeline", title: "Internships & Jobs", subtitle: "Manage openings and review emerging talent." },
  };
  const section = sectionCopy[tab] ?? sectionCopy["dashboard"] ?? {
    eyebrow: "Industry workspace",
    title: `Welcome, ${user?.name ?? "Industrialist"}`,
    subtitle: "Find the right academic expertise and solve real-world challenges.",
  };
  return (
    <DashboardShell
      role="industrialist"
      referenceLayout
      showSidebarIdentity
      profileLabel="My Company"
      navigation={[{ label: "Post a Challenge", value: "challenges", icon: Target },{ label: "Find Academicians", value: "find", icon: UserRoundSearch },{ label: "Collaboration Requests", value: "requests", icon: Handshake },{ label: "Projects", value: "projects", icon: FlaskConical },{ label: "Internships & Jobs", value: "hiring", icon: Briefcase }]}
      active={tab}
      onNavigate={setTab}
      title={section.title}
      subtitle={section.subtitle}
    >
      <p className="-mt-6 mb-4 text-xs font-semibold uppercase text-primary">{section.eyebrow}</p>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="sr-only">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="challenges">Industry challenges</TabsTrigger>
          <TabsTrigger value="find">Find academicians</TabsTrigger>
          <TabsTrigger value="requests">Collaboration requests</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="hiring">Internships & jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Active Challenges", value: "3", hint: "View", icon: Target, action: "challenges" },
              { label: "Collaboration Requests", value: "2", hint: "New", icon: Handshake, action: "requests" },
              { label: "Ongoing Projects", value: "2", hint: "View", icon: FlaskConical, action: "projects" },
            ].map((stat) => (
              <Card key={stat.label} className="border-border shadow-none">
                <CardContent className="flex items-start justify-between p-5">
                  <div><p className="text-sm text-muted-foreground">{stat.label}</p><p className="mt-3 text-3xl font-semibold">{stat.value}</p><Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={() => setTab(stat.action)}>{stat.hint}</Button></div>
                  <span className="rounded-md bg-accent p-2 text-primary"><stat.icon className="h-5 w-5" /></span>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="shadow-none">
            <CardHeader className="flex-row items-center justify-between gap-3"><div><CardTitle className="text-lg">Recommended Academicians</CardTitle><CardDescription>Experts matched to your active industry challenges.</CardDescription></div><Button variant="link" size="sm" onClick={() => setTab("find")}>View all →</Button></CardHeader>
            <CardContent className="space-y-1">
              {academicians.map((item) => (
                <div key={item.name} className="flex flex-wrap items-center gap-3 border-t border-border py-4">
                  <span className="rounded-md bg-accent p-2 text-primary"><UserRoundSearch className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1"><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.institute} · {item.area}</p></div>
                  <p className="text-xs text-muted-foreground">Expertise match {item.match}%</p>
                  <Button size="sm" onClick={() => toast.success(`Invitation sent to ${item.name}`)}>Connect</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-3">
          <Card className="shadow-none">
            <CardHeader className="flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" /> Posted challenges
                </CardTitle>
                <CardDescription>Problems open to academia and students.</CardDescription>
              </div>
              <Button size="sm" onClick={() => toast.success("Challenge draft created")}>
                Post challenge
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {challenges.map((item) => (
                <div key={item.title} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-4">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Posted {item.posted}</p>
                  </div>
                  <Badge variant="secondary">{item.proposals} proposals</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="find" className="grid gap-3 md:grid-cols-2">
          {academicians.map((item) => (
            <Card key={item.name} className="shadow-none">
              <CardContent className="space-y-2 p-5">
                <p className="flex items-center gap-2 font-semibold">
                  <Search className="h-4 w-4 text-primary" /> {item.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.area} · {item.institute}
                </p>
                <Progress value={item.match} />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.match}% fit</span>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Invitation sent to ${item.name}`)}>
                    Invite
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="requests" className="grid gap-3 md:grid-cols-2">
          {requests.map((item) => (
            <Card key={item.topic} className="shadow-none">
              <CardContent className="space-y-2 p-5">
                <p className="flex items-center gap-2 font-semibold">
                  <Handshake className="h-4 w-4 text-primary" /> {item.topic}
                </p>
                <p className="text-sm text-muted-foreground">From {item.from}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{item.status}</Badge>
                  <Button size="sm" onClick={() => toast.success("Request accepted")}>
                    Accept
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="projects" className="grid gap-3 md:grid-cols-2">
          {projects.map((item) => (
            <Card key={item.title} className="shadow-none">
              <CardContent className="space-y-2 p-5">
                <p className="flex items-center gap-2 font-semibold">
                  <FlaskConical className="h-4 w-4 text-primary" /> {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.partner} · {item.budget}
                </p>
                <Progress value={item.progress} />
                <p className="text-xs text-muted-foreground">{item.progress}% delivered</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="hiring" className="grid gap-3 md:grid-cols-2">
          {openings.map((item) => (
            <Card key={item.role} className="shadow-none">
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <Briefcase className="h-4 w-4 text-primary" /> {item.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.type} · {item.applicants} applicants
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success("Shortlist opened")}>
                  Review
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
