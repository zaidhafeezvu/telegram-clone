# Telegram Clone

A modern, real-time messaging application inspired by Telegram, built with Next.js 15, TypeScript, and PostgreSQL.

## Features

- 🔐 User authentication (email/password)
- 💬 Real-time messaging
- 👥 One-on-one chats
- 📱 Responsive design (mobile & desktop)
- 🌓 Dark mode support
- 👤 User profiles
- 🔔 Message notifications
- ⚡ Fast and performant

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- pnpm installed (`npm install -g pnpm`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd telegram-clone
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update with your database credentials:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/telegram
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

4. Set up the database:

First, create a PostgreSQL database named `telegram` (or use your preferred name and update `.env`):
```bash
# Using PostgreSQL command line
createdb telegram

# Or using psql
psql -U postgres -c "CREATE DATABASE telegram;"
```

Then run the migrations:
```bash
pnpm db:generate  # Generate migration files (already done)
pnpm db:migrate   # Apply migrations to database
```

5. (Optional) Seed the database with demo data:
```bash
pnpm db:seed
```

This creates three demo users:
- alice@example.com / password123
- bob@example.com / password123
- charlie@example.com / password123

6. Start the development server:
```bash
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

**Option A: Use Demo Data (Recommended for testing)**
1. Run `pnpm db:seed` to create demo users
2. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
3. Sign in with any demo account (e.g., alice@example.com / password123)
4. Start messaging!

**Option B: Create New Account**
1. Navigate to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Create your account
3. Sign in and start messaging!

## Project Structure

```
telegram-clone/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages (login, signup)
│   ├── api/               # API routes
│   │   ├── auth/          # Auth endpoints
│   │   ├── chats/         # Chat management
│   │   ├── messages/      # Message handling
│   │   └── users/         # User management
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main messaging page
├── components/            # React components
│   ├── ChatList.tsx       # Chat list sidebar
│   ├── ChatWindow.tsx     # Message display & input
│   └── NewChatModal.tsx   # New chat creation modal
├── lib/                   # Utility libraries
│   ├── auth/              # Authentication config
│   └── db/                # Database config & schema
└── public/                # Static assets
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome
- `pnpm db:generate` - Generate database migration files
- `pnpm db:migrate` - Apply migrations to database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)
- `pnpm db:seed` - Seed database with demo data

## Database Schema

The app uses the following main tables:

- **users**: User accounts and profiles
- **chats**: Chat conversations (1-on-1 and groups)
- **chat_participants**: Links users to chats
- **messages**: Individual messages in chats

## Features Overview

### Authentication
- Email/password authentication using Better Auth
- Secure password hashing with bcryptjs
- Session management

### Messaging
- Send and receive text messages
- Real-time updates via polling
- Message history
- Typing indicators (placeholder)

### User Interface
- Clean, modern Telegram-inspired design
- Blue accent color scheme
- Responsive layout for mobile and desktop
- Dark mode support
- Avatar placeholders with initials

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
