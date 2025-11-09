import React, { Component, ReactNode } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text as TamaguiText } from './Text';

// Define YStack
const YStack = styled(Stack, { flexDirection: 'column' });
const XStack = styled(Stack, { flexDirection: 'row' });

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

const Container = styled(Stack, {
  flex: 1,
});

const Content = styled(YStack, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
});

const Title = styled(TamaguiText, {
  fontSize: 24,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 10,
  textAlign: 'center',
});

const Subtitle = styled(TamaguiText, {
  fontSize: 16,
  color: '$textSecondary',
  textAlign: 'center',
  marginBottom: 30,
  paddingHorizontal: 20,
});

const ErrorDetails = styled(ScrollView, {
  maxHeight: 200,
  width: '100%',
  backgroundColor: '$bgInput',
  borderRadius: 10,
  padding: 15,
  marginBottom: 20,
});

const ErrorTitle = styled(TamaguiText, {
  fontSize: 14,
  fontWeight: 'bold',
  color: '$error',
  marginBottom: 5,
});

const ErrorText = styled(TamaguiText, {
  fontSize: 12,
  color: '$textSecondary',
  fontFamily: 'monospace',
  marginBottom: 15,
});

const ButtonGradient = styled(XStack, {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 15,
  borderRadius: 10,
});

const ButtonText = styled(TamaguiText, {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  marginLeft: 10,
});

const SecondaryButton = styled(TouchableOpacity, {
  backgroundColor: '$bgInput',
  borderRadius: 10,
  paddingVertical: 15,
  width: '100%',
  marginBottom: 10,
});

const SecondaryButtonText = styled(TamaguiText, {
  color: '$textSecondary',
  fontSize: 16,
  textAlign: 'center',
});

const HelpText = styled(TamaguiText, {
  fontSize: 12,
  color: '$textTertiary',
  textAlign: 'center',
  marginTop: 20,
});

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can send error to analytics service here
    // Example: Analytics.logError(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    // You might want to reload the app or navigate to home
    this.handleReset();
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container>
          <LinearGradient
            colors={['#0F0F1E', '#1E1E3F']}
            style={{ flex: 1 }}
          >
            <Content>
              {/* Error Icon */}
              <YStack marginBottom={20}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={80}
                  color="#FF6B6B"
                />
              </YStack>

              {/* Error Message */}
              <Title>Oops! Something went wrong</Title>
              <Subtitle>
                We're sorry for the inconvenience. The app encountered an unexpected error.
              </Subtitle>

              {/* Error Details (Development Mode) */}
              {__DEV__ && this.state.error && (
                <ErrorDetails>
                  <ErrorTitle>Error Details:</ErrorTitle>
                  <ErrorText>{this.state.error.toString()}</ErrorText>
                  {this.state.errorInfo && (
                    <>
                      <ErrorTitle>Stack Trace:</ErrorTitle>
                      <ErrorText>
                        {this.state.errorInfo.componentStack}
                      </ErrorText>
                    </>
                  )}
                </ErrorDetails>
              )}

              {/* Action Buttons */}
              <YStack width="100%" alignItems="center">
                <TouchableOpacity
                  style={{ width: '100%', marginBottom: 10 }}
                  onPress={this.handleReload}
                >
                  <LinearGradient
                    colors={['#6C63FF', '#4ECDC4']}
                    style={{ borderRadius: 10 }}
                  >
                    <ButtonGradient>
                      <MaterialCommunityIcons
                        name="refresh"
                        size={20}
                        color="#fff"
                      />
                      <ButtonText>Try Again</ButtonText>
                    </ButtonGradient>
                  </LinearGradient>
                </TouchableOpacity>

                {__DEV__ && (
                  <SecondaryButton onPress={this.handleReset}>
                    <SecondaryButtonText>Dismiss</SecondaryButtonText>
                  </SecondaryButton>
                )}
              </YStack>

              {/* Help Text */}
              <HelpText>
                If this problem persists, please contact support
              </HelpText>
            </Content>
          </LinearGradient>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
