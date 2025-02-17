export type Employee = {
  id: string;
  nama: string;
  jalan: string;
  provinsi?: { id: string; name: string };
  kabupaten?: { id: string; name: string };
  kecamatan?: { id: string; name: string };
  kelurahan?: { id: string; name: string };
};

export const apiEmployee = () =>
  `https://61601920faa03600179fb8d2.mockapi.io/pegawai`;
