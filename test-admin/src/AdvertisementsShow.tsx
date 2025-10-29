import { Show, SimpleShowLayout, TextField, NumberField, DateField, 
        UrlField, FunctionField, ReferenceManyField, Datagrid, ArrayField, SingleFieldList, ChipField } from "react-admin";
import { Stack, Chip } from "@mui/material";

export const AdvertisementsShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />

      <FunctionField
        label="会社名"
        render={(r: any) => {
          const v = r?.company_name ?? r?.company?.name;
          return v ? v : "未登録";
        }}
      />

      <TextField source="company_id" label="Company ID" />
      <NumberField source="average_age" label="平均年齢" />
      <NumberField source="average_continued_service" label="平均勤続年数" />
      <NumberField source="average_overtime" label="平均残業時間" />
      <NumberField source="average_paid_vacation" label="平均有給休暇日数" />
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
      <NumberField source="recruiting_count" label="募集人数" />
      <NumberField source="recruitment" label="採用数" />

      <FunctionField
        label="タグ"
        render={(record: any) =>
          Array.isArray(record?.tags) && record.tags.length ? (
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {record.tags.map((t: string, i: number) => (
                <Chip key={i} size="small" label={t} />
              ))}
            </Stack>
          ) : (
            "未登録"
          )
        }
      />

      <DateField source="created_at" label="作成日" />
      <DateField source="updated_at" label="更新日" />
      <NumberField
        source="year"
        label="年"
        options={{ useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 0 }}
      />

      {/* -----------------------募集要項-------------------------- */}
    
      <ReferenceManyField
        label="募集要項"
        reference="requirements"
        target="advertisement_id"
      >
        <Datagrid bulkActionButtons={false}>
          <TextField source="id" label="ID" />
          <TextField source="employment_status" label="雇用形態" />
          <TextField source="job_categories_name" label="職種" />

          {/* <ArrayField source="location" label="勤務地">
            <SingleFieldList>
              <ChipField source="" />
            </SingleFieldList>
          </ArrayField>     こいつはなぜかできねえ    */}
          <FunctionField
            label="勤務地"
            render={(r: any) =>
              Array.isArray(r?.location) && r.location.length
                ? r.location.join("、")
                : "未登録"
            }
          />

          <ArrayField source="starting_salaries" label="初任給">
            <Datagrid bulkActionButtons={false}>
              <TextField source="target" label="対象" />
              <NumberField
                source="monthly_salary"
                label="月給"
                options={{ style: "currency", currency: "JPY" }}
              />
            </Datagrid>
          </ArrayField>

          <DateField source="updated_at" label="更新日" />
        </Datagrid>
      </ReferenceManyField>
      </SimpleShowLayout>
  </Show>
);
