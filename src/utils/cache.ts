/**
 * 全局存储
 */
import Taro from '@tarojs/taro';

export enum CacheKey {
  PHONE_SYSTEM = 'phone_system',
}

export class Cache {
  static get(key: CacheKey) {
    return Taro.getStorageSync(key);
  }

  static set(key: CacheKey, data: any, isSync = false) {
    if (isSync) {
      Taro.setStorage({ key, data });
    } else {
      Taro.setStorageSync(key, data);
    }
  }

  static remove(key: CacheKey) {
    Taro.removeStorageSync(key);
  }
}
