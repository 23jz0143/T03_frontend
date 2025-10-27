import { Show, TextField, NumberField, BooleanField, DateField, UrlField, FunctionField, Labeled } from "react-admin";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// ...existing code...
export const AdvertisementsShow = () => {
  // 各要素の共通スタイル（暗めグレー + 余白 + 枠線 + 文字色）
  const fieldBoxSx = {
    p: 2,
    bgcolor: "grey.900",
    borderRadius: 1,
    border: "1px solid",
    borderColor: "grey.700",
    color: "grey.100",
  } as const;

  return (
    <Show>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* ...existing code... */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          {/* ...existing code... */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="ID">
                  <TextField source="id" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="会社名">
                  <FunctionField render={(record: any) => record?.company_name ?? record?.company?.name ?? ""} />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="Company ID">
                  <TextField source="company_id" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="平均年齢">
                  <NumberField source="average_age" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="平均勤続年数">
                  <NumberField source="average_continued_service" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="平均残業時間">
                  <NumberField source="average_overtime" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="平均有給休暇日数">
                  <NumberField source="average_paid_vacation" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={fieldBoxSx}>
                <Labeled label="説明会情報">
                  <TextField source="briefing_info" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="ホームページURL">
                  <UrlField source="homepage_url" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="留学生採用">
                  <BooleanField source="international_student_recruitment" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="採用担当者名">
                  <TextField source="job_recruiter_name" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="募集人数">
                  <NumberField source="recruiting_count" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="採用数">
                  <NumberField source="recruitment" />
                </Labeled>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* タグ */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>タグ</Typography>
          <Box sx={fieldBoxSx}>
            <FunctionField
              render={(record: any) =>
                Array.isArray(record?.tags) && record.tags.length ? (
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {record.tags.map((t: string, i: number) => (
                      <Chip key={i} size="small" label={t} sx={{ bgcolor: "grey.700", color: "grey.100" }} />
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ color: "grey.300" }}>タグはありません</Typography>
                )
              }
            />
          </Box>
        </Paper>

        {/* 監査情報 */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>監査情報</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={fieldBoxSx}>
                <Labeled label="作成日">
                  <DateField source="created_at" />
                </Labeled>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={fieldBoxSx}>
                <Labeled label="更新日">
                  <DateField source="updated_at" />
                </Labeled>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={fieldBoxSx}>
                <Labeled label="年">
                  <NumberField source="year" options={{ useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 0 }} />
                </Labeled>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        {/* ...existing code... */}
      </Container>
    </Show>
  );
};
