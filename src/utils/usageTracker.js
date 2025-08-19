/**
 * Usage tracking utility for free tier limits
 * Tracks daily file rename usage with localStorage + IP-based secondary check
 */

const STORAGE_KEY = 'filefixer_usage';
const IP_CACHE_KEY = 'filefixer_ip_cache';
const FREE_DAILY_LIMIT = 10;
const IP_API_URL = 'https://ipify.org?format=json';
const IP_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get current date string in YYYY-MM-DD format (local timezone)
 */
function getCurrentDateString() {
  return new Date().toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format
}

/**
 * Get cached IP or fetch if expired/missing
 */
async function getUserIP() {
  try {
    // Try to get cached IP first
    const cached = localStorage.getItem(IP_CACHE_KEY);
    if (cached) {
      const { ip, timestamp } = JSON.parse(cached);
      // Use cached IP if less than 24 hours old
      if (Date.now() - timestamp < IP_CACHE_DURATION) {
        return ip;
      }
    }
    
    // Fetch new IP with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(IP_API_URL, { 
      signal: controller.signal,
      cache: 'no-cache'
    });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    // Cache the IP
    localStorage.setItem(IP_CACHE_KEY, JSON.stringify({
      ip: data.ip,
      timestamp: Date.now()
    }));
    
    return data.ip;
  } catch (error) {
    console.warn('Could not fetch IP for usage tracking:', error);
    
    // Try to return cached IP even if expired
    try {
      const cached = localStorage.getItem(IP_CACHE_KEY);
      if (cached) {
        const { ip } = JSON.parse(cached);
        return ip;
      }
    } catch {
      // Ignore cache errors
    }
    
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
 * Get current usage count for today (optimized)
 */
export async function getDailyUsage() {
  const today = getCurrentDateString();
  const stored = getStoredUsage();

  // If no stored data or date has changed, start fresh
  if (!stored || stored.date !== today) {
    const newUsage = {
      date: today,
      count: 0,
      ipHash: 'pending' // Will be updated lazily
    };
    storeUsage(newUsage);
    
    // Fetch IP in background (non-blocking)
    getUserIP().then(userIP => {
      const ipHash = hashIP(userIP);
      const currentStored = getStoredUsage();
      if (currentStored && currentStored.date === today) {
        storeUsage({ ...currentStored, ipHash });
      }
    }).catch(() => {
      // Ignore IP fetch errors - not critical for functionality
    });
    
    return { count: 0, limit: FREE_DAILY_LIMIT, remaining: FREE_DAILY_LIMIT };
  }

  const remaining = Math.max(0, FREE_DAILY_LIMIT - stored.count);
  
  return {
    count: stored.count,
    limit: FREE_DAILY_LIMIT,
    remaining: remaining
  };
}

/**
 * Check if adding newFileCount would exceed daily limit (optimized)
 * Should be called before processing files to prevent user from uploading files they can't use
 * @param {number} newFileCount - Number of new files user wants to add
 * @returns {Promise<{allowed: boolean, remainingToday: number, totalToday: number, wouldExceed: number, limit: number}>}
 */
export async function checkDailyLimit(newFileCount = 0) {
  const usage = await getDailyUsage(); // Now much faster
  const wouldHaveAfterAdding = usage.count + newFileCount;
  const allowed = wouldHaveAfterAdding <= FREE_DAILY_LIMIT;
  const wouldExceed = Math.max(0, wouldHaveAfterAdding - FREE_DAILY_LIMIT);

  return {
    allowed: allowed,
    remainingToday: usage.remaining,
    totalToday: usage.count,
    wouldExceed: wouldExceed,
    limit: FREE_DAILY_LIMIT
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
