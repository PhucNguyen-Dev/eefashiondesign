# 🔐 Authentication Testing Guide

## ✅ Supabase is Now Configured!

Your Supabase credentials have been successfully configured:
- **Project URL:** `https://riwzkjsbnggcmqnjimsa.supabase.co`
- **Dashboard:** https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa
- **Status:** ✅ Ready to use

---

## 🧪 Quick Test

### Option 1: Test in Browser Console

1. Run the app: `npm run web`
2. Open browser console (F12)
3. Test authentication:

```javascript
// Import the auth API
import authAPI from './src/core/services/api/auth.api';

// Test sign up
const result = await authAPI.signUp('test@example.com', 'password123', {
  name: 'Test User'
});
console.log('Sign up result:', result);

// Test sign in
const loginResult = await authAPI.signIn('test@example.com', 'password123');
console.log('Sign in result:', loginResult);
```

### Option 2: Create a Test Component

Create `src/features/auth/screens/AuthTestScreen.js`:

```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../../core/state/hooks/useAuth';

const AuthTestScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, signIn, signOut, user, isAuthenticated, isLoading } = useAuth();

  const handleSignUp = async () => {
    const result = await signUp(email, password, { name: 'Test User' });
    if (result.success) {
      Alert.alert('Success', 'Account created!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleSignIn = async () => {
    const result = await signIn(email, password);
    if (result.success) {
      Alert.alert('Success', 'Signed in!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    Alert.alert('Success', 'Signed out!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Test</Text>
      
      {isAuthenticated ? (
        <View>
          <Text style={styles.userInfo}>Logged in as: {user?.email}</Text>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#1a1d2e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#252837',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#6C5CE7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  userInfo: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AuthTestScreen;
```

Then add to `App.js`:

```javascript
import AuthTestScreen from './src/features/auth/screens/AuthTestScreen';

// In your Stack.Navigator:
<Stack.Screen 
  name="AuthTest" 
  component={AuthTestScreen}
  options={{ title: 'Auth Test' }}
/>
```

---

## 🔧 Supabase Dashboard Setup

### 1. Disable Email Confirmation (for testing)

1. Go to: https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa/auth/providers
2. Click on **Email** provider
3. Scroll to **Email Confirmation**
4. Toggle **OFF** "Confirm email"
5. Click **Save**

This allows you to test without needing to verify emails.

### 2. View Users

1. Go to: https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa/auth/users
2. You'll see all registered users here
3. You can manually delete test users if needed

### 3. Check Auth Logs

1. Go to: https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa/logs/auth-logs
2. See all authentication events (sign ups, sign ins, errors)

---

## ✅ Expected Results

### Successful Sign Up:
```javascript
{
  success: true,
  user: {
    id: "uuid-here",
    email: "test@example.com",
    // ... other user data
  },
  session: {
    access_token: "jwt-token-here",
    // ... session data
  }
}
```

### Successful Sign In:
```javascript
{
  success: true,
  user: { ... },
  session: { ... }
}
```

### Error Example:
```javascript
{
  success: false,
  error: "User already registered"
}
```

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
- **Check:** Credentials in `src/core/config/env.config.js`
- **Solution:** Make sure URL and key are correct

### Error: "Email not confirmed"
- **Check:** Email confirmation setting in Supabase
- **Solution:** Disable email confirmation (see above)

### Error: "User already registered"
- **Solution:** Use sign in instead, or delete user from dashboard

### No response / timeout
- **Check:** Internet connection
- **Check:** Supabase project is active (not paused)

---

## 📝 Next Steps

After testing authentication:

1. **Create database tables** (see `docs/SUPABASE_SETUP.md`)
2. **Enable cloud sync** (uncomment code in `sync.api.js`)
3. **Enable image upload** (create storage bucket)
4. **Build login/signup UI** (replace test screen with real UI)

---

## 🎉 You're Ready!

Your authentication system is fully configured and ready to use!

**Test it now:**
1. Run `npm run web`
2. Create test component (Option 2 above)
3. Try signing up with a test email
4. Check Supabase dashboard to see the user

**Happy coding!** 🚀

