# Real-Time Task and Project Management Application
A realtime collaborative application for managing boards and items inside boards such as notes, tasklists, polls, etc. It enables teams and project managers to provide a collaborative space to manage their tasks and project announcements with proper access control. Implemented using nest js for server-side, prisma and postgres for database management, and vite, react, tanstack router/query for client-side.

## Key Features
- Authentication:
  - Token-based authentication with refresh/access pattern.
  - Authenticate users with email and password using OTP verification, along with google oauth.
- Authorization:
  - Combine RBAC and ABAC with casl library in both server and client side for a secure ACL.
  - Owners can manage items and members, edit info and delete the board.
  - Managers can manage items and some members, edit info but not delete the board.
  - Members can only read and collaborate on existing items, with no ability to post.
- Board Management:
  - Create, edit, and delete boards.
  - Invite users to boards with a default role of member.
  - Owners can promote or demote user to managers or members.
- Item Management:
  - Owners and managers can post, edit and delete items.
  - Simple note items are supported now, with plans to add tasklists, polls, and more.
- User Invitation And Notification System:
  - Owners and managers can invite users by their email address and read board's invitations history.
  - Invitees receive a notification and may accept or reject the invite.
- Realtime Collaboration:
  - All operations, including notifications, boards and notes management are updated in realtime across all connected clients in socket-io platform.

## Technologies Used
- Server-Side
  - NestJS for API development.
  - Prisma for ORM and database management with PostgreSQL.
  - Passport for google oauth integration.
  - Casl for checking authorization and ACL.
  - Socket-IO for realtime implementation.
- Client-Side
  - Vite for fast React app development.
  - React for building dynamic and responsive user interfaces.
  - TanStack Router for client-side routing.
  - TanStack Query for data fetching, caching, and mutation.
  - Zustand for client-side state management.
  - React-Hook-Form + Zod for form handling and validation.

## Getting Started
To set up the project locally, follow these steps:
### Prerequisites
- Node.js (v14 or higher).
- PostgreSQL database (local or cloud).
- Google Developer Console account (for generating OAuth credentials).
### Setup Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/nimaazmdv/enbord.git
    cd enbord
    ```
2. Install dependencies for both backend and frontend:
    ```
    # Backend
    cd server
    npm install
    
    # Frontend
    cd client
    npm install
    ```
3. Set up your environment variables:
   - Copy `.env.example` to `.env` in the server directory.
   - Fill the variables with your own secrets and credentials (See below).
4. Generate Google OAuth Credentials:
   - Go to the Google Developer Console.
   - Create a new project, Under Credentials, create OAuth 2.0 Client IDs for both development and production environments.
   - Add `http://localhost:3000/api/auth/google/callback` as an authorized redirect URI for local development (replace localhost:3000 with your actual production URL when deploying).
   - Copy the Client ID and Client Secret into the `.env` file.
5. Migrate the database:
   - Run the Prisma migration to set up the database schema:
      ```bash
      cd server
      npm run db:migrate dev --name init
      ```
6. Run the app:
   - Start the server
      ```bash
      cd server
      npm run start:dev
      ```
   - Start the client
      ```bash
      cd client
      npm run dev
      ```
The application should now be running at http://localhost:3000.

## Features to Implement
- Task Lists: Add functionality to create, assign, and track tasks within boards.
- Polls and Surveys: Allow users to post and participate in polls.
- User Profiles: Ability to edit user profiles and settings.
- Advanced Search: Implement search functionality for boards and tasks.

## Contributing
Feel free to fork the repository, submit issues, or open pull requests! Contributions are always welcome.
