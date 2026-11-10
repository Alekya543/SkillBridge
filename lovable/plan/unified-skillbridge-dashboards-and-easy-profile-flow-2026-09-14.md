# Unified SkillBridge dashboards and easy profile flow

## Goal
Restyle all four role dashboards to match the supplied SkillBridge references: orange-and-navy branding, a persistent left navigation, compact summary cards, activity lists, and a consistent responsive layout. Keep every existing dashboard feature while making sign-in quick and profile creation available for every role.

## What will change

### 1. Fast role login and profile setup
- Rebuild each role login screen in the two-column reference style, with role-specific copy and fields.
- Keep email/password entry intentionally frictionless: any valid email and entered password can continue immediately, with no account verification.
- Keep the Google button as an instant demo sign-in. If profile details are missing, send the user to a short role-specific profile setup before opening the dashboard.
- Add editable, locally saved profiles for Student, Academician, Industrialist, and Institution users.
- Preserve role locking so a signed-in user only opens the matching dashboard.

### 2. Shared SkillBridge dashboard design
- Replace the current top-only shell with the reference layout: SkillBridge header, desktop sidebar, compact mobile navigation, welcome area, statistics, and organized content panels.
- Use one shared visual system across all roles while retaining each role’s current sections and actions.
- Match the second image’s warm white background, navy text, orange actions, subtle borders, compact cards, and institutional portal styling.

### 3. Student skill mapping workspace
Create three clearly separated options under Skill Mapping:
1. **Skill Mapping by AI** — student enters a target role/position and receives recommended skills grouped by priority, with options to add them to the profile.
2. **Skill Assessment** — student selects only from skills already saved in their profile, completes an assessment, and receives a proficiency score.
3. **Roadmap by AI** — student enters a target role/position and receives a staged learning roadmap informed by current profile skills and assessment results.

The existing tutors, internships, placements, and profile areas remain available.

### 4. Role dashboards
- **Academician:** retain research, industry connections, collaboration, student mentorship, and opportunities in the unified sidebar layout.
- **Industrialist:** retain challenges, academician discovery, collaboration requests, projects, internships, and jobs.
- **Institution:** retain institution overview, colleges, students/faculty-focused information, partnerships, reports, activities, events, and profile details using the supplied institution reference.
- Add a profile destination and completion status to every role dashboard.

## AI behavior
- Connect the two target-role features to Lovable AI rather than mock responses.
- Keep AI calls server-side, show progress while results are generated, preserve the entered role on failure, and display the gateway’s actionable error message.
- Skill assessment questions remain fast and deterministic for skills already stored in the student profile.

## Persistence and scope
- Because the requested login is explicitly without authentication, session and profile information will be saved in the browser for this demo; no verified accounts or cross-device sync will be added.
- Existing dashboard content and actions will be retained and reorganized, not removed.

## Verification
- Test email login, Google demo login, required profile setup, sign-out, and role guards for all four roles.
- Test all three student skill options, including adding mapped skills before assessment and generating results from a target role.
- Check the four dashboards and login pages at mobile and desktop sizes for readable, non-overlapping layouts.
