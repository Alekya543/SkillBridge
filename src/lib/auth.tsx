import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { redirect } from "@tanstack/react-router";

export const ROLES = ["student", "academician", "industrialist", "institutionalist"] as const;
export type Role = (typeof ROLES)[number];

export type SkillBridgeUser = {
  name: string;
  email: string;
  role: Role;
  organization?: string | undefined;
  title?: string | undefined;
  bio?: string | undefined;
  phone?: string | undefined;
  skills?: string[] | undefined;
  profileComplete?: boolean | undefined;
};

const STORAGE_KEY = "skillbridge.session";

export type DashboardPath =
  | "/student/dashboard"
  | "/academician/dashboard"
  | "/industrialist/dashboard"
  | "/institutionalist/dashboard";

export const roleMeta: Record<
  Role,
  {
    label: string;
    tagline: string;
    emailLabel: string;
    dashboard: DashboardPath;
    description: string;
  }
> = {
  student: {
    label: "Student",
    tagline: "Access your learning dashboard",
    emailLabel: "Student email",
    dashboard: "/student/dashboard",
    description: "Skill mapping, tutors, internships and placements.",
  },
  academician: {
    label: "Academician",
    tagline: "Access your academic dashboard",
    emailLabel: "Institutional email",
    dashboard: "/academician/dashboard",
    description: "Research, industry connections and student mentorship.",
  },
  industrialist: {
    label: "Industrialist",
    tagline: "Access your industry dashboard",
    emailLabel: "Work email",
    dashboard: "/industrialist/dashboard",
    description: "Challenges, talent, collaborations and hiring.",
  },
  institutionalist: {
    label: "Institution",
    tagline: "Access your institution dashboard",
    emailLabel: "Institution email",
    dashboard: "/institutionalist/dashboard",
    description: "Colleges, faculty and institution-wide insights.",
  },
};

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function getStoredUser(): SkillBridgeUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SkillBridgeUser;
    if (!parsed?.email || !isRole(parsed.role)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function storeUser(user: SkillBridgeUser) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("skillbridge-session"));
}

export function updateStoredUser(updates: Partial<SkillBridgeUser>) {
  const current = getStoredUser();
  if (!current) return null;
  const next = { ...current, ...updates };
  storeUser(next);
  return next;
}

export function clearUser() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("skillbridge-session"));
}

/** Route guard: only the matching role may open the dashboard. */
export function requireRole(role: Role) {
  const user = getStoredUser();
  if (!user) {
    throw redirect({ to: "/login/$role", params: { role } });
  }
  if (user.role !== role) {
    throw redirect({ to: roleMeta[user.role].dashboard });
  }
  return { user };
}

export function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "member";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type AuthContextValue = {
  user: SkillBridgeUser | null;
  signIn: (user: SkillBridgeUser) => void;
  signOut: () => void;
  updateProfile: (updates: Partial<SkillBridgeUser>) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signIn: () => {},
  signOut: () => {},
  updateProfile: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SkillBridgeUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    sync();
    window.addEventListener("skillbridge-session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("skillbridge-session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signIn = useCallback((next: SkillBridgeUser) => {
    storeUser(next);
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<SkillBridgeUser>) => {
    const next = updateStoredUser(updates);
    if (next) setUser(next);
  }, []);

  const value = useMemo(
    () => ({ user, signIn, signOut, updateProfile }),
    [user, signIn, signOut, updateProfile],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
