// Minimal markdown utilities for the proof generator.
// Provides safe HTML rendering for the subset of Markdown we expect in proof files.

const HTML_ESCAPE_REGEX = /[&<>"']/g;
const HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

export function escapeHtml(value = '') {
  return value.replace(HTML_ESCAPE_REGEX, (char) => HTML_REPLACEMENTS[char] ?? char);
}

function formatInline(text) {
  let safe = escapeHtml(text);

  // Links in markdown format [label](url)
  safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label, url) => {
    return `<a href="${url}" rel="noopener noreferrer">${label}</a>`;
  });

  // Bold (**text**)
  safe = safe.replace(/\*\*([^*]+)\*\*/g, (_match, bold) => `<strong>${bold}</strong>`);

  // Italic (*text*)
  safe = safe.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, (_match, prefix, italic) => {
    return `${prefix}<em>${italic}</em>`;
  });

  // Inline code (`code`)
  safe = safe.replace(/`([^`]+)`/g, (_match, code) => `<code>${code}</code>`);

  // Autolink bare URLs not already linked.
  safe = safe.replace(/(^|\s|\(|>)(https?:\/\/[^\s<]+)/g, (_match, prefix, url) => {
    return `${prefix}<a href="${url}" rel="noopener noreferrer">${url}</a>`;
  });

  return safe;
}

export function markdownToHtml(markdown = '') {
  if (!markdown.trim()) {
    return '';
  }

  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const chunks = [];
  let inList = false;
  let listItems = [];
  let paragraph = [];
  let inCodeBlock = false;
  let codeFenceLang = '';
  let codeBuffer = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      const text = paragraph.join(' ').trim();
      if (text) {
        chunks.push(`<p>${formatInline(text)}</p>`);
      }
      paragraph = [];
    }
  };

  const flushList = () => {
    if (inList) {
      const items = listItems
        .map((item) => `<li>${formatInline(item)}</li>`)
        .join('');
      chunks.push(`<ul>${items}</ul>`);
      listItems = [];
      inList = false;
    }
  };

  const flushCodeBlock = () => {
    if (inCodeBlock) {
      const codeHtml = escapeHtml(codeBuffer.join('\n'));
      const langAttr = codeFenceLang ? ` data-lang="${escapeHtml(codeFenceLang)}"` : '';
      chunks.push(`<pre><code${langAttr}>${codeHtml}</code></pre>`);
      codeBuffer = [];
      codeFenceLang = '';
      inCodeBlock = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine;

    const fenceMatch = line.match(/^```(.*)$/);
    if (fenceMatch) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushParagraph();
        flushList();
        inCodeBlock = true;
        codeFenceLang = fenceMatch[1].trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const content = formatInline(headingMatch[2].trim());
      chunks.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    const listMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      inList = true;
      listItems.push(listMatch[1]);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushCodeBlock();

  return chunks.join('\n');
}

export function extractFirstUrl(markdown = '') {
  const urlMatch = markdown.match(/https?:\/\/[^\s)]+/);
  return urlMatch ? urlMatch[0] : null;
}
