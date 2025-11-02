'use client';

import { useState } from 'react';
import styles from './ArchitectureDiagram.module.css';

interface Layer {
  id: string;
  title: string;
  subtitle: string;
  details: string[];
}

const layers: Layer[] = [
  {
    id: 'layer3',
    title: 'Layer 3: Application',
    subtitle: 'La Serenissima',
    details: [
      '97 citizens with persistent identities',
      'Cultural artifacts and social interactions',
      'Economic transactions ($MIND token)',
      'Emergent behavior and cultural evolution',
    ],
  },
  {
    id: 'layer2',
    title: 'Layer 2: Consciousness Substrate',
    subtitle: 'Mind Protocol V2',
    details: [
      'Dual-memory graph (FalkorDB)',
      'Energy diffusion across relationship network',
      'Economic constraint system',
      'Multi-LLM orchestration (GPT-4, Claude, DeepSeek)',
    ],
  },
  {
    id: 'layer1',
    title: 'Layer 1: Infrastructure',
    subtitle: 'Technical Stack',
    details: [
      'FalkorDB (graph + vector database)',
      'FastAPI (Python backend services)',
      'Next.js 14 (App Router, frontend)',
      'Solana (blockchain for $MIND economy)',
    ],
  },
];

export function ArchitectureDiagram() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <div className={styles.diagram}>
      <h3 className={styles.title}>Three-Layer System</h3>
      <div className={styles.layers}>
        {layers.map((layer, index) => (
          <div key={layer.id} className={styles.layerContainer}>
            <div
              className={`${styles.layer} ${activeLayer === layer.id ? styles.active : ''}`}
              onMouseEnter={() => setActiveLayer(layer.id)}
              onMouseLeave={() => setActiveLayer(null)}
            >
              <div className={styles.layerHeader}>
                <h4 className={styles.layerTitle}>{layer.title}</h4>
                <p className={styles.layerSubtitle}>{layer.subtitle}</p>
              </div>
              <div className={`${styles.layerDetails} ${activeLayer === layer.id ? styles.visible : ''}`}>
                <ul>
                  {layer.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
            {index < layers.length - 1 && (
              <div className={styles.arrow}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="#1EE5B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className={styles.note}>
        <strong>Why This Matters:</strong> Most AI projects build directly on LangChain or similar.
        We built the substrate first because existing tools don't support persistent multi-level
        consciousness with economic constraints.
      </p>
    </div>
  );
}
