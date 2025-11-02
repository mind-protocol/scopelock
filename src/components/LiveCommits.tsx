import { cache } from 'react';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
    };
  };
  html_url: string;
}

// Cache for 5 minutes
const fetchRepoCommits = cache(async (owner: string, repo: string, limit: number = 3) => {
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
  // Fetch from most active repos in parallel
  const [scopelockCommits, serenissimaCommits, kinkongCommits, therapykinCommits, terminalVelocityCommits] = await Promise.all([
    fetchRepoCommits('mind-protocol', 'scopelock', 1),
    fetchRepoCommits('mind-protocol', 'serenissima', 1),
    fetchRepoCommits('mind-protocol', 'kinkong', 1),
    fetchRepoCommits('mind-protocol', 'therapykin', 1),
    fetchRepoCommits('mind-protocol', 'terminal-velocity', 1),
  ]);

  // Combine and take first 5
  const allCommits = [
    ...scopelockCommits,
    ...serenissimaCommits,
    ...kinkongCommits,
    ...therapykinCommits,
    ...terminalVelocityCommits,
  ].slice(0, 5);

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

  return (
    <ul className="commit-list">
      {allCommits.map((commit) => (
        <li key={commit.sha + commit.repo}>
          <a href={commit.url} target="_blank" rel="noopener">
            <span className="commit-sha">{commit.sha}</span>
            <span className="commit-msg">{commit.message}</span>
            <span className={`commit-author ${commit.isAI ? 'ai' : 'human'}`}>
              {commit.isAI ? 'AI' : 'Human'}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
