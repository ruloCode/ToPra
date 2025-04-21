'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const markdownExample = `
## Markdown Guide

You can use these features to format your text:

### Basic Formatting
- **Bold text** with \`**double asterisks**\`
- *Italic text* with \`*single asterisks*\`
- ~~Strikethrough~~ with \`~~tildes~~\`

### Lists
1. First ordered item
2. Second ordered item

- Unordered list item
- Another item
  - Nested item

### Links and Code
[Link text](https://example.com) with \`[text](url)\`

Inline \`code\` with backticks

\`\`\`
// Code block with triple backticks
function example() {
  return "Hello world";
}
\`\`\`

### Other Elements
> Blockquote with a \`>\` character

Horizontal rule with \`---\`

---
`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center text-xs text-muted-foreground hover:text-accent"
      >
        <HelpCircle className="h-3 w-3 mr-1" />
        <span>Markdown Guide</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 right-0 top-6 w-80 md:w-96 bg-background border border-border rounded-md shadow-lg p-4 overflow-y-auto max-h-96">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Markdown Guide</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownExample}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
} 