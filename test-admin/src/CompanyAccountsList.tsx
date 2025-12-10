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
          <TextField source="account_name" />
          <TextField source="company_name" />
          {/* <TextField source="password" /> */}
          <ShowButton label="詳細" />
          <EditButton label="編集" />
        </Datagrid>
      )}
    </List>
  );
};
