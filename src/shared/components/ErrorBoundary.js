import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../config/constants';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can send error to analytics service here
    // Example: Analytics.logError(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    // You might want to reload the app or navigate to home
    this.handleReset();
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={[COLORS.bgDark, COLORS.bgCard]}
            style={styles.gradient}
          >
            <View style={styles.content}>
              {/* Error Icon */}
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={80}
                  color={COLORS.error}
                />
              </View>

              {/* Error Message */}
              <Text style={styles.title}>Oops! Something went wrong</Text>
              <Text style={styles.subtitle}>
                We're sorry for the inconvenience. The app encountered an unexpected error.
              </Text>

              {/* Error Details (Development Mode) */}
              {__DEV__ && this.state.error && (
                <ScrollView style={styles.errorDetails}>
                  <Text style={styles.errorTitle}>Error Details:</Text>
                  <Text style={styles.errorText}>{this.state.error.toString()}</Text>
                  {this.state.errorInfo && (
                    <>
                      <Text style={styles.errorTitle}>Stack Trace:</Text>
                      <Text style={styles.errorText}>
                        {this.state.errorInfo.componentStack}
                      </Text>
                    </>
                  )}
                </ScrollView>
              )}

              {/* Action Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleReload}
                >
                  <LinearGradient
                    colors={COLORS.gradientPrimary}
                    style={styles.buttonGradient}
                  >
                    <MaterialCommunityIcons
                      name="refresh"
                      size={20}
                      color="#fff"
                    />
                    <Text style={styles.buttonText}>Try Again</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {__DEV__ && (
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={this.handleReset}
                  >
                    <Text style={styles.secondaryButtonText}>Dismiss</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Help Text */}
              <Text style={styles.helpText}>
                If this problem persists, please contact support
              </Text>
            </View>
          </LinearGradient>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  errorDetails: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: COLORS.bgInput,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginBottom: 15,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginBottom: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: COLORS.bgInput,
    borderRadius: 10,
    paddingVertical: 15,
  },
  secondaryButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ErrorBoundary;
