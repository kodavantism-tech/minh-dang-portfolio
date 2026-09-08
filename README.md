# Portfolio — Đặng Quang Minh, Unity Game Developer

**Live: https://dangquangminh.vercel.app**

Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript. No database, no backend, no
third-party analytics — every page is static HTML generated at build time.

---

## Sửa nội dung (việc bạn sẽ làm nhiều nhất)

Toàn bộ chữ trên site nằm trong **hai file**. Không cần đụng vào component nào.

| File | Chứa gì |
|---|---|
| `content/profile.ts` | Tên, giới thiệu, kinh nghiệm, học vấn, kỹ năng, và **đóng góp của bạn ở từng game** |
| `content/ui.ts` | Nhãn giao diện (nút, tiêu đề mục, badge) |

Mỗi chuỗi có hai bản: `{ en: '...', vi: '...' }`. Sửa cả hai để giữ song ngữ.

### Ba thứ bạn nên xem lại đầu tiên

1. **Mốc thời gian đi làm.** CV ghi thực tập 07/2024 → 09/2025, rồi Unity Developer
   09/2025 → nay. Trong chat bạn nói "đi làm từ 09/2024". Site đang theo CV. Nếu CV
   sai, sửa hai dòng `period` trong `experience` ở `content/profile.ts`.

2. **Địa chỉ.** Mặc định **không đăng**. Đầu `content/profile.ts`:
   ```ts
   export const SHOW_STREET_ADDRESS = false; // đổi thành true để hiện địa chỉ
   ```
   Địa chỉ hiện tại chỉ hiển thị ở mức thành phố ("Hà Nội, Việt Nam").

3. **Phần đóng góp từng game** (`gameContent` trong `content/profile.ts`). Nội dung
   hiện tại lấy từ CV. Càng thêm chi tiết cụ thể — con số, tên hệ thống, vấn đề đã
   giải — thì HR càng đánh giá cao.

Sửa xong thì:

```bash
npm run build      # kiểm tra không lỗi
npx vercel deploy --prod --yes
```

---

## Vì sao portfolio này sống lâu hơn các store listing

Game mobile bị đổi tên, khoá theo vùng hoặc gỡ hẳn là chuyện thường. **Đã xảy ra
với chính bạn**: game tên `Jackal Retro - Tank Shooter` trong CV giờ là
`Strike Force: Tank Shooter` trên App Store.

Nên site này **không bao giờ tải ảnh từ server của Google hay Apple lúc người dùng
mở trang**. Mọi thứ nằm sẵn trong repo, ba lớp:

```
archive/<slug>/store-raw.json   JSON thô của store, nguyên vẹn
archive/<slug>/raw/*.orig       ảnh gốc full-res (65 MB, giữ trong git,
                                  .vercelignore loại khỏi bản deploy)
public/games/<slug>/*.webp      bản đã resize mà site phục vụ (3.9 MB)
content/store-data.json         manifest site đọc lúc build
```

Mỗi trang game hiển thị badge *"Archived 7 September 2026"* — số liệu là ảnh chụp
tại thời điểm đó, không phải số liệu trực tiếp. Link store chỉ là link phụ; listing
chết thì trang vẫn đầy đủ thông tin.

### Cập nhật lại số liệu

```bash
npm run archive
```

Kéo lại metadata + ảnh của cả 4 game, ghi đè tại chỗ. Nếu một listing đã bị gỡ,
script **giữ nguyên bản archive cũ** cho game đó, báo lỗi ra terminal, và site vẫn
build được. Thêm game mới: thêm một dòng vào `TARGETS` trong
`scripts/archive-stores.mjs`, rồi viết phần đóng góp vào `gameContent`.

---

## Trang CV in được — `/cv`

`https://dangquangminh.vercel.app/cv` là bản CV, dựng từ **chính**
`content/profile.ts`. Không có bản chữ thứ hai, nên CV không bao giờ lệch với site.

Bấm nút **In / Lưu thành PDF** (hoặc Ctrl+P) rồi chọn "Save as PDF". Bản in tự
động bỏ nav, nút bấm và màu nền; chuyển sang chữ đen trên nền trắng, khổ A4, và
không cắt đôi một công việc hay một game giữa hai trang. Quy tắc in nằm cuối
`app/globals.css`, trong `@media print`.

Muốn CV tiếng Việt: đổi ngôn ngữ bằng nút trên nav **rồi mới** in.

### File PDF tải sẵn

Nút **Tải PDF** trỏ tới file có sẵn trong `public/`, không phải in tại chỗ — nhà
tuyển dụng bấm là có file ngay để forward nội bộ:

```
public/dang-quang-minh-cv.pdf       bản tiếng Anh
public/dang-quang-minh-cv-vi.pdf    bản tiếng Việt
```

Sinh lại:

```bash
npm run build && npm run cv:pdf
```

`scripts/make-cv-pdf.mjs` bật `next start`, dùng Playwright mở `/cv` (ép ngôn ngữ
qua `localStorage` trước khi trang chạy) rồi in ra PDF. Nó lấy khổ giấy và lề từ
`@page` trong `app/globals.css`, nên không có bản sao thứ hai của mấy con số đó.

Chromium đóng dấu thời gian tới từng giây vào PDF, nên script làm tròn xuống
0h — chạy hai lần liên tiếp ra file giống hệt nhau từng byte, và CI chỉ commit
khi CV thật sự đổi.

## Structured data (JSON-LD)

`lib/schema.ts` sinh dữ liệu có cấu trúc cho Google:

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

`archive.yml` cần quyền ghi (`contents: write`) — đã khai sẵn trong file. Nếu một
listing bị gỡ, script giữ bản archive cũ và vẫn thoát 0, nên workflow báo xanh chứ
không đỏ. Chạy tay: tab **Actions** → *Archive store listings* → **Run workflow**.

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
  make-og.mjs        tạo lại ảnh preview khi share link
archive/             bản lưu trữ gốc (không deploy)
```

## Ghi chú kỹ thuật

- **Ảnh**: `images.unoptimized = true` trong `next.config.ts`. Ảnh đã resize sẵn lúc
  archive nên không tốn quota image-transform của Vercel free. Dùng thẻ `<img>` kèm
  `width`/`height` thật để không bị layout shift; mỗi ảnh có placeholder blur base64.
- **Tailwind v4**: không có `tailwind.config.js`. Token màu khai báo trong `@theme`
  ở `app/globals.css`.
- **Song ngữ**: mặc định English; tự chuyển sang tiếng Việt nếu trình duyệt đặt
  ngôn ngữ `vi`; lựa chọn lưu trong `localStorage`.
- **Không JavaScript vẫn đọc được**: hiệu ứng fade-in chỉ kích hoạt khi `<html>` có
  class `.js`, class này do inline script thêm vào.
- **Đổi sang tên miền riêng**: sửa `lib/site.ts`, rồi trỏ domain trong dashboard Vercel.

## Đổi tên miền / URL

URL hiện tại do Vercel cấp. Muốn dùng tên miền riêng: mua domain, vào
Vercel → project `dangquangminh` → Settings → Domains, thêm domain, rồi sửa
`SITE_URL` trong `lib/site.ts` và deploy lại.
