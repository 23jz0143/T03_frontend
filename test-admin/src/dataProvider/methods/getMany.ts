import type { GetManyParams, GetManyResult, Identifier, RaRecord } from "react-admin";
import { logDP } from "../../utils/helpers";

export const getMany = async (
  resource: string,
  params: GetManyParams
): Promise<GetManyResult> => {
  const { ids } = params;
  logDP(`getMany called for ${resource}`, params);

  const selectionParamMap: { [key: string]: string } = {
    industries: "industry_ids",
    tags: "tag_ids",
    job_categories: "job_category_ids",
    prefectures: "prefecture_ids",
    welfare_benefits: "welfare_benefit_ids",
    submission_objects: "submission_objects_ids",
  };

  const paramName = selectionParamMap[resource];
  let url = `/api/list/${resource}`;

  if (paramName) {
    const queryString = (ids ?? [])
      .map(
        (id: Identifier) => `${paramName}=${encodeURIComponent(String(id))}`
      )
      .join("&");

    url = `/api/list/${resource}/selection?${queryString}`;
    console.log(`getMany fetching ${resource} with URL:`, url);

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(
        `getMany error for ${resource}, status: ${response.status}`
      );
    }
    const text = await response.text();
    const json = text ? JSON.parse(text) : [];

    const data = Array.isArray(json)
      ? json.map((item: Record<string, unknown>) => ({
          ...item,
          id: String(item.id),
        }))
      : [];

    return { data };
  }

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();

  const stringIds = ids.map(String);
  const data = Array.isArray(json)
    ? json.filter((item: RaRecord) => stringIds.includes(String(item.id)))
    : [];

  logDP(`getMany result for ${resource}`, data);

  return { data };
};
