# Mobile Backend API (.NET Core)

The `HazeClue_backend_mobile` repository contains the robust API that serves the Flutter mobile application. It is responsible for data persistence, security, and complex business logic.

## Architecture & Stack
- **Framework:** ASP.NET Core Web API (C#)
- **Database:** Entity Framework Core (SQL Server / PostgreSQL)
- **Authentication:** JWT (JSON Web Tokens)
- **Architecture Pattern:** N-Tier / Clean Architecture principles (Core, Infrastructure, UI/API layers).

## Core Entities

```mermaid
erDiagram
    USER ||--o{ SMARTWATCH_DATA : tracks
    USER ||--o{ FOCUS_SESSION : completes
    USER ||--o{ DEVICE : owns
    USER ||--o{ USER_INSIGHT : receives

    USER {
        string Id
        string FullName
        string Email
    }
    SMARTWATCH_DATA {
        guid Id
        int SleepScore
        double HRV
        string StressLevel
    }
    FOCUS_SESSION {
        guid Id
        string Title
        int DurationMinutes
        int Score
    }
    USER_INSIGHT {
        guid Id
        string Type
        string Message
        datetime CreatedAt
    }
```

## Key Services
1. **InsightGeneratorService:** A rule-based engine that processes recent `SmartwatchData` and user assessments to generate actionable `UserInsight` records (e.g., detecting high stress via HRV).
2. **AuthService:** Handles password hashing, JWT generation, and user registration pipelines.
3. **SmartwatchController:** Ingests health metrics from the mobile device.
