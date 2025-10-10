import { Edit, SimpleForm, TextInput } from "react-admin";

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled /> {/* IDは編集不可 */}
      <TextInput source="account_name" />
      <TextInput source="company_name" />
      <TextInput source="password" />
    </SimpleForm>
  </Edit>
);