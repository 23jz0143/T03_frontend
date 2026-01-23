import {
  Show,
  TextField,
  RichTextField,
  NumberField,
  EmailField,
  FunctionField,
  ArrayField,
  SingleFieldList,
  TopToolbar,
  EditButton,
  Button,
  useRecordContext,
  TabbedShowLayout,
  ReferenceManyField,
  Datagrid,
  DateField,
} from "react-admin";

import { Link } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProductShowActions = () => {
  const record = useRecordContext();
  return (
    <TopToolbar sx={{ justifyContent: "space-between" }}>
      <Box>
        <Button label="一覧に戻る" component={Link} to="/accounts">
          <ArrowBackIcon />
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 3, ml: "auto" }}>
        <EditButton label="会社情報編集" />
        <Button
          label="求人票新規作成"
          component={Link}
          to="/advertisements/create"
          state={{ fromCompanyId: record?.id }}
        />
      </Box>
    </TopToolbar>
  );
};

export const CompanyShow = () => {
  return (
    <Show resource="company" actions={<ProductShowActions />} title="会社情報">
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="会社情報">
          <NumberField source="id" label="ID" />
          <TextField source="company_name" label="会社名" />
          <TextField source="company_name_furigana" label="会社名(ふりがな)" />
          <TextField source="address" label="住所" />
          <RichTextField source="business_detail" label="事業内容" />
          <NumberField
            source="capital"
            label="資本金"
            options={{ style: "currency", currency: "JPY" }}
          />
          <EmailField source="email" label="メールアドレス" />
          <FunctionField
            source="employee_count"
            label="従業員数"
            render={(record) => record.employee_count + " 名"}
          />
          <FunctionField
            source="foundation"
            label="設立年"
            render={(record) => record.foundation + " 年"}
          />
          <ArrayField source="industry_names" label="業種">
            <SingleFieldList linkType={false}>
              <FunctionField
                render={(industry_name: unknown) => (
                  <Chip label={String(industry_name)} size="small" />
                )}
              />
            </SingleFieldList>
          </ArrayField>
          <RichTextField source="introduction" label="会社紹介文" />
          <TextField source="office_location" label="事業所" />
          <TextField source="phone_number" label="電話番号" />
          <TextField source="postal_code" label="郵便番号" />
          <RichTextField source="profile" label="プロフィール" />
          <TextField source="representative_name" label="採用担当者" />
          <NumberField
            source="sales"
            label="売上"
            options={{ style: "currency", currency: "JPY" }}
          />
          <RichTextField source="service_achievement" label="主な事業実績" />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label="求人票一覧">
          <ReferenceManyField
            label="求人票"
            reference="advertisements"
            target="company_id"
          >
            <Datagrid bulkActionButtons={false}>
              <TextField source="id" label="求人票ID" />
              <FunctionField
                source="year"
                label="対象年（卒）"
                render={(record) => record.year + " 年"}
              />
              <TextField source="pending" label="公開状態" />
              <DateField source="updated_at" label="更新日" />
            </Datagrid>
          </ReferenceManyField>
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  );
};
