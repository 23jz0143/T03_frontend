import { Box, Typography } from "@mui/material";

export const ApprovalPendingEmpty = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        marginTop: 4,
      }}
    >
      <Typography variant="h6" color="textSecondary">
        承認待ちの申請はありません
      </Typography>
    </Box>
  );
};
