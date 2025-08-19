import { promises as fs } from 'fs';
import path from 'path';

interface ProUser {
  email: string;
  plan: 'monthly' | 'yearly' | 'lifetime';
  activatedAt: string;
  expiresAt?: string; // Only for monthly/yearly plans
  orderId?: string; // Track original purchase order
  subscriptionId?: string; // Track subscription if applicable
}

const PRO_USERS_FILE = path.join(process.cwd(), 'data', 'pro-users.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(PRO_USERS_FILE);
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch {
    // Directory might already exist, ignore error
  }
}

// Load pro users from file
async function loadProUsers(): Promise<ProUser[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(PRO_USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist yet, return empty array
    return [];
  }
}

// Save pro users to file
async function saveProUsers(users: ProUser[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(PRO_USERS_FILE, JSON.stringify(users, null, 2));
}

// Add or update a pro user
export async function addProUser(email: string, plan: 'monthly' | 'yearly' | 'lifetime'): Promise<void> {
  const users = await loadProUsers();
  const now = new Date().toISOString();
  
  // Calculate expiration date for subscription plans
  let expiresAt: string | undefined;
  if (plan === 'monthly') {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    expiresAt = expiry.toISOString();
  } else if (plan === 'yearly') {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    expiresAt = expiry.toISOString();
  }
  // Lifetime plans don't have expiration

  // Remove existing entry for this email
  const filteredUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
  
  // Add new entry
  filteredUsers.push({
    email: email.toLowerCase(),
    plan,
    activatedAt: now,
    expiresAt
  });

  await saveProUsers(filteredUsers);
}

// Check if user is pro
export async function isUserPro(email: string): Promise<boolean> {
  try {
    const users = await loadProUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return false;
    }

    // Check if subscription has expired
    if (user.expiresAt) {
      const now = new Date();
      const expiry = new Date(user.expiresAt);
      if (now > expiry) {
        // Remove expired user
        await removeProUser(email);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking pro status:', error);
    return false;
  }
}

// Remove a pro user (for cancellations or expirations)
export async function removeProUser(email: string): Promise<void> {
  const users = await loadProUsers();
  const filteredUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
  await saveProUsers(filteredUsers);
}

// Get user's pro plan details
export async function getProUserDetails(email: string): Promise<ProUser | null> {
  try {
    const users = await loadProUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return null;
    }

    // Check if subscription has expired
    if (user.expiresAt) {
      const now = new Date();
      const expiry = new Date(user.expiresAt);
      if (now > expiry) {
        // Remove expired user
        await removeProUser(email);
        return null;
      }
    }

    return user;
  } catch (error) {
    console.error('Error getting pro user details:', error);
    return null;
  }
}

/**
 * Add or update a pro user with enhanced tracking
 */
export async function addProUserWithDetails(
  email: string, 
  plan: 'monthly' | 'yearly' | 'lifetime',
  orderId?: string,
  subscriptionId?: string
): Promise<void> {
  const users = await loadProUsers();
  const now = new Date().toISOString();
  
  // Calculate expiration date for subscription plans
  let expiresAt: string | undefined;
  if (plan === 'monthly') {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    expiresAt = expiry.toISOString();
  } else if (plan === 'yearly') {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    expiresAt = expiry.toISOString();
  }
  // Lifetime has no expiry

  // Remove existing user entry (if any) and add updated one
  const filteredUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
  
  const proUser: ProUser = {
    email: email.toLowerCase(),
    plan,
    activatedAt: now,
    expiresAt,
    orderId,
    subscriptionId
  };

  filteredUsers.push(proUser);
  await saveProUsers(filteredUsers);
  
  console.log(`Added Pro user: ${email} (${plan}) - Order: ${orderId || 'N/A'} - Subscription: ${subscriptionId || 'N/A'}`);
}
