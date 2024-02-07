import Heading from "@/components/messages/Heading";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Heading />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default MyComponent;
