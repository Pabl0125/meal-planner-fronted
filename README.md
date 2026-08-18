# Meal Planner Frontend

A modern, interactive frontend application for planning weekly meals, managing recipes, and generating menus with the help of an AI Assistant. 

Built with Next.js, React, and Tailwind CSS.

## Features

- **Interactive Weekly Planner**: Drag and drop dishes into lunch and dinner slots across the week using an intuitive interface.
- **AI Assistant Integration**: Chat with a contextual AI that understands your current menu and available dishes, and can automatically assign meals or clear your week based on nutritional guidelines.
- **Dish & Tag Management**: Create, edit, and categorize your dishes with custom color-coded tags.
- **PDF Export**: Generate perfectly formatted, print-ready A4 PDF documents of your weekly meal plan.
- **Dark & Light Mode**: Seamless theme switching that adapts to your system preferences.
- **Mobile Responsive**: Fully usable on mobile and tablet devices with specialized touch-friendly interactions.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **PDF Generation**: `html2canvas` & `jspdf`
- **Deployment**: Docker ready (Multi-stage builds)

## Prerequisites

- Node.js (v18 or higher)
- A running instance of the Meal Planner Backend API (Spring Boot).

## Getting Started (Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pabl0125/menu-planner-fronted.git
   cd menu-planner-fronted
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory and specify your backend API URL (optional if running the backend locally on port 8081):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8081/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment (Docker)

This project is optimized for deployment on a home server or VPS using Docker. The build process uses Next.js standalone mode for a lightweight image.

1. **Configure your API endpoint in `docker-compose.yml`**:
   Ensure `NEXT_PUBLIC_API_URL` points to your backend instance.

2. **Build and start the container:**
   ```bash
   docker compose up -d --build
   ```

3. **Access the application:**
   The application will be running on port 3000 of your host machine.

## Project Structure

- `/app`: Next.js App Router entry points and global styles.
- `/components`: Reusable UI components.
  - `/planner`: Core feature components (Dashboard, AI Widget, Modals, Drag & Drop slots).
  - `/ui`: Generic UI elements (Cards, Badges, Buttons).
- `/lib`: Utility functions and API integration layer.
- `/types`: TypeScript definitions for API responses and internal state.
