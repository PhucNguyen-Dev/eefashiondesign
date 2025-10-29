# 🚀 Supabase Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name:** eefashionita
   - **Database Password:** (choose a strong password)
   - **Region:** (choose closest to you)
4. Click "Create new project"
5. Wait ~2 minutes for setup to complete

### Step 2: Get API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Publishable Key (anon)** - Safe for client-side (long string starting with `eyJ...`)

**Note:** You'll also see a **Secret Key (service_role)** - NEVER use this in your React Native app! It's only for backend/server use.

### Step 3: Update App Configuration

Open `src/core/config/env.config.js` and update:

```javascript
const ENV = {
  // Replace these with your actual values
  SUPABASE_URL: 'https://your-project.supabase.co', // ← Paste your Project URL
  SUPABASE_PUBLISHABLE_KEY: 'your-publishable-key-here', // ← Paste your Publishable Key

  // ... rest of config
};
```

### Step 4: Create Database Tables (Optional - for Cloud Sync)

When you're ready to enable cloud sync, run this SQL in Supabase SQL Editor:

```sql
-- Users table (auto-created by Supabase Auth)

-- Designs table
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own designs
CREATE POLICY "Users can view own designs"
  ON designs FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own designs
CREATE POLICY "Users can insert own designs"
  ON designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own designs
CREATE POLICY "Users can update own designs"
  ON designs FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own designs
CREATE POLICY "Users can delete own designs"
  ON designs FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX designs_user_id_idx ON designs(user_id);
CREATE INDEX designs_updated_at_idx ON designs(updated_at DESC);
```

### Step 5: Create Storage Bucket (Optional - for Image Upload)

When you're ready to enable image upload:

1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Name: `images`
4. Public: ✅ (checked)
5. Click "Create bucket"

**Set up storage policies:**

```sql
-- Policy: Users can upload their own images
CREATE POLICY "Users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Anyone can view images
CREATE POLICY "Public images are viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## ✅ Testing Authentication

### Test Sign Up

```javascript
import { useAuth } from './src/core/state/hooks/useAuth';

function TestComponent() {
  const { signUp, isLoading, error } = useAuth();

  const handleSignUp = async () => {
    const result = await signUp(
      'test@example.com',
      'password123',
      { name: 'Test User' }
    );
    
    if (result.success) {
      console.log('Sign up successful!');
    } else {
      console.error('Sign up failed:', result.error);
    }
  };

  return (
    <button onClick={handleSignUp} disabled={isLoading}>
      Sign Up
    </button>
  );
}
```

### Test Sign In

```javascript
const { signIn } = useAuth();

const handleSignIn = async () => {
  const result = await signIn('test@example.com', 'password123');
  
  if (result.success) {
    console.log('Signed in!');
  }
};
```

---

## 🎯 Feature Flags

Enable/disable features in `src/core/config/env.config.js`:

```javascript
const ENV = {
  // Enable when Supabase is configured
  ENABLE_CLOUD_SYNC: false, // ← Set to true when ready
  
  // Enable when storage bucket is created
  ENABLE_IMAGE_UPLOAD: false, // ← Set to true when ready
  
  // Enable for mobile/tablet/desktop only
  ENABLE_OFFLINE_SUPPORT: false, // ← Set to true when ready
  
  // Already enabled
  ENABLE_PREMIUM_FEATURES: true,
};
```

---

## 📚 Next Steps

### To Enable Cloud Sync:

1. ✅ Create database tables (see Step 4)
2. ✅ Update `ENABLE_CLOUD_SYNC` to `true`
3. ✅ Uncomment code in `src/core/services/api/sync.api.js`
4. ✅ Test sync functionality

### To Enable Image Upload:

1. ✅ Create storage bucket (see Step 5)
2. ✅ Update `ENABLE_IMAGE_UPLOAD` to `true`
3. ✅ Uncomment code in `src/core/services/api/upload.api.js`
4. ✅ Install `expo-image-manipulator` for compression
5. ✅ Test upload functionality

### To Enable Offline Support:

1. ✅ Install `@react-native-community/netinfo`
2. ✅ Update `ENABLE_OFFLINE_SUPPORT` to `true`
3. ✅ Uncomment code in `src/core/services/offline/offlineManager.js`
4. ✅ Test offline functionality

---

## 🔒 Security Best Practices

### 1. Never Commit Credentials

Add to `.gitignore`:
```
.env
.env.local
src/core/config/env.config.js
```

### 2. Use Environment Variables in Production

For production builds, use proper environment variable management:
- React Native: `react-native-dotenv`
- Expo: `expo-constants` with `app.config.js`

### 3. Enable Row Level Security

Always enable RLS on all tables and create proper policies.

### 4. Validate Input

Always validate user input before sending to Supabase.

---

## 🐛 Troubleshooting

### "Supabase not configured" Error

**Solution:** Update credentials in `src/core/config/env.config.js`

### Authentication Not Working

**Check:**
1. ✅ Credentials are correct
2. ✅ Email confirmation is disabled (for testing)
   - Go to **Authentication** → **Settings** → **Email Auth**
   - Disable "Confirm email"

### Database Queries Failing

**Check:**
1. ✅ Tables are created
2. ✅ Row Level Security policies are set up
3. ✅ User is authenticated

---

## 📞 Support

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **GitHub Issues:** https://github.com/supabase/supabase/issues

---

## ✨ You're All Set!

Your app is now ready for backend integration! 🎉

Start by testing authentication, then gradually enable other features as needed.

