# Supabase Setup Guide — Islamediaku

## 1. Get Supabase Credentials

Go to your **Supabase Dashboard**: https://supabase.com/dashboard

1. Select the **Pepengofar** project (ref: `teunphhkrollnpwjefiv`)
2. Navigate to **Settings → API**
3. Copy:
   - **Project URL** → This is `VITE_SUPABASE_URL`
   - **anon public key** → This is `VITE_SUPABASE_ANON_KEY`

> ⚠️ **Never use the `service_role` key in frontend code!** Only use the `anon` key.

## 2. Local Development Setup

Create or edit `.env` in the project root:

```env
VITE_SUPABASE_URL=https://teunphhkrollnpwjefiv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your_anon_key_here
```

> `.env` is in `.gitignore` — it will NOT be committed to GitHub.

## 3. Vercel Production Setup

1. Go to **Vercel Dashboard** → Select the Islamediaku project
2. Navigate to **Settings → Environment Variables**
3. Add these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://teunphhkrollnpwjefiv.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your anon key | Production, Preview, Development |

4. **Redeploy** the project for changes to take effect:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

## 4. Supabase Auth Configuration

In Supabase Dashboard → **Authentication → Settings**:

### Email Settings
- ✅ Enable email confirmations: **ON**
- Site URL: `https://islamediaku.vercel.app`
- Redirect URLs: Add `https://islamediaku.vercel.app/auth/callback`

### Email Templates (optional)
Customize the confirmation email template in **Authentication → Email Templates → Confirm signup**

## 5. Database Tables

Run the SQL migration in **Supabase Dashboard → SQL Editor**:

Copy the contents of `supabase/migrations/001_user_tables.sql` and execute it.

This creates:
- `profiles` — user profile data
- `user_preferences` — theme, settings
- `user_activity` — tracker snapshots
- `user_bookmarks` — Quran bookmarks, last read
- `user_audio_history` — tilawah history

All tables have Row Level Security (RLS) enabled. Users can only access their own data.

## 6. Storage (for Kajian Banners)

If using the Kajian Banner admin feature:
1. Go to **Storage → New Bucket**
2. Name: `kajian-banners`
3. Public: **Yes**

## 7. Verify

After setup, test:
1. `npm run dev` — app should start without errors
2. Register a new account
3. Check email for confirmation link
4. Confirm email → redirects to Ruang User
5. Login/logout works
6. Profile displays correctly
