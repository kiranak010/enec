'use client'

import { useState, useTransition } from 'react'
import { ChevronDown, Mail, MailOpen, Trash2, Loader2 } from 'lucide-react'
import { markMessageRead, deleteMessage } from '@/app/admin/actions'
import { formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/admin/ui'

export interface MessageRow {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  department: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function MessageItem({ message }: { message: MessageRow }) {
  const [expanded, setExpanded] = useState(false)
  const [pendingMark, startMark] = useTransition()
  const [isRead, setIsRead] = useState(message.isRead)

  return (
    <div className={`border-b border-slate-100 last:border-0 ${!isRead ? 'bg-cyan-50/40' : ''}`}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
      >
        <span className="relative flex-shrink-0">
          <Mail className={`h-5 w-5 ${!isRead ? 'text-cyan-500' : 'text-slate-300'}`} />
          {pendingMark ? <Loader2 className="absolute -right-1 -top-1 h-3 w-3 animate-spin text-cyan-500" /> : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-semibold text-navy-900">{message.name}</span>
            {!isRead ? <StatusBadge label="New" tone="green" /> : <StatusBadge label="Read" tone="slate" />}
          </span>
          <span className="mt-0.5 block truncate text-sm text-slate-500">
            {message.subject} — {formatDate(message.createdAt)}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded ? (
        <div className="px-5 pb-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <span>
                <span className="font-semibold text-navy-900">Email:</span>{' '}
                <a href={`mailto:${message.email}`} className="text-cyan-600 hover:underline">
                  {message.email}
                </a>
              </span>
              <span>
                <span className="font-semibold text-navy-900">Department:</span> {message.department}
              </span>
              {message.phone ? (
                <span>
                  <span className="font-semibold text-navy-900">Phone:</span> {message.phone}
                </span>
              ) : null}
              {message.company ? (
                <span>
                  <span className="font-semibold text-navy-900">Company:</span> {message.company}
                </span>
              ) : null}
            </div>
            <p className="mt-4 text-sm font-semibold text-navy-900">{message.subject}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {message.message}
            </p>
            <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
              {!isRead ? (
                <button
                  type="button"
                  disabled={pendingMark}
                  onClick={() => {
                    startMark(() => {
                      void markMessageRead(message.id)
                    })
                    setIsRead(true)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition-colors hover:bg-cyan-100 disabled:opacity-50"
                >
                  <MailOpen className="h-3.5 w-3.5" />
                  Mark as read
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete the message from ${message.name}?`)) {
                    void deleteMessage(message.id)
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}