# STRATEGIX

## Quick Start（配置好环境变量后）

```bash
pnpm install
pnpm dev
```

## 环境变量配置指南

### AWS 配置

| 变量名            | 说明            | 示例值                  |
| ----------------- | --------------- | ----------------------- |
| AMAZON_REGION     | AWS 区域        | ap-northeast-2          |
| AMAZON_KEY        | AWS 访问密钥 ID | ABCDEFGHIJKLMNOPQ       |
| AMAZON_SECRET     | AWS 访问密钥    | hbfdsafhasfsjhfdkuasdhb |
| AMAZON_TABLE_NAME | DynamoDB 表名   | strategix               |

### 认证配置

| 变量名                  | 说明                    | 来源                      |
| ----------------------- | ----------------------- | ------------------------- |
| AUTH_SECRET             | 认证加密密钥            | 通过 `npx auth` 生成      |
| AUTH_RESEND_KEY         | Resend 服务 API 密钥    | Resend 控制台             |
| AUTH_GITHUB_ID          | GitHub OAuth App ID     | GitHub 开发者设置         |
| AUTH_GITHUB_SECRET      | GitHub OAuth App Secret | GitHub 开发者设置         |
| AUTH_REDIRECT_PROXY_URL | 认证重定向 URL          | `${应用部署URL}/api/auth` |

### 验证码配置

#### Turnstile

| 变量名                            | 说明                          |
| --------------------------------- | ----------------------------- |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY    | Cloudflare Turnstile 站点密钥 |
| NEXT_PRIVATE_TURNSTILE_SECRET_KEY | Cloudflare Turnstile 密钥     |

#### reCAPTCHA（实际上并未使用）

| 变量名                             | 说明                      |
| ---------------------------------- | ------------------------- |
| NEXT_PUBLIC_RECHAPTCHA_SITE_KEY    | Google reCAPTCHA 站点密钥 |
| NEXT_PRIVATE_RECHAPTCHA_SECRET_KEY | Google reCAPTCHA 密钥     |

### 其他配置

| 变量名                  | 说明          | 示例值                  |
| ----------------------- | ------------- | ----------------------- |
| EMAIL_FROM              | 系统发件邮箱  | <no-reply@pdli.site>    |
| VISUAL_CROSSING_API_KEY | 天气 API 密钥 | KKKKKKKKKKKKKKKKKKKKKKK |

### 使用说明

1. 在项目根目录创建 `.env.local` 文件
2. 将上述环境变量添加到 `.env.local` 文件中
3. `pnpm dev` 启动项目
