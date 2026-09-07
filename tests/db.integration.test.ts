import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

// Integration test against the real (seeded) SQLite database.
// Read-only: verifies the seed produced a coherent, queryable dataset.
describe('seeded database integration', () => {
  let prisma: PrismaClient

  beforeAll(() => {
    prisma = new PrismaClient()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('has at least one published news article with an author', async () => {
    const article = await prisma.newsArticle.findFirst({
      where: { status: 'PUBLISHED' },
    })
    expect(article).toBeTruthy()
  })

  it('has published projects with slugs and statuses', async () => {
    const projects = await prisma.project.findMany()
    expect(projects.length).toBeGreaterThan(0)
    for (const p of projects) {
      expect(p.slug).toBeTruthy()
      expect(p.status).toBeTruthy()
    }
  })

  it('has open job postings with locations', async () => {
    const jobs = await prisma.job.findMany({ where: { status: 'PUBLISHED' } })
    expect(jobs.length).toBeGreaterThan(0)
    for (const j of jobs) {
      expect(j.location).toBeTruthy()
    }
  })

  it('has documents in the library', async () => {
    const docs = await prisma.document.findMany()
    expect(docs.length).toBeGreaterThan(0)
  })

  it('has the super admin and editor users', async () => {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@enec.gov.ae' },
    })
    const editor = await prisma.user.findUnique({
      where: { email: 'editor@enec.gov.ae' },
    })
    expect(admin?.role).toBe('SUPER_ADMIN')
    expect(admin?.isActive).toBe(true)
    expect(editor?.role).toBe('EDITOR')
  })

  it('has leadership profiles with bio', async () => {
    const leaders = await prisma.leadershipProfile.findMany()
    expect(leaders.length).toBeGreaterThan(0)
    for (const l of leaders) {
      expect(l.biography).toBeTruthy()
    }
  })

  it('has sustainability metrics', async () => {
    const metrics = await prisma.sustainabilityMetric.findMany()
    expect(metrics.length).toBeGreaterThan(0)
  })

  it('has navigation items and site settings', async () => {
    const nav = await prisma.navigationItem.findMany()
    const settings = await prisma.siteSetting.findMany()
    expect(nav.length).toBeGreaterThan(0)
    expect(settings.length).toBeGreaterThan(0)
  })
})