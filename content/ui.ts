import type { Bi } from './profile';

/** Every piece of interface chrome, in both languages. */
export const ui = {
  navWork: { en: 'Work', vi: 'Dự án' },
  navExperience: { en: 'Experience', vi: 'Kinh nghiệm' },
  navSkills: { en: 'Skills', vi: 'Kỹ năng' },
  navContact: { en: 'Contact', vi: 'Liên hệ' },

  heroKicker: { en: 'Unity Game Developer · Hanoi', vi: 'Lập trình viên Game Unity · Hà Nội' },
  heroCtaWork: { en: 'See the games', vi: 'Xem các game' },
  heroCtaContact: { en: 'Get in touch', vi: 'Liên hệ' },

  statDownloads: { en: 'Downloads', vi: 'Lượt tải' },
  statDownloadsNote: { en: 'Google Play, 3 titles', vi: 'Google Play, 3 tựa game' },
  statTitles: { en: 'Shipped titles', vi: 'Game đã phát hành' },
  statTitlesNote: { en: 'iOS & Android', vi: 'iOS & Android' },
  statRating: { en: 'Average rating', vi: 'Điểm trung bình' },
  statRatingNote: { en: 'Weighted by rating count', vi: 'Trung bình có trọng số' },
  statYears: { en: 'Years at Falcon', vi: 'Năm tại Falcon' },
  statYearsNote: { en: 'Intern to developer', vi: 'Từ thực tập lên developer' },

  workTitle: { en: 'Shipped games', vi: 'Game đã phát hành' },
  workLead: {
    en: 'Four live mobile titles. Every screenshot, rating and install count below was captured directly from the stores and stored in this site — so the work survives even if a listing is pulled.',
    vi: 'Bốn tựa game mobile đang phát hành. Toàn bộ ảnh, đánh giá và lượt tải bên dưới được lấy trực tiếp từ store và lưu ngay trong site — nên hồ sơ vẫn còn nguyên kể cả khi listing bị gỡ.',
  },

  experienceTitle: { en: 'Experience', vi: 'Kinh nghiệm làm việc' },
  educationTitle: { en: 'Education', vi: 'Học vấn' },
  skillsTitle: { en: 'Skills', vi: 'Kỹ năng' },
  skillsLead: {
    en: 'What I reach for when a feature has to ship and still be maintainable six months later.',
    vi: 'Những thứ tôi dùng khi một tính năng vừa phải kịp phát hành, vừa phải bảo trì được sau sáu tháng.',
  },

  contactTitle: { en: 'Let’s talk', vi: 'Cùng trao đổi' },
  contactLead: {
    en: 'Open to Unity developer roles — gameplay, systems or tools. The fastest way to reach me is email.',
    vi: 'Sẵn sàng cho các vị trí Unity Developer — gameplay, hệ thống hoặc tooling. Cách nhanh nhất là qua email.',
  },
  contactEmail: { en: 'Email', vi: 'Email' },
  contactGithub: { en: 'GitHub', vi: 'GitHub' },
  contactPhone: { en: 'Phone', vi: 'Điện thoại' },
  contactLocation: { en: 'Location', vi: 'Địa điểm' },
  copyEmail: { en: 'Copy', vi: 'Sao chép' },
  copied: { en: 'Copied', vi: 'Đã chép' },

  roleLabel: { en: 'My role', vi: 'Vai trò của tôi' },
  whatIDid: { en: 'What I did', vi: 'Tôi đã làm gì' },
  gallery: { en: 'Screens', vi: 'Hình ảnh' },
  aboutGame: { en: 'About the game', vi: 'Về game' },
  techLabel: { en: 'Tech', vi: 'Công nghệ' },
  backToWork: { en: 'All games', vi: 'Tất cả game' },
  viewCase: { en: 'Read the case study', vi: 'Xem chi tiết' },
  openStore: { en: 'Open store listing', vi: 'Mở trang store' },
  storePlay: { en: 'Google Play', vi: 'Google Play' },
  storeIos: { en: 'App Store', vi: 'App Store' },

  installs: { en: 'Installs', vi: 'Lượt cài' },
  rating: { en: 'Rating', vi: 'Đánh giá' },
  ratings: { en: 'ratings', vi: 'lượt đánh giá' },
  released: { en: 'Released', vi: 'Ra mắt' },
  lastUpdate: { en: 'Last update', vi: 'Cập nhật cuối' },
  version: { en: 'Version', vi: 'Phiên bản' },
  publisher: { en: 'Publisher', vi: 'Nhà phát hành' },
  genre: { en: 'Genre', vi: 'Thể loại' },
  alsoKnownAs: { en: 'Previously released as', vi: 'Từng phát hành với tên' },

  archivedTitle: { en: 'Archived listing', vi: 'Bản lưu trữ' },
  archivedBody: {
    en: 'Store data and screenshots captured on {date} and served from this site. Mobile listings get renamed, regionally restricted or delisted — this page keeps working either way.',
    vi: 'Dữ liệu và ảnh chụp store được lưu ngày {date} và phục vụ ngay từ site này. Listing mobile có thể bị đổi tên, giới hạn khu vực hoặc gỡ bỏ — trang này vẫn hoạt động bình thường.',
  },
  archivedShort: { en: 'Archived {date}', vi: 'Lưu ngày {date}' },

  footerNote: {
    en: 'Built with Next.js. Store assets archived locally so this portfolio outlives the listings.',
    vi: 'Xây bằng Next.js. Tài nguyên store được lưu cục bộ để portfolio tồn tại lâu hơn các listing.',
  },
  langLabel: { en: 'Tiếng Việt', vi: 'English' },

  notFoundTitle: { en: 'Page not found', vi: 'Không tìm thấy trang' },
  notFoundBody: { en: 'That page does not exist.', vi: 'Trang này không tồn tại.' },
  notFoundCta: { en: 'Back home', vi: 'Về trang chủ' },
} satisfies Record<string, Bi>;

export type UiKey = keyof typeof ui;
