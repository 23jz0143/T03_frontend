import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Show, SimpleShowLayout, TextField, NumberField, BooleanField, ArrayField, ChipField, DateField } from "react-admin";
import { getOnePendings } from "./getOnePendings";

export const ApprovalPendingShow = () => {
  const { id } = useParams<{ id: string }>(); // URL パスから id を取得
  const location = useLocation(); // state から company_id を取得
  const company_id = location.state?.company_id; // 一覧から渡された値を受け取る

  console.log("ApprovalPendingShow - id:", id); // デバッグ用
  console.log("ApprovalPendingShow - company_id:", company_id); // デバッグ用

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!company_id || !id) {
      setError("company_id または id が不正です");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getOnePendings({
          company_id: Number(company_id),
          id: Number(id), // id を advertisement_id として使用
        });
        setRecord(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [company_id, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!record) return null;

  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" record={record} label="ID" />
        <NumberField source="average_age" record={record} label="平均年齢" />
        <NumberField source="average_continued_service" record={record} label="平均勤続年数" />
        <NumberField source="average_overtime" record={record} label="平均残業時間" />
        <NumberField source="average_paid_vacation" record={record} label="平均有給休暇日数" />
        <TextField source="briefing_info" record={record} label="説明会情報" />
        <TextField source="homepage_url" record={record} label="ホームページURL" />
        <BooleanField source="international_student_recruitment" record={record} label="留学生採用" />
        <TextField source="job_recruiter_name" record={record} label="採用担当者名" />
        <NumberField source="recruiting_count" record={record} label="募集人数" />
        <NumberField source="recruitment" record={record} label="採用数" />
        <ArrayField source="tags" record={record} label="タグ">
          <SimpleShowLayout>
            <ChipField source="" />
          </SimpleShowLayout>
        </ArrayField>
        <DateField source="created_at" record={record} label="作成日" />
        <DateField source="updated_at" record={record} label="更新日" />
        <NumberField source="year" record={record} label="年" />
      </SimpleShowLayout>
    </Show>
  );
};