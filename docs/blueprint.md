# **App Name**: ConstructWise

## Core Features:

- Offline Data Management: Enable 100% offline functionality for creating, reading, updating, and deleting construction project data, including projects, phases, tasks, photos, and visits using WatermelonDB.
- Optional Firebase Synchronization: Provide optional synchronization with Firebase (Firestore, Storage, Auth) to back up and sync local data, allowing users to manually trigger sync or rely on automatic syncing when online.
- Project Management: Enable users to create, list, and manage construction projects with details like name, address, client, start date, and project type, including a header with a cover photo and key project information. React Native and WatermelonDB are core technologies.
- Task Management: Allow users to create and manage tasks for each project, including descriptions, assignees, priorities, and completion status. Enable filtering and marking tasks as complete. React Native and WatermelonDB are core technologies.
- Photo and Annotation Capture: Allow users to capture and associate photos with comments for progress tracking, including a visual gallery and the ability to delete photos to free up local space. React Native and WatermelonDB are core technologies.
- Visit Logging: Implement a feature to log site visits, including date, current phase, attendees, and detailed observations, with editing and deletion capabilities. React Native and WatermelonDB are core technologies.
- Data Export and Import: Provide functionality to export entire project data, including photos (base64 encoded) and attachments, into a JSON file for local backup and sharing, with structure validation on import. React Native and WatermelonDB are core technologies.

## Style Guidelines:

- Primary color: Professional blue (#2563EB), evoking trust and reliability.
- Background color: Light gray (#F5F5F5) to ensure a clean, modern look.
- Accent color: Vivid orange (#F97316) for action items and important notifications.
- Headline font: 'Space Grotesk' (sans-serif) for headings to convey a contemporary, technological feel. Body font: 'Inter' (sans-serif) for a modern and neutral aesthetic. Note: currently only Google Fonts are supported.
- Use clear, recognizable icons for project phases, task priorities, and data types. Use a consistent style from React Native Vector Icons.
- Implement a tab-based navigation for main sections (Projects, Tasks, Photos, Visits). Use cards for displaying individual items with clear visual hierarchy.
- Subtle animations for loading states, transitions, and button interactions to improve user experience.