# CBRE Asset Management System

This project is a web-based Asset Management System designed for a real estate company to manage asset information visually and efficiently. It replaces the traditional Excel-based management with a modern web interface featuring an interactive map and detailed asset cards.

## 📋 Project Overview

-   **Goal**: Visualize and manage real estate assets on a web platform.
-   **Key Features**:
    -   **Interactive Map**: View assets on a map with clustering and filtering capabilities.
    -   **Asset List**: Card-style list view of assets synchronized with the map.
    -   **Detail View**: Comprehensive asset details (General, History, Floor, Rent, etc.) in a separate window.
    -   **Admin Panel**: CRUD operations for assets, accessible via `/admin`.
    -   **Address Refinement**: 3-step strategy to ensure accurate address and coordinate data.

## 🛠 Tech Stack

-   **Framework**: [Nuxt 3](https://nuxt.com/) (v3.6.5)
-   **UI Library**: [Vue 3](https://vuejs.org/) (v3.3.7)
-   **State Management**: [Pinia](https://pinia.vuejs.org/)
-   **Data Fetching**: [Vue Query](https://tanstack.com/query/latest)
-   **Database ORM**: [Prisma](https://www.prisma.io/)
-   **Map**: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
-   **Storage**: MinIO (S3 Compatible)
-   **Language**: TypeScript (UI in English, Comments/Logs in Korean)

## 🚀 Getting Started

### Prerequisites

-   Node.js (Latest LTS recommended)
-   PostgreSQL
-   MinIO Server

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd cbre-nuxt-vuequery-pinia-prisma-v2
    ```
# CBRE Asset Management System

This project is a web-based Asset Management System designed for a real estate company to manage asset information visually and efficiently. It replaces the traditional Excel-based management with a modern web interface featuring an interactive map and detailed asset cards.

## 📋 Project Overview

-   **Goal**: Visualize and manage real estate assets on a web platform.
-   **Key Features**:
    -   **Interactive Map**: View assets on a map with clustering and filtering capabilities.
    -   **Asset List**: Card-style list view of assets synchronized with the map.
    -   **Detail View**: Comprehensive asset details (General, History, Floor, Rent, etc.) in a separate window.
    -   **Admin Panel**: CRUD operations for assets, accessible via `/admin`.
    -   **Address Refinement**: 3-step strategy to ensure accurate address and coordinate data.

## 🛠 Tech Stack

-   **Framework**: [Nuxt 3](https://nuxt.com/) (v3.6.5)
-   **UI Library**: [Vue 3](https://vuejs.org/) (v3.3.7)
-   **State Management**: [Pinia](https://pinia.vuejs.org/)
-   **Data Fetching**: [Vue Query](https://tanstack.com/query/latest)
-   **Database ORM**: [Prisma](https://www.prisma.io/)
-   **Map**: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
-   **Storage**: MinIO (S3 Compatible)
-   **Language**: TypeScript (UI in English, Comments/Logs in Korean)

## 🚀 Getting Started

### Prerequisites

-   Node.js (Latest LTS recommended)
-   PostgreSQL
-   MinIO Server

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd cbre-nuxt-vuequery-pinia-prisma-v2
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    -   Create `.env` (for server) and `.env.local` (for local dev) based on the provided templates.
    -   Ensure database and MinIO connection strings are correct.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🔮 Future Considerations

### Address Refinement Strategy

We are considering a **3-Step Address Refinement Strategy** to ensure data accuracy using Kakao Local API and Ministry of the Interior and Safety API. This feature is currently under review for future implementation.

| Step | Action | API Used | Purpose |
| :--- | :--- | :--- | :--- |
| **1** | **Search & Refine** | Kakao Local API | Convert user input to a standardized Korean address. |
| **2** | **Get Coordinates** | Kakao Local API | Obtain precise Latitude ($Y$) and Longitude ($X$). |
| **3** | **English Conversion** | MOIS API | Convert to the official English road name address. |

> For full details, refer to `ADDRESS_STRATEGY.md`.

## 📂 Project Structure

-   `components/`: Reusable Vue components (Map, Property, Admin, etc.)
-   `pages/`: Application routes (Home, Property Detail, Admin)
-   `stores/`: Pinia stores for state management (Map, Property, UI)
-   `server/`: API routes and Prisma integration
-   `prisma/`: Database schema and migrations

## 📝 License

[Private / Proprietary]