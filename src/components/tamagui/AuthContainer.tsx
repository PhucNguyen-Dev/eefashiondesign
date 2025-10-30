import React from 'react';
import { styled, YStack, Stack } from '@tamagui/core';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Text as TamaguiText } from './Text';
import { Ionicons } from '@expo/vector-icons';

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const Container = styled(Stack, {
  flex: 1,
  backgroundColor: '$bg',
});

const ScrollContent = styled(YStack, {
  flexGrow: 1,
  padding: '$xl',
  paddingTop: '$2xl',
  gap: '$xl',
});

const Header = styled(YStack, {
  alignItems: 'center',
  gap: '$md',
  marginBottom: '$lg',
});

const IconContainer = styled(Stack, {
  marginBottom: '$sm',
});

const Title = styled(TamaguiText, {
  fontSize: 32,
  fontWeight: 'bold',
  color: '$textPrimary',
  textAlign: 'center',
});

const Subtitle = styled(TamaguiText, {
  fontSize: 16,
  color: '$textSecondary',
  textAlign: 'center',
});

const FormContainer = styled(YStack, {
  gap: '$md',
});

const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  title,
  subtitle,
  icon = 'diamond',
}) => {
  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScrollContent>
            <Header>
              <IconContainer>
                <Ionicons name={icon} size={60} color="#4A90E2" />
              </IconContainer>
              <Title>{title}</Title>
              <Subtitle>{subtitle}</Subtitle>
            </Header>

            <FormContainer>{children}</FormContainer>
          </ScrollContent>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthContainer;
