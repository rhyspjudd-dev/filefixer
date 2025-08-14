# FileFixer

A browser-based tool for quickly and safely renaming messy files. Built with **Next.js**.

## Features

- **Free Tier**: Rename up to 10 files per day (no sign-in required)
- **Pro Tier**: Unlimited file renames with authentication
- **OAuth Login**: Sign in with Google or GitHub
- **Admin Access**: Owner emails get unlimited Pro access
- **Client-side Processing**: Files never leave your browser

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth  
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Owner/Admin Emails (comma-separated)
OWNER_EMAILS=you@yourdomain.com,alt@yourdomain.com
```

### 3. Set Up OAuth Applications

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to your `.env.local`

#### GitHub OAuth Setup
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to your `.env.local`

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Add the output to `NEXTAUTH_SECRET` in your `.env.local`.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Project Settings:
   - Set `NEXTAUTH_URL` to your production domain (e.g., `https://your-app.vercel.app`)
   - Add all other environment variables from your `.env.local`
4. Update OAuth callback URLs to use your production domain:
   - Google: `https://your-app.vercel.app/api/auth/callback/google`
   - GitHub: `https://your-app.vercel.app/api/auth/callback/github`

### Netlify Deployment

1. Build the application: `npm run build`
2. Deploy the `.next` folder to Netlify
3. Enable Next.js Runtime in Site settings
4. Add environment variables in Site settings → Environment variables
5. Update OAuth callback URLs to use your production domain

## Authentication System

### User Roles

- **Free Users**: Anonymous access, 10 files/day limit
- **Authenticated Users**: Sign in with Google/GitHub, access to Pro features
- **Admin Users**: Emails listed in `OWNER_EMAILS` get unlimited access

### Protected Routes

- `/` - Public (free features available)
- `/signin` - Public sign-in page
- `/pro` - Protected (requires authentication)

### Security Features

- JWT-only sessions (no database required)
- IP-based usage tracking with localStorage fallback
- Middleware protection for Pro routes only
- Owner email bypass for admin access

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # Auth.js configuration
│   ├── signin/page.tsx                  # Sign-in page
│   ├── pro/page.tsx                     # Protected Pro page
│   └── page.tsx                         # Main homepage
├── components/
│   ├── AuthButtons.tsx                  # Header auth UI
│   ├── Providers.tsx                    # Session provider
│   └── UsageIndicator.tsx              # Usage tracking display
├── lib/
│   └── auth.ts                          # Auth utilities
├── utils/
│   ├── usageTracker.js                  # Client-side usage limits
│   └── cleanFileName.js                 # File naming utility
└── middleware.ts                        # Route protection
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_URL` | Yes | Your app's URL (http://localhost:3000 for dev) |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `GITHUB_ID` | Yes | GitHub OAuth app ID |
| `GITHUB_SECRET` | Yes | GitHub OAuth app secret |
| `OWNER_EMAILS` | Optional | Comma-separated admin emails |

## QA Checklist

- [ ] Anonymous users can use all free features without sign-in prompts
- [ ] Visiting `/pro` while signed out redirects to `/signin`
- [ ] After sign-in, users land on `/pro` page
- [ ] Header shows user info + "Admin" badge for owner emails
- [ ] Sessions persist on page refresh
- [ ] Usage limits work correctly (10 files/day for free users)
- [ ] Admin users bypass all usage limits
- [ ] Sign out redirects to homepage

