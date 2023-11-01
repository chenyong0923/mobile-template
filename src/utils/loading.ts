import Taro from '@tarojs/taro';

export class Loading {
  static show(option?: Partial<Taro.showLoading.Option>) {
    const { title = 'loading...', mask = true, ...rest } = option || {};
    Taro.showLoading({
      title,
      mask,
      ...rest,
    });
  }

  static hide() {
    Taro.hideLoading();
  }
}
