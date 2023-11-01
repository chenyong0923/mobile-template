import Taro from '@tarojs/taro';

import { Cache, CacheKey } from './cache';

/**
 * 构建播放器实例
 * @param path 音频文件地址
 * @returns 播放器实例
 */
export const initVoice = (path: string) => {
  let voiceContext: Taro.InnerAudioContext = {} as any;
  voiceContext = Taro.createInnerAudioContext();
  voiceContext.src = path;
  voiceContext.onEnded(() => {
    voiceContext.destroy();
  });
  return voiceContext;
};

/**
 * 对比版本号
 * @param ver1 {Number} 版本号1
 * @param ver2 {Number} 版本号2
 * @returns {Number} -1: 版本号1小于版本号2，0: 版本号1等于版本号2，1：版本号1大于版本号2
 */
const compareVersion = (ver1, ver2) => {
  const v1 = ver1.split('.');
  const v2 = ver2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }

  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
};

export interface AdvantagedSystemInfo extends Taro.getSystemInfoSync.Result {
  isAllScreen: boolean; // 是否为全面屏
  supportCustomNav: boolean; // 是否支持自定义导航栏
}

/**
 * 获取系统信息
 * @returns {AdvantagedSystemInfo} 系统信息
 */
export const getSystemInfo = (): AdvantagedSystemInfo => {
  // 先从缓存中取系统信息，如果存在就不再重复获取
  const info: AdvantagedSystemInfo = Cache.get(CacheKey.PHONE_SYSTEM);
  if (!info) {
    // 原系统信息
    const systemInfo = Taro.getSystemInfoSync();
    // 在系统信息的基础上增加一些自定义属性
    const advantagedSystemInfo: AdvantagedSystemInfo = {
      ...systemInfo,
      isAllScreen: false,
      supportCustomNav: true,
    };
    // 处理 h5和dd 情况
    if (process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'dd') {
      advantagedSystemInfo.supportCustomNav = false;
      advantagedSystemInfo.statusBarHeight = 20;
    }
    // 设备型号
    const { model } = advantagedSystemInfo;
    // 确定是否全面屏
    advantagedSystemInfo.isAllScreen =
      model.search(
        /iPhone10|iPhone X|iPhone11|iPhone 11|iPhone XS|iPhone XS Max|iPhone12|iPhone13/i,
      ) > -1;
    if (/unknown/.test(model) || /SE/.test(model)) {
      advantagedSystemInfo.isAllScreen = false;
    } else if (Number(advantagedSystemInfo?.statusBarHeight) > 30) {
      advantagedSystemInfo.isAllScreen = true;
    }
    // 微信小程序
    if (process.env.TARO_ENV === 'weapp') {
      // 是否支持自定义导航条
      advantagedSystemInfo.supportCustomNav =
        compareVersion(advantagedSystemInfo.version, '7.0.0') > 0;
    }
    Cache.set(CacheKey.PHONE_SYSTEM, advantagedSystemInfo);
    return advantagedSystemInfo;
  } else {
    return info;
  }
};

/**
 * 获取文件后缀名
 * @public
 * @param {string} filename - 文件名
 * @returns {string} 后缀名
 * @example
 * ```ts
 * getSuffix('demo.png') => '.png'
 * ```
 */
export function getSuffix(filename: string): string {
  const pos = filename.lastIndexOf('.');
  let suffix = '';
  if (pos !== -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
}

/**
 * 对文件名重命名
 * @public
 * @param {string} name - 文件名
 * @returns {string} 增加时间戳后的文件名
 * @example
 * ```ts
 * rename('demo.png') => 'demo_1630998340950.png'
 * ```
 */
export function rename(name: string): string {
  const suffix = getSuffix(name);
  const arr = name.split('.');
  return `${arr[0]}_${+new Date()}${suffix}`;
}
