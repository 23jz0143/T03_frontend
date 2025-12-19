import { useMediaQuery } from "@mui/material";
import { List, Datagrid, TextField, SimpleList, EditButton, ShowButton, TopToolbar, CreateButton } from "react-admin";

const ListActions = () => (
  <TopToolbar>
    <CreateButton label="アカウント新規作成" />
  </TopToolbar>
);

export const CompanyAccountsList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm")); // ロジックはJSXの外で記述

  return (
    <List actions={<ListActions />}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.account_name}
          secondaryText={(record) => record.company_name}
          linkType="show"
        />
      ) : (
        <Datagrid rowClick="show" bulkActionButtons={false}>
          <TextField source="id" />
          <TextField source="account_name" label="アカウント名" />
          <TextField source="company_name" label="企業名" />
          {/* <TextField source="password" /> */}
          <EditButton label="編集" />
        </Datagrid>
      )}
    </List>
  );
};
