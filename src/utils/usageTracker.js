/**
 * Usage tracking utility for free tier limits
 * Tracks daily file rename usage with localStorage + IP-based secondary check
 */

const STORAGE_KEY = 'filefixer_usage';
const FREE_DAILY_LIMIT = 8;
const IP_API_URL = 'https://ipify.org?format=json';

/**
 * Get current date string in YYYY-MM-DD format (local timezone)
 */
function getCurrentDateString() {
  return new Date().toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format
}

/**
 * Get user's IP address for secondary tracking
 */
async function getUserIP() {
  try {
    const response = await fetch(IP_API_URL);
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Could not fetch IP for usage tracking:', error);
    return 'unknown';
  }
}

/**
 * Get stored usage data from localStorage
 */
function getStoredUsage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Error reading usage data:', error);
    return null;
  }
}

/**
 * Store usage data to localStorage
 */
function storeUsage(usageData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usageData));
  } catch (error) {
    console.warn('Error storing usage data:', error);
  }
}

/**
 * Create hash of IP for anonymized storage (simple hash, not cryptographic)
 */
function hashIP(ip) {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get current usage count for today
 */
export async function getDailyUsage() {
  const today = getCurrentDateString();
  const stored = getStoredUsage();
  const userIP = await getUserIP();
  const ipHash = hashIP(userIP);

  // If no stored data or date has changed, start fresh
  if (!stored || stored.date !== today) {
    const newUsage = {
      date: today,
      count: 0,
      ipHash: ipHash
    };
    storeUsage(newUsage);
    return { count: 0, limit: FREE_DAILY_LIMIT, remaining: FREE_DAILY_LIMIT };
  }

  // If IP hash doesn't match, it might be a different user/session
  // In this case, we'll trust the localStorage but log the discrepancy
  if (stored.ipHash !== ipHash) {
    console.info('IP change detected, but preserving usage count for user experience');
  }

  const remaining = Math.max(0, FREE_DAILY_LIMIT - stored.count);
  
  return {
    count: stored.count,
    limit: FREE_DAILY_LIMIT,
    remaining: remaining
  };
}

/**
 * Check if user has reached the daily limit
 */
export async function hasReachedLimit() {
  const usage = await getDailyUsage();
  return usage.remaining <= 0;
}

/**
 * Increment usage count by the number of files processed
 */
export async function incrementUsage(fileCount = 1) {
  const today = getCurrentDateString();
  const stored = getStoredUsage();
  const userIP = await getUserIP();
  const ipHash = hashIP(userIP);

  let currentCount = 0;
  
  // Get current count or start fresh if date changed
  if (stored && stored.date === today) {
    currentCount = stored.count;
  }

  const newCount = currentCount + fileCount;
  const newUsage = {
    date: today,
    count: newCount,
    ipHash: ipHash
  };

  storeUsage(newUsage);

  const remaining = Math.max(0, FREE_DAILY_LIMIT - newCount);
  
  return {
    count: newCount,
    limit: FREE_DAILY_LIMIT,
    remaining: remaining,
    limitReached: remaining <= 0
  };
}

/**
 * Reset usage count (mainly for testing purposes)
 */
export function resetUsage() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get usage statistics for display
 */
export async function getUsageStats() {
  const usage = await getDailyUsage();
  return {
    used: usage.count,
    limit: usage.limit,
    remaining: usage.remaining,
    percentage: Math.round((usage.count / usage.limit) * 100)
  };
}
