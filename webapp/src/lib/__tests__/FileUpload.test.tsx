// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import FileUpload from '@/components/FileUpload'
import { LanguageProvider } from '@/lib/i18n'

function renderFileUpload(onLoad = vi.fn()) {
  return render(
    <LanguageProvider>
      <FileUpload onLoad={onLoad} />
    </LanguageProvider>,
  )
}

function makeFile(name: string, size: number, content = '{}', type = 'application/json') {
  const file = new File([content], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

describe('FileUpload', () => {
  it('非JSONファイルをドロップした場合はフォーマットエラーを表示する', () => {
    renderFileUpload()
    const zone = document.querySelector('.upload-zone') as HTMLElement
    const badFile = makeFile('malware.exe', 1024, 'binary', 'application/octet-stream')
    fireEvent.drop(zone, { dataTransfer: { files: [badFile] } })
    expect(screen.getByText('GOODフォーマットのJSONを選択してください')).toBeTruthy()
  })

  it('非JSONファイルをドロップした場合はonLoadを呼ばない', () => {
    const onLoad = vi.fn()
    renderFileUpload(onLoad)
    const zone = document.querySelector('.upload-zone') as HTMLElement
    const badFile = makeFile('malware.exe', 1024, 'binary', 'application/octet-stream')
    fireEvent.drop(zone, { dataTransfer: { files: [badFile] } })
    expect(onLoad).not.toHaveBeenCalled()
  })

  it('拡張子が.jsonであればMIMEタイプがなくても受け付ける', () => {
    renderFileUpload()
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = makeFile('test.json', 1024, JSON.stringify({ format: 'GOOD', artifacts: [] }), '')
    fireEvent.change(input, { target: { files: [file] } })
    expect(screen.queryByText('GOODフォーマットのJSONを選択してください')).toBeNull()
  })

  it('ファイルサイズが10MB以下の場合はエラーなし', () => {
    renderFileUpload()
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = makeFile('test.json', 1024, JSON.stringify({ format: 'GOOD', artifacts: [] }))
    fireEvent.change(input, { target: { files: [file] } })
    expect(screen.queryByText(/ファイルサイズが大きすぎます/)).toBeNull()
  })

  it('ファイルサイズが10MBを超える場合はエラーメッセージを表示する', () => {
    renderFileUpload()
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const oversizedFile = makeFile('huge.json', 11 * 1024 * 1024)
    fireEvent.change(input, { target: { files: [oversizedFile] } })
    expect(screen.getByText('ファイルサイズが大きすぎます（上限: 10MB）')).toBeTruthy()
  })

  it('ファイルサイズが10MBを超える場合はonLoadを呼ばない', () => {
    const onLoad = vi.fn()
    renderFileUpload(onLoad)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const oversizedFile = makeFile('huge.json', 11 * 1024 * 1024)
    fireEvent.change(input, { target: { files: [oversizedFile] } })
    expect(onLoad).not.toHaveBeenCalled()
  })
})
