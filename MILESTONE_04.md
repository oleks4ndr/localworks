# Milestone 04 - Final Project Documentation

## NetID

oa2302

## Name

Oleksandr Anyshchenko

## Repository Link

[https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr)

## URL for deployed site

[https://localworks.onrender.com/](https://localworks.onrender.com/)

## URL for form 1 (from previous milestone)

[Login](https://localworks.onrender.com/login) and [Registration](https://localworks.onrender.com/register) forms.

## Special Instructions for Form 1

**Note**: Before attempting to log-in, please ensure that the api is connected (see the indicator on the landing page).

Since this app requires authentication, there are two account provided below (a customer and tradesperson account). The tradesperson account already has a pre-filled and published Trades Profile which you can edit, unpublish. Otherwise, you can create a new profile and make a new Trades Profile from the Profile tab.

_Customer Profile info_

-   Email: mandy@gmail.com
-   Password: password123

_Tradesperson Profile info_

-   Email: plumbermike@email.com
-   Password: password123

## URL for form 2

Link to profile name change form:
[https://localworks.onrender.com/profile](https://localworks.onrender.com/profile)

## Special Instructions for Form 2

To access the second form, you must first be authenticated (logged in). The second form is quite simple and allows the user to change their display name.

## URL for form 3 (current milestone)

Two forms created for full implementation:

Firstly the [create trades profile form](https://localworks.onrender.com/create-trades-profile)

[https://localworks.onrender.com/create-trades-profile](https://localworks.onrender.com/create-trades-profile)

Secondly, the Send Message form is accessible through the profile card modals on the [dashboard](https://localworks.onrender.com/dashboard). (Click details on a public card and scroll down to "Send Message" button which will reveal a message form).

## Special Instructions for Form 3

To access the third form, the user once again has to be authentication, and has to have the role of a tradesperson. This can either be achieved by creating a new account with the Account Type set to Tradesperson, or if the account was created as a Customer role, there is an option to switch the account role to a tradesperson from the [profile page](https://localworks.onrender.com/profile).

The Create Trades Profile form allows for a tradesperson to fill out information about themselves or their business and make that info public in the shape of a profile card on the dashboard.

Once the profile card is complete and published, other users, including other tradespeople can see the profile on the dashboard and send a message.

## First link to github line number(s) for constructor, HOF, etc.

Generate profile cards with .map()
[See lines 10–25](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/pages/Dashboard.jsx#L74-L78)

## Second link to github line number(s) for constructor, HOF, etc.

Building the profile-card modal component (many map functions)
[See lines 131-216](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/components/ProfileCard.jsx#L131-L216)

## Short description for links above

**First link**: `.map()` is used to transform an array of profile objects into an array of `<ProfileCard>` React components, rendering each tradesperson profile as a card on the dashboard.

**Second link**: Multiple `.map()` calls transform arrays (skills, credentials, photos) into rendered list items and image elements within the profile detail modal component.

**Other HOFs etc.**: Throughout the app there are many other instances of using HOF such as in the [Create Trades Profile page](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/pages/CreateTradesProfile.jsx#L71-L96). Also in rendering the messages in [Trades Messages](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/pages/TradesMessages.jsx#L37-L60).

Too many to list all here.

## Link to github line number(s) for schemas (db.js or models folder)

All schemas are defined in a single file:
[server/db.mjs - Lines 1-245](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/server/db.mjs#L1-L245)

Includes User, Profile, Review, Conversation, Message, and ContactMessage schemas.
Review, Conversation, and Message are not implemented.

## Description of research topics above with points

-   **(6 points)** - React Frontend: Built entire client application with React, implementing Context API for global authentication state management, creating reusable component architecture (Navbar, ProfileCard, PrivateRoute), using React hooks (useState, useEffect, useContext) for state and side effects, and building controlled form components with real-time validation.

-   **(2 points)** - React Router Dom: Integrated React Router library for client-side routing with protected routes, implementing createBrowserRouter for route configuration, using Navigate component for redirects, managing route guards with PrivateRoute wrapper component, and handling authentication-based navigation logic.

-   **(1 point)** - Vite Build Tool: Configured Vite as the build tool and development server, configured proxy for API requests during development.

-   **(4 points)** - Firebase Authentication: Integrated Firebase Authentication SDK on client for email/password auth, implemented Firebase Admin SDK on backend for secure token verification, created custom Express middleware to validate tokens and attach user data to requests, coordinated authentication state between client and server, and handled token refresh and session management.

-   **(1 point)** - Axios and CORS: Implemented Axios HTTP client with request/response interceptors for automatic Firebase token attachment, configured CORS on Express server for cross-origin requests between client and server, set up credential handling for cookie-based sessions, and created API client with error handling.

**Total: 14 points**

## Links to github line number(s) for research topics described above (one link per line)

**React Frontend:**

-   [App.jsx with React Router setup - Lines 1-66](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/App.jsx#L1-L66)
-   [AuthContext with React Context API - Lines 1-278](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/contexts/AuthContext.jsx#L1-L278)
-   [Reusable ProfileCard component - Lines 1-316](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/components/ProfileCard.jsx#L1-L316)
-   [Dashboard with useState/useEffect hooks - Lines 1-96](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/pages/Dashboard.jsx#L1-L96)

**React Router Dom:**

-   [createBrowserRouter configuration - Lines 1-66](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/App.jsx#L1-L66)
-   [PrivateRoute wrapper component - Lines 1-20](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/components/PrivateRoute.jsx#L1-L20)
-   [Navigate component for redirects - Lines 1-50](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/pages/Register.jsx#L20-L25)

**Vite Build Tool:**

-   [Vite config with proxy setup - Lines 1-13](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/vite.config.js#L1-L13)

**Firebase Authentication:**

-   [Firebase client config - Lines 1-21](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/config/firebase-config.js#L1-L21)
-   [Firebase Admin SDK setup - Lines 1-14](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/server/config/firebase-admin.js#L1-L14)
-   [Auth middleware with token verification - Lines 1-44](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/server/middleware/auth.js#L1-L44)
-   [Auth routes (register/login) - Lines 1-217](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/server/routes/auth.js#L1-L217)

**Axios and CORS:**

-   [Axios client with interceptors - Lines 1-103](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/client/src/api.js#L1-L103)
-   [CORS configuration in server - Lines 27-33](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr/blob/main/server/server.js#L27-L33)

## Optional project notes

**Deployment Notes:**

-   The application is hosted as two separate services on Render, (static site for /client, and web service for /server which acts as the API)

**Key Features:**

-   Dual authentication flow (register as customer or tradesperson)
-   Role switching capability (users can upgrade to tradesperson)
-   Draft/publish toggle for profiles (tradespeople can save drafts before publishing)
-   Contact message system with inbox management (filter, read, delete)
-   Unread message notifications with badge counter
-   Profile visibility detection (show "Edit My Profile" for own profile, "Send Message" for others)
-   Form validation that only enforces mandatory fields when publishing

**Testing:**

-   Create a new tradesperson account to test the full profile creation flow
-   Use provided test accounts to view existing profiles and messaging
-   Try switching between roles to see different UI states
-   Test form validation by attempting to publish incomplete profiles

**Important Note on Photos**: Due to time constraints and lack of free providers for cloud image storage, the images that can be used in the profile creation are only available through external URLs. Additionally, there is not yet a feature to preview all photos on a profile card, only the first one.

## Attributions

-   **client/src/config/firebase-config.js** - Firebase client initialization based on [Firebase Web Setup Documentation](https://firebase.google.com/docs/web/setup)
-   **server/config/firebase-admin.js** - Firebase Admin SDK setup based on [Firebase Admin Setup Guide](https://firebase.google.com/docs/admin/setup)
-   **server/middleware/auth.js** - Token verification middleware adapted from [Firebase Admin Auth Documentation](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
-   **client/src/contexts/AuthContext.jsx** - React Context pattern based on [Firebase Authentication with React Guide](https://firebase.google.com/docs/auth/web/start)
-   **client/src/App.jsx** - React Router implementation based on [React Router Documentation](https://reactrouter.com/en/main/start/tutorial)
-   **client/src/components/ProfileCard.jsx** - Modal implementation pattern adapted from general React modal patterns

**Other tutorials/resources used** - see previous milestones
