#!/usr/bin/env python3
"""Export a bar chart of links created during the latest 12 calendar months."""

from __future__ import annotations

import argparse
import json
import os
import re
from datetime import date
from pathlib import Path
from typing import Any

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import psycopg


IDENTIFIER = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


QUERY = """
WITH months AS (
    SELECT generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
    ) AS month_start
)
SELECT
    months.month_start,
    COUNT(link_rows.*)::integer AS link_count
FROM months
LEFT JOIN {table_name} AS link_rows
    ON link_rows.{created_column} >= months.month_start
    AND link_rows.{created_column} < months.month_start + INTERVAL '1 month'
GROUP BY months.month_start
ORDER BY months.month_start
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Query PostgreSQL and export a 12-month link creation chart."
    )
    parser.add_argument(
        "--project-root",
        type=Path,
        default=Path.cwd(),
        help="Directory containing .env or .env.local (default: current directory).",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("links-created-last-12-months.png"),
        help="PNG output path.",
    )
    parser.add_argument("--table", default="links", help="Links table name.")
    parser.add_argument(
        "--created-column",
        default="created_at",
        help="Creation timestamp column name.",
    )
    return parser.parse_args()


def load_dotenv(project_root: Path) -> None:
    """Load simple KEY=VALUE entries without overwriting the process environment."""
    for filename in (".env", ".env.local"):
        dotenv_path = project_root / filename
        if not dotenv_path.is_file():
            continue
        for raw_line in dotenv_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip("'\"")
            if key and key not in os.environ:
                os.environ[key] = value


def validate_identifier(value: str, label: str) -> str:
    if not IDENTIFIER.fullmatch(value):
        raise ValueError(f"Invalid {label}: {value!r}")
    return value


def query_counts(table: str, created_column: str, database_url: str) -> list[dict[str, Any]]:
    query = QUERY.format(table_name=table, created_column=created_column)
    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

    return [
        {
            "month": month_start.date().isoformat(),
            "count": int(link_count),
        }
        for month_start, link_count in rows
    ]


def export_chart(monthly_counts: list[dict[str, Any]], output_path: Path) -> None:
    months = [date.fromisoformat(item["month"]) for item in monthly_counts]
    counts = [item["count"] for item in monthly_counts]
    labels = [month.strftime("%b %Y") for month in months]

    output_path.parent.mkdir(parents=True, exist_ok=True)
    figure, axis = plt.subplots(figsize=(14, 8), dpi=120)
    bars = axis.bar(labels, counts, color="#176b87", width=0.72)
    axis.set_title("Links Created by Month", fontsize=18, pad=16)
    axis.set_xlabel("Month")
    axis.set_ylabel("Total links created")
    axis.set_ylim(bottom=0)
    axis.grid(axis="y", alpha=0.25)
    axis.set_axisbelow(True)
    axis.tick_params(axis="x", rotation=35)

    for bar, count in zip(bars, counts):
        axis.annotate(
            str(count),
            xy=(bar.get_x() + bar.get_width() / 2, count),
            xytext=(0, 5),
            textcoords="offset points",
            ha="center",
            va="bottom",
        )

    figure.tight_layout()
    figure.savefig(output_path, format="png", bbox_inches="tight")
    plt.close(figure)


def main() -> None:
    args = parse_args()
    project_root = args.project_root.resolve()
    load_dotenv(project_root)

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError(
            f"DATABASE_URL was not found in the environment, {project_root / '.env'}, "
            f"or {project_root / '.env.local'}."
        )

    table = validate_identifier(args.table, "table name")
    created_column = validate_identifier(args.created_column, "created column name")
    monthly_counts = query_counts(table, created_column, database_url)
    if len(monthly_counts) != 12:
        raise RuntimeError(f"Expected 12 monthly rows, received {len(monthly_counts)}.")

    output_path = args.output if args.output.is_absolute() else project_root / args.output
    export_chart(monthly_counts, output_path)
    print(json.dumps({"output": str(output_path), "monthly_counts": monthly_counts}))


if __name__ == "__main__":
    main()
