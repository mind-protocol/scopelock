'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './styles.css';

type DeviceType = 'desktop' | 'android' | 'ios' | 'unknown';

export default function BandwidthSolutionsPage() {
  const [device, setDevice] = useState<DeviceType>('unknown');

  useEffect(() => {
    // Detect device type on client side
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isMobile = /mobile|android|iphone|ipad|ipod/.test(userAgent) || window.innerWidth < 768;

    if (isAndroid) {
      setDevice('android');
    } else if (isIOS) {
      setDevice('ios');
    } else if (isMobile) {
      setDevice('android'); // Default mobile to android if can't detect
    } else {
      setDevice('desktop');
    }
  }, []);

  // Show loading state or nothing until we know the device
  if (device === 'unknown') {
    return null;
  }

  const isMobile = device === 'android' || device === 'ios';

  return (
    <main className="bandwidth-page">
      <header className="bandwidth-hero">
        <h1>Work Fast on Slow Connections</h1>
        <p className="bandwidth-intro">
          4 simple tools that make Upwork, Telegram, and screen sharing work on any connection speed.
          Set up once (15 minutes), work faster forever.
        </p>
      </header>

      {/* Solution 1: Browser Data Saver */}
      <section className="solution-card solution-opera">
        <div className="solution-header">
          <div className="solution-icon">🚀</div>
          <div>
            {device === 'desktop' ? (
              <>
                <h2>1. Opera Browser loads Upwork 5x faster than Chrome</h2>
                <p className="solution-tagline">Upwork loads in 2 seconds instead of 10+ seconds</p>
              </>
            ) : (
              <>
                <h2>1. Browser data saver makes websites load faster</h2>
                <p className="solution-tagline">Save up to 60% of your mobile data</p>
              </>
            )}
          </div>
        </div>

        <div className="benefit-box">
          <strong>What you get:</strong> Upwork pages, Gmail, and every website loads 5-10x faster.
          Works on 2G, 3G, or unstable WiFi. Free forever.
        </div>

        <details className="setup-steps">
          <summary className="setup-summary">
            <span className="setup-icon">📖</span>
            <strong>Click to see setup ({device === 'desktop' ? '5' : '3'} minutes)</strong>
            <span className="chevron">›</span>
          </summary>
          <div className="setup-content">
            {device === 'desktop' ? (
              // Desktop: Opera with Turbo Mode
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Download Opera</h4>
                    <a href="https://www.opera.com/download" target="_blank" rel="noopener" className="download-link">
                      opera.com/download →
                    </a>
                    <p>Works on Windows, Mac, Linux</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Turn on Turbo Mode</h4>
                    <ul className="step-list">
                      <li>Open Opera</li>
                      <li>Press <kbd>Alt</kbd> + <kbd>P</kbd> (Settings)</li>
                      <li>Find "Opera Turbo"</li>
                      <li>Turn it ON</li>
                      <li>Blue icon appears in address bar ✓</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Done! Test it</h4>
                    <p>Go to Upwork. It loads much faster now. Click the blue Turbo icon to see how much data you saved.</p>
                  </div>
                </div>
              </>
            ) : device === 'android' ? (
              // Android: Chrome Lite Mode or Opera Mini
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Option A: Chrome Lite Mode (Recommended)</h4>
                    <ul className="step-list">
                      <li>Open Chrome app</li>
                      <li>Tap three dots (⋮) → Settings</li>
                      <li>Tap "Lite mode"</li>
                      <li>Turn it ON</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Option B: Opera Mini (Even Faster)</h4>
                    <ul className="step-list">
                      <li>Open Play Store</li>
                      <li>Search "Opera Mini"</li>
                      <li>Install Opera Mini</li>
                      <li>Use it instead of Chrome (extreme data compression built-in)</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              // iOS: Low Data Mode or Opera Mini
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Option A: Low Data Mode</h4>
                    <ul className="step-list">
                      <li>Open Settings</li>
                      <li>Tap Cellular → Cellular Data Options</li>
                      <li>Turn ON "Low Data Mode"</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Option B: Opera Mini (Even Faster)</h4>
                    <ul className="step-list">
                      <li>Open App Store</li>
                      <li>Search "Opera Mini"</li>
                      <li>Install Opera Mini</li>
                      <li>Use it instead of Safari (extreme data compression built-in)</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </details>
      </section>

      {/* Solution 2: Telegram */}
      <section className="solution-card solution-telegram">
        <div className="solution-header">
          <div className="solution-icon">💬</div>
          <div>
            <h2>2. Telegram {device === 'desktop' ? 'Desktop' : 'app'} works even when internet cuts out</h2>
            <p className="solution-tagline">Read messages offline, send when connection returns</p>
          </div>
        </div>

        <div className="benefit-box">
          <strong>What you get:</strong> Messages stay on your {device === 'desktop' ? 'computer' : 'phone'}. Read offline anytime.
          Send messages when connection comes back. Never lose conversation history.
        </div>

        <details className="setup-steps">
          <summary className="setup-summary">
            <span className="setup-icon">📖</span>
            <strong>Click to see setup (3 minutes)</strong>
            <span className="chevron">›</span>
          </summary>
          <div className="setup-content">
            {device === 'desktop' ? (
              // Desktop: Telegram Desktop
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Download Telegram Desktop</h4>
                    <a href="https://desktop.telegram.org" target="_blank" rel="noopener" className="download-link">
                      desktop.telegram.org →
                    </a>
                    <p>Don't use the web version (telegram.org/web) - download the desktop app</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Login</h4>
                    <ul className="step-list">
                      <li>Enter your phone number</li>
                      <li>Enter code from SMS</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : device === 'android' ? (
              // Android: Telegram app
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Download Telegram</h4>
                    <ul className="step-list">
                      <li>Open Play Store</li>
                      <li>Search "Telegram"</li>
                      <li>Install Telegram</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Login</h4>
                    <ul className="step-list">
                      <li>Enter your phone number</li>
                      <li>Enter code from SMS</li>
                    </ul>
                    <p className="tip">💡 Telegram automatically caches messages on Android - works offline!</p>
                  </div>
                </div>
              </>
            ) : (
              // iOS: Telegram app
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Download Telegram</h4>
                    <ul className="step-list">
                      <li>Open App Store</li>
                      <li>Search "Telegram"</li>
                      <li>Install Telegram</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Login</h4>
                    <ul className="step-list">
                      <li>Enter your phone number</li>
                      <li>Enter code from SMS</li>
                    </ul>
                    <p className="tip">💡 Telegram automatically caches messages on iOS - works offline!</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </details>
      </section>

      {/* Solution 3: Telegram Voice Messages */}
      <section className="solution-card solution-voice">
        <div className="solution-header">
          <div className="solution-icon">🎙️</div>
          <div>
            <h2>3. Telegram voice messages work when video calls don't</h2>
            <p className="solution-tagline">Explain things clearly without needing fast internet</p>
          </div>
        </div>

        <div className="benefit-box">
          <strong>What you get:</strong> Explain problems, give updates, or ask questions with voice instead of video calls.
          Works on any connection. Listen at 2x speed to save time.
        </div>

        <details className="setup-steps">
          <summary className="setup-summary">
            <span className="setup-icon">📖</span>
            <strong>Click to see how to use</strong>
            <span className="chevron">›</span>
          </summary>
          <div className="setup-content">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Record voice message (Telegram)</h4>
                <ul className="step-list">
                  <li>Open chat</li>
                  <li>Click microphone icon</li>
                  <li>Hold and speak (or click to lock recording)</li>
                  <li>Release to send</li>
                </ul>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Listen faster</h4>
                <ul className="step-list">
                  <li>Right-click voice message</li>
                  <li>Choose "Playback speed"</li>
                  <li>Select 1.5x or 2x</li>
                </ul>
              </div>
            </div>
          </div>
        </details>

        <div className="use-cases">
          <div className="use-case-col use-case-yes">
            <h4>✅ Use voice for:</h4>
            <ul>
              <li>"Here's what I did today..."</li>
              <li>"I'm stuck on this error..."</li>
              <li>"Let me explain how this works..."</li>
            </ul>
          </div>
          <div className="use-case-col use-case-no">
            <h4>❌ Just type instead:</h4>
            <ul>
              <li>"Yes" or "No"</li>
              <li>Links or code</li>
              <li>Quick questions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solution 4: Screenshots & Video */}
      <section className="solution-card solution-screenshot">
        <div className="solution-header">
          <div className="solution-icon">📸</div>
          <div>
            <h2>4. Screenshots and video recordings replace screen sharing</h2>
            <p className="solution-tagline">Show exactly what you see without needing live connection</p>
          </div>
        </div>

        <div className="benefit-box">
          <strong>What you get:</strong> Capture what's on your screen (screenshot) or record a video with your voice explaining.
          Send once, they can view anytime. No need for "hop on a call."
        </div>

        <details className="setup-steps">
          <summary className="setup-summary">
            <span className="setup-icon">📖</span>
            <strong>Click to see how to capture screenshots</strong>
            <span className="chevron">›</span>
          </summary>
          <div className="setup-content">
            {device === 'desktop' ? (
              // Desktop: Windows Snipping Tool
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Take screenshot (Windows)</h4>
                    <div className="keyboard-combo">
                      Press <kbd>Windows</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>
                    </div>
                    <p>Screen goes dark, cursor becomes a crosshair (+)</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Select what to capture</h4>
                    <p>Click and drag to select area. Release mouse. Screenshot saved!</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Send it (fastest way)</h4>
                    <ul className="step-list">
                      <li>Open Telegram</li>
                      <li>Click in message box</li>
                      <li>Press <kbd>Ctrl</kbd> + <kbd>V</kbd> (paste)</li>
                      <li>Press <kbd>Enter</kbd> to send</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Add voice explanation (recommended)</h4>
                    <p>After sending screenshot, click microphone and explain: "This screenshot shows [X], the problem is [Y]"</p>
                    <p className="tip">💡 Screenshot + voice = better than screen sharing</p>
                  </div>
                </div>
              </>
            ) : device === 'android' ? (
              // Android: Power + Volume Down
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Take screenshot</h4>
                    <p>Press <strong>Power button + Volume Down</strong> at the same time</p>
                    <p>Screenshot saved to Gallery</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Capture full page (for long Upwork posts)</h4>
                    <ul className="step-list">
                      <li>Take screenshot (Power + Volume Down)</li>
                      <li>Tap screenshot preview at bottom</li>
                      <li>Tap "Scroll capture" or "Capture more" button</li>
                      <li>Keep tapping until whole page captured</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Send it</h4>
                    <ul className="step-list">
                      <li>Open Telegram</li>
                      <li>Tap paperclip icon</li>
                      <li>Select screenshot from Gallery</li>
                      <li>Send</li>
                    </ul>
                    <p className="tip">💡 Then record voice message explaining what the screenshot shows</p>
                  </div>
                </div>
              </>
            ) : (
              // iOS: Side + Volume Up
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Take screenshot</h4>
                    <p>Press <strong>Side button + Volume Up</strong> at the same time</p>
                    <p>(Older iPhones: Home button + Power button)</p>
                    <p>Screenshot saved to Photos</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Capture full page (for long Upwork posts)</h4>
                    <ul className="step-list">
                      <li>Take screenshot (Side + Volume Up)</li>
                      <li>Tap screenshot thumbnail (bottom left)</li>
                      <li>Tap "Full Page" tab at top</li>
                      <li>Tap "Done" → "Save PDF to Files"</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Send it</h4>
                    <ul className="step-list">
                      <li>Open Telegram</li>
                      <li>Tap paperclip icon</li>
                      <li>Select screenshot from Photos</li>
                      <li>Send</li>
                    </ul>
                    <p className="tip">💡 Then record voice message explaining what the screenshot shows</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </details>

        <details className="setup-steps">
          <summary className="setup-summary">
            <span className="setup-icon">📖</span>
            <strong>Click to see how to record video with voice</strong>
            <span className="chevron">›</span>
          </summary>
          <div className="setup-content">
            {device === 'desktop' ? (
              // Desktop: Xbox Game Bar
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Start recording (Windows built-in)</h4>
                    <div className="keyboard-combo">
                      Press <kbd>Windows</kbd> + <kbd>G</kbd>
                    </div>
                    <p>Xbox Game Bar opens</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Turn on microphone</h4>
                    <ul className="step-list">
                      <li>Look for microphone icon</li>
                      <li>Click to turn ON (you'll see a small mic indicator)</li>
                      <li>Now your voice will be in the video</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Click record button</h4>
                    <p>Round record button (or press <kbd>Windows</kbd> + <kbd>Alt</kbd> + <kbd>R</kbd>)</p>
                    <p>Red timer appears at top-right. Recording started!</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Show the problem while talking</h4>
                    <p>Click around, show the error, explain out loud:</p>
                    <p className="example-text">"When I click here... you see this error appears... I tried this but it didn't work..."</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h4>Stop recording</h4>
                    <p>Press <kbd>Windows</kbd> + <kbd>Alt</kbd> + <kbd>R</kbd> again</p>
                    <p>Video saved to: <code>C:\Users\[YourName]\Videos\Captures\</code></p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h4>Send video</h4>
                    <ul className="step-list">
                      <li>Open Telegram</li>
                      <li>Click paperclip icon</li>
                      <li>Find video in Videos\Captures folder</li>
                      <li>Send</li>
                    </ul>
                    <p className="tip">💡 Keep videos under 2 minutes. Break long explanations into multiple short videos.</p>
                  </div>
                </div>
              </>
            ) : device === 'android' ? (
              // Android: Screen Record
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Open screen recorder</h4>
                    <ul className="step-list">
                      <li>Swipe down from top (notification shade)</li>
                      <li>Swipe down again to see all tiles</li>
                      <li>Find "Screen record" tile</li>
                      <li>Tap it</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Turn on microphone (IMPORTANT)</h4>
                    <ul className="step-list">
                      <li>Tap "Record audio"</li>
                      <li>Select "Microphone" (not "Device audio")</li>
                      <li>Your voice will now be recorded!</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Start recording</h4>
                    <p>Tap "Start" → Recording begins after 3 second countdown</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Show the problem while talking</h4>
                    <p>Navigate to the issue, click around, explain out loud what you're seeing</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h4>Stop recording</h4>
                    <ul className="step-list">
                      <li>Swipe down notification shade</li>
                      <li>Tap red recording indicator</li>
                      <li>Tap "Stop"</li>
                      <li>Video saved to Gallery</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h4>Send video</h4>
                    <ul className="step-list">
                      <li>Open Telegram</li>
                      <li>Tap paperclip icon</li>
                      <li>Select video from Gallery</li>
                      <li>Send</li>
                    </ul>
                    <p className="tip">💡 Keep videos under 2 minutes</p>
                  </div>
                </div>
              </>
            ) : (
              // iOS: Screen Recording
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Add screen recording to Control Center (one-time setup)</h4>
                    <ul className="step-list">
                      <li>Open Settings</li>
                      <li>Tap "Control Center"</li>
                      <li>Tap green "+" next to "Screen Recording"</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Open Control Center</h4>
                    <p>Swipe down from top-right corner (or up from bottom on older iPhones)</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Turn on microphone (IMPORTANT)</h4>
                    <ul className="step-list">
                      <li>LONG PRESS the record button (circle icon)</li>
                      <li>Tap "Microphone" to turn it ON (red)</li>
                      <li>Your voice will now be recorded!</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Start recording</h4>
                    <p>Tap "Start Recording" → Recording begins after 3 second countdown</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h4>Show the problem while talking</h4>
                    <p>Navigate to the issue, tap around, explain out loud what you're seeing</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h4>Stop recording</h4>
                    <ul className="step-list">
                      <li>Tap red status bar at top</li>
                      <li>Tap "Stop"</li>
                      <li>Video saved to Photos</li>
                    </ul>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">7</div>
                  <div className="step-content">
                    <h4>Send video</h4>
                    <ul className="step-list">
                      <li>Open Telegram</li>
                      <li>Tap paperclip icon</li>
                      <li>Select video from Photos</li>
                      <li>Send</li>
                    </ul>
                    <p className="tip">💡 Keep videos under 2 minutes</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </details>
      </section>

      {/* When to Use */}
      <section className="solution-card solution-reference">
        <h2>When to Use What</h2>
        <div className="situation-grid">
          <div className="situation">
            <div className="situation-icon">🐌</div>
            <div className="situation-text">
              <strong>Upwork loading slowly</strong>
              <span className="situation-solution">→ Use Opera Browser</span>
            </div>
          </div>

          <div className="situation">
            <div className="situation-icon">📡</div>
            <div className="situation-text">
              <strong>Internet keeps cutting out</strong>
              <span className="situation-solution">→ Use Telegram Desktop</span>
            </div>
          </div>

          <div className="situation">
            <div className="situation-icon">💬</div>
            <div className="situation-text">
              <strong>Need to explain something</strong>
              <span className="situation-solution">→ Voice message or video with voice</span>
            </div>
          </div>

          <div className="situation">
            <div className="situation-icon">🖥️</div>
            <div className="situation-text">
              <strong>Need to show error on screen</strong>
              <span className="situation-solution">→ Screenshot + voice, or video with voice</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pin Apps */}
      <section className="solution-card solution-pin">
        {device === 'desktop' ? (
          <>
            <h2>Pin These Apps to Your Taskbar</h2>
            <p>Right-click each app → "Pin to taskbar" for quick access:</p>
            <div className="pin-grid">
              <div className="pin-item">
                <div className="pin-icon">📌</div>
                <div>
                  <strong>Snipping Tool</strong>
                  <p>For screenshots (Windows+Shift+S)</p>
                </div>
              </div>
              <div className="pin-item">
                <div className="pin-icon">📌</div>
                <div>
                  <strong>Telegram Desktop</strong>
                  <p>For messages and voice</p>
                </div>
              </div>
              <div className="pin-item">
                <div className="pin-icon">📌</div>
                <div>
                  <strong>Claude Desktop</strong>
                  <p>For coding help</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2>Add These Apps to Your Home Screen</h2>
            <p>Keep important apps on first page for quick access:</p>
            <div className="pin-grid">
              <div className="pin-item">
                <div className="pin-icon">📌</div>
                <div>
                  <strong>Telegram</strong>
                  <p>For messages and voice</p>
                </div>
              </div>
              <div className="pin-item">
                <div className="pin-icon">📌</div>
                <div>
                  <strong>{device === 'android' ? 'Chrome or Opera Mini' : 'Safari or Opera Mini'}</strong>
                  <p>For browsing Upwork</p>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Quick Reference */}
      <section className="solution-card solution-quickref">
        <h2>Quick {device === 'desktop' ? 'Keyboard Shortcuts' : 'Gestures'}</h2>

        <div className="quickref-grid">
          {device === 'desktop' ? (
            <>
              <div className="quickref-item">
                <div className="shortcut-label">Screenshot</div>
                <div className="shortcut-keys">
                  <kbd>Windows</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>
                </div>
              </div>

              <div className="quickref-item">
                <div className="shortcut-label">Start/Stop video recording</div>
                <div className="shortcut-keys">
                  <kbd>Windows</kbd> + <kbd>Alt</kbd> + <kbd>R</kbd>
                </div>
              </div>

              <div className="quickref-item">
                <div className="shortcut-label">Open recording tool</div>
                <div className="shortcut-keys">
                  <kbd>Windows</kbd> + <kbd>G</kbd>
                </div>
              </div>

              <div className="quickref-item">
                <div className="shortcut-label">Paste screenshot in Telegram</div>
                <div className="shortcut-keys">
                  <kbd>Ctrl</kbd> + <kbd>V</kbd>
                </div>
              </div>
            </>
          ) : device === 'android' ? (
            <>
              <div className="quickref-item">
                <div className="shortcut-label">Screenshot</div>
                <div className="shortcut-keys">
                  <strong>Power + Volume Down</strong>
                </div>
              </div>

              <div className="quickref-item">
                <div className="shortcut-label">Screen record</div>
                <div className="shortcut-keys">
                  Swipe down → Screen record tile
                </div>
              </div>

              <div className="quickref-item">
                <div className="shortcut-label">Full page capture</div>
                <div className="shortcut-keys">
                  Screenshot → "Scroll capture"
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="quickref-item">
                <div className="shortcut-label">Screenshot</div>
                <div className="shortcut-keys">
                  <strong>Side + Volume Up</strong>
                </div>
              </div>

              <div className="quickref-item">
                <div className="shortcut-label">Screen record</div>
                <div className="shortcut-keys">
                  Control Center → Long press record
                </div>
              </div>

              <div className="quickref-item">
                <div className="shortcut-label">Full page capture</div>
                <div className="shortcut-keys">
                  Screenshot → "Full Page"
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Help */}
      <section className="solution-card solution-help">
        <h2>Need Help?</h2>
        <p className="help-text">
          Ask <a href="https://claude.ai/project/019a5a06-1096-71ee-bd64-4963bf6d4857" target="_blank" rel="noopener" className="kai-link">Kai "The guide"</a> on Claude.
        </p>
      </section>

      {/* Footer nav */}
      <nav className="page-footer-nav">
        <Link href="/resources" className="footer-nav-link">← Back to Resources</Link>
      </nav>
    </main>
  );
}
