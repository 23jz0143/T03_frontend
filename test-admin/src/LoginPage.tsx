import { Card, CardContent, Typography } from "@mui/material";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useLogin, Title, Notification } from "react-admin";

export const LoginPage = () => {
  const login = useLogin();

  const handleLoginSuccess = async (response: CredentialResponse) => {
    const idToken = response.credential;
    if (!idToken) {
      alert("Google認証情報の取得に失敗しました。");
      return;
    }

    try {
      const res = await fetch("/api/auth/google/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ GoogleSubjectID: idToken }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "バックエンドでの認証に失敗しました");
      }
      const data = await res.json();

      if (data.attribute == "学生") {
        alert("学生アカウントでは管理画面を利用できません。");
        sessionStorage.removeItem("authToken");
        return; // login() を呼ばず終了
      }

      sessionStorage.setItem("authToken", data.session_token);

      // react-admin 側の状態更新
      await login({ provider: "google", credential: idToken });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "不明なエラーが発生しました";
      alert(`ログインエラー: ${msg}`);
    }
  };

  const handleLoginError = () => {
    alert("Googleログインに失敗しました。");
  };

  return (
    <Card sx={{ maxWidth: 420, mx: "auto", mt: 10 }}>
      <CardContent>
        <Title title="ログイン" />
        <Typography variant="body2" sx={{ mb: 2 }}>
          Googleでログインしてください
        </Typography>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          useOneTap
        />
      </CardContent>
      <Notification />
    </Card>
  );
};
