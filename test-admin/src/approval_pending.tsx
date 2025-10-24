import { useMediaQuery } from "@mui/material";
import { Datagrid, TextField, SimpleList, List } from "react-admin";
import { useNavigate } from "react-router-dom";

export const Approval_pendingList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  //const navigate = useNavigate();

  // const handleRowClick = (record: any) => {
  //   console.log("Record:", record); // デバッグ用
  //   console.log("Record.company_id:", record.company_id); // company_id を明示的に確認
  //   // navigate(`/pendings/${record.id}/show`, { state: { company_id: record.company_id } });
  //   //const state = { company_id: record.company_id }; // state を定義
  //  // console.log("state:", state); // state の中身を確認

  //   navigate(`/pendings/${record.id}/show/${record.company_id}`);
  // };

  return (
    <List>
    {isSmall ? (
      <SimpleList
        primaryText={(record) => record.account_name}
        secondaryText={(record) => record.company_name}
        linkType="show" // 詳細ページに遷移
      />
    ) : (
      <Datagrid rowClick={(id, resource, record) => `${record.id}/show`}>
        <TextField source="id" label="ID" />
        <TextField source="company_name" label="会社名" />
        <TextField source="company_id" label="Company ID" />
      </Datagrid>
    )}
  </List>
  );
};