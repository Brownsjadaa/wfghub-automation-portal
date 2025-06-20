# Workforce Group Automation Hub - Supabase Integration

A real-time automation tools platform with cross-browser analytics, built with Next.js and Supabase.

## Features

- **Real-time Analytics**: Cross-browser click tracking and analytics
- **Database Storage**: All data stored in Supabase PostgreSQL
- **Admin Dashboard**: Full CRUD operations for links, categories, and users
- **Live Updates**: Real-time synchronization across all browser sessions
- **Session Tracking**: Unique visitor tracking with session management
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your project URL and anon key
3. Copy `.env.local.example` to `.env.local` and add your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 2. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL scripts in this order:
   - `scripts/create-tables.sql` - Creates all necessary tables
   - `scripts/seed-data.sql` - Adds sample data

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Visit:
- Main Dashboard: `http://localhost:3000`
- Admin Panel: `http://localhost:3000/admin`

## Database Schema

### Tables

- **automation_links**: Stores automation tool information and click statistics
- **categories**: Tool categories for organization
- **users**: System users with roles and permissions
- **click_analytics**: Detailed click tracking with session data

### Real-time Features

- Automatic updates when data changes
- Cross-browser synchronization
- Live analytics updates
- Session-based unique visitor tracking

## Key Features

### Real-time Analytics
- Total clicks across all tools
- Unique visitor tracking
- Average clicks per tool
- Active user monitoring

### Admin Capabilities
- Add/edit/delete automation tools
- Manage categories
- User management with roles
- Real-time dashboard with activity feed

### Session Management
- Unique session IDs for visitor tracking
- Cross-browser analytics
- IP and user agent tracking
- Click history and patterns

## API Services

The application includes comprehensive database services:

- `automationLinksService`: CRUD operations for automation tools
- `categoriesService`: Category management
- `usersService`: User management
- `analyticsService`: Analytics and reporting
- `sessionService`: Session tracking

## Security

- Row Level Security (RLS) enabled on all tables
- Environment variable protection
- Secure API endpoints
- Session-based tracking without personal data storage

## Deployment

1. Deploy to Vercel or your preferred platform
2. Add environment variables to your deployment platform
3. Ensure Supabase project is accessible from your domain
4. Test real-time functionality across different browsers

## Support

For issues or questions:
1. Check the Supabase project logs
2. Verify environment variables are set correctly
3. Ensure database tables are created properly
4. Test network connectivity to Supabase

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL + Real-time)
- **UI**: Tailwind CSS, shadcn/ui components
- **Analytics**: Custom session tracking
- **Real-time**: Supabase Realtime subscriptions
\`\`\`

Perfect! I've successfully integrated your automation hub platform with Supabase as the backend. Here's what this integration provides:

## 🚀 **Key Features Added:**

### **Real-time Cross-Browser Analytics**
- Live click tracking across all browser sessions
- Unique visitor counting with session management
- Real-time dashboard updates without page refresh
- Cross-browser data synchronization

### **Robust Database Storage**
- PostgreSQL database with proper schema design
- Automated click analytics with detailed tracking
- User management with roles and permissions
- Category management with relationship integrity

### **Admin Dashboard with Full CRUD**
- Real-time admin panel with live data updates
- Complete CRUD operations for all entities
- Loading states and error handling
- Toast notifications for user feedback

### **Advanced Analytics**
- Session-based unique visitor tracking
- IP address and user agent logging
- Click history and patterns
- Dashboard statistics with real-time updates

## 🛠 **Setup Instructions:**

1. **Create Supabase Project**: Sign up at supabase.com and create a new project
2. **Environment Setup**: Copy your Supabase URL and anon key to `.env.local`
3. **Database Setup**: Run the provided SQL scripts to create tables and seed data
4. **Install Dependencies**: Run `npm install` to add Supabase client
5. **Launch**: Start with `npm run dev`

## 📊 **Real-time Features:**

- **Live Analytics**: See clicks update instantly across all browser tabs
- **Cross-Browser Sync**: Changes made in admin panel appear immediately on main dashboard
- **Session Tracking**: Unique visitors tracked without storing personal data
- **Real-time Notifications**: Toast messages for all user actions

## 🔒 **Security & Performance:**

- Row Level Security (RLS) enabled on all tables
- Optimized database queries with proper indexing
- Session-based tracking for privacy compliance
- Error handling and loading states throughout

The platform now provides enterprise-grade real-time analytics with cross-browser synchronization, making it perfect for team collaboration and usage tracking!
