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
  EditButton,
  CreateButton,
  DeleteButton,
  useRecordContext,
} from "react-admin";
import { Chip, Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Advertisement, Company } from "../../types";

// 親（求人票）レコードから company_id, id を取得して列を組み立て
const RequirementColumns = () => {
  return (
    <Datagrid bulkActionButtons={false} empty={<EmptyRequirement />}>
      <TextField source="id" label="ID" />
      <TextField source="employment_status" label="雇用形態" />
      <TextField source="job_categories_name" label="職種" />
      <FunctionField
        label="勤務地"
        render={(r: Advertisement) =>
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

const RequirementListActions = () => {
  const record = useRecordContext();
  if (!record) return null;

  const companyId =
    record.company_id ?? sessionStorage.getItem(`advCompany:${record.id}`);

  return (
    <TopToolbar>
      <CreateButton
        resource="requirements"
        label="募集要項を新規作成"
        state={{
          record: { advertisement_id: record.id, company_id: companyId },
        }}
      />
    </TopToolbar>
  );
};

const AdvertisementsShowActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar sx={{ justifyContent: "space-between" }}>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          label="一覧へ戻る"
          onClick={() => redirect("list", "advertisements")}
        />
      </Box>
      <Box>
        <DeleteButton
          label="求人票削除"
          mutationMode="pessimistic"
          confirmTitle="この求人票を削除しますか？"
          confirmContent="求人票を削除すると、関連する募集要項もすべて削除されます。"
        />
        <EditButton label="求人票編集" />
      </Box>
    </TopToolbar>
  );
};

const EmptyRequirement = () => (
  <Box sx={{ textAlign: "center", width: "100%" }}>
    <Typography variant="h6" color="textSecondary">
      募集要項はまだ登録されていません
    </Typography>
  </Box>
);

export const AdvertisementsShow = () => (
  <Show title="求人票詳細" actions={<AdvertisementsShowActions />}>
    <TabbedShowLayout>
      <TabbedShowLayout.Tab label="概要">
        <FunctionField
          label="会社名"
          render={(r: Advertisement): React.ReactNode => {
            const v = r?.company_name ?? (r?.company as Company)?.name;
            return v ? String(v) : "未登録";
          }}
        />
        <FunctionField
          label="会社名（ふりがな）"
          render={(r: Advertisement): React.ReactNode => {
            const v =
              r?.company_name_furigana ??
              (r?.company as Company)?.name_furigana;
            return v ? String(v) : "未登録";
          }}
        />
        <FunctionField
          source="year"
          label="対象年（卒）"
          render={(record) => record.year + " 年"}
        />
        <FunctionField
          source="age_limit"
          label="年齢制限"
          render={(record) => record.age_limit + " 歳以下"}
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
          source="mynavi_url"
          label="マイナビURL"
          render={(record) =>
            record.mynavi_url ? (
              <UrlField
                source="mynavi_url"
                label="マイナビURL"
                target="_blank"
              />
            ) : (
              "未登録"
            )
          }
        />
        <FunctionField
          source="rikunavi_url"
          label="リクナビURL"
          render={(record) =>
            record.rikunavi_url ? (
              <UrlField
                source="rikunavi_url"
                label="リクナビURL"
                target="_blank"
              />
            ) : (
              "未登録"
            )
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
              render={(tag: unknown) => (
                <Chip label={String(tag)} size="small" />
              )}
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
        <RequirementListActions />
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
