// import FontAwesome from "@expo/vector-icons/FontAwesome";
// // import {
// //   DarkTheme,
// //   DefaultTheme,
// //   ThemeProvider,
// // } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { useEffect } from "react";

// // import { useColorScheme } from "@/components/useColorScheme";

// export {
//   // Catch any errors thrown by the Layout component.
//   ErrorBoundary,
// } from "expo-router";

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "",
// };

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//     ...FontAwesome.font,
//   });

//   // Expo Router uses Error Boundaries to catch errors in the navigation tree.
//   useEffect(() => {
//     if (error) throw error;
//   }, [error]);

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return <RootLayoutNav />;
// }

// function RootLayoutNav() {
//   // const colorScheme = useColorScheme();

//   return (
//     // <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//     <Stack>
//       {/* <Stack.Screen name="start" options={{ headerShown: false }} /> */}
//       {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
//     </Stack>
//     // </ThemeProvider>
//   );
// }
import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import SocketWrapper from "@/components/SocketWrapper";
import ThemeProvider from "@/components/ThemeProvider";
export default function Wrapper() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <ThemeProvider>
          <Slot />
        </ThemeProvider>
      </Provider>
    </AuthProvider>
  );
}
