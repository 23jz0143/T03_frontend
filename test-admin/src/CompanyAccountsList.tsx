import { useMediaQuery } from "@mui/material";
import { List, Datagrid, TextField, SimpleList, EditButton } from "react-admin";

export const UserList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm")); // ロジックはJSXの外で記述

  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.account_name}
          secondaryText={(record) => record.company_name}
        />
      ) : (
        <Datagrid rowClick=""> 
          <TextField source="id" />
          <TextField source="account_name" />
          <TextField source="company_name" />
          <TextField source="password" />
          <EditButton label="編集"/> 
        </Datagrid>
      )}
    </List>
  );
};