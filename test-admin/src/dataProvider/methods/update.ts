import type { UpdateParams, UpdateResult } from "react-admin";
import type { Company, Advertisement, Requirement } from "../../types";
import { listBaseUrl } from "../constants";
import {
  logDP,
  toNumber,
  toStringSafe,
  toOptionalNumber,
} from "../../utils/helpers";

export const update = async (
  resource: string,
  params: UpdateParams
): Promise<UpdateResult> => {
  const { id, data } = params;
  let url;
  let dataToSubmit;
  if (resource === "accounts") {
    dataToSubmit = {
      ...data,
    };
    url = `${listBaseUrl}/${id}/accounts`;
  } else if (resource === "company") {
    if (!id) throw new Error("id is required");
    url = `/api/companies/${id}`;
    console.log(data);

    const industryIdsNum: number[] = Array.isArray(
      (data as Company).industry_ids
    )
      ? ((data as Company).industry_ids || []).map(toNumber)
      : (data as Company).industry_ids
      ? [toNumber((data as Company).industry_ids)]
      : [];
    dataToSubmit = {
      ...data,
      industry_id: industryIdsNum,
      updated_at: new Date().toISOString(),
    };
    delete (dataToSubmit as Record<string, unknown>).industry_ids;
  } else if (resource === "advertisements") {
    const advertisementData = data as Advertisement;
    url = `/api/companies/${advertisementData.company_id}/advertisements/${id}`;
    dataToSubmit = {
      ...advertisementData,
      tag_ids: Array.isArray(advertisementData.tag_ids)
        ? advertisementData.tag_ids.map(Number)
        : advertisementData.tag_ids || [],
    };
  } else if (resource === "requirements") {
    const requirementData = data as Requirement;
    const advId =
      requirementData.advertisement_id ??
      sessionStorage.getItem(`reqAdv:${id}`);
    const companyId =
      requirementData.company_id ??
      sessionStorage.getItem(`reqCompany:${id}`) ??
      (advId ? sessionStorage.getItem(`advCompany:${advId}`) : null);

    if (!advId) throw new Error("求人票IDが不明です");

    url = `/api/companies/${companyId}/advertisements/${advId}/requirements/${id}`;
    const processedAllowances = Array.isArray(
      requirementData.various_allowances
    )
      ? requirementData.various_allowances
          .map((item: Record<string, unknown>) => {
            const name = toStringSafe(item.name).trim();
            const first_allowance = toOptionalNumber(item.first_allowance);
            const second_allowance = toOptionalNumber(
              item.second_allowance
            );
            const third_allowance = toOptionalNumber(item.third_allowance);
            const fourth_allowance = toOptionalNumber(
              item.fourth_allowance
            );

            return {
              name,
              first_allowance,
              second_allowance,
              third_allowance,
              fourth_allowance,
            };
          })
          .filter((row: Record<string, unknown>) => {
            return (
              row.name !== "" ||
              row.first_allowance !== null ||
              row.second_allowance !== null ||
              row.third_allowance !== null ||
              row.fourth_allowance !== null
            );
          })
      : [];
    dataToSubmit = {
      ...requirementData,
      job_category_id: toNumber(data.job_category_id),
        submission_objects_id: Array.isArray(data.submission_objects_id)
          ? data.submission_objects_id.map(Number)
          : [],

        prefecture_id: Array.isArray(data.prefecture_id)
          ? data.prefecture_id.map(Number)
          : data.prefecture_id
          ? [toNumber(data.prefecture_id)]
          : [],

        welfare_benefits_id: Array.isArray(data.welfare_benefits_id)
          ? data.welfare_benefits_id.map(Number)
          : [],
        various_allowances: processedAllowances,
        updated_at: new Date().toISOString(),
    };
  } else {
    url = `${listBaseUrl}/${id}`;
    dataToSubmit = data;
  }
  console.log("dataToSubmit : ",dataToSubmit);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`);

    const responseText = await response.text();

    if (!responseText) {
      logDP("Update response body for ${resource} is empty");
      return { data: { ...data, id: id, _full: true } };
    }

    const responseData = JSON.parse(responseText);

    return {
      data: {
        ...responseData,
        ...data,
        id: responseData.id ?? id,
        _full: true,
      },
    };
  } catch (error) {
    console.error("UPDATE Request error:", error);
    throw error;
  }
};
