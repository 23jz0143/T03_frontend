import { Datagrid, List, TextField, DateField, Filter, TextInput } from "react-admin";

const AdvertisementFilter = (props) => (
  <Filter {...props}>
    <TextInput label="年号" source="year" alwaysOn />
  </Filter>
);

export const AdvertisementsList = (props) => (
  <List {...props} filters={<AdvertisementFilter />}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="company_name" label="会社名" />
      <TextField source="company_id" label="会社ID" />
      <DateField source="updated_at" label="更新日" />
    </Datagrid>
  </List>
);