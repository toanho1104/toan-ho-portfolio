import { db } from './index'
import { users, profiles, projects } from './schema'
import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'

// ─── User ────────────────────────────────────────────────────────────────────
const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@toanho.dev'
const password = process.env.SEED_ADMIN_PASSWORD

if (!password) {
  console.error('Missing SEED_ADMIN_PASSWORD. Set it in .env (local) or .env.production (server) before running seed.')
  process.exit(1)
}

const passwordHash = await hash(password, 12)

const [user] = await db
  .insert(users)
  .values({ email, passwordHash })
  .onConflictDoNothing()
  .returning()

const userId = user?.id ?? (await db.query.users.findFirst({ where: eq(users.email, email) }))!.id

console.log(`✓ User: ${email}`)

// ─── Profile ─────────────────────────────────────────────────────────────────
await db.insert(profiles).values({
  userId,
  name: 'Toan Ho',
  title: { vi: 'Lập trình viên React Native Senior', en: 'Senior React Native Developer' },
  bio: {
    vi: 'Lập trình viên mobile với hơn 4 năm kinh nghiệm xây dựng ứng dụng React Native. Đam mê tạo ra sản phẩm có trải nghiệm người dùng tốt.',
    en: 'Mobile developer with 4+ years building React Native apps. Passionate about crafting great user experiences.',
  },
  location: 'Ho Chi Minh City, Vietnam',
  email: 'toanho.dev@gmail.com',
  githubUrl: 'https://github.com/toanho1104',
  isAvailable: true,
}).onConflictDoNothing()

console.log('✓ Profile seeded')

// ─── Projects ────────────────────────────────────────────────────────────────
const sampleProjects = [
  {
    userId,
    title: { vi: 'Ứng dụng đặt xe nội địa', en: 'Ride-hailing App' },
    summary: {
      vi: 'Ứng dụng đặt xe tương tự Grab với tính năng theo dõi tài xế realtime.',
      en: 'Grab-like ride-hailing app with realtime driver tracking.',
    },
    description: {
      vi: '## Mô tả\nỨng dụng đặt xe với map tracking realtime, thanh toán online, đánh giá tài xế.\n\n## Vai trò\nLead mobile developer, xây dựng toàn bộ React Native app từ đầu.',
      en: '## Description\nRide-hailing app with realtime map tracking, online payment, driver rating.\n\n## Role\nLead mobile developer, built the entire React Native app from scratch.',
    },
    type: 'work' as const,
    status: 'completed' as const,
    techStack: ['React Native', 'TypeScript', 'Google Maps', 'Socket.io', 'Redux'],
    isFeatured: true,
    sortOrder: 1,
    startDate: new Date('2022-06-01'),
    endDate: new Date('2023-03-01'),
  },
  {
    userId,
    title: { vi: 'App quản lý sức khỏe cá nhân', en: 'Personal Health Tracker' },
    summary: {
      vi: 'Ứng dụng theo dõi sức khỏe tích hợp Apple HealthKit và Google Fit.',
      en: 'Health tracking app integrated with Apple HealthKit and Google Fit.',
    },
    description: {
      vi: '## Mô tả\nTheo dõi bước chân, giấc ngủ, nhịp tim. Tích hợp wearable devices.\n\n## Thách thức\nXử lý sync dữ liệu background với HealthKit mà không ảnh hưởng battery.',
      en: '## Description\nTrack steps, sleep, heart rate. Integrate with wearable devices.\n\n## Challenge\nHandle background data sync with HealthKit without impacting battery life.',
    },
    type: 'personal' as const,
    status: 'in-progress' as const,
    techStack: ['React Native', 'TypeScript', 'HealthKit', 'Google Fit', 'Reanimated'],
    githubUrl: 'https://github.com/toanho1104/health-tracker',
    isFeatured: true,
    sortOrder: 2,
    startDate: new Date('2024-01-01'),
  },
  {
    userId,
    title: { vi: 'Thư viện React Native Components', en: 'RN Component Library' },
    summary: {
      vi: 'Bộ UI components tái sử dụng cho React Native với hỗ trợ dark mode và i18n.',
      en: 'Reusable UI component library for React Native with dark mode and i18n support.',
    },
    description: {
      vi: '## Mô tả\nHơn 30 components được document đầy đủ với Storybook. Publish lên npm.\n\n## Highlights\n- 500+ GitHub stars\n- Hỗ trợ dark mode tự động\n- TypeScript first',
      en: '## Description\n30+ fully documented components with Storybook. Published to npm.\n\n## Highlights\n- 500+ GitHub stars\n- Automatic dark mode support\n- TypeScript first',
    },
    type: 'open-source' as const,
    status: 'completed' as const,
    techStack: ['React Native', 'TypeScript', 'Storybook', 'Reanimated', 'Skia'],
    githubUrl: 'https://github.com/toanho1104/rn-ui',
    isFeatured: true,
    sortOrder: 3,
    startDate: new Date('2023-06-01'),
    endDate: new Date('2024-06-01'),
  },
  {
    userId,
    title: { vi: 'Extension VSCode cho React Native', en: 'VSCode React Native Extension' },
    summary: {
      vi: 'Extension giúp generate component, hook boilerplate nhanh chóng trong VSCode.',
      en: 'VSCode extension for quickly generating React Native component and hook boilerplate.',
    },
    description: {
      vi: '## Mô tả\nGenerate file structure chuẩn chỉ bằng 1 command. Hỗ trợ nhiều template.',
      en: '## Description\nGenerate standard file structure with a single command. Supports multiple templates.',
    },
    type: 'open-source' as const,
    status: 'completed' as const,
    techStack: ['TypeScript', 'VSCode API', 'Node.js'],
    githubUrl: 'https://github.com/toanho1104/vscode-rn-snippets',
    isFeatured: false,
    sortOrder: 4,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-04-01'),
  },
]

await db.insert(projects).values(sampleProjects).onConflictDoNothing()

console.log(`✓ ${sampleProjects.length} projects seeded`)
console.log('\nDone! 🎉')
process.exit(0)
