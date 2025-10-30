/**
 * Sign Up Screen
 * User registration - Create new account
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../core/state/hooks/useAuth";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { signUp, isLoading, error, clearError, user, isAuthenticated } = useAuth();

  // Monitor authentication state
  useEffect(() => {
    console.log('SignUpScreen - Auth state changed:', { user, isAuthenticated });
    
    // If user is authenticated after sign up, they'll be automatically navigated
    // No manual navigation needed - App.js handles this
  }, [isAuthenticated, user]);

  const handleSignUp = async () => {
    // Clear previous errors
    clearError();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your full name");
      return;
    }

    if (!email.includes('@')) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return;
    }

    if (!agreedToTerms) {
      Alert.alert(
        "Terms Required",
        "Please agree to the Terms of Service and Privacy Policy"
      );
      return;
    }

    console.log('Attempting sign up with:', { email, name });
    const result = await signUp(email, password, { name: name.trim() });

    console.log('Sign up result:', result);

    if (result.success) {
      console.log('Sign up successful! User:', result.user);
      // Show success message
      if (Platform.OS === "web") {
        alert("Account Created! Please check your email to verify your account.");
      } else {
        Alert.alert(
          "Account Created!",
          "Please check your email to verify your account before logging in.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      }
    } else {
      console.error('Sign up failed:', result.error);
      Alert.alert("Sign Up Failed", result.error || "An error occurred during sign up");
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="diamond" size={60} color="#4A90E2" />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join eeFashionita today</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#8E8E93"
              value={name}
              onChangeText={(text) => {
                setName(text);
                clearError();
              }}
              autoCapitalize="words"
              autoComplete="name"
              editable={!isLoading}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#8E8E93"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError();
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              placeholderTextColor="#8E8E93"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError();
              }}
              secureTextEntry={!showPassword}
              autoComplete="password-new"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#8E8E93"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#8E8E93"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                clearError();
              }}
              secureTextEntry={!showConfirmPassword}
              autoComplete="password-new"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#8E8E93"
              />
            </TouchableOpacity>
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            disabled={isLoading}
          >
            <View
              style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
            >
              {agreedToTerms && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxText}>
              I agree to the <Text style={styles.link}>Terms of Service</Text>{" "}
              and <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              isLoading && styles.signUpButtonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.loadingText}>Creating account...</Text>
              </View>
            ) : (
              <Text style={styles.signUpButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign Up Buttons (Placeholder) */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
              <Ionicons name="logo-google" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
              <Ionicons name="logo-facebook" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
              <Ionicons name="logo-apple" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.socialNote}>Social sign up coming soon</Text>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1d2e",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 8,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252837",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#8E8E93",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  checkboxText: {
    color: "#8E8E93",
    fontSize: 14,
    flex: 1,
  },
  link: {
    color: "#4A90E2",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B20",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  signUpButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#3A3D4E",
  },
  dividerText: {
    color: "#8E8E93",
    fontSize: 14,
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 8,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#252837",
    justifyContent: "center",
    alignItems: "center",
  },
  socialNote: {
    color: "#8E8E93",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#8E8E93",
    fontSize: 16,
  },
  loginLink: {
    color: "#4A90E2",
    fontSize: 16,
    fontWeight: "600",
  },
});

SignUpScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default SignUpScreen;
