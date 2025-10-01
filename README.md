# Little Bird - Political Intelligence Platform

A professional political intelligence platform designed for Colorado lobbying firms. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🏛️ Core Functionality
- **Bills Tracking**: Monitor Colorado General Assembly legislation
- **Legislator Profiles**: Track voting records and committee assignments
- **Lobbying Analytics**: Analyze lobbying patterns and political trends
- **Admin Panel**: Data synchronization and system management

### 🎨 Design System
- **Government-adjacent styling** with professional indigo-600 primary color
- **Empty state handling** throughout the application
- **Responsive design** optimized for desktop and mobile
- **Accessibility-first** approach with proper ARIA labels

### 🔧 Technical Architecture
- **Data abstraction layer** ready for real API integration
- **TypeScript interfaces** for all data structures
- **shadcn/ui components** for consistent UI
- **App Router** for modern Next.js routing
- **Tailwind CSS v4** with custom government styling

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main dashboard
│   ├── bills/             # Bills tracking page
│   ├── legislators/       # Legislators page
│   ├── analytics/         # Analytics and insights
│   └── dashboard/admin/   # Admin panel
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Sidebar navigation
│   └── layout.tsx        # Main layout wrapper
└── lib/                  # Utilities and data layer
    ├── data/             # Data abstraction layer
    │   ├── bills.ts      # Bills data functions
    │   ├── legislators.ts # Legislators data functions
    │   └── index.ts      # Data layer exports
    ├── types.ts          # TypeScript interfaces
    └── utils.ts          # Utility functions
```

## Data Architecture

### Bills Data (`/lib/data/bills.ts`)
- `fetchBills()` - Get all bills with filtering
- `getBillById()` - Get specific bill by ID
- `searchBills()` - Search bills by query
- `getBillsByStatus()` - Filter by bill status
- `getBillsByChamber()` - Filter by House/Senate
- `getBillsBySponsor()` - Filter by legislator

### Legislators Data (`/lib/data/legislators.ts`)
- `fetchLegislators()` - Get all legislators with filtering
- `getLegislatorById()` - Get specific legislator
- `searchLegislators()` - Search by name/party
- `getLegislatorsByParty()` - Filter by political party
- `getLegislatorsByChamber()` - Filter by House/Senate
- `getLegislatorsByCommittee()` - Filter by committee

## Integration Ready

### Colorado General Assembly API
The platform is architected to integrate with:
- **Colorado LCS API**: https://leg.colorado.gov/content/legislative-council-staff-api-documentation
- **Real-time bill tracking**
- **Legislator voting records**
- **Committee assignments**

### Database Integration
Ready for Supabase integration with:
- **Relational data structure** for bills, legislators, votes
- **Real-time updates** for live data
- **AI agent compatibility** for future automation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/KDL-tw/little-birdv2.git
cd little-birdv2

# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Setup
Create a `.env.local` file for API configuration:
```env
# Colorado General Assembly API
COLORADO_API_BASE=https://leg.colorado.gov/api
COLORADO_API_KEY=your_api_key_here

# Supabase (future integration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Current Status

### ✅ Completed
- [x] Next.js project setup with TypeScript and Tailwind CSS
- [x] shadcn/ui component integration
- [x] Government-adjacent design system with indigo-600 theme
- [x] Data abstraction layer with TypeScript interfaces
- [x] Empty state handling throughout the application
- [x] Bills page with search and filtering UI
- [x] Legislators page with contact information display
- [x] Admin panel with sync buttons
- [x] Analytics page for future insights
- [x] Navigation and layout components

### 🚧 Ready for Integration
- [ ] Colorado General Assembly API connection
- [ ] Supabase database integration
- [ ] Real-time data synchronization
- [ ] AI-powered analytics and insights
- [ ] Social network visualization
- [ ] Automated reporting

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Adding New Data Sources
1. Create new data functions in `/lib/data/`
2. Add TypeScript interfaces in `/lib/types.ts`
3. Update the data layer exports in `/lib/data/index.ts`
4. Create UI components to display the data
5. Add navigation links if needed

## Contributing

This project is designed for Colorado lobbying firms and political intelligence. When contributing:

1. Follow the existing TypeScript patterns
2. Use the established design system classes
3. Implement proper empty state handling
4. Add appropriate loading states
5. Ensure accessibility compliance

## License

Private project for Colorado lobbying intelligence platform.

---

**Little Bird** - Political Intelligence Platform for Colorado Lobbying Firms