export const lower = (value: any): string =>
  String(value || "").toLocaleLowerCase();

export function parseJSON<T>(value: any): T | null {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    return null;
  }
}

function camelCaseReplacer(match: string) {
  return match.toUpperCase();
}

export const camelCase = (str: any): string => {
  const arr = String(str || "").split(" ");
  let result = "";

  for (let i = 0; i < arr.length; i++) {
    result += `${i ? " " : ""}${
      arr[i].length > 3
        ? arr[i].toLowerCase().replace(/\b(\w)/g, camelCaseReplacer)
        : arr[i]
    }`;
  }

  return result;
};

export const toQueryParams = (params: object): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

export const isFn = (value: any) => typeof value === "function";
export const isStr = (value: any) => typeof value === "string";
export const isArray = (value: any) => Array.isArray(value);
