import { cache } from 'react';
import { AnimatedCommitList } from './AnimatedCommitList';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  html_url: string;
}

// Cache for 5 minutes
const fetchRepoCommits = cache(async (owner: string, repo: string, limit: number = 15) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${limit}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Use GITHUB_TOKEN if available
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
          })
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch commits for ${owner}/${repo}:`, response.status);
      return [];
    }

    const commits: GitHubCommit[] = await response.json();
    return commits.map(commit => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split('\n')[0], // First line only
      url: commit.html_url,
      repo: `${owner}/${repo}`,
      timestamp: commit.commit.author.date,
      // Detect AI authorship from commit message or author
      isAI: commit.commit.message.includes('🤖 Generated with') ||
            commit.commit.message.includes('aider:') ||
            commit.commit.author.name.toLowerCase().includes('claude') ||
            commit.commit.author.name.toLowerCase().includes('aider') ||
            commit.commit.author.email.includes('noreply@anthropic.com')
    }));
  } catch (error) {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error);
    return [];
  }
});

export async function LiveCommits() {
  // Fetch from currently active repos in parallel (more commits per repo)
  const [scopelockCommits, codexCommits, membraneCommits, mindProtocolCommits] = await Promise.all([
    fetchRepoCommits('mind-protocol', 'scopelock', 20),
    fetchRepoCommits('mind-protocol', 'codex-mcp-gateway', 15),
    fetchRepoCommits('mind-protocol', 'mind-membrane', 10),
    fetchRepoCommits('mind-protocol', 'mindprotocol', 10),
  ]);

  // Combine and take first 50
  const allCommits = [
    ...scopelockCommits,
    ...codexCommits,
    ...membraneCommits,
    ...mindProtocolCommits,
  ].slice(0, 50);

  // Fallback if API fails
  if (allCommits.length === 0) {
    return (
      <ul className="commit-list">
        <li>
          <a href="https://github.com/nlr-ai" target="_blank" rel="noopener">
            <span className="commit-sha">•••••••</span>
            <span className="commit-msg">Loading recent activity...</span>
          </a>
        </li>
      </ul>
    );
  }

  return <AnimatedCommitList commits={allCommits} />;
}
