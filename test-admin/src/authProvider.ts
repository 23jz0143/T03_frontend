import type { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  login: async (params: any) => {
    if (!params?.credential) throw new Error("Google認証情報がありません");
    // 既にバックエンドで検証済みと仮定し、トークンは localStorage に保存済み
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem("authToken");
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem("authToken") ? Promise.resolve() : Promise.reject();
  },
  checkError: () => Promise.resolve(),
  getPermissions: () => Promise.resolve(),
};