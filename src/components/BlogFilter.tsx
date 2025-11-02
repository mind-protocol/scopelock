'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './BlogFilter.module.css';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  status: 'published' | 'coming-soon';
  featured?: boolean;
}

interface BlogFilterProps {
  posts: BlogPost[];
}

export function BlogFilter({ posts }: BlogFilterProps) {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts by selected tag
  const filteredPosts = useMemo(() => {
    if (selectedTag === 'all') return posts;
    return posts.filter(post => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  // Separate featured, published, and upcoming
  const featuredPost = posts.find(post => post.featured && post.status === 'published');
  const publishedPosts = filteredPosts.filter(post => post.status === 'published' && !post.featured);
  const upcomingPosts = filteredPosts.filter(post => post.status === 'coming-soon');

  return (
    <div className={styles.blogFilter}>
      {/* Filter Buttons */}
      <div className={styles.filters}>
        <button
          onClick={() => setSelectedTag('all')}
          className={`${styles.filterButton} ${selectedTag === 'all' ? styles.active : ''}`}
        >
          All Posts
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`${styles.filterButton} ${selectedTag === tag ? styles.active : ''}`}
          >
            {tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Featured Post */}
      {featuredPost && selectedTag === 'all' && (
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured</h2>
          <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredCard}>
            <div className={styles.featuredBadge}>Featured</div>
            <div className={styles.featuredContent}>
              <div className={styles.postMeta}>
                <time>{new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h3 className={styles.featuredTitle}>{featuredPost.title}</h3>
              <p className={styles.featuredDescription}>{featuredPost.description}</p>
              <div className={styles.postTags}>
                {featuredPost.tags.map(tag => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Published Posts */}
      {publishedPosts.length > 0 && (
        <section className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>
            {selectedTag === 'all' ? 'Latest Posts' : `Posts tagged: ${selectedTag}`}
          </h2>
          <div className={styles.postsGrid}>
            {publishedPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
                <div className={styles.postMeta}>
                  <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDescription}>{post.description}</p>
                <div className={styles.postTags}>
                  {post.tags.map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {publishedPosts.length === 0 && upcomingPosts.length === 0 && selectedTag !== 'all' && (
        <div className={styles.noResults}>
          <p>No posts found with tag: <strong>{selectedTag}</strong></p>
          <button onClick={() => setSelectedTag('all')} className={styles.resetButton}>
            View all posts
          </button>
        </div>
      )}

      {/* Upcoming Posts */}
      {upcomingPosts.length > 0 && (
        <section className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>Coming Soon</h2>
          <div className={styles.postsGrid}>
            {upcomingPosts.map(post => (
              <div key={post.slug} className={`${styles.postCard} ${styles.comingSoon}`}>
                <div className={styles.comingSoonBadge}>Coming Soon</div>
                <div className={styles.postMeta}>
                  <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDescription}>{post.description}</p>
                <div className={styles.postTags}>
                  {post.tags.map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
