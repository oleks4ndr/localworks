# Milestone 03

## Repository Link

[LocalWorks Repo](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr)

## URL for Form 1 (from previous milestone)

Link to [registration form](https://localworks.onrender.com/register)

## Special Instructions for Form 1

As of now, very simple auth is implemented (which will be worked on for future milestones). There are two working forms, login and register. Navigate to register to make an account and login with the info you provided for registration.

**IMPORTANT**: Because Render likes to go to sleep on the free teir, please check that the API is first connected. I have added an indicator on the main landing page which should say "API: Welcome to LocalWorks" once the web service starts up.

Once the API is connected, register an account. Then, when you log in, you should see "Welcome back, {name}" where the name would be retrieved from the API and DB.

Login Details which can be used for testing:

email: testing-user@gmail.com
pass: testinguserpass

## URL for form 2 (for current milestone)

Link to [profile settings](https://localworks.onrender.com/profile)

**NOTE**: 1. Must be logged in to access this page. 2. Sign in with Google not working YET!

## Special Instructions for Form 2

As mentioned above, to access the second form the user must be authenticated, either by registering a new account or by logging in.

Since the majority of the work this milestone was spent on implementing authentication, the second form allows an authenticated user to change their display name.

The new profile page which contains the form will also be updated in the future to include more profile customization dependant on the user's role.

## References and Research Topic Progress

There was a lot accomplished in this milestone and significant progress on research topics:

-   Proper authentication added using Firebase (front and back end)

    -   Implemented sign up and sign in and more routes [here](./server/routes/auth.js)
    -   Middleware to verify token [here](./server/middleware/auth.js)
    -   Updated database schema for [users](./server/db.mjs)
    -   Set up Firebase admin [config](./server/config/firebase-admin.js)
    -   _Resources Used_
        -   [Firebase Docs](https://firebase.google.com/docs/auth/web/password-auth?authuser=0)
        -   [Youtube resource](https://www.youtube.com/watch?v=Jfkme6WE_Dk)
        -   [Another youtube tutorial](https://www.youtube.com/watch?v=9-QAGqt3q-0)

-   Client side authentication state managed by using React context

    -   Creating a Private Route component to act as a wrapper for routes that require user to be authenticated [here](./client/src/components/PrivateRoute.jsx)
    -   Setting up client-side firebase config [here](./client/src/config/firebase-config.js)
    -   Creating a custom React context for auth [here](./client/src/contexts/AuthContext.jsx)
    -   Protecting private routes [here](./client/src/App.jsx)
    -   Adding interceptors for Axios to add auth token [here](./client/src/api.js)
    -   _Resources Used_
        -   React docs on [context](https://react.dev/reference/react/createContext)
        -   Great [tutorial](https://www.youtube.com/watch?v=6kgitEWTxac) for firebath auth context
        -   [Youtube resource](https://www.youtube.com/watch?v=Jfkme6WE_Dk)
        -   [Another youtube tutorial](https://www.youtube.com/watch?v=9-QAGqt3q-0)
