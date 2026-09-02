# UofL Course Catalog

A React-based course catalog application for University of Louisville courses.

## Project Structure

- `src/` - React source code
  - `components/` - React components (CourseCard, Header, Pagination, SearchFilter)
  - `utils/` - Utility functions (aiSearch.js)
  - `App.jsx` - Main app component
  - `main.jsx` - React entry point
  - `index.css` - Global styles

- `public/` - Static assets
  - `catalog.json` - Generated course data (created by Python script)

- `scripts/` - Python scripts
  - `convert_csv.py` - Converts CSV course data to JSON

## Setup

### Prerequisites
- Node.js (v16+)
- Python (for data conversion)

### Installation

```bash
npm install
```

### Running the Dev Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Data Conversion

To convert CSV course data to JSON:

```bash
python scripts/convert_csv.py
```

This generates `public/catalog.json` which is used by the React app.

## Features

- Course card display
- Search and filtering functionality
- Pagination support
- AI-powered search capabilities

## License

MIT
