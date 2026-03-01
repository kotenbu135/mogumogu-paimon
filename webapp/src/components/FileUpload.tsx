'use client'

import { useRef, useState } from 'react'
import type { GoodFile } from '@/lib/types'

interface FileUploadProps {
  onLoad: (data: GoodFile) => void
  /** compact モード: コントロールバー内で使う小型ボタン */
  compact?: boolean
}

export default function FileUpload({ onLoad, compact = false }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  function parseFile(file: File) {
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        if (json.format !== 'GOOD') {
          setError('GOODフォーマットのJSONを選択してください')
          return
        }
        onLoad(json as GoodFile)
      } catch {
        setError('JSONの解析に失敗しました')
      }
    }
    reader.readAsText(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
    // 同じファイルを再選択できるようリセット
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) parseFile(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept=".json"
      className="hidden"
      onChange={handleChange}
    />
  )

  // compact: コントロールバー用の小型ボタン
  if (compact) {
    return (
      <div>
        {input}
        <button
          className="ctrl-btn ctrl-reupload"
          onClick={() => inputRef.current?.click()}
        >
          📂 再読み込み
        </button>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    )
  }

  // 通常: ドラッグ&ドロップゾーン
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[800px]">
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        {input}
        <div className="upload-icon">📂</div>
        <p className="upload-title">GOODファイルをドロップ</p>
        <p className="upload-sub">またはクリックしてJSONを選択</p>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
