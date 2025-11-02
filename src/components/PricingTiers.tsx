import Link from 'next/link';
import styles from './PricingTiers.module.css';

interface PricingTier {
  name: string;
  price: string;
  priceLabel?: string;
  timeline: string;
  description?: string;
  features: string[];
  bestFor: string;
  popular?: boolean;
}

interface PricingTiersProps {
  tiers: PricingTier[];
}

export function PricingTiers({ tiers }: PricingTiersProps) {
  return (
    <div className={styles.pricingTiers}>
      {tiers.map((tier, index) => (
        <div
          key={index}
          className={`${styles.tier} ${tier.popular ? styles.tierPopular : ''}`}
        >
          <div className={styles.tierHeader}>
            <h2 className={styles.tierName}>{tier.name}</h2>
            <div className={styles.tierPrice}>
              {tier.price}
              {tier.priceLabel && (
                <span className={styles.tierPriceLabel}>{tier.priceLabel}</span>
              )}
            </div>
            <p className={styles.tierTimeline}>{tier.timeline}</p>
          </div>

          {tier.description && (
            <p className={styles.tierDescription}>{tier.description}</p>
          )}

          <div className={styles.tierBestFor}>
            <strong>Best for</strong>
            <p>{tier.bestFor}</p>
          </div>

          <ul className={styles.tierFeatures}>
            {tier.features.map((feature, featureIndex) => (
              <li key={featureIndex}>{feature}</li>
            ))}
          </ul>

          <Link href="/contact" className={styles.tierCTA}>
            Get started
          </Link>
        </div>
      ))}
    </div>
  );
}
