import { Show, TabbedShowLayout, TextField, DateField, NumberField, FunctionField, useShowContext, useRefresh, SingleFieldList, Datagrid, ArrayField, RecordContextProvider, useRecordContext, TopToolbar, EditButton, Button} from "react-admin";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import Chip from "@mui/material/Chip";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

const SalaryDatagridSection: React.FC = () => {
  const record = useRecordContext<any>();
  if (!record) return null;

  const rows = [
      { label: "月給(1年卒)", value: record.starting_salary_first },
      { label: "月給(2年卒)", value: record.starting_salary_second },
      { label: "月給(3年卒)", value: record.starting_salary_third },
      { label: "月給(4年卒)", value: record.starting_salary_fourth },
  ];

  // ArrayField に渡すため、一時的に record に salary_rows を載せる
  return (
      <RecordContextProvider value={{ ...record, salary_rows: rows }}>
          <ArrayField source="salary_rows" label="月給">
              <Datagrid bulkActionButtons={false}>
                  <TextField source="label" label="区分" />
                  <NumberField
                      source="value"
                      label="金額"
                      options={{ style: "currency", currency: "JPY" }}
                      emptyText="未登録"
                      textAlign="right"
                  />
              </Datagrid>
          </ArrayField>
      </RecordContextProvider>
  );
};

const RequirementShowActions = () => {
  const record = useRecordContext();
  const { id } = useParams();
  if (!record || !record.advertisement_id) {
      console.log("no record or no advertisement_id", record);
  }

  const advertisementId = record?.advertisement_id || (id ? sessionStorage.getItem(`reqAdv:${id}`) : null);

  useEffect(() => {
      console.log("Actions render. ID:", id, " advID:", advertisementId, " record:", record);
  }, [record, id, advertisementId]);
  if (!advertisementId) {
      console.log("no advertisement_id in record", record);
  }

  return (
      <TopToolbar sx={{ justifyContent: "space-between" }}>
          <Box>
              {advertisementId && (
                  <Button
                      component = {Link}
                      to = {`/advertisements/${advertisementId}/show/1`}
                      startIcon = {<ArrowBackIcon />}
                      label = "求人票に戻る"
                  />
              )}
          </Box>
          <EditButton />
      </TopToolbar>
  )
}


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
    <Show actions={<RequirementShowActions />} title="募集要項詳細">
        <FullRecordGate>
        <TabbedShowLayout>
        <TabbedShowLayout.Tab label="概要">
            <TextField source="employment_status" label="雇用形態" emptyText="未登録" />
            <TextField source="job_categories_name" label="職種" emptyText="未登録" />
            <FunctionField
                label="勤務地（都道府県）"
                render={(r: any) =>
                    Array.isArray(r?.prefectures) && r.prefectures.length ? r.prefectures.join("、") : "未登録"
                }
            />
            <FunctionField source="recruiting_count" label="募集人数" emptyText="未登録"  render={record => record.recruiting_count + " 人"}/>
            <FunctionField
                label="年間休日"
                render={(r: any) => (typeof r?.holiday_leave === "number" ? `${r.holiday_leave} 日` : "未登録")}
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
            <SalaryDatagridSection />
            <ArrayField source="various_allowances" label="各種手当">
                <Datagrid bulkActionButtons={false}>
                    <TextField source="name" label="対象" />
                    <NumberField source="first_allowance" label="1年卒" options={{ style: "currency", currency: "JPY" }}/>
                    <NumberField source="second_allowance" label="2年卒" options={{ style: "currency", currency: "JPY" }}/>
                    <NumberField source="third_allowance" label="3年卒" options={{ style: "currency", currency: "JPY" }}/>
                    <NumberField source="fourth_allowance" label="4年卒" options={{ style: "currency", currency: "JPY" }}/>
                </Datagrid>
            </ArrayField>
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

        <TabbedShowLayout.Tab label="備考">
            <TextField source="note" label="備考" />
        </TabbedShowLayout.Tab>

        <TabbedShowLayout.Tab label="メタ情報">
            <DateField
                    source="created_at"
                    label="作成日"
                    showTime 
                    locales="ja-JP" 
                    options={{ 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }}/>
            <DateField
                    source="updated_at"
                    label="最終更新日"
                    showTime 
                    locales="ja-JP" 
                    options={{ 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }}/>
        </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </FullRecordGate>
    </Show>
  );
};