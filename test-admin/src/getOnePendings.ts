export const getOnePendings = async (params: { company_id: number; id: number }) => {
    console.log("getOnePendings called with params:", params); // デバッグ用

    const { company_id, id: advertisement_id } = params; // id を advertisement_id として取得
    const url = `/api/companies/${company_id}/advertisements/${advertisement_id}`; // id をエンドポイントに含める

    console.log("GET One Pendings URL:", url); // エンドポイントをコンソールに出力

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        console.error("GET One Pendings Request Failed:", error);
        throw error;
    }
};