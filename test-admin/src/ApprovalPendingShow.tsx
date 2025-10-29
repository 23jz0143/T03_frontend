import { Show, SimpleShowLayout, TextField, NumberField, BooleanField, ArrayField, 
  SingleFieldList, DateField, UrlField, useRecordContext, useNotify, FunctionField } from "react-admin";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOne } from "react-admin";

// ...existing code...

const ApproveButton = () => {
  const record = useRecordContext<any>();
  const notify = useNotify();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!record?.id) return null;

  const handleApprove = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`/api/admin/advertisements/${record.id}/approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!resp.ok) {
        const msg = await resp.text();
        notify(`公開許可に失敗しました (${resp.status}): ${msg || "エラー"}`, { type: "warning" });
        return;
      }
      notify("公開を許可しました", { type: "info" });
      // 履歴を置き換えて戻れないようにする
      navigate("/pendings", { replace: true });
    } catch (e: any) {
      notify(`公開許可の呼び出しに失敗しました: ${e?.message ?? e}`, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleApprove} disabled={loading}>
      {loading ? "処理中..." : "公開許可"}
    </Button>
  );
};

// 戻ってきた場合に最新を必ず再取得し、存在しなければ一覧へ
const PendingGuard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetOne(
    "pendings",
    { id },
    {
      staleTime: 0,
      gcTime: 0,
      retry: false,
    } as any
  );

  // bfcache（戻る復元）時にも再取得させる
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      // bfcache からの復元時は persisted が true
      if ((e as any).persisted) {
        refetch();
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [refetch]);

  useEffect(() => {
    if (!isLoading && (error || !data)) {
      navigate("/pendings", { replace: true });
    }
  }, [isLoading, error, data, navigate]);

  return null;
};

export const ApprovalPendingShow = () => {
  return (
    <Show>
      {/* 戻るで来たときのガード */}
      <PendingGuard />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ApproveButton />
      </Box>

      <SimpleShowLayout>
        {/* ...existing code... */}
        <TextField source="id" label="ID" />
        <TextField source="company_name" label="会社名" />
        <TextField source="company_id" label="Company ID" />
        <NumberField source="average_age" label="平均年齢" />
        <NumberField source="average_continued_service" label="平均勤続年数" />
        <NumberField source="average_overtime" label="平均残業時間" />
        <NumberField source="average_paid_vacation" label="平均有給休暇日数" />
        <TextField source="briefing_info" label="説明会情報" />
        <UrlField source="homepage_url" label="ホームページURL" />
        <BooleanField source="international_student_recruitment" label="留学生採用" />
        <TextField source="job_recruiter_name" label="採用担当者名" />
        <NumberField source="recruiting_count" label="募集人数" />
        <NumberField source="recruitment" label="採用数" />
        {/* <ArrayField source="tags" label="タグ">
          <SimpleShowLayout>
            <ChipField source="" />
          </SimpleShowLayout>
        </ArrayField> */}
        <ArrayField source="tags" label="タグ">
          <SingleFieldList linkType={false}>
            <FunctionField render={(tag: any) => <Chip label={String(tag)} size="small" />} />
          </SingleFieldList>
        </ArrayField>
        <DateField source="created_at" label="作成日" />
        <DateField source="updated_at" label="更新日" />
        <NumberField source="year" label="年" options={{ useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 0 }} />
      </SimpleShowLayout>
    </Show>
  );
};