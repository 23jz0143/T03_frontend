import { Admin, Resource } from "react-admin";
import type { DataProvider, RaRecord } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { CompanyAccountsList } from "./CompanyAccountsList";
import { UserEdit } from "./UserEdit";
import { UserCreate } from "./userCreate";
import { AccountCircle } from "@mui/icons-material";
import { Approval_pendingList } from "./approval_pending";
import { AdvertisementsList } from "./AdvertisementsList";
import { ApprovalPendingShow } from "./ApprovalPendingShow";
import { AdvertisementsShow } from "./AdvertisementsShow";
import { RequirementShow } from "./RequirementShow";
import { AdvertisementCreate } from "./AdvertisementCreate";

const listBaseUrl = "/api/admin/companies";

const baseProvider = jsonServerProvider(listBaseUrl);

const logDP = (...args: any[]) => console.debug("[DP]", ...args);

const customDataProvider: DataProvider = {
  ...baseProvider,

  getList: async (resource, params) => {
    let url = `${listBaseUrl}/accounts`;

    if (resource === "pendings") {
      url = "/api/admin/advertisements/pendings";
    } else if (resource === "advertisements") {
      const year = (params?.filter as any)?.year ?? new Date().getFullYear();
      url = `/api/admin/advertisements?year=${year}`;
    } else if (resource === "tags") {
      // 🔧 Return tags from your list endpoint and normalize to { id, tag_name }
      const resp = await fetch(`/api/list/tags`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      const raw = await resp.json();

      const data = (Array.isArray(raw) ? raw : []).map((t: any) => {
        const id = t?.id ?? t?.value ?? (typeof t === "string" ? t : undefined);
        const tag_name =
          t?.tag_name ??
          t?.name ??
          t?.label ??
          (typeof t === "string" ? t : "");
        return { id: String(id), tag_name };
      });

      return { data, total: data.length };
    }

    // existing fetch for other resources …
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const total = response.headers.get("X-Total-Count");
    const data = await response.json();

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
      data: Array.isArray(data)
        ? data.map((item) => ({ ...item, id: item.id }))
        : [{ ...data, id: data.id }],
      total: total
        ? parseInt(total, 10)
        : Array.isArray(data)
        ? data.length
        : 1,
    };
  },

  getOne: async (resource, params) => {
    let url: string;

    if (resource === "pendings" || resource === "advertisements") {
      const { id } = params as any;
      if (!id) throw new Error("id is required");
      const companyId = sessionStorage.getItem(`advCompany:${id}`);
      logDP("getOne", resource, { id, companyId });
      if (!companyId)
        throw new Error(
          "company_id が不明です。一覧からレコードを開いてください。"
        );
      url = `/api/companies/${companyId}/advertisements/${id}`;
    } else if (resource === "requirements") {
      const { id } = params as any;
      if (!id) throw new Error("id is required");

      const advId = sessionStorage.getItem(`reqAdv:${id}`);
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
    } else {
      url = `${listBaseUrl}/${(params as any).id}/accounts`;
      logDP("getOne (fallback)", resource, params, url);
    }

    sessionStorage.setItem("lastFetchedUrl", url);
    logDP("GET", url);

    const startedAt = performance.now();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const dur = Math.round(performance.now() - startedAt);
    logDP("resp", response.status, response.statusText, `${dur}ms`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    logDP("data keys", Object.keys(data));

    return { data: { ...data, _full: true } };
  },

  getMany: async (resource, params) => {
    if (resource === "tags") {
      const resp = await fetch(`/api/list/tags`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      const raw = await resp.json();

      const all = (Array.isArray(raw) ? raw : []).map((t: any) => {
        const id = t?.id ?? t?.value ?? (typeof t === "string" ? t : undefined);
        const tag_name =
          t?.tag_name ??
          t?.name ??
          t?.label ??
          (typeof t === "string" ? t : "");
        return { id: String(id), tag_name };
      });

      const want = new Set((params.ids ?? []).map(String));
      const data = all.filter((t) => want.has(String(t.id)));
      return { data };
    }

    // fallback for other resources if you need it:
    // return baseProvider.getMany(resource, params);
    throw new Error(`getMany not implemented for ${resource}`);
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
        company_id: Number(companyId),
        pending:
          params.data.pending !== undefined
            ? Boolean(params.data.pending)
            : false,
        tag_ids: Array.isArray(params.data.tag_ids)
          ? params.data.tag_ids.map(Number)
          : [],
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
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

      return { data: { ...responseData, id: responseData.id } };
    } catch (error) {
      console.error("CREATE Request error:", error);
      throw error;
    }
  },

  update: async (_, { id, data }) => {
    const response = await fetch(`${listBaseUrl}/${id}/accounts`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const responseData = await response.json();
    return { data: responseData };
  },

  delete: async (_, { id }) => {
    const url = `${listBaseUrl}/${id}/accounts`;
    console.log("DELETE Request URL:", url);

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
  <Admin dataProvider={customDataProvider}>
    <Resource
      name="accounts"
      list={CompanyAccountsList}
      edit={UserEdit}
      create={UserCreate}
      icon={AccountCircle}
      options={{ label: "アカウント" }}
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
      options={{ label: "求人票一覧" }}
    />
    <Resource name="requirements" show={RequirementShow} />
  </Admin>
);

export default App;
