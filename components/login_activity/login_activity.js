import React, { useState } from "react";
import {
  Text,
  View,
  ToastAndroid,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { styles as Style } from "./styles_login.js";
import { Akira } from "react-native-textinput-effects";
import { Hideo } from "react-native-textinput-effects";
import { Madoka } from "react-native-textinput-effects";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const Oi = (props) => {
  return (
    <Text>
      {props.children}
      {props.contagem}
    </Text>
  );
};

const showToastWithGravity = (message) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER
  );
};

const LoginView = (props) => {
  const netInfo = useNetInfo();
  let connection = netInfo.isConnected;
  const [matricula, set_matricula] = useState("");

  async function login() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const gpsServiceOn = await Location.hasServicesEnabledAsync();

    if (!gpsServiceOn) {
      return Alert.alert(
        "Ativar o GPS",
        "Por favor ative o serviço de GPS do dispositivo",
        [
          {
            text: "Ok",
            onPress: () => {
              console.log("Teste");
            },
          },
        ]
      );
    }

    if (status !== "granted") {
      return Alert.alert(
        "Ativar permissões de Localização",
        "Por favor ative as permissões de localização no dispositivo",
        [
          {
            text: "Ok",
            onPress: () => {
              console.log("Teste");
            },
          },
        ]
      );
    }

    if (!connection) {
      showToastWithGravity(
        `Bem vindo(a) ${await AsyncStorage.getItem("user")}`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );

      console.log(await AsyncStorage.getItem("setor"));
      console.log(await AsyncStorage.getItem("user"));

      props.navigation.navigate("tela_activity", {
        name: `${await AsyncStorage.getItem("user")}`,
        setor: `${await AsyncStorage.getItem("setor")}`,
        complete_name: `${await AsyncStorage.getItem("complete_name")}`,
      });
    } else {
      await fetch(
        `https://localsig.com/sabesp_rr/app/api_react/banco.php?matricula=${matricula}`,
        {
          method: "GET",
        }
      )
        .then((response) => {
          return response.json();
        })

        .then(async (response) => {
          const results = response;

          //   console.log(results.usuario);
          console.log("TESTE");

          if (results.usuario == undefined) {
            console.log(results.info);
            Alert.alert(
              "Erro",
              "Matrícula de usuário não encontrada, tente novamente",
              [
                {
                  text: "OK",
                  onPress: () => console.log("Erro ao entrar no aplicativo."),
                },
              ]
            );
          } else {
            //   console.log(results.usuario);
            let setor =
              results.usuario[0].setor == "RR"
                ? "RRDO2"
                : results.usuario[0].setor;

            console.log(results.usuario[0].usuario);
            console.log(results.usuario[0].nomecompleto);
            if (
              results.usuario[0].nomecompleto != undefined ||
              results.usuario[0].nomecompleto != null
            ) {
              await AsyncStorage.setItem(
                "completename",
                results.usuario[0].nomecompleto
              );
            } else {
              await AsyncStorage.setItem(
                "completename",
                results.usuario[0].usuario
              );
            }
            await AsyncStorage.setItem("user", results.usuario[0].usuario);
            await AsyncStorage.setItem("setor", setor);

            showToastWithGravity(
              `Bem vindo(a) ${results.usuario[0].usuario}`,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
            const complete_name =
              results.usuario[0].nomecompleto == null ||
              results.usuario[0].nomecompleto == undefined
                ? results.usuario[0].usuario
                : results.usuario[0].nomecompleto;
            props.navigation.navigate("tela_activity", {
              name: `${results.usuario[0].usuario}`,
              setor: `${setor}`,
              complete_name: `${complete_name}`,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          Alert.alert(
            "Erro",
            "Matrícula de usuário não encontrada, tente novamente",
            [
              {
                text: "OK",
                onPress: () => console.log("Erro ao entrar no aplicativo."),
              },
            ]
          );
        });
    }

    // await console.log(matricula);
  }

  return (
    <>
      <View
        style={{
          flex: 1,

          backgroundColor: "#fff",
          zIndex: 999,
          alignItems: "center",

          justifyContent: "center",
          gap: 10,
        }}
      >
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
            alignSelf: "center",
            height: 320,

            width: "100%",
          }}
        ></LinearGradient>
        <View
          style={{
            position: "absolute",
            top: "20%",
            fontSize: 20,

            backgroundColor: "#fff",

            zIndex: 0,
            alignSelf: "center",
            height: "100%",
            borderTopStartRadius: 450,
            width: "170%",
          }}
        ></View>

        <LinearGradient
          colors={[
            "rgba(30, 115, 201,1)",
            " rgba(70, 154, 240,1)",
            "rgba(46,134,223,1)",
          ]}
          style={{
            position: "absolute",
            height: 500,
            borderRadius: 200,
            bottom: -420,
            right: -170,
            width: "80%",
            backgroundColor: "#2e86df",
          }}
        ></LinearGradient>

        <StatusBar
          style={{
            backgroundColor: "black",
          }}
        />

        <Text
          style={{
            fontSize: 30,
          }}
        >
          LocalSIG Saneamento
        </Text>
        <Text style={Style.input_title}>
          Digite sua matrícula ou CPF {`\n`} abaixo para continuar.
        </Text>

        {/* <Madoka
        label={"Matrícula ou CPF"}
        // this is used as active and passive border color
        borderColor={"#a1a1a1"}
        inputPadding={8}
        labelHeight={24}
        onChangeText={(e) => set_matricula(e)}
        labelStyle={{ color: "#2e83ab" }}
        inputStyle={{ color: "#a1a1a1" }}
        style={{
          width: 200,
          marginBottom: 10,
        }}
      /> */}

        <TextInput
          placeholder="Matrícula ou CPF"
          onChangeText={(e) => set_matricula(e)}
          style={{
            padding: 8,
            paddingStart: 16,
            borderColor: "#e6e6e6",
            borderWidth: 2,
            width: "65%",
            fontSize: 18,
            backgroundColor: "#ebebeb",
            borderRadius: 5,
          }}
        ></TextInput>

        <TouchableOpacity
          style={[
            Style.button,
            {
              marginTop: 20,
            },
          ]}
          onPress={login}
          title="Entrar"
        >
          <Text style={Style.text}>Entrar</Text>
        </TouchableOpacity>

        {/* <Image
        style={{
          height: "12%",
          position: "absolute",
          width: "62%",
          bottom: 10,
          left: 20,
        }}
        source={require("../../assets/localsig.png")}
      /> */}

        <Image
          style={{
            position: "absolute",
            width: "42%",
            height: "22%",
            top: 0,
            left: 0,
          }}
          source={require("../../assets/localsigBranco.png")}
        />
      </View>
    </>
  );
};

// default significa que ele será importado com qualquer nome que seja
export default LoginView;
