export type ISettingBaseProps = {
  cod_base: number;
  desc_grupo: string;
  desc_subgrupo: string;
  name: string;
  description: string;
  state: string | null;
  createdAt: Date;
  updatedAt: Date;
  settings?: ISettingsProps[];
};

export type ISettingsProps = {
  cod_base: number;
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  state: boolean;
  settingBase: ISettingBaseProps;
};

export type IFinalizadora = {
  id?: number;
  cod_int_sap_sim: string;
  cod_rede: string | number | null;
  desc_rede: string | null;
  cod_bandeira: string | number | null;
  desc_bandeira: string | null;
  data_cadastro: string;
  data_ultima_modificacao: string;
  user_id_mod: string;
  desc_finalizadora: string | null;
  cod_finalizadora: number | null;
  tipo_crtl: string;
  ind_status: boolean;
};
