#!/usr/bin/env python3
"""
Convert CSV course data to JSON format for the UofL Course Catalog app.

Reads from: catalog dev[8].csv (project root)
Writes to: public/catalog.json

Handles:
- Field extraction (CRSE_ID, SUBJECT, CATALOG_NBR, DESCR)
- Whitespace cleaning
- Missing value handling
- Duplicate removal (keeps first occurrence per unique SUBJECT+CATALOG_NBR)
"""

import pandas as pd
import json
import os
import sys
from pathlib import Path


def main():
    # Get project root relative to this script's location
    # Script is at: scripts/convert_csv.py, so parent.parent gets to project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    csv_path = project_root / "catalog dev[8].csv"
    public_dir = project_root / "public"
    json_path = public_dir / "catalog.json"

    # Validate CSV exists
    if not csv_path.exists():
        print(f"❌ Error: CSV file not found at {csv_path}")
        sys.exit(1)

    try:
        # Read CSV file
        print(f"📖 Reading CSV from {csv_path}...")
        df = pd.read_csv(csv_path)

        # Check required columns exist
        required_cols = ["CRSE_ID", "SUBJECT", "CATALOG_NBR", "DESCR"]
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            print(f"❌ Error: CSV missing required columns: {missing_cols}")
            print(f"   Available columns: {list(df.columns)}")
            sys.exit(1)

        # Extract only required fields
        print(f"🔍 Extracting required fields...")
        df = df[required_cols].copy()

        # Clean whitespace
        print(f"🧹 Cleaning whitespace...")
        for col in df.columns:
            if df[col].dtype == "object":  # String columns
                df[col] = df[col].str.strip()

        # Handle missing values
        print(f"❌ Handling missing values...")
        # Replace NaN with empty strings for consistency
        df = df.fillna("")
        
        # Remove rows where critical fields are empty
        df = df[df["CRSE_ID"].notna() & (df["CRSE_ID"] != "")]
        df = df[df["SUBJECT"].notna() & (df["SUBJECT"] != "")]
        df = df[df["CATALOG_NBR"].notna() & (df["CATALOG_NBR"] != "")]

        print(f"   Total rows after cleaning: {len(df)}")

        # Remove duplicates: keep first occurrence of each unique SUBJECT + CATALOG_NBR combo
        # This handles cases where the same course appears multiple times with different CRSE_IDs
        print(f"🔄 Removing duplicates...")
        original_count = len(df)
        df = df.drop_duplicates(subset=["SUBJECT", "CATALOG_NBR"], keep="first")
        duplicates_removed = original_count - len(df)
        if duplicates_removed > 0:
            print(f"   Removed {duplicates_removed} duplicate course record(s)")

        # Rename columns to match React app expectations
        print(f"🔄 Renaming columns for React app...")
        df = df.rename(columns={
            "CRSE_ID": "id",
            "SUBJECT": "department",
            "CATALOG_NBR": "code",
            "DESCR": "description"
        })

        # Convert to list of dictionaries
        courses = df.to_dict(orient="records")
        
        # Ensure clean integer values for id field (prevents JSON serialization like 12345.0)
        for course in courses:
            if "id" in course:
                course["id"] = int(course["id"])
        
        print(f"✅ Processed {len(courses)} courses")

        # Create public directory if it doesn't exist
        public_dir.mkdir(parents=True, exist_ok=True)
        print(f"📁 Ensured public directory exists: {public_dir}")

        # Write JSON file
        print(f"✍️  Writing JSON to {json_path}...")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(courses, f, indent=2, ensure_ascii=False)

        print(f"✨ Success! Generated {len(courses)} courses in {json_path}")
        return 0

    except FileNotFoundError as e:
        print(f"❌ File error: {e}")
        sys.exit(1)
    except pd.errors.ParserError as e:
        print(f"❌ CSV parsing error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    sys.exit(main())
