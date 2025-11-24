# Markdown Cheat Sheet for ScopeLock

Quick reference for common Markdown formatting. Save this file and practice!

---

## Headings

```markdown
# Heading 1 (biggest)
## Heading 2
### Heading 3
#### Heading 4
```

---

## Text Formatting

```markdown
**bold text**
*italic text*
***bold and italic***
~~strikethrough~~
`inline code`
```

---

## Lists

### Bullet Points
```markdown
- Item one
- Item two
  - Nested item (2 spaces indent)
  - Another nested
- Item three
```

### Numbered Lists
```markdown
1. First item
2. Second item
3. Third item
```

---

## Links

```markdown
[Link Text](https://example.com)
[ScopeLock Website](https://scopelock.mindprotocol.ai)
```

---

## Images

```markdown
![Alt text](image-url.png)
![Logo](/images/logo.png)
```

---

## Code Blocks

### Inline Code
```markdown
Use `git push` to upload your code.
```

### Multi-line Code Block
````markdown
```javascript
function hello() {
  console.log("Hello, ScopeLock!");
}
```
````

### With Language (for syntax highlighting)
````markdown
```python
def greet():
    print("Hello from Python!")
```
````

---

## Blockquotes

```markdown
> This is a quote.
> It can span multiple lines.
```

---

## Horizontal Rule

```markdown
---
```

---

## Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |
```

---

## Task Lists (Checkboxes)

```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
```

---

## ScopeLock-Specific Examples

### Writing a Spec Header
```markdown
# Mission: User Authentication

## Status
- **Current:** In Progress
- **AC Green:** Pending
- **Owner:** Rafael

## Acceptance Criteria
- [ ] User can sign up with email
- [ ] User can log in
- [ ] Password reset works
```

### Writing a Bug Report
```markdown
## Bug: Login Button Not Working

### Steps to Reproduce
1. Go to login page
2. Enter valid credentials
3. Click "Login" button
4. **Expected:** Redirected to dashboard
5. **Actual:** Nothing happens

### Environment
- Browser: Chrome 119
- OS: macOS
- URL: https://staging.example.com
```

### Writing Documentation
```markdown
## How to Deploy

### Prerequisites
- Node.js 18+
- Access to Vercel dashboard

### Steps
1. Run `npm run build` to verify no errors
2. Commit your changes: `git add . && git commit -m "description"`
3. Push to main: `git push origin main`
4. Vercel auto-deploys in ~2 minutes
5. Verify at https://scopelock.mindprotocol.ai

### Troubleshooting
> If build fails, check the error logs in Vercel dashboard.
```

---

## Practice Exercise

Try converting this plain text into Markdown:

**Plain text:**
```
My First Task

I completed these items
Fix the button color
Add the new logo
Write tests

Next steps
Deploy to staging
Get team review
```

**Your Markdown version should have:**
- A heading for "My First Task"
- A subheading for "I completed these items"
- A checkbox list (with items checked)
- A subheading for "Next steps"
- A numbered list

---

## Quick Reference Table

| Format      | Syntax              | Result          |
|-------------|---------------------|-----------------|
| Bold        | `**text**`          | **text**        |
| Italic      | `*text*`            | *text*          |
| Code        | `` `code` ``        | `code`          |
| Link        | `[text](url)`       | [text](url)     |
| Heading     | `# Heading`         | Heading         |
| Bullet      | `- item`            | • item          |
| Number      | `1. item`           | 1. item         |
| Quote       | `> text`            | > text          |

---

## Useful Tools

- **StackEdit** - Online Markdown editor: https://stackedit.io
- **GitHub** - All our documentation uses Markdown
- **VS Code** - Has built-in Markdown preview (Ctrl+Shift+V)

---

*Keep this cheat sheet handy! You'll use Markdown every day at ScopeLock.*

— ScopeLock Team
