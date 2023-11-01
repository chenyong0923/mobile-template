import { HomeOutlined, LeftOutlined } from '@pangu/icons-taro';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React from 'react';

import { RouterUtil } from '@/utils';

import type { FC, ReactNode } from 'react';

import './index.scss';

interface HeaderProps {
  children?: ReactNode;
  statusBarHeight?: number;
  back?: boolean;
  home?: boolean;
  action?: ReactNode;
}

const prefix = 'g-basic-layout-header';

const Header: FC<HeaderProps> = ({
  statusBarHeight,
  back,
  home,
  action,
  children,
}) => {
  // 渲染操作按钮
  const renderAction = () => {
    // 如果存在自定义渲染方式则直接渲染
    if (action) return action;
    // 首页
    if (home) {
      return (
        <HomeOutlined
          className={`${prefix}-action-icon`}
          onClick={() => RouterUtil.closeAllTo('/pages/index/index')}
        />
      );
    } else if (back) {
      // 返回键
      return (
        <LeftOutlined
          className={`${prefix}-action-icon`}
          onClick={() => RouterUtil.navigateBack()}
        />
      );
    }
  };

  return (
    <View
      className={`${prefix}`}
      style={{
        paddingTop: `${statusBarHeight}px`,
      }}
    >
      <View
        className={`${prefix}-content`}
        style={{
          // 高度固定96
          height: Taro.pxTransform(96),
        }}
      >
        <View className={`${prefix}-action`}>{renderAction()}</View>
        <View className={`${prefix}-title`}>{children}</View>
      </View>
    </View>
  );
};

export default Header;
