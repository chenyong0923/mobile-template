import Taro from '@tarojs/taro';

interface ConfigsType extends Omit<Taro.AppConfig, 'pages' | 'subpackages'> {
  pages: PageType[];
  subpackages?: SubpackageType[];
}

interface PageVisible {
  DD?: boolean;
  WX?: boolean; // 包含微信和企微
}
interface PageObjType extends PageVisible {
  path: string;
}

type PageType = string | PageObjType;

interface SubpackageType extends Omit<Taro.SubPackage, 'pages'>, PageVisible {
  pages: PageType[];
}

/**
 * 获取配置
 */
const getConfigs = (props: ConfigsType) => {
  const isDingDing = process.env.TARO_ENV === 'dd';
  const { pages, subpackages, preloadRule, tabBar, ...reset } = props;
  /**
   * 是否返回该配置项
   * @param params
   */
  const isAble = (params: PageVisible & Record<string, any>) => {
    const { DD = true, WX = true } = params;
    return isDingDing ? DD : WX;
  };
  /**
   * 处理pages参数
   * @param l
   */
  const toDealPages = (l: PageType[]) => {
    return l
      .filter((item) => {
        return typeof item === 'string' || isAble(item);
      })
      .map((item) => (typeof item === 'string' ? item : item.path));
  };
  // 处理pages
  const dealPages = toDealPages(pages);
  let dealSubpackages;
  let dealPreloadRule;

  // 处理 subPackages
  if (subpackages) {
    dealSubpackages = subpackages
      ?.filter((item) => isAble(item))
      ?.map((item) => ({ ...item, pages: toDealPages(item.pages) }));
  }

  // 处理预加载
  if (preloadRule) {
    dealPreloadRule = {};
    const names = dealSubpackages.map((item) => item.name);
    Object.keys(preloadRule).forEach((key) => {
      const value = preloadRule[key];
      const l = value.packages.filter((p) => names.includes(p));
      if (l.length) {
        dealPreloadRule[key] = { ...value, packages: l };
      }
    });
  }
  let pageAndSub: any;
  if (isDingDing) {
    const temp: string[] = [];
    dealSubpackages?.forEach((item) => {
      temp.push(...item.pages.map((path) => `${item.root}/${path}`));
    });
    pageAndSub = {
      pages: [...dealPages, ...temp],
    };
  } else {
    pageAndSub = {
      pages: dealPages,
      subpackages: dealSubpackages,
      preloadRule: dealPreloadRule,
    };
  }

  return {
    ...pageAndSub,
    tabBar: tabBar
      ? {
          ...tabBar,
          list: tabBar?.list?.filter((item) =>
            dealPages.includes(item.pagePath),
          ),
        }
      : undefined,
    ...reset,
  };
};

export default getConfigs;
