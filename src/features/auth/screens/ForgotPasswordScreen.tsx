/**
 * Forgot Password Screen - Migrated to Tamagui
 * Password reset request
 */

import React, { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@infrastructure/auth/useAuth';
import { AuthContainer, AuthInput, Button, ButtonText, Text as TamaguiText } from '../../../components/tamagui';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface ForgotPasswordScreenProps {
  navigation: any;
}

// Styled components
const BackButton = styled(TouchableOpacity, {
  position: 'absolute',
  top: '$lg',
  left: '$lg',
  zIndex: 10,
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '$bgSecondary',
  alignItems: 'center',
  justifyContent: 'center',
});

const SuccessContainer = styled(YStack, {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$xl',
  gap: '$lg',
});

const SuccessIcon = styled(YStack, {
  marginBottom: '$md',
});

const SuccessTitle = styled(TamaguiText, {
  fontSize: 28,
  fontWeight: 'bold',
  color: '$textPrimary',
  textAlign: 'center',
});

const SuccessText = styled(TamaguiText, {
  fontSize: 16,
  color: '$textSecondary',
  textAlign: 'center',
});

const EmailText = styled(TamaguiText, {
  fontSize: 16,
  fontWeight: 'bold',
  color: '$primary',
  textAlign: 'center',
});

const SuccessNote = styled(TamaguiText, {
  fontSize: 14,
  color: '$textTertiary',
  textAlign: 'center',
  fontStyle: 'italic',
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

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email');
      return;
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    const result = await resetPassword(email);
    
    if (result.success) {
      setEmailSent(true);
    } else {
      Alert.alert('Reset Failed', result.error || 'An error occurred while resetting your password');
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (emailSent) {
    return (
      <YStack flex={1} backgroundColor="$bg">
        <BackButton onPress={handleBackToLogin}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </BackButton>
        <SuccessContainer>
          <SuccessIcon>
            <Ionicons name="checkmark-circle" size={80} color="#00D9C0" />
          </SuccessIcon>
          <SuccessTitle>Check Your Email</SuccessTitle>
          <SuccessText>
            We've sent password reset instructions to:
          </SuccessText>
          <EmailText>{email}</EmailText>
          <SuccessNote>
            If you don't see the email, check your spam folder.
          </SuccessNote>
          <Button
            variant="primary"
            size="lg"
            onPress={handleBackToLogin}
            style={{ marginTop: 32, width: '100%', maxWidth: 300 }}
          >
            <ButtonText>Back to Login</ButtonText>
          </Button>
        </SuccessContainer>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$bg">
      <BackButton onPress={handleBackToLogin}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </BackButton>
      <AuthContainer
        title="Forgot Password?"
        subtitle="Enter your email and we'll send you instructions to reset your password"
        icon="key-outline"
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

          {/* Error Message */}
          {error && (
            <ErrorContainer>
              <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
              <ErrorText>{error}</ErrorText>
            </ErrorContainer>
          )}

          {/* Reset Button */}
          <Button
            variant="primary"
            size="lg"
            onPress={handleResetPassword}
            disabled={isLoading}
            style={{ marginTop: 16 }}
          >
            {isLoading ? (
              <XStack gap="$sm" alignItems="center">
                <ActivityIndicator color="#fff" />
                <ButtonText>Sending...</ButtonText>
              </XStack>
            ) : (
              <ButtonText>Send Reset Link</ButtonText>
            )}
          </Button>

          {/* Back to Login Link */}
          <XStack justifyContent="center" marginTop="$lg">
            <TouchableOpacity onPress={handleBackToLogin}>
              <TamaguiText color="$primary" fontSize={14} fontWeight="bold">
                Back to Login
              </TamaguiText>
            </TouchableOpacity>
          </XStack>
        </YStack>
      </AuthContainer>
    </YStack>
  );
};


export default ForgotPasswordScreen;
