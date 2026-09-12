---
name: link-creation-chart
description: Query a project's PostgreSQL database for links created during the latest 12 calendar months and export a PNG bar chart with one bar per month. Use this skill whenever the user asks for monthly link-creation counts, database-backed link analytics, a last-12-month chart, or a PNG visualization of links created over time, even if they do not name this skill or explicitly mention PostgreSQL.
compatibility: Requires Python 3.10+, a PostgreSQL DATABASE_URL in the project's .env or .env.local, and the Python packages listed in requirements.txt.
---

# Link Creation Chart

Create a trustworthy monthly count chart from the project's database. The chart must cover exactly 12 calendar months: the current month and the preceding 11 months. Include months with no links as zero-count bars so the x-axis is continuous and comparable.

## Workflow

1. Identify the project root and inspect its schema or existing database code to confirm the links table and creation timestamp. The default project schema is `links.created_at`; do not guess if the project uses different names.
2. Confirm that the database URL is available in `.env` or `.env.local`. Never print, commit, or include the value in generated output. Treat the database as read-only for this task.
3. Install the packages from this skill's `requirements.txt` into the active Python environment if they are unavailable.
4. Run the bundled script from the project root:

   ```bash
   python <skill-path>/scripts/plot_link_creation.py --project-root . --output links-created-last-12-months.png
   ```

   The script reads `DATABASE_URL` from the process environment first, then `.env`, then `.env.local`. It uses a parameterized, read-only aggregation query and fills missing months with zero.
5. If the schema differs, pass validated identifier overrides, for example:

   ```bash
   python <skill-path>/scripts/plot_link_creation.py \
     --table short_links --created-column created_on \
     --output links-created-last-12-months.png
   ```

   Only use overrides after checking the actual schema. Do not put user-provided values directly into SQL identifiers.
6. Verify that the PNG exists, is non-empty, and has 12 x-axis labels. Report the output path and the month/count table. Do not expose the database URL.

## Data and date rules

- Use database calendar semantics: `date_trunc('month', CURRENT_DATE)` defines the current month.
- Count rows by the creation timestamp, not updated time or click time.
- Include the current partial month unless the user explicitly requests completed months only.
- The query must include the lower bound at the first day of the month 11 months ago and the upper bound at the first day of next month.
- Use a left join against a generated 12-month series so months without rows remain visible with count `0`.

## Output requirements

Export a PNG bar chart with:

- x-axis: all 12 months in chronological order, labeled like `Oct 2025`;
- y-axis: total links created in that month, starting at zero;
- title that states the 12-month link creation period;
- readable labels and a tight layout;
- a deterministic filename unless the user specifies another path.

The bundled script prints a compact JSON result containing the output path and monthly counts, which makes the result easy to verify without revealing connection details.
