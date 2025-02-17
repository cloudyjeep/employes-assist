export type Province = {
  id: string;
  name: string;
};

export type Regency = {
  id: string;
  name: string;
  province_id: string;
};

export type District = {
  id: string;
  name: string;
  regency_id: string;
};

export type SubDistrict = {
  id: string;
  name: string;
  district_id: string;
};

export const apiProvince = () =>
  "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json";

export const apiRegency = (provinceId: string) =>
  `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`;

export const apiDistrict = (regencyId: string) =>
  `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`;

export const apiSubDistrict = (districtId: string) =>
  `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`;
