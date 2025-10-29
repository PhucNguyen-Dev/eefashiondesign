# 🔐 CRITICAL SECURITY SETUP - READ FIRST!

## 🚨 IMMEDIATE ACTION REQUIRED

**Your Supabase API keys were exposed in the previous commits!**

### ⚠️ What Happened:
- Supabase credentials were hardcoded in `src/core/config/env.config.js`
- These credentials were committed and pushed to GitHub
- **Anyone with access to your repository can now access your Supabase database**

### 🔴 CRITICAL: Rotate Your Keys NOW!

**Follow these steps immediately:**

---

## Step 1: Get Supabase Keys (5 minutes)

### 1.1 Get Your API Keys

Supabase now uses **Publishable Key** and **Secret Key** system:

1. Go to your Supabase dashboard:
   - https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa/settings/api

2. You'll see two keys:
   - **Publishable Key (anon)** - Safe to use in client-side code
   - **Secret Key (service_role)** - ⚠️ NEVER expose this in client code!

3. **For this app, we only need the Publishable Key**
   - Copy the **Publishable Key** (starts with `eyJ...`)
   - This is the new name for what was called "anon key"

4. **Important:**
   - ✅ Publishable Key - Use in frontend (React Native app)
   - ❌ Secret Key - Only use in backend/server (NOT in this app)

### 1.2 Project URL

- Your API URL is: `https://riwzkjsbnggcmqnjimsa.supabase.co`
- This doesn't change

---

## Step 2: Create Local .env File (NEVER COMMIT THIS!)

### 2.1 Create `.env` file in project root

```bash
# In project root: d:\react project\eefashionita
# Create .env file
```

### 2.2 Add your credentials

```env
# .env
# ⚠️ DO NOT COMMIT THIS FILE TO GIT!

# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
SUPABASE_URL=https://riwzkjsbnggcmqnjimsa.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here

# ⚠️ NEVER use Secret Key in client-side code!
# Secret Key is only for backend/server use
# SUPABASE_SECRET_KEY=never-put-this-in-frontend

# API Configuration
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3

# Feature Flags
ENABLE_CLOUD_SYNC=false
ENABLE_PREMIUM_FEATURES=true
ENABLE_OFFLINE_SUPPORT=false
ENABLE_IMAGE_UPLOAD=false

# Environment
APP_ENV=development
```

### 2.3 Verify `.env` is in `.gitignore`

✅ Already done! `.env` is in `.gitignore` (line 85)

---

## Step 3: Install react-native-dotenv

This package loads environment variables from `.env` file.

```bash
npm install react-native-dotenv
```

### 3.1 Configure Babel

Update `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true
      }]
    ],
  };
};
```

### 3.2 Update env.config.js to use @env

```javascript
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  API_TIMEOUT,
  ENABLE_CLOUD_SYNC,
  // ... other vars
} from '@env';

const ENV = {
  // Supabase Configuration
  SUPABASE_URL: SUPABASE_URL || 'https://your-project.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: SUPABASE_PUBLISHABLE_KEY || 'your-publishable-key-here',

  // API Configuration
  API_TIMEOUT: parseInt(API_TIMEOUT) || 30000,
  // ... rest of config
};
```

---

## Step 4: Remove Exposed Keys from Git History (Optional but Recommended)

### Option 1: Use BFG Repo-Cleaner (Recommended)

```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror https://github.com/PhucNguyen-Dev/eefashionita.git

# Remove the exposed key from all commits
bfg --replace-text passwords.txt eefashionita.git

# Force push
cd eefashionita.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

### Option 2: Contact GitHub Support

If the repository is public, contact GitHub support to remove sensitive data from cache.

### Option 3: Create New Repository (Nuclear Option)

1. Create a new GitHub repository
2. Push only the latest code (with keys removed)
3. Delete the old repository

---

## Step 5: Verify Security

### 5.1 Check that keys are NOT in code

```bash
# Search for exposed keys in code
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/
# Should return nothing!
```

### 5.2 Check .gitignore

```bash
cat .gitignore | grep .env
# Should show:
# .env
# .env.local
# .env.development.local
# .env.test.local
# .env.production.local
```

### 5.3 Test that .env is ignored

```bash
git status
# .env should NOT appear in the list
```

---

## Step 6: Set Up Supabase Row Level Security (RLS)

### 6.1 Enable RLS on all tables

Even with the anon key, users should only access their own data.

```sql
-- Enable RLS on designs table
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own designs
CREATE POLICY "Users can view own designs"
  ON designs FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own designs
CREATE POLICY "Users can insert own designs"
  ON designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own designs
CREATE POLICY "Users can update own designs"
  ON designs FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own designs
CREATE POLICY "Users can delete own designs"
  ON designs FOR DELETE
  USING (auth.uid() = user_id);
```

### 6.2 Verify RLS is working

1. Go to: https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa/auth/policies
2. Check that all tables have RLS enabled
3. Test with different users

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use environment variables for all secrets
- ✅ Keep `.env` in `.gitignore`
- ✅ Rotate keys immediately if exposed
- ✅ Enable Row Level Security on all tables
- ✅ Use different keys for dev/staging/production
- ✅ Review Supabase auth logs regularly
- ✅ Set up GitHub secret scanning

### ❌ DON'T:
- ❌ Hardcode API keys in source code
- ❌ Commit `.env` files to git
- ❌ Share API keys in chat/email
- ❌ Use production keys in development
- ❌ Disable RLS without good reason
- ❌ Ignore security warnings

---

## 📋 Security Checklist

Before proceeding with authentication:

- [ ] Rotated Supabase anon key
- [ ] Created `.env` file with new credentials
- [ ] Verified `.env` is in `.gitignore`
- [ ] Installed `react-native-dotenv`
- [ ] Updated `babel.config.js`
- [ ] Updated `env.config.js` to use `@env`
- [ ] Removed hardcoded keys from code
- [ ] Verified keys are NOT in git history (optional)
- [ ] Enabled RLS on all Supabase tables
- [ ] Tested that `.env` is not tracked by git

---

## 🆘 If Keys Are Already Compromised

### Immediate Actions:

1. **Rotate keys** (Step 1)
2. **Check Supabase logs** for unauthorized access:
   - https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa/logs/auth-logs
3. **Review database** for suspicious data
4. **Enable RLS** on all tables
5. **Monitor usage** for unusual activity

### Long-term Actions:

1. Set up **GitHub secret scanning**
2. Use **Supabase vault** for sensitive data
3. Implement **API rate limiting**
4. Set up **monitoring and alerts**
5. Regular **security audits**

---

## 📚 Additional Resources

- **Supabase Security:** https://supabase.com/docs/guides/auth/row-level-security
- **GitHub Secret Scanning:** https://docs.github.com/en/code-security/secret-scanning
- **BFG Repo-Cleaner:** https://rtyley.github.io/bfg-repo-cleaner/
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/

---

## ✅ After Completing This Guide

Once you've completed all steps:

1. ✅ Keys are rotated
2. ✅ `.env` file is created and ignored
3. ✅ `react-native-dotenv` is installed
4. ✅ Code uses environment variables
5. ✅ RLS is enabled

**You're ready to proceed with building the authentication UI!** 🎉

---

## 🚨 REMEMBER:

**NEVER commit API keys, passwords, or secrets to git!**

If you're unsure, ask before committing!

