import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ToastAndroid,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Style, { Container_card } from "./styles_menu_principal.js";
import { Button as BtnPaper } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Fontisto,
  FontAwesome5,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

async function load_forms_vistoria() {
  let form_vistoria = await AsyncStorage.getItem("form_vistoria");
  return form_vistoria != null ? form_vistoria : {};
}

// console.log(await AsyncStorage.getItem("form_vistoria"));

const MenuPrincipal = ({ navigation, route }) => {
  const [forms_vistoria, setForms_vistoria] = useState({});
  function name_icon(name) {
    let rgx = /(\p{L}{1})\p{L}+/gu;

    let initials = [...name.matchAll(rgx)] || [];

    initials = (
      (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
    ).toUpperCase();

    return initials;
  }

  function click_activity(navigation, tela) {
    console.log("Testing...");
    navigation.navigate(tela, {
      name: route.params.name,
      setor: route.params.setor,
      complete_name: route.params.complete_name,
    });
  }

  return (
    <View style={Style.container}>
      <LinearGradient
        colors={[
          "rgba(30, 115, 201,1)",

          "rgba(46,134,223,1)",

          "rgba(46,134,223,1)",
          "rgba(30, 115, 201,1)",
          "rgba(30, 115, 201,1)",
        ]}
        style={{
          position: "absolute",
          top: 0,
          zIndex: 0,
          alignSelf: "center",
          height: 115,

          width: "100%",
        }}
      ></LinearGradient>

      <View
        style={{
          alignItems: "center",
          top: 0,
          paddingTop: 10,
          paddingBottom: 10,
          marginBottom: 10,
          borderTopLeftRadius: 20,
          borderBottomRightRadius: 20,
          backgroundColor: "#fff",
          width: "100%",
          elevation: 3,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",

            width: 60,
            height: 60,
            borderRadius: 50,
            backgroundColor: "#8E4585",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: "#FFF",
            }}
          >
            {name_icon(route.params.complete_name)}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 26,
          }}
        >
          {route.params.complete_name}
        </Text>
      </View>

      <View>
        <Text
          style={{
            fontSize: 20,
            margin: 10,
            fontWeight: 600,
          }}
        >
          Escolha uma subdivisão.
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          gap: 30,
          flexWrap: "wrap",
        }}
      >
        <Container_card
          style={{
            elevation: 2,
            height: 180,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Image
            style={{
              height: "50%",
              width: "70%",
              marginBottom: 20,
            }}
            source={require("../../assets/agua.png")}
          />

          <Text
            style={{
              fontWeight: "bold",
              color: "#4895FF",
            }}
          >
            ÁGUA
          </Text>
        </Container_card>

        <Container_card
          style={{
            elevation: 2,
            height: 180,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
          onPress={() => click_activity(navigation, "esgoto_screen")}
        >
          <Image
            style={{
              height: "50%",
              width: "70%",
              marginBottom: 20,
            }}
            source={require("../../assets/esgoto.png")}
          />

          <Text
            style={{
              fontWeight: "bold",
              color: "#609966",
            }}
          >
            ESGOTO
          </Text>
        </Container_card>
      </View>
    </View>
  );
};

export default MenuPrincipal;
