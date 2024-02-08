import { useFonts } from "expo-font";
import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Button, PaperProvider } from "react-native-paper";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
const StartScreen = () => {
  const [fontsLoaded, fontError] = useFonts({
    "League-Spartan": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    "League-Spartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <PaperProvider>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
        onLayout={onLayoutRootView}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            fontFamily: "League-Spartan",
          }}
        >
          Company chat
        </Text>
        <Link href="/auth/login" asChild>
          <Button
            mode="contained"
            style={{ width: "50%" }}
            onPress={() => console.log("Pressed")}
          >
            <Text style={{ fontFamily: "League-Spartan" }}>Login</Text>
          </Button>
        </Link>

        <Link href="/auth/register" asChild>
          <Button
            mode="outlined"
            style={{ width: "50%" }}
            onPress={() => console.log("register")}
          >
            <Text style={{ fontFamily: "League-Spartan" }}>Register</Text>
          </Button>
        </Link>
        <Link
          href={{
            pathname: "/chat/messages/[id]",
            params: { id: "bacon" },
          }}
          asChild
        >
          <Button
            mode="outlined"
            style={{ width: "50%" }}
            onPress={() => console.log("register")}
          >
            <Text>Chat</Text>
          </Button>
        </Link>
      </View>
    </PaperProvider>
  );
};
export default StartScreen;
