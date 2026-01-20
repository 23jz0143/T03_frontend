import type { GetOneParams, GetOneResult, Identifier } from "react-admin";
import { logDP } from "../../utils/helpers";
import { listBaseUrl } from "../constants";
import type { Company, Tag, Industry } from "../../types";

export const getOne = async (
  resource: string,
  params: GetOneParams
): Promise<GetOneResult> => {
  logDP("getOne called with resource:", resource, "params:", params);

  let url = "";
  let currentAdvId: string | null = null;

  // --- URL組み立て ---
  if (resource === "accounts") {
    const { id } = params as { id: Identifier };
    if (!id) throw new Error("ID is required");
    url = `${listBaseUrl}/${id}/accounts`;
  } else if (resource === "pendings") {
    const { id } = params as { id: Identifier }; // id = advertisement_id
    if (!id) throw new Error("id is required");

    const companyId = sessionStorage.getItem(`advCompany:${id}`);
    if (!companyId) {
      throw new Error(
        "company_id が不明です。公開許可待ち一覧からレコードを開いてください。"
      );
    }
    sessionStorage.setItem(`advFrom:${id}`, "pendings");

    url = `/api/companies/${companyId}/advertisements/${id}`;
  } else if (resource === "advertisements") {
    const { id } = params as { id: Identifier };
    if (!id) throw new Error("ID is required for getOne operation");

    // 一覧取得時に保存している companyId を利用
    const companyId = sessionStorage.getItem(`advCompany:${id}`);
    if (!companyId) {
      throw new Error(
        "company_id が不明です。一覧からレコードを開いてください。"
      );
    }
    url = `/api/companies/${companyId}/advertisements/${id}`;
  } else if (resource === "requirements") {
    const { id } = params as { id: Identifier };
    if (!id) throw new Error("id is required");

    const advId = sessionStorage.getItem(`reqAdv:${id}`);
    currentAdvId = advId;

    const companyId =
      sessionStorage.getItem(`reqCompany:${id}`) ||
      (advId ? sessionStorage.getItem(`advCompany:${advId}`) : null);

    logDP("getOne requirements", { id, advId, companyId });

    if (!advId || !companyId) {
      throw new Error(
        "参照情報が不足しています。求人票から募集要項を開いてください。"
      );
    }

    url = `/api/companies/${companyId}/advertisements/${advId}/requirements/${id}`;
  } else if (resource === "company") {
    const { id } = params as { id: Identifier };
    if (!id) throw new Error("id is required");
    url = `/api/companies/${id}`;
  } else {
    // それ以外は従来通り（必要なら調整）
    url = `/api/${resource}/${(params as { id: Identifier }).id}`;
  }

  sessionStorage.setItem("lastFetchedUrl", url);
  logDP("GET", url);

  const response = await fetch(url, {
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
  });

  if (response.status < 200 || response.status >= 300) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || response.statusText);
  }

  const data = (await response.json()) as Record<string, unknown>;

  // --- advertisements: tags -> tag_ids（編集画面用） ---
  if (resource === "advertisements") {
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      try {
        const tagsRes = await fetch("/api/list/tags");
        if (tagsRes.ok) {
          const tagsList = await tagsRes.json();

          const ids = data.tags
            .map((tagName: string) => {
              const found = tagsList.find(
                (tag: Tag) => tag.tag_name === tagName
              );
              return found ? found.id : null;
            })
            .filter((id: Identifier | null) => id !== null);

          data.tag_ids = ids;
          logDP("Mapped tags to tag_ids:", ids);
        }
      } catch (e) {
        console.error("Failed to fetch tags for mapping:", e);
      }
    }
  }

  // --- requirements: 参照リスト名 -> *_id へ変換（編集画面用） ---
  if (resource === "requirements" && currentAdvId) {
    data.advertisement_id = currentAdvId;

    try {
      const [jobCatsRes, subObjsRes, prefsRes, welfaresRes] =
        await Promise.all([
          fetch("/api/list/job_categories"),
          fetch("/api/list/submission_objects"),
          fetch("/api/list/prefectures"),
          fetch("/api/list/welfare_benefits"),
        ]);

      const jobCats = jobCatsRes.ok ? await jobCatsRes.json() : [];
      const subObjs = subObjsRes.ok ? await subObjsRes.json() : [];
      const prefs = prefsRes.ok ? await prefsRes.json() : [];
      const welfares = welfaresRes.ok ? await welfaresRes.json() : [];

      const findIdByName = (
        list: Record<string, unknown>[],
        nameVal: unknown,
        possibleKeys: string[]
      ) => {
        if (!nameVal || !Array.isArray(list)) return null;
        const searchStr = String(nameVal).trim();

        let found = list.find((item) =>
          possibleKeys.some(
            (key) => item[key] && String(item[key]) === searchStr
          )
        );

        if (!found) {
          found = list.find((item) =>
            Object.values(item).some((val) => String(val) === searchStr)
          );
        }

        return found ? (found.id as Identifier) : null;
      };

      // job_category (職種)
      if (!data.job_category_id) {
        const searchName =
          data.job_categories_name ||
          data.job_category_name ||
          data.job_category;
        if (searchName) {
          const mappedId = findIdByName(jobCats, searchName, [
            "name",
            "job_category_name",
            "job_categories_name",
          ]);
          if (mappedId) data.job_category_id = mappedId;
        }
      }

      // submission_objects (提出物)
      if (
        !data.submission_objects_id ||
        (data.submission_objects_id as unknown[]).length === 0
      ) {
        const subNames =
          data.submission_objects || data.submission_object_names;
        data.submission_objects_id = Array.isArray(subNames)
          ? subNames
              .map((name: unknown) =>
                findIdByName(subObjs, name, [
                  "name",
                  "submission_object_name",
                ])
              )
              .filter((id: Identifier | null) => id !== null)
          : [];
      }

      // prefecture (都道府県)
      if (
        !data.prefecture_id ||
        (data.prefecture_id as unknown[]).length === 0
      ) {
        const prefNames = data.prefectures || data.prefecture_names;
        if (Array.isArray(prefNames)) {
          data.prefecture_id = prefNames
            .map((name: unknown) =>
              findIdByName(prefs, name, ["name", "prefecture_name"])
            )
            .filter((id: Identifier | null) => id !== null);
        } else {
          data.prefecture_id = [];
        }
      }

      // welfare_benefits (福利厚生)
      if (
        !data.welfare_benefits_id ||
        (data.welfare_benefits_id as unknown[]).length === 0
      ) {
        const welNames = data.welfare_benefits || data.welfare_benefit_names;
        data.welfare_benefits_id = Array.isArray(welNames)
          ? welNames
              .map((name: unknown) =>
                findIdByName(welfares, name, ["name", "welfare_benefit_name"])
              )
              .filter((id: Identifier | null) => id !== null)
          : [];
      }

      logDP("Mapped requirement IDs:", {
        job: data.job_category_id,
        sub: data.submission_objects_id,
        pref: data.prefecture_id,
        wel: data.welfare_benefits_id,
      });
    } catch (e) {
      console.error("Failed to fetch lists for requirements mapping:", e);
    }
  }

  // --- company: industry_names -> industry_id（編集画面用） ---
  if (resource === "company") {
    const companyId = (params as { id: Identifier }).id;
    if (!data.id) data.id = companyId;

    const companyData = data as Company;

    if (
      Array.isArray(data.industry_names) &&
      data.industry_names.length > 0
    ) {
      try {
        const industriesRes = await fetch("/api/list/industries");
        if (industriesRes.ok) {
          const industriesList = await industriesRes.json();

          const ids = data.industry_names
            .map((name: string) => {
              const found = industriesList.find(
                (ind: Industry) => ind.industry_name === name
              );
              return found ? found.id : null;
            })
            .filter((id: Identifier | null) => id !== null);

          companyData.industry_ids = ids;
          logDP("Mapped industry_names to industry_id:", ids);
        }
      } catch (e) {
        console.error("Failed to fetch industries for mapping:", e);
      }
    }

    if (!companyData.industry_ids) companyData.industry_ids = [];
    companyData.industry_ids = companyData.industry_ids.map((x: unknown) =>
      String(x)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { data: { ...data, _full: true } as any };
};
