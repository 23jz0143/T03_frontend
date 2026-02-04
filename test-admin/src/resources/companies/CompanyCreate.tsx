import {
  Create,
  SimpleForm,
  TextInput,
  required,
  NumberInput,
  useNotify,
  useDataProvider,
  ReferenceArrayInput,
  CheckboxGroupInput,
  useRedirect,
} from "react-admin";
import { useLocation } from "react-router-dom";
import type { FieldValues } from "react-hook-form";

export const CompanyCreate = () => {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const location = useLocation();
  const redirect = useRedirect();
  const validateRequired = required("必須項目です");

  const accountIdFromState = (location.state as { account_id?: number })
    ?.account_id;
  const accountId =
    accountIdFromState ??
    (sessionStorage.getItem("register_account_id")
      ? Number(sessionStorage.getItem("register_account_id"))
      : undefined);

  // ...

  const handleSubmit = async (data: FieldValues) => {
    console.log("CompanyCreate handleSubmit called");
    try {
      if (!accountId) {
        notify(
          "account_idを取得できません。アカウント作成からやり直してください。",
          { type: "warning" },
        );
        return;
      }
      // industry_ids を number[] に正規化
      const industry_id = Array.isArray(data?.industry_id)
        ? data.industry_id.map((v: number | string) => Number(v))
        : [];

      // body には会社情報のみ（account_id は含めない）
      const payload: Record<string, unknown> = { ...data, industry_id };
      payload.id = accountId;
      console.log("CompanyCreate handleSubmit payload:", payload);

      await dataProvider.create("company", {
        data: payload,
        meta: { company_id: accountId },
      });

      sessionStorage.removeItem("register_account_id");
      notify("会社情報が作成されました", { type: "success" });
      redirect("/accounts");
    } catch {
      notify("会社情報の作成に失敗しました", { type: "error" });
    }
  };

  return (
    <Create title="会社情報の新規作成">
      <SimpleForm
        defaultValues={{ account_id: accountId }}
        onSubmit={handleSubmit}
      >
        <TextInput source="account_id" sx={{ display: "none" }} />
        <TextInput
          source="company_name"
          label="会社名"
          placeholder="例：株式会社〇〇"
          helperText=""
          validate={validateRequired}
        />
        <TextInput
          source="company_name_furigana"
          label="会社名(ふりがな)"
          placeholder="例：かぶしきがいしゃ〇〇"
          helperText="会社名をひらがなで入力してください"
          validate={validateRequired}
        />
        <TextInput
          source="address"
          label="住所"
          placeholder="例：東京都新宿区百人町1丁目25-4"
          helperText="本社の住所を入力してください"
          validate={validateRequired}
        />
        <TextInput
          source="business_detail"
          label="事業内容"
          placeholder="例：ソフトウェア開発、ITコンサルティング"
          helperText="会社の主な事業内容を入力してください"
          validate={validateRequired}
        />
        <NumberInput
          source="capital"
          label="資本金"
          placeholder="例：5000000"
          helperText="半角数字で入力してください"
          validate={validateRequired}
        />
        <TextInput
          source="email"
          label="メールアドレス"
          placeholder=""
          helperText="半角で入力してください"
          validate={validateRequired}
        />
        <NumberInput
          source="employee_count"
          label="従業員数"
          placeholder="例：150"
          helperText="半角数字で入力してください"
          validate={validateRequired}
        />
        <NumberInput
          source="foundation"
          label="設立年"
          placeholder="例：2005"
          helperText="半角数字で入力してください"
          validate={validateRequired}
        />
        <ReferenceArrayInput
          source="industry_id"
          reference="industries"
          label="業種"
        >
          <CheckboxGroupInput
            optionText="industry_name"
            label="業種"
            helperText="複数選択可"
          />
        </ReferenceArrayInput>
        <TextInput
          source="introduction"
          label="会社紹介文"
          placeholder="例：私たち〇〇株式会社は、..."
          helperText="会社の紹介文を入力してください"
          validate={validateRequired}
        />
        <TextInput
          source="office_location"
          label="事業所"
          placeholder="例：東京都新宿区、大阪府大阪市"
          helperText="事業所の所在地を入力してください"
          validate={validateRequired}
        />
        <NumberInput
          source="phone_number"
          label="電話番号"
          helperText="半角数字のみで入力してください"
          validate={validateRequired}
        />
        <NumberInput
          source="postal_code"
          label="郵便番号"
          placeholder="例：1600023"
          helperText="半角数字のみで入力してください"
          validate={validateRequired}
        />
        <TextInput
          source="profile"
          label="プロフィール"
          placeholder="例：〇〇業界での豊富な経験を持つ企業です。"
          helperText="会社のプロフィールを入力してください"
          validate={validateRequired}
        />
        <TextInput
          source="representative_name"
          label="採用担当者"
          placeholder="例：山田 太郎"
          helperText="採用担当者の名前を入力してください"
          validate={validateRequired}
        />
        <NumberInput
          source="sales"
          label="売上"
          placeholder="例：100000000"
          helperText="半角数字で入力してください"
          validate={validateRequired}
        />
        <TextInput
          source="service_achievement"
          label="主な事業実績"
          multiline
          placeholder="例：大手企業向けシステム開発"
          helperText="会社の主な事業実績を入力してください"
          validate={validateRequired}
        />
      </SimpleForm>
    </Create>
  );
};
