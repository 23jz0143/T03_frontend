import { 
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    required,
    ReferenceArrayInput,
    CheckboxGroupInput,
    TopToolbar,
    ShowButton,
} from "react-admin";

const validateRequired = required('必須項目です');

const EditActions = () => (
    <TopToolbar sx={{ justifyContent: "space-between" }}>
        <ShowButton label="キャンセル " icon={false} />
    </TopToolbar>
);

export const AdvertisementEdit = () => {
    return (
        <Edit title="求人票編集" actions={<EditActions />}>
            <SimpleForm>
                <NumberInput 
                            source="year"
                            label="対象年（卒）"
                            placeholder="2026"
                            helperText="半角数字で入力してください"
                            validate={validateRequired} />
                        <NumberInput
                            source="recruiting_count"
                            label="募集人数"
                            placeholder="100"
                            helperText="半角数字で入力してください"
                            validate={validateRequired}/>
                        <NumberInput
                            source="recruitment"
                            label="本校卒業生採用数"
                            placeholder="10"
                            helperText="半角数字で入力してください"
                            validate={validateRequired} />
                        <NumberInput
                            source="age_limit"
                            label="年齢制限（歳以下）"
                            placeholder="25"
                            helperText="半角英数字で入力してください"
                            validate={validateRequired} />
                        <NumberInput
                            source="average_age"
                            label="平均年齢"
                            placeholder="35.5"
                            helperText="半角数字で入力してください"
                            validate={validateRequired} step="any" />
                        <NumberInput
                            source="average_continued_service"
                            label="平均勤続年数" 
                            placeholder="12.5"
                            helperText="半角数字で入力してください"
                            validate={validateRequired} step="any" />
                        <NumberInput
                            source="average_overtime"
                            label="月平均所定外労働時間"
                            placeholder="20.5"
                            helperText="半角数字で入力してください"
                            validate={validateRequired} step="any" />
                        <NumberInput
                            source="average_paid_vacation"
                            label="平均有給休暇取得日数"
                            placeholder="10.5"
                            helperText="半角数字で入力してください"
                            validate={validateRequired} step="any" />
                        <TextInput
                            source="homepage_url"
                            label="ホームページURL"
                            placeholder="https://example.co.jp/recruit/..."
                            helperText="ホームページのURLを入力してください"/>
                        <TextInput
                            source="mynavi_url"
                            label="マイナビURL"
                            placeholder="https://example.co.jp/recruit/..."
                            helperText="マイナビのURLがあれば入力してください" />
                        <TextInput
                            source="rikunavi_url"
                            label="リクナビURL"
                            placeholder="https://example.co.jp/recruit/..."
                            helperText="リクナビのURLがあれば入力してください" />
                        <TextInput
                            source="job_recruiter_name"
                            label="採用担当者名"
                            placeholder="山田 太郎"
                            helperText="採用担当者の名前を入力してください"
                            validate={validateRequired} />
                        <TextInput
                            source="briefing_info"
                            label="説明会資料URL"
                            placeholder="https://example.co.jp/recruit/..."
                            helperText="説明会資料のURLがあれば入力してください" />
                        <ReferenceArrayInput source="tag_ids" reference="tags" label="タグ">
                            <CheckboxGroupInput optionText="tag_name" helperText="複数選択可"/>
                        </ReferenceArrayInput>
            </SimpleForm>
        </Edit>
    );
}