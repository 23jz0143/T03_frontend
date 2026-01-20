import { Box, useMediaQuery } from "@mui/material";
import { List, Datagrid, TextField, SimpleList, EditButton, ShowButton, TopToolbar, CreateButton, SearchInput, TextInput, FilterForm } from "react-admin";

const postFilters = [
  <SearchInput source="company_name" placeholder="企業名検索" alwaysOn />,
];

const ListActions = () => (
  <TopToolbar sx={{ width: "100%", display: "flex", alignItems: "center" }}>
    <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
      <FilterForm filters={postFilters} />
    </Box>
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <CreateButton label="アカウント新規作成" />
    </Box>
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
