import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  GraduationCap,
  Handshake,
  School,
  Search,
  ShieldCheck,
  TrendingUp,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { requireRole, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/institutionalist/dashboard")({
  ssr: false,
  beforeLoad: () => requireRole("institutionalist"),
  head: () => ({
    meta: [
      { title: "Institution Dashboard — SkillBridge" },
      { name: "description", content: "Manage your institution, students, faculty, partnerships and collaborations." },
      { property: "og:title", content: "Institution Dashboard — SkillBridge" },
      { property: "og:description", content: "Your SkillBridge institution workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InstitutionDashboard,
});

const students = [
  { name: "Rohit Kumar", roll: "GVC-CSE-2214", department: "CSE", year: "3rd Year", status: "Internship Applied" },
  { name: "Ananya Reddy", roll: "GVC-ECE-2108", department: "ECE", year: "3rd Year", status: "Placed" },
  { name: "Mohammed Irfan", roll: "GVC-ME-2136", department: "Mechanical", year: "4th Year", status: "Placed" },
  { name: "Sneha Patil", roll: "GVC-CSE-2242", department: "CSE", year: "2nd Year", status: "Active" },
];

const colleges = [
  { name: "College of Engineering", students: 2400, placement: 86 },
  { name: "School of Management", students: 900, placement: 78 },
  { name: "College of Sciences", students: 1300, placement: 64 },
];

const faculty = [
  { name: "Dr. Meera Rao", dept: "Computer Science", load: "12 hrs/week", research: 3 },
  { name: "Prof. Arjun Nair", dept: "Mechanical", load: "10 hrs/week", research: 2 },
  { name: "Dr. Sana Qureshi", dept: "Electronics", load: "14 hrs/week", research: 4 },
];

const partnerships = [
  { company: "Nimbus Tech", type: "Internship pipeline", status: "Active" },
  { company: "VoltEdge Labs", type: "Joint lab", status: "Renewal due" },
  { company: "Skyforge Cloud", type: "Curriculum input", status: "Active" },
];

const collaborations = [
  { title: "AI Centre of Excellence", partner: "Nimbus Tech", owner: "Computer Science", status: "Active" },
  { title: "Green Energy Research Lab", partner: "VoltEdge Labs", owner: "Mechanical Engineering", status: "Planning" },
  { title: "Graduate Employability Program", partner: "Skyforge Cloud", owner: "Placement Cell", status: "Active" },
];

const sectionCopy: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Welcome, Institution", subtitle: "Connect with industry, create collaborations and provide better opportunities for your students." },
  institution: { title: "My Institution", subtitle: "Institution profile and account details." },
  students: { title: "Students", subtitle: "1,248 students across 12 departments." },
  colleges: { title: "Colleges", subtitle: "Monitor constituent colleges and placement outcomes." },
  faculty: { title: "Faculty", subtitle: "Faculty members, workload and research activity." },
  partnerships: { title: "Industry Partners", subtitle: "Organizations supporting internships, research and curriculum." },
  collaborations: { title: "Collaborations", subtitle: "Track joint academic and industry initiatives." },
  programs: { title: "Programs & Events", subtitle: "Upcoming workshops, drives and campus programs." },
  reports: { title: "Reports & Analytics", subtitle: "Review institutional outcomes and progress." },
};

function InstitutionDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const copy = sectionCopy[tab] ?? { title: "Institution Dashboard", subtitle: "Manage your institution workspace." };

  return (
    <DashboardShell
      role="institutionalist"
      referenceLayout
      showSidebarIdentity
      navigation={[
        { label: "My Institution", value: "institution", icon: Building2 },
        { label: "Students", value: "students", icon: GraduationCap },
        { label: "Colleges", value: "colleges", icon: School },
        { label: "Faculty", value: "faculty", icon: Users },
        { label: "Industry Partners", value: "partnerships", icon: Handshake },
        { label: "Collaborations", value: "collaborations", icon: ShieldCheck },
        { label: "Programs & Events", value: "programs", icon: CalendarDays },
        { label: "Reports & Analytics", value: "reports", icon: BarChart3 },
      ]}
      active={tab}
      onNavigate={setTab}
      title={tab === "dashboard" ? `Welcome, ${user?.name ?? "Institution"}` : copy.title}
      subtitle={copy.subtitle}
    >
      <Tabs value={tab} onValueChange={setTab}>
        <TabsContent value="dashboard" className="mt-0 space-y-6">
          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { icon: Handshake, title: "Collaborate", text: "with Industry" },
                { icon: TrendingUp, title: "Track", text: "Placements" },
                { icon: Building2, title: "Skill", text: "Development" },
                { icon: ShieldCheck, title: "Grow", text: "Together" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <div><p className="text-sm font-semibold">{item.title}</p><p className="text-xs text-muted-foreground">{item.text}</p></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              { label: "Total Students", value: "1,248", hint: "↑ 12% vs. last semester", icon: GraduationCap },
              { label: "Total Faculty", value: "86", hint: "↑ 8% vs. last semester", icon: Users },
              { label: "Industry Partners", value: "24", hint: "↑ 33% vs. last semester", icon: Building2 },
              { label: "Active Collaborations", value: "12", hint: "↑ 50% vs. last semester", icon: Handshake },
            ].map((item) => (
              <Card key={item.label} className="shadow-none">
                <CardContent className="p-4 sm:p-5">
                  <item.icon className="mb-4 h-5 w-5 text-primary" />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold">{item.value}</p>
                  <p className="mt-2 text-xs text-primary">{item.hint}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
            <Card className="shadow-none">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Activities</CardTitle>
                <Button variant="ghost" size="sm">View all</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["New collaboration request", "Nimbus Tech · 2 hours ago"],
                  ["Placement drive scheduled", "TCS · Tomorrow at 10:00 AM"],
                  ["Faculty research proposal updated", "Computer Science · Yesterday"],
                ].map(([title, detail]) => (
                  <div key={title} className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{detail}</p></div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
              <CardContent className="grid gap-2">
                <Button onClick={() => setTab("collaborations")}><Handshake /> Create Collaboration</Button>
                <Button variant="outline" onClick={() => setTab("students")}><UserRoundPlus /> Add Student</Button>
                <Button variant="outline" onClick={() => setTab("programs")}><CalendarDays /> Schedule Event</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="institution" className="mt-0">
          <Card className="shadow-none">
            <CardContent className="grid gap-8 p-6 lg:grid-cols-[1fr_280px]">
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-md bg-primary/10 p-3"><Building2 className="h-7 w-7 text-primary" /></div>
                    <div><h2 className="text-xl font-bold">{user?.organization ?? "Green Valley College"}</h2><p className="text-sm text-muted-foreground">Autonomous · Est. 2005</p></div>
                  </div>
                  <Button variant="outline" onClick={() => toast.success("Institution profile is ready to edit")}>Edit Profile</Button>
                </div>
                <p className="mt-7 max-w-3xl text-sm leading-6 text-muted-foreground">Committed to excellence in education and innovation through strong industry-academia collaboration. An accredited autonomous institution affiliated with the State Technical University.</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <Info label="Total Students" value="1,248" />
                  <Info label="Faculty Members" value="86" />
                  <Info label="Departments" value="12" />
                  <Info label="Industry Partners" value="24" />
                </div>
              </div>
              <div className="border-l-0 border-border lg:border-l lg:pl-7">
                <p className="text-sm font-semibold">Account Holder</p>
                <div className="mt-5 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{user?.name?.slice(0, 2).toUpperCase() ?? "IN"}</div><div><p className="font-semibold">{user?.name ?? "Institution Admin"}</p><p className="text-xs text-muted-foreground">Principal · Administrator</p></div></div>
                <p className="mt-6 text-sm text-muted-foreground">{user?.email ?? "institution@skillbridge.edu"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="mt-0">
          <Card className="shadow-none">
            <CardContent className="p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search students by name, ID or department..." /></div>
                <Button onClick={() => toast.success("Student form opened")}><UserRoundPlus /> Add Student</Button>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_.8fr_1fr] gap-3 border-b border-border px-3 pb-3 text-xs font-semibold text-muted-foreground"><span>Student</span><span>Roll No.</span><span>Department</span><span>Year</span><span>Status</span></div>
                  {students.map((student) => <div key={student.roll} className="grid grid-cols-[1.5fr_1fr_1fr_.8fr_1fr] items-center gap-3 border-b border-border px-3 py-4 text-sm last:border-0"><span className="font-medium">{student.name}</span><span className="text-xs text-primary">{student.roll}</span><span>{student.department}</span><span>{student.year}</span><Badge variant={student.status === "Placed" ? "default" : "secondary"} className="w-fit">{student.status}</Badge></div>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colleges" className="mt-0 grid gap-3 md:grid-cols-2">
          {colleges.map((item) => <Card key={item.name} className="shadow-none"><CardContent className="space-y-3 p-5"><p className="flex items-center gap-2 font-semibold"><School className="h-4 w-4 text-primary" /> {item.name}</p><p className="text-sm text-muted-foreground">{item.students.toLocaleString()} students</p><Progress value={item.placement} /><p className="text-xs text-muted-foreground">{item.placement}% placed</p></CardContent></Card>)}
        </TabsContent>

        <TabsContent value="faculty" className="mt-0 grid gap-3 md:grid-cols-2">
          {faculty.map((item) => <Card key={item.name} className="shadow-none"><CardContent className="flex items-start justify-between gap-3 p-5"><div><p className="flex items-center gap-2 font-semibold"><Users className="h-4 w-4 text-primary" /> {item.name}</p><p className="text-sm text-muted-foreground">{item.dept} · {item.load}</p><Badge variant="secondary" className="mt-2">{item.research} research projects</Badge></div><Button size="sm" variant="outline" onClick={() => toast.success(`Profile opened for ${item.name}`)}>View</Button></CardContent></Card>)}
        </TabsContent>

        <TabsContent value="partnerships" className="mt-0">
          <Card className="shadow-none"><CardHeader><CardTitle className="text-lg">Industry Partners</CardTitle><CardDescription>Agreements supporting internships, placements and research.</CardDescription></CardHeader><CardContent className="space-y-3">{partnerships.map((item) => <div key={item.company} className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 last:border-0"><div><p className="flex items-center gap-2 font-medium"><Building2 className="h-4 w-4 text-primary" /> {item.company}</p><p className="text-sm text-muted-foreground">{item.type}</p></div><Badge variant="secondary">{item.status}</Badge></div>)}</CardContent></Card>
        </TabsContent>

        <TabsContent value="collaborations" className="mt-0 space-y-4">
          <div className="flex justify-end"><Button onClick={() => toast.success("New collaboration form opened")}><Handshake /> Create Collaboration</Button></div>
          <div className="grid gap-3 lg:grid-cols-2">{collaborations.map((item) => <Card key={item.title} className="shadow-none"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">{item.title}</CardTitle><CardDescription className="mt-1">{item.partner}</CardDescription></div><Badge variant={item.status === "Active" ? "default" : "secondary"}>{item.status}</Badge></div></CardHeader><CardContent><p className="text-sm text-muted-foreground">Led by {item.owner}</p><Button className="mt-4" size="sm" variant="outline" onClick={() => toast.success(`${item.title} opened`)}>View collaboration</Button></CardContent></Card>)}</div>
        </TabsContent>

        <TabsContent value="programs" className="mt-0 grid gap-3 md:grid-cols-2">
          {[{ title: "Industry Readiness Workshop", date: "18 Sep", type: "Workshop" }, { title: "Campus Placement Drive", date: "24 Sep", type: "Placement" }, { title: "Faculty Innovation Summit", date: "03 Oct", type: "Conference" }].map((item) => <Card key={item.title} className="shadow-none"><CardContent className="flex items-center gap-4 p-5"><div className="rounded-md bg-primary/10 p-3 text-center text-sm font-bold text-primary">{item.date}</div><div><p className="font-semibold">{item.title}</p><p className="text-sm text-muted-foreground">{item.type}</p></div></CardContent></Card>)}
        </TabsContent>

        <TabsContent value="reports" className="mt-0 grid gap-4 md:grid-cols-2">
          <Report title="Placement progress" value="79%" progress={79} detail="Target: 85%" />
          <Report title="Student participation" value="68%" progress={68} detail="Across active programs" />
          <Report title="Faculty research activity" value="74%" progress={74} detail="9 research leads" />
          <Report title="Industry engagement" value="82%" progress={82} detail="24 active partners" />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-border py-3"><p className="text-sm text-muted-foreground">{label}</p><p className="font-semibold">{value}</p></div>;
}

function Report({ title, value, progress, detail }: { title: string; value: string; progress: number; detail: string }) {
  return <Card className="shadow-none"><CardContent className="p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /><p className="font-semibold">{title}</p></div><span className="text-xl font-bold">{value}</span></div><Progress value={progress} className="mt-4" /><p className="mt-2 text-xs text-muted-foreground">{detail}</p></CardContent></Card>;
}