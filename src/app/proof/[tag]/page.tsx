import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

interface ProofEntry {
  tag: string;
  type: string;
  date: string;
  feature: string;
  featureLabel: string;
  commit: string;
  demoUrl: string | null;
  files: {
    AC: string | null;
    DEMO: string | null;
    DELTA: string | null;
  };
}

async function getProofEntries(): Promise<ProofEntry[]> {
  try {
    const proofIndexPath = path.join(process.cwd(), 'public', 'proof', 'index.json');
    const data = await fs.readFile(proofIndexPath, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.entries || [];
  } catch (error) {
    console.error('[proof/[tag]/page] Failed to read proof entries:', error);
    return [];
  }
}

async function getProofEntry(tag: string): Promise<ProofEntry | null> {
  const entries = await getProofEntries();
  return entries.find(entry => entry.tag === tag) || null;
}

async function readProofHtml(tag: string): Promise<string | null> {
  try {
    const htmlPath = path.join(process.cwd(), 'public', 'proof', tag, 'index.html');
    const html = await fs.readFile(htmlPath, 'utf-8');

    // Extract just the main content (between <main> tags)
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    if (mainMatch) {
      return mainMatch[1];
    }
    return html;
  } catch (error) {
    console.error(`[proof/[tag]/page] Failed to read proof HTML for tag ${tag}:`, error);
    return null;
  }
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const entries = await getProofEntries();
  return entries.map((entry) => ({
    tag: entry.tag,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const entry = await getProofEntry(tag);

  if (!entry) {
    return {
      title: 'Proof Not Found',
    };
  }

  const typeLabel = entry.type === 'ac-green' ? 'AC green' : 'Evidence sprint';

  return {
    title: `${entry.tag} • Proof`,
    description: `${typeLabel} • ${entry.date} • ${entry.featureLabel || entry.feature}`,
  };
}

export default async function ProofDetailPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const entry = await getProofEntry(tag);

  if (!entry) {
    notFound();
  }

  const htmlContent = await readProofHtml(tag);

  if (!htmlContent) {
    return (
      <main>
        <div className="card">
          <h1>Proof Not Generated</h1>
          <p>The proof for tag <code>{tag}</code> has not been generated yet.</p>
          <Link href="/proof">← Back to proof index</Link>
        </div>
      </main>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--slk-gap-6) var(--slk-gap-5)' }}
    />
  );
}
