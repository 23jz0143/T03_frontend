import type { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  login: async (params: { credential?: string }) => {
    if (!params?.credential) throw new Error("Google認証情報がありません");
    // 既にバックエンドで検証済みと仮定し、トークンは sessionStorage に保存済み
    return Promise.resolve();
  },
  logout: () => {
    sessionStorage.removeItem("authToken");
    return Promise.resolve();
  },
  checkAuth: () => {
    return sessionStorage.getItem("authToken") ? Promise.resolve() : Promise.reject();
  },
  checkError: () => Promise.resolve(),
  getPermissions: () => Promise.resolve(),
};