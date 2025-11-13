import React, { useState } from 'react';
import { styled, Stack, Text } from '@tamagui/core';
import { TextInput, TouchableOpacity, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface AuthInputProps {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  editable?: boolean;
  showPasswordToggle?: boolean;
  onClear?: () => void;
  error?: string;
  onValidate?: (value: string) => string | null;
}

const InputContainer = styled(XStack, {
  backgroundColor: '#1A1A2E',
  borderRadius: 15,
  paddingHorizontal: 15,
  paddingVertical: 12,
  alignItems: 'center',
  gap: '$sm',
  borderWidth: 2,
  borderColor: 'transparent',
  minHeight: 50,

  ...(Platform.OS === 'web' && {
    transition: 'all 0.2s ease',
  }),

  variants: {
    focused: {
      true: {
        borderColor: '#6C63FF',
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        transform: [{ scale: 1.01 }],
      },
    },
    error: {
      true: {
        borderColor: '#FF6B6B',
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
    },
  } as any,
});

const ErrorText = styled(Text, {
  color: '#FF6B6B',
  fontSize: 12,
  marginTop: 5,
  marginLeft: 5,
});

// Can't use styled for TextInput, use inline styles instead

const IconContainer = styled(XStack, {
  width: 24,
  alignItems: 'center',
  justifyContent: 'center',
});

const AuthInput: React.FC<AuthInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  editable = true,
  showPasswordToggle = false,
  onClear,
  error,
  onValidate,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const actualSecureTextEntry = showPasswordToggle
    ? secureTextEntry && !isPasswordVisible
    : secureTextEntry;

  const handleChangeText = (text: string) => {
    onChangeText(text);

    // Real-time validation
    if (onValidate && text.length > 0) {
      const errorMsg = onValidate(text);
      setValidationError(errorMsg);
    } else {
      setValidationError(null);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    // Validate on blur
    if (onValidate && value.length > 0) {
      const errorMsg = onValidate(value);
      setValidationError(errorMsg);
    }
  };

  const displayError = error || validationError;

  return (
    <YStack gap="$2">
      <InputContainer focused={isFocused} error={!!displayError}>
        <IconContainer>
          <Ionicons
            name={icon as any}
            size={20}
            color={displayError ? '#FF6B6B' : isFocused ? '#6C63FF' : '#8E8E93'}
          />
        </IconContainer>

        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: '#FFFFFF',
          }}
          placeholder={placeholder}
          placeholderTextColor="#B0B0C0"
          value={value}
          onChangeText={handleChangeText}
          secureTextEntry={actualSecureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete as any}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            disabled={!editable}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>
        )}

        {onClear && value.length > 0 && !showPasswordToggle && (
          <TouchableOpacity onPress={onClear} disabled={!editable}>
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </InputContainer>

      {displayError && (
        <ErrorText>{displayError}</ErrorText>
      )}
    </YStack>
  );
};

export default AuthInput;
