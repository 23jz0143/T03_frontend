import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserList } from "./users";
import { UserEdit } from "./UserEdit";
import { UserCreate } from "./userCreate";
import { AccountCircle } from "@mui/icons-material";

const listBaseUrl = "/api/admin/companies"; 

const customDataProvider = {
  ...jsonServerProvider(listBaseUrl),

  getList: async (resource, params) => {
    const response = await fetch(`${listBaseUrl}/accounts`, {
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
        ? data.map((item, index) => ({ ...item, id: item.id || index + 1 }))
        : [{ ...data, id: 1 }],
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

    // 配列が返ってきた場合、最初の要素を使用して id を付与
    const record = Array.isArray(data) ? { ...data[0], id: data[0]?.id || id } : { ...data, id };
    return { data: record };
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error Response Body:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return { data: { ...responseData, id: responseData.id || new Date().getTime() } };
  },

  update: async (resource, { id, data }) => {
    const response = await fetch(`${listBaseUrl}/${id}/accounts/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const responseData = await response.json();
    return { data: { ...responseData, id } };
  },

  delete: async (resource, { id }) => {
    const response = await fetch(`${listBaseUrl}/companies/accounts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return { data: { id } };
  },
};

const App = () => (
  <Admin dataProvider={customDataProvider}>
        <Resource name="accounts" list={UserList} edit={UserEdit} create={UserCreate} icon={AccountCircle} />
  </Admin>
);

export default App;
