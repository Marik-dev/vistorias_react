import React, { useCallback, useEffect, useState } from "react";
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
  TextInput,
  Alert,
  Button,
  BackHandler,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
} from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../../utils/format_date.js";
import Style from "./macro_styles.js";
import {
  Button as BtnPaper,
  FAB,
  IconButton,
  Snackbar,
  AnimatedFAB,
  MD2Colors,
} from "react-native-paper";
import { FloatingAction } from "react-native-floating-action";
import { setores_abastecimento, getSetores } from "./setores_abastecimento.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MaterialCommunityIcons,
  EvilIcons,
  Ionicons,
} from "@expo/vector-icons";
import uuid from "react-native-uuid";
import _ from "lodash";
import { Fontisto, FontAwesome5, Entypo } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
//Importando a câmera
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import AppLoading from "expo-app-loading";
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

import DropDownPicker from "react-native-dropdown-picker";
import { fields } from "./fields.js";
import { moveSyntheticComments } from "typescript";

const Macro_View = ({ navigation, route }) => {
  const [setores_abastecimento_2, set_setores_abastecimento_2] = useState(
    setores_abastecimento
  );

  const [needPhotoUpload, set_needPhotoUpload] = useState(false);
  const showToastWithGravity = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  useEffect(() => {
    fetch(
      "https://localsig.com/sabesp_rr/app/api_react/macromedidor/setores_abastecimento.php",
      {
        method: "GET",
      }
    )
      .then((f) => f.json())
      .then((res) => {
        let setores_abastecimento_fetch = res;
        // showToastWithGravity("Fullfilled");
        console.log("Fullfilled");
        AsyncStorage.setItem(
          "setores_abastecimento",
          JSON.stringify(setores_abastecimento_fetch)
        );
        return set_setores_abastecimento_2(setores_abastecimento_fetch);
      })
      .catch((e) => {
        console.log("Deu erro no fetch dos setores");
        // showToastWithGravity("Deu erro no fetch dos setores, usando offline");

        return AsyncStorage.getItem("setores_abastecimento").then((value) => {
          set_setores_abastecimento_2(JSON.parse(value));
        });
      })
      .then(() => console.log("Terminou o fetch;"));
  }, []);

  const [UUID, setUUID] = useState(
    route.params.mode == "create" ? uuid.v4() : route.params.id
  );

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

  useEffect(() => {
    const backAction = () => {
      /*
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      */

      if (
        startCamera == true ||
        previewVisible == true ||
        capturedImage != null
      ) {
        setStartCamera(false);
        setPreviewVisible(false);
        setCapturedImage(null);
      } else {
        navigation.goBack();
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  /** SNACK BAR */
  const [visible_s, setVisible_s] = React.useState(false);
  const onToggleSnackBar = () => setVisible_s(!visible_s);
  const onDismissSnackBar = () => setVisible_s(false);

  // USE STATE PARA A CAMERA
  const [startCamera, setStartCamera] = React.useState(false);
  // Use states para os URIS da camera
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  let [photoBeingTaken, setPhotoBeingTaken] = useState(null);

  // Métodos da câmera

  const __startCamera = async (input_assoc) => {
    console.log("Starting camera");

    //setando qual foto está sendo salva
    setPhotoBeingTaken(input_assoc);

    const { status } = await Camera.requestCameraPermissionsAsync();

    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();

    if (status === "granted") {
      console.log("Granted camera permission");
      setStartCamera(true);
    } else {
      Alert.alert("Aviso", "O acesso para a câmera foi negado.");
    }
  };

  let camera;

  const handle_photoInput = (field, value) => {
    const copy_form = { ...form_photos };
    copy_form[field] = value;
    setForm_photos(copy_form);
    console.log(JSON.stringify(copy_form));
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };
  const __savePhoto = async (capturedImage) => {
    await setCapturedImage(capturedImage);

    const asset = await MediaLibrary.createAssetAsync(capturedImage);
    console.log("DWQIDJQWOIDWJQIODWQDW: + " + asset.filename, asset.uri);

    handle_RadioInput(photoBeingTaken, asset.filename);
    handle_photoInput(photoBeingTaken, asset.uri);
    console.log(capturedImage);
    setPreviewVisible(false);
    setStartCamera(false);
  };
  const __takePicture = async () => {
    console.log("TakePicture");
    if (!camera) return;
    const options = { quality: 0.5, base64: true, skipProcessing: true };
    const photo = await camera.takePictureAsync(options);
    console.log(photo);
    setPreviewVisible(true);
    await setCapturedImage(photo);
  };

  function cameraView() {
    console.log(
      `previewVisible: ${previewVisible}`,
      `capturedImage: ${capturedImage}`
    );
    return previewVisible == true && typeof capturedImage == "object" ? (
      <CameraPreview
        photo={capturedImage}
        savePhoto={"capturedImage"}
        retakePicture={"capturedImage"}
      />
    ) : (
      <>
        {console.log()}

        <Camera
          style={{ flex: 1 }}
          ref={(r) => {
            camera = r;
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                position: "absolute",
                bottom: 0,
                flexDirection: "row",
                flex: 1,
                width: "100%",
                padding: 20,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <FAB
                  icon="camera-iris"
                  customSize={60}
                  labelStyle={{ fontSize: 50 }}
                  onPress={async () => await __takePicture()}
                  style={{
                    backgroundColor: "#59caff",
                    color: "#fff",
                    borderRadius: 50,
                  }}
                  theme={{
                    colors: {
                      primary: "#2e83ab",
                      secondary: "#fff",
                    },
                  }}
                  color="#fff"
                ></FAB>
              </View>
            </View>
          </View>
        </Camera>
      </>
    );
  }

  const CameraPreview = ({ photo }) => {
    console.log("CameraPreview");
    return (
      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "column",

          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <ImageBackground
          source={{ uri: photo && photo.uri }}
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              // backgroundColor: "white",
              paddingTop: 20,
              paddingBottom: 20,
              marginTop: "auto",
            }}
          >
            <BtnPaper
              mode="contained"
              icon="camera-retake"
              style={{
                width: 180,
                marginTop: "auto",
                marginRight: "auto",
                marginLeft: "auto",
              }}
              theme={{
                colors: {
                  primary: "#2e83ab",
                },
              }}
              onPress={() => __retakePicture(photo.uri)}
            >
              TIRAR OUTRA FOTO
            </BtnPaper>

            <BtnPaper
              mode="contained"
              icon="content-save-check"
              style={{
                width: 150,
                marginTop: "auto",
                marginRight: "auto",
                marginLeft: "auto",
              }}
              theme={{
                colors: {
                  primary: "#2e83ab",
                },
              }}
              onPress={() => __savePhoto(photo.uri)}
            >
              SALVAR FOTO
            </BtnPaper>
          </View>
        </ImageBackground>
      </View>
    );
  };

  // Use states para os radiogroups
  const [form, setForm] = useState(
    route.params.mode == "edit"
      ? { ...route.params.form }
      : {
          uuid: UUID,
          data:
            new Date().getFullYear() +
            "-" +
            new Date().getMonth() +
            "-" +
            new Date().getDate(),
          hora:
            new Date().getHours() +
            ":" +
            new Date().getMinutes() +
            ":" +
            new Date().getSeconds(),
          usuario: route.params.name,
          coord_lat: route.params.latitude,
          coord_long: route.params.longitude,
          municipio: route.params.mun.toUpperCase(),
          leitura: null,
          vazao_inst: null,
          setorabast: null,
          setor: route.params.setor,
          img: null,
          horimetro: null,
        }
  );
  // Use states para as fotos
  const [form_photos, setForm_photos] = useState(
    route.params.mode == "edit"
      ? { ...route.params.form_fotos }
      : {
          uuid: UUID,
        }
  );

  const [isSettingData, set_is_SettingData] = useState(false);
  const [isSettingHora, set_is_SettingHora] = useState(false);
  const [date, setDate] = useState(() => {
    if (route.params.mode == "create") {
      let data_f = new Date();
      /*
      let hora_f = new Date();

      data_f =
        data_f.getFullYear() +
        "-" +
        (data_f.getMonth() + 1) +
        "-" +
        data_f.getDate() +
        " " +
        hora_f.getHours() +
        ":" +
        hora_f.getMinutes() +
        ":" +
        hora_f.getSeconds();
        */
      return data_f;
    } else {
      let data_f = new Date(form.data);
      /*
      let hora_f = new Date(form.hora);
      data_f =
        data_f.getFullYear() +
        "-" +
        (data_f.getMonth() + 1) +
        "-" +
        data_f.getDate() +
        " " +
        hora_f.getHours() +
        ":" +
        hora_f.getMinutes() +
        ":" +
        hora_f.getSeconds();
*/
      return data_f;
    }
  });
  const [hora, setHora] = useState(() => {
    if (route.params.mode == "create") {
      let data_f = new Date();
      let hora_f = new Date();
      /*
      data_f =
        data_f.getFullYear() +
        "-" +
        (data_f.getMonth() + 1) +
        "-" +
        data_f.getDate() +
        " " +
        hora_f.getHours() +
        ":" +
        hora_f.getMinutes() +
        ":" +
        hora_f.getSeconds();
        */
      return data_f;
    } else {
      let data_f = new Date(form.data);

      let new_hour =
        data_f.getFullYear() +
        "-" +
        (data_f.getMonth() + 1) +
        "-" +
        data_f.getDate() +
        " " +
        form.hora;

      let hora_f = new Date(new_hour);

      return hora_f;
    }
  });

  const [null_required_fields, setNull_required_fields] = useState([]);
  const [value, setValue] = useState(null);

  const [open, setOpen] = useState(false);
  const [horimetro, setHorimetro] = useState("0");

  const [items, setItems] = useState([{ label: "", value: "" }]);

  const [value_mun, setValue_mun] = useState(
    connection == true &&
      route.params.mun != null &&
      route.params.mun != undefined &&
      route.params.mode != "edit"
      ? route.params.mun.toUpperCase()
      : null
  );
  const [open_mun, setOpen_mun] = useState(false);

  const netInfo = useNetInfo();
  const connection = netInfo.isConnected;

  const handle_RadioInput = (field, value) => {
    if (
      (field == "municipio" || field == "macromedidor") &&
      route.params.mode == "edit"
    ) {
      return;
    }
    const copy_form = { ...form };
    copy_form[field] = value;
    if (field == "setorabast") {
      setores_abastecimento_2.macromedidores.map(function (item) {
        if (item["setorabast"] == value) {
          console.log(item["diff"]);
          if (item["diff"] >= 30) {
            set_needPhotoUpload(true);
          } else {
            set_needPhotoUpload(false);
          }

          setHorimetro(item["horimetro"]);
          console.log("HORIMETRO: " + item["horimetro"]);
        }
      });
    }

    setForm(copy_form);

    const copy_null_required_fields = [...null_required_fields];

    if (value != null) {
      for (let i = 0; i < copy_null_required_fields.length; i++) {
        if (copy_null_required_fields[i] == field) {
          copy_null_required_fields.splice(i, 1);
          i--;
        }
      }
    }

    setNull_required_fields(copy_null_required_fields);

    console.log(JSON.stringify(copy_form));
    // console.log(JSON.stringify(copy_null_required_fields));
  };

  const handle_setDate = (event, date) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;

    set_is_SettingData(false);
    setDate(date);
    let data_f = new Date(date);
    let hora_f = new Date(hora);

    data_f =
      data_f.getFullYear() +
      "-" +
      (data_f.getMonth() + 1) +
      "-" +
      data_f.getDate() +
      " " +
      hora_f.getHours() +
      ":" +
      hora_f.getMinutes() +
      ":" +
      hora_f.getSeconds();
    handle_RadioInput("data", data_f);
  };

  const handle_setHour = (event, date) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;

    set_is_SettingHora(false);
    setHora(date);
    let data_f = new Date(date);
    data_f =
      data_f.getHours() + ":" + data_f.getMinutes() + ":" + data_f.getSeconds();
    handle_RadioInput("hora", data_f);
  };

  async function salvar_formularios() {
    let forms_off =
      JSON.parse(await AsyncStorage.getItem("form_macro")) != null
        ? JSON.parse(await AsyncStorage.getItem("form_macro"))
        : {};
    let forms_off_fotos =
      JSON.parse(await AsyncStorage.getItem("form_fotos_macro")) != null
        ? JSON.parse(await AsyncStorage.getItem("form_fotos_macro"))
        : {};

    message = "";

    let nao_preenchidos = [];
    for (const chave in form) {
      if (Object.hasOwnProperty.call(form, chave)) {
        const element = form[chave];
        // console.log("Element: " + element);
        console.log(chave);
        if (chave == "horimetro") {
          if (element == null && horimetro == "1") {
            message += `${chave} está vazio(a) \n`;
            nao_preenchidos.push(chave);
          }
        } else if (chave == "img") {
          if (needPhotoUpload) {
            nao_preenchidos.push(chave);
          } else {
            console.log(
              "Foto não obrigatória, pois o último registro foi entre 30 dias."
            );
          }
        } else {
          if (element == null) {
            message += `${chave} está vazio(a) \n`;
            nao_preenchidos.push(chave);
          }
        }
      }
    }

    setNull_required_fields(nao_preenchidos);
    if (nao_preenchidos.length > 0) {
      return Alert.alert(
        "Atenção",
        "Preencha todos os campos marcados como * em vermelho. ",
        [
          {
            text: "CANCELAR",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () =>
              console.log(
                "Preenchendo todos os campos marcados como * em vermelho. "
              ),
          },
        ]
      );
    }

    forms_off[form.uuid] = form;
    forms_off_fotos[form_photos.uuid] = form_photos;

    await AsyncStorage.setItem("form_macro", JSON.stringify(forms_off));
    await AsyncStorage.setItem(
      "form_fotos_macro",
      JSON.stringify(forms_off_fotos)
    );

    console.log(
      "======================= RESULTADOS ============================="
    );

    console.log(message);
    console.log(JSON.parse(await AsyncStorage.getItem("form_macro")));
    console.log(JSON.parse(await AsyncStorage.getItem("form_fotos_macro")));

    onToggleSnackBar();
  }

  useEffect(() => {
    if (connection == false) {
      // Alert.alert("Sem internet, usando o array de municípios em cache");s

      // console.log(await AsyncStorage.getItem(route.params.mun));
      if (route.params.mode == "edit") {
        setValue(form.setorabast);
      }

      const municipio_promise =
        route.params.mode == "create" ? route.params.mun : form.municipio;
      showToastWithGravity(municipio_promise); //cyan
      let municipio_off =
        value_mun == null ? municipio_promise.toUpperCase() : value_mun;

      // Alert.alert(JSON.stringify(municipio_off));
      // console.log(form);

      let teste = [];
      let results = null;

      if (route.params.mode == "create") {
        results = value_mun == null ? municipio_off : value_mun;
      } else {
        results = value_mun == null ? form.municipio : value_mun;
      }

      if (municipio_off == "SÃO LOURENÇO DA SERRA") {
        municipio_off = "SÃO LOURENÇO";
      }
      setores_abastecimento_2.macromedidores.map(function (item) {
        if (item["municipio"] == municipio_off) {
          teste.push({
            label: item["setorabast"],
            value: item["setorabast"],
          });
        }
      });

      // console.log("\x1b[36m%s\x1b[0m", form); //cyan

      // console.log(results);

      // console.log(results.estacoes);

      // console.log(setores_array);

      setItems(teste);
    } else if (connection == true) {
      async function fetchData() {
        // console.log("\x1b[36m%s\x1b[0m", form); //cyan
        let value_mun_ =
          route.params.mode == "create" ? value_mun : form.municipio;

        if (route.params.mode == "edit") {
          setValue(form.setorabast);
        }

        if (value_mun_ == null) {
          value_mun_ = await AsyncStorage.getItem("mun");
        }

        const mun_ =
          value_mun == null && route.params.mode != "edit"
            ? route.params.mun.toUpperCase()
            : value_mun_.toUpperCase();

        let teste = [];
        let mun;
        mun = mun_.toUpperCase();
        if (mun == "SÃO LOURENÇO DA SERRA") {
          mun = "SÃO LOURENÇO";
        }
        setores_abastecimento_2.macromedidores
          .filter((item) => item["municipio"] == mun)
          .map(function (item) {
            teste.push({
              label: item["setorabast"],
              value: item["setorabast"],
            });

            return setItems(teste);
            //   return item["estacao"];
          });
      }
      fetchData();
    }
  }, [connection, value_mun, setores_abastecimento_2]);

  function verify_required(field) {
    if (field == "horimetro") {
      if (horimetro == "1" && null_required_fields.includes(field)) {
        return <Text style={{ color: "red" }}>*</Text>;
      }
    } else {
      if (null_required_fields.includes(field)) {
        return <Text style={{ color: "red" }}>*</Text>;
      }
    }
  }

  if (!fontsLoaded || !setores_abastecimento_2) {
    return <AppLoading />;
  } else {
    return startCamera ? (
      cameraView()
    ) : (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff", alignItems: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <View
          style={{
            backgroundColor: "#609966",
            width: "100%",
            height: 100,
            position: "absolute",
          }}
        ></View>

        <View
          style={{
            width: "100%",
            height: 100,

            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              color: "#EFEFEF",
              alignSelf: "center",
              fontFamily: "Roboto_400Regular",
            }}
          >
            CADASTRAR NOVA MEDIÇÃO
          </Text>
        </View>

        {/* White block */}
        <View
          style={{
            width: "100%",

            paddingTop: 20,
            paddingBottom: 10,
            gap: 10,
            marginBottom: 0,
          }}
        >
          <View
            style={{
              width: "100%",
              alignContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
                gap: 30,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: "#000",
                    verticalAlign: "middle",
                    height: 45,
                    width: 160,

                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,

                    paddingBottom: 5,
                    fontSize: 16,
                    borderRadius: 10,
                  }}
                >
                  {formatDate(date)}
                </Text>
                <TouchableOpacity
                  style={[
                    Style.button,
                    {
                      marginLeft: 110,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      marginBottom: 0,
                      height: 45,
                      width: 50,
                    },
                  ]}
                  title="BOTAO DATA"
                  onPress={function () {
                    set_is_SettingData(true);
                  }}
                >
                  <Fontisto name="date" size={28} color="#fff"></Fontisto>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: "#000",
                    verticalAlign: "middle",
                    height: 45,
                    width: 140,
                    marginLeft: 15,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,

                    paddingBottom: 5,
                    fontSize: 16,
                    borderRadius: 10,
                  }}
                >
                  {hora.getHours() +
                    ":" +
                    hora.getUTCMinutes() +
                    ":" +
                    hora.getUTCSeconds()}
                </Text>
                <TouchableOpacity
                  style={[
                    Style.button,
                    {
                      marginLeft: 110,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      marginBottom: 0,
                      height: 45,
                      width: 50,
                    },
                  ]}
                  title="BOTAO HORA"
                  onPress={function () {
                    set_is_SettingHora(true);
                  }}
                >
                  <FontAwesome5
                    name="clock"
                    size={28}
                    color="#fff"
                  ></FontAwesome5>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <DropDownPicker
              style={{
                width: "80%",
                alignSelf: "center",
                marginTop: 10,
                elevation: 2,
              }}
              placeholder={`Selecione um setor de abastecimento`}
              searchable={true}
              open={open}
              value={value}
              items={items}
              autoScroll={true}
              onChangeValue={(value) => handle_RadioInput("setorabast", value)}
              language="PT"
              translation={{
                PLACEHOLDER: `Selecione um setor de abastecimento`,
                SEARCH_PLACEHOLDER: "Digite o setor a ser filtrado", // See below for advanced options
                NOTHING_TO_SHOW: "Nenhuma setor de abastecimento encontrado.",
              }}
              listMode="MODAL"
              theme="LIGHT"
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              maxHeight={200}
            />
            <Text style={{ position: "absolute", top: 25, right: 100 }}>
              {verify_required("setorabast")}
            </Text>
          </View>

          {isSettingData ? (
            <DateTimePicker
              onChange={handle_setDate}
              value={date}
              mode="date"
            />
          ) : null}
          {isSettingHora ? (
            <DateTimePicker
              onChange={handle_setHour}
              value={hora}
              mode="time"
            />
          ) : null}
          {[
            fields
              .filter((input) => input.type == "text")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    placeholder={input.label}
                    keyboardType="numeric"
                    onChangeText={(e) => handle_RadioInput(input.field, e)}
                    style={{
                      padding: 8,
                      alignSelf: "center",
                      paddingStart: 16,
                      borderColor: "#e6e6e6",
                      borderWidth: 2,
                      width: "65%",
                      fontSize: 14,
                      backgroundColor: "#ebebeb",
                      borderRadius: 5,
                    }}
                  >
                    {form[input.field]}
                  </TextInput>

                  <Text
                    style={{
                      fontWeight: "bold",
                      margin: 5,

                      verticalAlign: "middle",
                    }}
                  >
                    {verify_required(input.field)}
                  </Text>
                </View>
              )),
            fields
              .filter((input) => input.type == "text_h" && horimetro == "1")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    placeholder={input.label}
                    keyboardType="numeric"
                    onChangeText={(e) => handle_RadioInput(input.field, e)}
                    style={{
                      padding: 8,
                      alignSelf: "center",
                      paddingStart: 16,
                      borderColor: "#e6e6e6",
                      borderWidth: 2,
                      width: "65%",
                      fontSize: 14,
                      backgroundColor: "#ebebeb",
                      borderRadius: 5,
                    }}
                  >
                    {form[input.field]}
                  </TextInput>
                  <Text
                    style={{
                      fontWeight: "bold",
                      margin: 5,

                      verticalAlign: "middle",
                    }}
                  >
                    {verify_required(input.field)}
                  </Text>
                </View>
              )),
          ]}
        </View>
        {/* BOTAO DE TIRAR FOTO */}
        {
          <View
            style={{
              flexDirection: "row",
              gap: 50,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 0,
              }}
            >
              <BtnPaper
                icon="camera"
                mode="outlined"
                onPress={() => __startCamera("img")}
                theme={{
                  colors: {
                    primary: "#609966",
                  },
                }}
              >
                {form["img"] != null ? "TIRAR OUTRA FOTO" : "TIRAR FOTO"}
              </BtnPaper>
              <Text
                style={{
                  marginLeft: -15,
                  alignSelf: "center",
                }}
              >
                {verify_required("img")}
              </Text>
            </View>
          </View>
        }

        {/* BOTAO DE SALVAR FORM E VOLTAR */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            gap: 50,
            position: "absolute",
            bottom: "2%",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <BtnPaper
            icon="arrow-left-thick"
            mode="elevated"
            theme={{
              colors: {
                primary: "#fff",
                secondary: "#609966",
              },
            }}
            style={{
              width: "30%",
              backgroundColor: "#609966",
            }}
            onPress={() => navigation.goBack()}
          >
            Voltar
          </BtnPaper>

          <BtnPaper
            icon="upload"
            mode="elevated"
            elevation={2}
            theme={{
              colors: {
                primary: "#fff",
                secondary: "#609966",
              },
            }}
            style={{
              width: "50%",

              backgroundColor: "#609966",
            }}
            onPress={async () => await salvar_formularios()}
          >
            Salvar Formulário
          </BtnPaper>
        </View>

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
          Formulário salvo com sucesso.
        </Snackbar>
      </KeyboardAvoidingView>
    );
  }
};

export default Macro_View;
