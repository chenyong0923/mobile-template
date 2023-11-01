import { View } from '@tarojs/components';
import classNames from 'classnames';
import React from 'react';

import type { CSSProperties, FC, ReactNode } from 'react';

import './index.scss';

interface SectionProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  title?: string;
}

const Section: FC<SectionProps> = ({ className, style, children, title }) => {
  return (
    <View className={classNames('m-section', className)} style={style}>
      {title && <View className="m-section-header">{title}</View>}
      <View className="m-section-content">{children}</View>
    </View>
  );
};

export default Section;
