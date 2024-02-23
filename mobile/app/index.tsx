import { useFonts } from "expo-font";
import { Link, useRouter } from "expo-router";
import { View, Pressable, LogBox } from "react-native";
import {
  Button,
  PaperProvider,
  DefaultTheme,
  useTheme,
} from "react-native-paper";
import { ScalableText } from "../components/ThemeProvider";

import { useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useAppTheme } from "@/components/ThemeProvider";

const StartScreen = () => {
  const { user } = useAuth();
  const [isLogged, setIsLogged] = React.useState(false);
  const router = useRouter();
  const theme = useAppTheme();
  // useEffect(() => {}, [user]);
  LogBox.ignoreLogs([
    "new NativeEventEmitter",
    "Maximum update depth exceeded",
  ]);
  const [fontsLoaded, fontError] = useFonts({
    "League-Spartan": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    "League-Spartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
    "League-Spartan-SemiBold": require("../assets/fonts/LeagueSpartan-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
    if (user) {
      router.push("/chat/messages/");
    }
  }, [fontsLoaded, fontError, user]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        backgroundColor: theme.colors.background,
        height: "100%",
      }}
      onLayout={onLayoutRootView}
    >
      <ScalableText
        style={{
          fontSize: 32,
          fontWeight: "bold",
          fontFamily: "League-Spartan",
          color: theme.colors.primaryFont,
        }}
      >
        Company chat
      </ScalableText>

      <Link href="/auth/login" asChild>
        <Button mode="contained" style={{ width: "50%" }}>
          <ScalableText style={{ fontFamily: "League-Spartan", fontSize: 14 }}>
            Zaloguj się
          </ScalableText>
        </Button>
      </Link>

      <Link href="/auth/register" asChild>
        <Button
          mode="outlined"
          style={{ width: "50%" }}
          onPress={() => console.log("register")}
        >
          <ScalableText style={{ fontFamily: "League-Spartan", fontSize: 14 }}>
            Zarejestruj się
          </ScalableText>
        </Button>
      </Link>
    </View>
  );
};
export default StartScreen;
