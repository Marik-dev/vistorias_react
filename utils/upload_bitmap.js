import { ToastAndroid } from "react-native";

let imgsList = [];

const getAllImages = (formList) => {
  imgsList = [];

  for (const [key, form] of Object.entries(formList)) {
    for (const [field, value] of Object.entries(form)) {
      if (field == "uuid") {
        continue;
      }
      let filename = value.split("DCIM/")[1];

      imgsList.push({ name: filename, uri: value });
    }
  }
};

const sendFormData = async (formData, url) => {
  try {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => controller.abort(), 120000);

    const response = await fetch(`${url}`, {
      method: "post",
      body: formData,
      signal: controller.signal,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 500) {
      console.log("imagem enviada");
      return true;
    }
  } catch (error) {
    console.log("error");
    console.log(error);
  }
  return false;
};

export const uploadImages = async (formList, setor, caminho) => {
  const URL = `http://localsig.com/sabesp_rr/app/uploads/${setor.toLowerCase()}/${caminho}?apicall=uploadpic`;
  console.log("uploading images iniciado");

  await getAllImages(formList);

  if (imgsList.length === 0) {
    console.log("campos de imagens vazio");
    return true;
  }

  // preparando as fotos e convertendo para o formato formData e populando o array com eles
  let listOfFormsData = [];

  Object.entries(imgsList).forEach((obj) => {
    const [key, value] = obj;

    if (value.name != null && value.name != "" && value.name != "sem foto") {
      let localUri = value.uri;
      let filename = value.name;

      let formData = new FormData();
      formData.append(
        "pic",
        JSON.parse(
          JSON.stringify({
            uri: localUri,
            type: "image/jpg",
            name: filename,
          })
        )
      );
      formData.append("name", filename ? filename : "sem nome");
      formData.append("tags", filename ? filename : "sem nome");

      listOfFormsData.push(formData);
    } else {
      console.log("campo vazio");
    }
  });

  const formsDataToSend = [];

  listOfFormsData.forEach((formData) => {
    formsDataToSend.push(sendFormData(formData, URL));
  });

  await Promise.all([...formsDataToSend]);

  return true;
};
