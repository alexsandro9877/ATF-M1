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
  