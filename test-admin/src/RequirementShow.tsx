import { Show, TabbedShowLayout, TextField, DateField, NumberField, FunctionField, useShowContext, useRefresh, SingleFieldList, Datagrid, ArrayField  } from "react-admin";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import Chip from "@mui/material/Chip";

const DEBUG = true;
const dlog = (...args: any[]) => DEBUG && console.debug("[RequirementShow]", ...args);

const FullRecordGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { record, isFetching } = useShowContext<any>();

  useEffect(() => {
    dlog("record changed", { record, isFetching, _full: record?._full });
  }, [record, isFetching]);

  if (!record || !record._full || isFetching) {
    dlog("waiting full record...", {
      hasRecord: !!record,
      _full: record?._full,
      isFetching,
    });
    return (
      <Box p={2} display="flex" alignItems="center" gap={1}>
        <CircularProgress size={18} /> 読み込み中...
      </Box>
    );
  }
  dlog("ready (full record)");
  return <>{children}</>;
};

export const RequirementShow = () => {
  const refresh = useRefresh();

  useEffect(() => {
    dlog("mounted at", window.location.href);
    return () => dlog("unmounted");
  }, []);

  // bfcache 復元時は必ず再取得＋ログ
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      const persisted = (e as any).persisted;
      dlog("pageshow", { persisted });
      if (persisted) {
        dlog("pageshow persisted -> refresh()");
        refresh();
      }
    };
    window.addEventListener("pageshow", onPageShow as any);
    return () => window.removeEventListener("pageshow", onPageShow as any);
  }, [refresh]);

  return (
    <Show queryOptions={{ staleTime: 0, gcTime: 0 }}>
      <FullRecordGate>
        <TabbedShowLayout>
          <TabbedShowLayout.Tab label="概要">
            <TextField source="id" label="ID" emptyText="未登録" />
            <TextField source="employment_status" label="雇用形態" emptyText="未登録" />
            <TextField source="job_categories_name" label="職種" emptyText="未登録" />
            <FunctionField
              label="勤務地（都道府県）"
              render={(r: any) =>
                Array.isArray(r?.prefectures) && r.prefectures.length ? r.prefectures.join("、") : "未登録"
              }
            />
            <NumberField source="recruiting_count" label="募集人数" emptyText="未登録" />
            <FunctionField
              label="年間休日"
              render={(r: any) => (typeof r?.holiday_leave === "number" ? `${r.holiday_leave}日` : "未登録")}
            />
            <FunctionField
              label="賞与"
              render={(r: any) => {
                const v = r?.bonus;
                if (typeof v !== "number") return "未登録";
                if (v === 0) return "なし";
                if (v === 1) return "年1回";
                return `年${v}回`;
              }}
            />
            <FunctionField
              label="昇給"
              render={(r: any) => (r?.salary_increase === 1 ? "あり" : r?.salary_increase === 0 ? "なし" : "未登録")}
            />
          </TabbedShowLayout.Tab>

          <TabbedShowLayout.Tab label="勤務条件">
            <TextField source="working_hours" label="就業時間" emptyText="未登録" />
            <TextField source="flex" label="フレックス" emptyText="未登録" />
            <TextField source="required_days" label="勤務日数" emptyText="未登録" />
            <TextField source="trial_period" label="試用期間" emptyText="未登録" />
            <TextField source="contract_housing" label="借上社宅" emptyText="未登録" />
            <TextField source="employee_dormitory" label="社員寮" emptyText="未登録" />
          </TabbedShowLayout.Tab>

          <TabbedShowLayout.Tab label="給与・福利厚生">
            {/* 初任給はテーブルで見やすく */}
            <ArrayField source="starting_salaries" label="初任給">
              <Datagrid bulkActionButtons={false}>
                <TextField source="target" label="対象" />
                <NumberField source="monthly_salary" label="月給" options={{ style: "currency", currency: "JPY" }} />
              </Datagrid>
            </ArrayField>
            <TextField source="various_allowances" label="各種手当" emptyText="未登録" />
            <ArrayField source="welfare_benefits" label="福利厚生">
              <SingleFieldList linkType={false}>
                <FunctionField render={(v: any) => <Chip size="small" label={String(v)} />} />
              </SingleFieldList>
            </ArrayField>
          </TabbedShowLayout.Tab>

          <TabbedShowLayout.Tab label="選考・提出物">
            <TextField source="recruitment_flow" label="選考フロー" emptyText="未登録" />
            <ArrayField source="submission_objects" label="提出物">
              <SingleFieldList linkType={false}>
                <FunctionField render={(v: any) => <Chip size="small" label={String(v)} />} />
              </SingleFieldList>
            </ArrayField>
          </TabbedShowLayout.Tab>

          <TabbedShowLayout.Tab label="メタ情報">
            <DateField source="created_at" label="作成日" emptyText="未登録" />
            <DateField source="updated_at" label="更新日" emptyText="未登録" />
          </TabbedShowLayout.Tab>
        </TabbedShowLayout>
      </FullRecordGate>
    </Show>
  );
};