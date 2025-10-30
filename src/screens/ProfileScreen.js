import React from 'react';
import { TamaguiProfileScreen } from '../components/tamagui/ProfileScreen';
import { useAuth } from '../core/state/hooks/useAuth';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  return <TamaguiProfileScreen user={user} signOut={signOut} />;
};

export default ProfileScreen;
