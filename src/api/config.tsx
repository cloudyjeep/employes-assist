import useSWR from "swr";

export async function fetchAPI<T>(
  url: string,
  method = "GET",
  payload?: any
): Promise<APIResponse<T>> {
  let result: APIResponse<T> = {
    ok: false,
  };

  try {
    const req = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method != "GET" ? JSON.stringify(payload) : undefined,
    });
    const data = await req.json();
    result.status = req.status;

    if (req.ok) {
      result.ok = true;
      result.data = data;
      return result;
    }
  } catch (e) {
    result.error = e instanceof Error ? e.message : "Unknown error occurred";
  }

  return result;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDataAPI<T>(url: any) {
  return useSWR<T>(url, fetcher);
}
