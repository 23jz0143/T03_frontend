import { Admin, Resource } from "react-admin";
import type { DataProvider } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserList } from "./users";
import { UserEdit } from "./UserEdit";
import { UserCreate } from "./userCreate";
import { AccountCircle } from "@mui/icons-material";
import { Approval_pendingList } from "./approval_pending";
import { AdvertisementsList } from "./AdvertisementsList";

const listBaseUrl = "/api/admin/companies"; 

const customDataProvider: DataProvider = {
  ...jsonServerProvider(listBaseUrl),

  getList: async (resource, params) => {
    let url = `${listBaseUrl}/accounts`;
  
    // リソース名に応じてエンドポイントを切り替える
    if (resource === "pendings") {
      url = "/api/admin/advertisements/pendings";
    } else if (resource === "advertisements") {
      const year = params.filter?.year || new Date().getFullYear(); // 年号を取得（デフォルトは現在の年）
      url = `/api/admin/advertisements?year=${year}`;
    }
  
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
  
    return {
      data: Array.isArray(data)
        ? data.map((item) => ({ ...item, id: item.id }))
        : [{ ...data, id: data.id }],
      total: total ? parseInt(total, 10) : Array.isArray(data) ? data.length : 1,
    };
  },

  getOne: async (resource, { id }) => {
    const response = await fetch(`${listBaseUrl}/${id}/accounts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return { data };
  },

  create: async (resource, { data }) => {
    const response = await fetch(`${listBaseUrl}/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
    const responseData = await response.json();
    console.log("Server Response:", responseData); // サーバーのレスポンスを確認
  
    // サーバーが単一の ID を返す場合、それを加工して返す
    if (typeof responseData === "number") {
      return { data: { id: responseData, ...data } };
    }
  
    // サーバーがオブジェクト形式でデータを返す場合
    return { data: responseData };
  },

  update: async (resource, { id, data }) => {
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

  delete: async (resource, { id }) => {
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
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
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

  deleteMany: async (resource, { ids }) => {
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
        <Resource name="accounts" list={UserList} edit={UserEdit} create={UserCreate} icon={AccountCircle} />
        <Resource name="pendings" list={Approval_pendingList} />
        <Resource name="advertisements" list={AdvertisementsList} />
  </Admin>
);

export default App;
