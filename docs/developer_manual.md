# Developer Manual

## Project Overview

The F1 Live Dashboard is a full stack web application that was built using the following:
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- Supabase
- Chart.js
- AOS Animation Library

The application gathers live Formula 1 data from external APIs and combines it with user generated favorite driver data that is stored in a Supabase database table.

---

# Installation Instructions

## 1. Clone the Repository

bash
git clone https://github.com/Rstarr19/INST377_final_project.git

---

# 2. Install All Dependencies

Navifate to the backend directory and install the following:

npm install

Dependencies include:
- express
- cors
- dotenv
- axios
- @supabase/supabase-js

---

# Running the Application

## Start the Backend Server

Run:

node server.js

The backend server runs on:

http://localhost:3000

## Start the Frontend

Open the HTML files using the VS Code Live Server add on or anther local development server

Recommended starting page:

landing.html

---

# Testing

No automated tests are added, but testing was done through:
- API endpoint verification
- Browser testing
- Favorites database testing
- User interface testing
- Driver navigation testing

---

# API Endpoints

## GET /api/f1-standings
This retrieves live and updating Formula 1 standings information from the external Ergast/Jolpica API

## POST /api/favorites
This adds a favorite driver to the Supabase 'favorites' database

The Request looks like:

{ 
    "driver_name": "Max Verstappen" 
}

## DELETE /api/favorites
This removes a driver that has been favorited from the 'favorites' Supabase database

The Request looks like:

{
    "driver_name": "Max Verstappen" 
}

## GET /api/f1-drivers
This gets the live driver data from the external OpenF1 API

---

# Database

The web application uses Supabase as the cloud database provider.

There is one table:

## favorites
Which stores the drivers that have been favorited by the user

## Fields:
- id (int8)
- driver_name (text)

---

# Known Bugs
- When favoriting a driver, it may take a refresh for the chart to highlight that driver
- Entering the Dashboard or Driver Exporer pages may result in perpetual loading, for which you will have to reload the page(s)
- Getting information about a driver by hovering on the chart may lead to a "Driver not Found" error, in which case you go back to the Dashboard page and try again
- Any use of external APIs may depend on the third party avaiablity

---

# Future Development Roadmap

Potential improvements that may be implemented in the future
- Race calendar integration
- constructors standings in addition to drivers standings (with toggle feature)
- Driver or team filtering on Driver Explorer and Dashboard
- User authentication
- Dark and light mode toggle
- Mobile browser compatibility
- Real time telemetry visualization
- Search functionality
- Team-specific themes
- Team information pages
- More in depth driver information
- Favoriting teams 

---

# Project Architecture

The frontend pages communicate exclusively with the backend using FetchAPI requests.

The Architecture follows:

Frontend -> Express backend -> External APIs / Supabase

This structure improves the security and keeps API and database credentials hidden from the user/client side.

---

# Authors

Developed as a full stack Formula 1 dashboard project.

## Riley Starr