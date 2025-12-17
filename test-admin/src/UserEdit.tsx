import { Edit, ListButton, SimpleForm, TextInput, TopToolbar } from "react-admin";

const UserEditActions = () => (
  <TopToolbar sx={{ justifyContent: "space-between" }}>
    <ListButton label="キャンセル " icon={false} />
  </TopToolbar>
);

export const UserEdit = () => (
  <Edit actions={<UserEditActions />}>
    <SimpleForm>
      <TextInput source="id"  disabled/>
      <TextInput source="account_name" />
      <TextInput source="company_name" disabled/>
      <TextInput source="password" />
    </SimpleForm>
  </Edit>
);