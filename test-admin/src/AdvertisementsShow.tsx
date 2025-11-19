import { Show, SimpleShowLayout, TextField, NumberField, DateField, 
  UrlField, SingleFieldList, FunctionField, ReferenceManyField, Datagrid, ArrayField, useRedirect, useRecordContext } from "react-admin";
import { Chip, Button } from "@mui/material";


const RequirementDetailButton: React.FC<{ companyId?: string | number; advertisementId?: string | number }> = ({ companyId, advertisementId }) => {
  const row = useRecordContext<any>();
  const redirect = useRedirect();

  if (!row?.id || !companyId || !advertisementId) return null;

  const handleClick = () => {
    // 親IDをキャッシュ（getOne 用）
    sessionStorage.setItem(`reqAdv:${row.id}`, String(advertisementId));
    sessionStorage.setItem(`reqCompany:${row.id}`, String(companyId));
    sessionStorage.setItem(`advCompany:${advertisementId}`, String(companyId));
    redirect("show", "requirements", row.id);
  };

  return (
    <Button size="small" variant="outlined" onClick={handleClick}>
      詳しく表示
    </Button>
  );
};

// 親（求人票）レコードから company_id, id を取得して列を組み立て
const RequirementColumns = () => {
const parent = useRecordContext<any>(); // 求人票レコード
const companyId = parent?.company_id;
const advertisementId = parent?.id;

return (
<Datagrid bulkActionButtons={false}>
<TextField source="id" label="ID" />
<TextField source="employment_status" label="雇用形態" />
<TextField source="job_categories_name" label="職種" />

<FunctionField
  label="勤務地"
  render={(r: any) =>
    Array.isArray(r?.location) && r.location.length ? r.location.join("、") : "未登録"
  }
/>

{/* <ArrayField source="starting_salaries" label="初任給">
  <Datagrid bulkActionButtons={false}>
    <TextField source="target" label="対象" />
    <NumberField source="monthly_salary" label="月給" options={{ style: "currency", currency: "JPY" }} />
  </Datagrid>
</ArrayField> */}

<NumberField source="starting_salary_second" label="月給(2年卒)" options={{ style: "currency", currency: "JPY" }} />

<DateField source="updated_at" label="更新日" />

{/* 詳細へ */}
<FunctionField
  label="詳細表示"
  render={() => <RequirementDetailButton companyId={companyId} advertisementId={advertisementId} />}
/>
</Datagrid>
);
};

export const AdvertisementsShow = () => (
<Show title="求人票詳細">
<SimpleShowLayout>
<TextField source="id" label="ID" />
<TextField source="company_id" label="Company ID" />
<FunctionField
  label="会社名"
  render={(r: any) => {
    const v = r?.company_name ?? r?.company?.name;
    return v ? v : "未登録";
  }}
/>
<FunctionField source="year" label="対象年" render={record => record.year + " 年"}/>
<FunctionField source="average_age" label="平均年齢" render={record => record.average_age + " 年"}/>
<FunctionField source="average_continued_service" label="平均勤続年数" render={record => record.average_continued_service + " 年"} />
<FunctionField source="average_overtime" label="平均残業時間" render={record => record.average_overtime + " 時間"} />
<FunctionField source="average_paid_vacation" label="平均有給休暇日数" render={record => record.average_paid_vacation + " 日"} />
<TextField source="briefing_info" label="説明会情報" />
<UrlField source="homepage_url" label="ホームページURL" />
<FunctionField
  label="留学生採用"
  render={(r: any) =>
    r?.international_student_recruitment === true ? "はい" :
    r?.international_student_recruitment === false ? "いいえ" : "未登録"
  }
/>
<TextField source="job_recruiter_name" label="採用担当者名" />
<FunctionField source="recruiting_count" label="募集人数" render={record => record.recruiting_count + " 人"} />
<FunctionField source="recruitment" label="採用数" render={record => record.recruitment + " 人"} />
<ArrayField source="tags" label="タグ">
        <SingleFieldList linkType={false}>
          <FunctionField render={(tag: any) => <Chip label={String(tag)} size="small" />} />
        </SingleFieldList>
      </ArrayField>

<DateField source="created_at" label="作成日" />
<DateField source="updated_at" label="更新日" />

{/* -----------------------募集要項-------------------------- */}
<ReferenceManyField label="募集要項" reference="requirements" target="advertisement_id">
  <RequirementColumns />
</ReferenceManyField>
</SimpleShowLayout>
</Show>
);