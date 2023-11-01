import Taro from '@tarojs/taro';
import qs from 'qs';

export class RouterUtil {
  /**
   * 路由跳转
   * @param target {String} 目标路由地址
   * @param params {{[key: string]: any}} 路由参数
   */
  static navigateTo(target: string, params: { [key: string]: any } = {}) {
    const url = this.formatUrl(target, params);
    Taro.navigateTo({ url });
  }

  /**
   * 路由重定向
   * @param target {String} 目标路由地址
   * @param params {{[key: string]: any}} 路由参数
   */
  static redirectTo(target: string, params: { [key: string]: any } = {}) {
    const url = this.formatUrl(target, params);
    Taro.redirectTo({ url });
  }

  /**
   * 返回
   * @param delta {Number} 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
   */
  static navigateBack(delta = 1) {
    Taro.navigateBack({ delta });
  }

  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   * @param target {String} 目标路由地址
   * @param params {{[key: string]: any}} 路由参数
   */
  static switchTab(target: string, params: { [key: string]: any } = {}) {
    const url = this.formatUrl(target, params);
    Taro.switchTab({ url });
  }

  /**
   * 关闭所有页面，打开到应用内的某个页面
   * @param target {String} 目标路由地址
   * @param params {{[key: string]: any}} 路由参数
   */
  static reLaunch(target: string, params: { [key: string]: any } = {}) {
    const url = this.formatUrl(target, params);
    Taro.reLaunch({ url });
  }

  /**
   * 关闭所有页面并跳转
   * @param target {String} 目标路由地址
   * @param params {{[key: string]: any}} 路由参
   */
  static closeAllTo(target: string, params: { [key: string]: any } = {}) {
    try {
      this.reLaunch(target, params);
    } catch (e) {
      try {
        this.switchTab(target, params);
      } catch (error) {
        console.log('error', error);
      }
    }
  }

  /**
   * 格式化 url
   * @param params {{[key: string]: any}} 路由参数
   * @returns {String} 格式化后的参数
   * @example
   * ```ts
   * formatParams({ id: 1, text: 'text' })
   * // '?id=1&text=text'
   * ```
   */
  private static formatUrl(
    target: string,
    params: { [key: string]: any } = {},
  ): string {
    const { url, ...rest } = params;
    const paramsString = qs.stringify(rest);
    return `${target}${paramsString ? `?${paramsString}` : ''}`;
  }
}
