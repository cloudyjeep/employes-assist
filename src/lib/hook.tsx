import { SetStateAction, useEffect, useMemo, useState } from "react";
import { isArray, isFn, isStr, toQueryParams } from "./utils";
import { useDataAPI } from "../api/config";

export function useDataPagination<T, S extends object = {}>(
  api: any,
  limit = 10
) {
  const [queries, setQueries] = useState<S>({} as S);
  const [page, setPage] = useState(1);

  const act = useMemo(
    () => ({
      url(page: number) {
        if (isFn(api)) {
          return `${api()}?${toQueryParams({ ...queries, limit, page })}`;
        }
        if (isStr(api)) {
          return `${api}?${toQueryParams({ ...queries, limit, page })}`;
        }
        return null;
      },
      position(index: number): number {
        return (page - 1) * limit + (index + 1);
      },
    }),
    [api, limit, page, queries]
  );

  const event = useMemo(
    () => ({
      prev() {
        setPage((p) => p - 1);
      },
      next() {
        setPage((p) => p + 1);
      },
      search(queries: SetStateAction<S>) {
        setPage(1);
        setQueries(queries);
      },
      resolve(data: any): T[] {
        if (isArray(data)) return data;
        return [];
      },
    }),
    [setPage, setQueries]
  );

  const payload = useDataAPI<T[]>(() => act.url(page));

  const prev = useDataAPI<T[]>(() => act.url(Math.max(1, page - 1)));

  const next = useDataAPI<T[]>(() => act.url(page + 1));

  const data = event.resolve(payload.data);

  return {
    ...payload,
    data,
    empty: !data.length,
    page,
    limit,
    queries,
    position: act.position,
    search: event.search,
    prev: {
      disabled: prev.isLoading || page <= 1,
      onClick: event.prev,
    },
    next: {
      disabled: next.isLoading || !event.resolve(next.data).length,
      onClick: event.next,
    },
  };
}

export const useIsMobile = () => {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const resize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return width <= 768;
};
