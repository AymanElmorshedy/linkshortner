---

description: Read this file to understand how to fetch data 
in the project.

<!-- applyTo : **/*.ts, **/*.js, **/*.tsx -->

---

# Data Fetching Instructions

This outline the best practices for fetching data in our next js applications . It is important to follow these guidelines to ensure consistency and maintainability across the codebase.

# 1. User Server components for Data Fetching

in Next.js 13, allways using server components for data fetching whenever possible. Server components allow you to fetch data on the server side, which can improve performance and reduce the amount of client-side JavaScrip . never use client components for data fetching .

# 2. Data Fetching Methods

always use the helper functions in the data directory for fetch data never fetch data directly in the components.

All helper functions in the /data directory should use drizzle orm for database interactions.
