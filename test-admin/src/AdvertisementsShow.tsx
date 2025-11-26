import {
  Show,
  TextField,
  NumberField,
  DateField,
  TabbedShowLayout,
  UrlField,
  SingleFieldList,
  FunctionField,
  ReferenceManyField,
  Datagrid,
  ArrayField,
  useRedirect,
  TopToolbar,
  Button,
} from "react-admin";
import { Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// 親（求人票）レコードから company_id, id を取得して列を組み立て
const RequirementColumns = () => {
  return (
    <Datagrid bulkActionButtons={false}>
      <TextField source="id" label="ID" />
      <TextField source="employment_status" label="雇用形態" />
      <TextField source="job_categories_name" label="職種" />
      <FunctionField
        label="勤務地"
        render={(r: any) =>
          Array.isArray(r?.location) && r.location.length
            ? r.location.join("、")
            : "未登録"
        }
      />
      <NumberField
        source="starting_salary_second"
        label="月給(2年卒)"
        options={{ style: "currency", currency: "JPY" }}
      />
      <DateField source="updated_at" label="更新日" />
    </Datagrid>
  );
};

const AdvertisementsShowActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar sx={{ justifyContent: "space-between" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        label="一覧へ戻る"
        onClick={() => redirect("list", "advertisements")}
      />
    </TopToolbar>
  );
};

export const AdvertisementsShow = () => (
  <Show title="求人票詳細" actions={<AdvertisementsShowActions />}>
    <TabbedShowLayout>
      <TabbedShowLayout.Tab label="概要">
        <FunctionField
          label="会社名"
          render={(r: any) => {
            const v = r?.company_name ?? r?.company?.name;
            return v ? v : "未登録";
          }}
        />
        <FunctionField
          source="year"
          label="対象年"
          render={(record) => record.year + " 年"}
        />
        <FunctionField
          source="average_age"
          label="平均年齢"
          render={(record) => record.average_age + " 年"}
        />
        <FunctionField
          source="average_continued_service"
          label="平均勤続年数"
          render={(record) => record.average_continued_service + " 年"}
        />
        <FunctionField
          source="average_overtime"
          label="平均残業時間"
          render={(record) => record.average_overtime + " 時間"}
        />
        <FunctionField
          source="average_paid_vacation"
          label="平均有給休暇日数"
          render={(record) => record.average_paid_vacation + " 日"}
        />
        <TextField source="briefing_info" label="説明会情報" />
        <UrlField source="homepage_url" label="ホームページURL" />
        <FunctionField
          label="留学生採用"
          render={(r: any) =>
            r?.international_student_recruitment === true
              ? "はい"
              : r?.international_student_recruitment === false
              ? "いいえ"
              : "未登録"
          }
        />
        <TextField source="job_recruiter_name" label="採用担当者名" />
        <FunctionField
          source="recruiting_count"
          label="募集人数"
          render={(record) => record.recruiting_count + " 人"}
        />
        <FunctionField
          source="recruitment"
          label="採用数"
          render={(record) => record.recruitment + " 人"}
        />
        <ArrayField source="tags" label="タグ">
          <SingleFieldList linkType={false}>
            <FunctionField
              render={(tag: any) => <Chip label={String(tag)} size="small" />}
            />
          </SingleFieldList>
        </ArrayField>
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="募集要項一覧">
        <ReferenceManyField
          label="募集要項"
          reference="requirements"
          target="advertisement_id"
        >
          <RequirementColumns />
        </ReferenceManyField>
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="ID">
        <TextField source="id" label="ID" />
        <TextField source="company_id" label="Company ID" />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="日付情報">
        <DateField source="created_at" label="作成日" />
        <DateField source="updated_at" label="更新日" />
      </TabbedShowLayout.Tab>
    </TabbedShowLayout>
  </Show>
);
