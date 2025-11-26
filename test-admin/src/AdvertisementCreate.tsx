import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  required,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  SelectInput,
} from "react-admin";

const validateRequired = required("必須項目です");

export const AdvertisementCreate = () => (
  <Create resource="advertisements">
    <SimpleForm>
      <NumberInput
        source="year"
        label="年度"
        validate={validateRequired}
        placeholder="2025"
        helperText="半角数字で入力してください"
      />
      <NumberInput
        source="recruiting_count"
        label="募集人数"
        validate={validateRequired}
        placeholder="10"
        helperText="半角数字で入力してください"
      />
      <NumberInput
        source="recruitment"
        label="本校卒業生採用数"
        validate={validateRequired}
        placeholder="10"
        helperText="半角数字で入力してください"
      />
      <SelectInput
        source="international_student_recruitment"
        label="留学生採用"
        choices={[
          { id: true, name: "有り" },
          { id: false, name: "無し" },
          { id: null, name: "不明" },
        ]}
        optionValue="id"
        optionText="name"
        validate={validateRequired}
        helperText="留学生の採用有無を選択してください"
      />

      <NumberInput
        source="average_age"
        label="平均年齢"
        validate={validateRequired}
        step="any"
        placeholder="32.4"
        helperText="半角数字で小数点一桁まで入力してください"
      />
      <NumberInput
        source="average_continued_service"
        label="平均勤続年数"
        validate={validateRequired}
        step="any"
        placeholder="8.7"
        helperText="半角数字で小数点一桁まで入力してください"
      />
      <NumberInput
        source="average_overtime"
        label="月平均所定外労働時間"
        validate={validateRequired}
        step="any"
        placeholder="12.5"
        helperText="半角数字で小数点一桁まで入力してください"
      />
      <NumberInput
        source="average_paid_vacation"
        label="平均有給休暇取得日数"
        validate={validateRequired}
        step="any"
        placeholder="10.2"
        helperText="半角数字で小数点一桁まで入力してください"
      />
      <TextInput
        source="homepage_url"
        label="ホームページURL"
        placeholder="https://example.co.jp/"
        helperText="会社HPのURLを入力してください"
      />
      <TextInput
        source="mynavi_url"
        label="マイナビURL"
        placeholder="https://job.mynavi.jp/..."
        helperText="マイナビ掲載ページのURLがあれば入力してください"
      />
      <TextInput
        source="rikunavi_url"
        label="リクナビURL"
        placeholder="https://job.rikunabi.com/..."
        helperText="リクナビ掲載ページのURLがあれば入力してください"
      />
      <TextInput
        source="job_recruiter_name"
        label="採用担当者名"
        validate={validateRequired}
        placeholder="山田 太郎"
        helperText="採用担当者の氏名を入力してください"
      />
      <TextInput
        source="briefing_info"
        label="説明会資料URL"
        placeholder="https://example.co.jp/recruit/..."
        helperText="説明会資料のURLがあれば入力してください"
      />
      <ReferenceArrayInput source="tag_ids" reference="tags" label="タグ">
        <AutocompleteArrayInput
          optionText="tag_name"
          helperText={
            <>
              会社と合致するタグがあれば選択してください
              <br />
              複数選択可
            </>
          }
        />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);
