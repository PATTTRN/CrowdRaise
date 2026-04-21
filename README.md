# Crowdraise - Fundraising Platform

A modern, responsive fundraising platform built with Next.js 15 and Tailwind CSS.

## Features

- **Create Collection Page**: Multi-step form for creating fundraising collections
- **Collections Page**: Detailed collection view with donation functionality
- **Explore Page**: Browse and discover all collections with search and filtering
- **Dashboard**: Collection creator dashboard to track performance and donations
- **Admin Dashboard**: Platform owner dashboard for collection management
- **Modern UI**: Beautiful glassmorphism design with animations
- **Responsive Design**: Works perfectly on all devices
- **Form Validation**: Step-by-step validation with character counting
- **Image Upload**: Support for multiple collection images
- **Progress Tracking**: Visual progress indicator through collection creation steps
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
│       ├── create_collection/
│       │   └── page.tsx          # Create collection form
│       ├── collection/
│       │   └── page.tsx          # Individual collection view
│       ├── explore/
│       │   └── page.tsx          # Browse all collections
│       ├── dashboard/
│       │   └── page.tsx          # Collection creator dashboard
│       ├── admin_dashboard/
│       │   └── page.tsx          # Platform admin dashboard
│       ├── globals.css           # Global styles and animations
│       └── layout.tsx            # Root layout with Font Awesome
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## Pages

### Create Collection Page (`/create_collection`)

The create collection page features:

1. **Step 1: Collection Details**
   - Collection title (with character count)
   - Category selection
   - Funding goal (with currency symbol)
   - Short description (with character count)

2. **Step 2: Media & Story**
   - Image upload with preview
   - Full story text (with character count)
   - Fund usage breakdown

3. **Step 3: Review & Launch**
   - Collection preview
   - Terms agreement
   - Launch button

#### Features

- **Multi-step Navigation**: Progress indicator with step validation
- **Form Validation**: Required field validation with visual feedback
- **Character Counting**: Real-time character count with warning indicators
- **Image Management**: Upload, preview, and remove collection images
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animations**: Smooth transitions and hover effects
- **Glassmorphism UI**: Modern backdrop blur and transparency effects

### Collection Page (`/collection/[id]`)

The individual collection page displays a detailed view of a fundraising collection with:

#### Collection Information
- **Collection Header**: Title, category, creator, location, and creation date
- **Image Gallery**: Main image with thumbnail navigation
- **Collection Story**: Detailed narrative about the collection
- **Fund Usage Breakdown**: How donations will be allocated

#### Donation Interface
- **Progress Tracking**: Visual progress bar showing raised vs. goal
- **Collection Stats**: Number of supporters and days remaining
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
- **Social Integration**: Share collection across social platforms
- **Responsive Layout**: Optimized for all screen sizes
- **Glassmorphism Design**: Modern backdrop blur effects
- **Smooth Animations**: Hover effects and transitions

### Explore Page (`/explore`)

The explore page allows users to discover and browse all collections:

#### Search and Discovery
- **Search Functionality**: Find collections by title, description, or creator
- **Category Filtering**: Filter by collection category
- **Sorting Options**: Sort by newest, most popular, ending soon, or highest goal
- **Results Count**: Display number of collections found

#### Collection Grid
- **Collection Cards**: Beautiful cards with collection images and key information
- **Status Indicators**: Visual status badges (active, completed, pending)
- **Progress Bars**: Show fundraising progress for each collection
- **Quick Stats**: Raised amount, supporters, and days remaining

#### Features

- **Advanced Filtering**: Multiple filter combinations
- **Responsive Grid**: Adapts to different screen sizes
- **Interactive Cards**: Hover effects and smooth transitions
- **Navigation**: Click cards to view individual collections
- **Load More**: Pagination for large numbers of collections

### Dashboard (`/dashboard`)

The collection creator dashboard provides comprehensive collection management:

#### Overview Tab
- **Performance Metrics**: Total collections, active collections, total raised, supporters
- **Statistics Cards**: Visual representation of key metrics
- **Quick Actions**: Create new collection, export reports
- **Recent Activity**: Latest donations and collection updates

#### My Collections Tab
- **Collection List**: Grid view of all user collections
- **Status Tracking**: Visual status indicators for each collection
- **Progress Monitoring**: Real-time progress bars and statistics
- **Collection Actions**: View, edit, and manage collections

#### Donations Tab
- **Donation History**: Complete list of all donations received
- **Donor Information**: Donor names, amounts, dates, and messages
- **Collection Mapping**: Link donations to specific collections
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
- **Platform Statistics**: Total collections, users, funds raised, platform fees
- **Collection Status Overview**: Pending, approved, and rejected collection counts
- **Quick Actions**: Review collections, export reports, access settings
- **Performance Metrics**: Platform-wide statistics and insights

#### Collection Management
- **Pending Review**: Collections awaiting approval with approve/reject actions
- **Approved Collections**: Live collections with suspend options
- **Rejected Collections**: Rejected collections with rejection reasons
- **Search and Filter**: Find specific collections quickly

#### Collection Actions
- **Approve Collections**: One-click approval for pending collections
- **Reject with Reason**: Provide detailed rejection feedback
- **Suspend Collections**: Temporarily disable approved collections
- **View Details**: Access complete collection information

#### Features

- **Admin Controls**: Full platform management capabilities
- **Status Tracking**: Monitor all collection statuses
- **Bulk Actions**: Efficient collection processing
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

### Collection Creators
- Create and manage fundraising collections
- Track donations and supporter engagement
- Monitor collection performance metrics
- Access personalized dashboard

### Platform Users
- Browse and discover collections
- Make donations with various payment options
- Share collections on social media
- Track donation history

### Platform Admins
- Review and approve/reject collection submissions
- Monitor platform performance and statistics
- Manage user accounts and collection statuses
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
