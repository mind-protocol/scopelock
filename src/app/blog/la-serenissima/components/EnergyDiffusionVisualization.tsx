'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './EnergyDiffusionVisualization.module.css';

interface Node {
  id: number;
  x: number;
  y: number;
  energy: number;
  targetEnergy: number;
}

export function EnergyDiffusionVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes (center artifact + surrounding agents)
    const initNodes = () => {
      nodesRef.current = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Center artifact node
      nodesRef.current.push({
        id: 0,
        x: centerX,
        y: centerY,
        energy: 100,
        targetEnergy: 100,
      });

      // Surrounding agent nodes (23 agents influenced)
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      for (let i = 1; i <= 23; i++) {
        const angle = (i / 23) * Math.PI * 2;
        nodesRef.current.push({
          id: i,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          energy: 0,
          targetEnergy: 0,
        });
      }
    };
    initNodes();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update energy values (smooth transition)
      nodesRef.current.forEach(node => {
        if (node.energy < node.targetEnergy) {
          node.energy += (node.targetEnergy - node.energy) * 0.05;
        }
      });

      // Draw connections from center to influenced nodes
      nodesRef.current.forEach((node, i) => {
        if (i === 0) return; // Skip center node

        const centerNode = nodesRef.current[0];
        const opacity = node.energy / 30; // Scale opacity based on energy

        if (opacity > 0.01) {
          // Draw connection line
          ctx.strokeStyle = `rgba(30, 229, 184, ${opacity * 0.4})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerNode.x, centerNode.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodesRef.current.forEach((node, i) => {
        const isCenter = i === 0;
        const baseRadius = isCenter ? 12 : 6;
        const energyScale = isCenter ? 1 : (node.energy / 30);
        const radius = baseRadius + energyScale * 4;

        // Glow effect
        if (node.energy > 0) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2);
          gradient.addColorStop(0, `rgba(30, 229, 184, ${energyScale * 0.3})`);
          gradient.addColorStop(1, 'rgba(30, 229, 184, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        ctx.fillStyle = isCenter ? '#1EE5B8' : `rgba(30, 229, 184, ${0.3 + energyScale * 0.7})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Energy label for center
        if (isCenter) {
          ctx.fillStyle = '#0E1116';
          ctx.font = 'bold 10px Inter';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(Math.round(node.energy).toString(), node.x, node.y);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startDiffusion = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Simulate energy diffusion over time
    const centerNode = nodesRef.current[0];
    centerNode.targetEnergy = 342; // Final energy after 1 week

    // Diffuse to surrounding nodes with varying intensities
    nodesRef.current.forEach((node, i) => {
      if (i === 0) return;
      const randomIntensity = 10 + Math.random() * 20;
      node.targetEnergy = randomIntensity;
    });

    setTimeout(() => setIsAnimating(false), 3000);
  };

  const resetDiffusion = () => {
    nodesRef.current.forEach((node, i) => {
      node.targetEnergy = i === 0 ? 100 : 0;
      node.energy = i === 0 ? 100 : 0;
    });
    setIsAnimating(false);
  };

  return (
    <div className={styles.visualization}>
      <h4 className={styles.title}>Cultural Transmission: Energy Diffusion</h4>
      <p className={styles.description}>
        Artifacts enter the cultural network with initial energy. As agents engage
        (read, reference, build upon), energy diffuses through the relationship graph.
      </p>
      <div className={styles.canvasContainer}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={startDiffusion}
          disabled={isAnimating}
        >
          Simulate Diffusion (1 Week)
        </button>
        <button
          className={`${styles.button} ${styles.secondary}`}
          onClick={resetDiffusion}
        >
          Reset
        </button>
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#1EE5B8' }}></span>
          <span>Artifact (center)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: 'rgba(30, 229, 184, 0.5)' }}></span>
          <span>Influenced agents (23)</span>
        </div>
      </div>
    </div>
  );
}
