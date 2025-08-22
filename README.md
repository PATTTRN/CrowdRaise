# Crowdraise - Fundraising Platform

A modern, responsive fundraising platform built with Next.js 15 and Tailwind CSS.

## Features

- **Create Campaign Page**: Multi-step form for creating fundraising campaigns
- **Campaigns Page**: Detailed campaign view with donation functionality
- **Explore Page**: Browse and discover all campaigns with search and filtering
- **Dashboard**: Campaign creator dashboard to track performance and donations
- **Admin Dashboard**: Platform owner dashboard for campaign management
- **Modern UI**: Beautiful glassmorphism design with animations
- **Responsive Design**: Works perfectly on all devices
- **Form Validation**: Step-by-step validation with character counting
- **Image Upload**: Support for multiple campaign images
- **Progress Tracking**: Visual progress indicator through campaign creation steps
- **Donation System**: Interactive donation interface with social sharing

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Font Awesome 6.4.0
- **Animations**: CSS animations and transitions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
crowdraise/
├── src/
│   └── app/
│       ├── create_campaign/
│       │   └── page.tsx          # Create campaign form
│       ├── campaign/
│       │   └── page.tsx          # Individual campaign view
│       ├── explore/
│       │   └── page.tsx          # Browse all campaigns
│       ├── dashboard/
│       │   └── page.tsx          # Campaign creator dashboard
│       ├── admin_dashboard/
│       │   └── page.tsx          # Platform admin dashboard
│       ├── globals.css           # Global styles and animations
│       └── layout.tsx            # Root layout with Font Awesome
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## Pages

### Create Campaign Page (`/create_campaign`)

The create campaign page features:

1. **Step 1: Campaign Details**
   - Campaign title (with character count)
   - Category selection
   - Funding goal (with currency symbol)
   - Short description (with character count)

2. **Step 2: Media & Story**
   - Image upload with preview
   - Full story text (with character count)
   - Fund usage breakdown

3. **Step 3: Review & Launch**
   - Campaign preview
   - Terms agreement
   - Launch button

#### Features

- **Multi-step Navigation**: Progress indicator with step validation
- **Form Validation**: Required field validation with visual feedback
- **Character Counting**: Real-time character count with warning indicators
- **Image Management**: Upload, preview, and remove campaign images
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animations**: Smooth transitions and hover effects
- **Glassmorphism UI**: Modern backdrop blur and transparency effects

### Campaign Page (`/campaign/[id]`)

The individual campaign page displays a detailed view of a fundraising campaign with:

#### Campaign Information
- **Campaign Header**: Title, category, creator, location, and creation date
- **Image Gallery**: Main image with thumbnail navigation
- **Campaign Story**: Detailed narrative about the campaign
- **Fund Usage Breakdown**: How donations will be allocated

#### Donation Interface
- **Progress Tracking**: Visual progress bar showing raised vs. goal
- **Campaign Stats**: Number of supporters and days remaining
- **Donation Options**: Pre-set amounts and custom input
- **Donate Button**: Interactive donation processing
- **Social Sharing**: Twitter, Facebook, WhatsApp, and link sharing

#### Recent Donations
- **Donor List**: Recent supporters with avatars and amounts
- **Real-time Updates**: Live donation tracking
- **Interactive Elements**: Hover effects and animations

#### Features

- **Interactive Gallery**: Click thumbnails to change main image
- **Progress Animation**: Animated progress bar with shimmer effect
- **Amount Selection**: Choose from preset amounts or enter custom
- **Social Integration**: Share campaign across social platforms
- **Responsive Layout**: Optimized for all screen sizes
- **Glassmorphism Design**: Modern backdrop blur effects
- **Smooth Animations**: Hover effects and transitions

### Explore Page (`/explore`)

The explore page allows users to discover and browse all campaigns:

#### Search and Discovery
- **Search Functionality**: Find campaigns by title, description, or creator
- **Category Filtering**: Filter by campaign category
- **Sorting Options**: Sort by newest, most popular, ending soon, or highest goal
- **Results Count**: Display number of campaigns found

#### Campaign Grid
- **Campaign Cards**: Beautiful cards with campaign images and key information
- **Status Indicators**: Visual status badges (active, completed, pending)
- **Progress Bars**: Show fundraising progress for each campaign
- **Quick Stats**: Raised amount, supporters, and days remaining

#### Features

- **Advanced Filtering**: Multiple filter combinations
- **Responsive Grid**: Adapts to different screen sizes
- **Interactive Cards**: Hover effects and smooth transitions
- **Navigation**: Click cards to view individual campaigns
- **Load More**: Pagination for large numbers of campaigns

### Dashboard (`/dashboard`)

The campaign creator dashboard provides comprehensive campaign management:

#### Overview Tab
- **Performance Metrics**: Total campaigns, active campaigns, total raised, supporters
- **Statistics Cards**: Visual representation of key metrics
- **Quick Actions**: Create new campaign, export reports
- **Recent Activity**: Latest donations and campaign updates

#### My Campaigns Tab
- **Campaign List**: Grid view of all user campaigns
- **Status Tracking**: Visual status indicators for each campaign
- **Progress Monitoring**: Real-time progress bars and statistics
- **Campaign Actions**: View, edit, and manage campaigns

#### Donations Tab
- **Donation History**: Complete list of all donations received
- **Donor Information**: Donor names, amounts, dates, and messages
- **Campaign Mapping**: Link donations to specific campaigns
- **Export Options**: Download donation reports

#### Features

- **Tabbed Interface**: Organized sections for different functions
- **Real-time Updates**: Live statistics and progress tracking
- **Interactive Elements**: Hover effects and smooth animations
- **Responsive Design**: Works on all devices
- **Data Visualization**: Charts and progress indicators

### Admin Dashboard (`/admin_dashboard`)

The platform owner dashboard for managing the entire platform:

#### Overview Tab
- **Platform Statistics**: Total campaigns, users, funds raised, platform fees
- **Campaign Status Overview**: Pending, approved, and rejected campaign counts
- **Quick Actions**: Review campaigns, export reports, access settings
- **Performance Metrics**: Platform-wide statistics and insights

#### Campaign Management
- **Pending Review**: Campaigns awaiting approval with approve/reject actions
- **Approved Campaigns**: Live campaigns with suspend options
- **Rejected Campaigns**: Rejected campaigns with rejection reasons
- **Search and Filter**: Find specific campaigns quickly

#### Campaign Actions
- **Approve Campaigns**: One-click approval for pending campaigns
- **Reject with Reason**: Provide detailed rejection feedback
- **Suspend Campaigns**: Temporarily disable approved campaigns
- **View Details**: Access complete campaign information

#### Features

- **Admin Controls**: Full platform management capabilities
- **Status Tracking**: Monitor all campaign statuses
- **Bulk Actions**: Efficient campaign processing
- **Audit Trail**: Track all admin actions
- **Responsive Interface**: Mobile-friendly admin panel

## Styling

The project uses Tailwind CSS v4 with custom CSS for:

- Background particles animation
- Shimmer effects on form containers and progress bars
- Slide-in animations for success messages
- Custom form styling with glassmorphism effects
- Progress bar animations with shimmer overlays
- Duration utilities for extended transitions

## User Roles

### Campaign Creators
- Create and manage fundraising campaigns
- Track donations and supporter engagement
- Monitor campaign performance metrics
- Access personalized dashboard

### Platform Users
- Browse and discover campaigns
- Make donations with various payment options
- Share campaigns on social media
- Track donation history

### Platform Admins
- Review and approve/reject campaign submissions
- Monitor platform performance and statistics
- Manage user accounts and campaign statuses
- Access comprehensive admin dashboard

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
