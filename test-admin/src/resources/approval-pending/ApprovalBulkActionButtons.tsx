import {
  useUpdateMany,
  useNotify,
  useRefresh,
  useUnselectAll,
  Button,
  useListContext,
} from "react-admin";

export const ApprovalBulkActionButtons = () => {
  const { selectedIds } = useListContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const unselectAll = useUnselectAll("pendings");
  const [updateMany, { isLoading }] = useUpdateMany(
    "pendings",
    { ids: selectedIds, data: {} },
    {
      onSuccess: () => {
        notify("一括承認しました", { type: "info", undoable: true });
        refresh();
        unselectAll();
      },
      onError: (error: Error | string) => {
        notify(`エラー: ${error}`, { type: "warning" });
      },
    }
  );

  return (
    <Button
      label="一括承認"
      onClick={() => updateMany()}
      disabled={isLoading}
    />
  );
};
