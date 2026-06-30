export const SWAGGER_TAGS = {
  AUTH: 'Auth',
  PROFILE: 'Profile',
  RESUME: 'Resume',
  PROJECTS: 'Projects',
  SKILLS: 'Skills',
  EXPERIENCES: 'Experiences',
} as const

export const SWAGGER_TAG_DEFINITIONS = [
  { name: SWAGGER_TAGS.AUTH, description: 'Authentication endpoints' },
  { name: SWAGGER_TAGS.PROFILE, description: 'Profile management' },
  { name: SWAGGER_TAGS.RESUME, description: 'CV upload and download' },
  { name: SWAGGER_TAGS.PROJECTS, description: 'Projects management' },
  { name: SWAGGER_TAGS.SKILLS, description: 'Skills management' },
  { name: SWAGGER_TAGS.EXPERIENCES, description: 'Experiences management' },
]
