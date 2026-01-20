import type { DeleteManyParams, DeleteManyResult } from "react-admin";
import { listBaseUrl } from "../constants";

export const deleteMany = async (
  resource: string,
  params: DeleteManyParams
): Promise<DeleteManyResult> => {
  const { ids } = params;
  await Promise.all(
    ids.map((id) =>
      fetch(`${listBaseUrl}/${id}/accounts`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
  return { data: ids };
};
