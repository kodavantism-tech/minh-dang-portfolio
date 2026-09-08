/* ============================================================================
 *  EDIT THIS FILE TO CHANGE EVERY WORD ON THE SITE.
 *  Nothing else needs touching. Each string exists in two languages:
 *    en = English (default, for international HR / headhunters)
 *    vi = Tiếng Việt
 *  ------------------------------------------------------------------------
 *  PRIVACY SWITCHES — both default to OFF so nothing personal is published
 *  without you deciding. Flip to `true` only if you want them public.
 * ========================================================================== */

export const SHOW_STREET_ADDRESS = false; // set true to publish your district/street

export type Bi = { en: string; vi: string };

export const profile = {
  name: 'Đặng Quang Minh',
  nameLatin: 'Dang Quang Minh',
  role: { en: 'Unity Game Developer', vi: 'Lập trình viên Game Unity' } satisfies Bi,

  tagline: {
    en: 'I build the systems players actually touch — gameplay cores, UI architecture and enemy design for mobile titles with 800,000+ downloads.',
    vi: 'Tôi làm những hệ thống người chơi thật sự chạm vào — lõi gameplay, kiến trúc UI và thiết kế enemy cho các tựa game mobile đạt hơn 800.000 lượt tải.',
  } satisfies Bi,

  summary: {
    en: 'Unity developer with a strong foundation in OOP, SOLID and design patterns, focused on scalable, modular game architecture. Across four shipped mobile titles I have owned 3D gameplay cores, built UI systems from artist mockups, designed and implemented 20 enemy types, and written internal tools that removed repetitive work for the design team.',
    vi: 'Lập trình viên Unity với nền tảng vững về OOP, SOLID và design pattern, tập trung vào kiến trúc game module hoá và dễ mở rộng. Qua bốn tựa game mobile đã phát hành, tôi đảm nhiệm lõi gameplay 3D, xây hệ thống UI từ mockup của artist, thiết kế và triển khai 20 loại enemy, cùng các công cụ nội bộ giúp team design bớt việc thủ công.',
  } satisfies Bi,

  location: { en: 'Hanoi, Vietnam', vi: 'Hà Nội, Việt Nam' } satisfies Bi,
  streetAddress: { en: 'Thanh Xuan, Hanoi', vi: 'Thanh Xuân, Hà Nội' } satisfies Bi,

  email: 'minhdangquang0302@gmail.com',
} as const;

/* ---------------------------------------------------------------------------
 *  WORK EXPERIENCE
 * ------------------------------------------------------------------------- */

/**
 * First day at Falcon Game Studio. The "years at Falcon" stat on the home page
 * counts from here, so this and the earliest `period` string below have to
 * agree — keeping the date in one place is what stops them drifting apart.
 */
export const CAREER_START = '2024-09-01';

export type Role = {
  title: Bi;
  company: string;
  companyNote?: Bi;
  period: Bi;
  current: boolean;
  points: Bi[];
};

export const experience: Role[] = [
  {
    title: { en: 'Unity Developer', vi: 'Unity Developer' },
    company: 'Falcon Game Studio',
    companyNote: {
      en: 'Titles published as FALCON GAMES PTE. LTD. and CYLINDER GLOBAL PTE. LTD.',
      vi: 'Game phát hành dưới pháp nhân FALCON GAMES PTE. LTD. và CYLINDER GLOBAL PTE. LTD.',
    },
    period: { en: 'Sep 2025 — Present', vi: '09/2025 — Hiện tại' },
    current: true,
    points: [
      {
        en: 'Own features end to end across the full cycle: implementation, bug fixing and long-term system maintenance on live titles.',
        vi: 'Đảm nhiệm tính năng trọn vòng đời: triển khai, sửa lỗi và bảo trì hệ thống dài hạn trên các game đang vận hành.',
      },
      {
        en: 'Design and implement core mechanics and systems with scalability and maintainability as the primary constraint.',
        vi: 'Thiết kế và triển khai cơ chế lõi cùng các hệ thống, lấy khả năng mở rộng và bảo trì làm ràng buộc chính.',
      },
      {
        en: 'Optimise for mobile — memory management and rendering efficiency on low-end devices.',
        vi: 'Tối ưu cho mobile — quản lý bộ nhớ và hiệu năng rendering trên máy cấu hình thấp.',
      },
      {
        en: 'Contribute to brainstorming and technical design discussions, proposing solutions for gameplay and performance.',
        vi: 'Tham gia brainstorm và thảo luận thiết kế kỹ thuật, đề xuất giải pháp cho gameplay và hiệu năng.',
      },
      {
        en: 'Build automated internal tools that remove repetitive work from the team’s workflow.',
        vi: 'Xây dựng công cụ nội bộ tự động hoá, loại bỏ các thao tác lặp lại trong quy trình của team.',
      },
      {
        en: 'Review code to keep quality standards consistent across the project codebase.',
        vi: 'Review code để giữ chuẩn chất lượng thống nhất trong toàn bộ codebase.',
      },
    ],
  },
  {
    title: { en: 'Unity Developer Intern', vi: 'Thực tập sinh Unity Developer' },
    company: 'Falcon Game Studio',
    period: { en: 'Sep 2024 — Sep 2025', vi: '09/2024 — 09/2025' },
    current: false,
    points: [
      {
        en: 'Designed and maintained reusable, scalable code applying SOLID principles and common design patterns.',
        vi: 'Thiết kế và bảo trì code tái sử dụng được, dễ mở rộng, áp dụng nguyên lý SOLID và các design pattern phổ biến.',
      },
      {
        en: 'Kept games performant and responsive while identifying and fixing bugs.',
        vi: 'Giữ game mượt và phản hồi tốt, đồng thời phát hiện và xử lý lỗi.',
      },
      {
        en: 'Developed internal methods and tools that improved day-to-day efficiency for the project team.',
        vi: 'Phát triển phương pháp và công cụ nội bộ giúp team làm việc hiệu quả hơn.',
      },
      {
        en: 'Worked with cross-functional teammates to integrate logic and refine game feel.',
        vi: 'Phối hợp với các bộ phận khác để tích hợp logic và tinh chỉnh cảm giác chơi.',
      },
    ],
  },
];

/* ------------------------------------------------------------------------- */

export type SkillGroup = { label: Bi; items: string[] };

export const skills: SkillGroup[] = [
  {
    label: { en: 'Engine & Languages', vi: 'Engine & Ngôn ngữ' },
    items: ['Unity Engine', 'C#', 'C++'],
  },
  {
    label: { en: 'Architecture', vi: 'Kiến trúc' },
    items: [
      'SOLID',
      'OOP',
      'Design Patterns',
      'Singleton',
      'Observer',
      'State',
      'Factory',
      'Dependency Injection',
    ],
  },
  {
    label: { en: 'Gameplay & Systems', vi: 'Gameplay & Hệ thống' },
    items: [
      'Core gameplay mechanics',
      'Enemy & boss design',
      'UI systems (UGUI)',
      'Level logic',
      'Battle pass',
      'Hint systems',
      'Leaderboards',
    ],
  },
  {
    label: { en: 'Craft', vi: 'Kỹ năng khác' },
    items: [
      'Mobile optimisation',
      'Memory management',
      'Rendering efficiency',
      'Editor tooling',
      'Data structures & algorithms',
      'Code review',
    ],
  },
];

/* ---------------------------------------------------------------------------
 *  PER-GAME CONTRIBUTIONS
 *  The facts about each game (title, rating, installs, screenshots) are pulled
 *  from the stores by `npm run archive` and stored in content/store-data.json.
 *  What YOU did on each game is written here by hand.
 * ------------------------------------------------------------------------- */

export type GameContent = {
  slug: string;
  /** Name used on the site if the store listing was renamed or removed. */
  displayTitle?: string;
  alsoKnownAs?: string;
  role: Bi;
  /** One line an HR reader should remember. */
  headline: Bi;
  points: Bi[];
  tech: string[];
};

export const gameContent: GameContent[] = [
  {
    slug: 'yarn-pull-3d',
    role: { en: 'Core gameplay owner', vi: 'Phụ trách lõi gameplay' },
    headline: {
      en: 'Owned the 3D gameplay core of a cosy yarn-sorting puzzle that reached 177K+ installs at 4.58★.',
      vi: 'Đảm nhiệm lõi gameplay 3D của tựa puzzle sắp len thư giãn, đạt hơn 177K lượt tải với 4,58★.',
    },
    points: [
      {
        en: 'Spearheaded development of the core 3D gameplay mechanics and player interactions — the pull, tangle and sort loop the whole game rests on.',
        vi: 'Dẫn dắt phát triển cơ chế gameplay 3D lõi và tương tác người chơi — vòng lặp kéo, gỡ rối và phân loại mà toàn bộ game dựa vào.',
      },
      {
        en: 'Built and shipped new features and UI components straight from the Game Design Document.',
        vi: 'Xây dựng và phát hành tính năng mới cùng các thành phần UI trực tiếp từ Game Design Document.',
      },
      {
        en: 'Applied design patterns to keep the architecture decoupled and scalable as content grew past a hundred levels.',
        vi: 'Áp dụng design pattern để giữ kiến trúc tách rời và mở rộng được khi nội dung vượt hàng trăm màn.',
      },
      {
        en: 'Optimised 3D assets and game logic for smooth performance on mid- and low-end mobile devices.',
        vi: 'Tối ưu asset 3D và logic game để chạy mượt trên thiết bị mobile tầm trung và thấp.',
      },
    ],
    tech: ['Unity', 'C#', '3D gameplay', 'Design patterns', 'Mobile optimisation', 'UGUI'],
  },
  {
    slug: 'block-out-color-puzzle',
    role: { en: 'Gameplay & UI, feature ownership', vi: 'Gameplay & UI, sở hữu tính năng' },
    headline: {
      en: 'Took the project over and kept shipping — 600K+ installs, still updated 16 months after launch.',
      vi: 'Tiếp nhận dự án và tiếp tục phát hành — hơn 600K lượt tải, vẫn cập nhật sau 16 tháng ra mắt.',
    },
    points: [
      {
        en: 'Built the core UI system with teammates, translating artist mockups into functional, responsive game elements.',
        vi: 'Xây dựng hệ thống UI lõi cùng đồng đội, chuyển mockup của artist thành thành phần game hoạt động và co giãn đúng.',
      },
      {
        en: 'Developed new gameplay mechanics and live-ops features, including the battle pass and the hint system.',
        vi: 'Phát triển cơ chế gameplay mới và tính năng live-ops, gồm battle pass và hệ thống gợi ý.',
      },
      {
        en: 'Integrated the advanced level-solving logic established by senior engineers, hardening stability and smoothing block movement.',
        vi: 'Tích hợp logic giải màn nâng cao do các senior thiết lập, tăng độ ổn định và làm mượt chuyển động khối.',
      },
      {
        en: 'Wrote an editor tool that detects potential duplicate levels, removing a manual check from the design team’s workflow.',
        vi: 'Viết công cụ editor phát hiện màn chơi trùng lặp, bỏ hẳn một bước kiểm tra thủ công cho team design.',
      },
    ],
    tech: ['Unity', 'C#', 'UGUI', 'Editor tooling', 'Live-ops', 'Level systems'],
  },
  {
    slug: 'strike-force-tank-shooter',
    alsoKnownAs: 'Jackal Retro — Tank Shooter',
    role: { en: 'Enemy design & UI systems', vi: 'Thiết kế enemy & hệ thống UI' },
    headline: {
      en: 'Solely designed and implemented 18 enemies and 2 bosses for the late-game worlds, plus the leaderboard and upgrade UI.',
      vi: 'Một mình thiết kế và triển khai 18 enemy cùng 2 boss cho các world cuối, kèm UI leaderboard và nâng cấp.',
    },
    points: [
      {
        en: 'Exclusively designed and implemented 18 new enemies and 2 bosses for late-game Worlds 4 and 5, using modular code structures so new behaviours compose instead of branching.',
        vi: 'Một mình thiết kế và triển khai 18 enemy mới cùng 2 boss cho World 4 và 5, dùng cấu trúc code module để hành vi mới ghép lại thay vì phân nhánh.',
      },
      {
        en: 'Developed the leaderboard and upgrade UI systems end to end.',
        vi: 'Phát triển trọn vẹn hệ thống UI leaderboard và nâng cấp.',
      },
      {
        en: 'Prototyped and shipped new enemy special abilities from game design specifications.',
        vi: 'Prototype và hoàn thiện các kỹ năng đặc biệt của enemy từ đặc tả thiết kế.',
      },
    ],
    tech: ['Unity', 'C#', 'Modular AI', 'Boss design', 'UGUI', 'Progression systems'],
  },
  {
    slug: 'hole-escape-puzzle',
    role: { en: 'UI systems & gameplay support', vi: 'Hệ thống UI & hỗ trợ gameplay' },
    headline: {
      en: 'Built and optimised the UI system for the studio’s newest release, live since July 2026.',
      vi: 'Xây dựng và tối ưu hệ thống UI cho bản phát hành mới nhất của studio, ra mắt từ 07/2026.',
    },
    points: [
      {
        en: 'Translated artist mockups directly into the game environment, keeping layout faithful across device aspect ratios.',
        vi: 'Chuyển mockup của artist trực tiếp vào môi trường game, giữ đúng bố cục trên nhiều tỉ lệ màn hình.',
      },
      {
        en: 'Collaborated on building and optimising the UI system, and fixed gameplay bugs through the launch window.',
        vi: 'Phối hợp xây dựng và tối ưu hệ thống UI, xử lý lỗi gameplay xuyên suốt giai đoạn ra mắt.',
      },
    ],
    tech: ['Unity', 'C#', 'UGUI', 'Responsive layout', 'Bug triage'],
  },
];
