## React App for Student Mark Analysis

This application is a student mark entry portal where each student can view and analyze their marks with an interactive and visually engaging interface.
Table of Contents

    1.Features
    2.Technologies Used
    3.Development Setup
    4.Available Scripts
    5.Folder Structure
    6.Contributing

## Features

    1.Student Dashboard: Displays a summary of marks across subjects or assessments.
    2.Interactive UI: Provides easy navigation and an intuitive user experience.
    3.Responsive Design: Optimized for both desktop and mobile devices.
    4.Real-time Updates: Reflects updates instantly as marks are added or modified.

## Technologies Used

    React: A JavaScript library for building user interfaces.
    Apollo Client: For managing GraphQL data and state.
    GraphQL: Used for fetching and managing data with queries and mutations.
    Material-UI (MUI): A React component library for styling and creating responsive design.

## Development Setup

To set up your local development environment, follow these steps:

  ## 1.Clone the repository:

  git clone https://github.com/Dhanalakshmiparameswaran/frontend_graphql.git

  ## 2.Navigate to the project directory:

  cd frontend_graphql

  ## 3.Install dependencies:

   ### `npm install`

    Start the development server:

   ### `npm start`

    This will run the app in development mode. Open http://localhost:3000 to view it in your browser.

## Available Scripts

In the project directory, you can run the following commands:

  ## npm start

    Starts the app in development mode.
    Open http://localhost:3000 to view it in your browser. The page reloads automatically if you make edits, and any linting errors will be displayed in the console.
  ## npm test

    Launches the test runner in interactive watch mode.
    This helps in running unit and integration tests, ensuring that the app’s components function as expected.
  ## npm run build

    Builds the app for production in the build folder.
    The production build is optimized for best performance. This version of the app is ready to be deployed.

## graphql

React-Mark-Analysis/
├── public/              # Public assets (HTML file, icons, etc.)
├── src/                 # Source code
│   ├── components/      # Reusable components (e.g., table, logIn,)
│   ├── graphql/         # GraphQL queries and mutations
│   ├── App.tsx          # Main application component using Apollo Client
│   ├── index.tsx        # Entry point for React DOM rendering
│   └── App.css          # Global styles
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation

## Contributing

Contributions are welcome! Please follow these steps to contribute to the project:

    1.Fork the repository.
    2.Create a new branch (git checkout -b YourBranchNewName).
    3.Commit your changes (git commit -m 'Add your commit message here').
    4.Push to the branch (git push origin YourBranchName).
    5.Open a pull request.