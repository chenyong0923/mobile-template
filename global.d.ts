declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare class dd {
  static getAuthCode: any;
  static corpId: string;
  static [key: string]: any;
}

declare class wx {
  static showLoading: any;
  static login: any;
  static hideLoading: any;
  static qy: any;
  static onAppRouteDone: any;
}

// @ts-ignore
declare const process: {
  env: {
    TARO_ENV:
      | 'weapp'
      | 'swan'
      | 'alipay'
      | 'h5'
      | 'rn'
      | 'tt'
      | 'quickapp'
      | 'qq'
      | 'jd'
      | 'dd';
    [key: string]: any;
  };
};
