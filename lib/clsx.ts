export type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function clsx(...args: ClassValue[]): string {
  const result: string[] = []
  for (const arg of args) {
    if (!arg) continue
    if (typeof arg === 'string' || typeof arg === 'number') {
      result.push(String(arg))
    } else if (Array.isArray(arg)) {
      const inner = clsx(...arg)
      if (inner) result.push(inner)
    }
  }
  return result.join(' ')
}