import type { GetListParams, GetListResult, RaRecord } from "react-admin";
import type { AccountFilter, AdvertisementFilter } from "../../types";
import { listBaseUrl } from "../constants";
import type { Advertisement } from "../../types";

export const getList = async (
  resource: string,
  params: GetListParams
): Promise<GetListResult> => {
  let url;
  const per_page = params.pagination?.perPage ?? 10;
  const page = params.pagination?.page ?? 1;

  if (resource === "accounts") {
    const searchParams = new URLSearchParams();
    searchParams.set("per_page", String(per_page));
    searchParams.set("page", String(page));

    const filter = (params?.filter ?? {}) as AccountFilter;
    if (filter.company_name)
      searchParams.set("name", String(filter.company_name));
    console.log(searchParams.toString());

    url = `${listBaseUrl}/accounts?${searchParams.toString()}`;
  }

  // --- advertisements の取得処理 (既存) ---
  else if (resource === "advertisements") {
    console.log("getList advertisements params:", params);
    const filter = (params?.filter ?? {}) as AdvertisementFilter;
    const year = filter.year ?? new Date().getFullYear() + 2;
    const searchParams = new URLSearchParams();
    searchParams.set("per_page", String(per_page));
    searchParams.set("page", String(page));
    searchParams.set("year", String(year));
    if (filter.company_name)
      searchParams.set("name", String(filter.company_name));

    url = `/api/admin/advertisements?${searchParams.toString()}`;
  }

  // --- pendings の取得処理 (既存) ---
  else if (resource === "pendings") {
    url = `/api/admin/advertisements/pendings?per_page=${per_page}&page=${page}`;
  } else {
    url = `/api/list/${resource}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const json = await response.json();
  const rawData = Array.isArray(json) ? json : json.data ?? json;
  const rawTotal =
    (Array.isArray(json) ? null : json.total) ??
    (Array.isArray(rawData) ? rawData.length : 1);

  const data = (Array.isArray(rawData) ? rawData : [rawData]).map(
    (item: Record<string, unknown>) => ({
      ...item,
      id: String(item?.id),
    })
  ) as unknown as RaRecord[];

  // IDのマッピング保存処理 (既存)
  if (
    (resource === "advertisements" || resource === "pendings") &&
    Array.isArray(data)
  ) {
    data.forEach((item: unknown) => {
      const adv = item as Advertisement;
      if (adv.id != null && adv.company_id != null) {
        sessionStorage.setItem(
          `advCompany:${adv.id}`,
          String(adv.company_id)
        );
      }
    });
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: data as any,
    total: Number(rawTotal),
  };
};
