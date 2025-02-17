import React, { ForwardedRef, PropsWithChildren } from "react";

declare global {
  type Props<T> = Partial<T> & PropsWithChildren;

  type PropsExact<T> = T & PropsWithChildren;

  type FC<T> = React.FC<Props<T>>;

  type FCExact<T> = React.FC<PropsExact<T>>;

  type APIResponse<T> = Partial<{
    status: number;
    ok: boolean;
    error: string;
    data: T;
  }>;
}

export {}; // Wajib ditambahkan agar ini dianggap sebagai modul
