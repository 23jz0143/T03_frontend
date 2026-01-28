import { useMediaQuery } from "@mui/material";
import {
  Datagrid,
  TextField,
  SimpleList,
  List,
  DateField,
  TopToolbar,
} from "react-admin";

import { ApprovalPendingEmpty } from "./ApprovalPendingEmpty";

const ListActions = () => <TopToolbar></TopToolbar>;

export const ApprovalPendingList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <List actions={<ListActions />} empty={<ApprovalPendingEmpty />}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.account_name}
          secondaryText={(record) => record.company_name}
          linkType="show" // 詳細ページに遷移
        />
      ) : (
        <Datagrid rowClick="show" bulkActionButtons={false}>
          <TextField source="id" label="ID" />
          <TextField source="company_name" label="会社名" />
          <TextField source="company_id" label="会社ID" />
          <DateField source="updated_at" label="更新日" />
        </Datagrid>
      )}
    </List>
  );
};
