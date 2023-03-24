import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    marginTop: 22,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "90%",
    width: "90%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
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
    flex: 1,
    backgroundColor: "#fff",
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

export default styles;
