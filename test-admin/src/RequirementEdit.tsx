import { 
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    required,
    ReferenceArrayInput,
    ReferenceInput,
    ArrayInput,
    SimpleFormIterator,
    CheckboxGroupInput,
    RadioButtonGroupInput,
    useInput,
    useGetList
} from "react-admin";
import { Checkbox, FormControlLabel, FormGroup, Typography, Grid, FormControl, FormLabel, FormHelperText } from '@mui/material';

const validateRequired = required('必須項目です');

const GroupedPrefectureInput = ({source, choices = [], isLoading, label, helperText, validate}) => {
    const {
        field,
        fieldState: {isTouched, error},
        isRequired
    } = useInput({source, validate});

    if(isLoading) return null;
    const selectedNames = Array.isArray(field.value) ? field.value : [];

    const handleToggle = (name) => {
        if(selectedNames.includes(name)) {
            field.onChange(selectedNames.filter(n => n !== name));
        } else {
            field.onChange([...selectedNames, name]);
        }
    };

    const regions = [
        { name: "北海道・東北", prefs: ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"] },
        { name: "関東", prefs: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"] },
        { name: "中部", prefs: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"] },
        { name: "近畿", prefs: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"] },
        { name: "中国・四国", prefs: ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"] },
        { name: "九州・沖縄", prefs: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"] },
    ];

    const hasError = isTouched && !!error;

    return (
        <FormControl 
            component="fieldset" 
            style={{ width: '100%', marginTop: '16px', marginBottom: '8px' }}
            error={hasError} // 2. エラー時に赤くする
            required={isRequired} // 3. 必須マーク(*)を表示
        >
        <FormLabel component="legend" style={{ marginBottom: '8px' }}>{label}</FormLabel>
        <div style={{ width: '100%' }}>
            {regions.map((region) => {
                // 現在の地域に該当する都道府県データを抽出
                const regionPrefs = choices.filter(d => region.prefs.includes(d.prefecture));
                
                if (regionPrefs.length === 0) return null;

                return (
                    <div key={region.name} style={{ marginBottom: '16px' }}>
                        <Typography variant="subtitle2" color="primary" style={{ borderBottom: '1px solid #ddd', marginBottom: '8px' }}>
                            {region.name}
                        </Typography>
                        <FormGroup row>
                            <Grid container spacing={1}>
                                {regionPrefs.map(pref => (
                                    <Grid item xs={6} sm={4} md={3} key={pref.id}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedNames.includes(pref.prefecture)}
                                                    onChange={() => handleToggle(pref.prefecture)}
                                                    color={hasError ? "error" : "primary"}
                                                    size="small"
                                                />
                                            }
                                            label={pref.prefecture}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </FormGroup>
                    </div>
                );
            })}
        </div>
        <FormHelperText>
            {hasError ? error.message : helperText}
        </FormHelperText>
        </FormControl>
    );
}

export const RequirementEdit = () => {
    const { data: prefecturesData, isLoading: isLoadingPrefectures } = useGetList(
            'prefectures', 
            { 
                pagination: { page: 1, perPage: 100 }, // 全件取得するため多めに設定
                sort: { field: 'id', order: 'ASC' } 
            }
        );
    return (
        <Edit title="募集要項編集">
            <SimpleForm>
                <ReferenceInput source="job_category_id" reference="job_categories" label="職種">
                    <RadioButtonGroupInput optionText="job_category_name" label="職種" validate={validateRequired} helperText="一つ選択してください"/>
                </ReferenceInput>
                
                <RadioButtonGroupInput source="employment_status" label="雇用形態" choices={[
                    { id: '正社員', name: '正社員' },
                    { id: '契約社員', name: '契約社員' },
                    { id: 'パート・アルバイト', name: 'パート・アルバイト' },
                    { id: '業務委託', name: '業務委託' },
                ]} validate={validateRequired}  helperText="一つ選択してください"/>
                <GroupedPrefectureInput
                    source="prefectures"
                    choices={prefecturesData}
                    isLoading={isLoadingPrefectures}
                    validate={validateRequired}
                    label="勤務地 (都道府県)"
                    helperText="複数選択可"
                    />
                <NumberInput
                    source="recruiting_count"
                    label="募集人数"
                    placeholder="100"
                    helperText="半角数字で入力してください"
                    validate={validateRequired} />
                <TextInput
                    source="recruitment_flow"
                    label="採用フロー"
                    placeholder="例：書類選考→一次面接→最終面接"
                    helperText="選考の流れを入力してください"
                    validate={validateRequired} />
                <TextInput
                    source="required_days"
                    label="内々定までの所要日数"
                    placeholder="例：約1ヶ月"
                    helperText="内々定までの所要日数を入力してください"
                    validate={validateRequired} />
                <ReferenceArrayInput source="submission_objects_id" reference="submission_objects" label="提出物">
                    <CheckboxGroupInput optionText="submission_object_name" label="提出物" validate={validateRequired} helperText="複数選択可" />
                </ReferenceArrayInput>
                <NumberInput source="starting_salary_first" label="初任給 (1年卒)" placeholder="220000" helperText="半角英数字で入力してください　年次による差がない場合は入力なし" />
                <NumberInput source="starting_salary_second" label="初任給 (2年卒)" validate={validateRequired} placeholder="220000" helperText="半角英数字で入力してください" />
                <NumberInput source="starting_salary_third" label="初任給 (3年卒)" placeholder="220000" helperText="半角英数字で入力してください　年次による差がない場合は入力なし" />
                <NumberInput source="starting_salary_fourth" label="初任給 (4年卒)" placeholder="220000" helperText="半角英数字で入力してください　年次による差がない場合は入力なし" />
                <TextInput
                    source="trial_period"
                    label="試用期間"
                    placeholder="例：3ヶ月"
                    helperText="試用期間の有無・期間を入力してください"
                    validate={validateRequired} />
                <NumberInput
                    source="salary_increase"
                    label="昇給/年"
                    placeholder="1"
                    helperText="昇給回数を半角数字で入力してください（なしの場合は0）"
                    validate={validateRequired} />
                <NumberInput
                    source="bonus"
                    label="賞与"
                    placeholder="2"
                    helperText="賞与回数を半角数字で入力してください（なしの場合は0）"
                    validate={validateRequired} />
                <NumberInput
                    source="holiday_leave"
                    label="年間休日"
                    placeholder="120"
                    helperText="年間休日数を半角数字で入力してください"
                    validate={validateRequired} />
                <RadioButtonGroupInput source="employee_dormitory" label="社員寮" choices={[
                    { id: 'あり', name: 'あり' },
                    { id: 'なし', name: 'なし' },
                    { id: '不明', name: '不明' },
                ]} validate={validateRequired} />
                <RadioButtonGroupInput source="contract_housing" label="借上社宅" choices={[
                    { id: 'あり', name: 'あり' },
                    { id: 'なし', name: 'なし' },
                    { id: '不明', name: '不明' },
                ]} validate={validateRequired} />
                <TextInput
                    source="working_hours"
                    label="勤務時間"
                    placeholder="例：9:00～18:00"
                    helperText="勤務時間を入力してください"
                    validate={validateRequired} />
                <RadioButtonGroupInput source="flex" label="フレックス" choices={[
                    { id: 'あり', name: 'あり' },
                    { id: 'なし', name: 'なし' },
                    { id: '不明', name: '不明' },
                ]} validate={validateRequired} />
                <ArrayInput source="various_allowances" label="諸手当">
                    <SimpleFormIterator>
                        <TextInput source="name" label="手当名" placeholder="例：住宅手当" helperText="手当名を入力してください" />
                        <NumberInput source="first_allowance" label="金額(1年卒)" placeholder="10000" helperText="半角英数字で入力してください" />
                        <NumberInput source="second_allowance" label="金額(2年卒)" placeholder="10000" helperText="半角英数字で入力してください" />
                        <NumberInput source="third_allowance" label="金額(3年卒)" placeholder="10000" helperText="半角英数字で入力してください" />
                        <NumberInput source="fourth_allowance" label="金額(4年卒)" placeholder="10000" helperText="半角英数字で入力してください" />
                    </SimpleFormIterator>
                </ArrayInput>
                <ReferenceArrayInput source="welfare_benefits_id" reference="welfare_benefits" label="福利厚生">
                    <CheckboxGroupInput optionText="welfare_benefit" label="福利厚生" helperText="複数選択可"/>
                </ReferenceArrayInput>
                <TextInput source="note" label="備考" multiline helperText="ご自由に記入してください" />
            </SimpleForm>
        </Edit>
    );
}