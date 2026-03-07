import { describe, expect, it } from 'vitest'
import { validateGoodFile } from '../validateGoodFile'

const validArtifact = {
  setKey: 'Thundersoother',
  slotKey: 'goblet',
  level: 20,
  rarity: 5,
  mainStatKey: 'def_',
  location: 'Xilonen',
  lock: true,
  substats: [
    { key: 'atk', value: 18.0, initialValue: 18.0 },
    { key: 'critRate_', value: 3.1, initialValue: 3.1 },
  ],
  totalRolls: 8,
}

const validGoodFile = {
  format: 'GOOD',
  version: 3,
  source: 'Irminsul',
  artifacts: [validArtifact],
}

describe('validateGoodFile', () => {
  describe('正常系', () => {
    it('有効な GOOD ファイルを受け入れる', () => {
      expect(validateGoodFile(validGoodFile)).toBe(true)
    })

    it('artifacts が空配列でも受け入れる', () => {
      expect(validateGoodFile({ format: 'GOOD', artifacts: [] })).toBe(true)
    })

    it('artifacts フィールドがなくても受け入れる', () => {
      expect(validateGoodFile({ format: 'GOOD', version: 1 })).toBe(true)
    })

    it('initialValue がないサブステータスも受け入れる', () => {
      const artifact = {
        ...validArtifact,
        substats: [{ key: 'atk', value: 18.0 }],
      }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(true)
    })

    it('substats が空配列の聖遺物も受け入れる', () => {
      const artifact = { ...validArtifact, substats: [] }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(true)
    })
  })

  describe('format チェック', () => {
    it('null を拒否する', () => {
      expect(validateGoodFile(null)).toBe(false)
    })

    it('配列を拒否する', () => {
      expect(validateGoodFile([])).toBe(false)
    })

    it('文字列を拒否する', () => {
      expect(validateGoodFile('GOOD')).toBe(false)
    })

    it('format が GOOD でない場合を拒否する', () => {
      expect(validateGoodFile({ format: 'NOTGOOD' })).toBe(false)
    })

    it('format がない場合を拒否する', () => {
      expect(validateGoodFile({ version: 3 })).toBe(false)
    })
  })

  describe('artifacts チェック', () => {
    it('artifacts が配列でない場合を拒否する', () => {
      expect(validateGoodFile({ format: 'GOOD', artifacts: 'not-array' })).toBe(false)
    })

    it('artifacts がオブジェクトの場合を拒否する', () => {
      expect(validateGoodFile({ format: 'GOOD', artifacts: {} })).toBe(false)
    })
  })
})
