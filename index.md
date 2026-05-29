---
layout: home
title: HazeClue Developer Portal

hero:
  name: "HazeClue"
  text: "Developer Documentation"
  tagline: "A full-stack BCI platform for real-time cognitive monitoring — built on NestJS, ASP.NET Core, Flutter, and Python ML. Deployed. Production-ready."
  actions:
    - theme: brand
      text: "⚡ System Overview"
      link: /docs/overview
    - theme: alt
      text: "🔌 Web Backend API"
      link: /docs/backend-web/
    - theme: alt
      text: "🚀 Live Platform"
      link: https://hazeclue.netlify.app

features:
  - icon: ⚡
    title: Web Backend (NestJS)
    details: "Modular NestJS 11 API with MongoDB, JWT Auth, Pusher real-time events, PDF/CSV exports, and full session lifecycle management. Deployed on Vercel."
    link: /docs/backend-web/
    linkText: Explore API Docs

  - icon: 🔷
    title: Mobile Backend (.NET Core)
    details: "ASP.NET Core Clean Architecture API with EF Core, JWT claims, session analytics, smartwatch ingestion, and AI insight generation."
    link: /docs/backend-mobile/
    linkText: View Architecture

  - icon: 📲
    title: Flutter Mobile App
    details: "Cross-platform Flutter app with tDCS simulation, EEG real-time monitoring, cognitive training games, BLE device management, and ONNX inference."
    link: /docs/mobile/
    linkText: View App Docs

  - icon: 🌐
    title: Instructor Web Platform
    details: "Nuxt 4 instructor dashboard with live Chart.js attention visualization, Pinia SSR state, OTP auth flows, and aggressive chunk splitting."
    link: /docs/website/
    linkText: View Frontend Docs

  - icon: 🤖
    title: AI Engine (RARD–MVES)
    details: "Hybrid Riemannian-Statistical EEG inference engine with dynamic mode switching (SQI-based), ONNX export, and <35ms on-device latency."
    link: /docs/ai/
    linkText: Explore AI Docs

  - icon: 📋
    title: User Stories & Epics
    details: "Complete Agile specification with epics across hardware integration, cognitive training, analytics, and institutional monitoring — tracked in Jira."
    link: /docs/user-stories/
    linkText: Read Stories
---
