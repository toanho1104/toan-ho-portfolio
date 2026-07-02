import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { db } from "./index";
import {
  users,
  profiles,
  experiences,
  projects,
  skillCategories,
  skills,
} from "./schema";

const email = process.env.SEED_ADMIN_EMAIL ?? "admin@toanho.dev";
const password = process.env.SEED_ADMIN_PASSWORD;

if (!password) {
  console.error(
    "Missing SEED_ADMIN_PASSWORD. Set it in .env (local) or .env.production (server) before running seed.",
  );
  process.exit(1);
}

const passwordHash = await hash(password, 12);

const [user] = await db
  .insert(users)
  .values({ email, passwordHash })
  .onConflictDoUpdate({
    target: users.email,
    set: { passwordHash, updatedAt: new Date() },
  })
  .returning();

const userId = user?.id;
if (!userId) {
  console.error("Failed to seed user");
  process.exit(1);
}

console.log(`✓ User: ${email}`);

// ─── Reset portfolio data (idempotent re-run) ────────────────────────────────
const existingCategories = await db.query.skillCategories.findMany({
  where: eq(skillCategories.userId, userId),
  columns: { id: true },
});
for (const cat of existingCategories) {
  await db.delete(skills).where(eq(skills.categoryId, cat.id));
}
await db.delete(skillCategories).where(eq(skillCategories.userId, userId));
await db.delete(projects).where(eq(projects.userId, userId));
await db.delete(experiences).where(eq(experiences.userId, userId));

// ─── Profile ─────────────────────────────────────────────────────────────────
const profilePayload = {
  userId,
  name: "Toan Ho",
  title: {
    vi: "Lập trình viên React Native / Full-stack",
    en: "React Native / Full-stack Developer",
  },
  bio: {
    vi: "Khoảng 4,5 năm kinh nghiệm frontend (React Native, Next.js), 1,5 năm backend (Node.js) và DevOps. Đam mê animation và micro-interaction để tạo trải nghiệm mượt mà. Từng lead nhiều dự án mobile, mở rộng sang API, database và triển khai cloud.",
    en: "Around 4.5 years in frontend (React Native, Next.js) and 1.5 years in backend (Node.js) plus DevOps. Passionate about animations and micro-interactions for smooth product experiences. Led multiple mobile projects and expanded into APIs, databases, and cloud deployment.",
  },
  location: "Ho Chi Minh City, Vietnam",
  email: "toanho1104@gmail.com",
  phone: "0336222456",
  githubUrl: "https://github.com/toanho1104",
  linkedinUrl: "https://www.linkedin.com/in/toanho1104/",
  youtubeUrl: "https://www.youtube.com/toanho1104",
  educationSchool: {
    vi: "Trường Đại học Công Thương TP.HCM",
    en: "Industrial University of Ho Chi Minh City",
  },
  educationDegree: {
    vi: "Cử nhân",
    en: "Bachelor's Degree",
  },
  isAvailable: true,
};

const existingProfile = await db.query.profiles.findFirst({
  where: eq(profiles.userId, userId),
});

if (existingProfile) {
  await db
    .update(profiles)
    .set({ ...profilePayload, updatedAt: new Date() })
    .where(eq(profiles.userId, userId));
} else {
  await db.insert(profiles).values(profilePayload);
}

console.log("✓ Profile seeded");

// ─── Experiences ─────────────────────────────────────────────────────────────
const [satavan] = await db
  .insert(experiences)
  .values({
    userId,
    company: "SATAVAN",
    position: {
      vi: "Lập trình viên React Native",
      en: "React Native Developer",
    },
    description: {
      vi: "Phát triển ứng dụng quản lý bán hàng tích hợp Odoo. Xây dựng luồng đăng nhập, giỏ hàng, sửa lỗi và phát hành app lên App Store / Google Play.",
      en: "Built a sales management app integrated with Odoo. Implemented login, cart flows, bug fixes, and App Store / Google Play releases.",
    },
    techStack: [
      "React Native CLI",
      "Redux",
      "Redux Saga",
      "Async Storage",
      "Axios",
    ],
    startDate: new Date("2020-12-01"),
    endDate: new Date("2021-11-30"),
    isCurrent: false,
    sortOrder: 3,
  })
  .returning();

const [vinova] = await db
  .insert(experiences)
  .values({
    userId,
    company: "Vinova",
    position: {
      vi: "Lập trình viên React Native",
      en: "React Native Developer",
    },
    description: {
      vi: "Tham gia mạng xã hội khu dân cư (Nextblock) và ứng dụng bảo hiểm đa sản phẩm (Alpaca) với UI động theo loại hình bảo hiểm.",
      en: "Worked on a neighborhood social app (Nextblock) and a multi-product insurance platform (Alpaca) with dynamic UI per insurance type.",
    },
    techStack: [
      "React Native CLI",
      "Redux",
      "Redux Toolkit",
      "Redux Thunk",
      "Redux Saga",
      "Async Storage",
      "Axios",
      "Fastlane",
    ],
    startDate: new Date("2022-01-01"),
    endDate: new Date("2022-08-31"),
    isCurrent: false,
    sortOrder: 2,
  })
  .returning();

const [sens] = await db
  .insert(experiences)
  .values({
    userId,
    company: "Sens",
    position: {
      vi: "Senior Mobile / Full-stack Developer",
      en: "Senior Mobile / Full-stack Developer",
    },
    description: {
      vi: "Lead mobile, tối ưu hiệu năng, animation, notification và deploy. Mở rộng sang backend (tRPC, Elysia, Drizzle) và hạ tầng AWS cho các sản phẩm fintech, food-tech và IoT.",
      en: "Led mobile work: performance, animations, notifications, and releases. Expanded into backend (tRPC, Elysia, Drizzle) and AWS infrastructure for fintech, food-tech, and IoT products.",
    },
    techStack: [
      "React Native CLI",
      "Expo",
      "React Query",
      "Reanimated",
      "XState",
      "Zustand",
      "tRPC",
      "Elysia",
      "Drizzle",
      "PostgreSQL",
      "AWS",
    ],
    startDate: new Date("2022-09-01"),
    isCurrent: true,
    sortOrder: 1,
  })
  .returning();

console.log("✓ 3 experiences seeded");

// ─── Projects ─────────────────────────────────────────────────────────────────
const projectRows = [
  {
    userId,
    experienceId: satavan!.id,
    title: { vi: "DuyDuy", en: "DuyDuy" },
    summary: {
      vi: "Ứng dụng quản lý bán hàng tích hợp Odoo.",
      en: "Sales management app integrated with Odoo.",
    },
    description: {
      vi: "## Vai trò\nLogin, giỏ hàng, sửa lỗi, phát hành App Store & Google Play.\n\n## Quy mô team\n3 FE (1 mobile, 2 web), 2 BE",
      en: "## Role\nLogin, cart, bug fixes, App Store & Google Play releases.\n\n## Team size\n3 FE (1 mobile, 2 web), 2 BE",
    },
    type: "work" as const,
    status: "completed" as const,
    techStack: [
      "React Native CLI",
      "Redux",
      "Redux Saga",
      "Async Storage",
      "Axios",
    ],
    isFeatured: false,
    sortOrder: 10,
    startDate: new Date("2020-12-01"),
    endDate: new Date("2021-11-30"),
  },
  {
    userId,
    experienceId: vinova!.id,
    title: { vi: "Nextblock", en: "Nextblock" },
    summary: {
      vi: "Mạng xã hội mini cho cư dân cùng khu dân cư.",
      en: "Neighborhood social network for residents in the same area.",
    },
    description: {
      vi: "## Vai trò\nSửa lỗi, bảo trì tính năng social feed.\n\n## Quy mô team\n3 FE mobile, 1.5 BE",
      en: "## Role\nBug fixes and social feed maintenance.\n\n## Team size\n3 mobile FE, 1.5 BE",
    },
    type: "work" as const,
    status: "completed" as const,
    techStack: [
      "React Native CLI",
      "Redux Toolkit",
      "Redux Thunk",
      "Async Storage",
      "Axios",
    ],
    isFeatured: false,
    sortOrder: 9,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2022-08-31"),
  },
  {
    userId,
    experienceId: vinova!.id,
    title: { vi: "Alpaca", en: "Alpaca" },
    summary: {
      vi: "Ứng dụng bảo hiểm: bán hàng và yêu cầu bồi thường.",
      en: "Insurance app for sales and claims.",
    },
    description: {
      vi: "## Vai trò\nBảo hiểm xe, gia đình, du lịch (dynamic UI), sửa lỗi.\n\n## Quy mô team\n2 FE mobile, 1.5 BE",
      en: "## Role\nVehicle, home, and travel insurance flows (dynamic UI), bug fixes.\n\n## Team size\n2 mobile FE, 1.5 BE",
    },
    type: "work" as const,
    status: "completed" as const,
    techStack: [
      "React Native CLI",
      "Redux",
      "Redux Saga",
      "Async Storage",
      "Axios",
      "Fastlane",
    ],
    isFeatured: false,
    sortOrder: 8,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2022-08-31"),
  },
  {
    userId,
    experienceId: sens!.id,
    title: { vi: "Kitcho", en: "Kitcho" },
    summary: {
      vi: "Nền tảng giao đồ ăn kiểu Grab với 3 app: customer, chef, driver.",
      en: "Food delivery platform (Grab-like) with customer, chef, and driver apps.",
    },
    description: {
      vi: "## Vai trò\nTối ưu hiệu năng, UI, location, animation, push notification, deploy.\n\n## Quy mô team\n4 mobile, 1 web, 3 BE",
      en: "## Role\nPerformance, UI, location, animations, push notifications, deployment.\n\n## Team size\n4 mobile, 1 web, 3 BE",
    },
    type: "work" as const,
    status: "completed" as const,
    techStack: ["React Native CLI", "React Query", "Async Storage", "Axios"],
    isFeatured: true,
    sortOrder: 7,
    startDate: new Date("2022-09-01"),
  },
  {
    userId,
    experienceId: sens!.id,
    title: { vi: "Woobleu", en: "Woobleu" },
    summary: {
      vi: "Đặt đồ ăn không cần login — đặt ngay hoặc đặt trước có kế hoạch.",
      en: "Food ordering without login — instant or scheduled orders.",
    },
    description: {
      vi: "## Vai trò\nTech lead: login, danh sách món, đặt hàng, Stripe, lên lịch giao hàng.",
      en: "## Role\nTech lead: login, menu, checkout, Stripe payments, delivery scheduling.",
    },
    type: "work" as const,
    status: "completed" as const,
    techStack: [
      "React Native CLI",
      "React Query",
      "React Hook Form",
      "Async Storage",
      "Axios",
      "XState",
    ],
    isFeatured: true,
    sortOrder: 6,
    startDate: new Date("2023-01-01"),
  },
  {
    userId,
    experienceId: sens!.id,
    title: { vi: "Fleatmint", en: "Fleatmint" },
    summary: {
      vi: "Sản phẩm crypto — feed, blog và animation mượt.",
      en: "Crypto product with feed, blog, and fluid animations.",
    },
    description: {
      vi: "## Vai trò\nTech lead: feed, blog, animation.\n\n## Quy mô team\n2.5 mobile, 1 BE, 2 web",
      en: "## Role\nTech lead: feed, blog, animations.\n\n## Team size\n2.5 mobile, 1 BE, 2 web",
    },
    type: "work" as const,
    status: "completed" as const,
    techStack: [
      "React Native CLI",
      "Reanimated",
      "React Context",
      "React Query",
      "React Hook Form",
      "MMKV",
      "FlashList",
      "Axios",
    ],
    isFeatured: true,
    sortOrder: 5,
    startDate: new Date("2023-06-01"),
  },
  {
    userId,
    experienceId: sens!.id,
    title: { vi: "Travel Tracking", en: "Travel Tracking" },
    summary: {
      vi: "Check-in địa điểm để tích điểm đổi quà.",
      en: "Location check-ins to earn loyalty points.",
    },
    description: {
      vi: "## Vai trò\nTech lead: tracking, sửa lỗi.",
      en: "## Role\nTech lead: location tracking and bug fixes.",
    },
    type: "work" as const,
    status: "completed" as const,
    techStack: [
      "React Native Expo",
      "NativeWind",
      "React Query",
      "Zustand",
      "React Hook Form",
      "MMKV",
      "FlashList",
      "Axios",
    ],
    isFeatured: false,
    sortOrder: 4,
    startDate: new Date("2024-01-01"),
  },
  {
    userId,
    experienceId: sens!.id,
    title: { vi: "IHI", en: "IHI" },
    summary: {
      vi: "Tạo và phát hành chứng chỉ cho học viên qua deep link.",
      en: "Certificate issuance for students via deep links.",
    },
    description: {
      vi: "## Vai trò\nTech lead: symlink, Apple/Google login, tạo chứng chỉ & PDF.\n\n## Quy mô team\n1 mobile, 1 BE",
      en: "## Role\nTech lead: symlinks, Apple/Google auth, certificate & PDF generation.\n\n## Team size\n1 mobile, 1 BE",
    },
    type: "work" as const,
    status: "completed" as const,
    techStack: [
      "React Native Expo",
      "React Query",
      "Zustand",
      "React Hook Form",
      "Zod",
      "MMKV",
      "FlashList",
      "Axios",
    ],
    isFeatured: false,
    sortOrder: 3,
    startDate: new Date("2024-06-01"),
  },
  {
    userId,
    experienceId: sens!.id,
    title: { vi: "Ichi", en: "Ichi" },
    summary: {
      vi: "Nền tảng idol live kết hợp crypto.",
      en: "Idol live-streaming platform with crypto integration.",
    },
    description: {
      vi: "## Vai trò\nViết API blog và tracking blog.\n\n## Quy mô team\n2 web, 2 BE",
      en: "## Role\nBlog APIs and blog analytics tracking.\n\n## Team size\n2 web, 2 BE",
    },
    type: "work" as const,
    status: "completed" as const,
    techStack: ["tRPC", "Prisma", "PostgreSQL", "Trigger.dev", "Redis"],
    isFeatured: false,
    sortOrder: 2,
    startDate: new Date("2024-09-01"),
  },
  {
    userId,
    experienceId: sens!.id,
    title: { vi: "Woo", en: "Woo" },
    summary: {
      vi: "Mạng lưới quản lý hệ thống nước — tối ưu chi phí vận hành.",
      en: "Water utility network management to optimize operating costs.",
    },
    description: {
      vi: "## Vai trò\nThiết kế DB, API, app mobile (scan đồng hồ, quản lý hộ gia đình), một phần BO.\n\n## Quy mô team\n1 mobile + BE, 2 web",
      en: "## Role\nDatabase design, APIs, mobile app (meter scan, households), partial back-office.\n\n## Team size\n1 mobile + BE, 2 web",
    },
    type: "work" as const,
    status: "in-progress" as const,
    techStack: [
      "AWS",
      "Elysia",
      "Drizzle",
      "PostgreSQL",
      "TimescaleDB",
      "Redis",
      "Next.js",
      "Expo",
      "ReStyle",
      "React Query",
      "Zustand",
      "MMKV",
    ],
    isFeatured: true,
    sortOrder: 1,
    startDate: new Date("2025-01-01"),
  },
];

await db.insert(projects).values(projectRows);
console.log(`✓ ${projectRows.length} projects seeded`);

// ─── Skills ───────────────────────────────────────────────────────────────────
type SkillSeed = { name: string; type: "technical" | "soft" | "language" | "tool" | "ai"; level?: "beginner" | "intermediate" | "advanced" | "expert"; years?: number };

const skillGroups: Array<{
  name: { vi: string; en: string };
  sortOrder: number;
  items: SkillSeed[];
}> = [
  {
    name: { vi: "Ngôn ngữ lập trình", en: "Programming Languages" },
    sortOrder: 1,
    items: [{ name: "JavaScript", type: "technical", level: "expert", years: 5 }],
  },
  {
    name: { vi: "Frameworks & Libraries", en: "Frameworks & Libraries" },
    sortOrder: 2,
    items: [
      { name: "React Native CLI", type: "technical", level: "expert", years: 5 },
      { name: "Expo", type: "technical", level: "advanced", years: 3 },
      { name: "Next.js", type: "technical", level: "advanced", years: 2 },
      { name: "tRPC", type: "technical", level: "advanced", years: 1 },
      { name: "Elysia", type: "technical", level: "advanced", years: 1 },
      { name: "Prisma", type: "technical", level: "advanced", years: 1 },
      { name: "Drizzle ORM", type: "technical", level: "advanced", years: 1 },
      { name: "Reanimated", type: "technical", level: "advanced", years: 3 },
      { name: "React Query", type: "technical", level: "expert", years: 3 },
      { name: "Redux / Redux Toolkit", type: "technical", level: "advanced", years: 4 },
      { name: "XState", type: "technical", level: "advanced", years: 2 },
      { name: "Zustand", type: "technical", level: "advanced", years: 2 },
      { name: "React Hook Form + Zod", type: "technical", level: "advanced", years: 3 },
      { name: "NativeWind", type: "technical", level: "intermediate", years: 1 },
      { name: "ReStyle", type: "technical", level: "intermediate", years: 1 },
      { name: "FlashList", type: "technical", level: "advanced", years: 2 },
      { name: "MMKV", type: "technical", level: "advanced", years: 2 },
      { name: "Axios", type: "technical", level: "expert", years: 5 },
      { name: "Socket.io", type: "technical", level: "intermediate", years: 2 },
    ],
  },
  {
    name: { vi: "Công cụ & Nền tảng", en: "Tools & Platforms" },
    sortOrder: 3,
    items: [
      { name: "Git", type: "tool", level: "expert", years: 5 },
      { name: "Linux", type: "tool", level: "advanced", years: 3 },
      { name: "Docker", type: "tool", level: "advanced", years: 2 },
      { name: "Kubernetes", type: "tool", level: "intermediate", years: 1 },
      { name: "CI/CD", type: "tool", level: "advanced", years: 2 },
      { name: "AWS", type: "tool", level: "advanced", years: 2 },
      { name: "Nginx", type: "tool", level: "intermediate", years: 2 },
    ],
  },
  {
    name: { vi: "Cơ sở dữ liệu", en: "Databases" },
    sortOrder: 4,
    items: [
      { name: "PostgreSQL", type: "technical", level: "advanced", years: 2 },
      { name: "TimescaleDB", type: "technical", level: "intermediate", years: 1 },
      { name: "Redis", type: "technical", level: "intermediate", years: 1 },
    ],
  },
  {
    name: { vi: "Khái niệm", en: "Concepts" },
    sortOrder: 5,
    items: [
      { name: "RESTful API", type: "technical", level: "expert", years: 4 },
      { name: "Microservices", type: "technical", level: "intermediate", years: 1 },
      { name: "Native Modules", type: "technical", level: "advanced", years: 3 },
    ],
  },
  {
    name: { vi: "AI Tools", en: "AI Tools" },
    sortOrder: 6,
    items: [
      { name: "GitHub Copilot", type: "ai", level: "advanced" },
      { name: "Cursor IDE", type: "ai", level: "advanced" },
      { name: "Prompt Engineering", type: "ai", level: "advanced" },
      { name: "LLM API Integration", type: "ai", level: "intermediate" },
    ],
  },
  {
    name: { vi: "Kỹ năng mềm", en: "Soft Skills" },
    sortOrder: 7,
    items: [
      { name: "Technical documentation analysis", type: "soft", level: "advanced" },
      { name: "System flow explanation", type: "soft", level: "advanced" },
      { name: "Problem-solving & root-cause debugging", type: "soft", level: "expert" },
      { name: "Teamwork (Agile / Scrum)", type: "soft", level: "advanced" },
      { name: "Self-learning", type: "soft", level: "expert" },
    ],
  },
  {
    name: { vi: "Ngôn ngữ", en: "Languages" },
    sortOrder: 8,
    items: [
      {
        name: "English — technical reading & writing",
        type: "language",
        level: "advanced",
      },
      { name: "Vietnamese — native", type: "language", level: "expert" },
    ],
  },
];

let skillCount = 0;
for (const group of skillGroups) {
  const [category] = await db
    .insert(skillCategories)
    .values({
      userId,
      name: group.name,
      sortOrder: group.sortOrder,
    })
    .returning();

  await db.insert(skills).values(
    group.items.map((item, index) => ({
      categoryId: category!.id,
      name: item.name,
      type: item.type,
      level: item.level ?? "advanced",
      yearsOfExperience: item.years,
      sortOrder: index + 1,
    })),
  );
  skillCount += group.items.length;
}

console.log(`✓ ${skillGroups.length} skill categories, ${skillCount} skills seeded`);
console.log("\nDone! 🎉");
process.exit(0);
