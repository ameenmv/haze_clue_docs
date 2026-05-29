# Deployment & Environment — Mobile Backend

> **Repository:** [`HazeClue/Haze_clue_backend_mobile`](https://github.com/HazeClue/Haze_clue_backend_mobile)  
> **Postman Collection:** [HazeClue_Mobile_Postman_Collection.json](https://github.com/ameenmv/Haze_clue_backend_mobile/blob/main/HazeClue_Mobile_Postman_Collection.json)

## Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | ASP.NET Core Web API | .NET 8+ |
| **Language** | C# |  |
| **ORM** | Entity Framework Core | 8.x |
| **Database** | SQL Server / PostgreSQL | — |
| **Auth** | ASP.NET Identity + JWT Bearer | — |
| **Real-Time** | SignalR (`/sessionHub`) | — |
| **API Versioning** | `Asp.Versioning.Mvc` | — |
| **Swagger** | Swashbuckle / Scalar | — |
| **Health Checks** | `Microsoft.Extensions.Diagnostics.HealthChecks` | — |
| **Containerization** | Docker | — |

## Project Structure

```
HazeClue.sln
├── HazeClue.Core/               # Domain entities & contracts (zero dependencies)
│   └── Domain/
│       ├── Entities/
│       │   ├── AppUser.cs        # ASP.NET Identity user + OTP/reset fields
│       │   ├── FocusSession.cs   # Core session entity
│       │   ├── PuzzleResult.cs   # Cognitive game score
│       │   ├── Device.cs         # BCI/EEG device registration
│       │   ├── SmartwatchData.cs # Wearable health metrics
│       │   ├── UserInsight.cs    # AI-generated health tips
│       │   ├── AppNotification.cs
│       │   ├── UserSession.cs    # JWT session tracking
│       │   ├── SecurityLog.cs    # Auth event audit log
│       │   ├── HealthAssessment.cs
│       │   ├── ConsentRecord.cs
│       │   ├── NotificationSetting.cs
│       │   └── DeviceSetting.cs
│       └── Contracts/            # Repository interfaces
│
├── HazeClue.Infrastructure/      # EF Core DbContext + migrations
│   └── DbContext/
│       └── ApplicationDbContext.cs
│
├── HazeClue.UI/                  # ASP.NET Core Web API
│   ├── Program.cs                # App startup + CORS + SignalR
│   ├── Controllers/v1/
│   │   ├── AccountController.cs  # Auth + sessions + security logs
│   │   ├── UsersController.cs    # Profile + settings
│   │   ├── SessionsController.cs # Focus sessions + insights
│   │   ├── DevicesController.cs  # BCI device management
│   │   ├── SmartwatchController.cs
│   │   ├── InsightsController.cs
│   │   ├── AssessmentsController.cs
│   │   ├── NotificationsController.cs
│   │   ├── DashboardController.cs
│   │   └── SupportController.cs
│   ├── Hubs/
│   │   └── SessionHub.cs         # SignalR hub for live session data
│   └── StartupExtensions/        # Service registration extensions
│
├── HazeClue.ControllerTests/
├── HazeClue.ServiceTests/
└── HazeClue.IntegrationTests/
```

## Configuration (`appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=HazeClue;..."
  },
  "Jwt": {
    "SecretKey": "your-256-bit-secret",
    "Issuer": "HazeClue",
    "Audience": "HazeClueUsers",
    "ExpireDays": "7"
  }
}
```

## Request Pipeline (`Program.cs`)

```csharp
// Middleware order (critical)
app.UseHsts();
app.UseHttpsRedirection();
app.UseCors("AllowSpecific");    // Before routing
app.UseRouting();
app.UseAuthentication();         // JWT validation
app.UseAuthorization();          // [Authorize] enforcement

app.MapControllers();
app.MapHub<SessionHub>("/sessionHub");  // SignalR
app.MapHealthChecks("/health");         // Health endpoint
```

## CORS Policy

```csharp
policy.SetIsOriginAllowed(origin => true)  // All origins (Flutter dev ports vary)
      .AllowAnyMethod()
      .AllowAnyHeader()
      .AllowCredentials();
```

::: warning Production Note
The current CORS policy allows all origins for Flutter development compatibility (the app port changes on rebuild). **Tighten this in production** to specific domains.
:::

## SignalR Hub

The `/sessionHub` endpoint provides real-time capabilities for live session data streaming to connected Flutter clients.

```csharp
// Connect from Flutter (using signalr_flutter package)
// services/signalr_service.dart
final connection = HubConnectionBuilder()
  .withUrl("$baseUrl/sessionHub")
  .build();
```

## Local Development Setup

```bash
# Clone
git clone https://github.com/HazeClue/Haze_clue_backend_mobile.git
cd Haze_clue_backend_mobile

# Restore packages
dotnet restore

# Apply EF Core migrations
dotnet ef database update --project HazeClue.Infrastructure --startup-project HazeClue.UI

# Run (defaults to http://localhost:5220)
dotnet run --project HazeClue.UI
```

::: tip Flutter Default URL
The Flutter app defaults to `http://localhost:5220/api/v1` in development. This matches the ASP.NET Core default port.
:::

## Available Scripts

| Command | Description |
|---------|-------------|
| `dotnet run --project HazeClue.UI` | Start development server |
| `dotnet watch --project HazeClue.UI` | Start with hot reload |
| `dotnet build` | Build all projects |
| `dotnet test` | Run all test suites |
| `dotnet test HazeClue.ControllerTests` | Controller tests only |
| `dotnet test HazeClue.ServiceTests` | Service tests only |
| `dotnet test HazeClue.IntegrationTests` | Integration tests only |
| `dotnet ef migrations add <Name>` | Add a new EF migration |
| `dotnet ef database update` | Apply pending migrations |

## Docker

```bash
# Build image
docker build -t hazeclue-mobile-api .

# Run container
docker run -p 5220:5220 \
  -e ConnectionStrings__DefaultConnection="..." \
  -e Jwt__SecretKey="..." \
  hazeclue-mobile-api
```

## Health Check

```bash
curl http://localhost:5220/health
# → Healthy
```

## Swagger UI

Development Swagger is available at:
```
http://localhost:5220/swagger
```

Supports API versioning — select **V1** from the dropdown.

## Postman Collection

Import the ready-to-use collection:

**[📥 Download HazeClue_Mobile_Postman_Collection.json](https://github.com/ameenmv/Haze_clue_backend_mobile/blob/main/HazeClue_Mobile_Postman_Collection.json)**

Set your base URL environment variable to `http://localhost:5220/api/v1`.
