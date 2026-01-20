import type { CreateParams, CreateResult } from "react-admin";
import type { Advertisement, Requirement } from "../../types";
import { listBaseUrl } from "../constants";
import {
  logDP,
  toNumber,
  toStringSafe,
  toOptionalNumber,
} from "../../utils/helpers";

export const create = async (
  resource: string,
  params: CreateParams
): Promise<CreateResult> => {
  let url: string;
  let dataToSubmit: Record<string, unknown> = {};

  if (resource === "accounts") {
    // 管理画面でアカウントを作成
    url = `${listBaseUrl}/accounts`; // /api/admin/companies/accounts
    dataToSubmit = {
      ...params.data,
    };
  } else if (resource === "advertisements") {
    // 管理画面で求人票を作成
    const advertisementData = params.data as Advertisement;
    const companyId = advertisementData.company_id;
    if (!companyId) {
      console.error("company_id が指定されていません:", params.data);
      throw new Error(
        "company_id が指定されていません。求人票作成フォームに company_id が必要です。"
      );
    }

    url = `/api/companies/${companyId}/advertisements`;

    dataToSubmit = {
      ...advertisementData,
      tag_ids: Array.isArray(advertisementData.tag_ids)
        ? advertisementData.tag_ids.map(Number)
        : [],
    };
    console.log("Creating advertisement with data:", dataToSubmit);
  } else if (resource === "requirements") {
    const requirementData = params.data as Requirement;
    const companyId = requirementData.company_id;
    const advId = requirementData.advertisement_id;

    if (!companyId) {
      throw new Error("company_id が指定されていません。");
    }
    if (!advId) {
      throw new Error("advertisement_id が指定されていません。");
    }

    url = `/api/companies/${companyId}/advertisements/${advId}/requirements`;

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
      advertisement_id: Number(advId),
      job_category_id: toNumber(requirementData.job_category_id),

      // 文字列系 (undefined対策)
      recruitment_flow: toStringSafe(requirementData.recruitment_flow),
      employment_status: toStringSafe(requirementData.employment_status),
      required_days: toStringSafe(requirementData.required_days),
      trial_period: toStringSafe(requirementData.trial_period),
      working_hours: toStringSafe(requirementData.working_hours),
      note: toStringSafe(requirementData.note),

      // 数値系
      recruiting_count: toNumber(requirementData.recruiting_count),
      starting_salary_first: toNumber(
        requirementData.starting_salary_first
      ),
      starting_salary_second: toNumber(
        requirementData.starting_salary_second
      ),
      starting_salary_third: toNumber(
        requirementData.starting_salary_third
      ),
      starting_salary_fourth: toNumber(
        requirementData.starting_salary_fourth
      ),
      salary_increase: toNumber(requirementData.salary_increase),
      bonus: toNumber(requirementData.bonus),
      holiday_leave: toNumber(requirementData.holiday_leave),

      // Boolean(Varchar)系 "あり"/"なし"
      flex: requirementData.flex,
      employee_dormitory: requirementData.employee_dormitory,
      contract_housing: requirementData.contract_housing,

      // 配列系
      submission_objects_id: Array.isArray(
        requirementData.submission_objects_id
      )
        ? requirementData.submission_objects_id.map(Number)
        : [],

      prefecture_id: Array.isArray(requirementData.prefecture_id)
        ? requirementData.prefecture_id.map(Number)
        : requirementData.prefecture_id
        ? [toNumber(requirementData.prefecture_id)]
        : [],

      welfare_benefits_id: Array.isArray(
        requirementData.welfare_benefits_id
      )
        ? requirementData.welfare_benefits_id.map(Number)
        : [],

      // 1行=1手当（first〜fourthを同一オブジェクトで送る）
      various_allowances: processedAllowances,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    delete dataToSubmit.company_id;

    console.log("Creating requirement with data:", dataToSubmit);
  } else {
    throw new Error(
      `リソース ${resource} の作成はサポートされていません。`
    );
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CREATE Error (${resource}):`, errorText);
      throw new Error(
        `作成に失敗しました: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();
    console.log(`CREATE Success (${resource}):`, responseData);

    if (resource === "advertisements") {
      const createdId = responseData?.id;
      const companyId = params.data.company_id;
      if (createdId != null && companyId != null) {
        sessionStorage.setItem(
          `advCompany:${createdId}`,
          String(companyId)
        );
        logDP("Saved advCompany (create)", { id: createdId, companyId });
      }
    }

    if (resource === "requirements") {
      const createdId = responseData?.id;
      const advId = params.data.advertisement_id;
      const companyId = params.data.company_id;
      if (createdId != null && advId != null && companyId != null) {
        sessionStorage.setItem(`reqAdv:${createdId}`, String(advId));
        sessionStorage.setItem(
          `reqCompany:${createdId}`,
          String(companyId)
        );
        sessionStorage.setItem(`advCompany:${advId}`, String(companyId));
      }
    }

    return { data: { ...responseData, id: responseData.id } };
  } catch (error) {
    console.error("CREATE Request error:", error);
    throw error;
  }
};
