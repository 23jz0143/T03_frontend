import { Create, SimpleForm, TextInput, NumberInput, required, useRedirect, useNotify, useDataProvider, ReferenceArrayInput, AutocompleteArrayInput } from "react-admin";
import { useLocation } from "react-router-dom";

const validateRequired = required('必須項目です');

export const AdvertisementCreate = () => (
    <Create resource="advertisements">
        <SimpleForm>
        <NumberInput source="year" label="年度" validate={validateRequired} />
        <NumberInput source="recruiting_count" label="募集人数" validate={validateRequired} />
        <NumberInput source="recruitment" label="本校卒業生採用数" validate={validateRequired} />
        <NumberInput source="international_student_recruitment" label="留学生採用" validate={validateRequired} />
        <NumberInput source="average_age" label="平均年齢" validate={validateRequired} step="any" />
        <NumberInput source="average_continued_service" label="平均勤続年数" validate={validateRequired} step="any" />
        <NumberInput source="average_overtime" label="月平均所定外労働時間" validate={validateRequired} step="any" />
        <NumberInput source="average_paid_vacation" label="平均有給休暇取得日数" validate={validateRequired} step="any" />
        <TextInput source="homepage_url" label="ホームページURL" />
        <TextInput source="mynavi_url" label="マイナビURL" />
        <TextInput source="rikunavi_url" label="リクナビURL" />
        <TextInput source="job_recruiter_name" label="採用担当者名" validate={validateRequired} />
        <TextInput source="briefing_info" label="説明会資料URL" />
        <ReferenceArrayInput source="tag_ids" reference="tags" label="タグ">
            <AutocompleteArrayInput optionText="tag_name" />
        </ReferenceArrayInput>
        </SimpleForm>
    </Create>
);