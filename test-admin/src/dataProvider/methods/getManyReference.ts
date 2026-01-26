import type { GetManyReferenceParams, GetManyReferenceResult, Identifier, DataProvider } from "react-admin";
import { logDP } from "../../utils/helpers";
import type { AdvertisementFilter, Requirement } from "../../types";

export const getManyReference = async (
  baseProvider: DataProvider,
  resource: string,
  params: GetManyReferenceParams
): Promise<GetManyReferenceResult> => {
  if (resource === "advertisements") {
    const companyId =
      (params as { id?: Identifier }).id ??
      (params as { filter?: AdvertisementFilter }).filter?.company_id;
    if (!companyId) throw new Error("company_id が指定されていません");

    const url = `/api/companies/${companyId}/advertisements`;
    logDP("GET", url);

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch advertisements: ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json();
    const rawData = Array.isArray(json) ? json : json?.data ?? [];

    const data = (Array.isArray(rawData) ? rawData : []).map(
      (item: Record<string, unknown>) => ({
        ...item,
        id: String(item?.id),
      })
    );

    data.forEach((item: Record<string, unknown>) => {
      if (item?.id != null) {
        sessionStorage.setItem(
          `advCompany:${item.id}`,
          String(companyId)
        );
      }
    });

    const total =
      typeof (json as { total?: number })?.total === "number"
        ? (json as { total: number }).total
        : data.length;

    return { data, total };
  }

  if (resource === "requirements") {
    const advertisementId =
      (params as { id?: Identifier }).id ??
      (params as { targetId?: Identifier }).targetId ??
      (params as { filter?: AdvertisementFilter }).filter
        ?.advertisement_id;

    logDP("getManyReference requirements params", params, {
      advertisementId,
    });

    if (!advertisementId)
      throw new Error("advertisement_id が指定されていません");

    const companyId = sessionStorage.getItem(
      `advCompany:${advertisementId}`
    );
    logDP("sessionStorage advCompany", {
      [`advCompany:${advertisementId}`]: companyId,
    });

    if (!companyId)
      throw new Error(
        "company_id が不明です。広告一覧からレコードを開いてください。"
      );

    const url = `/api/companies/${companyId}/advertisements/${advertisementId}/requirements`;
    logDP("GET", url);

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    logDP("resp", response.status, response.statusText);

    if (!response.ok)
      throw new Error(
        `Failed to fetch requirements: ${response.statusText}`
      );
    const data = await response.json();
    logDP("data len", Array.isArray(data) ? data.length : 0);

    if (Array.isArray(data)) {
      data.forEach((req: Requirement) => {
        if (req?.id != null) {
          sessionStorage.setItem(
            `reqAdv:${req.id}`,
            String(advertisementId)
          );
          sessionStorage.setItem(
            `reqCompany:${req.id}`,
            String(companyId)
          );
        }
      });
    }

    return { data, total: Array.isArray(data) ? data.length : 0 };
  }
  return baseProvider.getManyReference(resource, params);
};
