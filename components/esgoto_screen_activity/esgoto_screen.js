import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ToastAndroid,
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
  Platform,
  ScrollView,
  SafeAreaView,
  I18nManager,
  Modal,
  TextInput,
  Pressable,
  Alert,
  Button,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from "@expo-google-fonts/roboto";

import Style from "./styles_tela_principal.js";
import {
  Button as BtnPaper,
  FAB,
  IconButton,
  Snackbar,
  AnimatedFAB,
} from "react-native-paper";
import { FloatingAction } from "react-native-floating-action";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, EvilIcons } from "@expo/vector-icons";

import _ from "lodash";

//IMPORT para pegar a LOCALIZAÇÃO (lat e long)
import * as Location from "expo-location";
//IMPORT para pegar a cidade (Reverse Geocoding a partir das lat e long)
import GeoCoding from "../../utils/reverse_geocoding.js";
import { useNetInfo } from "@react-native-community/netinfo";
import { uploadImages } from "../../utils/upload_bitmap.js";
import AppLoading from "expo-app-loading";

async function load_forms_vistoria() {
  let form_vistoria = await AsyncStorage.getItem("form_vistoria");
  return form_vistoria != null ? form_vistoria : {};
}

// console.log(await AsyncStorage.getItem("form_vistoria"));

const showToastWithGravity = (message) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER
  );
};

const TelaMain = ({
  navigation,
  route,
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
}) => {
  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const [isExtended, setIsExtended] = React.useState(false);
  const fabStyle = { [animateFrom]: 16 };

  const [bug_counter, setBugCounter] = React.useState(0);

  const [forms_vistoria, setForms_vistoria] = useState({});
  const [forms_fotos, setForms_fotos] = useState({});

  const [forms_macro, setForms_macro] = useState({});
  const [forms_fotos_macro, setForms_fotos_macro] = useState({});

  const [modal_form_name, setModalFormName] = useState({});
  const [modal_name, setModalName] = useState("");

  const [coords_, setCoords_] = useState({
    latitude: null,
    longitude: null,
    mun: null,
  });

  const connection = useNetInfo().isInternetReachable;

  /** SNACK BAR */
  const [visible_s, setVisible_s] = React.useState(false);
  const onToggleSnackBar = () => setVisible_s(!visible_s);
  const onDismissSnackBar = () => setVisible_s(false);

  useEffect(() => {
    AsyncStorage.getItem("form_vistoria").then((resp) =>
      resp != null ? setForms_vistoria(JSON.parse(resp)) : null
    );

    AsyncStorage.getItem("form_fotos").then((resp) =>
      resp != null ? setForms_fotos(JSON.parse(resp)) : null
    );

    AsyncStorage.getItem("form_macro").then((resp) =>
      resp != null ? setForms_macro(JSON.parse(resp)) : null
    );

    AsyncStorage.getItem("form_fotos_macro").then((resp) =>
      resp != null ? setForms_fotos_macro(JSON.parse(resp)) : null
    );

    async function startLocation() {
      await Location.enableNetworkProviderAsync();

      let coord = await Location.getCurrentPositionAsync({
        accuracy: 5,
      });
      let mun_ =
        connection == false
          ? await AsyncStorage.getItem("mun")
          : await GeoCoding(coord.coords.latitude, coord.coords.longitude);

      // Alert.alert(JSON.stringify(mun_));
      await AsyncStorage.setItem("mun", mun_);
      let coord_ = {
        latitude: coord.coords.latitude,
        longitude: coord.coords.longitude,
        mun: mun_,
      };

      setCoords_(coord_);
      console.log("\x1b[36m%s\x1b[0m", coords_); //cyan
    }
    startLocation();
  }, [connection, bug_counter]);

  function handle_esgoto_screen_no_coords(activity) {
    let qntd = bug_counter;

    if (qntd <= 2) {
      setBugCounter(qntd + 1);
      showToastWithGravity("Aguarde...");
    } else {
      click_activity(navigation, activity);
    }
  }

  async function click_activity(navigation, activity) {
    console.log("Testing...");

    switch (activity) {
      case "vistoria_eee":
        navigation.navigate("vistoria_eee", {
          name: route.params.name,
          setor: route.params.setor,
          mode: "create",
          latitude: coords_.latitude,
          longitude: coords_.longitude,
          mun: coords_.mun,
        });
        break;

      case "macromedidor":
        navigation.navigate("macromedidor", {
          name: route.params.name,
          setor: route.params.setor,
          mode: "create",
          latitude: coords_.latitude,
          longitude: coords_.longitude,
          mun: coords_.mun,
        });
        break;

      default:
        break;
    }
  }

  function edit_form(navigation, uuid, activity) {
    console.log("Testing...");
    setModalVisible(!modalVisible);
    switch (activity) {
      case "vistoria_eee":
        navigation.navigate("vistoria_eee", {
          name: route.params.name,
          setor: route.params.setor,
          mode: "edit",
          form: forms_vistoria[uuid],
          form_fotos: forms_fotos[uuid],
          id: uuid,
        });
        break;
      case "macromedidor":
        navigation.navigate("macromedidor", {
          name: route.params.name,
          setor: route.params.setor,
          mode: "edit",
          form: forms_macro[uuid],
          form_fotos: forms_fotos_macro[uuid],
          id: uuid,
        });
        break;
      default:
        break;
    }
  }

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  async function send_postdata(name) {
    switch (name) {
      case "vistoria_eee":
        const app_form = forms_vistoria;
        let photos = forms_fotos;
        if (await uploadImages(photos, route.params.setor, "apivistoria.php")) {
          console.log("Fotos enviadas com sucesso!");
        }

        // let final_form = _.merge(app_form, photos);
        let final_form = app_form;

        for (let key in final_form) {
          if (final_form.hasOwnProperty(key)) {
            for (let field in final_form[key]) {
              if (final_form.hasOwnProperty(key)) {
                let value = final_form[key][field];

                value =
                  typeof value == "boolean" && value == true ? "S" : value;
                value =
                  typeof value == "boolean" && value == false ? "N" : value;

                final_form[key][field] = value;
                // console.log(final_form[key][field]);
              }
            }
          }
        }

        // console.log(final_form);
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(final_form),
        };

        fetch(
          "https://localsig.com/sabesp_rr/app/api_react/crud_vistoria_eee/controller.php",
          requestOptions
        )
          .then((response) => response.json())
          .then(
            (data) => onToggleSnackBar(),
            await AsyncStorage.removeItem("form_vistoria"),
            await AsyncStorage.removeItem("form_fotos"),
            setForms_vistoria({})
          );

        break;
      case "macromedidor":
        const app_form_macro = forms_macro;
        let photos_macro = forms_fotos_macro;

        if (
          await uploadImages(
            photos_macro,
            route.params.setor,
            "apimacromedidor.php"
          )
        ) {
          console.log("Fotos enviadas com sucesso!");
        }

        // let final_form = _.merge(app_form, photos);

        const load_form = async () => {
          let final_form_macro = app_form_macro;
          let canEnd = false;
          counter = 0;
          total = Object.keys(final_form_macro).length;
          key = Object.entries(final_form_macro);
          for (let i = 0; i < total; i++) {
            console.log(key[i][1]);

            await fetch(
              `https://localsig.com/sabesp_rr/app/api_react/crud_macromedidor/controller.php?setorabast=${key[
                i
              ][1]["setorabast"].replace(/ /g, "+")}`
            )
              .then((response) => response.json())
              .then(function (data) {
                console.log(data);
                if (data[0].leitura !== undefined && data[0].leitura !== null) {
                  const leitura_anterior = data[0].leitura;
                  const leitura_atual = final_form_macro[key[i][0]]["leitura"];
                  const data_atual = new Date(
                    final_form_macro[key[i][0]]["data"]
                  );
                  const data_anterior = new Date(data[0].data);
                  let difference =
                    data_atual.getTime() - data_anterior.getTime();
                  difference = Math.round(difference / (1000 * 3600 * 24));
                  // console.log(data);
                  console.log(
                    `Leitura Anterior: ${leitura_anterior}, Leitura Atual: ${leitura_atual}`
                  );
                  // console.log(difference);
                  let volume =
                    difference == 0
                      ? leitura_atual - leitura_anterior
                      : (leitura_atual - leitura_anterior) / difference;

                  final_form_macro[key[i][0]]["volume"] = volume;
                  console.log(final_form_macro[key[i][0]]["volume"]);
                } else {
                  console.log(
                    `O array atual não contém um setor de abastecimento anterior, volume não será calculado`
                  );
                }
              })
              .catch(function (err) {
                console.error(
                  "Deu erro no fetch entre formulários:" +
                    JSON.stringify(err) +
                    ": " +
                    JSON.stringify(err.message)
                );
              })
              .finally(function () {
                counter++;

                if (total == counter) {
                  console.log(
                    "Total: " + total + " (counter: " + counter + ")"
                  );
                  canEnd = true;
                }
              });
          }

          /*
          for (let key in final_form_macro) {
            fetch(
              `https://localsig.com/sabesp_rr/app/api_react/crud_macromedidor/controller.php?setorabast=${final_form_macro[
                key
              ]["setorabast"].replace(/ /g, "+")}`
            )
              .then((response) => response.json())
              .then(function (data) {
                console.log(data);
                if (data[0].leitura !== undefined && data[0].leitura !== null) {
                  const leitura_anterior = data[0].leitura;
                  const leitura_atual = final_form_macro[key]["leitura"];
                  const data_atual = new Date(final_form_macro[key]["data"]);
                  const data_anterior = new Date(data[0].data);
                  let difference =
                    data_atual.getTime() - data_anterior.getTime();
                  difference = Math.round(difference / (1000 * 3600 * 24));
                  // console.log(data);
                  console.log(
                    `Leitura Anterior: ${leitura_anterior}, Leitura Atual: ${leitura_atual}`
                  );
                  // console.log(difference);
                  let volume =
                    difference == 0
                      ? leitura_atual - leitura_anterior
                      : (leitura_atual - leitura_anterior) / difference;

                  final_form_macro[key]["volume"] = volume;
                  console.log(final_form_macro[key]["volume"]);
                } else {
                  console.log(
                    `O array atual não contém um setor de abastecimento anterior, volume não será calculado`
                  );
                }
              })
              .catch(function (err) {
                console.error(
                  "Deu erro no fetch entre formulários:" +
                    JSON.stringify(err) +
                    ": " +
                    JSON.stringify(err.message)
                );
              })
              .finally(function () {
                counter++;

                if (total == counter) {
                  console.log(
                    "Total: " + total + " (counter: " + counter + ")"
                  );
                  canEnd = true;
                }
              });
          }
*/
          /*
          if (canEnd == true) {
            console.log("CanEnd is true");
            return final_form_macro;
          } else {
            console.log("CanEnd is false");

            await new Promise((resolve) => setInterval(resolve, 1000));

            return final_form_macro;
          
          }

          */

          return await final_form_macro;
        };
        let final_form_macro = await load_form();

        console.log("Final form macro: " + JSON.stringify(final_form_macro));

        /*
        for (const [key, form] of Object.entries(req.body)) {
          console.log(form);
        }
        */

        const requestOptions_macro = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(final_form_macro),
        };

        fetch(
          "https://localsig.com/sabesp_rr/app/api_react/crud_macromedidor/controller.php",
          requestOptions_macro
        )
          .then((response) => response.json())
          .then(
            (data) => onToggleSnackBar(),
            await AsyncStorage.removeItem("form_macro"),
            await AsyncStorage.removeItem("form_fotos_macro"),
            setForms_macro({}),
            setForms_fotos_macro({})
          );

        break;

      default:
        Alert.alert(
          "Atenção",
          "O método de sincronização para esse aplicativo ainda não foi desenvolvido.",
          [
            {
              text: "CANCELAR",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => console.log("INSPEÇÃO ETE SYNC ERROR"),
            },
          ]
        );

        break;
    }
  }

  function sync_database(name) {
    if (name == "vistoria_eee" || name == "macromedidor") {
      Alert.alert(
        "Aviso",
        "Certifique-se que possui uma boa conexão com a internet, em seguida, confirme a sincronização clicando em OK.",
        [
          {
            text: "CANCELAR",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => await send_postdata(name),
          },
        ]
      );
    }
  }

  function open_modal(name) {
    console.log(name);
    let form_ = null;
    switch (name) {
      case "vistoria_eee":
        form_ = forms_vistoria;
        setModalFormName(form_);
        setModalName(name);
        setModalVisible(!modalVisible);
        break;
      case "macromedidor":
        form_ = forms_macro;
        setModalFormName(form_);
        setModalName(name);
        setModalVisible(!modalVisible);
        break;
      default:
        console.log("Aplicativo não desenvolvido ainda: " + name);
        break;
    }
  }

  const actions = [
    {
      text: "Macromedidores",
      icon: (
        <>
          <MaterialCommunityIcons
            name="pipe-valve"
            color="#609966"
            size={25}
          ></MaterialCommunityIcons>
        </>
      ),
      textColor: "#609966",
      color: "#EDF1D6",
      textBackgroundColor: "transparent",

      name: "macromedidor",
      position: 3,
    },
    {
      text: "Vistoria de EEE",
      icon: (
        <>
          <MaterialCommunityIcons
            name="water-well"
            color="#609966"
            size={25}
          ></MaterialCommunityIcons>
        </>
      ),
      textColor: "#609966",
      color: "#EDF1D6",
      textBackgroundColor: "transparent",

      name: "vistoria_eee",
      position: 2,
    },

    {
      text: "Inspeção de ETE",
      icon: (
        <>
          <MaterialCommunityIcons
            name="pipe"
            color="#609966"
            size={25}
          ></MaterialCommunityIcons>
        </>
      ),
      textColor: "#609966",
      color: "#EDF1D6",

      textBackgroundColor: "transparent",

      name: "inspecao_ete",
      position: 1,
    },
  ];

  const edits = [
    {
      text: "Macromedidores",
      icon: (
        <>
          <MaterialCommunityIcons
            name="pipe-valve"
            color="#609966"
            size={25}
          ></MaterialCommunityIcons>
        </>
      ),
      textColor: "#609966",
      color: "#EDF1D6",
      textBackgroundColor: "transparent",

      name: "macromedidor",
      position: 3,
    },
    {
      text: "Vistoria de EEE",
      icon: (
        <>
          <MaterialCommunityIcons
            name="water-well"
            color="#609966"
            size={25}
          ></MaterialCommunityIcons>
        </>
      ),
      textColor: "#609966",
      color: "#EDF1D6",
      textBackgroundColor: "transparent",

      name: "vistoria_eee",
      position: 2,
    },

    {
      text: "Inspeção de ETE",
      icon: (
        <>
          <MaterialCommunityIcons
            name="pipe"
            color="#609966"
            size={25}
          ></MaterialCommunityIcons>
        </>
      ),
      textColor: "#609966",
      color: "#EDF1D6",

      textBackgroundColor: "transparent",

      name: "inspecao_ete",
      position: 1,
    },
  ];

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View
        style={[
          Style.container,
          {
            alignItems: "center",
            justifyContent: "flex-start",
          },
        ]}
      >
        {/* Modal que só vai aparecer quando o usuário clicar para editar */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={Style.centeredView}>
            <View style={Style.modalView}>
              <Text
                style={{
                  position: "absolute",
                  top: 10,
                  fontFamily: "Roboto_500Medium",
                  fontSize: 28,
                  letterSpacing: -1,
                  color: "#609966",
                }}
              >
                {modal_name == "macromedidor"
                  ? "Macromedidores"
                  : "Vistorias EEE"}
              </Text>
              <IconButton
                icon="close"
                style={{
                  backgroundColor: "#EDF1D6",
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 0,
                  borderBottomEndRadius: 0,
                  borderBottomStartRadius: 10,

                  marginTop: -35,
                  marginRight: -35,
                  alignSelf: "flex-end",
                  right: 0,
                  marginBottom: 10,
                }}
                iconColor="#609966"
                size={25}
                mode="contained"
                onPress={() => setModalVisible(!modalVisible)}
              />

              <ScrollView
                contentContainerStyle={{
                  width: "100%",
                }}
              >
                {Object.entries(modal_form_name).map((card_form) => (
                  <View
                    style={{
                      backgroundColor: "#EDF1D6",
                      padding: 20,
                      borderRadius: 30,
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 20,
                        marginBottom: 10,

                        justifyContent: "space-around",
                      }}
                    >
                      <Text
                        style={{
                          color: "#609966",
                          fontWeight: "bold",
                        }}
                      >
                        DATA:{" "}
                        {new Date(
                          modal_form_name[card_form[0]].data
                        ).getDate() +
                          "/" +
                          (new Date(
                            modal_form_name[card_form[0]].data
                          ).getMonth() +
                            1) +
                          "/" +
                          new Date(
                            modal_form_name[card_form[0]].data
                          ).getFullYear()}
                      </Text>

                      <Text
                        numberOfLines={1}
                        style={{
                          color: "#609966",
                          fontWeight: "bold",
                        }}
                      >
                        {modal_name == "macromedidor"
                          ? modal_form_name[card_form[0]].setorabast
                          : modal_name == "vistoria_eee"
                          ? modal_form_name[card_form[0]].nome_eee
                          : "Inspeção ETE"}
                      </Text>
                    </View>

                    <BtnPaper
                      mode="contained"
                      style={{
                        borderRadius: 10,
                        backgroundColor: "#609966",
                      }}
                      onPress={() =>
                        edit_form(navigation, card_form[0], modal_name)
                      }
                    >
                      EDITAR FORMULÁRIO
                    </BtnPaper>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View
          style={{
            top: 0,
            height: 100,
            marginBottom: 0,
            backgroundColor: "#609966",
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "#FFFF",
              alignSelf: "center",
              marginTop: 35,
              fontWeight: "bold",
              fontFamily: "Roboto_500Medium",
              fontSize: 24,
            }}
          >
            ESGOTO
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            gap: 120,
            marginTop: 40,
            height: 50,
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              gap: 0,
            }}
          >
            {(coords_.mun != null && connection) || !connection ? (
              <IconButton
                icon="water-well"
                mode="contained"
                style={{
                  backgroundColor: "#EDF1D6",
                  borderRadius: 10,
                }}
                size={48}
                iconColor="#609966"
                onPress={() => click_activity(navigation, "vistoria_eee")}
                textColor="#fff"
              ></IconButton>
            ) : (
              <IconButton
                icon="water-well"
                mode="contained"
                style={{
                  backgroundColor: "#EDF1D6",
                  borderRadius: 10,
                }}
                size={48}
                iconColor="#609966"
                onPress={() => handle_esgoto_screen_no_coords()}
                textColor="#fff"
              ></IconButton>
            )}

            <Text
              style={{
                marginLeft: 0,
                color: "#609966",
              }}
            >
              Vistoria de EEE
            </Text>
          </View>
          <View>
            <IconButton
              disabled
              icon="pipe"
              mode="contained"
              style={{
                backgroundColor: "#EDF1D6",
                borderRadius: 10,
              }}
              size={48}
              iconColor="#609966"
              onPress={() => console.log("Teste INSPEÇÃO DE ETE")}
              textColor="#fff"
            ></IconButton>

            <Text
              style={{
                marginLeft: -10,
                color: "#609966",
              }}
            >
              Inspeção de ETE
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 40,
            gap: 20,
          }}
        >
          {/* View relacionada aos botões de formulários preenchidos de vistoria de EEE */}
          {/*  <View>
            {Object.entries(forms_vistoria).map((card_vistoria) => (
              <BtnPaper
                mode="outlined"
                style={{
                  borderRadius: 10,
                }}
                onPress={() =>
                  edit_form(navigation, card_vistoria[0], "vistoria_eee")
                }
              >
                EDITAR VISTORIA EEE
              </BtnPaper>
            ))}
          </View>  */}

          {/* View relacionada aos botões de formulários preenchidos de Inspeção de ETE */}
          {/* <View>
            <BtnPaper
              disabled
              mode="outlined"
              style={{
                borderRadius: 10,
              }}
              onPress={() => console.log("Teste editar inspeção ete")}
            >
              EDITAR INSPEÇÃO ETE
            </BtnPaper>
          </View> */}
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 80,
            right: 4,
          }}
        >
          <FloatingAction
            actions={edits}
            disabled={true}
            position="right"
            floatingIcon={
              <MaterialCommunityIcons
                name="file-document-edit"
                size={35}
                color="#609966"
              ></MaterialCommunityIcons>
            }
            color="#EDF1D6"
            style={{
              zIndex: 999999,
              backgroundColor: "green",
            }}
            onPressItem={(name) => {
              open_modal(name);
            }}
          />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 8,
            right: 4,
          }}
        >
          <FloatingAction
            actions={actions}
            position="right"
            floatingIcon={
              <MaterialCommunityIcons
                name="cloud-sync"
                size={35}
                color="#609966"
              ></MaterialCommunityIcons>
            }
            color="#EDF1D6"
            style={{
              zIndex: 999999,
              backgroundColor: "green",
            }}
            onPressItem={(name) => {
              sync_database(name);
            }}
          />
        </View>

        {/* View relacionada ao botão MACROMEDIDOR */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            zIndex: -1,
            gap: 120,
            marginTop: 40,
            height: 50,
            alignContent: "center",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              marginLeft: 50,
              gap: 0,
            }}
          >
            {(coords_.mun != null && connection) || !connection ? (
              <IconButton
                icon="pipe-valve"
                mode="contained"
                style={{
                  backgroundColor: "#EDF1D6",
                  borderRadius: 10,
                }}
                size={48}
                iconColor="#609966"
                onPress={() => click_activity(navigation, "macromedidor")}
                textColor="#fff"
              ></IconButton>
            ) : (
              <IconButton
                icon="pipe-valve"
                mode="contained"
                style={{
                  backgroundColor: "#EDF1D6",
                  borderRadius: 10,
                }}
                size={48}
                iconColor="#609966"
                onPress={() => console.log("Teste macromedidores")}
                textColor="#fff"
              ></IconButton>
            )}

            <Text
              style={{
                marginLeft: 0,
                color: "#609966",
              }}
            >
              Macromedidores
            </Text>
          </View>
        </View>
        {/* View relacionada aos botões de formulários preenchidos de vistoria de EEE */}
        {/*    <View
          style={{
            margin: 30,
            zIndex: -1,
          }}
        >
          {Object.entries(forms_macro).map((card_macro) => (
            <BtnPaper
              mode="outlined"
              style={{
                borderRadius: 10,
              }}
              onPress={() =>
                edit_form(navigation, card_macro[0], "macromedidor")
              }
            >
              EDITAR MACROMEDIDOR
            </BtnPaper>
          ))}
        </View> */}

        <Snackbar
          visible={visible_s}
          onDismiss={onDismissSnackBar}
          action={{
            label: "FECHAR",
            onPress: () => {
              onDismissSnackBar;
            },
          }}
        >
          Dados enviados com sucesso.
        </Snackbar>
      </View>
    );
  }
};

export default TelaMain;
