import { Admin, Resource } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import japaneseMessages from "ra-language-japanese";
import type { DataProvider, RaRecord } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { CompanyAccountsList } from "./CompanyAccountsList";
import { UserEdit } from "./UserEdit";
import { UserCreate } from "./userCreate";
import { AccountCircle } from "@mui/icons-material";
import { Approval_pendingList } from "./approval_pending";
import { ApprovalPendingShow } from "./ApprovalPendingShow";
import { AdvertisementsList } from "./AdvertisementsList";
import { AdvertisementsShow } from "./AdvertisementsShow";
import { AdvertisementEdit } from "./AdvertisementEdit";
import { AdvertisementCreate } from "./AdvertisementCreate";
import { RequirementShow } from "./RequirementShow";
import { RequirementEdit } from "./RequirementEdit";
import { RequirementCreate } from "./RequirementCreate";
import { LoginPage } from "./LoginPage";
import { authProvider } from "./authProvider";
import { CompanyShow } from "./CompanyShow";
import { CompanyEdit } from "./CompanyEdit";

const listBaseUrl = "/api/admin/companies";

const baseProvider = jsonServerProvider(listBaseUrl);

const messages = {
  ...japaneseMessages,
  ra: {
    ...(japaneseMessages as any).ra,
    action: {
      ...((japaneseMessages as any).ra.action || {}),
      confirm: "確認",
    },
    configurable: {
      ...((japaneseMessages as any).ra?.configurable || {}),
      customize: "カスタマイズ",
    },
    // 追加: sort の不足キーを補完
    sort: {
      ...((japaneseMessages as any).ra?.sort || {}),
      ASC: "昇順",
      DESC: "降順",
    },
  },
};

const customI18nProvider = polyglotI18nProvider(() => messages, "ja");

const logDP = (...args: any[]) => console.debug("[DP]", ...args);

const toNumber = (val: any): number => {
  if (val === null || val === undefined || val === "") return 0;
  const number = Number(val);
  return isNaN(number) ? 0 : number;
};

const toStringSafe = (val: any): string => {
  if (val === null || val === undefined) return "";
  return String(val);
};

const normalizeNumberString = (val: string): string => {
  // e.g. "10,000" or full-width digits "１００００"
  return val
    .replace(/,/g, "")
    .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .trim();
};

const toOptionalNumber = (val: any): number | null => {
  if (val === null || val === undefined || val === "") return null;
  const raw = typeof val === "string" ? normalizeNumberString(val) : val;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const customDataProvider: DataProvider = {
  ...baseProvider,

  getList: async (resource, params) => {
    let url;
    const per_page = params.pagination?.perPage ?? 10;
    const page = params.pagination?.page ?? 1;

    if (resource === "accounts") {
      const searchParams = new URLSearchParams();
      searchParams.set("per_page", String(per_page));
      searchParams.set("page", String(page));

      const filter = (params?.filter ?? {}) as any;
      if (filter.company_name)
        searchParams.set("name", String(filter.company_name));
      console.log(searchParams.toString());

      url = `${listBaseUrl}/accounts?${searchParams.toString()}`;
    }

    // --- advertisements の取得処理 (既存) ---
    else if (resource === "advertisements") {
      console.log("getList advertisements params:", params);
      const filter = (params?.filter ?? {}) as any;
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
      (item: any) => ({
        ...item,
        id: String(item?.id),
      })
    );

    // IDのマッピング保存処理 (既存)
    if (
      (resource === "advertisements" || resource === "pendings") &&
      Array.isArray(data)
    ) {
      data.forEach((item: any) => {
        if (item?.id != null && item?.company_id != null) {
          sessionStorage.setItem(
            `advCompany:${item.id}`,
            String(item.company_id)
          );
        }
      });
    }

    return {
      data,
      total: Number(rawTotal),
    };
  },

  getOne: async (resource, params) => {
    logDP("getOne called with resource:", resource, "params:", params);

    let url = "";
    let currentAdvId: string | null = null;

    // --- URL組み立て ---
    if (resource === "accounts") {
      const { id } = params as any;
      if (!id) throw new Error("ID is required");
      url = `${listBaseUrl}/${id}/accounts`;
    } else if (resource === "pendings") {
      const { id } = params as any; // id = advertisement_id
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
      const { id } = params as any;
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
      const { id } = params as any;
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
      const { id } = params as any;
      if (!id) throw new Error("id is required");
      url = `/api/companies/${id}`;
    } else {
      // それ以外は従来通り（必要なら調整）
      url = `/api/${resource}/${(params as any).id}`;
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

    const data: any = await response.json();

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
                  (tag: any) => tag.tag_name === tagName
                );
                return found ? found.id : null;
              })
              .filter((id: any) => id !== null);

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
          list: any[],
          nameVal: any,
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

          return found ? found.id : null;
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
          data.submission_objects_id.length === 0
        ) {
          const subNames =
            data.submission_objects || data.submission_object_names;
          data.submission_objects_id = Array.isArray(subNames)
            ? subNames
                .map((name: any) =>
                  findIdByName(subObjs, name, [
                    "name",
                    "submission_object_name",
                  ])
                )
                .filter((id: any) => id !== null)
            : [];
        }

        // prefecture (都道府県)
        if (!data.prefecture_id || data.prefecture_id.length === 0) {
          const prefNames = data.prefectures || data.prefecture_names;
          if (Array.isArray(prefNames)) {
            data.prefecture_id = prefNames
              .map((name: any) =>
                findIdByName(prefs, name, ["name", "prefecture_name"])
              )
              .filter((id: any) => id !== null);
          } else {
            data.prefecture_id = [];
          }
        }

        // welfare_benefits (福利厚生)
        if (
          !data.welfare_benefits_id ||
          data.welfare_benefits_id.length === 0
        ) {
          const welNames = data.welfare_benefits || data.welfare_benefit_names;
          data.welfare_benefits_id = Array.isArray(welNames)
            ? welNames
                .map((name: any) =>
                  findIdByName(welfares, name, ["name", "welfare_benefit_name"])
                )
                .filter((id: any) => id !== null)
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
      const companyId = (params as any).id;
      if (!data.id) data.id = companyId; // react-admin用のid保証

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
                  (ind: any) => ind.industry_name === name
                );
                return found ? found.id : null;
              })
              .filter((id: any) => id !== null);

            data.industry_ids = ids;
            logDP("Mapped industry_names to industry_id:", ids);
          }
        } catch (e) {
          console.error("Failed to fetch industries for mapping:", e);
        }
      }

      if (!data.industry_ids) data.industry_ids = [];
      data.industry_ids = data.industry_ids.map((x: any) => String(x));
    }

    return { data: { ...data, _full: true } };
  },

  getMany: async (resource, params) => {
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
        .map((id: any) => `${paramName}=${encodeURIComponent(String(id))}`)
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
        ? json.map((item: any) => ({ ...item, id: String(item.id) }))
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
      ? json.filter((item: any) => stringIds.includes(String(item.id)))
      : [];

    logDP(`getMany result for ${resource}`, data);

    return { data };
  },

  getManyReference: async (resource, params) => {
    if (resource === "requirements") {
      const advertisementId =
        (params as any).id ??
        (params as any).targetId ??
        (params as any).filter?.advertisement_id;

      logDP("getManyReference requirements params", params, {
        advertisementId,
      });

      if (!advertisementId)
        throw new Error("advertisement_id が指定されていません");

      const companyId = sessionStorage.getItem(`advCompany:${advertisementId}`);
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
        throw new Error(`Failed to fetch requirements: ${response.statusText}`);
      const data = await response.json();
      logDP("data len", Array.isArray(data) ? data.length : 0);

      if (Array.isArray(data)) {
        data.forEach((req: any) => {
          if (req?.id != null) {
            sessionStorage.setItem(`reqAdv:${req.id}`, String(advertisementId));
            sessionStorage.setItem(`reqCompany:${req.id}`, String(companyId));
          }
        });
      }

      return { data, total: Array.isArray(data) ? data.length : 0 };
    }
    return baseProvider.getManyReference(resource, params);
  },

  create: async (resource, params) => {
    let url: string;
    let dataToSubmit: any;

    if (resource === "accounts") {
      // 管理画面でアカウントを作成
      url = `${listBaseUrl}/accounts`; // /api/admin/companies/accounts
      dataToSubmit = {
        ...params.data,
      };
    } else if (resource === "advertisements") {
      // 管理画面で求人票を作成
      const companyId = params.data.company_id;
      if (!companyId) {
        console.error("company_id が指定されていません:", params.data);
        throw new Error(
          "company_id が指定されていません。求人票作成フォームに company_id が必要です。"
        );
      }

      url = `/api/companies/${companyId}/advertisements`;

      dataToSubmit = {
        ...params.data,
        tag_ids: Array.isArray(params.data.tag_ids)
          ? params.data.tag_ids.map(Number)
          : [],
      };
      console.log("Creating advertisement with data:", dataToSubmit);
    } else if (resource === "requirements") {
      const companyId = params.data.company_id;
      const advId = params.data.advertisement_id;

      if (!companyId) {
        throw new Error("company_id が指定されていません。");
      }
      if (!advId) {
        throw new Error("advertisement_id が指定されていません。");
      }

      url = `/api/companies/${companyId}/advertisements/${advId}/requirements`;

      const processedAllowances = Array.isArray(params.data.various_allowances)
        ? params.data.various_allowances
            .map((item: any) => {
              const name = toStringSafe(item.name).trim();
              const first_allowance = toOptionalNumber(item.first_allowance);
              const second_allowance = toOptionalNumber(item.second_allowance);
              const third_allowance = toOptionalNumber(item.third_allowance);
              const fourth_allowance = toOptionalNumber(item.fourth_allowance);

              return {
                name,
                first_allowance,
                second_allowance,
                third_allowance,
                fourth_allowance,
              };
            })
            .filter((row: any) => {
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
        job_category_id: toNumber(params.data.job_category_id),

        // 文字列系 (undefined対策)
        recruitment_flow: toStringSafe(params.data.recruitment_flow),
        employment_status: toStringSafe(params.data.employment_status),
        required_days: toStringSafe(params.data.required_days),
        trial_period: toStringSafe(params.data.trial_period),
        working_hours: toStringSafe(params.data.working_hours),
        note: toStringSafe(params.data.note),

        // 数値系
        recruiting_count: toNumber(params.data.recruiting_count),
        starting_salary_first: toNumber(params.data.starting_salary_first),
        starting_salary_second: toNumber(params.data.starting_salary_second),
        starting_salary_third: toNumber(params.data.starting_salary_third),
        starting_salary_fourth: toNumber(params.data.starting_salary_fourth),
        salary_increase: toNumber(params.data.salary_increase),
        bonus: toNumber(params.data.bonus),
        holiday_leave: toNumber(params.data.holiday_leave),

        // Boolean(Varchar)系 "あり"/"なし"
        flex: params.data.flex,
        employee_dormitory: params.data.employee_dormitory,
        contract_housing: params.data.contract_housing,

        // 配列系
        submission_objects_id: Array.isArray(params.data.submission_objects_id)
          ? params.data.submission_objects_id.map(Number)
          : [],

        prefecture_id: Array.isArray(params.data.prefecture_id)
          ? params.data.prefecture_id.map(Number)
          : params.data.prefecture_id
          ? [toNumber(params.data.prefecture_id)]
          : [],

        welfare_benefits_id: Array.isArray(params.data.welfare_benefits_id)
          ? params.data.welfare_benefits_id.map(Number)
          : [],

        // 1行=1手当（first〜fourthを同一オブジェクトで送る）
        various_allowances: processedAllowances,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      delete dataToSubmit.company_id;

      console.log("Creating requirement with data:", dataToSubmit);
    } else {
      throw new Error(`リソース ${resource} の作成はサポートされていません。`);
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
          sessionStorage.setItem(`advCompany:${createdId}`, String(companyId));
          logDP("Saved advCompany (create)", { id: createdId, companyId });
        }
      }

      if (resource === "requirements") {
        const createdId = responseData?.id;
        const advId = params.data.advertisement_id;
        const companyId = params.data.company_id;
        if (createdId != null && advId != null && companyId != null) {
          sessionStorage.setItem(`reqAdv:${createdId}`, String(advId));
          sessionStorage.setItem(`reqCompany:${createdId}`, String(companyId));
          sessionStorage.setItem(`advCompany:${advId}`, String(companyId));
        }
      }

      return { data: { ...responseData, id: responseData.id } };
    } catch (error) {
      console.error("CREATE Request error:", error);
      throw error;
    }
  },

  update: async (resource, { id, data }) => {
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

      const industryIdsNum: number[] = Array.isArray((data as any).industry_ids)
        ? (data as any).industry_ids.map(toNumber)
        : (data as any).industry_ids
        ? [toNumber((data as any).industry_ids)]
        : [];
      dataToSubmit = {
        ...data,
        industry_id: industryIdsNum,
        updated_at: new Date().toISOString(),
      };
      delete dataToSubmit.industry_ids;
    } else if (resource === "advertisements") {
      url = `/api/companies/${data.company_id}/advertisements/${id}`;
      dataToSubmit = {
        ...data,
        tag_ids: Array.isArray(data.tag_ids)
          ? data.tag_ids.map(Number)
          : data.tag_ids || [],
      };
    } else if (resource === "requirements") {
      const advId =
        data.advertisement_id ?? sessionStorage.getItem(`reqAdv:${id}`);
      const companyId =
        data.company_id ??
        sessionStorage.getItem(`reqCompany:${id}`) ??
        (advId ? sessionStorage.getItem(`advCompany:${advId}`) : null);

      if (!advId) throw new Error("求人票IDが不明です");

      url = `/api/companies/${companyId}/advertisements/${advId}/requirements/${id}`;
      const processedAllowances = Array.isArray(data.various_allowances)
        ? data.various_allowances
            .map((item: any) => {
              const name = toStringSafe(item.name).trim();
              const first_allowance = toOptionalNumber(item.first_allowance);
              const second_allowance = toOptionalNumber(item.second_allowance);
              const third_allowance = toOptionalNumber(item.third_allowance);
              const fourth_allowance = toOptionalNumber(item.fourth_allowance);

              return {
                name,
                first_allowance,
                second_allowance,
                third_allowance,
                fourth_allowance,
              };
            })
            .filter((row: any) => {
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
        job_category_id: toNumber(data.job_category_id),

        // 文字列系 (undefined対策)
        recruitment_flow: toStringSafe(data.recruitment_flow),
        employment_status: toStringSafe(data.employment_status),
        required_days: toStringSafe(data.required_days),
        trial_period: toStringSafe(data.trial_period),
        working_hours: toStringSafe(data.working_hours),
        note: toStringSafe(data.note),

        // 数値系
        recruiting_count: toNumber(data.recruiting_count),
        starting_salary_first: toNumber(data.starting_salary_first),
        starting_salary_second: toNumber(data.starting_salary_second),
        starting_salary_third: toNumber(data.starting_salary_third),
        starting_salary_fourth: toNumber(data.starting_salary_fourth),
        salary_increase: toNumber(data.salary_increase),
        bonus: toNumber(data.bonus),
        holiday_leave: toNumber(data.holiday_leave),

        // Boolean(Varchar)系 "あり"/"なし"
        flex: data.flex,
        employee_dormitory: data.employee_dormitory,
        contract_housing: data.contract_housing,

        // 配列系
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

        // 1行=1手当（first〜fourthを同一オブジェクトで送る）
        various_allowances: processedAllowances,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
    } else {
      throw new Error(`リソース ${resource} の更新はサポートされていません。`);
    }
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
  },

  delete: async (resource, { id, previousData }) => {
    let url: string;

    if (resource === "accounts") {
      url = `${listBaseUrl}/${id}/accounts`;
    } else if (resource === "advertisements") {
      const companyId =
        (previousData as any).company_id ??
        sessionStorage.getItem(`advCompany:${id}`);

      if (!companyId) {
        throw new Error(
          "company_id が不明です。求人票一覧からレコードを開いてください。"
        );
      }
      url = `/api/companies/${companyId}/advertisements/${id}`;
    } else if (resource === "requirements") {
      const advId =
        (previousData as any).advertisement_id ??
        sessionStorage.getItem(`reqAdv:${id}`);
      const companyId =
        (previousData as any).company_id ??
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

      // レスポンスのステータスコードをログに出力
      console.log("DELETE Response Status:", response.status);

      // レスポンスが失敗した場合のエラーハンドリング
      if (!response.ok) {
        const errorText = await response.text(); // レスポンスのエラーメッセージを取得
        console.error("DELETE Error Response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      // 成功時のレスポンスをログに出力
      console.log("DELETE Success Response:", await response.json());

      // RecordType に準拠する形でデータを返す
      return { data: { id } as RaRecord };
    } catch (error) {
      // ネットワークエラーやその他のエラーをキャッチ
      console.error("DELETE Request Failed:", error);
      throw error; // エラーを再スローして呼び出し元で処理
    }
  },

  deleteMany: async (_, { ids }) => {
    const responses = await Promise.all(
      ids.map((id) =>
        fetch(`${listBaseUrl}/${id}/accounts`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
      )
    );

    // エラーがある場合は例外をスロー
    responses.forEach((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    });

    // 削除された ID を返す
    return { data: ids };
  },
};

const App = () => (
  <Admin
    dataProvider={customDataProvider}
    loginPage={LoginPage}
    authProvider={authProvider}
    i18nProvider={customI18nProvider}
  >
    <Resource
      name="accounts"
      list={CompanyAccountsList}
      edit={UserEdit}
      create={UserCreate}
      show={CompanyShow}
      icon={AccountCircle}
      options={{ label: "アカウント" }}
    />
    <Resource
      name="company"
      edit={CompanyEdit}
      show={CompanyShow}
      options={{ label: "会社情報" }}
    />
    <Resource
      name="pendings"
      list={Approval_pendingList}
      show={ApprovalPendingShow}
      options={{ label: "公開許可待ち" }}
    />
    <Resource
      name="advertisements"
      list={AdvertisementsList}
      show={AdvertisementsShow}
      create={AdvertisementCreate}
      edit={AdvertisementEdit}
      options={{ label: "求人票一覧" }}
    />
    <Resource
      name="requirements"
      show={RequirementShow}
      edit={RequirementEdit}
      create={RequirementCreate}
    />
    <Resource name="tags" />
    <Resource name="industries" />
    <Resource name="job_categories" />
    <Resource name="prefectures" />
    <Resource name="welfare_benefits" />
    <Resource name="submission_objects" />
  </Admin>
);

export default App;
