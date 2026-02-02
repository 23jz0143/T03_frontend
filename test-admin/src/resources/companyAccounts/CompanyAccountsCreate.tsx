import {
  Create,
  SimpleForm,
  TextInput,
  useRedirect,
  useNotify,
  useDataProvider,
} from "react-admin";
import type { FieldValues } from "react-hook-form";

export const CompanyAccountsCreate = () => {
  const redirect = useRedirect();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const handleSubmit = async (data: FieldValues) => {
    try {
      // データ保存処理をここに記述
      const res = await dataProvider.create("accounts", { data });
      const accountId = res?.data?.id ?? res?.data?.account_id;
      if (!accountId) throw new Error("IDがレスポンスにありません");

      // 次画面用に保持（リロード対策）
      sessionStorage.setItem("register_account_id", String(accountId));

      // 保存成功時の処理
      notify("アカウントが作成されました", { type: "success" });
      redirect("/company/create"); // companyCreate にリダイレクト
    } catch {
      // エラー時の処理
      notify("アカウントの作成に失敗しました", { type: "error" });
    }
  };
  return (
    <Create>
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput source="account_name" label="アカウント名" />
        <TextInput source="password" label="パスワード" type="password" />
      </SimpleForm>
    </Create>
  );
};
