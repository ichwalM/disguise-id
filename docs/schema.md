## Table `mst_roles`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `role_name` | `varchar` |  Unique |
| `created_at` | `timestamptz` |  Nullable |

## Table `mst_users`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `email` | `text` |  Unique |
| `full_name` | `varchar` |  Nullable |
| `role_id` | `int8` |  Nullable |
| `avatar_url` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `mst_timelines`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `user_id` | `uuid` |  Nullable |
| `title` | `varchar` |  |
| `description` | `text` |  Nullable |
| `status` | `varchar` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `ai_models`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `version_name` | `varchar` |  Unique |
| `architecture_type` | `varchar` |  |
| `hyperparameters` | `jsonb` |  Nullable |
| `weights_storage_path` | `text` |  Nullable |
| `is_active` | `bool` |  Nullable |
| `created_by` | `uuid` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `ai_training_logs`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `model_id` | `uuid` |  Nullable |
| `epoch_number` | `int4` |  |
| `generator_loss` | `numeric` |  Nullable |
| `discriminator_loss` | `numeric` |  Nullable |
| `duration_seconds` | `numeric` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `datasets`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `dataset_name` | `varchar` |  Unique |
| `description` | `text` |  Nullable |
| `total_images` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `forensic_cases`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `case_number` | `varchar` |  Unique |
| `investigator_id` | `uuid` |  Nullable |
| `notes` | `text` |  Nullable |
| `status` | `varchar` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `forensic_results`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `case_id` | `uuid` |  Nullable |
| `model_used` | `uuid` |  Nullable |
| `dataset_source` | `uuid` |  Nullable |
| `input_cctv_url` | `text` |  |
| `target_clean_url` | `text` |  Nullable |
| `output_ai_url` | `text` |  Nullable |
| `ssim_score` | `numeric` |  Nullable |
| `psnr_score` | `numeric` |  Nullable |
| `processing_time_ms` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

