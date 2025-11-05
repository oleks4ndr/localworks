# Milestone 02

## Repository Link

[LocalWorks Repo](https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-oleks4ndr)

## Special Instructions for Using Form (or Login details if auth is part of your project)

As of now, very simple auth is implemented (which will be worked on for future milestones). There are two working forms, login and register. Navigate to register to make an account and login with the info you provided for registration.

## URL for form

Link to [registration form](https://localworks.onrender.com/register)

## URL for form result

After registration, a sucess indicator (green success message), will indicate that the user was successfully created and is now in the database. [Link](https://localworks.onrender.com/login)

## References and Research Topic Progress

-   Using React framework for client side, lots of resources used:

    -   General setup [tutorial](https://www.youtube.com/watch?v=mKmxc8TcWQ8)
    -   [Official Docs](https://react.dev/learn/your-first-component)
    -   For creating the [navbar](https://www.sitepoint.com/creating-a-navbar-in-react/). See [here](./client/src/components/Navbar.jsx)
    -   [Tutorial](https://www.youtube.com/watch?v=8QgQKRcAUvM&t=6s) for login and register pages. [here](./client/src/pages/)
    -   React router [tutorial/docs](https://reactrouter.com/6.30.1/start/tutorial) shown [here](./client/src/App.jsx)
    -   Other small tutorials on styling and components

-   Used [Axios](https://axios-http.com/docs/instance) instead of fetch for making requests from client to server [see](./client/src/api.js)
