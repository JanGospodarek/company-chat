import { Button, Modal, ToggleButton, RadioButton } from "react-native-paper";
import { StyleSheet, View, Text } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFontSize, setTheme } from "@/store/uiSlice";
import { useAppTheme } from "../ThemeProvider";
import { ScalableText } from "../ThemeProvider";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
}

const ActionsModal = (props: Props) => {
  const { isVisible, closeModal } = props;
  const { logOut } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const selectedTheme = useAppSelector((state) => state.ui.theme);
  const selectedFontSize = useAppSelector((state) => state.ui.fontSize);
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    setLoading(true);
    await logOut();
    AsyncStorage.clear();
    setLoading(false);

    router.push("/");
  };
  return (
    <Modal
      visible={isVisible}
      onDismiss={closeModal}
      contentContainerStyle={{
        ...styles.containerStyle,
        backgroundColor: theme.colors.backgroundSecondary,
        borderWidth: 4,
        borderColor: theme.colors.optionalBorderColor,
      }}
    >
      <ScalableText
        style={{
          fontFamily: "League-Spartan-SemiBold",
          fontSize: 26,
          textAlign: "center",
          color: theme.colors.primaryFont,
        }}
      >
        Akcje
      </ScalableText>
      <Button
        mode="outlined"
        style={{ marginTop: 15, marginHorizontal: 50 }}
        onPress={handleLogout}
        loading={loading}
      >
        <ScalableText style={{ fontSize: 14 }}>Wyloguj się</ScalableText>
      </Button>
      <View style={{ marginTop: 10 }}>
        <ScalableText
          style={{
            fontFamily: "League-Spartan-SemiBold",
            color: theme.colors.primaryFont,
            fontSize: 16,
          }}
        >
          Motyw
        </ScalableText>
        <View style={{ marginTop: 10 }}>
          <ToggleButton.Row
            onValueChange={(value) => dispatch(setTheme(value))}
            value={selectedTheme}
            style={{ borderColor: theme.colors.primary }}
          >
            <ToggleButton
              icon="weather-sunny"
              value="normal"
              style={{ borderColor: theme.colors.primary }}
              iconColor={theme.colors.primary}
            />
            <ToggleButton
              icon="contrast-circle"
              value="highContrast"
              iconColor={theme.colors.primary}
              style={{ borderColor: theme.colors.primary }}
            />
          </ToggleButton.Row>
        </View>
        <View style={{ marginTop: 10 }}>
          <ScalableText
            style={{
              fontFamily: "League-Spartan-SemiBold",
              color: theme.colors.primaryFont,
              fontSize: 16,
            }}
          >
            Rozmiar czcionki
          </ScalableText>
          <RadioButton.Group
            onValueChange={(newValue) =>
              dispatch(setFontSize(Number(newValue)))
            }
            value={selectedFontSize.toString()}
          >
            <View style={styles.radioBtnGroup}>
              <View style={styles.radioBtn}>
                <Text
                  style={{
                    fontFamily: "League-Spartan-SemiBold",
                    fontSize: 16,
                    color: theme.colors.primaryFont,
                  }}
                >
                  Normalny
                </Text>
                <RadioButton value="1" />
              </View>
              <View style={styles.radioBtn}>
                <Text
                  style={{
                    fontFamily: "League-Spartan-SemiBold",
                    fontSize: 18,
                    color: theme.colors.primaryFont,
                  }}
                >
                  Średni
                </Text>
                <RadioButton value="1.2" />
              </View>
              <View style={styles.radioBtn}>
                <Text
                  style={{
                    fontFamily: "League-Spartan-SemiBold",
                    fontSize: 22,
                    color: theme.colors.primaryFont,
                  }}
                >
                  Duży
                </Text>
                <RadioButton value="1.4" />
              </View>
            </View>
          </RadioButton.Group>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 20,
  },
  radioBtnGroup: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginTop: 10,
  },
  radioBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ActionsModal;
