import { Show, TextField, NumberField, BooleanField, DateField, UrlField, FunctionField, Labeled } from "react-admin";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const AdvertisementsShow = () => {
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
                  <TextField source="id" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="会社名">
                  <FunctionField
                    render={(r: any) => {
                      const v = r?.company_name ?? r?.company?.name;
                      return v ? v : "未登録";
                    }}
                  />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="Company ID">
                  <TextField source="company_id" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="平均年齢">
                  <NumberField source="average_age" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="平均勤続年数">
                  <NumberField source="average_continued_service" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="平均残業時間">
                  <NumberField source="average_overtime" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="平均有給休暇日数">
                  <NumberField source="average_paid_vacation" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={fieldBoxSx}>
                <Labeled label="説明会情報">
                  <TextField source="briefing_info" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="ホームページURL">
                  <UrlField source="homepage_url" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="留学生採用">
                  <FunctionField
                    render={(r: any) =>
                      r?.international_student_recruitment === true
                        ? "はい"
                        : r?.international_student_recruitment === false
                        ? "いいえ"
                        : "未登録"
                    }
                  />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="採用担当者名">
                  <TextField source="job_recruiter_name" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="募集人数">
                  <NumberField source="recruiting_count" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={fieldBoxSx}>
                <Labeled label="採用数">
                  <NumberField source="recruitment" emptyText="未登録" />
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
                  "未登録"
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
                  <DateField source="created_at" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={fieldBoxSx}>
                <Labeled label="更新日">
                  <DateField source="updated_at" emptyText="未登録" />
                </Labeled>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={fieldBoxSx}>
                <Labeled label="年">
                  <NumberField
                    source="year"
                    emptyText="未登録"
                    options={{ useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                  />
                </Labeled>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Show>
  );
};
