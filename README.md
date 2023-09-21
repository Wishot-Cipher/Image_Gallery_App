# Gallery App

## Overview

The Gallery App is a web application that allows users to upload, sort, and search images. Additionally, users can log in to access personalized features. This README provides a comprehensive guide on setting up and running the project.

## Table of Contents

1. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
2. [Firebase Setup](#firebase-setup)
   - [Create a Firebase Project](#create-a-firebase-project)
   - [Configure Firebase](#configure-firebase)
3. [Running the App](#running-the-app)
4. [Project Structure](#project-structure)
5. [Technologies Used](#technologies-used)
6. [Credits](#credits)

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/gallery-app.git
   cd gallery-app
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

## Firebase Setup

### Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on "Add project" and follow the prompts to create a new project.

### Configure Firebase

1. Enable Firebase services (Authentication, Firestore, Storage) for your project in the Firebase Console.

2. Navigate to your project settings, then click on "General" and scroll down to the "Your apps" section.

3. Add a web app to your project and copy the configuration.

4. Replace the placeholder values in `firebaseConfig/config.js` with your Firebase configuration.

## Running the App

To start the development server, run the following command:

```bash
npm start
```

The app will be running at `http://localhost:3000`.

## Project Structure

- `src/`
  - `components/`: Contains React components used in the app.
  - `pages/`: Contains main page components.
  - `firebaseConfig/`: Firebase configuration files.
  - `App.jsx`: Main application component.
  - `index.js`: Entry point for the application.

## Technologies Used

- React
- Firebase (Authentication, Firestore, Storage)
- Tailwind CSS
- @dnd-kit/core (for drag-and-drop functionality)

## Credits

- This app was created by [Alom Wisdom Obumneme].
