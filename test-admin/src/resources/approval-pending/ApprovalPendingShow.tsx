import {
  Show,
  TextField,
  ArrayField,
  SingleFieldList,
  DateField,
  UrlField,
  useRecordContext,
  useNotify,
  FunctionField,
  useRedirect,
  TopToolbar,
  Confirm,
  TabbedShowLayout,
  ReferenceManyField,
  Datagrid,
  NumberField,
} from "react-admin";
import { Chip, Box, Button as MuiButton } from "@mui/material";
import type { Advertisement, Company } from "../../types";
import { Button as RaButton } from "react-admin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const ApproveButton = () => {
  const record = useRecordContext<Advertisement>();
  const notify = useNotify();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!record?.id) return null;

  const handleApprove = async () => {
    try {
      setLoading(true);
      const resp = await fetch(
        `/api/admin/advertisements/${record.id}/approval`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      if (!resp.ok) {
        const msg = await resp.text();
        notify(`公開許可に失敗しました (${resp.status}): ${msg || "エラー"}`, {
          type: "warning",
        });
        return;
      }
      notify("公開を許可しました", { type: "info" });
      // 履歴を置き換えて戻れないようにする
      navigate("/pendings", { replace: true });
    } catch (e: unknown) {
      notify(
        `公開許可の呼び出しに失敗しました: ${(e as Error)?.message ?? e}`,
        {
          type: "error",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MuiButton
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        {loading ? "処理中..." : "公開許可"}
      </MuiButton>
      <Confirm
        isOpen={open}
        title="公開を許可しますか？"
        content="この操作は取り消せません。"
        onConfirm={() => {
          setOpen(false);
          handleApprove();
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const UnapporoveButton = () => {
  const record = useRecordContext<Advertisement>();
  const notify = useNotify();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!record?.id) return null;

  const handleUnapprove = async () => {
    try {
      setLoading(true);
      const resp = await fetch(
        `/api/admin/advertisements/${record.id}/rejection`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      if (!resp.ok) {
        const msg = await resp.text();
        notify(`未許可に失敗しました (${resp.status}): ${msg || "エラー"}`, {
          type: "warning",
        });
        return;
      }
      notify("未許可にしました", { type: "info" });
      // 履歴を置き換えて戻れないようにする
      navigate("/pendings", { replace: true });
    } catch (e: unknown) {
      notify(`未許可の呼び出しに失敗しました: ${(e as Error)?.message ?? e}`, {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <MuiButton
        variant="contained"
        color="error"
        onClick={() => setOpen(true)}
        disabled={loading}
        sx={{ justifyContent: "center" }}
      >
        {loading ? "処理中..." : "未許可"}
      </MuiButton>
      <Confirm
        isOpen={open}
        title="未許可にしますか？"
        content="この操作は取り消せません。"
        onConfirm={() => {
          setOpen(false);
          handleUnapprove();
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const AppravalPendingActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar sx={{ justifyContent: "space-between" }}>
      <RaButton
        startIcon={<ArrowBackIcon />}
        label="公開許可待ちへ戻る"
        onClick={() => redirect("list", "pendings")}
        sx={{ justifyContent: "center" }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          mb: 2,
          pr: 2,
        }}
      >
        <UnapporoveButton />
        <ApproveButton />
      </Box>
    </TopToolbar>
  );
};

export const ApprovalPendingShow = () => {
  return (
    <Show title="公開許可待ち詳細" actions={<AppravalPendingActions />}>
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
            render={(r: Advertisement) =>
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
};
