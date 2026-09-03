# UofL Course Catalog

A React-based course catalog application for University of Louisville courses. The application converts the provided course catalog CSV data into JSON and provides an interactive interface for browsing, searching, filtering, and planning courses.

## Live Demo

- GitHub Pages: [ADD YOUR GITHUB PAGES LINK HERE]
- Vercel: [ADD YOUR VERCEL LINK HERE]

## Project Structure

- `src/` - React source code
  - `components/` - Reusable React components
    - `CourseCard`
    - `Header`
    - `Pagination`
    - `SearchFilter`
  - `utils/` - Utility functions
    - `aiSearch.js`
  - `App.jsx` - Main application component
  - `main.jsx` - React entry point
  - `index.css` - Global styles

- `public/` - Static assets
  - `catalog.json` - Course data generated from the provided CSV

- `scripts/` - Data conversion scripts
  - `convert_csv.py` - Converts the course catalog CSV data into JSON

## Approach

The provided course catalog data is supplied as a CSV file. A Python script is used to convert the CSV data into a JSON file that can be efficiently loaded by the React application.

The React frontend then loads the JSON course data and renders each course as an interactive card. Search, department filtering, pagination, and course planning are handled within the application.

The application uses React components to separate major pieces of functionality and keep the code organized and reusable.

## Features

- Display of the UofL Course Catalog
- Course cards displaying:
  - Subject
  - Catalog Number
  - Course Description
- Search courses by course name, code, or description
- Filter courses by department
- Pagination through the course catalog
- Save courses
- Add courses to a semester-based Course Planner
- Remove courses from individual semesters
- Support for multiple semesters
- Responsive design for different screen sizes
- AI-powered search functionality
- CSV-to-JSON data conversion using Python

## Technologies Used

- React
- JavaScript
- HTML
- CSS
- Vite
- Python
- JSON
- Git / GitHub

## Setup

### Prerequisites

- Node.js v16 or later
- Python 3.x
- Git

### Installation

Clone the repository and install the dependencies:

```bash
git clone [https://github.com/brodymarkwell1/uofl-course-catalog]
cd uofl-course-catalog
npm install