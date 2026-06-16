# SAFE_IMAGE_REGISTRY

Purpose: prevent high-risk legacy indication images from being selected by AI design briefs without human review.

## Safe-To-Use Candidate Images
These are candidates for Phase 2/3 content, still requiring human rights/quality confirmation.

| Asset path | Use case | Risk level | Notes |
|---|---|---|---|
| `照片/產品主圖.jpg` | Product hero | LOW | Product-only visual. |
| `照片/產品細節_膏體質地.jpg` | Texture education | LOW | Avoid medical claims. |
| `照片/產品細節_擠壓口.jpg` | Use amount / hygiene | LOW | Good for controlled-use copy. |
| `照片/使用方式1_取適量塗抹.jpg` | Correct use | LOW | Pair with safety reminder. |
| `照片/使用方式2_畫圈按摩.jpg` | Massage relaxation | LOW | Do not imply treatment. |
| `照片/久坐上班族.jpg` | Long sitting | LOW | Use for daily care. |
| `照片/開車族.jpg` | Driver audience | LOW | Avoid nerve/disc claims. |
| `照片/運動族.jpg` | Sports audience | LOW | Avoid injury repair claims. |
| `照片/搬重物工作者.jpg` | Labor audience | MEDIUM | Avoid injury/treatment language. |
| `line_assets/圖文選單_2500x1686.png` | LINE OA education | LOW | Manual review before reuse. |

## Do-Not-Auto-Use Images
Do not auto-select assets with filenames containing: 適應症, 止痛, 止癢, 感冒, 刀傷, 中暑, 肚痛, 風溼, 風濕, 神經, 骨刺, 治療, 消炎, 活血, 排毒, 經絡.

## Rule
LEON may reference this registry in briefs, but final image choice remains human-reviewed.
