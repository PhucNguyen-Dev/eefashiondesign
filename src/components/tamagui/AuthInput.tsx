import React, { useState } from 'react';
import { styled, Stack } from '@tamagui/core';
import { TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface AuthInputProps {
  icon: keyof typeof Ionicons.glyphMap;
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
}

const InputContainer = styled(XStack, {
  backgroundColor: '$bgSecondary',
  borderRadius: '$md',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  alignItems: 'center',
  gap: '$sm',
  borderWidth: 1,
  borderColor: '$border',
  minHeight: 50,
  variants: {
    focused: {
      true: {
        borderColor: '$primary',
        backgroundColor: '$bgCard',
      },
    },
    error: {
      true: {
        borderColor: '$error',
      },
    },
  } as any,
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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const actualSecureTextEntry = showPasswordToggle
    ? secureTextEntry && !isPasswordVisible
    : secureTextEntry;

  return (
    <InputContainer focused={isFocused}>
      <IconContainer>
        <Ionicons name={icon} size={20} color="#8E8E93" />
      </IconContainer>
      
      <TextInput
        style={{ flex: 1, fontSize: 16, color: '#FFFFFF', outlineStyle: 'none' as any }}
        placeholder={placeholder}
        placeholderTextColor="#B0B0C0"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={actualSecureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete as any}
        editable={editable}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
  );
};

export default AuthInput;
