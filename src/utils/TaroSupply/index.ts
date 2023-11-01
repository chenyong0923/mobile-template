import { Method } from '@pangu/end-type-to-front-type';
import Taro from '@tarojs/taro';

import { Loading, Toast } from '@/utils';

export default class TaroSupply {
  /**
   * 环境判断
   */
  static readonly isDingDing: boolean = process.env.TARO_ENV === 'dd';
  static readonly isQyWx: boolean =
    process.env.TARO_ENV === 'weapp' && !!wx?.qy;

  /**
   * 登录
   * @param options
   */
  static login(
    options?: Omit<Taro.login.Option, 'success' | 'fail'>,
  ): Promise<Taro.login.SuccessCallbackResult> {
    const that = this;
    return new Promise((resolve, reject) => {
      const dealOptions = {
        ...options,
        success(res) {
          const { code, authCode, ...rest } = res;
          resolve({ ...rest, code: that.isDingDing ? authCode : code });
        },
        fail(e) {
          reject(e);
        },
      };
      if (that.isQyWx) {
        wx.qy.login(dealOptions);
      } else if (that.isDingDing) {
        dd.getAuthCode(dealOptions);
      } else {
        Taro.login(dealOptions);
      }
    });
  }

  /**
   * 请求
   * @param options
   */
  static request(
    options: Taro.request.Option & { params?: Record<string, any> },
  ) {
    const { data, ...rest } = options;
    if (this.isDingDing) {
      return Taro.request({
        data: options.method === Method.POST ? JSON.stringify(data) : data,
        ...rest,
      });
    } else {
      return Taro.request(options);
    }
  }
  /**
   * 上传文件统一传参
   */
  static uploadFile(option: Taro.uploadFile.Option & { fileType?: string }) {
    Loading.show();
    const { name, fileName, fileType = 'image', ...rest } = option;
    return new Promise((resolve, reject) => {
      if (this.isDingDing) {
        dd.uploadFile({
          fileName: name,
          fileType,
          onSuccess(res) {
            if (res.statusCode === 200 && res.data) {
              const data = JSON.parse(res.data);
              resolve(data.success ? data.data : false);
            } else {
              resolve(true);
            }
          },
          fail(e) {
            Toast.info('上传失败');
            reject(e);
          },
          complete() {
            Loading.hide();
          },
          ...rest,
        });
      } else {
        Taro.uploadFile({
          ...option,
          success(res) {
            if (res.statusCode === 200 && res.data) {
              const data = JSON.parse(res.data);
              resolve(data.success ? data.data : false);
            } else {
              resolve(true);
            }
          },
          fail(e) {
            Toast.info('上传失败');
            reject(e);
          },
          complete() {
            Loading.hide();
          },
        });
      }
    });
  }
  /**
   * 选择图片统一返回
   * @param option http://taro-docs.jd.com/taro/docs/apis/media/image/chooseImage/
   */
  static chooseImage(
    options?: Omit<Taro.chooseImage.Option, 'success' | 'fail'>,
  ): Promise<Taro.chooseImage.SuccessCallbackResult> {
    const {
      count = 1,
      sourceType = ['album', 'camera'],
      ...rest
    } = options ?? {};
    return new Promise((resolve, reject) => {
      Taro.chooseImage({
        count,
        sourceType,
        success: (res) => {
          resolve({
            ...res,
            tempFiles:
              res.tempFiles ||
              res.tempFilePaths?.map((item) => ({ path: item })),
          });
        },
        fail: (e) => {
          reject(e);
        },
        ...rest,
      });
    });
  }
  /**
   * 扫码进来获取信息
   */
  static getQrCodeParams(): Record<string, any> {
    let q: string;
    if (this.isDingDing) {
      const { router } = Taro.getCurrentInstance();
      const { params } = router || {};
      q = params?.q || '';
    } else {
      const { query } = Taro.getLaunchOptionsSync();
      q = query?.q || '';
    }
    const url = decodeURIComponent(q || '');
    const [, paramsStr] = url?.split('?');
    const back: Record<string, any> = { originUrl: url };
    paramsStr?.split('&')?.forEach((item) => {
      const [key, value] = item?.split('=');
      back[key] = value;
    });
    return back;
  }
}
