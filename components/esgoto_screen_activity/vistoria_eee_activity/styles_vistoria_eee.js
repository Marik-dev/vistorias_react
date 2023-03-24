import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const styles = StyleSheet.create({
  login_input: {
    backgroundColor: "#c4c4c4",
    paddingLeft: 20,
    height: 38,
    width: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    position: "absolute",
    top: 30,
  },

  input_title: {
    marginBottom: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "#fff",
  },

  button: {
    backgroundColor: "#2e83ab",
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    width: 200,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
});
