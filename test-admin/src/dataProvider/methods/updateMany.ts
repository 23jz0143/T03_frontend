import type { UpdateManyParams, UpdateManyResult } from "react-admin";
import { update } from "./update";

export const updateMany = async (
  resource: string,
  params: UpdateManyParams
): Promise<UpdateManyResult> => {
  if (resource === "pendings") {
    const query = params.ids
      .map((id) => `advertisement_ids=${id}`)
      .join("&");
    const url = `/api/admin/advertisements/approval?${query}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        data: params.ids,
      };
    } catch (error) {
      console.error("UPDATE MANY Request error:", error);
      throw error;
    }
  }

  // Fallback to calling update for each resource
  const results = await Promise.all(
    params.ids.map((id) =>
      update(resource, {
        id,
        data: params.data,
        previousData: undefined,
      })
    )
  );

  return {
    data: results.map((result) => result.data.id),
  };
};
