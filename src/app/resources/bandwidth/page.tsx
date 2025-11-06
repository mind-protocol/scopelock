import Link from 'next/link';
import './styles.css';

export const metadata = {
  title: 'Bandwidth Solutions - ScopeLock',
  description: 'Work effectively on slow or unstable internet connections. Solutions for remote teams in Nigeria, India, Philippines, and rural areas.',
};

export default function BandwidthSolutionsPage() {
  return (
    <main className="bandwidth-page">
      <header className="bandwidth-hero">
        <h1>Bandwidth Solutions for Remote Teams</h1>
        <p className="bandwidth-intro">
          Work effectively on slow or unstable internet connections.
          These 4 solutions reduce bandwidth usage by 50-90% and improve stability.
        </p>
        <div className="bandwidth-audience">
          <span className="audience-tag">🇳🇬 Nigeria</span>
          <span className="audience-tag">🇮🇳 India</span>
          <span className="audience-tag">🇵🇭 Philippines</span>
          <span className="audience-tag">🌍 Rural areas</span>
          <span className="audience-tag">📶 Unstable connections</span>
        </div>
      </header>

      {/* Solution 1: Opera Turbo */}
      <section className="solution-card solution-opera">
        <div className="solution-header">
          <div className="solution-icon">🚀</div>
          <div>
            <h2>1. Opera Browser with Turbo Mode</h2>
            <p className="solution-tagline">50-90% bandwidth savings on ALL websites</p>
          </div>
        </div>

        <div className="solution-stats">
          <div className="stat">
            <div className="stat-value">78%</div>
            <div className="stat-label">Upwork page</div>
            <div className="stat-detail">1.8 MB → 400 KB</div>
          </div>
          <div className="stat">
            <div className="stat-value">76%</div>
            <div className="stat-label">Gmail inbox</div>
            <div className="stat-detail">2.5 MB → 600 KB</div>
          </div>
          <div className="stat">
            <div className="stat-value">75%</div>
            <div className="stat-label">YouTube page</div>
            <div className="stat-detail">3.2 MB → 800 KB</div>
          </div>
        </div>

        <div className="solution-how">
          <h3>How it works</h3>
          <div className="flow-diagram">
            <div className="flow-step">
              <span className="flow-label">Your Browser</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step flow-highlight">
              <span className="flow-label">Opera Servers</span>
              <span className="flow-note">Compress images, remove bloat</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-label">Website</span>
            </div>
          </div>
          <p className="flow-result">
            <strong>Result:</strong> 1.5 MB page → 300 KB download (80% savings)
          </p>
        </div>

        <details className="setup-steps">
          <summary className="setup-summary">
            <span className="setup-icon">⚙️</span>
            <strong>Setup Instructions (5 minutes)</strong>
          </summary>
          <div className="setup-content">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Download Opera Browser</h4>
                <a href="https://www.opera.com/download" target="_blank" rel="noopener" className="download-link">
                  opera.com/download →
                </a>
                <p>Works on Windows, Mac, Linux</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Enable Turbo Mode</h4>
                <ul className="step-list">
                  <li>Open Opera</li>
                  <li>Press <kbd>Alt</kbd> + <kbd>P</kbd> (or <kbd>Cmd</kbd> + <kbd>,</kbd> on Mac)</li>
                  <li>Scroll to "Features" section</li>
                  <li>Toggle <strong>"Opera Turbo"</strong> ON</li>
                  <li>Blue icon appears in address bar when active ✓</li>
                </ul>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Verify It's Working</h4>
                <ul className="step-list">
                  <li>Visit any website (e.g., Upwork)</li>
                  <li>Click the Turbo icon in address bar</li>
                  <li>You'll see: <code>Data saved: 1.2 MB (78%)</code></li>
                </ul>
              </div>
            </div>
          </div>
        </details>

        <div className="solution-benefits">
          <div className="benefit-col">
            <h4>✅ What gets compressed</h4>
            <ul>
              <li><strong>Images</strong> - 500 KB photo → 50 KB (biggest savings)</li>
              <li><strong>HTML/CSS/JS</strong> - Minified and gzipped</li>
              <li><strong>Videos</strong> - Lower resolution, reduced bitrate</li>
              <li><strong>Fonts</strong> - Fallback to system fonts</li>
            </ul>
          </div>
          <div className="benefit-col">
            <h4>🔒 What's NOT compressed</h4>
            <ul>
              <li><strong>Banking sites</strong> - Direct connection for security</li>
              <li><strong>Login pages</strong> - Passwords not routed through Opera</li>
              <li><strong>Payment pages</strong> - HTTPS encryption preserved</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solution 2: Telegram Desktop */}
      <section className="solution-card solution-telegram">
        <div className="solution-header">
          <div className="solution-icon">💬</div>
          <div>
            <h2>2. Telegram Desktop (Not Web Version)</h2>
            <p className="solution-tagline">Works offline · Caches everything · Syncs when connection returns</p>
          </div>
        </div>

        <div className="comparison-table">
          <div className="comparison-header">
            <div className="comparison-col">Telegram Web</div>
            <div className="comparison-col comparison-winner">Telegram Desktop</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-col">❌ Reloads on refresh</div>
            <div className="comparison-col">✅ Caches locally</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-col">❌ Requires constant connection</div>
            <div className="comparison-col">✅ Works offline</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-col">❌ Lost messages on disconnect</div>
            <div className="comparison-col">✅ Syncs when back online</div>
          </div>
        </div>

        <details className="setup-steps">
          <summary className="setup-summary">
            <span className="setup-icon">⚙️</span>
            <strong>Setup Instructions (3 minutes)</strong>
          </summary>
          <div className="setup-content">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Download Telegram Desktop</h4>
                <a href="https://desktop.telegram.org" target="_blank" rel="noopener" className="download-link">
                  desktop.telegram.org →
                </a>
                <p>Works on Windows, Mac, Linux</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Login</h4>
                <ul className="step-list">
                  <li>Enter your phone number</li>
                  <li>Enter verification code from SMS</li>
                </ul>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Configure for Slow Connections</h4>
                <ul className="step-list">
                  <li>Settings → Advanced → Network and Storage</li>
                  <li>Enable <strong>"Auto-download media"</strong> only on WiFi</li>
                  <li>Set <strong>"Auto-play GIFs"</strong> to OFF (saves bandwidth)</li>
                </ul>
              </div>
            </div>
          </div>
        </details>

        <div className="solution-benefits">
          <h4>Why Telegram Desktop is better for slow connections</h4>
          <ul className="benefit-list-large">
            <li>✅ <strong>Messages cached locally</strong> - Read offline anytime</li>
            <li>✅ <strong>Media downloads in background</strong> - Continues after disconnect</li>
            <li>✅ <strong>Voice messages</strong> - Download once (50 KB), listen offline</li>
            <li>✅ <strong>Auto-sync</strong> - No lost messages when connection returns</li>
          </ul>
        </div>
      </section>

      {/* Solution 3: Voice Messages */}
      <section className="solution-card solution-voice">
        <div className="solution-header">
          <div className="solution-icon">🎙️</div>
          <div>
            <h2>3. Voice Messages Instead of Video Calls</h2>
            <p className="solution-tagline">Works on ANY connection · Async · No real-time required</p>
          </div>
        </div>

        <div className="bandwidth-comparison">
          <div className="bandwidth-item bandwidth-bad">
            <div className="bandwidth-icon">📹</div>
            <div className="bandwidth-label">Video Call</div>
            <div className="bandwidth-value">500 KB/s</div>
            <div className="bandwidth-note">Minimum required</div>
            <div className="bandwidth-status">❌ Fails on slow connections</div>
          </div>
          <span className="bandwidth-vs">vs</span>
          <div className="bandwidth-item bandwidth-good">
            <div className="bandwidth-icon">🎙️</div>
            <div className="bandwidth-label">Voice Message</div>
            <div className="bandwidth-value">50 KB</div>
            <div className="bandwidth-note">Total file size</div>
            <div className="bandwidth-status">✅ Works on any connection</div>
          </div>
        </div>

        <details className="setup-steps">
          <summary className="setup-summary">
            <span className="setup-icon">🎯</span>
            <strong>How to Use (Telegram Desktop)</strong>
          </summary>
          <div className="setup-content">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Record Voice Message</h4>
                <ul className="step-list">
                  <li>Click microphone icon in chat</li>
                  <li>Hold and speak (or click to lock recording)</li>
                  <li>Release to send</li>
                </ul>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Listen to Voice Messages</h4>
                <ul className="step-list">
                  <li>Messages download automatically (small file size)</li>
                  <li>Listen offline after download</li>
                  <li>Speed up: Right-click → Playback speed → 1.5x or 2x</li>
                </ul>
              </div>
            </div>
          </div>
        </details>

        <div className="use-cases">
          <div className="use-case-col use-case-yes">
            <h4>✅ Use voice messages for:</h4>
            <ul>
              <li>Daily status updates</li>
              <li>Explaining complex ideas</li>
              <li>Debugging help</li>
              <li>Questions that need context</li>
            </ul>
          </div>
          <div className="use-case-col use-case-no">
            <h4>❌ Don't use voice for:</h4>
            <ul>
              <li>Quick yes/no questions (just type)</li>
              <li>Links or code (text is easier to copy)</li>
              <li>Formal documentation (write it down)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solution 4: Screenshots */}
      <section className="solution-card solution-screenshot">
        <div className="solution-header">
          <div className="solution-icon">📸</div>
          <div>
            <h2>4. Screenshots to Explain Things</h2>
            <p className="solution-tagline">Replace screen sharing · Send once · View offline forever</p>
          </div>
        </div>

        <div className="bandwidth-comparison">
          <div className="bandwidth-item bandwidth-bad">
            <div className="bandwidth-icon">🖥️</div>
            <div className="bandwidth-label">Screen Sharing</div>
            <div className="bandwidth-value">1-2 Mbps</div>
            <div className="bandwidth-note">Continuous bandwidth</div>
            <div className="bandwidth-status">❌ Fails on slow connections</div>
          </div>
          <span className="bandwidth-vs">vs</span>
          <div className="bandwidth-item bandwidth-good">
            <div className="bandwidth-icon">📸</div>
            <div className="bandwidth-label">Screenshot</div>
            <div className="bandwidth-value">200 KB</div>
            <div className="bandwidth-note">One-time upload</div>
            <div className="bandwidth-status">✅ Works on any connection</div>
          </div>
        </div>

        <details className="setup-steps setup-snipping" open>
          <summary className="setup-summary">
            <span className="setup-icon">✂️</span>
            <strong>Using Snipping Tool (Windows) - Step-by-Step</strong>
          </summary>
          <div className="setup-content">

            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Open Snipping Tool</h4>
                <div className="method-box method-recommended">
                  <div className="method-tag">⚡ Fastest</div>
                  <div className="method-content">
                    <strong>Keyboard Shortcut:</strong>
                    <div className="keyboard-combo">
                      <kbd>Windows</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>
                    </div>
                    <p>Screen dims immediately, cursor changes to crosshair (+)</p>
                  </div>
                </div>

                <div className="method-box">
                  <strong>Alternative: Start Menu</strong>
                  <ul className="step-list">
                    <li>Click Start Menu</li>
                    <li>Type "Snipping Tool"</li>
                    <li>Click "Snipping Tool" app</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Select Capture Type</h4>
                <p>After pressing <kbd>Windows</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>, you'll see 4 options at top:</p>

                <div className="capture-types">
                  <div className="capture-type capture-type-recommended">
                    <div className="capture-icon">▭</div>
                    <div className="capture-name">Rectangle Snip</div>
                    <div className="capture-tag">Most common</div>
                    <p>Click and drag to select area</p>
                    <div className="capture-uses">Use for: Error messages, form fields, specific sections</div>
                  </div>

                  <div className="capture-type">
                    <div className="capture-icon">∽</div>
                    <div className="capture-name">Freeform Snip</div>
                    <p>Draw any shape around area</p>
                    <div className="capture-uses">Use for: Irregular shapes, highlighting parts</div>
                  </div>

                  <div className="capture-type">
                    <div className="capture-icon">⊡</div>
                    <div className="capture-name">Window Snip</div>
                    <p>Click window to capture entire window</p>
                    <div className="capture-uses">Use for: Full application windows</div>
                  </div>

                  <div className="capture-type">
                    <div className="capture-icon">▢</div>
                    <div className="capture-name">Fullscreen Snip</div>
                    <p>Captures entire screen instantly</p>
                    <div className="capture-uses">Use for: Full desktop, multiple windows</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Capture the Screenshot</h4>
                <div className="visual-guide">
                  <div className="visual-step">
                    <div className="visual-number">1</div>
                    <p>Press <kbd>Windows</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></p>
                  </div>
                  <span className="visual-arrow">→</span>
                  <div className="visual-step">
                    <div className="visual-number">2</div>
                    <p>Screen dims, cursor becomes crosshair (+)</p>
                  </div>
                  <span className="visual-arrow">→</span>
                  <div className="visual-step">
                    <div className="visual-number">3</div>
                    <p>Click top-left, drag to bottom-right</p>
                  </div>
                  <span className="visual-arrow">→</span>
                  <div className="visual-step">
                    <div className="visual-number">4</div>
                    <p>Release mouse button</p>
                  </div>
                  <span className="visual-arrow">→</span>
                  <div className="visual-step visual-success">
                    <div className="visual-number">✓</div>
                    <p>Screenshot saved to clipboard!</p>
                  </div>
                </div>

                <div className="tips-box">
                  <strong>💡 Tips:</strong>
                  <ul className="step-list">
                    <li>Zoom in (Ctrl + Mouse Wheel) before capturing for precision</li>
                    <li>Capture just what's needed (smaller file = faster upload)</li>
                    <li>Include context (don't crop out error codes or headers)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Annotate (Optional but Helpful)</h4>
                <p>After capturing, a notification appears bottom-right. Click it to open editor.</p>

                <div className="annotation-tools">
                  <div className="tool">
                    <div className="tool-icon">✏️</div>
                    <div className="tool-name">Ballpoint Pen</div>
                    <div className="tool-use">Draw circles, arrows, underlines</div>
                  </div>
                  <div className="tool">
                    <div className="tool-icon">🖍️</div>
                    <div className="tool-name">Highlighter</div>
                    <div className="tool-use">Highlight important text</div>
                  </div>
                  <div className="tool">
                    <div className="tool-icon">⌂</div>
                    <div className="tool-name">Eraser</div>
                    <div className="tool-use">Remove annotations</div>
                  </div>
                  <div className="tool">
                    <div className="tool-icon">📏</div>
                    <div className="tool-name">Ruler</div>
                    <div className="tool-use">Draw straight lines</div>
                  </div>
                  <div className="tool">
                    <div className="tool-icon">✂️</div>
                    <div className="tool-name">Crop</div>
                    <div className="tool-use">Trim unnecessary edges</div>
                  </div>
                </div>

                <div className="annotation-examples">
                  <strong>Common annotations:</strong>
                  <ul className="step-list">
                    <li><span className="annotation-preview" style={{color: 'var(--slk-danger)'}}>⭕</span> Circle error message (red pen)</li>
                    <li><span className="annotation-preview" style={{color: 'var(--slk-danger)'}}>→</span> Arrow pointing to problem (red pen)</li>
                    <li><span className="annotation-preview" style={{background: 'rgba(255, 200, 0, 0.3)', padding: '0 4px'}}>▓</span> Highlight relevant code (yellow highlighter)</li>
                  </ul>
                </div>

                <div className="save-options">
                  <div className="save-option save-option-fast">
                    <strong>⚡ Fast: Skip annotation, paste directly</strong>
                    <p>Screenshot is already in clipboard</p>
                    <ul className="step-list">
                      <li>Open Telegram</li>
                      <li>Press <kbd>Ctrl</kbd> + <kbd>V</kbd></li>
                      <li>Press <kbd>Enter</kbd> to send</li>
                    </ul>
                  </div>
                  <div className="save-option">
                    <strong>Or: Save annotated screenshot</strong>
                    <ul className="step-list">
                      <li>Click save icon (floppy disk, top-right)</li>
                      <li>Choose location (Desktop or Documents)</li>
                      <li>Filename: "upwork-error-2025-11-06.png"</li>
                      <li>Click "Save"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h4>Share the Screenshot</h4>

                <div className="share-methods">
                  <div className="share-method share-method-recommended">
                    <div className="method-tag">⚡ Fastest</div>
                    <strong>Paste from Clipboard</strong>
                    <ol className="step-list">
                      <li>Take screenshot (<kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>)</li>
                      <li>Open Telegram Desktop</li>
                      <li>Click into chat message box</li>
                      <li>Press <kbd>Ctrl</kbd> + <kbd>V</kbd></li>
                      <li>Screenshot appears, press <kbd>Enter</kbd> to send</li>
                    </ol>
                  </div>

                  <div className="share-method">
                    <strong>Upload Saved File</strong>
                    <ol className="step-list">
                      <li>Open Telegram Desktop</li>
                      <li>Click paperclip icon (attach file)</li>
                      <li>Navigate to saved screenshot</li>
                      <li>Select file, click "Open"</li>
                      <li>Press <kbd>Enter</kbd> to send</li>
                    </ol>
                  </div>

                  <div className="share-method">
                    <strong>Drag and Drop</strong>
                    <ol className="step-list">
                      <li>Open File Explorer, find screenshot</li>
                      <li>Open Telegram Desktop chat</li>
                      <li>Drag screenshot into chat window</li>
                      <li>Drop to send</li>
                    </ol>
                  </div>
                </div>

                <div className="best-practice">
                  <strong>🎯 Best Practice: Screenshot + Voice</strong>
                  <ol className="step-list">
                    <li>Send screenshot first (visual context)</li>
                    <li>Record voice message explaining it</li>
                    <li>"This screenshot shows [X], the problem is [Y], I tried [Z]"</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="troubleshooting-section">
              <h4>🔧 Troubleshooting</h4>

              <details className="troubleshooting-item">
                <summary><strong>Problem: Snipping Tool won't open</strong></summary>
                <div className="troubleshooting-fix">
                  <strong>Fix 1: Check if it's disabled</strong>
                  <ul className="step-list">
                    <li>Settings → Apps → Optional Features</li>
                    <li>Search "Snipping Tool"</li>
                    <li>If not listed: "Add a feature" → Install "Snipping Tool"</li>
                  </ul>

                  <strong>Fix 2: Update Windows</strong>
                  <ul className="step-list">
                    <li>Settings → Update & Security → Windows Update</li>
                    <li>Click "Check for updates"</li>
                    <li>Install pending updates, restart</li>
                  </ul>

                  <strong>Fix 3: Use legacy Snipping Tool (Windows 10)</strong>
                  <ul className="step-list">
                    <li>Press <kbd>Windows</kbd> key</li>
                    <li>Type "Snipping Tool" (not "Snip & Sketch")</li>
                    <li>Open legacy app, click "New"</li>
                  </ul>
                </div>
              </details>

              <details className="troubleshooting-item">
                <summary><strong>Problem: Screenshot quality is poor</strong></summary>
                <div className="troubleshooting-fix">
                  <strong>Fix: Use PNG format (not JPG)</strong>
                  <ul className="step-list">
                    <li>Open Snip & Sketch</li>
                    <li>File → Save As</li>
                    <li>Change "Save as type" to "PNG image"</li>
                    <li>PNG is lossless (better for text, code, UI)</li>
                  </ul>
                </div>
              </details>

              <details className="troubleshooting-item">
                <summary><strong>Problem: Screenshots too large to upload</strong></summary>
                <div className="troubleshooting-fix">
                  <strong>Fix 1: Capture smaller area</strong>
                  <p>Don't capture entire screen if not needed. Zoom in, capture just relevant section.</p>

                  <strong>Fix 2: Compress before uploading</strong>
                  <ul className="step-list">
                    <li>Right-click screenshot → Edit with Paint</li>
                    <li>File → Save → Use JPG format</li>
                    <li>Reduces 2 MB PNG to 200 KB JPG</li>
                  </ul>
                </div>
              </details>
            </div>

          </div>
        </details>
      </section>

      {/* When to Use Each Solution */}
      <section className="solution-card solution-reference">
        <h2>When to Use Each Solution</h2>
        <div className="situation-grid">
          <div className="situation">
            <div className="situation-icon">🐌</div>
            <div className="situation-text">
              <strong>Upwork page loading slowly</strong>
              <span className="situation-solution">→ Opera Turbo (78% savings)</span>
            </div>
          </div>

          <div className="situation">
            <div className="situation-icon">📹</div>
            <div className="situation-text">
              <strong>Can't join video call</strong>
              <span className="situation-solution">→ Voice message (works on any connection)</span>
            </div>
          </div>

          <div className="situation">
            <div className="situation-icon">🖥️</div>
            <div className="situation-text">
              <strong>Need to show error on screen</strong>
              <span className="situation-solution">→ Screenshot + voice (no screen sharing)</span>
            </div>
          </div>

          <div className="situation">
            <div className="situation-icon">📡</div>
            <div className="situation-text">
              <strong>Lost messages after disconnect</strong>
              <span className="situation-solution">→ Telegram Desktop (caches everything)</span>
            </div>
          </div>

          <div className="situation">
            <div className="situation-icon">🖼️</div>
            <div className="situation-text">
              <strong>Images taking forever to load</strong>
              <span className="situation-solution">→ Opera Turbo (90% compression)</span>
            </div>
          </div>

          <div className="situation">
            <div className="situation-icon">💬</div>
            <div className="situation-text">
              <strong>Explaining complex concept</strong>
              <span className="situation-solution">→ Screenshot + voice (visual + verbal)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="solution-card solution-quickref">
        <h2>Quick Reference</h2>

        <div className="quickref-grid">
          <div className="quickref-section">
            <h3>Opera Turbo</h3>
            <div className="shortcut">
              <span className="shortcut-label">Toggle:</span>
              <span className="shortcut-value">Click icon in address bar</span>
            </div>
          </div>

          <div className="quickref-section">
            <h3>Telegram Desktop</h3>
            <div className="shortcut">
              <span className="shortcut-label">Record voice:</span>
              <span className="shortcut-value">Click microphone icon</span>
            </div>
            <div className="shortcut">
              <span className="shortcut-label">Send screenshot:</span>
              <kbd>Ctrl</kbd> + <kbd>V</kbd>
            </div>
            <div className="shortcut">
              <span className="shortcut-label">Speed up playback:</span>
              <span className="shortcut-value">Right-click voice → Playback speed</span>
            </div>
          </div>

          <div className="quickref-section">
            <h3>Snipping Tool</h3>
            <div className="shortcut">
              <span className="shortcut-label">Capture:</span>
              <kbd>Windows</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>
            </div>
            <div className="shortcut">
              <span className="shortcut-label">Save:</span>
              <kbd>Ctrl</kbd> + <kbd>S</kbd>
            </div>
            <div className="shortcut">
              <span className="shortcut-label">Copy:</span>
              <kbd>Ctrl</kbd> + <kbd>C</kbd>
            </div>
          </div>
        </div>
      </section>

      {/* Help */}
      <section className="solution-card solution-help">
        <h2>Need Help?</h2>
        <p className="help-text">
          Ask in Telegram with <strong>screenshot + voice message</strong> explaining the issue.
        </p>
        <p className="help-meta">
          <strong>Last Updated:</strong> 2025-11-06 · <strong>Owner:</strong> Rafael (team-wide resource)
        </p>
      </section>

      {/* Footer nav */}
      <nav className="page-footer-nav">
        <Link href="/" className="footer-nav-link">← Back to Home</Link>
      </nav>
    </main>
  );
}
