# User Stories & Requirements

> **Project Management:** [HazeClue Jira Board](https://ameeen.atlassian.net/jira/core/projects/HAZE/list)

The HazeClue project is managed using **Agile methodologies** with Jira for sprint tracking. Requirements are captured as user stories across five core epics, spanning hardware integration, cognitive training, analytics, institutional monitoring, and platform administration.

## Epics Overview

| Epic | Description | Priority |
|------|-------------|----------|
| **E1** — Hardware Integration | BLE device connectivity and data ingestion | 🔴 Critical |
| **E2** — Cognitive Training | Training games, tDCS sessions, binaural beats | 🔴 Critical |
| **E3** — Data & Analytics | Focus insights, weekly/monthly trends, AI tips | 🟠 High |
| **E4** — Institutional Monitoring | Instructor dashboard, live sessions, alerts | 🟠 High |
| **E5** — Platform & Account | Auth, security, notifications, consent | 🟡 Medium |

---

## E1 — Hardware Integration

> Enabling users to connect, manage, and trust their neurotechnology hardware.

**US-101** — As a user, I want to pair my EEG headset via Bluetooth so that my brainwave data is captured automatically during sessions.

**US-102** — As a user, I want to pair my tDCS device so that I can initiate neurostimulation sessions directly from the app.

**US-103** — As a user, I want to connect my smartwatch so that my sleep, HRV, and stress data are automatically synced for holistic health insights.

**US-104** — As a user, I want to see the connection status of all my devices at a glance so that I know my hardware is ready before starting a session.

**US-105** — As a user, I want to receive an alert if my EEG device disconnects mid-session so that data integrity is preserved.

---

## E2 — Cognitive Training

> Providing science-backed brain training tools accessible to everyone.

**US-201** — As a user, I want to start a tDCS stimulation session with customizable intensity and duration so that I can safely enhance my cognitive state.

**US-202** — As a user, I want to play memory training games of increasing difficulty so that I can actively strengthen my short-term recall.

**US-203** — As a user, I want to play concentration puzzles so that I can practice and improve my sustained attention.

**US-204** — As a user, I want to listen to Binaural Beats so that I can enter a focused or relaxed state without active effort.

**US-205** — As a user, I want to receive a legal consent screen before my first tDCS session so that I understand the safety parameters.

**US-206** — As a user, I want my cognitive game scores to be saved alongside my EEG data so that my results are correlated with my brain state.

---

## E3 — Data & Analytics

> Turning raw biometric data into actionable cognitive performance insights.

**US-301** — As a user, I want to see my total focus time for the day, week, and month so that I can track my training consistency.

**US-302** — As a user, I want to see a weekly bar chart of my focus minutes so that I can identify my most productive days.

**US-303** — As a user, I want to see my improvement percentage compared to the previous week so that I have a clear sense of progress.

**US-304** — As a user, I want to receive a daily AI-generated health tip based on my latest physiological data so that I can make informed lifestyle decisions.

**US-305** — As a user, I want to view a 6-month trend of my cognitive performance so that I can understand my long-term trajectory.

---

## E4 — Institutional Monitoring (Instructor Platform)

> Empowering educators with real-time cognitive engagement data.

**US-401** — As an instructor, I want to create monitoring sessions for my class so that I can track student attention during lectures.

**US-402** — As an instructor, I want to see a live chart of my class's average attention level so that I can adapt my teaching in real time.

**US-403** — As an instructor, I want to see individual attention scores per student device so that I can identify struggling individuals immediately.

**US-404** — As an instructor, I want to broadcast an alert to all student devices when attention drops below a threshold so that I can re-engage the class.

**US-405** — As an instructor, I want to place event markers during a live session (e.g., "topic change") so that I can correlate attention spikes/dips with teaching moments in the report.

**US-406** — As an instructor, I want to pause and resume a monitoring session without ending it so that I can manage breaks.

**US-407** — As an instructor, I want to download a PDF or CSV report of a completed session so that I can share results with administration.

**US-408** — As an instructor, I want to see my dashboard statistics (total sessions, avg attention) at a glance so that I have an overview of my monitoring history.

---

## E5 — Platform & Account

> Ensuring secure, trustworthy, and accessible platform operations.

**US-501** — As a user, I want to register and log in with email and password so that my data is private and persistent across devices.

**US-502** — As a user, I want to reset my password via email OTP so that I can recover my account securely.

**US-503** — As a user, I want to update my profile (name, avatar) so that my account reflects my identity.

**US-504** — As a user, I want to receive push notifications when a session completes or an insight is available so that I stay engaged without manually checking.

**US-505** — As a user, I want to soft-delete my account so that my data is deactivated without permanent loss.

---

## Sprint Methodology

The team follows **2-week Agile sprints** with:

- **Sprint Planning** — Story point estimation, capacity planning
- **Daily Stand-ups** — Progress, blockers, coordination
- **Sprint Review** — Demo of completed features
- **Retrospective** — Process improvement

All stories are tracked in Jira with labels for Epic, Priority, Story Points, and Assignee. The Jira board is available at:

**[→ HazeClue Jira Board](https://ameeen.atlassian.net/jira/core/projects/HAZE/list)**

## Acceptance Criteria Standards

All user stories follow the **Given-When-Then** format:

```
Given [context/precondition]
When [user action]
Then [expected outcome]
And [additional verification]
```

Example for US-402:
```
Given an active monitoring session with at least one connected device,
When the device sends telemetry data,
Then the instructor dashboard updates the attention chart within 2 seconds,
And the class average is recalculated with the new data point.
```
