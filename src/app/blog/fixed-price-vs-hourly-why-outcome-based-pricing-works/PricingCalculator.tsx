'use client';

import { useState } from 'react';
import styles from './calculator.module.css';

export function PricingCalculator() {
  const [estimatedHours, setEstimatedHours] = useState(60);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [paddingPercent, setPaddingPercent] = useState(40);

  // Hourly model calculations
  const hourlyLowEnd = estimatedHours * 0.67 * hourlyRate; // 40 hours at 60 estimate
  const hourlyHighEnd = estimatedHours * 1.6 * hourlyRate; // 95 hours at 60 estimate
  const hourlyAverage = (hourlyLowEnd + hourlyHighEnd) / 2;

  // Fixed-bid calculations
  const paddedHours = estimatedHours * (1 + paddingPercent / 100);
  const fixedBidPrice = Math.round(paddedHours * hourlyRate / 100) * 100;
  const actualWorkValue = estimatedHours * hourlyRate;
  const paddingCost = fixedBidPrice - actualWorkValue;

  // Outcome-based calculations
  const outcomePrice = Math.round(estimatedHours * (hourlyRate * 1.17) / 100) * 100; // Slightly higher rate but fixed

  return (
    <div className={styles.calculator}>
      <h3>Interactive Cost Calculator</h3>
      <p className={styles.calculatorIntro}>
        Adjust the sliders to see how different pricing models compare for your project.
      </p>

      {/* Input Sliders */}
      <div className={styles.inputs}>
        <div className={styles.inputGroup}>
          <label>
            <span>Estimated Hours:</span>
            <strong>{estimatedHours}h</strong>
          </label>
          <input
            type="range"
            min="20"
            max="200"
            step="5"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>
            <span>Hourly Rate:</span>
            <strong>${hourlyRate}/hr</strong>
          </label>
          <input
            type="range"
            min="100"
            max="300"
            step="10"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(parseInt(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>
            <span>Fixed-Bid Padding:</span>
            <strong>{paddingPercent}%</strong>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={paddingPercent}
            onChange={(e) => setPaddingPercent(parseInt(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>

      {/* Results */}
      <div className={styles.results}>
        <div className={`${styles.resultCard} ${styles.hourlyResult}`}>
          <h4>Hourly Billing</h4>
          <div className={styles.resultValue}>
            <span className={styles.range}>
              ${hourlyLowEnd.toLocaleString()} - ${hourlyHighEnd.toLocaleString()}
            </span>
          </div>
          <div className={styles.resultMeta}>
            <div>Average: ${Math.round(hourlyAverage).toLocaleString()}</div>
            <div className={styles.risk}>⚠️ Unpredictable</div>
          </div>
          <div className={styles.resultBreakdown}>
            <div>Best case: {Math.round(estimatedHours * 0.67)}h × ${hourlyRate}</div>
            <div>Worst case: {Math.round(estimatedHours * 1.6)}h × ${hourlyRate}</div>
          </div>
        </div>

        <div className={`${styles.resultCard} ${styles.fixedResult}`}>
          <h4>Fixed-Bid</h4>
          <div className={styles.resultValue}>
            ${fixedBidPrice.toLocaleString()}
          </div>
          <div className={styles.resultMeta}>
            <div>Actual work: ${actualWorkValue.toLocaleString()}</div>
            <div className={styles.warning}>Padding: ${paddingCost.toLocaleString()}</div>
          </div>
          <div className={styles.resultBreakdown}>
            <div>{estimatedHours}h × ${hourlyRate} = ${actualWorkValue.toLocaleString()}</div>
            <div>+{paddingPercent}% padding = ${paddingCost.toLocaleString()}</div>
          </div>
        </div>

        <div className={`${styles.resultCard} ${styles.outcomeResult}`}>
          <h4>Outcome-Based (ScopeLock)</h4>
          <div className={styles.resultValue}>
            ${outcomePrice.toLocaleString()}
          </div>
          <div className={styles.resultMeta}>
            <div>Fixed price</div>
            <div className={styles.success}>✅ Pay at AC green</div>
          </div>
          <div className={styles.resultBreakdown}>
            <div>{estimatedHours}h × ${Math.round(hourlyRate * 1.17)}/hr effective</div>
            <div>No padding, no surprises</div>
          </div>
        </div>
      </div>

      <div className={styles.calculatorFooter}>
        <strong>Key insight:</strong> Hourly is unpredictable, Fixed-Bid is padded, Outcome-Based is transparent and fixed.
      </div>
    </div>
  );
}
