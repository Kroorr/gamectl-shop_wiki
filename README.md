# Gakuran Wiki

Next.js 15、MDX 和 `next-intl` 构建的多语言静态站点。生产站点通过 GitHub Actions 构建，并以 Cloudflare Workers Static Assets 发布到 `https://muscle-legends.wiki`。

## 本地开发

```bash
npm install
npm run dev
```

根据项目部署约定，不在本地运行生产构建。`npm run build` 由 GitHub Actions 执行，产物写入已被 Git 忽略的 `out/`。

可在本地运行的非生产检查：

```bash
npx tsc --noEmit
npm run test:export
```

## 部署流程

推送到 `main` 或在 GitHub Actions 页面手动运行 `Deploy Cloudflare Worker` 后，工作流依次执行：

1. `npm ci`
2. `npm run test:export`
3. `npm run build`
4. `npm run verify:export`
5. `wrangler deploy`

这是纯静态部署：`wrangler.jsonc` 没有 `main`，只上传 `out/`，不使用 SSR、OpenNext 或运行时 Worker 脚本。

## GitHub Secrets

打开 GitHub 仓库：`Settings → Secrets and variables → Actions → New repository secret`。

必须添加：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

页面广告需要时添加：

- `NEXT_PUBLIC_AD_KEY_320X50`
- `NEXT_PUBLIC_AD_KEY_160X600`
- `NEXT_PUBLIC_AD_KEY_160X300`
- `NEXT_PUBLIC_AD_KEY_300X250`

`NEXT_PUBLIC_*` 会被编译进公开的静态文件，不应存放真正的服务器密钥。使用 GitHub Secrets 只是为了统一管理配置。

Cloudflare Account ID 可以在 Cloudflare 控制台的账户或域名 Overview 页面找到。API Token 使用 Cloudflare 的 `Edit Cloudflare Workers` 模板，权限只限定到承载 `muscle-legends.wiki` 的账户和 Zone。Token 与 Account ID 必须属于同一 Cloudflare 账户。

## 首次上线

1. 确认 `muscle-legends.wiki` 已是 Cloudflare 的 Active Zone。
2. 配置上述 GitHub Secrets。
3. 在隔离分支完成类型检查和配置 dry-run。
4. 合并到 `main`，由 GitHub Actions 进行第一次真实静态构建和部署。
5. 检查 Actions 日志中构建、静态产物校验和 Wrangler 部署全部成功。
6. 检查首页、每种语言文章、`robots.txt`、`sitemap.xml` 和真实 404 状态码。
7. 在 Google Search Console 重新提交 `https://muscle-legends.wiki/sitemap.xml`。

`wrangler.jsonc` 中的 Custom Domain 配置会把 `muscle-legends.wiki` 直接绑定到名为 `gakuran` 的 Worker，并由 Cloudflare 管理对应的 apex DNS 记录。不要手工创建指向 Vercel 的 apex 记录。

## www 永久重定向

`www.muscle-legends.wiki` 不承载第二份网站内容。

1. 在 Cloudflare DNS 中确保 `www` 有一条已代理（橙色云）的 DNS 记录；无源站时可使用 Cloudflare 文档建议的占位地址。
2. 在 `Rules → Redirect Rules` 创建永久重定向。
3. 匹配 `www.muscle-legends.wiki` 的所有路径。
4. 目标主机设为 `muscle-legends.wiki`，状态码选择 `301`。
5. 保留原路径和查询参数。

预期：

```text
https://www.muscle-legends.wiki/guide/example?x=1
→ 301 https://muscle-legends.wiki/guide/example?x=1
```

## 验证与回滚

上线后至少检查：

```text
/                                      200
/guide                                 200
/guide/gakuran-how-to-play             200
/pt/guide/gakuran-how-to-play          200
/es/guide/gakuran-how-to-play          200
/id/guide/gakuran-how-to-play          200
/robots.txt                            200
/sitemap.xml                           200
/definitely-not-a-real-page            404
```

如果部署失败，不要反复修改 DNS。先查看 GitHub Actions 中第一个失败步骤。代码问题通过 revert `main` 上的迁移提交触发上一版本重部署；域名问题则检查 Cloudflare Workers 的 `Settings → Domains & Routes` 中 `muscle-legends.wiki` Custom Domain 的状态。
