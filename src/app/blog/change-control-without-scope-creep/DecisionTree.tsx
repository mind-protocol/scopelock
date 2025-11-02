'use client';

import { useState } from 'react';
import styles from './decision-tree.module.css';

type ChangeExample = {
  id: string;
  name: string;
  description: string;
  complexity: 'same' | 'higher';
  newFeature: boolean;
  result: 'swap' | 'add';
  reasoning: string;
};

const examples: ChangeExample[] = [
  {
    id: 'email-sms',
    name: 'Email → SMS Notifications',
    description: 'Replace email notifications with SMS',
    complexity: 'same',
    newFeature: false,
    result: 'swap',
    reasoning: 'Same notification functionality, similar complexity (both external APIs), just swapping delivery method.'
  },
  {
    id: 'react-vue',
    name: 'React → Vue Framework',
    description: 'Switch from React to Vue',
    complexity: 'same',
    newFeature: false,
    result: 'swap',
    reasoning: 'Same UI output, modern frameworks have similar complexity, personal preference change.'
  },
  {
    id: 'add-analytics',
    name: 'Add Analytics Dashboard',
    description: 'Add new analytics with charts',
    complexity: 'higher',
    newFeature: true,
    result: 'add',
    reasoning: 'New feature requiring data aggregation, charting library, and additional infrastructure.'
  },
  {
    id: 'add-push',
    name: 'Add Push Notifications',
    description: 'Add mobile push on top of email',
    complexity: 'higher',
    newFeature: true,
    result: 'add',
    reasoning: 'New notification channel (not replacing), requires push service and mobile SDK setup.'
  },
];

export function DecisionTree() {
  const [selectedExample, setSelectedExample] = useState<ChangeExample | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleExampleSelect = (example: ChangeExample) => {
    setSelectedExample(example);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setSelectedExample(null);
    setCurrentStep(0);
  };

  return (
    <div className={styles.decisionTree}>
      <h3>Interactive Decision Tree: Swap or Add?</h3>
      <p className={styles.intro}>
        Select a change example below and walk through the CHG-130 classification process.
      </p>

      {/* Example Selection */}
      {!selectedExample && (
        <div className={styles.exampleSelector}>
          <h4>Select a Change Request:</h4>
          <div className={styles.exampleGrid}>
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => handleExampleSelect(example)}
                className={styles.exampleButton}
              >
                <strong>{example.name}</strong>
                <span>{example.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Decision Flow */}
      {selectedExample && (
        <div className={styles.flowContainer}>
          <div className={styles.flowHeader}>
            <h4>Analyzing: {selectedExample.name}</h4>
            <button onClick={handleReset} className={styles.resetButton}>
              ← Choose Different Example
            </button>
          </div>

          <div className={styles.flowSteps}>
            {/* Step 1: Client Request */}
            <div className={`${styles.flowStep} ${currentStep >= 0 ? styles.active : ''}`}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h5>Client Requests Change</h5>
                <p className={styles.requestText}>"{selectedExample.description}"</p>
              </div>
            </div>

            {/* Step 2: Complexity Analysis */}
            {currentStep >= 1 && (
              <div className={`${styles.flowStep} ${currentStep >= 1 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h5>Analyze Complexity</h5>
                  <div className={styles.analysis}>
                    <div className={styles.analysisQuestion}>
                      Is this new functionality or replacing existing?
                    </div>
                    <div className={styles.analysisAnswer}>
                      {selectedExample.newFeature ? (
                        <span className={styles.newFeature}>→ New functionality</span>
                      ) : (
                        <span className={styles.replacement}>→ Replacing existing</span>
                      )}
                    </div>
                    <div className={styles.analysisQuestion}>
                      Complexity compared to original?
                    </div>
                    <div className={styles.analysisAnswer}>
                      {selectedExample.complexity === 'same' ? (
                        <span className={styles.sameComplexity}>→ Equal or lower</span>
                      ) : (
                        <span className={styles.higherComplexity}>→ Higher complexity</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Classification */}
            {currentStep >= 2 && (
              <div className={`${styles.flowStep} ${currentStep >= 2 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h5>Classification Decision</h5>
                  <div className={styles.classification}>
                    {selectedExample.result === 'swap' ? (
                      <div className={styles.swapDecision}>
                        <div className={styles.decisionBadge}>SWAP (€0)</div>
                        <p>This change replaces existing functionality with equal or lower complexity.</p>
                      </div>
                    ) : (
                      <div className={styles.addDecision}>
                        <div className={styles.decisionBadge}>ADD (New Milestone)</div>
                        <p>This change adds new functionality or increases complexity.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Outcome */}
            {currentStep >= 3 && (
              <div className={`${styles.flowStep} ${currentStep >= 3 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h5>Outcome</h5>
                  <div className={styles.outcome}>
                    <div className={styles.reasoning}>
                      <strong>Reasoning:</strong>
                      <p>{selectedExample.reasoning}</p>
                    </div>
                    {selectedExample.result === 'swap' ? (
                      <div className={styles.swapOutcome}>
                        <div><strong>Price:</strong> €0 (same milestone)</div>
                        <div><strong>Timeline:</strong> Within original delivery</div>
                        <div><strong>Action:</strong> Update AC.md, continue</div>
                      </div>
                    ) : (
                      <div className={styles.addOutcome}>
                        <div><strong>New Milestone:</strong> Separate AC.md created</div>
                        <div><strong>Priced:</strong> Quoted before work begins</div>
                        <div><strong>Client:</strong> Approves before implementation</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          {currentStep < 3 && (
            <button onClick={handleNext} className={styles.nextButton}>
              Next Step →
            </button>
          )}

          {currentStep === 3 && (
            <button onClick={handleReset} className={styles.tryAgainButton}>
              Try Another Example
            </button>
          )}
        </div>
      )}
    </div>
  );
}
