# Frontend Design System - HTN2025 Course Assistant

## Overview
This document outlines the design system and UI/UX specifications for the HTN2025 Course Assistant frontend application. The design follows LinkedIn-inspired principles with a premium, professional aesthetic.

## Design Philosophy

### Core Principles
- **Professional & Premium**: Clean, sophisticated interface similar to LinkedIn
- **User-Centric**: Intuitive navigation and clear information hierarchy
- **Accessible**: WCAG 2.1 AA compliant design patterns
- **Responsive**: Mobile-first approach with desktop optimization
- **Consistent**: Unified design language across all components

### Visual Identity
- **Primary Color**: LinkedIn Blue (#0066CC)
- **Background**: Professional Gray (#F3F2EF)
- **Typography**: System fonts (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- **Shadows**: Subtle elevation with professional drop shadows
- **Border Radius**: 8px-16px for modern, friendly appearance

## Layout Architecture

### Navigation Structure
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Hack the North    [Tabs]    [User Avatar]       │
│         Course Assistant                                │
└─────────────────────────────────────────────────────────┘
│                                                         │
│  Tab Content Area                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  Main Content (Cards, Forms, etc.)             │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Tab Navigation
- **Chat with AI**: AI-powered course assistance
- **Discover**: Course discovery and enrollment
- **Your Calendar**: Personal schedule management
- **Your Profile**: User settings and academic info

## Component Design System

### 1. Cards
```css
.card-linkedin {
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.card-linkedin:hover {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}
```

### 2. Buttons
```css
.btn-primary-linkedin {
  background: #0066CC;
  color: white;
  border-radius: 24px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #0066CC;
  transition: all 0.15s ease;
}

.btn-secondary-linkedin {
  background: white;
  color: #0066CC;
  border: 1px solid #0066CC;
  border-radius: 24px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
}
```

### 3. Form Elements
```css
.input-linkedin {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.15s ease;
}

.input-linkedin:focus {
  border-color: #0066CC;
  box-shadow: 0 0 0 1px #0066CC;
  outline: none;
}
```

### 4. Typography
```css
.heading-linkedin {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  line-height: 1.25;
}

.subheading-linkedin {
  font-size: 16px;
  color: #6B7280;
  font-weight: 400;
}

.text-linkedin {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}
```

## Page-Specific Designs

### 1. Chat with AI Page
- **Layout**: Full-width chat interface with message bubbles
- **User Messages**: Blue background (#0066CC), right-aligned
- **AI Messages**: Gray background (#F3F4F6), left-aligned
- **Input**: Fixed bottom input with send button
- **Quick Actions**: Grid of suggested prompts below chat

### 2. Discover Page
- **Layout**: 3-column grid of course cards
- **Course Cards**: 
  - Header with course name, code, and credits
  - Professor info with star ratings
  - Course details (time, location, days)
  - Enrollment progress bar
  - Action buttons (Enroll, Favorite)
- **Search**: Top search bar with category filter
- **Filters**: Dropdown for course categories

### 3. Calendar Page
- **Layout**: Weekly calendar grid
- **Header**: Week navigation with month/year display
- **Grid**: 7-day columns with time slots
- **Events**: Color-coded course blocks
- **Sidebar**: Today's schedule summary

### 4. Profile Page
- **Layout**: Two-column layout (profile info + settings)
- **Profile Card**: Avatar, name, school info, academic stats
- **Settings**: Toggle switches for notifications and preferences
- **Account Actions**: Security and data management options

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- **Navigation**: Collapsible tab labels
- **Cards**: Single column layout
- **Forms**: Full-width inputs
- **Touch Targets**: Minimum 44px touch area

## Animation & Interactions

### Transitions
- **Hover Effects**: 0.15s ease transitions
- **Card Hover**: translateY(-1px) with shadow increase
- **Button Hover**: Background color changes
- **Form Focus**: Border color and shadow changes

### Loading States
- **Skeleton Loading**: Gray placeholder blocks
- **Spinner**: Rotating circle for async operations
- **Progress Bars**: Animated progress indicators

## Accessibility

### Color Contrast
- **Text on White**: 4.5:1 minimum contrast ratio
- **Interactive Elements**: 3:1 minimum contrast ratio
- **Focus Indicators**: 2px solid outline

### Keyboard Navigation
- **Tab Order**: Logical flow through interactive elements
- **Focus Management**: Clear focus indicators
- **Skip Links**: Jump to main content

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Descriptive labels for complex interactions
- **Alt Text**: Meaningful descriptions for images

## Implementation Notes

### CSS Architecture
- **Tailwind CSS**: Utility-first approach
- **Custom Components**: LinkedIn-style component classes
- **CSS Variables**: Consistent spacing and colors
- **Mobile-First**: Responsive design patterns

### Component Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   └── NavBar.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
├── pages/
│   ├── MainApp.tsx
│   ├── ChatWithAIPage.tsx
│   ├── DiscoverPage.tsx
│   ├── CalendarPage.tsx
│   └── ProfilePage.tsx
└── styles/
    └── index.css
```

### Design Tokens
```css
:root {
  --color-primary: #0066CC;
  --color-background: #F3F2EF;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --border-radius: 8px;
  --border-radius-lg: 16px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
  --transition: all 0.15s ease;
}
```

## Future Enhancements

### Phase 2 Features
- **Dark Mode**: Toggle between light and dark themes
- **Advanced Filters**: More sophisticated course filtering
- **Notifications**: Real-time push notifications
- **Offline Support**: PWA capabilities

### Design System Evolution
- **Component Library**: Reusable design system components
- **Design Tokens**: Centralized design variables
- **Storybook**: Component documentation and testing
- **Accessibility Testing**: Automated a11y validation

## Quality Assurance

### Design Review Checklist
- [ ] Consistent spacing and typography
- [ ] Proper color contrast ratios
- [ ] Responsive behavior across devices
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Performance optimization
- [ ] Cross-browser compatibility

### Testing Requirements
- **Visual Regression**: Automated screenshot testing
- **Accessibility**: Automated a11y testing
- **Performance**: Core Web Vitals monitoring
- **Cross-Browser**: Testing on major browsers
- **Mobile**: Device-specific testing

---

*This design system ensures a consistent, professional, and accessible user experience across the HTN2025 Course Assistant application.*
