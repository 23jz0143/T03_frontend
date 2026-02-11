import {
  DeleteButton,
  Edit,
  ListButton,
  SaveButton,
  SimpleForm,
  TextInput,
  TopToolbar,
} from "react-admin";

const UserEditActions = () => (
  <TopToolbar sx={{ justifyContent: "space-between" }}>
    <ListButton label="キャンセル " icon={false} />
  </TopToolbar>
);

const UserEditToolbar = () => (
  <TopToolbar sx={{ px: 2, justifyContent: "space-between" }}>
    <SaveButton label="保存" icon={false} />
    <DeleteButton
      label="削除"
      mutationMode="pessimistic"
      confirmTitle="このアカウントを削除しますか？"
      confirmContent="アカウントを削除すると、関連する企業情報もすべて削除されます。"
    />
  </TopToolbar>
);

export const CompanyAccountsEdit = () => (
  <Edit actions={<UserEditActions />}>
    <SimpleForm toolbar={<UserEditToolbar />}>
      <TextInput source="id" disabled />
      <TextInput source="account_name" />
      <TextInput source="company_name" disabled />
    </SimpleForm>
  </Edit>
);
