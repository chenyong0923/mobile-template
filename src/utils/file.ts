import Taro from '@tarojs/taro';

import { rename, TaroSupply, Toast } from '@/utils';

/**
 * 获取 OSS 上传凭证
 * @param superKey 获取上传凭证的 superKey
 * @returns 上传凭证
 */
export const getSignature = async (superKey: string) => {
  try {
    const params = { superKey };
    // TODO: 根据业务修改获取 signature 方法
    // const res = await fn(params);
    const res: any = { ...params, success: true };
    if (res.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * 上传文件至 OSS
 * @param tempFile 临时文件
 * @param superKey 上传 OSS 用的 superKey
 * @returns 文件上传 OSS 地址
 */
export const uploadOSS = async (
  tempFile: Taro.chooseImage.ImageFile | Taro.chooseMessageFile.ChooseFile,
  superKey: string,
) => {
  // 获取上传oss参数
  const oss = await getSignature(superKey);
  if (oss) {
    // 无法获取图片名称，采用时间戳作为文件名
    const fileName = (tempFile as any)?.name
      ? rename((tempFile as Taro.chooseMessageFile.ChooseFile).name)
      : `${+new Date()}`;
    const key = `${superKey}/${fileName}`;
    const { dir, policy, accessId: OSSAccessKeyId, signature, host } = oss;
    try {
      // 上传至 oss
      const res = await TaroSupply.uploadFile({
        url: host,
        name: 'file',
        filePath: tempFile.path,
        formData: {
          dir,
          policy,
          OSSAccessKeyId,
          signature,
          key,
          success_action_status: '200',
        },
      });
      if (res) {
        // 返回文件地址
        return `${host}/${key}`;
      } else {
        Toast.info('上传失败');
      }
    } catch (e) {
      console.log('e', e);
    }
  }
};
