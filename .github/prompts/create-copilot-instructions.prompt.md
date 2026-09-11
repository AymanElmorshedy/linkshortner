---
agent: instructions-generator
name: create-copilot-instructions
<!-- description: Describe when to use this prompt -->
---

<!-- Tip: Use /create-prompt in chat to generate content with agent assistance -->

take the information below and generate a [name].instructions.md file for it in the /github/instructions/ directory .  generate an appropriate file [name] based on the generated content . make sure the instructions are concise and not too long  .if no information is provided below , prompt the user to give the necessary details about the layer of architecture or coding standards ti document .
the .md file should have a frontmatter section with a description property  of when to use the instructions and an optional applyTo field to specify which files the instructions apply to.  the body of the instructions should be written in markdown format and provide clear guidance on the topic at hand.  make sure to include any relevant examples or code snippets to illustrate best practices.  if applicable, include links to external resources or documentation for further reading.