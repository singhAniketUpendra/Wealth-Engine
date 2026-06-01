# 📊 WealthEngine - Institutional Portfolio Tracker

WealthEngine is a high-performance, secure, and multi-tier full-stack portfolio management application designed for tracking investments across global asset classes. Built using an enterprise-grade architectural approach, the system handles concurrent data flows, multi-level user privileges (Admins and Investors), and strict data integrity standards.

---

## 🚀 Key Architectural Features

* **Multi-Tier DTO Pattern Separation:** Implements separate data contracts for registration (`UserRequestDto`) and targeted profile modifications (`UserUpdateRequestDto`) to guarantee data integrity and prevent security bypasses on sensitive columns like password hashes.
* **Airtight RBAC & Claim Authorization:** Implemented Role-Based Access Control at the ASP.NET Core controller level utilizing `[Authorize(Roles = "Admin")]` annotations to isolate management boundaries.
* **High-Performance Async Metrics Processing:** Leverages JavaScript parallel execution streams (`Promise.all`) inside the React layer to concurrently query and load analytics nodes without causing UI thread blocking.
* **Global Audit Ledger Streams:** Utilizes Entity Framework Core deep eager loading techniques (`.Include().ThenInclude()`) to deliver a centralized read-only transactions matrix tracking historic trade operations safely.
* **Live Authentication Context Synchronization:** Features a customized dynamic hook wrapper (`updateAuthUser`) that directly mutates active state models inside the React global context layer to reflect parameter changes instantaneously without requiring system logouts.

---

## ⚡ Core Tech Stack Matrix

### Backend Architecture
* **Framework:** ASP.NET Core Web API (C# / .NET Core)
* **ORM / Data Layer:** Entity Framework Core (EF Core) utilizing LINQ expressions
* **Database Engine:** Microsoft SQL Server (RDBMS standard with 18,2 share precision scaling)
* **Security & Auth:** JWT Bearer tokens with BCrypt.NET micro-encryption password hashing

### Client Interface Layer
* **Core Library:** React.js (Single Page Application via Vite Bundler)
* **Routing Guard System:** React Router DOM v6 with isolated private authentication checks
* **HTTP Infrastructure:** Axios client configured with automatic request/response interceptors
* **Layout Design UI:** Bootstrap 5 layout responsive grids and customized premium glassmorphism styling accents

---
