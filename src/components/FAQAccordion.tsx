'use client';

import { useState } from 'react';
import styles from './FAQAccordion.module.css';

interface FAQSection {
  title: string;
  questions: {
    question: string;
    answer: React.ReactNode;
  }[];
}

interface FAQAccordionProps {
  sections: FAQSection[];
}

export function FAQAccordion({ sections }: FAQAccordionProps) {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0])); // First section open by default

  const toggleSection = (index: number) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.accordion}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={styles.section}>
          <button
            className={`${styles.sectionHeader} ${openSections.has(sectionIndex) ? styles.open : ''}`}
            onClick={() => toggleSection(sectionIndex)}
            aria-expanded={openSections.has(sectionIndex)}
          >
            <h2>{section.title}</h2>
            <span className={styles.chevron} aria-hidden="true">
              {openSections.has(sectionIndex) ? '−' : '+'}
            </span>
          </button>

          {openSections.has(sectionIndex) && (
            <div className={styles.sectionContent}>
              {section.questions.map((item, qIndex) => (
                <div key={qIndex} className={styles.question}>
                  <h3>{item.question}</h3>
                  <div className={styles.answer}>{item.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
