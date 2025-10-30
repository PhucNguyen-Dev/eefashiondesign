/**
 * Login Screen - Migrated to Tamagui
 * User authentication - Sign in
 */

import React, { useState, useEffect } from "react";
import {
  View,
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

interface LoginScreenProps {
  navigation: any;
}

// Styled components
const ForgotPasswordLink = styled(TouchableOpacity, {
  alignSelf: 'flex-end',
  marginTop: '$sm',
});

const ForgotPasswordText = styled(TamaguiText, {
  color: '$primary',
  fontSize: 14,
});

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

const Divider = styled(XStack, {
  alignItems: 'center',
  gap: '$md',
  marginVertical: '$lg',
});

const DividerLine = styled(View, {
  flex: 1,
  height: 1,
  backgroundColor: '$border',
});

const DividerText = styled(TamaguiText, {
  color: '$textSecondary',
  fontSize: 14,
});

const SocialButtons = styled(XStack, {
  justifyContent: 'center',
  gap: '$md',
});

const SocialButton = styled(TouchableOpacity, {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '$bgSecondary',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '$border',
});

const SocialNote = styled(TamaguiText, {
  textAlign: 'center',
  color: '$textTertiary',
  fontSize: 12,
  marginTop: '$sm',
});

const SignUpContainer = styled(XStack, {
  justifyContent: 'center',
  marginTop: '$xl',
  gap: '$xs',
});

const SignUpText = styled(TamaguiText, {
  color: '$textSecondary',
  fontSize: 14,
});

const SignUpLink = styled(TouchableOpacity, {});

const SignUpLinkText = styled(TamaguiText, {
  color: '$primary',
  fontSize: 14,
  fontWeight: 'bold',
});

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading, error, clearError, user, isAuthenticated } = useAuth();

  // Monitor authentication state
  useEffect(() => {
    console.log('LoginScreen - Auth state changed:', { user, isAuthenticated });
  }, [isAuthenticated, user]);

  const handleLogin = async () => {
    // Clear any previous errors
    clearError();

    // Validation
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password");
      return;
    }

    if (!email.includes('@')) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    console.log('Attempting login with:', email);
    const result = await signIn(email, password);

    console.log('Login result:', result);

    if (result.success) {
      console.log('Login successful! User:', result.user);
    } else {
      console.error('Login failed:', result.error);
      if (Platform.OS !== "web") {
        Alert.alert("Login Failed", result.error || "Invalid email or password");
      }
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <AuthContainer
      title="Welcome Back"
      subtitle="Sign in to continue to eeFashionita"
      icon="diamond"
    >
      <YStack gap="$md">
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
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearError();
          }}
          secureTextEntry
          showPasswordToggle
          autoComplete="password"
          editable={!isLoading}
        />

        {/* Forgot Password */}
        <ForgotPasswordLink onPress={handleForgotPassword}>
          <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
        </ForgotPasswordLink>

        {/* Error Message */}
        {error && (
          <ErrorContainer>
            <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        )}

        {/* Login Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleLogin}
          disabled={isLoading}
          style={{ marginTop: 16 }}
        >
          {isLoading ? (
            <XStack gap="$sm" alignItems="center">
              <ActivityIndicator color="#fff" />
              <ButtonText>Signing in...</ButtonText>
            </XStack>
          ) : (
            <ButtonText>Sign In</ButtonText>
          )}
        </Button>

        {/* Divider */}
        <Divider>
          <DividerLine />
          <DividerText>OR</DividerText>
          <DividerLine />
        </Divider>

        {/* Social Login Buttons */}
        <SocialButtons>
          <SocialButton>
            <Ionicons name="logo-google" size={24} color="#8E8E93" />
          </SocialButton>
          <SocialButton>
            <Ionicons name="logo-facebook" size={24} color="#8E8E93" />
          </SocialButton>
          <SocialButton>
            <Ionicons name="logo-apple" size={24} color="#8E8E93" />
          </SocialButton>
        </SocialButtons>
        <SocialNote>Social login coming soon</SocialNote>

        {/* Sign Up Link */}
        <SignUpContainer>
          <SignUpText>Don't have an account?</SignUpText>
          <SignUpLink onPress={handleSignUp}>
            <SignUpLinkText>Sign Up</SignUpLinkText>
          </SignUpLink>
        </SignUpContainer>
      </YStack>
    </AuthContainer>
  );
};


export default LoginScreen;
