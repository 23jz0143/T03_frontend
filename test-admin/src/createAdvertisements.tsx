import { Create, SimpleForm, TextInput, NumberInput, ArrayInput, SimpleFormIterator } from "react-admin";

export const UserCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <TextInput source="company_name" label="会社名" />
      <NumberInput source="capital" label="資本金" />
      <NumberInput source="sales" label="売上高" />
      <NumberInput source="employee_count" label="従業員数" />
      <TextInput source="representative_name" label="代表者名" />
      <TextInput source="profile" label="会社概要" multiline />
      <TextInput source="introduction" label="会社紹介" multiline />
      <TextInput source="business_detail" label="事業内容" multiline />
      <NumberInput source="postal_code" label="郵便番号" />
      <TextInput source="address" label="住所" />
      <TextInput source="phone_number" label="電話番号" />
      <TextInput source="email" label="メールアドレス" />
      <NumberInput source="foundation" label="設立年" />
      <TextInput source="service_achievement" label="サービス実績" multiline />
      <TextInput source="office_location" label="所在地" />
      <ArrayInput source="industry_id" label="業種ID">
        <SimpleFormIterator>
          <NumberInput source="" label="ID" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);