import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import React, { useMemo } from 'react';

import { getSystemInfo } from '@/utils';

import Header from './Header';

import type { CSSProperties, FC, ReactNode } from 'react';

import './index.scss';

interface BasicLayoutProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  title: ReactNode;
  action?: ReactNode; // 左上角操作按钮（优先级比 back 和 home 高）
  back?: boolean; // 操作按钮是否使用返回
  home?: boolean; // 操作按钮是否使用主页（优先级比 back 高）
  fill?: boolean; // 内容区宽度是否占满屏幕（不留 padding）
  hasTabBar?: boolean; // 是否存在 tarBar
}

const BasicLayout: FC<BasicLayoutProps> = ({
  children,
  className,
  style,
  title,
  action,
  back = true,
  home = false,
  fill = false,
  hasTabBar = false,
}) => {
  const { statusBarHeight, supportCustomNav } = useMemo(
    () => getSystemInfo(),
    [],
  );

  return (
    <View
      className={classnames(
        'g-basic-layout',
        { 'g-basic-layout-with-tab-bar': hasTabBar },
        className,
      )}
      style={style}
    >
      {supportCustomNav && (
        <Header
          statusBarHeight={statusBarHeight}
          action={action}
          back={back}
          home={home}
        >
          {title}
        </Header>
      )}
      <View
        className={classnames('g-basic-layout-content', {
          'g-basic-layout-content-fill': fill,
        })}
        style={{
          paddingTop: supportCustomNav
            ? `calc(${statusBarHeight}px + ${Taro.pxTransform(
                fill ? 96 : 120,
              )})`
            : 0,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default BasicLayout;
