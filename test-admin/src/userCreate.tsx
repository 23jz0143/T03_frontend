// AccountCreate.tsx
import { Create, SimpleForm, TextInput, } from "react-admin";

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="account_name" label="アカウント名" />
      <TextInput source="company_name" label="会社名" />
      <TextInput source="password" label="パスワード" type="password" />
    </SimpleForm>
  </Create>
);
