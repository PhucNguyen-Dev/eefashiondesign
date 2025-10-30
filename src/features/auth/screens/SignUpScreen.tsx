/**
 * Sign Up Screen - Migrated to Tamagui
 * User registration - Create new account
 */

import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { styled, Stack } from '@tamagui/core';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../core/state/hooks/useAuth";
import { AuthContainer, AuthInput, Button, ButtonText, Text as TamaguiText } from '../../../components/tamagui';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface SignUpScreenProps {
  navigation: any;
}

// Styled components
const ErrorContainer = styled(XStack, {
  backgroundColor: '$errorBg',
  borderRadius: '$md',
  padding: '$md',
  gap: '$sm',
  alignItems: 'center',
});

const ErrorText = styled(TamaguiText, {
  color: '$error',
  fontSize: 14,
  flex: 1,
});

const CheckboxContainer = styled(XStack, {
  alignItems: 'center',
  gap: '$sm',
  marginVertical: '$md',
});

const CheckboxButton = styled(TouchableOpacity, {
  width: 24,
  height: 24,
  borderRadius: 6,
  borderWidth: 2,
  borderColor: '$border',
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    checked: {
      true: {
        backgroundColor: '$primary',
        borderColor: '$primary',
      },
    },
  } as any,
});

const CheckboxText = styled(TamaguiText, {
  flex: 1,
  color: '$textSecondary',
  fontSize: 14,
});

const LinkText = styled(TamaguiText, {
  color: '$primary',
  fontWeight: '600',
});

const LoginContainer = styled(XStack, {
  justifyContent: 'center',
  marginTop: '$xl',
  gap: '$xs',
});

const LoginText = styled(TamaguiText, {
  color: '$textSecondary',
  fontSize: 14,
});

const LoginLink = styled(TouchableOpacity, {});

const LoginLinkText = styled(TamaguiText, {
  color: '$primary',
  fontSize: 14,
  fontWeight: 'bold',
});

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { signUp, isLoading, error, clearError, user, isAuthenticated } = useAuth();

  // Monitor authentication state
  useEffect(() => {
    console.log('SignUpScreen - Auth state changed:', { user, isAuthenticated });
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
    <AuthContainer
      title="Create Account"
      subtitle="Join eeFashionita today"
      icon="diamond"
    >
      <YStack gap="$md">
        {/* Name Input */}
        <AuthInput
          icon="person-outline"
          placeholder="Full Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            clearError();
          }}
          autoCapitalize="words"
          autoComplete="name"
          editable={!isLoading}
        />

        {/* Email Input */}
        <AuthInput
          icon="mail-outline"
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            clearError();
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
        />

        {/* Password Input */}
        <AuthInput
          icon="lock-closed-outline"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearError();
          }}
          secureTextEntry
          showPasswordToggle
          autoComplete="password-new"
          editable={!isLoading}
        />

        {/* Confirm Password Input */}
        <AuthInput
          icon="lock-closed-outline"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            clearError();
          }}
          secureTextEntry
          showPasswordToggle
          autoComplete="password-new"
          editable={!isLoading}
        />

        {/* Terms and Conditions Checkbox */}
        <CheckboxContainer>
          <CheckboxButton
            checked={agreedToTerms}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            disabled={isLoading}
          >
            {agreedToTerms && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </CheckboxButton>
          <CheckboxText>
            I agree to the <LinkText>Terms of Service</LinkText> and{' '}
            <LinkText>Privacy Policy</LinkText>
          </CheckboxText>
        </CheckboxContainer>

        {/* Error Message */}
        {error && (
          <ErrorContainer>
            <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        )}

        {/* Sign Up Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleSignUp}
          disabled={isLoading}
          style={{ marginTop: 16 }}
        >
          {isLoading ? (
            <XStack gap="$sm" alignItems="center">
              <ActivityIndicator color="#fff" />
              <ButtonText>Creating Account...</ButtonText>
            </XStack>
          ) : (
            <ButtonText>Create Account</ButtonText>
          )}
        </Button>

        {/* Login Link */}
        <LoginContainer>
          <LoginText>Already have an account?</LoginText>
          <LoginLink onPress={handleLogin}>
            <LoginLinkText>Sign In</LoginLinkText>
          </LoginLink>
        </LoginContainer>
      </YStack>
    </AuthContainer>
  );
};


export default SignUpScreen;
