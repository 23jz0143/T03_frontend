import { Admin, Resource } from "react-admin";
import { AccountCircle } from "@mui/icons-material";

import { CompanyAccountsList } from "./resources/companies/CompanyAccountsList";
import { CompanyAccountsEdit } from "./resources/companies/CompanyAccountsEdit";
import { CompanyAccountsCreate } from "./resources/companies/CompanyAccountsCreate";
import { ApprovalPendingList } from "./resources/approval-pending/ApprovalPendingList";
import { ApprovalPendingShow } from "./resources/approval-pending/ApprovalPendingShow";
import { AdvertisementsList } from "./resources/advertisements/AdvertisementsList";
import { AdvertisementsShow } from "./resources/advertisements/AdvertisementsShow";
import { AdvertisementEdit } from "./resources/advertisements/AdvertisementEdit";
import { AdvertisementCreate } from "./resources/advertisements/AdvertisementCreate";
import { RequirementShow } from "./resources/requirements/RequirementShow";
import { RequirementEdit } from "./resources/requirements/RequirementEdit";
import { RequirementCreate } from "./resources/requirements/RequirementCreate";
import { LoginPage } from "./auth/LoginPage";
import { authProvider } from "./auth/authProvider";
import { CompanyShow } from "./resources/companies/CompanyShow";
import { CompanyEdit } from "./resources/companies/CompanyEdit";

import { customDataProvider } from "./dataProvider";
import { customI18nProvider } from "./i18n";

const App = () => (
  <Admin
    dataProvider={customDataProvider}
    loginPage={LoginPage}
    authProvider={authProvider}
    i18nProvider={customI18nProvider}
  >
    <Resource
      name="accounts"
      list={CompanyAccountsList}
      edit={CompanyAccountsEdit}
      create={CompanyAccountsCreate}
      show={CompanyShow}
      icon={AccountCircle}
      options={{ label: "アカウント" }}
    />
    <Resource
      name="company"
      edit={CompanyEdit}
      show={CompanyShow}
      options={{ label: "会社情報" }}
    />
    <Resource
      name="pendings"
      list={ApprovalPendingList}
      show={ApprovalPendingShow}
      options={{ label: "公開許可待ち" }}
    />
    <Resource
      name="advertisements"
      list={AdvertisementsList}
      show={AdvertisementsShow}
      create={AdvertisementCreate}
      edit={AdvertisementEdit}
      options={{ label: "求人票" }}
    />
    <Resource
      name="requirements"
      show={RequirementShow}
      edit={RequirementEdit}
      create={RequirementCreate}
    />
    <Resource name="tags" />
    <Resource name="industries" />
    <Resource name="job_categories" />
    <Resource name="prefectures" />
    <Resource name="welfare_benefits" />
    <Resource name="submission_objects" />
  </Admin>
);

export default App;
