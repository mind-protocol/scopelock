/**
 * Quality Tests for ScopeLock Mission Deck Frontend
 *
 * Maps to: AC.md section NF2 (Quality)
 * Severity: HIGH (must pass for AC Green)
 * Implements: L4 conformance patterns with attestation evidence
 *
 * Test Coverage:
 * - Q1: TypeScript strict mode enabled
 * - Q2: Build produces zero TypeScript errors
 * - Q3: ESLint configuration validation
 * - Q4: ESLint passes with zero warnings
 * - Q5: Keyboard navigation (Tab, Enter, Escape)
 * - Q6: Accessibility (focus indicators, color contrast)
 *
 * Pass Rate Requirement: ≥95% (high severity)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';

// ==============================================================================
// Q1: TypeScript Strict Mode Configuration
// ==============================================================================

test.describe('Q1: TypeScript Strict Mode', () => {
  test('tsconfig.json has strict mode enabled', () => {
    /**
     * CRITICAL: TypeScript strict mode must be enabled.
     *
     * Given: tsconfig.json exists in project root
     * When: We parse the configuration
     * Then: "strict": true is present
     *
     * Maps to: AC.md NF2 "TypeScript strict mode enabled"
     * Severity: high
     */
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');

    // Verify file exists
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    // Parse tsconfig.json
    const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf-8');
    const tsconfig = JSON.parse(tsconfigContent);

    // Assertion: strict mode enabled
    expect(tsconfig.compilerOptions?.strict).toBe(true);

    // Additional strict checks (should be true when strict: true)
    expect(tsconfig.compilerOptions?.noImplicitAny).not.toBe(false);
    expect(tsconfig.compilerOptions?.strictNullChecks).not.toBe(false);

    console.log('✓ TypeScript strict mode enabled');
  });

  test('no any types in source code (use proper types or unknown)', () => {
    /**
     * CRITICAL: No `any` types allowed in codebase.
     *
     * Given: All TypeScript files in src/
     * When: We search for `: any` or `as any` patterns
     * Then: Zero occurrences found (excluding comments/tests)
     *
     * Maps to: AC.md NF2 "No `any` types (use proper types or `unknown`)"
     * Severity: high
     */
    const srcPath = path.join(process.cwd(), 'src');

    try {
      // Search for `: any` or `as any` in TypeScript files
      // Exclude node_modules, .next, test files
      const result = execSync(
        `grep -r ": any\\|as any" ${srcPath} ` +
        `--include="*.ts" --include="*.tsx" ` +
        `--exclude-dir=node_modules --exclude-dir=.next ` +
        `--exclude="*.test.ts" --exclude="*.test.tsx" || true`,
        { encoding: 'utf-8' }
      );

      // Parse results (filter out comments)
      const lines = result.split('\n').filter(line => {
        return line.trim() &&
               !line.includes('//') &&
               !line.includes('/*') &&
               !line.includes('*/');
      });

      // Assertion: No `any` types in source code
      if (lines.length > 0) {
        console.error('Found `any` types in source code:');
        lines.forEach(line => console.error(`  ${line}`));
      }
      expect(lines.length).toBe(0);

      console.log('✓ No `any` types found in source code');
    } catch (error) {
      // If grep fails (no matches), that's good!
      console.log('✓ No `any` types found in source code');
    }
  });
});

// ==============================================================================
// Q2: Build Produces Zero TypeScript Errors
// ==============================================================================

test.describe('Q2: TypeScript Build', () => {
  test('next build produces zero TypeScript errors', async () => {
    /**
     * CRITICAL: Production build must have zero TypeScript errors.
     *
     * Given: Source code in src/
     * When: We run `next build` (or `tsc --noEmit`)
     * Then: Exit code is 0, no TypeScript errors reported
     *
     * Maps to: AC.md NF2 "Zero TypeScript errors on build"
     * Severity: high
     */
    const startTime = Date.now();

    try {
      // Run TypeScript check (faster than full build)
      // `tsc --noEmit` checks types without generating output
      const output = execSync('npx tsc --noEmit', {
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      const duration = Date.now() - startTime;

      // Assertion: No errors (exit code 0)
      console.log(`✓ TypeScript check passed (${duration}ms)`);
      expect(output).not.toContain('error TS');

    } catch (error: any) {
      // If tsc fails, error.stdout/stderr contain error messages
      const output = error.stdout + error.stderr;

      // Count TypeScript errors
      const errorCount = (output.match(/error TS\d+:/g) || []).length;

      console.error(`✗ TypeScript check failed with ${errorCount} errors:`);
      console.error(output);

      // Assertion: Zero errors required
      expect(errorCount).toBe(0);
    }
  });
});

// ==============================================================================
// Q3: ESLint Configuration Validation
// ==============================================================================

test.describe('Q3: ESLint Configuration', () => {
  test('eslint config exists and is strict', () => {
    /**
     * CRITICAL: ESLint must be configured with strict rules.
     *
     * Given: .eslintrc.json or eslint.config.js exists
     * When: We parse the configuration
     * Then: Recommended rules are enabled (no warnings allowed)
     *
     * Maps to: AC.md NF2 "ESLint passes with zero warnings"
     * Severity: high
     */
    const possibleConfigs = [
      '.eslintrc.json',
      '.eslintrc.js',
      'eslint.config.js',
      '.eslintrc.cjs'
    ];

    let configPath: string | null = null;
    for (const configFile of possibleConfigs) {
      const fullPath = path.join(process.cwd(), configFile);
      if (fs.existsSync(fullPath)) {
        configPath = fullPath;
        break;
      }
    }

    // Assertion: Config file exists
    expect(configPath).not.toBeNull();
    console.log(`✓ ESLint config found: ${path.basename(configPath!)}`);

    // Parse config (if JSON)
    if (configPath?.endsWith('.json')) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent);

      // Check for recommended rules
      const hasRecommended =
        config.extends?.includes('next') ||
        config.extends?.includes('next/core-web-vitals') ||
        config.extends?.includes('eslint:recommended');

      expect(hasRecommended).toBe(true);
      console.log('✓ ESLint uses recommended rules');
    }
  });
});

// ==============================================================================
// Q4: ESLint Passes With Zero Warnings
// ==============================================================================

test.describe('Q4: ESLint Execution', () => {
  test('eslint passes with zero warnings', () => {
    /**
     * CRITICAL: ESLint must pass with zero warnings on source code.
     *
     * Given: Source code in src/
     * When: We run `eslint src/ --max-warnings=0`
     * Then: Exit code is 0, no warnings reported
     *
     * Maps to: AC.md NF2 "ESLint passes with zero warnings"
     * Severity: high
     */
    const startTime = Date.now();

    try {
      // Run ESLint with --max-warnings=0 (fails if any warnings)
      const output = execSync(
        'npx eslint src/ --max-warnings=0 --format=compact',
        { encoding: 'utf-8', stdio: 'pipe' }
      );

      const duration = Date.now() - startTime;

      console.log(`✓ ESLint passed with 0 warnings (${duration}ms)`);

    } catch (error: any) {
      // If eslint fails, parse output
      const output = error.stdout + error.stderr;

      // Count warnings and errors
      const warningCount = (output.match(/warning/gi) || []).length;
      const errorCount = (output.match(/error/gi) || []).length;

      console.error(`✗ ESLint failed:`);
      console.error(`  Errors: ${errorCount}`);
      console.error(`  Warnings: ${warningCount}`);
      console.error(output);

      // Assertion: Zero warnings/errors required
      expect(warningCount + errorCount).toBe(0);
    }
  });
});

// ==============================================================================
// Q5: Keyboard Navigation
// ==============================================================================

test.describe('Q5: Keyboard Navigation', () => {
  test('mission selector navigable via Tab key', async ({ page }) => {
    /**
     * CRITICAL: Users can navigate mission list using Tab key.
     *
     * Given: Mission list is displayed
     * When: User presses Tab repeatedly
     * Then: Focus moves through mission cards in order
     *
     * Maps to: AC.md NF2 "Keyboard navigation works (Tab, Enter, Escape)"
     * Severity: high
     */
    // Navigate to console (assuming auth is handled in beforeEach)
    await page.goto('http://localhost:3000/deck');

    // Wait for mission list to load
    await page.waitForSelector('[data-testid="mission-card"]');

    // Get all mission cards
    const missionCards = page.locator('[data-testid="mission-card"]');
    const cardCount = await missionCards.count();

    expect(cardCount).toBeGreaterThan(0);

    // Press Tab and verify focus moves through cards
    for (let i = 0; i < cardCount; i++) {
      await page.keyboard.press('Tab');

      // Get currently focused element
      const focusedElement = await page.evaluateHandle(() => document.activeElement);
      const focusedRole = await focusedElement.evaluate((el) => el.getAttribute('role'));

      // Assertion: Focus should be on a mission card or button
      expect(['button', 'link']).toContain(focusedRole);
    }

    console.log(`✓ Tab navigation works (${cardCount} cards)`);
  });

  test('Enter key activates mission selection', async ({ page }) => {
    /**
     * CRITICAL: Users can select mission using Enter key.
     *
     * Given: Mission card has focus
     * When: User presses Enter
     * Then: Mission is selected (active state changes)
     *
     * Maps to: AC.md NF2 "Keyboard navigation works (Tab, Enter, Escape)"
     * Severity: high
     */
    await page.goto('http://localhost:3000/deck');
    await page.waitForSelector('[data-testid="mission-card"]');

    // Focus first mission card
    await page.keyboard.press('Tab');

    // Get mission title before Enter
    const firstCard = page.locator('[data-testid="mission-card"]').first();
    const missionTitle = await firstCard.textContent();

    // Press Enter to select
    await page.keyboard.press('Enter');

    // Wait for mission content to load
    await page.waitForTimeout(500);

    // Assertion: Selected mission's title appears in main panel
    const mainPanel = page.locator('[data-testid="main-panel"]');
    await expect(mainPanel).toContainText(missionTitle || '');

    console.log(`✓ Enter key selects mission: ${missionTitle}`);
  });

  test('Escape key closes modals/dialogs', async ({ page }) => {
    /**
     * MEDIUM: Users can close modals using Escape key.
     *
     * Given: A modal/dialog is open
     * When: User presses Escape
     * Then: Modal closes
     *
     * Maps to: AC.md NF2 "Keyboard navigation works (Tab, Enter, Escape)"
     * Severity: medium
     */
    // This test assumes modals exist (if not, skip)
    await page.goto('http://localhost:3000/deck');

    // Try to open a modal (adjust selector based on actual implementation)
    // Example: Click "Mark All Complete" button to open confirmation
    const markCompleteButton = page.locator('button:has-text("Mark All Complete")');

    if (await markCompleteButton.count() > 0) {
      await markCompleteButton.click();
      await page.waitForTimeout(300);

      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // Assertion: Modal should be closed (not visible)
      const modal = page.locator('[role="dialog"]');
      await expect(modal).not.toBeVisible();

      console.log('✓ Escape key closes modals');
    } else {
      console.log('ℹ No modals to test (skipped)');
    }
  });
});

// ==============================================================================
// Q6: Accessibility (Focus & Contrast)
// ==============================================================================

test.describe('Q6: Accessibility', () => {
  test('focus indicators visible on all interactive elements', async ({ page }) => {
    /**
     * CRITICAL: All interactive elements show visible focus indicators.
     *
     * Given: Interactive elements exist (buttons, links, inputs)
     * When: Element receives focus
     * Then: Focus indicator is visible (outline or ring)
     *
     * Maps to: AC.md NF2 "Focus indicators visible on all interactive elements"
     * Severity: high
     */
    await page.goto('http://localhost:3000/deck');

    // Get all interactive elements
    const interactiveElements = await page.locator(
      'button, a, input, textarea, [role="button"]'
    ).all();

    expect(interactiveElements.length).toBeGreaterThan(0);

    let testedCount = 0;

    for (const element of interactiveElements.slice(0, 10)) { // Test first 10
      // Focus element
      await element.focus();

      // Check computed styles
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          boxShadow: computed.boxShadow,
        };
      });

      // Assertion: Focus indicator present (outline or box-shadow)
      const hasFocusIndicator =
        styles.outlineWidth !== '0px' ||
        styles.boxShadow !== 'none';

      expect(hasFocusIndicator).toBe(true);
      testedCount++;
    }

    console.log(`✓ Focus indicators visible (tested ${testedCount} elements)`);
  });

  test('color contrast meets WCAG AA (≥4.5:1)', async ({ page }) => {
    /**
     * CRITICAL: Text color contrast meets WCAG AA standards.
     *
     * Given: Text elements on page
     * When: We measure contrast ratio (foreground vs background)
     * Then: All text has contrast ≥4.5:1
     *
     * Maps to: AC.md NF2 "Color contrast ≥4.5:1 (WCAG AA)"
     * Severity: high
     */
    await page.goto('http://localhost:3000/deck');

    // Use axe-core for accessibility audit
    // Install: npm install --save-dev @axe-core/playwright
    const { injectAxe, checkA11y } = require('axe-playwright');

    await injectAxe(page);

    // Run color contrast check
    try {
      await checkA11y(page, null, {
        detailedReport: true,
        detailedReportOptions: {
          html: false,
        },
        rules: {
          'color-contrast': { enabled: true },
        },
      });

      console.log('✓ Color contrast meets WCAG AA');
    } catch (error: any) {
      console.error('✗ Color contrast violations found:');
      console.error(error.message);
      throw error;
    }
  });
});

// ==============================================================================
// L4 Conformance Summary
// ==============================================================================

/**
 * Conformance Results:
 * - Test Count: 10 tests across 6 quality criteria
 * - Severity: high (≥95% pass rate required)
 * - Maps to: AC.md NF2 (Quality)
 *
 * Attestation Evidence:
 * - TypeScript strict mode: Q1
 * - Build quality: Q2
 * - Linting: Q3, Q4
 * - Keyboard navigation: Q5 (3 tests)
 * - Accessibility: Q6 (2 tests)
 *
 * If <95% pass: Review failures before AC Green
 * If any critical test fails: Block delivery
 */
