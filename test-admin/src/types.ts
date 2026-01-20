import type { RaRecord, Identifier } from "react-admin";

export interface Tag extends RaRecord {
  tag_name: string;
}

export interface Industry extends RaRecord {
  industry_name: string;
}

export interface Company extends RaRecord {
  company_name?: string;
  name?: string;
  industry_ids?: Identifier[];
  industry_names?: string[];
  [key: string]: unknown;
}

export interface Advertisement extends RaRecord {
  company_id: Identifier;
  title?: string;
  tag_ids?: Identifier[];
  tags?: string[];
  year?: number;
  [key: string]: unknown;
}

export interface Requirement extends RaRecord {
    advertisement_id: Identifier;
    company_id: Identifier;
    job_category_id?: Identifier;
    job_categories_name?: string;
    job_category_name?: string;
    job_category?: string;
    submission_objects_id?: Identifier[];
    submission_objects?: string[];
    submission_object_names?: string[];
    prefecture_id?: Identifier[];
    prefectures?: string[];
    prefecture_names?: string[];
    welfare_benefits_id?: Identifier[];
    welfare_benefits?: string[];
    welfare_benefit_names?: string[];
    various_allowances?: Record<string, unknown>[];
    recruitment_flow?: string;
    employment_status?: string;
    required_days?: string;
    trial_period?: string;
    working_hours?: string;
    note?: string;
    recruiting_count?: number;
    starting_salary_first?: number;
    starting_salary_second?: number;
    starting_salary_third?: number;
    starting_salary_fourth?: number;
    salary_increase?: number;
    bonus?: number;
    holiday_leave?: number;
    flex?: boolean | string;
    employee_dormitory?: boolean | string;
    contract_housing?: boolean | string;
    updated_at?: string;
    created_at?: string;
    [key: string]: unknown;
}

export interface AccountFilter {
  company_name?: string;
}

export interface AdvertisementFilter {
  company_name?: string;
  year?: number;
  company_id?: Identifier;
  advertisement_id?: Identifier;
}
