// import React in our code
import React, { useState, useEffect, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../../utils/format_date.js";
import * as MediaLibrary from "expo-media-library";
//Importando a câmera
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
// Importando os campos para popular o app

import {
  inputs_form_conj_moto_bomb,
  input_forms_bomba1,
  input_forms_bomba2,
  input_forms_bomba3,
  input_forms_cesto,
  input_forms_poco,
  input_forms_caixa_de_barrilhete,
  input_forms_area,
  input_forms_geral,
  input_forms_painel,
  input_forms_vandalismo_ou_furto,
  input_forms_observacoes,
} from "./fields.js";

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  View,
  Alert,
  Button,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import {
  Button as BtnPaper,
  TextInput,
  FAB,
  Chip,
  Snackbar,
  ProgressBar,
  MD3Colors,
} from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from "react-native-bouncy-checkbox-group";

import { Fontisto, FontAwesome5, Entypo } from "@expo/vector-icons";

//import SearchableDropdown component
import DropDownPicker from "react-native-dropdown-picker";

import { styles as Style } from "./styles_vistoria_eee.js";
import { setores_fields } from "./setores_fields.js";
import { eee_fields } from "./eee_fields.js";

const Vistoria_View = ({ navigation, route }) => {
  let preenchido = false;

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

  let btnRef = useRef();

  const [null_required_fields, setNull_required_fields] = useState([]);

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
  // AsyncStorage.clear();

  const [UUID, setUUID] = useState(
    route.params.mode == "create" ? uuid.v4() : route.params.id
  );

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
          responsave: route.params.name,
          coord_lat: route.params.latitude,
          coord_long: route.params.longitude,
          municipio: route.params.mun.toUpperCase(),
          ruido: null,
          op_manu: null,
          op_auto: null,
          tb_guia: null,
          est_cesto: null,
          material_a: null,
          cesto_tem_grade: null,
          grade_bom_estado: null,
          grade1_limpeza: null,
          grade2_limpeza: null,
          cesto_caixa_areia: null,
          caixa_limpeza: null,
          poco_limpeza: null,
          poco_tampa: null,
          barril_tampa: null,
          barril_tub: null,
          area_portoes: null,
          area_monovias: null,
          eee_extravasam: null,
          sensor_nc: null,
          painel_estado: null,
          painel_monitoramento: null,
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

  let testt = [
    {
      estacao: "EEE JD BRASIL I",
      latitude: "-24.510307",
      longitude: "-47.828365",
    },
  ];
  /**
   * Define local state for selected element
   */
  const [isSettingData, set_is_SettingData] = useState(false);
  const [isSettingHora, set_is_SettingHora] = useState(false);
  const [date, setDate] = useState(new Date());
  const [hora, setHora] = useState(new Date());

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const [open_mun, setOpen_mun] = useState(false);

  const [items, setItems] = useState([{ label: "", value: "" }]);

  const [items_mun, setItems_mun] = useState(
    setores_fields[route.params.setor]
  );

  // const connection = netInfo.isConnected;

  const [value_mun, setValue_mun] = useState(
    connection == true &&
      route.params.mun != null &&
      route.params.mun != undefined &&
      route.params.mode != "edit"
      ? route.params.mun
      : null
  );
  const netInfo = useNetInfo();
  const connection = netInfo.isConnected;
  // Alert.alert(value_mun);
  // Alert.alert(JSON.stringify(route.params.setor));

  useEffect(() => {
    if (connection == false) {
      // Alert.alert("Sem internet, usando o array de municípios em cache");s

      // console.log(await AsyncStorage.getItem(route.params.mun));

      const municipio_promise = route.params.mun;

      let municipio_off = value_mun == null ? municipio_promise : value_mun;

      // Alert.alert(JSON.stringify(municipio_off));
      // console.log(form);

      let teste = [];
      let results = null;

      if (route.params.mode == "create") {
        results = value_mun == null ? municipio_off : value_mun;
      } else {
        results = value_mun == null ? form.municipio : value_mun;
      }

      eee_fields.estacoes.map(function (item) {
        if (item["municipio"] == municipio_off) {
          teste.push({
            label: item["estacao"],
            value: item["estacao"],
          });
        }
      });

      // console.log("\x1b[36m%s\x1b[0m", form); //cyan

      setValue_mun(
        route.params.mode == "create" ? municipio_off : form.municipio
      );
      if (route.params.mode == "edit") {
        setValue(form.nome_eee);
      }

      // console.log(results);

      // console.log(results.estacoes);

      // console.log(setores_array);

      setItems(teste);
    } else if (connection == true) {
      async function fetchData() {
        // console.log("\x1b[36m%s\x1b[0m", form); //cyan
        let value_mun_ =
          route.params.mode == "create" ? value_mun : form.municipio;

        if (value_mun_ == null) {
          value_mun_ = await AsyncStorage.getItem("mun");
        }

        const mun_ =
          value_mun == null && route.params.mode != "edit"
            ? route.params.mun.toUpperCase()
            : value_mun_.toUpperCase();

        fetch(
          `https://localsig.com/sabesp_rr/app/api_react/json_spinner.php?municipio=${mun_}`,
          {
            method: "GET",
          }
        )
          .then((response) => {
            return response.json();
          })
          .then(async (response) => {
            let results = response;

            let teste = [];
            let mun = results["estacoes"][0].municipio.toString();
            // console.log("MUNICIPIO:" + mun);
            // console.log("RESULTADOS:" + results);
            // console.log(results);
            await AsyncStorage.setItem("mun", mun_);
            await AsyncStorage.setItem(mun.toString(), JSON.stringify(results));

            results.estacoes.map(function (item) {
              teste.push({
                label: item["estacao"],
                value: item["estacao"],
              });

              //   return item["estacao"];
            });
            // console.log(teste);
            preenchido = true;

            setValue_mun(
              route.params.mode == "create" ? value_mun : form.municipio
            );
            if (route.params.mode == "edit") {
              setValue(form.nome_eee);
            }
            console.log("TESTE//////");
            return setItems(teste);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      fetchData();
    }
  }, [connection, value_mun]);

  // const setDate = (event: DateTimePickerEvent, date: Date) => {
  //   const {
  //     type,
  //     nativeEvent: {timestamp},
  //   } = event;
  // };
  const handle_setDate = (event, date) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;

    set_is_SettingData(false);
    setDate(date);
    let data_f = new Date(date);
    data_f =
      data_f.getFullYear() + "-" + data_f.getMonth() + "-" + data_f.getDate();
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

  const radioButton_Style = {
    checked: {
      backgroundColor: "#85fcb9",
      borderColor: "#c4c4c4",
      borderWidth: 1,
      outlineColor: "blue",
      outlineStyle: "solid",
      outlineWidth: 4,
      padding: 10,
      width: 20,
      borderRadius: 100,
    },
    unchecked: {
      backgroundColor: "#fff",
      borderColor: "#c4c4c4",
      borderWidth: 1,
      borderRadius: 100,
      padding: 10,
      width: 20,
    },
  };

  const handle_RadioInput = (field, value) => {
    if (
      (field == "municipio" || field == "nome_eee") &&
      route.params.mode == "edit"
    ) {
      return;
    }
    const copy_form = { ...form };
    copy_form[field] = value;
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

  const handle_photoInput = (field, value) => {
    const copy_form = { ...form_photos };
    copy_form[field] = value;
    setForm_photos(copy_form);
    console.log(JSON.stringify(copy_form));
  };

  function click_activity(navigation) {
    console.log("Testing...");
    navigation.goBack();
  }

  function verify_required(field) {
    if (null_required_fields.includes(field)) {
      return <Text style={{ color: "red" }}>*</Text>;
    }
  }

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

  async function salvar_formularios() {
    let forms_off =
      JSON.parse(await AsyncStorage.getItem("form_vistoria")) != null
        ? JSON.parse(await AsyncStorage.getItem("form_vistoria"))
        : {};
    let forms_off_fotos =
      JSON.parse(await AsyncStorage.getItem("form_fotos")) != null
        ? JSON.parse(await AsyncStorage.getItem("form_fotos"))
        : {};

    message = "";

    let nao_preenchidos = [];
    for (const chave in form) {
      if (Object.hasOwnProperty.call(form, chave)) {
        const element = form[chave];
        // console.log("Element: " + element);
        if (element == null) {
          message += `${chave} está vazio(a) \n`;
          nao_preenchidos.push(chave);
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

    await AsyncStorage.setItem("form_vistoria", JSON.stringify(forms_off));
    await AsyncStorage.setItem("form_fotos", JSON.stringify(forms_off_fotos));

    console.log(
      "======================= RESULTADOS ============================="
    );

    console.log(message);
    console.log(JSON.parse(await AsyncStorage.getItem("form_vistoria")));
    console.log(JSON.parse(await AsyncStorage.getItem("form_fotos")));

    onToggleSnackBar();
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

  return startCamera ? (
    cameraView()
  ) : (
    <ScrollView>
      <View style={[Style.container, { backgroundColor: "#f4f4f4" }]}>
        <View
          style={{
            alignItems: "center",
            elevation: 5,
            margin: 3,
            padding: 5,
            backgroundColor: "white",
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            width: "100%",
          }}
        >
          <Text
            style={{
              marginTop: 20,
              fontSize: 15.5,
              fontWeight: "600",
              marginBottom: 10,
              textAlign: "center",
              borderColor: "#2e83ab",
              letterSpacing: -0.5,
              borderWidth: 1.5,
              borderRadius: 50,
              padding: 8,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            LocalSIG Saneamento - Vistoria de Elevatórias de Esgoto
          </Text>
          <DropDownPicker
            style={{
              width: "80%",
              alignSelf: "center",
              marginTop: 10,
              elevation: 2,
            }}
            placeholder={`Selecione um município`}
            searchable={true}
            open={open_mun}
            value={value_mun}
            items={items_mun}
            autoScroll={true}
            onChangeValue={(value) => handle_RadioInput("municipio", value)}
            language="PT"
            translation={{
              PLACEHOLDER: "Selecione um municipio",
              SEARCH_PLACEHOLDER: "Digite o municipio a ser filtrado", // See below for advanced options
              NOTHING_TO_SHOW: "Nenhuma município com esse nome encontrada.",
            }}
            listMode="MODAL"
            theme="LIGHT"
            setOpen={setOpen_mun}
            setValue={setValue_mun}
            setItems={setItems_mun}
            maxHeight={200}
          />

          <DropDownPicker
            style={{
              width: "80%",
              alignSelf: "center",
              marginTop: 10,
              elevation: 2,
            }}
            placeholder="Selecione uma elevatória"
            searchable={true}
            open={open}
            value={value}
            items={items}
            autoScroll={true}
            onChangeValue={(value) => handle_RadioInput("nome_eee", value)}
            language="PT"
            translation={{
              PLACEHOLDER: "Selecione uma elevatória",
              SEARCH_PLACEHOLDER: "Digite a elevatória a ser filtrada", // See below for advanced options
              NOTHING_TO_SHOW: "Nenhuma elevatória com esse nome encontrada.",
            }}
            listMode="MODAL"
            theme="LIGHT"
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            maxHeight={200}
          />
          {isSettingData == true ? (
            <DateTimePicker
              onChange={handle_setDate}
              value={new Date()}
              mode="date"
            />
          ) : null}
          {isSettingHora == true ? (
            <DateTimePicker
              onChange={handle_setHour}
              value={new Date()}
              mode="time"
            />
          ) : null}
          {/* <DateTimePicker value={new Date()} mode="time" display="clock" /> */}
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              justifyContent: "space-between",
              height: 60,

              width: "80%",
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
                  width: 180,
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
                    marginTop: 0,
                    marginLeft: -50,
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
                    marginTop: 0,
                    marginLeft: -50,
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

        {/* CONJ MOTO BOMBA */}
        <View
          style={{
            alignItems: "center",
            elevation: 5,
            margin: 5,
            backgroundColor: "white",
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
              }}
            >
              CONJUNTO MOTO BOMBA
            </Text>
          </View>
          {[
            inputs_form_conj_moto_bomb
              .filter((input) => input.type == "radio_numero")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    margin: 5,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",

                      margin: 5,
                    }}
                  >
                    {input.label} {verify_required(input.field)}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 50,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text> 1 </Text>
                      <BouncyCheckbox
                        isChecked={
                          form[input.field] == "1" && form[input.field] != null
                            ? true
                            : false
                        }
                        iconStyle={{ borderColor: "gray" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        fillColor="#c4c4c4"
                        disableBuiltInState={true}
                        onPress={() => handle_RadioInput(input.field, 1)}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text> 2 </Text>
                      <BouncyCheckbox
                        isChecked={form[input.field] == "2" ? true : false}
                        iconStyle={{ borderColor: "#85fcb9" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        disableBuiltInState={true}
                        fillColor="#c4c4c4"
                        onPress={() => handle_RadioInput(input.field, 2)}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text> 3 </Text>
                      <BouncyCheckbox
                        isChecked={form[input.field] == "3" ? true : false}
                        iconStyle={{ borderColor: "#85fcb9" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        disableBuiltInState={true}
                        fillColor="#c4c4c4"
                        onPress={() => handle_RadioInput(input.field, 3)}
                      />
                    </View>
                  </View>
                </View>
              )),
            inputs_form_conj_moto_bomb
              .filter((input) => input.type == "radio_sim_nao")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    margin: 5,
                    width: "80%",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      margin: 5,
                    }}
                  >
                    {input.label} {verify_required(input.field)}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 50,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text> SIM </Text>
                      <BouncyCheckbox
                        isChecked={
                          form[input.field] == true && form[input.field] != null
                            ? true
                            : false
                        }
                        iconStyle={{ borderColor: "gray" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        fillColor="#85fcb9"
                        disableBuiltInState={true}
                        onPress={() => handle_RadioInput(input.field, true)}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text> NÃO </Text>
                      <BouncyCheckbox
                        isChecked={form[input.field] == false ? true : false}
                        iconStyle={{ borderColor: "red" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        disableBuiltInState={true}
                        fillColor="red"
                        onPress={() => handle_RadioInput(input.field, false)}
                      />
                    </View>
                  </View>
                  {form[input.field] == false && input.contain_photo == true ? (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 50,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                        }}
                      >
                        <BtnPaper
                          icon="camera"
                          mode="outlined"
                          onPress={() => __startCamera(input.assoc)}
                          theme={{
                            colors: {
                              primary: "#2e83ab",
                            },
                          }}
                        >
                          TIRAR FOTO
                        </BtnPaper>
                      </View>
                    </View>
                  ) : null}
                </View>
              )),
          ]}
        </View>

        {/* BOMBA 1 */}
        <View
          style={{
            alignItems: "center",
            elevation: 5,
            margin: 3,
            padding: 5,
            backgroundColor: "white",
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              justifyContent: "center",
              width: "90%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
              }}
            >
              BOMBA 1
            </Text>
          </View>
          {[
            input_forms_bomba1
              .filter((input) => input.type == "radio_sim_nao")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 5,
                    margin: 5,
                    width: "90%",
                  }}
                >
                  <Text> {input.label} </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 5,
                      }}
                    >
                      <Text> SIM </Text>
                      <BouncyCheckbox
                        isChecked={
                          form[input.field] == true && form[input.field] != null
                            ? true
                            : false
                        }
                        iconStyle={{ borderColor: "gray" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        fillColor="#85fcb9"
                        disableBuiltInState={true}
                        onPress={() => handle_RadioInput(input.field, true)}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text> NÃO </Text>
                      <BouncyCheckbox
                        isChecked={form[input.field] == false ? true : false}
                        iconStyle={{ borderColor: "red" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        disableBuiltInState={true}
                        fillColor="red"
                        onPress={() => handle_RadioInput(input.field, false)}
                      />
                    </View>
                  </View>
                </View>
              )),

            input_forms_bomba1
              .filter((input) => input.type == "strings")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    width: "80%",
                    justifyContent: "space-between",
                    margin: 8,
                  }}
                >
                  <Text>{input.label}</Text>
                  <TextInput
                    style={{
                      backgroundColor: "#c4c4c4",
                      borderRadius: 5,
                      width: 100,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                    onChangeText={(newText) =>
                      handle_RadioInput(input.field, newText)
                    }
                    maxLength={10}
                  ></TextInput>
                </View>
              )),
          ]}
        </View>

        {/* BOMBA 2 */}
        <View
          style={{
            alignItems: "center",
            elevation: 5,
            margin: 3,
            padding: 5,
            backgroundColor: "white",
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              justifyContent: "center",
              width: "90%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
              }}
            >
              BOMBA 2
            </Text>
          </View>

          {[
            input_forms_bomba2
              .filter((input) => input.type == "radio_sim_nao")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 5,
                    margin: 5,
                    width: "90%",
                  }}
                >
                  <Text> {input.label} </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 5,
                      }}
                    >
                      <Text> SIM </Text>
                      <BouncyCheckbox
                        isChecked={
                          form[input.field] == true && form[input.field] != null
                            ? true
                            : false
                        }
                        iconStyle={{ borderColor: "gray" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        fillColor="#85fcb9"
                        disableBuiltInState={true}
                        onPress={() => handle_RadioInput(input.field, true)}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text> NÃO </Text>
                      <BouncyCheckbox
                        isChecked={form[input.field] == false ? true : false}
                        iconStyle={{ borderColor: "red" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        disableBuiltInState={true}
                        fillColor="red"
                        onPress={() => handle_RadioInput(input.field, false)}
                      />
                    </View>
                  </View>
                </View>
              )),

            input_forms_bomba2
              .filter((input) => input.type == "strings")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    width: "80%",
                    justifyContent: "space-between",
                    margin: 8,
                  }}
                >
                  <Text>{input.label}</Text>
                  <TextInput
                    style={{
                      backgroundColor: "#c4c4c4",
                      borderRadius: 5,
                      width: 100,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                    onChangeText={(newText) =>
                      handle_RadioInput(input.field, newText)
                    }
                    maxLength={10}
                  ></TextInput>
                </View>
              )),
          ]}
        </View>
        {/* BOMBA 3 */}
        <View
          style={{
            alignItems: "center",
            elevation: 5,
            margin: 3,
            padding: 5,
            backgroundColor: "white",
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              justifyContent: "center",
              width: "90%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
              }}
            >
              BOMBA 3
            </Text>
          </View>
          {[
            input_forms_bomba3
              .filter((input) => input.type == "radio_sim_nao")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 5,
                    margin: 5,
                    width: "90%",
                  }}
                >
                  <Text> {input.label} </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 5,
                      }}
                    >
                      <Text> SIM </Text>
                      <BouncyCheckbox
                        isChecked={
                          form[input.field] == true && form[input.field] != null
                            ? true
                            : false
                        }
                        iconStyle={{ borderColor: "gray" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        fillColor="#85fcb9"
                        disableBuiltInState={true}
                        onPress={() => handle_RadioInput(input.field, true)}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text> NÃO </Text>
                      <BouncyCheckbox
                        isChecked={form[input.field] == false ? true : false}
                        iconStyle={{ borderColor: "red" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        disableBuiltInState={true}
                        fillColor="red"
                        onPress={() => handle_RadioInput(input.field, false)}
                      />
                    </View>
                  </View>
                </View>
              )),

            input_forms_bomba3
              .filter((input) => input.type == "strings")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    width: "80%",
                    justifyContent: "space-between",
                    margin: 8,
                  }}
                >
                  <Text>{input.label}</Text>
                  <TextInput
                    style={{
                      backgroundColor: "#c4c4c4",
                      borderRadius: 5,
                      width: 100,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                    onChangeText={(newText) =>
                      handle_RadioInput(input.field, newText)
                    }
                    maxLength={10}
                  ></TextInput>
                </View>
              )),
          ]}
        </View>

        {/* CESTO */}
        <View
          style={{
            alignItems: "center",
            elevation: 10,
            margin: 5,
            padding: 5,
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "white",
              textAlign: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
              }}
            >
              CESTO
            </Text>
          </View>

          {input_forms_cesto
            .filter((input) => input.type == "radio_sim_nao")
            .map((input, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  margin: 5,
                  width: "80%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    margin: 5,
                  }}
                >
                  {input.label} {verify_required(input.field)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 50,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> SIM </Text>
                    <BouncyCheckbox
                      isChecked={
                        form[input.field] == true && form[input.field] != null
                          ? true
                          : false
                      }
                      iconStyle={{ borderColor: "gray" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      fillColor="#85fcb9"
                      disableBuiltInState={true}
                      onPress={() => handle_RadioInput(input.field, true)}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> NÃO </Text>
                    <BouncyCheckbox
                      isChecked={form[input.field] == false ? true : false}
                      iconStyle={{ borderColor: "red" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      disableBuiltInState={true}
                      fillColor="red"
                      onPress={() => handle_RadioInput(input.field, false)}
                    />
                  </View>
                </View>
                {form[input.field] == false && input.contain_photo == true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 50,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <BtnPaper
                        icon="camera"
                        mode="outlined"
                        onPress={() => __startCamera(input.assoc)}
                        theme={{
                          colors: {
                            primary: "#2e83ab",
                          },
                        }}
                      >
                        TIRAR FOTO
                      </BtnPaper>
                    </View>
                  </View>
                ) : null}
              </View>
            ))}
        </View>

        {/* POÇO */}
        <View
          style={{
            alignItems: "center",
            elevation: 10,
            margin: 5,
            padding: 5,
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "white",
              textAlign: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
                alignSelf: "center",
              }}
            >
              POÇO
            </Text>
          </View>

          {input_forms_poco
            .filter((input) => input.type == "radio_sim_nao")
            .map((input, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  margin: 5,
                  width: "80%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    margin: 5,
                  }}
                >
                  {input.label} {verify_required(input.field)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 50,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> SIM </Text>
                    <BouncyCheckbox
                      isChecked={
                        form[input.field] == true && form[input.field] != null
                          ? true
                          : false
                      }
                      iconStyle={{ borderColor: "gray" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      fillColor="#85fcb9"
                      disableBuiltInState={true}
                      onPress={() => handle_RadioInput(input.field, true)}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> NÃO </Text>
                    <BouncyCheckbox
                      isChecked={form[input.field] == false ? true : false}
                      iconStyle={{ borderColor: "red" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      disableBuiltInState={true}
                      fillColor="red"
                      onPress={() => handle_RadioInput(input.field, false)}
                    />
                  </View>
                </View>
                {form[input.field] == false && input.contain_photo == true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 50,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <BtnPaper
                        icon="camera"
                        mode="outlined"
                        onPress={() => __startCamera(input.assoc)}
                        theme={{
                          colors: {
                            primary: "#2e83ab",
                          },
                        }}
                      >
                        TIRAR FOTO
                      </BtnPaper>
                    </View>
                  </View>
                ) : null}
              </View>
            ))}
        </View>
        {/* CAIXA DE BARRILHETE */}
        <View
          style={{
            alignItems: "center",
            elevation: 10,
            margin: 5,
            padding: 5,
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "white",
              textAlign: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
                alignSelf: "center",
              }}
            >
              CAIXA DE BARRILHETE
            </Text>
          </View>

          {input_forms_caixa_de_barrilhete
            .filter((input) => input.type == "radio_sim_nao")
            .map((input, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  margin: 5,
                  width: "80%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    margin: 5,
                  }}
                >
                  {input.label} {verify_required(input.field)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 50,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> SIM </Text>
                    <BouncyCheckbox
                      isChecked={
                        form[input.field] == true && form[input.field] != null
                          ? true
                          : false
                      }
                      iconStyle={{ borderColor: "gray" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      fillColor="#85fcb9"
                      disableBuiltInState={true}
                      onPress={() => handle_RadioInput(input.field, true)}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> NÃO </Text>
                    <BouncyCheckbox
                      isChecked={form[input.field] == false ? true : false}
                      iconStyle={{ borderColor: "red" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      disableBuiltInState={true}
                      fillColor="red"
                      onPress={() => handle_RadioInput(input.field, false)}
                    />
                  </View>
                </View>
                {form[input.field] == false && input.contain_photo == true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 50,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <BtnPaper
                        icon="camera"
                        mode="outlined"
                        onPress={() => __startCamera(input.assoc)}
                        theme={{
                          colors: {
                            primary: "#2e83ab",
                          },
                        }}
                      >
                        TIRAR FOTO
                      </BtnPaper>
                    </View>
                  </View>
                ) : null}
              </View>
            ))}
        </View>
        {/* ÁREA */}
        <View
          style={{
            alignItems: "center",
            elevation: 10,
            margin: 5,
            padding: 5,
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "white",
              textAlign: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
                alignSelf: "center",
              }}
            >
              ÁREA
            </Text>
          </View>

          {input_forms_area
            .filter((input) => input.type == "radio_sim_nao")
            .map((input, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  margin: 5,
                  width: "80%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    margin: 5,
                  }}
                >
                  {input.label} {verify_required(input.field)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 50,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> SIM </Text>
                    <BouncyCheckbox
                      isChecked={
                        form[input.field] == true && form[input.field] != null
                          ? true
                          : false
                      }
                      iconStyle={{ borderColor: "gray" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      fillColor="#85fcb9"
                      disableBuiltInState={true}
                      onPress={() => handle_RadioInput(input.field, true)}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> NÃO </Text>
                    <BouncyCheckbox
                      isChecked={form[input.field] == false ? true : false}
                      iconStyle={{ borderColor: "red" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      disableBuiltInState={true}
                      fillColor="red"
                      onPress={() => handle_RadioInput(input.field, false)}
                    />
                  </View>
                </View>
                {form[input.field] == false && input.contain_photo == true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 50,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <BtnPaper
                        icon="camera"
                        mode="outlined"
                        onPress={() => __startCamera(input.assoc)}
                        theme={{
                          colors: {
                            primary: "#2e83ab",
                          },
                        }}
                      >
                        TIRAR FOTO
                      </BtnPaper>
                    </View>
                  </View>
                ) : null}
              </View>
            ))}
        </View>
        {/* GERAL */}
        <View
          style={{
            alignItems: "center",
            elevation: 10,
            margin: 5,
            padding: 5,
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "white",
              textAlign: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
                alignSelf: "center",
              }}
            >
              GERAL
            </Text>
          </View>

          {input_forms_geral
            .filter((input) => input.type == "radio_sim_nao")
            .map((input, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  margin: 5,
                  width: "80%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    margin: 5,
                  }}
                >
                  {input.label} {verify_required(input.field)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 50,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> SIM </Text>
                    <BouncyCheckbox
                      isChecked={
                        form[input.field] == true && form[input.field] != null
                          ? true
                          : false
                      }
                      iconStyle={{ borderColor: "gray" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      fillColor="#85fcb9"
                      disableBuiltInState={true}
                      onPress={() => handle_RadioInput(input.field, true)}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> NÃO </Text>
                    <BouncyCheckbox
                      isChecked={form[input.field] == false ? true : false}
                      iconStyle={{ borderColor: "red" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      disableBuiltInState={true}
                      fillColor="red"
                      onPress={() => handle_RadioInput(input.field, false)}
                    />
                  </View>
                </View>
                {form[input.field] == true &&
                input.contain_photo == true &&
                input.field == "eee_extravasam" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 50,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <BtnPaper
                        icon="camera"
                        mode="outlined"
                        onPress={() => __startCamera(input.assoc)}
                        theme={{
                          colors: {
                            primary: "#2e83ab",
                          },
                        }}
                      >
                        TIRAR FOTO
                      </BtnPaper>
                    </View>
                  </View>
                ) : null}
                {form[input.field] == false &&
                input.contain_photo == true &&
                input.field == "sensor_nc" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 50,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <BtnPaper
                        icon="camera"
                        mode="outlined"
                        onPress={() => __startCamera(input.assoc)}
                        theme={{
                          colors: {
                            primary: "#2e83ab",
                          },
                        }}
                      >
                        TIRAR FOTO
                      </BtnPaper>
                    </View>
                  </View>
                ) : null}
              </View>
            ))}
        </View>
        {/* PAINEL */}
        <View
          style={{
            alignItems: "center",
            elevation: 10,
            margin: 5,
            padding: 5,
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "white",
              textAlign: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
                alignSelf: "center",
              }}
            >
              PAINEL
            </Text>
          </View>

          {input_forms_painel
            .filter((input) => input.type == "radio_sim_nao")
            .map((input, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  margin: 5,
                  width: "80%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    margin: 5,
                  }}
                >
                  {input.label} {verify_required(input.field)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 50,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> SIM </Text>
                    <BouncyCheckbox
                      isChecked={
                        form[input.field] == true && form[input.field] != null
                          ? true
                          : false
                      }
                      iconStyle={{ borderColor: "gray" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      fillColor="#85fcb9"
                      disableBuiltInState={true}
                      onPress={() => handle_RadioInput(input.field, true)}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text> NÃO </Text>
                    <BouncyCheckbox
                      isChecked={form[input.field] == false ? true : false}
                      iconStyle={{ borderColor: "red" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      disableBuiltInState={true}
                      fillColor="red"
                      onPress={() => handle_RadioInput(input.field, false)}
                    />
                  </View>
                </View>
                {form[input.field] == false && input.contain_photo == true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 50,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <BtnPaper
                        icon="camera"
                        mode="outlined"
                        onPress={() => __startCamera(input.assoc)}
                        theme={{
                          colors: {
                            primary: "#2e83ab",
                          },
                        }}
                      >
                        TIRAR FOTO
                      </BtnPaper>
                    </View>
                  </View>
                ) : null}
              </View>
            ))}
        </View>

        {/* HOUVE VANDALISMO OU FURTO */}
        <View
          style={{
            alignItems: "center",
            elevation: 10,
            margin: 5,
            padding: 5,
            backgroundColor: "white",
            borderBottomColor: "#2e83ab",
            borderBottomWidth: 2,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "white",
              textAlign: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                margin: 10,
                borderBottomColor: "#2e83ab",
                borderBottomWidth: 1.5,
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: -36,
                paddingRight: -36,
                alignSelf: "center",
              }}
            >
              VANDALISMOS E FURTOS
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "stretch",
                gap: 0,
                justifyContent: "center",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {input_forms_vandalismo_ou_furto
                .filter((input) => input.type == "check_button")
                .map((input, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      alignItems: "center",

                      justifyContent: "center",
                    }}
                  >
                    {/* <Text
                      style={{
                        fontWeight: "bold",
                        margin: 5,
                        width: "80%",
                      }}
                    >
                      {input.label}
                    </Text>
                    <BouncyCheckbox
                      isChecked={form[input.field]}
                      iconStyle={{ borderColor: "gray" }}
                      innerIconStyle={{ borderWidth: 1 }}
                      fillColor="#c4c4c4"
                      onPress={() =>
                        handle_RadioInput(input.field, !form[input.field])
                      }
                    /> */}
                    <Chip
                      mode="flat"
                      selected={form[input.field]}
                      theme={{
                        colors: {
                          primary: "#2e83ab",
                        },
                      }}
                      style={{
                        backgroundColor: "#e6f5fc",
                      }}
                      onPress={() =>
                        handle_RadioInput(input.field, !form[input.field])
                      }
                    >
                      {input.label}
                    </Chip>
                  </View>
                ))}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                marginTop: 10,

                marginBottom: 10,
              }}
            >
              <BtnPaper
                icon="camera"
                mode="outlined"
                onPress={() => __startCamera("img_furto")}
                theme={{
                  colors: {
                    primary: "#2e83ab",
                  },
                }}
              >
                TIRAR FOTO
              </BtnPaper>
            </View>
          </View>
        </View>

        {/* OBSERVAÇÕES */}
        <View
          style={{
            alignItems: "center",
            elevation: 10,
            margin: 5,
            padding: 5,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "white",
              textAlign: "center",
              justifyContent: "center",

              width: "100%",
            }}
          >
            {input_forms_observacoes
              .filter((input) => input.type == "strings")
              .map((input, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    alignItems: "center",

                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      alignItems: "center",

                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        margin: 10,
                        borderBottomColor: "#2e83ab",
                        borderBottomWidth: 1.5,
                        paddingTop: 8,
                        paddingBottom: 4,
                        paddingLeft: -36,
                        paddingRight: -36,
                        alignSelf: "center",
                      }}
                    >
                      {/* {input.label} */}
                      FOTO DA ÁREA GERAL
                    </Text>

                    <BtnPaper
                      icon="camera"
                      mode="outlined"
                      onPress={() => __startCamera("img")}
                      theme={{
                        colors: {
                          primary: "#2e83ab",
                          secondary: "#fff",
                        },
                      }}
                    >
                      TIRAR FOTO
                    </BtnPaper>

                    <TextInput
                      style={{
                        borderRadius: 5,
                        minWidth: 150,
                        maxWidth: 200,
                        paddingLeft: 2,
                        marginTop: 20,
                        paddingRight: 2,
                        backgroundColor: "#caebfa",
                      }}
                      multiline={true}
                      label={
                        <Text style={{ color: "#2e83ab" }}>
                          {"Observações"}
                        </Text>
                      }
                      placeholder={"Máximo de 80 carácteres."}
                      placeholderTextColor={"#a1a1a1"}
                      maxLength={80}
                      onChangeText={(newText) =>
                        handle_RadioInput(input.field, newText)
                      }
                      textColor="black"
                      theme={{
                        colors: {
                          primary: "#2e83ab",
                        },
                      }}
                    ></TextInput>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      alignItems: "center",
                      gap: 80,
                      marginTop: 20,
                      marginBottom: 10,
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
                          secondary: "#2e83ab",
                        },
                      }}
                      style={{
                        width: "30%",
                        backgroundColor: "#2e83ab",
                      }}
                      onPress={() => click_activity(navigation)}
                    >
                      Voltar
                    </BtnPaper>

                    <BtnPaper
                      icon="upload"
                      mode="elevated"
                      theme={{
                        colors: {
                          primary: "#fff",
                          secondary: "#2e83ab",
                        },
                      }}
                      style={{
                        width: "50%",

                        backgroundColor: "#2e83ab",
                      }}
                      onPress={async () => await salvar_formularios()}
                    >
                      Salvar Formulário
                    </BtnPaper>
                  </View>
                </View>
              ))}
          </View>
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
      </View>
    </ScrollView>
  );
};

export default Vistoria_View;
