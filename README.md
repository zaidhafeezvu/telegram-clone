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

Edit `.env` and update with your database credentials and secrets:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/telegram
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

4. Run database migrations:
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

5. Start the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

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
