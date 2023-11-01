import { Component } from 'react';

import type { ReactNode } from 'react';

import '@pangu/lib-mobile/dist/style/index.less';
import '@pangu/icons-taro/dist/styles/index.css';
import '@/styles/index.scss';

class App extends Component<{ children?: ReactNode }> {
  onLaunch() {
    console.log('App start');
  }
  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
