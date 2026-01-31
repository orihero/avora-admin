---
name: appwrite-mcp
description: Use Appwrite MCP servers for documentation lookup and database operations. Use when working with Appwrite databases, tables, columns, rows, creating schemas, querying data, or when you need Appwrite API documentation. Always use appwrite-docs for docs and appwrite-[projectName] for changes.
---

# Appwrite MCP

Guidance for using Appwrite MCP servers in Cursor. Two MCP servers are used for different purposes.

## MCP Servers and Their Roles

### 1. appwrite-docs — Documentation Only

**Use for:** Reading Appwrite documentation, API reference, concepts, and guides.

**When to use:**
- Look up API methods, parameters, or behavior
- Understand Appwrite concepts (Databases, Collections, Documents, etc.)
- Find SDK usage examples
- Clarify permissions or query syntax

**Do not use** appwrite-docs for:
- Creating or modifying databases, tables, columns, or rows
- Listing or querying data
- Any operations that change Appwrite resources

---

### 2. appwrite-[projectName] — Data and Schema Operations

**Use for:** All operations that read or modify Appwrite resources.

**Examples:** `appwrite-avora`, `appwrite-myproject`, etc. The project name matches your Appwrite project.

**When to use:**
- Create databases, tables, columns, indexes
- List tables, columns, rows
- Create, update, delete, or query rows
- Get table schemas, column definitions, or database structure

**Workflow:**
1. Use **appwrite-docs** to look up how to do something (e.g., create a string column).
2. Use **appwrite-[projectName]** to perform the operation (e.g., create the column in your database).

---

## appwrite-docs May Require Restart

**Important:** The appwrite-docs MCP can stop responding and needs a manual restart.

**Signs it has stopped:**
- It does not list any tools
- Calls return nothing or fail without useful output
- You cannot fetch documentation when you expect it to work

**When this happens:**
1. **Stop** further attempts to use appwrite-docs.
2. **Prompt the user** with a clear message such as:

   > The appwrite-docs MCP appears to have stopped working (it's not listing tools or responding). Please restart the appwrite-docs MCP server manually. After it restarts, I can continue with the documentation lookup.

3. Do not loop or retry repeatedly.
4. Proceed with other work if possible, or wait for the user to confirm the restart.

---

## Quick Reference

| Task | Use |
|------|-----|
| How do I create a relationship column? | appwrite-docs |
| Create a relationship column in my DB | appwrite-[projectName] |
| What query operators does Appwrite support? | appwrite-docs |
| List rows from a table | appwrite-[projectName] |
| What's the structure of a database/table? | appwrite-[projectName] |
| Documentation for permissions | appwrite-docs |

---

## Project-Specific Server

Identify the project-specific server from the MCP tools available (e.g., `mcp_appwrite-avora_*` → project `avora`). Use that server for all create/read/update/delete and schema operations.
