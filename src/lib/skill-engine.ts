export type Assessment = {
  skill: string;
  questions: { prompt: string; options: string[]; answerIndex: number }[];
};

export type Roadmap = {
  role: string;
  summary: string;
  phases: { title: string; duration: string; items: string[] }[];
};

/** Generates a short proficiency check for any entered skill. */
export function buildAssessment(skill: string): Assessment {
  return {
    skill,
    questions: [
      {
        prompt: `Which best describes a core concept of ${skill}?`,
        options: [
          `A fundamental building block used daily in ${skill}`,
          `A deprecated tool unrelated to ${skill}`,
          `A hardware-only requirement for ${skill}`,
          `A licensing model for ${skill}`,
        ],
        answerIndex: 0,
      },
      {
        prompt: `You hit an unexpected result while working with ${skill}. What is the best first step?`,
        options: [
          "Rewrite the whole solution",
          "Reproduce the issue with a minimal example",
          "Ignore it and continue",
          "Switch to a different technology",
        ],
        answerIndex: 1,
      },
      {
        prompt: `Which practice most improves quality in ${skill} work?`,
        options: [
          "Skipping documentation",
          "Avoiding reviews",
          "Testing and iterating on feedback",
          "Working only from memory",
        ],
        answerIndex: 2,
      },
      {
        prompt: `How would you demonstrate ${skill} to a recruiter?`,
        options: [
          "Only list it on a resume",
          "Share a project or case study applying it",
          "Mention it verbally",
          "Take no action",
        ],
        answerIndex: 1,
      },
      {
        prompt: `What is the strongest signal of advanced ${skill} ability?`,
        options: [
          "Completing a tutorial",
          "Watching videos",
          "Solving real, ambiguous problems with it",
          "Buying a course",
        ],
        answerIndex: 2,
      },
    ],
  };
}

/** Generates a phased learning roadmap for any target role. */
export function buildRoadmap(role: string, currentSkills: string[]): Roadmap {
  const have = currentSkills.length ? currentSkills.join(", ") : "no skills mapped yet";
  return {
    role,
    summary: `A 6-month roadmap to become a job-ready ${role}, building on your current skills (${have}).`,
    phases: [
      {
        title: `Phase 1 — Foundations of ${role}`,
        duration: "Weeks 1-4",
        items: [
          `Map the day-to-day responsibilities of a ${role} from 5 live job descriptions`,
          "Close core fundamentals: problem solving, version control, communication",
          `Complete one structured course covering ${role} basics`,
        ],
      },
      {
        title: "Phase 2 — Core toolkit",
        duration: "Weeks 5-10",
        items: [
          `Learn the 3 most requested tools for ${role} roles`,
          "Build two small projects, one guided and one from scratch",
          "Take SkillBridge assessments after each tool to track proficiency",
        ],
      },
      {
        title: "Phase 3 — Applied projects",
        duration: "Weeks 11-18",
        items: [
          `Ship a portfolio project that solves a real problem a ${role} would own`,
          "Get an academic tutor review and an industry mentor review",
          "Document decisions and results in a public case study",
        ],
      },
      {
        title: "Phase 4 — Placement readiness",
        duration: "Weeks 19-24",
        items: [
          `Practice ${role} interview rounds weekly`,
          "Apply to matched internships and placement drives on SkillBridge",
          "Collect referrals from mentors and industry connections",
        ],
      },
    ],
  };
}
