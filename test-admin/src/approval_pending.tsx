import { useMediaQuery } from "@mui/material";
import { Datagrid, TextField, SimpleList, List } from "react-admin";

export const Approval_pendingList = () => {
    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm")); // 画面幅が "sm" 以下の場合に true

    return (
        <List>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.account_name}
                    secondaryText={(record) => record.company_name}
                />
            ) : (
                <Datagrid rowClick="edit">
                    <TextField source="id" label="ID" />
                    <TextField source="company_name" label="会社名" />
                    <TextField source="company_id" />
                </Datagrid>
            )}
        </List>
    );
};