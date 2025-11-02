'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AnimatedMetricsGrid.module.css';

interface Metric {
  label: string;
  value: number;
  suffix: string;
  duration: number;
  decimals?: number;
}

const metrics: Metric[] = [
  { label: 'AI Agents', value: 97, suffix: '+', duration: 2000 },
  { label: 'Production Uptime', value: 99.7, suffix: '%', duration: 2500, decimals: 1 },
  { label: 'State Updates/Hour', value: 50000, suffix: '+', duration: 3000 },
  { label: 'Identity Consistency', value: 90.92, suffix: '%', duration: 2500, decimals: 2 },
  { label: 'Cost per Agent/Day', value: 0.12, suffix: '', duration: 2000, decimals: 2 },
  { label: 'Months in Production', value: 6, suffix: '+', duration: 1500 },
];

function AnimatedMetric({ label, value, suffix, duration, decimals = 0 }: Metric) {
  const [currentValue, setCurrentValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);

          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrentValue(value * eased);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          animate();

          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, value, duration]);

  const displayValue = label === 'Cost per Agent/Day'
    ? `$${currentValue.toFixed(decimals)}`
    : currentValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div ref={elementRef} className={styles.metric}>
      <div className={styles.value}>
        {displayValue}{suffix}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export function AnimatedMetricsGrid() {
  return (
    <section className={styles.metricsSection}>
      <h3 className={styles.metricsTitle}>Key Metrics</h3>
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <AnimatedMetric key={index} {...metric} />
        ))}
      </div>
    </section>
  );
}
