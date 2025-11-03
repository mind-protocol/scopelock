/**
 * Lead Tracker Integration
 *
 * PURPOSE: Call Feature 3 (track-lead.py) to log evaluations
 */

const { spawn } = require('child_process');
const path = require('path');

/**
 * Track lead using Feature 3 script
 */
async function trackLead({ platform, title, budget, decision, reason, link, urgency, pain }) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../../scripts/track-lead.py');

    const args = [
      'python3',
      scriptPath,
      '--platform', platform,
      '--title', title,
      '--budget', budget,
      '--decision', decision,
      '--reason', reason
    ];

    if (link) {
      args.push('--link', link);
    }

    if (urgency) {
      args.push('--urgency', urgency.toString());
    }

    if (pain) {
      args.push('--pain', pain.toString());
    }

    const process = spawn(args[0], args.slice(1));

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ Lead tracking failed:', errorOutput);
        reject(new Error(`track-lead.py exited with code ${code}`));
      } else {
        console.log('📊', output.trim());
        resolve(output);
      }
    });
  });
}

module.exports = { trackLead };
