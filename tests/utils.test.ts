import { describe, it, expect } from 'vitest'
import { cn, slugify, formatDate, truncate, formatNumber, readingTime } from '@/lib/utils'

describe('cn', () => {
  it('merges class strings', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 0, 'b')).toBe('a b')
  })

  it('handles arrays', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c')
  })
})

describe('slugify', () => {
  it('lowercases and dashes', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('strips special characters', () => {
    expect(slugify('Nuclear Energy & Power!')).toBe('nuclear-energy-power')
  })

  it('collapses multiple spaces/underscores', () => {
    expect(slugify('a   b_c')).toBe('a-b-c')
  })

  it('trims leading/trailing dashes', () => {
    expect(slugify('-foo-')).toBe('foo')
  })
})

describe('formatNumber', () => {
  it('formats large numbers with separators', () => {
    expect(formatNumber(12000)).toBe('12,000')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const out = formatDate('2024-01-15')
    expect(out).toMatch(/January/)
    expect(out).toMatch(/2024/)
  })
})

describe('truncate', () => {
  it('truncates long text with ellipsis', () => {
    const out = truncate('abcdefghij', 5)
    expect(out).toBe('abcde…')
  })

  it('returns short text unchanged', () => {
    expect(truncate('abc', 5)).toBe('abc')
  })
})

describe('readingTime', () => {
  it('estimates minutes from rich text', () => {
    const words = Array.from({ length: 400 }, () => 'word').join(' ')
    const out = readingTime(`<p>${words}</p>`)
    expect(out).toBe(2)
  })

  it('returns at least 1 minute', () => {
    expect(readingTime('<p>hello</p>')).toBe(1)
  })
})