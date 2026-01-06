import { Datagrid, TextField, DateField, List, SimpleList, SelectInput, SearchInput, TopToolbar, CreateButton, Filter, FilterForm } from "react-admin";
import { useMediaQuery } from "@mui/material";
import { useMemo } from "react";



export const AdvertisementsList = () => {
    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const currentYear = new Date().getFullYear() + 2;
    

    const yearChoices = useMemo(
        () =>
            Array.from({ length: 6 }, (_, i) => {
                const y = currentYear - i;
                return { id: y, name: String(y) };
            }),
        [currentYear]
    );

    return (
        <List
            actions={false}
            filters={[
                <SearchInput
                    source="company_name"
                    placeholder="企業名検索"
                    alwaysOn
                    sx={{
                        "& .MuiInputBase-root": { height: 48 },
                        "& .MuiInputBase-input": { paddingY: 0 },
                    }}
                    />,
                <SelectInput key="year" source="year" label="対象年（卒）" choices={yearChoices} alwaysOn/>]}
            filterDefaultValues={{ year: currentYear }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.account_name}
                    secondaryText={(record) => record.company_name}
                />
            ) : (
                <Datagrid rowClick="show" bulkActionButtons={false}>
                    <TextField source="id" label="ID" />
                    <TextField source="company_name" label="会社名" />
                    <TextField source="company_id" />
                    <DateField source="updated_at" label="更新日" />
                </Datagrid>
            )}
        </List>
    );
};
