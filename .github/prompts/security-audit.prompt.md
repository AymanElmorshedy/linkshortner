---
agent : ask

---

<!-- Tip: Use /create-prompt in chat to generate content with agent assistance -->

perform a security audit of the codebase. Identify potential vulnerabilities, insecure coding practices, and areas that may require additional security measures. Provide recommendations for improving the overall security posture of the application.
out put your findings as markdown formated tabel with the following columns:id (id should start with one and auto increment), Vulnerability, Description, Severity (Low/Medium/High),file path (file path should be an actula link to the file ) , line numbers , Recommendation.

next ask the user which issues they want to fix by either replayed all or comma seperated list of ids. after they reply run a sperated sub agents (#run sub-agent) to fix the selected issues and provide a summary of the changes made.