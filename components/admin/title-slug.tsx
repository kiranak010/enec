'use client'

import { useState } from 'react'
import { slugify } from '@/lib/utils'
import { inputClass, labelClass } from './ui'

export function TitleSlugInputs({
  titleLabel = 'Title',
  slugLabel = 'Slug',
  initialTitle = '',
  initialSlug = '',
  titleName = 'title',
  slugName = 'slug',
}: {
  titleLabel?: string
  slugLabel?: string
  initialTitle?: string
  initialSlug?: string
  titleName?: string
  slugName?: string
}) {
  const [title, setTitle] = useState(initialTitle)
  const [slug, setSlug] = useState(initialSlug)
  const [slugTouched, setSlugTouched] = useState(Boolean(initialSlug))

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor={`${titleName}-field`} className={labelClass}>
          {titleLabel} <span className="text-red-600">*</span>
        </label>
        <input
          id={`${titleName}-field`}
          name={titleName}
          type="text"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (!slugTouched) setSlug(slugify(e.target.value))
          }}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${slugName}-field`} className={labelClass}>
          {slugLabel} <span className="text-red-600">*</span>
        </label>
        <input
          id={`${slugName}-field`}
          name={slugName}
          type="text"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugTouched(true)
          }}
          className={inputClass}
        />
      </div>
    </div>
  )
}