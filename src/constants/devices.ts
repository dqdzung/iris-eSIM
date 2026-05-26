import deviceData from './devices.json';

export type CompatibleDevice = { name: string; brand: string };

export const allDevices: CompatibleDevice[] = Object.keys(deviceData)
  .flatMap((brand) =>
    deviceData[brand as keyof typeof deviceData].map((name) => ({ name, brand }))
  );
