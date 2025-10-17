import { Datagrid, TextField, DateField, List, SimpleList } from "react-admin";
import { useMediaQuery } from "@mui/material";

export const AdvertisementsList = () => {

const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm")); // 画面幅が "sm" 以下の場合に true

return (
    <List>
        {isSmall ? (
            <SimpleList
                primaryText={(record) => record.account_name}
                secondaryText={(record) => record.company_name}/>
        ) : (
            <Datagrid rowClick="edit">
                <TextField source="id" label="ID" />
                <TextField source="company_name" label="会社名" />
                <TextField source="company_id" />
                <DateField source="updated_at" label="更新日" />
            </Datagrid>
        )}
    </List>
);
};