const path = require('path');

const config = {
  projectName: 'template-mobile',
  date: '2023-03-06',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
  },
  compiler: 'webpack5',
  cache: {
    enable: true,
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    optimizeMainPackage: {
      enable: true,
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    esnextModules: ['@pangu/lib-mobile'],
    devServer: {
      proxy: {
        '/api': {
          target: 'http://mock.lanseyizhan.com',
          pathRewrite: {
            '^/api': '',
          },
        },
      },
    },
  },
};

module.exports = function (merge) {
  let configTemp;
  if (process.env.CUSTOM_ENV === 'dev') {
    configTemp = merge({}, config, require('./dev'));
  } else if (process.env.CUSTOM_ENV === 'test') {
    configTemp = merge({}, config, require('./test'));
  } else if (process.env.CUSTOM_ENV === 'release') {
    configTemp = merge({}, config, require('./release'));
  } else if (process.env.CUSTOM_ENV === 'pre') {
    configTemp = merge({}, config, require('./pre'));
  } else {
    configTemp = merge({}, config, require('./prod'));
  }
  if (process.env.TARO_ENV === 'dd') {
    configTemp = merge({}, configTemp, {
      plugins: ['@tarojs/plugin-platform-alipay-dd'],
    });
  }
  return configTemp;
};
