import type { DeleteParams, DeleteResult } from "react-admin";
import type { Advertisement, Requirement } from "../../types";
import { listBaseUrl } from "../constants";

export const deleteOne = async (
  resource: string,
  params: DeleteParams
): Promise<DeleteResult> => {
  const { id, previousData } = params;
  let url: string;

  if (resource === "accounts") {
    url = `${listBaseUrl}/${id}/accounts`;
  } else if (resource === "advertisements") {
    const companyId =
      (previousData as unknown as Record<string, unknown>) &&
      typeof previousData === "object" &&
      "company_id" in (previousData as Record<string, unknown>)
        ? (previousData as unknown as Advertisement).company_id
        : sessionStorage.getItem(`advCompany:${id}`);

    if (!companyId) {
      throw new Error(
        "company_id が不明です。求人票一覧からレコードを開いてください。"
      );
    }
    url = `/api/companies/${companyId}/advertisements/${id}`;
  } else if (resource === "requirements") {
    const advId =
      (previousData as unknown as Requirement).advertisement_id ??
      sessionStorage.getItem(`reqAdv:${id}`);
    const companyId =
      (previousData as unknown as Requirement).company_id ??
      sessionStorage.getItem(`reqCompany:${id}`) ??
      (advId ? sessionStorage.getItem(`advCompany:${advId}`) : null);

    if (!advId || !companyId) {
      throw new Error(
        "参照情報が不足しています。求人票から募集要項を開いてください。"
      );
    }
    url = `/api/companies/${companyId}/advertisements/${advId}/requirements/${id}`;
  } else {
    throw new Error(`リソース ${resource} の削除はサポートされていません。`);
  }
  console.log("DELETE URL:", url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        `DELETE failed: ${response.status} ${response.statusText} - ${errText}`
      );
    }

    // 成功時のレスポンスをログに出力
    console.log("DELETE Success Response:", await response.json());

    // RecordType に準拠する形でデータを返す
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { data: { id } as any };
  } catch (error) {
    // ネットワークエラーやその他のエラーをキャッチ
    console.error("DELETE Request Failed:", error);
    throw error; // エラーを再スローして呼び出し元で処理
  }
};
