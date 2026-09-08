# Portfolio — Đặng Quang Minh, Unity Game Developer

**Live: https://dangquangminh.vercel.app**

Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript. Không database, không backend,
không analytics bên thứ ba — mọi trang là HTML tĩnh sinh ra lúc build.

Repo này vừa là source của site, vừa là bản lưu trữ độc lập cho các store listing mà
site trích dẫn. Phần lớn README nói về lớp lưu trữ đó, vì đấy là chỗ duy nhất có
logic đáng kể.

---

## Nội dung nằm ở đâu

Toàn bộ chữ trên site nằm trong hai file, không component nào chứa nội dung cứng:

| File | Chứa gì |
|---|---|
| `content/profile.ts` | Tên, giới thiệu, kinh nghiệm, học vấn, kỹ năng, và phần đóng góp ở từng game |
| `content/ui.ts` | Nhãn giao diện (nút, tiêu đề mục, badge) |

Mỗi chuỗi có hai bản `{ en: '...', vi: '...' }`; sửa cả hai để giữ song ngữ.

Địa chỉ chi tiết mặc định không đăng. Cờ ở đầu `content/profile.ts`:

```ts
export const SHOW_STREET_ADDRESS = false; // true để hiện địa chỉ cấp đường/quận
```

Khi tắt, site chỉ hiển thị ở mức thành phố ("Hà Nội, Việt Nam").

Sửa nội dung xong:

```bash
npm run build      # kiểm tra không lỗi
npx vercel deploy --prod --yes
```

---

## Vì sao site tự lưu trữ store listing

Game mobile bị đổi tên, khoá theo vùng hoặc gỡ hẳn là chuyện thường. Đã xảy ra với
chính danh mục này: game tên `Jackal Retro - Tank Shooter` trong CV nay là
`Strike Force: Tank Shooter` trên App Store.

Nên site không bao giờ tải ảnh từ server của Google hay Apple lúc người dùng mở
trang. Mọi thứ nằm sẵn trong repo, ba lớp:

```
archive/<slug>/store-raw.json   JSON thô của store, nguyên vẹn
archive/<slug>/raw/*.orig       ảnh gốc full-res (~65 MB, giữ trong git,
                                  .vercelignore loại khỏi bản deploy)
public/games/<slug>/*.webp      bản đã resize mà site phục vụ (~2.8 MB)
content/store-data.json         manifest site đọc lúc build
```

Mỗi trang game hiển thị badge *"Archived <ngày>"* — số liệu là ảnh chụp tại thời
điểm đó, không phải số liệu trực tiếp. Link store chỉ là link phụ; listing chết thì
trang vẫn đầy đủ thông tin.

### Cập nhật lại số liệu

```bash
npm run archive
```

Kéo lại metadata + ảnh của cả 4 game, ghi đè tại chỗ. Nếu một listing đã bị gỡ,
`scripts/archive-stores.mjs` giữ nguyên bản archive cũ cho game đó, báo ra terminal,
và site vẫn build được. Thêm game mới: thêm một dòng vào `TARGETS` trong script, rồi
viết phần đóng góp tương ứng vào `gameContent` ở `content/profile.ts`.

---

## Trang CV in được — `/cv`

`/cv` là bản CV, dựng từ chính `content/profile.ts`. Không có bản chữ thứ hai, nên CV
không bao giờ lệch với site.

Nút **In / Lưu thành PDF** (hoặc Ctrl+P) rồi chọn "Save as PDF". Bản in tự động bỏ
nav, nút bấm và màu nền; chuyển sang chữ đen trên nền trắng, khổ A4, và không cắt đôi
một công việc hay một game giữa hai trang. Quy tắc in nằm cuối `app/globals.css`,
trong `@media print`. Muốn CV tiếng Việt thì đổi ngôn ngữ trên nav rồi mới in.

### File PDF tải sẵn

Nút **Tải PDF** trỏ tới file có sẵn trong `public/`, không phải in tại chỗ:

```
public/dang-quang-minh-cv.pdf       bản tiếng Anh
public/dang-quang-minh-cv-vi.pdf    bản tiếng Việt
```

Sinh lại:

```bash
npm run build && npm run cv:pdf
```

`scripts/make-cv-pdf.mjs` bật `next start`, dùng Playwright mở `/cv` (ép ngôn ngữ qua
`localStorage` trước khi trang chạy) rồi in ra PDF. Nó lấy khổ giấy và lề từ `@page`
trong `app/globals.css`, nên không có bản sao thứ hai của mấy con số đó.

Chromium đóng dấu thời gian tới từng giây vào PDF, nên script làm tròn xuống 0h —
chạy hai lần liên tiếp ra file giống hệt nhau từng byte, và CI chỉ commit khi CV
thật sự đổi.

## Ảnh share (Open Graph)

```bash
npm run og
```

Sinh `app/opengraph-image.png` (cho cả site) và `public/og/<slug>.png` (mỗi game một
tấm 1200×630, có icon, tên, thể loại, số liệu và hai ảnh chụp). Trước đó trang game
share bằng đúng một ảnh chụp điện thoại dạng dọc, mỗi nền tảng cắt một kiểu. Chạy lại
sau mỗi lần `npm run archive`.

## Structured data (JSON-LD)

`lib/schema.ts` sinh dữ liệu có cấu trúc cho công cụ tìm kiếm:

- `Person` + `ItemList` ở trang chủ — tên, chức danh, kỹ năng, 4 game.
- `VideoGame` ở mỗi trang game — kèm `aggregateRating` lấy từ số liệu đã archive.

Tất cả suy ra từ `content/profile.ts` và `content/store-data.json`, không khai lại
bằng tay: sửa nội dung thì schema tự đổi theo. Kiểm tra bằng
[Rich Results Test](https://search.google.com/test/rich-results).

## CI / tự động hoá

Trong `.github/workflows/`:

| Workflow | Khi nào chạy | Làm gì |
|---|---|---|
| `ci.yml` | mỗi push lên `main`, mỗi PR | `npm run typecheck` + `npm run build` |
| `archive.yml` | 02:00 UTC ngày 1 hàng tháng, hoặc bấm tay | chạy `npm run archive`, build thử, commit nếu số liệu store đổi |
| `cv-pdf.yml` | khi push đụng vào nội dung CV | in lại hai file PDF, commit nếu khác |
| `lighthouse.yml` | mỗi push lên `main`, mỗi PR | audit 4 trang, chặn nếu điểm tụt |

Ngưỡng Lighthouse nằm trong `.lighthouserc.json`: accessibility, SEO và
best-practices phải đạt **1.00**, performance tối thiểu **0.75** vì runner của GitHub
chậm hơn máy cá nhân. Đây là ngưỡng cố ý đặt cao — hiện trang chủ chưa đạt mốc
performance, nên `lighthouse.yml` đang báo đỏ.

`archive.yml` cần `contents: write` (đã khai trong file) và repo phải bật quyền ghi
cho `GITHUB_TOKEN` ở *Settings → Actions → General → Workflow permissions*, nếu không
bước commit sẽ bị từ chối khi push. Nếu một listing bị gỡ, script giữ bản archive cũ
và vẫn thoát 0, nên workflow báo xanh chứ không đỏ. Chạy tay: tab **Actions** →
*Archive store listings* → **Run workflow**.

---

## Chạy tại máy

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # bản production
```

## Cấu trúc

```
app/                 route + metadata (robots, sitemap, OG image, favicon)
components/          UI. Lang.tsx giữ state song ngữ EN/VI
content/             nội dung chữ + manifest store
lib/                 games.ts gộp dữ liệu store với nội dung tay; site.ts giữ URL gốc
scripts/
  archive-stores.mjs npm run archive
  make-cv-pdf.mjs    npm run cv:pdf
  make-og.mjs        npm run og
archive/             bản lưu trữ gốc (không deploy)
```

## Ghi chú kỹ thuật

- **Ảnh**: `images.unoptimized = true` trong `next.config.ts`. Ảnh đã resize sẵn lúc
  archive nên không tốn quota image-transform của Vercel free. Dùng thẻ `<img>` kèm
  `width`/`height` thật để không bị layout shift; mỗi ảnh có placeholder blur base64.
- **Tailwind v4**: không có `tailwind.config.js`. Token màu khai báo trong `@theme` ở
  `app/globals.css`.
- **Song ngữ**: ngôn ngữ nằm ở URL, không phải ở `localStorage`. `/` `/cv` `/games/x`
  là tiếng Anh; `/vi` `/vi/cv` `/vi/games/x` là tiếng Việt. Cả hai đều được sinh tĩnh,
  khai báo `hreflang` trỏ sang nhau, và có mặt trong sitemap — nên Google index được
  cả hai bản. Trước đó mọi trang đều xuất ra HTML tiếng Anh rồi mới đổi sau khi
  hydrate, nên bản tiếng Việt vô hình với công cụ tìm kiếm. Nút đổi ngôn ngữ giờ là
  một link điều hướng, không phải nút bật/tắt state.
- **Không JavaScript vẫn đọc được**: hiệu ứng fade-in chỉ kích hoạt khi `<html>` có
  class `.js`, class này do inline script thêm vào.

## Đổi tên miền

URL hiện tại do Vercel cấp. Muốn dùng tên miền riêng: mua domain, vào Vercel →
project `dangquangminh` → Settings → Domains, thêm domain, rồi sửa `SITE_URL` trong
`lib/site.ts` và deploy lại.

## Giấy phép

Mã nguồn có thể tham khảo tự do. Nội dung cá nhân (CV, ảnh chân dung) và toàn bộ tài
sản của store trong `archive/` cùng `public/games/` thuộc về chủ sở hữu tương ứng,
không dùng lại được.
