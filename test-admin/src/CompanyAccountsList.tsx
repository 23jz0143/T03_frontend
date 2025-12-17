import { useMediaQuery } from "@mui/material";
import { List, Datagrid, TextField, SimpleList, EditButton, ShowButton } from "react-admin";

export const CompanyAccountsList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm")); // ロジックはJSXの外で記述

  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.account_name}
          secondaryText={(record) => record.company_name}
          linkType="show"
        />
      ) : (
        <Datagrid rowClick="show">
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
