import { Link } from "expo-router";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ScalableText } from "../../components/ThemeProvider";

import { Button, TextInput } from "react-native-paper";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import Alert from "@/components/Alert";
import { useAppTheme } from "@/components/ThemeProvider";
const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { logIn, user } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();

  const [succeded, setSucceded] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<false | string>(false);

  React.useEffect(() => {
    if (user) {
      router.push("/chat/messages/");
    }
  }, []);

  const handleLogin = async () => {
    if (email && password) {
      setLoading(true);

      try {
        await logIn(email, password);

        setLoading(false);
        setError(false);
        setSucceded(true);
        router.push("/chat/messages/");
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    }
  };
  React.useEffect(() => {
    if (error || succeded) {
      setLoading(false);
    }
  }, [error, succeded]);
  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={styles.heading}>
          <ScalableText
            style={{
              fontSize: 48,
              fontFamily: "League-Spartan-Bold",
              color: theme.colors.primaryFont,
            }}
          >
            Logowanie
          </ScalableText>
        </View>
        <View style={styles.content}>
          <TextInput
            label="Email"
            value={email}
            style={{ width: 200 }}
            mode="outlined"
            onChangeText={(text) => setEmail(text)}
            textColor={theme.colors.primaryFont}
          />
          <TextInput
            label="Hasło"
            value={password}
            style={{ width: 200 }}
            mode="outlined"
            onChangeText={(text) => setPassword(text)}
            textColor={theme.colors.primaryFont}
          />
          <View style={styles.btnContainer}>
            <Link href="/" asChild>
              <Button mode="outlined" onPress={() => console.log("Pressed")}>
                <ScalableText style={{ fontSize: 14 }}>Cofnij </ScalableText>
              </Button>
            </Link>
            <Button
              mode="contained"
              onPress={() => handleLogin()}
              loading={loading}
            >
              <ScalableText style={{ fontSize: 14 }}>
                {loading ? "Logowanie" : "Zaloguj"}{" "}
              </ScalableText>
            </Button>
          </View>
        </View>
      </View>
      <Alert
        type={succeded ? "success" : error ? "error" : "none"}
        message={succeded ? "Zalogowano pomyślnie" : error ? error : ""}
        isVisible={succeded || (error as boolean)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { display: "flex", justifyContent: "flex-start" },
  heading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    marginHorizontal: "auto",
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 10,
  },
  btnContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});

export default LoginScreen;
