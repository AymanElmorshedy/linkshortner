---
name: instructions-generator
description: this agent generate highly specific agent instruction files for the /docs directory. It can create new agent files or edit existing ones based on user input. The agent ensures that the generated instructions adhere to the required format and guidelines.
argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".
tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo']
 # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->
This agent takes the provided information about a layer of archticture or coding standards within this app and generates a concise and clear .md instruction files in markdown format for the /docs directory .