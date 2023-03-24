// import React in our code
import React, { useState, useEffect } from "react";

export const inputs_form_conj_moto_bomb = [
  //está faltando o 1 campo
  {
    label: "POSSUI QUANTAS BOMBAS?",
    assoc: null,
    type: "radio_numero",
    contain_photo: false,
    field: "qntd_bomba",
  },

  {
    label: "VIBRAÇÕES OU RUIDOS",
    assoc: null,
    type: "radio_sim_nao",
    contain_photo: false,
    field: "ruido",
  },

  {
    label: "OPERANDO EM MANUAL?",
    assoc: null,
    type: "radio_sim_nao",
    contain_photo: false,
    field: "op_manu",
  },

  {
    label: "OPERANDO EM AUTOMÁTICO?",
    assoc: null,
    type: "radio_sim_nao",
    contain_photo: false,
    field: "op_auto",
  },
  {
    label: "TUBO GUIA EM BOM ESTADO?",
    assoc: "img_tbguia",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "tb_guia",
  },
  {
    label: "Tire uma foto do tubo guia",
    assoc: null,
    type: "btn_foto",
    field: "img_tbguia",
  },
];

export const input_forms_bomba1 = [
  {
    label: "BOMBA 1 FUNCIONANDO?",
    assoc: null,
    type: "radio_sim_nao",
    contain_photo: false,
    field: "bomba1_fun",
  },

  {
    label: "HORÍMETRO",
    assoc: null,
    type: "strings",
    field: "horimetro_1",
  },
  {
    label: "TENSÃO",
    assoc: null,
    type: "strings",
    field: "amperagem_1",
  },
  {
    label: "CORRENTE",
    assoc: null,
    type: "strings",
    field: "voltagem_1",
  },
  {
    label: "BP OU Nº SÉRIE",
    assoc: null,
    type: "strings",
    field: "bp_1",
  },
];

export const input_forms_bomba2 = [
  {
    label: "BOMBA 2 FUNCIONANDO?",
    assoc: null,
    type: "radio_sim_nao",
    contain_photo: false,
    field: "bomba2_fun",
  },

  {
    label: "HORÍMETRO",
    assoc: null,
    type: "strings",
    field: "horimetro_2",
  },
  {
    label: "TENSÃO",
    assoc: null,
    type: "strings",
    field: "amperagem_2",
  },
  {
    label: "CORRENTE",
    assoc: null,
    type: "strings",
    field: "voltagem_2",
  },
  {
    label: "BP OU Nº SÉRIE",
    assoc: null,
    type: "strings",
    field: "bp_2",
  },
];

export const input_forms_bomba3 = [
  {
    label: "BOMBA 3 FUNCIONANDO?",
    assoc: null,
    type: "radio_sim_nao",
    contain_photo: false,
    field: "bomba3_fun",
  },

  {
    label: "HORÍMETRO",
    assoc: null,
    type: "strings",
    field: "horimetro_3",
  },
  {
    label: "TENSÃO",
    assoc: null,
    type: "strings",
    field: "amperagem_3",
  },
  {
    label: "CORRENTE",
    assoc: null,
    type: "strings",
    field: "voltagem_3",
  },
  {
    label: "BP OU Nº SÉRIE",
    assoc: null,
    type: "strings",
    field: "bp_3",
  },
];

export const input_forms_cesto = [
  {
    label: "CESTO EM BOM ESTADO?",
    assoc: "img_estcesto",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "est_cesto",
  },
  {
    label: "Tire uma foto do cesto",
    assoc: null,
    type: "btn_foto",
    field: "img_estcesto",
  },
  {
    label: "CESTO LIVRE DE MATERIAIS ACUMULADOS?",
    assoc: "img_materiala",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "material_a",
  },
  {
    label: "Tire uma foto do material acumulado",
    assoc: null,
    type: "btn_foto",
    field: "img_materiala",
  },
  {
    label: "CESTO COM GRADEAMENTO?",
    assoc: null,
    type: "radio_sim_nao",
    contain_photo: false,
    field: "cesto_tem_grade",
  },

  {
    label: "GRADEAMENTO EM BOM ESTADO?",
    assoc: "img_gradeamento",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "grade_bom_estado",
  },

  {
    label: "Tire uma foto do gradeamento",
    assoc: null,
    type: "btn_foto",
    field: "img_gradeamento",
  },

  {
    label: "GRADE 1 LIMPA?",
    assoc: "img_grade1",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "grade1_limpeza",
  },

  {
    label: "Tire uma foto da grade 1",
    assoc: null,
    type: "btn_foto",
    field: "img_grade1",
  },

  {
    label: "GRADE 2 LIMPA?",
    assoc: "img_grade2",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "grade2_limpeza",
  },

  {
    label: "Tire uma foto da grade 2",
    assoc: null,
    type: "btn_foto",
    field: "img_grade2",
  },

  {
    label: "CESTO COM CAIXA DE AREIA?",
    assoc: null,
    type: "radio_sim_nao",
    contain_photo: false,
    field: "cesto_caixa_areia",
  },
  {
    label: "CAIXA DE AREIA LIMPA?",
    assoc: "img_areia",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "caixa_limpeza",
  },
  {
    label: "Tire uma foto da caixa de areia",
    assoc: null,
    type: "btn_foto",
    field: "img_areia",
  },
];

export const input_forms_poco = [
  {
    label: "POÇO LIMPO?",
    assoc: "img_pocolimpeza",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "poco_limpeza",
  },
  {
    label: "Tire uma foto do poço",
    assoc: null,
    type: "btn_foto",
    field: "img_pocolimpeza",
  },
  {
    label: "TAMPAS EM BOAS CONDIÇÕES?",
    assoc: "img_pocotampa",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "poco_tampa",
  },
  {
    label: "Tire uma foto da tampa do poço",
    assoc: null,
    type: "btn_foto",
    field: "img_pocotampa",
  },
];

export const input_forms_caixa_de_barrilhete = [
  {
    label: "TAMPA EM BOM ESTADO?",
    assoc: "img_barriltampa",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "barril_tampa",
  },
  {
    label: "Tire uma foto da tampa do barrilhete",
    assoc: null,
    type: "btn_foto",
    field: "img_barriltampa",
  },
  {
    label: "TUBULAÇÃO EM BOM ESTADO?",
    assoc: "img_barriltub",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "barril_tub",
  },
  {
    label: "Tire uma foto da tubulação do barrilhete",
    assoc: null,
    type: "btn_foto",
    field: "img_barriltub",
  },
];

export const input_forms_area = [
  {
    label: "PORTÕES EM BOM ESTADO?",
    assoc: "img_areaportoes",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "area_portoes",
  },
  {
    label: "Tire uma foto dos portões",
    assoc: null,
    type: "btn_foto",
    field: "img_areaportoes",
  },
  {
    label: "MONOVIAS EM BOM ESTADO?",
    assoc: "img_areamonovias",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "area_monovias",
  },
  {
    label: "Tire uma foto das monovias",
    assoc: null,
    type: "btn_foto",
    field: "img_areamonovias",
  },
];

export const input_forms_geral = [
  {
    label: "EEE EXTRAVASANDO?",
    assoc: "img_extravasam",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "eee_extravasam",
  },
  {
    label: "Tire uma foto do extravasamento",
    assoc: null,
    type: "btn_foto",
    field: "img_extravasam",
  },
  {
    label: "SENSOR DE NÍVEL CRÍTICO EM BOM ESTADO?",
    assoc: "img_sensornc",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "sensor_nc",
  },
  {
    label: "Tire uma foto do sensor de nível crítico",
    assoc: null,
    type: "btn_foto",
    field: "img_sensornc",
  },
];

export const input_forms_painel = [
  {
    label: "PAINEL EM BOM ESTADO?",
    assoc: "img_painelestado",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "painel_estado",
  },
  {
    label: "Tire uma foto do painel",
    assoc: null,
    type: "btn_foto",
    field: "img_painelestado",
  },
  {
    label: "POSSUI MONITORAMENTO?",
    assoc: "img_painelmonitoramento",
    type: "radio_sim_nao",
    contain_photo: true,
    required: true,
    field: "painel_monitoramento",
  },
  {
    label: "Tire uma foto da ausência de monitoramento",
    assoc: null,
    type: "btn_foto",
    field: "img_painelmonitoramento",
  },
];

export const input_forms_vandalismo_ou_furto = [
  {
    label: "PORTAS FURTADAS",
    assoc: null,
    type: "check_button",
    contain_photo: false,
    field: "portas_furtadas",
  },
  {
    label: "FIAÇÃO FURTADA",
    assoc: null,
    type: "check_button",
    contain_photo: false,
    field: "fiacao_furtadas",
  },
  {
    label: "VANDALISMO",
    assoc: null,
    type: "check_button",
    contain_photo: false,
    field: "vandalismo",
  },
  {
    label: "PAINEL VIOLADO",
    assoc: null,
    type: "check_button",
    contain_photo: false,
    field: "painel_violado",
  },
  {
    label: "BOMBA FURTADA",
    assoc: null,
    type: "check_button",
    contain_photo: false,
    field: "bomba_furtada",
  },
  {
    label: "OUTROS",
    assoc: null,
    type: "check_button",
    contain_photo: false,
    field: "outros_furtos",
  },
  {
    label: "Tire uma foto do furto ou vandalismo.",
    assoc: null,
    type: "btn_foto",
    contain_photo: false,
    field: "img_furto",
  },
];

export const input_forms_observacoes = [
  {
    label: "Foto da área geral. (Obrigatória)",
    contain_photo: false,
    assoc: null,
    type: "btn_foto",
    field: "img",
  },
  { label: "OBSERVAÇÕES", assoc: null, type: "strings", field: "obs" },
];
