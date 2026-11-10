import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { BookMarked, BriefcaseBusiness, Building2, HandshakeIcon, Lightbulb, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireRole, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/academician/dashboard")({
  ssr: false,
  beforeLoad: () => requireRole("academician"),
  head: () => ({
    meta: [
      { title: "Academician Dashboard — SkillBridge" },
      {
        name: "description",
        content: "Research projects, industry connections, collaborations, mentorship and opportunities.",
      },
      { property: "og:title", content: "Academician Dashboard — SkillBridge" },
      { property: "og:description", content: "Your SkillBridge academic workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AcademicianDashboard,
});

const research = [
  { title: "Edge AI for precision agriculture", stage: "Data collection", funding: "₹18L grant", progress: 45 },
  { title: "Low-cost water quality sensing", stage: "Prototype", funding: "Industry sponsored", progress: 70 },
  { title: "Explainable models for diagnostics", stage: "Paper draft", funding: "Seeking partner", progress: 25 },
];

const connections = [
  { company: "VoltEdge Labs", focus: "Embedded systems", status: "Active MoU" },
  { company: "Corelytics", focus: "Applied data science", status: "In discussion" },
  { company: "Skyforge Cloud", focus: "Cloud research lab", status: "Intro requested" },
];

const collaborations = [
  { title: "Joint paper on federated learning", partner: "Dr. Anil Kumar, IIT-H", due: "Abstract due in 12 days" },
  { title: "Industry capstone track", partner: "Nimbus Tech", due: "Kickoff next month" },
];

const mentees = [
  { name: "Riya Sharma", topic: "ML research track", progress: 80 },
  { name: "Karthik V", topic: "Publication support", progress: 55 },
  { name: "Nisha Patel", topic: "Higher studies guidance", progress: 35 },
];

const opportunities = [
  { title: "Consultancy: predictive maintenance", org: "Arclight Systems", value: "₹6L / 4 months" },
  { title: "Guest faculty — Applied AI", org: "Meridian Institute", value: "Semester engagement" },
  { title: "Call for proposals: green tech", org: "National Innovation Fund", value: "Up to ₹25L" },
];

function AcademicianDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const sectionCopy: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
    dashboard: { eyebrow: "Academician workspace", title: `Welcome, ${user?.name ?? "Academician"}`, subtitle: "Together we build stronger academia–industry connections." },
    research: { eyebrow: "Research portfolio", title: "My Research", subtitle: "Review and manage your active academic research projects." },
    industry: { eyebrow: "Partner network", title: "Industry Connections", subtitle: "Connect with industry partners aligned with your academic expertise." },
    collaboration: { eyebrow: "Joint initiatives", title: "Projects & Collaboration", subtitle: "Manage active collaboration requests and shared projects." },
    mentorship: { eyebrow: "Student guidance", title: "Student Mentorship", subtitle: "Support students through research and career milestones." },
    opportunities: { eyebrow: "Academic opportunities", title: "Opportunities", subtitle: "Discover grants, consultancy and teaching engagements." },
  };
  const section = sectionCopy[tab] ?? sectionCopy["dashboard"] ?? {
    eyebrow: "Academician workspace",
    title: `Welcome, ${user?.name ?? "Academician"}`,
    subtitle: "Together we build stronger academia–industry connections.",
  };
  return (
    <DashboardShell
      role="academician"
      referenceLayout
      showSidebarIdentity
      navigation={[{ label: "My Research", value: "research", icon: BookMarked },{ label: "Industry Connections", value: "industry", icon: BriefcaseBusiness },{ label: "Projects & Collaboration", value: "collaboration", icon: HandshakeIcon },{ label: "Student Mentorship", value: "mentorship", icon: Users },{ label: "Opportunities", value: "opportunities", icon: Lightbulb }]}
      active={tab}
      onNavigate={setTab}
      title={section.title}
      subtitle={section.subtitle}
    >
      <p className="-mt-6 mb-4 text-xs font-semibold uppercase text-primary">{section.eyebrow}</p>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="sr-only">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="industry">Industry connections</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="mentorship">Student mentorship</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "My Research Projects", value: "3", hint: "Active", icon: BookMarked },
              { label: "Collaboration Requests", value: "5", hint: "Active", icon: HandshakeIcon },
              { label: "Mentorship Requests", value: "4", hint: "Active", icon: Users },
            ].map((stat) => <Card key={stat.label} className="border-border shadow-none"><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm text-muted-foreground">{stat.label}</p><p className="mt-3 text-3xl font-semibold">{stat.value}</p><p className="mt-2 text-xs font-medium text-success">{stat.hint}</p></div><span className="rounded-md bg-accent p-2 text-primary"><stat.icon className="h-5 w-5" /></span></CardContent></Card>)}
          </div>
          <Card className="shadow-none">
            <CardHeader className="flex-row items-center justify-between"><CardTitle className="text-lg">Recent Collaboration Requests</CardTitle><Button variant="link" size="sm" onClick={() => setTab("collaboration")}>View all →</Button></CardHeader>
            <CardContent className="space-y-1">
              {[{ title: "AI-based Crop Monitoring System", partner: "XYZ Technologies", time: "2 days ago" }, { title: "Smart Education Platform", partner: "TechSolutions Pvt. Ltd.", time: "3 days ago" }].map((request) => <div key={request.title} className="flex flex-wrap items-center gap-3 border-t border-border py-4"><span className="rounded-md bg-success/10 p-2 text-success"><BriefcaseBusiness className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="font-medium">{request.title}</p><p className="text-xs text-muted-foreground">{request.partner}</p></div><p className="text-xs text-muted-foreground">{request.time}</p><Button variant="outline" size="sm" onClick={() => toast.info(`Viewing ${request.title}`)}>View</Button><Button size="sm" onClick={() => toast.success("Collaboration request accepted")}>Accept</Button></div>)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="grid gap-4 md:grid-cols-2">
          {research.map((item) => (
            <Card key={item.title} className="shadow-none">
              <CardContent className="space-y-3 p-5">
                <p className="flex items-center gap-2 font-semibold">
                  <BookMarked className="h-4 w-4 text-primary" /> {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.stage} · {item.funding}
                </p>
                <Progress value={item.progress} />
                <p className="text-xs text-success">Active · {item.progress}% complete</p>
                <Button size="sm" variant="outline" onClick={() => toast.info(`Opening ${item.title}`)}>View project</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="industry" className="grid gap-3 md:grid-cols-2">
          {connections.map((item) => (
            <Card key={item.company} className="shadow-none">
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <Building2 className="h-4 w-4 text-primary" /> {item.company}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.focus}</p>
                  <Badge variant="secondary" className="mt-2">
                    {item.status}
                  </Badge>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Opening ${item.company}`)}>
                  View connection
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="collaboration" className="grid gap-3 md:grid-cols-2">
          {collaborations.map((item) => (
            <Card key={item.title}>
              <CardContent className="space-y-2 p-5">
                <p className="flex items-center gap-2 font-semibold">
                  <HandshakeIcon className="h-4 w-4 text-primary" /> {item.title}
                </p>
                <p className="text-sm text-muted-foreground">{item.partner}</p>
                <p className="text-xs text-primary">{item.due}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="mentorship" className="grid gap-3 md:grid-cols-2">
          {mentees.map((item) => (
            <Card key={item.name}>
              <CardContent className="space-y-2 p-5">
                <p className="flex items-center gap-2 font-semibold">
                  <Users className="h-4 w-4 text-primary" /> {item.name}
                </p>
                <p className="text-sm text-muted-foreground">{item.topic}</p>
                <Progress value={item.progress} />
                <Button size="sm" variant="outline" onClick={() => toast.success(`Review scheduled with ${item.name}`)}>
                  Schedule review
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-primary" /> Open opportunities
              </CardTitle>
              <CardDescription>Grants, consultancy and teaching engagements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {opportunities.map((item) => (
                <div key={item.title} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-4">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.org}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{item.value}</Badge>
                    <Button size="sm" onClick={() => toast.success("Interest registered")}>
                      Express interest
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
