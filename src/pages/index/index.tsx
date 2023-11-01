import {
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
} from '@pangu/icons-taro';
import { Button } from '@pangu/lib-mobile';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React from 'react';

import Section from '@/components/Section';
import BasicLayout from '@/layouts/BasicLayout';

import styles from './index.module.scss';

import type { FC } from 'react';

const Page: FC = () => {
  const onClick = () => {
    // 选择照片，不允许拍照
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        console.log(res);
      },
    });
  };

  return (
    <BasicLayout title="首页" className={styles.container} home>
      <Section title="title">
        <View>Hello world!</View>
      </Section>
      <Section>
        <Button type="primary" onClick={onClick}>
          Button
        </Button>
        <LeftOutlined />
        <RightOutlined />
        <UpOutlined />
        <DownOutlined />
      </Section>
    </BasicLayout>
  );
};

export default Page;
