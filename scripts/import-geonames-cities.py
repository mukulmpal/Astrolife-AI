#!/usr/bin/env python3
import argparse
import csv
import os
import sys
from pathlib import Path

try:
    import psycopg2
    from psycopg2.extras import execute_values
except ImportError:
    print("Missing psycopg2. Run: pip3 install psycopg2-binary")
    sys.exit(1)

def clean(v):
    return str(v or "").strip()

def to_int(v):
    try:
        return int(v)
    except Exception:
        return 0

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True)
    args = parser.parse_args()

    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL missing.")
        print("Run: export DATABASE_URL='your_supabase_postgres_url'")
        sys.exit(1)

    file_path = Path(args.file)
    if not file_path.exists():
        print(f"File not found: {file_path}")
        sys.exit(1)

    conn = psycopg2.connect(db_url)
    total = 0
    batch = []

    sql = """
      insert into public.cities (
        geoname_id, name, ascii_name, alternate_names, country_code,
        admin1_code, admin2_code, latitude, longitude, population,
        timezone, search_text
      )
      values %s
      on conflict (geoname_id) do update set
        name = excluded.name,
        ascii_name = excluded.ascii_name,
        alternate_names = excluded.alternate_names,
        country_code = excluded.country_code,
        admin1_code = excluded.admin1_code,
        admin2_code = excluded.admin2_code,
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        population = excluded.population,
        timezone = excluded.timezone,
        search_text = excluded.search_text;
    """

    with conn.cursor() as cur:
        with file_path.open("r", encoding="utf-8") as f:
            reader = csv.reader(f, delimiter="\t")

            for row in reader:
                if len(row) < 18:
                    continue

                name = clean(row[1])
                ascii_name = clean(row[2])
                alternate_names = clean(row[3])
                country_code = clean(row[8])
                admin1_code = clean(row[10])
                admin2_code = clean(row[11])
                timezone = clean(row[17])

                search_text = " ".join([
                    name,
                    ascii_name,
                    alternate_names.replace(",", " "),
                    country_code,
                    admin1_code,
                    timezone,
                ]).lower()

                batch.append((
                    to_int(row[0]),
                    name,
                    ascii_name,
                    alternate_names,
                    country_code,
                    admin1_code,
                    admin2_code,
                    float(row[4]),
                    float(row[5]),
                    to_int(row[14]),
                    timezone,
                    search_text,
                ))

                if len(batch) >= 5000:
                    execute_values(cur, sql, batch)
                    conn.commit()
                    total += len(batch)
                    print(f"Imported {total} cities...")
                    batch = []

            if batch:
                execute_values(cur, sql, batch)
                conn.commit()
                total += len(batch)

    conn.close()
    print(f"Done. Imported/updated {total} cities.")

if __name__ == "__main__":
    main()
