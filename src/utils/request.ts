import Taro from '@tarojs/taro';
import qs from 'qs';

import CodeMsg from '@/assets/data/code.json';
import { BaseResponse } from '@/interface/base';
import TaroSupply from '@/utils/TaroSupply';

export const DEFAULT_TIP_MESSAGE = '请求失败，请刷新重试';

/**
 * 错误处理
 * @param {Object} data 请求返回的信息
 */
export function handleError(data) {
  const message = CodeMsg[data.code] || data.msg || DEFAULT_TIP_MESSAGE;
  Taro.showToast({
    title: message,
    mask: true,
    icon: 'none',
  });
}

interface RequestOption extends Omit<Taro.request.Option, 'url'> {
  params?: Record<string, any>;
}

const request = (url: string, options: RequestOption) => {
  const { method, params, data, ...rest } = options;

  const _url = `${process.env.BASE_URL || ''}${process.env.BASE_API || ''}${
    url || ''
  }`;

  return new Promise<BaseResponse>((resolve, reject) => {
    TaroSupply.request({
      timeout: 5000,
      mode: 'cors',
      method,
      url:
        method === 'GET' || method === 'DELETE'
          ? `${_url}${qs.stringify(params) ? `?${qs.stringify(params)}` : ''}`
          : _url,
      data: {
        ...params,
        ...data,
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: Taro.getStorageSync('token'),
        ...options.header,
      },
      success(res) {
        const { data: resData } = res;
        if (!resData.success) {
          handleError(resData);
        }
        resolve(resData);
      },
      fail(err) {
        Taro.showToast({
          title: DEFAULT_TIP_MESSAGE,
          mask: true,
          icon: 'none',
        });
        reject(err);
        // for debug
        console.log(err);
      },
      ...rest,
    });
  });
};

export default request;
