import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Animated,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { TamaguiProvider, Theme } from "@tamagui/core";
import tamaguiConfig from "./tamagui.config.ts";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import PropTypes from "prop-types";

// Import Screens - New Structure
import HomeScreen from "./src/features/home/screens/HomeScreen";
import DesignStudioScreen from "./src/features/design2D/screens/DesignStudioScreen";
import ARViewScreen from "./src/features/ar/screens/ARViewScreen";
import { Design3DAtelierScreen } from "./src/features/design3D";

// Import Auth Screens
import {
  LoginScreen,
  SignUpScreen,
  ForgotPasswordScreen,
} from "./src/features/auth/screens";

// Import Screens - Legacy (to be migrated)
import TemplateLibraryScreen from "./src/screens/TemplateLibraryScreen";
import MeasurementsScreen from "./src/screens/MeasurementsScreen";
import AIAssistantScreen from "./src/screens/AIAssistantScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import TrendExplorerScreen from "./src/screens/TrendExplorerScreen";
import CollaborationScreen from "./src/screens/CollaborationScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";

// Import Shared Components
import ErrorBoundary from "./src/shared/components/ErrorBoundary";
import TutorialOverlay from "./src/shared/components/TutorialOverlay";

// Import App Infrastructure
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { ThemeToggle } from "./src/components";
import { useAppStore, useTutorialStore } from "./src/state/appStore";
import { AuthProvider, useAuth } from "./src/context/AuthContext"; // CORRECTED: Use the new AuthContext
import performanceService from "./src/services/performanceService";

// Import Core Utilities
import { logPlatformInfo } from "./src/infrastructure/platform/detection";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Animated Tab Bar Icon Component
// PERFORMANCE FIX: Memoized component with stable animated values
const AnimatedTabIcon = React.memo(({ name, color, focused, IconComponent }) => {
  // PERFORMANCE FIX: Create animated values only once
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (focused) {
      // Only trigger haptics on native platforms (not web)
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start();
    }
  }, [focused]); // PERFORMANCE FIX: Removed scaleAnim and rotateAnim from dependencies

  const spin = useMemo(() => rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  }), [rotateAnim]); // PERFORMANCE FIX: Memoized interpolation

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { rotate: spin }],
      }}
    >
      <IconComponent name={name} size={24} color={color} />
    </Animated.View>
  );
});

AnimatedTabIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
  IconComponent: PropTypes.elementType.isRequired,
};

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerRight: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 15,
            }}
          >
            <ThemeToggle />
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={() => {
                const rootNav = navigation.getParent() ?? navigation;
                rootNav.navigate("Profile");
              }}
              accessibilityLabel="Open profile"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={26}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        ),
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let IconComponent = Ionicons;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Studio":
              iconName = "brush";
              IconComponent = MaterialCommunityIcons;
              break;
            case "Templates":
              iconName = "layers";
              break;
            case "3D View":
              iconName = "cube";
              IconComponent = MaterialCommunityIcons;
              break;
            case "AI Assistant":
              iconName = "robot";
              IconComponent = MaterialCommunityIcons;
              break;
          }

          return (
            <AnimatedTabIcon
              name={iconName}
              color={color}
              focused={focused}
              IconComponent={IconComponent}
            />
          );
        },
        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#1A1A2E",
          borderTopWidth: 0,
          elevation: 20,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: "#1A1A2E",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        headerBackground: () => (
          <LinearGradient colors={["#1A1A2E", "#0F0F1E"]} style={{ flex: 1 }} />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "FashionCraft Studio",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Studio"
        component={DesignStudioScreen}
        options={{
          title: "Design Studio",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Templates"
        component={TemplateLibraryScreen}
        options={{
          title: "Template Library",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="3D View"
        component={Design3DAtelierScreen}
        options={{
          title: "3D Atelier",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="AI Assistant"
        component={AIAssistantScreen}
        options={{
          title: "AI Fashion Assistant",
          headerTitleAlign: "center",
        }}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
function RootNavigator() {
  const { colors } = useTheme();
  const { isAuthenticated, isLoading } = useAuth(); // CORRECTED: This now uses the real auth context

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1d2e",
        }}
      >
        <MaterialCommunityIcons name="hanger" size={60} color="#4A90E2" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true, // Show headers with back buttons
        headerStyle: {
          backgroundColor: colors.bgCard || "#1A1A2E",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerBackTitle: "Back",
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
                {
                  scale: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
                {
                  rotateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["45deg", "0deg"],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          };
        },
      }}
    >
      {/* Auth Screens - Show when NOT authenticated */}
      {isAuthenticated ? (
        /* Main App Screens - Show when authenticated */
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Measurements"
            component={MeasurementsScreen}
            options={{ title: "My Measurements" }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Profile Settings" }}
          />
          <Stack.Screen
            name="TrendExplorer"
            component={TrendExplorerScreen}
            options={{ title: "Trend Explorer" }}
          />
          <Stack.Screen
            name="Collaboration"
            component={CollaborationScreen}
            options={{ title: "Collaboration Room" }}
          />
          <Stack.Screen
            name="ARView"
            component={ARViewScreen}
            options={{ title: "AR Preview" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

// Splash Screen Component
const SplashScreen = ({ onFinish }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: Platform.OS !== "web",
        }),
      ),
    ]).start();

    setTimeout(onFinish, 3000);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#1A1A2E", "#0F0F1E", "#16213E"]}
      style={styles.splashContainer}
    >
      <Animated.View
        style={[
          styles.splashContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          },
        ]}
      >
        <MaterialCommunityIcons name="hanger" size={100} color="#6C63FF" />
      </Animated.View>
      <Animated.Text
        style={[
          styles.splashTitle,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        FashionCraft Studio
      </Animated.Text>
      <Animated.Text
        style={[
          styles.splashSubtitle,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        Design Your Dreams
      </Animated.Text>
    </LinearGradient>
  );
};

SplashScreen.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

// Main App Component with New Infrastructure
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { onboardingCompleted } = useAppStore();
  const { showTutorial, closeTutorial } = useTutorialStore();

  useEffect(() => {
    // Track app launch performance
    performanceService.mark("app_launch");
    performanceService.trackScreenTransition("AppLaunch", "app_launch");

    // IMPORTANT: Always close tutorial on app launch
    // Tutorial should only show when user explicitly clicks the Tutorial button
    closeTutorial();
  }, [closeTutorial]);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  if (!onboardingCompleted) {
    return <OnboardingScreen />;
  }

  return (
    <>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <TutorialOverlay visible={showTutorial} />
    </>
  );
}

export default function App() {
  // Log platform info on app start (development only)
  useEffect(() => {
    if (__DEV__) {
      logPlatformInfo();
    }
  }, []);

  return (
    <ErrorBoundary>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <Theme name="dark">
          <AuthProvider>
            <ThemeProvider>
              <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
              <AppContent />
            </ThemeProvider>
          </AuthProvider>
        </Theme>
      </TamaguiProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashContent: {
    marginBottom: 30,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  splashSubtitle: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
});
