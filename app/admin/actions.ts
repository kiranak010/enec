'use server'

import fs from 'node:fs/promises'
import path from 'node:path'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/auth/dal'
import { logAudit } from '@/lib/audit'
import { slugify } from '@/lib/utils'
import { inferMediaType } from '@/lib/admin'
import {
  PAGE_STATUSES,
  NEWS_STATUSES,
  PROJECT_STATUSES,
  JOB_STATUSES,
  EMPLOYMENT_TYPES,
  APPLICATION_STATUSES,
  DOCUMENT_CATEGORIES,
  ROLES,
} from '@/lib/admin'

export type ActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const slugSchema = z
  .string()
  .trim()
  .min(2, 'Slug is required.')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers and hyphens.')

function err(message: string): ActionState {
  return { status: 'error', message }
}

function ok(message: string): ActionState {
  return { status: 'success', message }
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '')
}

function optStr(formData: FormData, key: string): string | null {
  const value = str(formData, key).trim()
  return value === '' ? null : value
}

function optNum(formData: FormData, key: string): number | null {
  const value = str(formData, key).trim()
  if (value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function optDate(formData: FormData, key: string): Date | null {
  const value = str(formData, key).trim()
  if (value === '') return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function isChecked(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on'
}

function splitTags(raw: string): { name: string; slug: string }[] {
  return Array.from(
    new Set(
      raw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    )
  ).map((name) => ({ name, slug: slugify(name) }))
}

async function requireAdmin() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')
  return session
}

async function saveUpload(file: File): Promise<{ url: string; sizeKb: number; type: string }> {
  const bytes = Buffer.from(await file.arrayBuffer())
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const filename = `${Date.now()}-${safeName}`
  const dir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, filename), bytes)
  return {
    url: `/uploads/${filename}`,
    sizeKb: Math.round(bytes.length / 1024),
    type: inferMediaType(file.type, filename),
  }
}

function uniqueError(e: unknown, label: string): ActionState {
  const code = (e as { code?: string })?.code
  if (code === 'P2002') return err(`A ${label} with that slug already exists.`)
  return err(`Could not save the ${label}. Please try again.`)
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

const pageSchema = z.object({
  title: z.string().trim().min(2, 'Title is required.').max(200, 'Title is too long.'),
  slug: slugSchema,
  seoTitle: z.string().trim().max(200).nullish(),
  seoDescription: z.string().trim().max(320).nullish(),
  heroTitle: z.string().trim().max(200).nullish(),
  heroSubtitle: z.string().trim().max(200).nullish(),
  content: z.string().nullish(),
  status: z.enum(PAGE_STATUSES),
})

async function parsePage(formData: FormData) {
  return pageSchema.safeParse({
    title: str(formData, 'title'),
    slug: str(formData, 'slug') || slugify(str(formData, 'title')),
    seoTitle: optStr(formData, 'seoTitle') ?? undefined,
    seoDescription: optStr(formData, 'seoDescription') ?? undefined,
    heroTitle: optStr(formData, 'heroTitle') ?? undefined,
    heroSubtitle: optStr(formData, 'heroSubtitle') ?? undefined,
    content: str(formData, 'content') || undefined,
    status: str(formData, 'status') || 'DRAFT',
  })
}

export async function createPage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const parsed = await parsePage(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  try {
    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        heroTitle: data.heroTitle ?? null,
        heroSubtitle: data.heroSubtitle ?? null,
        content: data.content ?? null,
        status: data.status,
        publishDate: data.status === 'PUBLISHED' ? new Date() : null,
        authorId: session.userId,
      },
    })
    await logAudit({ userId: session.userId, action: 'CREATE', resource: 'Page', resourceId: page.id, metadata: { slug: page.slug } })
    redirect('/admin/pages')
  } catch (e) {
    return uniqueError(e, 'page')
  }
}

export async function updatePage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = str(formData, 'id')
  if (!id) return err('Missing page id.')
  const parsed = await parsePage(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const existing = await prisma.page.findUnique({ where: { id } })
  if (!existing) return err('Page not found.')

  try {
    const page = await prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        heroTitle: data.heroTitle ?? null,
        heroSubtitle: data.heroSubtitle ?? null,
        content: data.content ?? null,
        status: data.status,
        publishDate:
          data.status === 'PUBLISHED' && !existing.publishDate ? new Date() : existing.publishDate,
        authorId: existing.authorId ?? session.userId,
      },
    })
    await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'Page', resourceId: page.id, metadata: { slug: page.slug } })
    redirect('/admin/pages')
  } catch (e) {
    return uniqueError(e, 'page')
  }
}

export async function deletePage(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const existing = await prisma.page.findUnique({ where: { id } })
  if (!existing) return err('Page not found.')
  await prisma.page.delete({ where: { id } })
  await logAudit({ userId: session.userId, action: 'DELETE', resource: 'Page', resourceId: id, metadata: { slug: existing.slug } })
  revalidatePath('/admin/pages')
  return ok('Page deleted.')
}

// ---------------------------------------------------------------------------
// News articles
// ---------------------------------------------------------------------------

const articleSchema = z.object({
  title: z.string().trim().min(2, 'Title is required.').max(200, 'Title is too long.'),
  slug: slugSchema,
  subtitle: z.string().trim().max(300).nullish(),
  excerpt: z.string().trim().min(10, 'Please provide a short excerpt.').max(500),
  content: z.string().min(20, 'Article content is required.'),
  categoryId: z.string().min(1, 'Please choose a category.'),
  tags: z.string().trim().max(500).nullish(),
  heroImage: z.string().trim().max(500).nullish(),
  authorName: z.string().trim().max(150).nullish(),
  readTimeMins: z.number().int().min(1).max(240).nullish(),
  seoTitle: z.string().trim().max(200).nullish(),
  seoDescription: z.string().trim().max(320).nullish(),
  isFeatured: z.boolean(),
  status: z.enum(NEWS_STATUSES),
})

async function parseArticle(formData: FormData) {
  return articleSchema.safeParse({
    title: str(formData, 'title'),
    slug: str(formData, 'slug') || slugify(str(formData, 'title')),
    subtitle: optStr(formData, 'subtitle') ?? undefined,
    excerpt: str(formData, 'excerpt'),
    content: str(formData, 'content'),
    categoryId: str(formData, 'categoryId'),
    tags: optStr(formData, 'tags') ?? undefined,
    heroImage: optStr(formData, 'heroImage') ?? undefined,
    authorName: optStr(formData, 'authorName') ?? undefined,
    readTimeMins: optNum(formData, 'readTimeMins') ?? undefined,
    seoTitle: optStr(formData, 'seoTitle') ?? undefined,
    seoDescription: optStr(formData, 'seoDescription') ?? undefined,
    isFeatured: isChecked(formData, 'isFeatured'),
    status: str(formData, 'status') || 'DRAFT',
  })
}

async function articleTagData(formData: FormData) {
  const raw = str(formData, 'tags')
  const tags = splitTags(raw)
  return tags.map((tag) => ({
    tag: {
      connectOrCreate: {
        where: { slug: tag.slug },
        create: { name: tag.name, slug: tag.slug },
      },
    },
  }))
}

export async function createArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const parsed = await parseArticle(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const category = await prisma.newsCategory.findUnique({ where: { id: data.categoryId } })
  if (!category) return err('Please choose a valid category.')

  try {
    const article = await prisma.newsArticle.create({
      data: {
        title: data.title,
        slug: data.slug,
        subtitle: data.subtitle ?? null,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId,
        heroImage: data.heroImage ?? null,
        authorName: data.authorName ?? null,
        readTimeMins: data.readTimeMins ?? null,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        isFeatured: data.isFeatured,
        status: data.status,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        tags: { create: await articleTagData(formData) },
      },
    })
    await logAudit({ userId: session.userId, action: 'CREATE', resource: 'NewsArticle', resourceId: article.id, metadata: { slug: article.slug } })
    redirect('/admin/news')
  } catch (e) {
    return uniqueError(e, 'article')
  }
}

export async function updateArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = str(formData, 'id')
  if (!id) return err('Missing article id.')
  const parsed = await parseArticle(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const existing = await prisma.newsArticle.findUnique({ where: { id } })
  if (!existing) return err('Article not found.')
  const category = await prisma.newsCategory.findUnique({ where: { id: data.categoryId } })
  if (!category) return err('Please choose a valid category.')

  try {
    const article = await prisma.newsArticle.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        subtitle: data.subtitle ?? null,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId,
        heroImage: data.heroImage ?? null,
        authorName: data.authorName ?? null,
        readTimeMins: data.readTimeMins ?? null,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        isFeatured: data.isFeatured,
        status: data.status,
        publishedAt:
          data.status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
        tags: { deleteMany: {}, create: await articleTagData(formData) },
      },
    })
    await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'NewsArticle', resourceId: article.id, metadata: { slug: article.slug } })
    redirect('/admin/news')
  } catch (e) {
    return uniqueError(e, 'article')
  }
}

export async function deleteArticle(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const existing = await prisma.newsArticle.findUnique({ where: { id } })
  if (!existing) return err('Article not found.')
  await prisma.newsArticle.delete({ where: { id } })
  await logAudit({ userId: session.userId, action: 'DELETE', resource: 'NewsArticle', resourceId: id, metadata: { slug: existing.slug } })
  revalidatePath('/admin/news')
  return ok('Article deleted.')
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const projectSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.').max(200, 'Name is too long.'),
  slug: slugSchema,
  location: z.string().trim().min(2, 'Location is required.').max(200),
  country: z.string().trim().min(2, 'Country is required.').max(200),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
  capacityMw: z.number().min(0).max(100000).nullish(),
  technology: z.string().trim().min(2, 'Technology is required.').max(200),
  status: z.enum(PROJECT_STATUSES),
  summary: z.string().trim().min(10, 'Please provide a summary.').max(500),
  description: z.string().min(20, 'Project description is required.'),
  heroImage: z.string().trim().max(500).nullish(),
  websiteUrl: z.string().trim().max(500).nullish(),
  featured: z.boolean(),
  published: z.boolean(),
  startDate: z.string().nullish(),
  completionDate: z.string().nullish(),
})

async function parseProject(formData: FormData) {
  return projectSchema.safeParse({
    name: str(formData, 'name'),
    slug: str(formData, 'slug') || slugify(str(formData, 'name')),
    location: str(formData, 'location'),
    country: str(formData, 'country'),
    latitude: optNum(formData, 'latitude') ?? undefined,
    longitude: optNum(formData, 'longitude') ?? undefined,
    capacityMw: optNum(formData, 'capacityMw') ?? undefined,
    technology: str(formData, 'technology'),
    status: str(formData, 'status') || 'PLANNED',
    summary: str(formData, 'summary'),
    description: str(formData, 'description'),
    heroImage: optStr(formData, 'heroImage') ?? undefined,
    websiteUrl: optStr(formData, 'websiteUrl') ?? undefined,
    featured: isChecked(formData, 'featured'),
    published: true,
    startDate: str(formData, 'startDate') || undefined,
    completionDate: str(formData, 'completionDate') || undefined,
  })
}

export async function createProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const parsed = await parseProject(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        slug: data.slug,
        location: data.location,
        country: data.country,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        capacityMw: data.capacityMw ?? null,
        technology: data.technology,
        status: data.status,
        summary: data.summary,
        description: data.description,
        heroImage: data.heroImage ?? null,
        websiteUrl: data.websiteUrl ?? null,
        featured: data.featured,
        published: true,
        startDate: data.startDate ? optDate(formData, 'startDate') : null,
        completionDate: data.completionDate ? optDate(formData, 'completionDate') : null,
      },
    })
    await logAudit({ userId: session.userId, action: 'CREATE', resource: 'Project', resourceId: project.id, metadata: { slug: project.slug } })
    redirect('/admin/projects')
  } catch (e) {
    return uniqueError(e, 'project')
  }
}

export async function updateProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = str(formData, 'id')
  if (!id) return err('Missing project id.')
  const parsed = await parseProject(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing) return err('Project not found.')

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        location: data.location,
        country: data.country,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        capacityMw: data.capacityMw ?? null,
        technology: data.technology,
        status: data.status,
        summary: data.summary,
        description: data.description,
        heroImage: data.heroImage ?? null,
        websiteUrl: data.websiteUrl ?? null,
        featured: data.featured,
        published: true,
        startDate: data.startDate ? optDate(formData, 'startDate') : null,
        completionDate: data.completionDate ? optDate(formData, 'completionDate') : null,
      },
    })
    await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'Project', resourceId: project.id, metadata: { slug: project.slug } })
    redirect('/admin/projects')
  } catch (e) {
    return uniqueError(e, 'project')
  }
}

export async function deleteProject(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing) return err('Project not found.')
  await prisma.project.delete({ where: { id } })
  await logAudit({ userId: session.userId, action: 'DELETE', resource: 'Project', resourceId: id, metadata: { slug: existing.slug } })
  revalidatePath('/admin/projects')
  return ok('Project deleted.')
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

const jobSchema = z.object({
  title: z.string().trim().min(2, 'Title is required.').max(200),
  slug: slugSchema,
  department: z.string().trim().min(2, 'Department is required.').max(200),
  location: z.string().trim().min(2, 'Location is required.').max(200),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  summary: z.string().trim().min(10, 'Please provide a short summary.').max(500),
  description: z.string().min(20, 'Job description is required.'),
  requirements: z.string().nullish(),
  status: z.enum(JOB_STATUSES),
  expiresAt: z.string().nullish(),
})

async function parseJob(formData: FormData) {
  return jobSchema.safeParse({
    title: str(formData, 'title'),
    slug: str(formData, 'slug') || slugify(str(formData, 'title')),
    department: str(formData, 'department'),
    location: str(formData, 'location'),
    employmentType: str(formData, 'employmentType') || 'FULL_TIME',
    summary: str(formData, 'summary'),
    description: str(formData, 'description'),
    requirements: str(formData, 'requirements') || undefined,
    status: str(formData, 'status') || 'DRAFT',
    expiresAt: str(formData, 'expiresAt') || undefined,
  })
}

export async function createJob(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const parsed = await parseJob(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  try {
    const job = await prisma.job.create({
      data: {
        title: data.title,
        slug: data.slug,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType,
        summary: data.summary,
        description: data.description,
        requirements: data.requirements ?? null,
        status: data.status,
        expiresAt: data.expiresAt ? optDate(formData, 'expiresAt') : null,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      },
    })
    await logAudit({ userId: session.userId, action: 'CREATE', resource: 'Job', resourceId: job.id, metadata: { slug: job.slug } })
    redirect('/admin/jobs')
  } catch (e) {
    return uniqueError(e, 'job')
  }
}

export async function updateJob(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = str(formData, 'id')
  if (!id) return err('Missing job id.')
  const parsed = await parseJob(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const existing = await prisma.job.findUnique({ where: { id } })
  if (!existing) return err('Job not found.')

  try {
    const job = await prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType,
        summary: data.summary,
        description: data.description,
        requirements: data.requirements ?? null,
        status: data.status,
        expiresAt: data.expiresAt ? optDate(formData, 'expiresAt') : null,
        publishedAt:
          data.status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    })
    await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'Job', resourceId: job.id, metadata: { slug: job.slug } })
    redirect('/admin/jobs')
  } catch (e) {
    return uniqueError(e, 'job')
  }
}

export async function deleteJob(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const existing = await prisma.job.findUnique({ where: { id } })
  if (!existing) return err('Job not found.')
  await prisma.job.delete({ where: { id } })
  await logAudit({ userId: session.userId, action: 'DELETE', resource: 'Job', resourceId: id, metadata: { slug: existing.slug } })
  revalidatePath('/admin/jobs')
  return ok('Job deleted.')
}

// ---------------------------------------------------------------------------
// Job applications
// ---------------------------------------------------------------------------

export async function updateApplicationStatus(id: string, status: string): Promise<ActionState> {
  const session = await requireAdmin()
  if (!APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) {
    return err('Invalid application status.')
  }
  const existing = await prisma.jobApplication.findUnique({ where: { id } })
  if (!existing) return err('Application not found.')
  await prisma.jobApplication.update({ where: { id }, data: { status: status as never } })
  await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'JobApplication', resourceId: id, metadata: { status } })
  revalidatePath('/admin/applications')
  return ok('Application status updated.')
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

const documentSchema = z.object({
  title: z.string().trim().min(2, 'Title is required.').max(200),
  slug: slugSchema,
  category: z.enum(DOCUMENT_CATEGORIES),
  description: z.string().trim().max(500).nullish(),
  year: z.number().int().min(1900).max(2100).nullish(),
  fileUrl: z.string().trim().max(500).nullish(),
  published: z.boolean(),
})

async function parseDocument(formData: FormData) {
  return documentSchema.safeParse({
    title: str(formData, 'title'),
    slug: str(formData, 'slug') || slugify(str(formData, 'title')),
    category: str(formData, 'category'),
    description: optStr(formData, 'description') ?? undefined,
    year: optNum(formData, 'year') ?? undefined,
    fileUrl: optStr(formData, 'fileUrl') ?? undefined,
    published: isChecked(formData, 'published') || !str(formData, 'published'),
  })
}

async function resolveDocumentFile(
  formData: FormData,
  fileUrl: string | null
): Promise<{ fileUrl: string | null; fileSizeKb: number | null; fileType: string | null }> {
  const file = formData.get('file')
  if (file instanceof File && file.size > 0 && !fileUrl) {
    const saved = await saveUpload(file)
    return {
      fileUrl: saved.url,
      fileSizeKb: saved.sizeKb,
      fileType: file.type || file.name.split('.').pop() || null,
    }
  }
  return { fileUrl, fileSizeKb: null, fileType: null }
}

export async function createDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const parsed = await parseDocument(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  let resolved: Awaited<ReturnType<typeof resolveDocumentFile>>
  try {
    resolved = await resolveDocumentFile(formData, data.fileUrl ?? null)
  } catch {
    return err('The file could not be saved. Please try again.')
  }
  if (!resolved.fileUrl) return err('Please provide a file URL or upload a file.')

  try {
    const document = await prisma.document.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        description: data.description ?? null,
        year: data.year ?? null,
        fileUrl: resolved.fileUrl,
        fileSizeKb: resolved.fileSizeKb,
        fileType: resolved.fileType,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
      },
    })
    await logAudit({ userId: session.userId, action: 'CREATE', resource: 'Document', resourceId: document.id, metadata: { slug: document.slug } })
    redirect('/admin/documents')
  } catch (e) {
    return uniqueError(e, 'document')
  }
}

export async function updateDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = str(formData, 'id')
  if (!id) return err('Missing document id.')
  const parsed = await parseDocument(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const existing = await prisma.document.findUnique({ where: { id } })
  if (!existing) return err('Document not found.')

  let resolved: Awaited<ReturnType<typeof resolveDocumentFile>>
  try {
    resolved = await resolveDocumentFile(formData, data.fileUrl ?? null)
  } catch {
    return err('The file could not be saved. Please try again.')
  }
  if (!resolved.fileUrl) return err('Please provide a file URL.')

  try {
    const document = await prisma.document.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        description: data.description ?? null,
        year: data.year ?? null,
        fileUrl: resolved.fileUrl,
        fileSizeKb: resolved.fileSizeKb ?? existing.fileSizeKb,
        fileType: resolved.fileType ?? existing.fileType,
        published: data.published,
        publishedAt:
          data.published && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    })
    await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'Document', resourceId: document.id, metadata: { slug: document.slug } })
    redirect('/admin/documents')
  } catch (e) {
    return uniqueError(e, 'document')
  }
}

export async function deleteDocument(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const existing = await prisma.document.findUnique({ where: { id } })
  if (!existing) return err('Document not found.')
  await prisma.document.delete({ where: { id } })
  await logAudit({ userId: session.userId, action: 'DELETE', resource: 'Document', resourceId: id, metadata: { slug: existing.slug } })
  revalidatePath('/admin/documents')
  return ok('Document deleted.')
}

// ---------------------------------------------------------------------------
// Sustainability metrics
// ---------------------------------------------------------------------------

const metricSchema = z.object({
  label: z.string().trim().min(2, 'Label is required.').max(100),
  value: z.number().min(-1e15).max(1e15),
  unit: z.string().trim().min(1, 'Unit is required.').max(50),
  suffix: z.string().trim().max(50).nullish(),
  published: z.boolean(),
})

async function parseMetric(formData: FormData) {
  return metricSchema.safeParse({
    label: str(formData, 'label'),
    value: optNum(formData, 'value') ?? 0,
    unit: str(formData, 'unit'),
    suffix: optStr(formData, 'suffix') ?? undefined,
    published: isChecked(formData, 'published') || !str(formData, 'published'),
  })
}

export async function createMetric(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const parsed = await parseMetric(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const last = await prisma.sustainabilityMetric.findFirst({ orderBy: { sortOrder: 'desc' } })
  try {
    const metric = await prisma.sustainabilityMetric.create({
      data: {
        label: data.label,
        value: data.value,
        unit: data.unit,
        suffix: data.suffix ?? null,
        sortOrder: (last?.sortOrder ?? 0) + 1,
        published: data.published,
      },
    })
    await logAudit({ userId: session.userId, action: 'CREATE', resource: 'SustainabilityMetric', resourceId: metric.id, metadata: { label: metric.label } })
    revalidatePath('/admin/sustainability')
    return ok('Metric created.')
  } catch {
    return err('Could not create the metric. Please try again.')
  }
}

export async function updateMetric(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = str(formData, 'id')
  if (!id) return err('Missing metric id.')
  const parsed = await parseMetric(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const existing = await prisma.sustainabilityMetric.findUnique({ where: { id } })
  if (!existing) return err('Metric not found.')

  try {
    const metric = await prisma.sustainabilityMetric.update({
      where: { id },
      data: {
        label: data.label,
        value: data.value,
        unit: data.unit,
        suffix: data.suffix ?? null,
        published: data.published,
      },
    })
    await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'SustainabilityMetric', resourceId: metric.id, metadata: { label: metric.label } })
    revalidatePath('/admin/sustainability')
    return ok('Metric updated.')
  } catch {
    return err('Could not update the metric. Please try again.')
  }
}

export async function deleteMetric(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const existing = await prisma.sustainabilityMetric.findUnique({ where: { id } })
  if (!existing) return err('Metric not found.')
  await prisma.sustainabilityMetric.delete({ where: { id } })
  await logAudit({ userId: session.userId, action: 'DELETE', resource: 'SustainabilityMetric', resourceId: id, metadata: { label: existing.label } })
  revalidatePath('/admin/sustainability')
  return ok('Metric deleted.')
}

export async function reorderMetric(
  id: string,
  direction: 'up' | 'down'
): Promise<ActionState> {
  const session = await requireAdmin()
  const metrics = await prisma.sustainabilityMetric.findMany({ orderBy: { sortOrder: 'asc' } })
  const index = metrics.findIndex((m) => m.id === id)
  if (index === -1) return err('Metric not found.')
  const target = direction === 'up' ? metrics[index - 1] : metrics[index + 1]
  if (!target) return err('The metric is already at the edge of the list.')
  const current = metrics[index]

  await prisma.$transaction([
    prisma.sustainabilityMetric.update({ where: { id: current.id }, data: { sortOrder: target.sortOrder } }),
    prisma.sustainabilityMetric.update({ where: { id: target.id }, data: { sortOrder: current.sortOrder } }),
  ])
  await logAudit({ userId: session.userId, action: 'REORDER', resource: 'SustainabilityMetric', resourceId: id, metadata: { direction } })
  revalidatePath('/admin/sustainability')
  return ok('Metric reordered.')
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.').max(200),
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  role: z.enum(ROLES),
  isActive: z.boolean(),
})

const updateUserSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.').max(200),
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(8).nullish(),
  role: z.enum(ROLES),
  isActive: z.boolean(),
})

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const parsed = createUserSchema.safeParse({
    name: str(formData, 'name'),
    email: str(formData, 'email'),
    password: str(formData, 'password'),
    role: str(formData, 'role'),
    isActive: isChecked(formData, 'isActive') || !str(formData, 'isActive'),
  })
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) return err('A user with that email already exists.')

  const passwordHash = await bcrypt.hash(data.password, 10)
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        isActive: data.isActive,
      },
    })
    await logAudit({ userId: session.userId, action: 'CREATE', resource: 'User', resourceId: user.id, metadata: { email: user.email, role: user.role } })
    revalidatePath('/admin/users')
    return ok('User created.')
  } catch {
    return err('Could not create the user. Please try again.')
  }
}

export async function updateUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = str(formData, 'id')
  if (!id) return err('Missing user id.')
  const parsed = updateUserSchema.safeParse({
    name: str(formData, 'name'),
    email: str(formData, 'email'),
    password: str(formData, 'password') ? str(formData, 'password') : undefined,
    role: str(formData, 'role'),
    isActive: isChecked(formData, 'isActive') || !str(formData, 'isActive'),
  })
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) return err('User not found.')
  if (id === session.userId && !data.isActive) return err('You cannot deactivate your own account.')

  const emailTaken = await prisma.user.findFirst({ where: { email: data.email, id: { not: id } } })
  if (emailTaken) return err('Another user already uses that email.')

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        isActive: data.isActive,
        passwordHash: data.password ? await bcrypt.hash(data.password, 10) : existing.passwordHash,
      },
    })
    await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'User', resourceId: id, metadata: { email: user.email, role: user.role } })
    revalidatePath('/admin/users')
    return ok('User updated.')
  } catch {
    return err('Could not update the user. Please try again.')
  }
}

export async function deleteUser(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  if (id === session.userId) return err('You cannot delete your own account.')
  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) return err('User not found.')
  await prisma.user.delete({ where: { id } })
  await logAudit({ userId: session.userId, action: 'DELETE', resource: 'User', resourceId: id, metadata: { email: existing.email } })
  revalidatePath('/admin/users')
  return ok('User deleted.')
}

export async function setUserRole(id: string, role: string): Promise<ActionState> {
  const session = await requireAdmin()
  if (!ROLES.includes(role as (typeof ROLES)[number])) return err('Invalid role.')
  await prisma.user.update({ where: { id }, data: { role: role as never } })
  await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'User', resourceId: id, metadata: { role } })
  revalidatePath('/admin/users')
  return ok('Role updated.')
}

export async function setUserActive(id: string, isActive: boolean): Promise<ActionState> {
  const session = await requireAdmin()
  if (id === session.userId && !isActive) return err('You cannot deactivate your own account.')
  await prisma.user.update({ where: { id }, data: { isActive } })
  await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'User', resourceId: id, metadata: { isActive } })
  revalidatePath('/admin/users')
  return ok(isActive ? 'User activated.' : 'User deactivated.')
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export async function updateSiteSetting(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = str(formData, 'id')
  const key = str(formData, 'key')
  const value = str(formData, 'value')?.trim()
  if (!id || !key || value === undefined) return err('Missing setting.')
  try {
    await prisma.siteSetting.upsert({
      where: { id },
      update: { value },
      create: { id, key, value, group: 'general' },
    })
    await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'SiteSetting', resourceId: id, metadata: { key, value } })
    revalidatePath('/admin/settings')
    return ok('Settings saved.')
  } catch {
    return err('Could not save settings. Please try again.')
  }
}

// ---------------------------------------------------------------------------
// Leadership
// ---------------------------------------------------------------------------

const leaderSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.').max(200),
  slug: slugSchema,
  title: z.string().trim().min(2, 'Title is required.').max(200),
  photoUrl: z.string().trim().max(500).nullish(),
  biography: z.string().min(20, 'Biography is required.'),
  responsibilities: z.string().trim().max(1000).nullish(),
  linkedinUrl: z.string().trim().max(500).nullish(),
  twitterUrl: z.string().trim().max(500).nullish(),
  sortOrder: z.number().int().min(0).max(10000).nullish(),
  published: z.boolean(),
})

async function parseLeader(formData: FormData) {
  return leaderSchema.safeParse({
    name: str(formData, 'name'),
    slug: str(formData, 'slug') || slugify(str(formData, 'name')),
    title: str(formData, 'title'),
    photoUrl: optStr(formData, 'photoUrl') ?? undefined,
    biography: str(formData, 'biography'),
    responsibilities: optStr(formData, 'responsibilities') ?? undefined,
    linkedinUrl: optStr(formData, 'linkedinUrl') ?? undefined,
    twitterUrl: optStr(formData, 'twitterUrl') ?? undefined,
    sortOrder: optNum(formData, 'sortOrder') ?? undefined,
    published: isChecked(formData, 'published') || !str(formData, 'published'),
  })
}

export async function createLeader(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const parsed = await parseLeader(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const last = await prisma.leadershipProfile.findFirst({ orderBy: { sortOrder: 'desc' } })
  try {
    const leader = await prisma.leadershipProfile.create({
      data: {
        name: data.name,
        slug: data.slug,
        title: data.title,
        photoUrl: data.photoUrl ?? null,
        biography: data.biography,
        responsibilities: data.responsibilities ?? null,
        linkedinUrl: data.linkedinUrl ?? null,
        twitterUrl: data.twitterUrl ?? null,
        sortOrder: data.sortOrder ?? (last?.sortOrder ?? 0) + 1,
        published: data.published,
      },
    })
    await logAudit({ userId: session.userId, action: 'CREATE', resource: 'LeadershipProfile', resourceId: leader.id, metadata: { slug: leader.slug } })
    revalidatePath('/admin/leadership')
    return ok('Leader added.')
  } catch (e) {
    return uniqueError(e, 'leader profile')
  }
}

export async function updateLeader(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = str(formData, 'id')
  if (!id) return err('Missing leader id.')
  const parsed = await parseLeader(formData)
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? 'Invalid form data.')
  const data = parsed.data

  const existing = await prisma.leadershipProfile.findUnique({ where: { id } })
  if (!existing) return err('Leader profile not found.')

  try {
    const leader = await prisma.leadershipProfile.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        title: data.title,
        photoUrl: data.photoUrl ?? null,
        biography: data.biography,
        responsibilities: data.responsibilities ?? null,
        linkedinUrl: data.linkedinUrl ?? null,
        twitterUrl: data.twitterUrl ?? null,
        sortOrder: data.sortOrder ?? existing.sortOrder,
        published: data.published,
      },
    })
    await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'LeadershipProfile', resourceId: leader.id, metadata: { slug: leader.slug } })
    revalidatePath('/admin/leadership')
    return ok('Leader updated.')
  } catch (e) {
    return uniqueError(e, 'leader profile')
  }
}

export async function deleteLeader(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const existing = await prisma.leadershipProfile.findUnique({ where: { id } })
  if (!existing) return err('Leader profile not found.')
  await prisma.leadershipProfile.delete({ where: { id } })
  await logAudit({ userId: session.userId, action: 'DELETE', resource: 'LeadershipProfile', resourceId: id, metadata: { slug: existing.slug } })
  revalidatePath('/admin/leadership')
  return ok('Leader deleted.')
}

// ---------------------------------------------------------------------------
// Media library
// ---------------------------------------------------------------------------

export async function uploadMedia(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return err('Please choose a file to upload.')
  }
  const name = str(formData, 'name').trim() || file.name
  const altText = optStr(formData, 'altText')

  try {
    const saved = await saveUpload(file)
    const asset = await prisma.mediaAsset.create({
      data: {
        name,
        url: saved.url,
        type: saved.type,
        mimeType: file.type || null,
        sizeKb: saved.sizeKb,
        altText,
      },
    })
    await logAudit({ userId: session.userId, action: 'CREATE', resource: 'MediaAsset', resourceId: asset.id, metadata: { url: asset.url } })
    revalidatePath('/admin/media')
    return ok(`Uploaded "${name}".`)
  } catch {
    return err('The file could not be uploaded. Please try again.')
  }
}

export async function deleteMediaAsset(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const existing = await prisma.mediaAsset.findUnique({ where: { id } })
  if (!existing) return err('Asset not found.')
  await prisma.mediaAsset.delete({ where: { id } })
  await logAudit({ userId: session.userId, action: 'DELETE', resource: 'MediaAsset', resourceId: id, metadata: { url: existing.url } })
  revalidatePath('/admin/media')
  return ok('Asset deleted.')
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------

export async function markMessageRead(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const existing = await prisma.contactMessage.findUnique({ where: { id } })
  if (!existing) return err('Message not found.')
  await prisma.contactMessage.update({ where: { id }, data: { isRead: true } })
  await logAudit({ userId: session.userId, action: 'UPDATE', resource: 'ContactMessage', resourceId: id, metadata: { isRead: true } })
  revalidatePath('/admin/messages')
  return ok('Message marked as read.')
}

export async function deleteMessage(id: string, _formData?: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const existing = await prisma.contactMessage.findUnique({ where: { id } })
  if (!existing) return err('Message not found.')
  await prisma.contactMessage.delete({ where: { id } })
  await logAudit({ userId: session.userId, action: 'DELETE', resource: 'ContactMessage', resourceId: id, metadata: { subject: existing.subject } })
  revalidatePath('/admin/messages')
  return ok('Message deleted.')
}