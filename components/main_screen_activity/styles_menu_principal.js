import React from "react";
import { StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";

const styles = StyleSheet.create({
  login_input: {
    backgroundColor: "#c4c4c4",
    borderRadius: 2,
    paddingLeft: 10,
    marginBottom: 10,
  },
  input_title: {
    marginBottom: 5,
  },
  container: {
    backgroundColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "#fff",
  },

  button: {
    backgroundColor: "#609966",
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    width: 200,
    position: "absolute",
    top: "20%",
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
});

export const Container_card = styled.TouchableOpacity`
  height: 50px;
  width: 150px;
  background-color: #fff;
  border-radius: 10px;
`;

export default styles;
