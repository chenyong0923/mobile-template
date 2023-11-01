import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';

import { Toast } from './toast';

interface UseBluetoothProps {
  services?: string[]; // 设备服务 uuid
  serviceUUID: string; // 设备通信用的服务 uuid
  characteristicUUID: string; // 设备通信用的特征值 uuid
}

type IDevice =
  | Taro.getBluetoothDevices.SuccessCallbackResultBlueToothDevice
  | Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice;

const useBluetooth = ({
  services = [],
  serviceUUID,
  characteristicUUID,
}: UseBluetoothProps) => {
  // 搜索到的蓝牙设备列表
  const [deviceList, setDeviceList] = useState<IDevice[]>([]);

  useEffect(() => {
    openBluetoothAdapter();
  }, []);

  // 连接蓝牙设备错误码
  const errorCodeMap = {
    10000: '未初始化蓝牙适配器',
    10001: '当前蓝牙适配器不可用',
    10002: '没有找到指定设备',
    10003: '连接失败',
    10004: '没有找到指定服务',
    10005: '没有找到指定特征',
    10006: '当前连接已断开',
    10007: '当前特征不支持此操作',
    10008: '其余所有系统上报的异常',
    10012: '连接超时',
  };

  // 初始化蓝牙模块
  const openBluetoothAdapter = () => {
    Taro.showLoading({ title: '加载中', mask: true });
    Taro.openBluetoothAdapter({
      success() {
        getBluetoothAdapterState();
      },
      fail(state) {
        const { errCode } = state;
        Toast.info(errorCodeMap[errCode]);
      },
      complete() {
        Taro.hideLoading();
      },
    });
  };

  // 检测蓝牙是否可用
  const getBluetoothAdapterState = () => {
    Taro.getBluetoothAdapterState({
      success(res) {
        if (res.available) {
          startBluetoothDevicesDiscovery();
          return;
        }
        Toast.info('蓝牙不可用');
      },
      fail() {
        Toast.info('蓝牙不可用');
      },
    });
  };

  // 搜索设备
  const startBluetoothDevicesDiscovery = () => {
    Taro.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false, // 是否允许重复上报同一设备
      services,
      success() {
        getBluetoothDevices();
      },
    });
  };

  // 获取搜索的蓝牙设备
  const getBluetoothDevices = () => {
    Taro.getBluetoothDevices({
      // 获取目前搜索到全部的蓝牙设备（只执行一次）
      success(res) {
        const { devices } = res;
        saveDevices(devices);
      },
    });

    Taro.onBluetoothDeviceFound((res) => {
      // 监听搜索的蓝牙-不断的寻找新的设备
      const { devices } = res;
      saveDevices(devices);
    });
  };

  // 保存搜索到的蓝牙设备
  const saveDevices = (devices: IDevice[]) => {
    setDeviceList((prev) => {
      const newDevices = devices.filter((device) => {
        return !prev.some((item) => item.deviceId === device.deviceId);
      });
      return prev.concat(newDevices);
    });
  };

  // 连接设备
  const createBLEConnection = (deviceId: string) => {
    Taro.createBLEConnection({
      deviceId,
      success() {
        getBLEDeviceServices(deviceId);
      },
      fail(state) {
        const { errCode } = state;
        Toast.info(errorCodeMap[errCode]);
      },
    });
  };

  // 获取蓝牙外围设备的服务
  const getBLEDeviceServices = (deviceId: string) => {
    Taro.getBLEDeviceServices({
      deviceId, // 搜索到设备的 deviceId
      success() {
        getBLEDeviceCharacteristics(deviceId);
      },
    });
  };

  // 获取蓝牙特征值
  const getBLEDeviceCharacteristics = (deviceId: string) => {
    Taro.getBLEDeviceCharacteristics({
      deviceId,
      serviceId: serviceUUID,
      success() {
        notifyBLECharacteristicValueChange(deviceId);
      },
    });
  };

  // 启用蓝牙notify功能，用来监听蓝牙之间的数据传输
  const notifyBLECharacteristicValueChange = (deviceId: string) => {
    Taro.notifyBLECharacteristicValueChange({
      deviceId,
      serviceId: serviceUUID,
      characteristicId: characteristicUUID,
      state: true,
      complete(res) {
        console.log('notifyBLECharacteristicValueChange', res);
      },
    });
  };

  // 监听数据变化
  const onBLECharacteristicValueChange = (
    cb: (val: Taro.onBLECharacteristicValueChange.CallbackResult) => void,
  ) => {
    Taro.onBLECharacteristicValueChange((res) => {
      cb(res);
    });
  };

  return {
    deviceList, // 搜索到的蓝牙设备列表
    createBLEConnection, // 连接设备
    onBLECharacteristicValueChange, // 监听数据变化
  };
};

export default useBluetooth;
