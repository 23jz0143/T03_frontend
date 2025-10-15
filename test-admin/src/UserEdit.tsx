import { Edit, SimpleForm, TextInput } from "react-admin";

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id"  disabled/>
      <TextInput source="account_name" />
      <TextInput source="company_name" />
      <TextInput source="password" />
    </SimpleForm>
  </Edit>
);