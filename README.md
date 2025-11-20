# LocalWorks

## Overview

LocalWorks is a web application that connects homeowners and property managers with local tradespeople and service professionals. The platform allows users to browse tradesperson profiles, view their credentials and services, and contact them directly.

## Current Implementation Status

### Completed Features

-   **User Authentication**: Firebase-based authentication with email/password
-   **Dual Account Types**: Register as customer or tradesperson
-   **Profile Management**: Tradespeople can create/edit profiles with business details, skills, credentials, rates, and photos
-   **Dashboard**: Browse published tradesperson profiles
-   **Contact System**: Send inquiry messages to tradespeople
-   **Message Inbox**: Tradespeople can manage received messages (filter, read, delete)
-   **Unread Notifications**: Badge showing unread message count
-   **Role Switching**: Users can upgrade to tradesperson accounts
-   **Profile Visibility Toggle**: Draft/public profile status

### Not Yet Implemented

-   Search and filtering by skill/location
-   Real-time messaging/chat
-   Review and rating system
-   Geolocation features

## Original Overview

### Wake up to solutions, not problems.

You hear that familiar drip -- the leaky sink you’ve been meaning to fix but haven’t found the time to call someone for. With LocalWorks, that’s no longer a problem.

Whether you’re a homeowner or a property manager, LocalWorks connects you with trusted local professionals ready to help -- from plumbers and electricians to handymen and more. Find the right expert for your job in just minutes.

### About LocalWorks

LocalWorks is an intuitive web platform that helps homeowners and property managers discover skilled local tradespeople. Users can browse verified profiles, view credentials and service details, and connect directly with professionals for quotes or inquiries.

Anyone can join -- register as a customer to find help, or as a service provider to offer your expertise. Tradespeople can showcase their skills, credentials, rates, and service areas through personalized public profiles, making it easy for clients to find and trust the right professional for the job.

## Data Model

The application stores Users, Profiles, ContactMessages, Reviews (not implemented), Conversations (not implemented), and Messages (not implemented) in MongoDB.

### Implemented Collections

-   **Users**: Store user accounts with Firebase UID, email, name, and role (user/tradesperson/admin)
-   **Profiles**: Tradesperson profiles with business details, skills, credentials, location, rates, and photos
-   **ContactMessages**: Inquiry messages from users to tradespeople (implemented as simple contact form system)

### Planned Collections (OUTSIDE OF CLASS) (Schema defined, not yet implemented)

-   **Reviews**: User reviews and ratings for tradespeople
-   **Conversations**: Chat conversations between users and tradespeople
-   **Messages**: Individual messages within conversations

### Relationships

-   Users can have one Profile (if they are tradespeople)
-   User with role tradesperson can receive multiple ContactMessages
-   Profiles can have multiple Reviews (not yet implemented)
-   Users can have multiple Conversations (not yet implemented)

### Sample Documents

An Example User:

```javascript
{
  _id: // generated ID
  firebaseUid: "xyz123abc", // Firebase authentication UID
  name: "John Smith",
  email: "john@example.com",
  role: "tradesperson", // user, tradesperson, or admin
  createdAt: // timestamp
  updatedAt: // timestamp
}
```

Note: Passwords are managed by Firebase Authentication, not stored in MongoDB.

An Example Profile:

```javascript
{
  _id: // unique profile id
  user: // a reference to a user
  displayName: // name
  headline: "Licensed Electrician, 8+ yrs", // short profile message
  skills: ["electrical", "lighting", "panel upgrade"], // user defined
  credentials: [
    {"label": "State Electrical License", "issuer": "NY State", "id": "ELC-987654"}
  ], // user defined
  bio: "I help homeowners upgrade panels and improve lighting safely.",
  rate: {currency: "USD", amount: 85, unit: "hour"}, // optional rates
  location: {city: "Brooklyn", state: "NY", lat: 40.6782, lng: -73.9442}, // approx location
  serviceRadiusKm: 25,
  photos: ["https://…/profile1.jpg"], // profile photos maybe photos of jobs
  isPublished: true, // flag for having drafts (maybe)
  avgRating: 4.8, // determined by reviews either number or NULL
  reviewCount: 12,
  createdAt: // timestamp
  updatedAt: // timestamp
}
```

An Example ContactMessage:

```javascript
{
  _id: // unique id
  fromUser: // reference to user who sent
  toProfile: // reference to tradesperson's profile
  senderName: "Jane Doe",
  senderEmail: "jane@example.com",
  senderPhone: "555-1234", // optional
  message: "I need help with a leaking pipe. Are you available this week?",
  isRead: false,
  createdAt: // timestamp
  updatedAt: // timestamp
}
```

### Planned Schemas (NOT IMPLEMENTED FOR THIS PROJECT)

An Example Review:

```javascript
{
  _id: // unique id
  reviewer: // reference to user id
  profile: // reference to tradesperson's profile by id
  rating: 5,
  comment: "Quick response and great workmanship.",
  createdAt: // timestamp
}
```

An Example Conversation:

```javascript
{
  _id: // unique conversation id
  participants: [], // user IDs (tradesperson + user)
  lastMessageAt: // timestamp
  createdAt: // timestamp
}
```

An Example Message:

```javascript
{
  _id: // unique id
  conversation: // reference to conversation id
  sender: // reference to user who sent
  text: "Hi Bob, are you available this Saturday?",
  createdAt: // timestamp
  readAt: null // timestamp
}
```

## [Database Schema](server/db.mjs)

All Mongoose schemas are defined in `server/db.mjs`. Currently implemented models:

-   User
-   Profile
-   ContactMessage
-   Review (schema defined, not used)
-   Conversation (schema defined, not used)
-   Message (schema defined, not used)

## Wireframes

/ - home page / landing page

![Home](documentation/home.png)

/auth/(login or register)

![Auth](documentation/login.png)

/profile/:profile-slug (tradesperson)

![Profile](documentation/profile.png)

/dashboard (logged in user view)

![Dashboard](documentation/dashboard.png)

/messages

![Messages](documentation/messages.png)

## Site map

![SiteMap](documentation/sitemap.png)

## User Stories

### Implemented

-   As a visitor, I can view the landing page and navigate to registration/login
-   As a user, I can register with email/password as either a customer or tradesperson
-   As a user, I can log in and access protected features
-   As a tradesperson, I can create and edit my profile with business details, skills, and credentials
-   As a tradesperson, I can toggle my profile between draft and public visibility
-   As a user, I can browse all published tradesperson profiles on the dashboard
-   As a user, I can view tradesperson profile details in a modal
-   As a user, I can send contact messages to tradespeople
-   As a tradesperson, I can view all messages received from potential clients
-   As a tradesperson, I can filter messages by all/unread status
-   As a tradesperson, I can mark messages as read and delete messages
-   As a tradesperson, I can see an unread message badge in the navigation
-   As a user, I can upgrade my account to tradesperson status
-   As a user, I can edit my profile when viewing my own tradesperson profile

## Research Topics & Technical Implementation

### Completed (14 points total)

-   **(6 points) React Frontend**

    -   Built entire client application with React
    -   Implemented Context API for global authentication state management
    -   Created reusable component architecture (Navbar, ProfileCard, PrivateRoute)
    -   Used React hooks (useState, useEffect, useContext) for state and side effects
    -   Built controlled form components with real-time validation

-   **(2 points) React Router Dom**

    -   Integrated React Router for client-side routing
    -   Implemented createBrowserRouter for route configuration
    -   Used Navigate component for programmatic redirects
    -   Created route guards with PrivateRoute wrapper component
    -   Handled authentication-based navigation logic

-   **(1 point) Vite Build Tool**

    -   Configured Vite as build tool and development server
    -   Configured proxy for API requests during development

-   **(4 points) Firebase Authentication**

    -   Integrated Firebase Auth SDK on client for email/password auth
    -   Implemented Firebase Admin SDK on backend for secure token verification
    -   Created custom Express middleware to validate tokens and attach user data
    -   Coordinated authentication state between client and server
    -   Handled token refresh and session management
    -   Complex setup requiring Firebase console configuration, environment variables, and SDK coordination

-   **(1 point) Axios and CORS**
    -   Implemented Axios HTTP client with request/response interceptors
    -   Automatic Firebase token attachment to all API requests
    -   Configured CORS on Express server for cross-origin requests
    -   Set up credential handling for cookie-based sessions
    -   Created centralized API client with error handling

### Planned But Not Implemented

-   **Real-time chat with Socket.IO**
    -   Planned for future implementation
    -   Would enable live messaging between users and tradespeople

## Main Project Files

-   [Server Entry Point](server/server.js)
-   [Database Schema](server/db.mjs)
-   [Client Entry Point](client/src/App.jsx)
-   [Auth Context](client/src/contexts/AuthContext.jsx)

## Technologies Used

### Frontend

-   React
-   React Router
-   Vite
-   Axios
-   Firebase Client SDK

### Backend

-   Node.js
-   Express
-   MongoDB with Mongoose
-   Firebase Admin SDK
-   CORS, Cookie Parser

### Development Tools

-   Nodemon for auto-reload
-   ESLint for code quality
-   Git for version control

## References & Documentation Used

-   [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
-   [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
-   [React Documentation](https://react.dev/reference/react)
-   [React Router Documentation](https://reactrouter.com/)
-   [Mongoose Documentation](https://mongoosejs.com/docs/)
-   [Express Documentation](https://expressjs.com/)
-   [Vite Documentation](https://vite.dev/)
