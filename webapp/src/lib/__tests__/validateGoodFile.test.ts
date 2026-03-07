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

    it('artifacts に null が含まれる場合を拒否する', () => {
      expect(validateGoodFile({ format: 'GOOD', artifacts: [null] })).toBe(false)
    })
  })

  describe('substats チェック', () => {
    it('substats が配列でない場合を拒否する', () => {
      const artifact = { ...validArtifact, substats: 'bad' }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })

    it('substat.value が NaN の場合を拒否する', () => {
      const artifact = {
        ...validArtifact,
        substats: [{ key: 'atk', value: NaN }],
      }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })

    it('substat.value が Infinity の場合を拒否する', () => {
      const artifact = {
        ...validArtifact,
        substats: [{ key: 'atk', value: Infinity }],
      }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })

    it('substat.value が負値の場合を拒否する', () => {
      const artifact = {
        ...validArtifact,
        substats: [{ key: 'atk', value: -1 }],
      }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })

    it('substat.initialValue が NaN の場合を拒否する', () => {
      const artifact = {
        ...validArtifact,
        substats: [{ key: 'atk', value: 18.0, initialValue: NaN }],
      }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })

    it('substat.initialValue が負値の場合を拒否する', () => {
      const artifact = {
        ...validArtifact,
        substats: [{ key: 'atk', value: 18.0, initialValue: -5 }],
      }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })
  })

  describe('totalRolls チェック（DoS 対策）', () => {
    it('totalRolls が 0-12 の範囲外（巨大数）の場合を拒否する', () => {
      const artifact = { ...validArtifact, totalRolls: 999999 }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })

    it('totalRolls が負値の場合を拒否する', () => {
      const artifact = { ...validArtifact, totalRolls: -1 }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })

    it('totalRolls が Infinity の場合を拒否する', () => {
      const artifact = { ...validArtifact, totalRolls: Infinity }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })

    it('totalRolls が小数の場合を拒否する', () => {
      const artifact = { ...validArtifact, totalRolls: 3.5 }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })

    it('totalRolls が 12 の場合は受け入れる', () => {
      const artifact = { ...validArtifact, totalRolls: 12 }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(true)
    })

    it('totalRolls が 13 の場合を拒否する（上限 12 を超えている）', () => {
      const artifact = { ...validArtifact, totalRolls: 13 }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(false)
    })

    it('totalRolls が 0 の場合は受け入れる', () => {
      const artifact = { ...validArtifact, totalRolls: 0 }
      expect(validateGoodFile({ format: 'GOOD', artifacts: [artifact] })).toBe(true)
    })
  })
})
