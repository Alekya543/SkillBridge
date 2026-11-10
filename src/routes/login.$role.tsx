import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isRole, nameFromEmail, roleMeta, useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login/$role")({
  beforeLoad: ({ params }) => {
    if (!isRole(params.role)) throw notFound();
  },
  head: ({ params }) => {
    const label = isRole(params.role) ? roleMeta[params.role].label : "Member";
    return {
      meta: [
        { title: `${label} Login — SkillBridge` },
        { name: "description", content: `Sign in to your SkillBridge ${label} dashboard.` },
        { property: "og:title", content: `${label} Login — SkillBridge` },
        {
          property: "og:description",
          content: `Sign in to your SkillBridge ${label} dashboard.`,
        },
      ],
    };
  },
  component: LoginPage,
});

function LoginPage() {
  const { role } = Route.useParams();
  const meta = roleMeta[role as Role];
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed.includes("@")) {
      toast.error("Enter an email address to continue");
      return;
    }
    signIn({
      name: name.trim() || nameFromEmail(trimmed),
      email: trimmed,
      role: role as Role,
      organization: organization.trim() || undefined,
    });
    toast.success(mode === "login" ? "Welcome back!" : "Account created");
    navigate({ to: meta.dashboard, replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md surface-panel p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <BrandMark className="h-16 w-16" />
          <BrandWordmark className="mt-3 text-3xl" />
          <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground">
            Academia × Industry × Innovation
          </p>
          <h1 className="mt-6 text-2xl font-bold">
            <span className="rounded bg-[oklch(0.93_0.18_100)] px-1 text-primary">
              {meta.label}
            </span>{" "}
            {mode === "login" ? "Login" : "Sign up"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{meta.tagline}</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "register" ? (
            <Field icon={User} label="Full name">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="h-12 border-0 pl-10 shadow-none focus-visible:ring-0"
              />
            </Field>
          ) : null}

          <Field icon={Mail} label={meta.emailLabel}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={meta.emailLabel}
              className="h-12 border-0 pl-10 shadow-none focus-visible:ring-0"
            />
          </Field>

          <Field icon={Lock} label="Password">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-12 border-0 pl-10 pr-10 shadow-none focus-visible:ring-0"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </Field>

          {mode === "register" ? (
            <Field icon={User} label="Organization">
              <Input
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="College / company (optional)"
                className="h-12 border-0 pl-10 shadow-none focus-visible:ring-0"
              />
            </Field>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => toast.info("Password reset is not needed in this demo — just sign in.")}
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" className="h-12 w-full text-base font-semibold">
            {mode === "login" ? "Login" : "Create account"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          OR
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          variant="outline"
          className="h-12 w-full text-base"
          onClick={() => {
            const isStudent = role === "student";
            signIn({
              name: isStudent ? "" : "Alekya Veeramosu",
              email: "alekya.veeramosu@skillbridge.app",
              role: role as Role,
              profileComplete: isStudent ? false : true,
            });
            toast.success(
              isStudent ? "Signed in — create your profile" : "Welcome, Alekya Veeramosu",
            );
            navigate({ to: isStudent ? "/profile" : meta.dashboard, replace: true });
          }}
        >
          <span className="font-bold text-primary">G</span> Continue with Google
        </Button>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "login" ? "New to SkillBridge? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-semibold text-primary hover:underline"
          >
            {mode === "login" ? "Register now" : "Login"}
          </button>
        </p>

        <p className="mt-4 text-center text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            ← Choose a different role
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-xl border border-border bg-card">
      <Label className="sr-only">{label}</Label>
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      {children}
    </div>
  );
}
