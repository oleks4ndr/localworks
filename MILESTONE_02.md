# Milestone 02

## Repository Link

[LocalWorks Repo](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr)

## Special Instructions for Using Form (or Login details if auth is part of your project)

As of now, very simple auth is implemented (which will be worked on for future milestones). There are two working forms, login and register. Navigate to register to make an account and login with the info you provided for registration.

**IMPORTANT**: Because Render likes to go to sleep on the free teir, please check that the API is first connected. I have added an indicator on the main landing page which should say "API: Welcome to LocalWorks" once the web service starts up.

Once the API is connected, register an account. Then, when you log in, you should see "Welcome back, {name}" where the name would be retrieved from the API and DB.

Login Details which can be used for testing:

email: bobthebuilder@gmail.com
pass: bobbyspassword

## URL for form

Link to [registration form](https://localworks.onrender.com/register)

## URL for form result

After registration, a sucess indicator (green success message), will indicate that the user was successfully created and is now in the database. [Link](https://localworks.onrender.com/login)

## References and Research Topic Progress

-   Using React framework for client side, lots of resources used and a good amount of progress:

    -   General setup [tutorial](https://www.youtube.com/watch?v=mKmxc8TcWQ8)
    -   [Official Docs](https://react.dev/learn/your-first-component)
    -   For creating the [navbar](https://www.sitepoint.com/creating-a-navbar-in-react/). See [here](./client/src/components/Navbar.jsx)
    -   [Tutorial](https://www.youtube.com/watch?v=8QgQKRcAUvM&t=6s) for login and register pages. [here](./client/src/pages/)
    -   React router [tutorial/docs](https://reactrouter.com/6.30.1/start/tutorial) shown [here](./client/src/App.jsx)
    -   Other small tutorials on styling and components

-   Used [Axios](https://axios-http.com/docs/instance) instead of fetch for making requests from client to server [see](./client/src/api.js)
