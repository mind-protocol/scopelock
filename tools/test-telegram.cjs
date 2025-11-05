#!/usr/bin/env node

/**
 * Test HTML Escaping for Telegram
 *
 * Verifies that HTML special characters are properly escaped
 * Tests edge cases from Reddit research
 */

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Test cases from Reddit/Stack Overflow issues
const testCases = [
  {
    name: 'Basic HTML tags',
    input: '<script>alert("xss")</script>',
    expected: '&lt;script&gt;alert("xss")&lt;/script&gt;'
  },
  {
    name: 'Ampersand',
    input: 'Price: $100 & up',
    expected: 'Price: $100 &amp; up'
  },
  {
    name: 'Less than / Greater than',
    input: 'x < 10 && y > 5',
    expected: 'x &lt; 10 &amp;&amp; y &gt; 5'
  },
  {
    name: 'Code snippet with brackets',
    input: 'function foo() { return <div>bar</div>; }',
    expected: 'function foo() { return &lt;div&gt;bar&lt;/div&gt;; }'
  },
  {
    name: 'AI-generated content with special chars',
    input: 'Budget: $5,000-$8,000 (15% < market rate)',
    expected: 'Budget: $5,000-$8,000 (15% &lt; market rate)'
  },
  {
    name: 'Multiple ampersands (double-escaping check)',
    input: 'R&D && Q&A',
    expected: 'R&amp;D &amp;&amp; Q&amp;A'
  },
  {
    name: 'Empty string',
    input: '',
    expected: ''
  },
  {
    name: 'Already escaped (should double-escape)',
    input: '&lt;div&gt;',
    expected: '&amp;lt;div&amp;gt;'
  },
  {
    name: 'Mixed with emoji (should preserve)',
    input: 'Status: ✅ <completed>',
    expected: 'Status: ✅ &lt;completed&gt;'
  },
  {
    name: 'URL with query params',
    input: 'https://example.com?foo=1&bar=2',
    expected: 'https://example.com?foo=1&amp;bar=2'
  }
];

console.log('Testing HTML Escaping for Telegram\n');
console.log('=' .repeat(60));

let passed = 0;
let failed = 0;

for (const test of testCases) {
  const result = escapeHtml(test.input);
  const success = result === test.expected;

  if (success) {
    passed++;
    console.log(`✅ ${test.name}`);
  } else {
    failed++;
    console.log(`❌ ${test.name}`);
    console.log(`   Input:    "${test.input}"`);
    console.log(`   Expected: "${test.expected}"`);
    console.log(`   Got:      "${result}"`);
  }
}

console.log('=' .repeat(60));
console.log(`\nResults: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('✨ All tests passed!');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed');
  process.exit(1);
}
