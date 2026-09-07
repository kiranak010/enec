export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-navy-900 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-slate-600 text-sm">Loading...</p>
      </div>
    </div>
  )
}