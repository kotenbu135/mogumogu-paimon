/**
 * decomposeRolls のユニットテスト
 * - サブステの総値を numRolls 個のティア値の和として分解する
 * - ティア値: 低/中/高/最高 の4段階
 * - 誤差 ±1 で再試行する機能あり
 */

import { describe, it, expect } from 'vitest'
import { decomposeRolls } from '@/lib/scoring'

describe('decomposeRolls', () => {
  describe('正常系: 会心率 (critRate_)', () => {
    it('numRolls=1 で最高ティア値 3.9 を分解できる', () => {
      const result = decomposeRolls('critRate_', 3.9, 1)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(1)
      expect(result![0]).toBeCloseTo(3.9, 5)
    })

    it('numRolls=1 で最低ティア値 2.7 を分解できる', () => {
      const result = decomposeRolls('critRate_', 2.7, 1)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(1)
      expect(result![0]).toBeCloseTo(2.7, 5)
    })

    it('numRolls=2 で 7.0 (3.1+3.9) を分解できる', () => {
      const result = decomposeRolls('critRate_', 7.0, 2)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(2)
      const sum = result!.reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(7.0, 5)
    })

    it('numRolls=3 で 11.7 (3.9×3) を分解できる', () => {
      const result = decomposeRolls('critRate_', 11.7, 3)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(3)
      const sum = result!.reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(11.7, 5)
    })
  })

  describe('正常系: 会心ダメージ (critDMG_)', () => {
    it('numRolls=1 で 7.8 を分解できる', () => {
      const result = decomposeRolls('critDMG_', 7.8, 1)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(1)
      expect(result![0]).toBeCloseTo(7.8, 5)
    })

    it('numRolls=2 で 14.0 (6.2+7.8) を分解できる', () => {
      const result = decomposeRolls('critDMG_', 14.0, 2)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(2)
      const sum = result!.reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(14.0, 5)
    })

    it('numRolls=3 で 19.4 (5.4+6.2+7.8) を分解できる', () => {
      const result = decomposeRolls('critDMG_', 19.4, 3)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(3)
      const sum = result!.reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(19.4, 5)
    })
  })

  describe('正常系: HP% (hp_)', () => {
    it('numRolls=1 で 5.8 を分解できる', () => {
      const result = decomposeRolls('hp_', 5.8, 1)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(1)
      expect(result![0]).toBeCloseTo(5.8, 5)
    })

    it('numRolls=2 で 10.6 (5.3+5.3) を分解できる', () => {
      const result = decomposeRolls('hp_', 10.6, 2)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(2)
      const sum = result!.reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(10.6, 5)
    })
  })

  describe('正常系: 攻撃力% (atk_)', () => {
    it('numRolls=1 で 4.1 を分解できる', () => {
      const result = decomposeRolls('atk_', 4.1, 1)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(1)
      expect(result![0]).toBeCloseTo(4.1, 5)
    })

    it('numRolls=2 で 8.8 (4.1+4.7) を分解できる', () => {
      const result = decomposeRolls('atk_', 8.8, 2)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(2)
      const sum = result!.reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(8.8, 5)
    })
  })

  describe('正常系: 元素熟知 (eleMas)', () => {
    it('numRolls=1 で 23 を分解できる', () => {
      const result = decomposeRolls('eleMas', 23, 1)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(1)
      expect(result![0]).toBe(23)
    })

    it('numRolls=2 で 35 (16+19) を分解できる', () => {
      const result = decomposeRolls('eleMas', 35, 2)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(2)
      expect(result!.reduce((a, b) => a + b, 0)).toBe(35)
    })
  })

  describe('正常系: 元素チャージ効率 (enerRech_)', () => {
    it('numRolls=1 で 6.5 を分解できる', () => {
      const result = decomposeRolls('enerRech_', 6.5, 1)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(1)
      expect(result![0]).toBeCloseTo(6.5, 5)
    })

    it('numRolls=2 で 11.7 (5.2+6.5) を分解できる', () => {
      const result = decomposeRolls('enerRech_', 11.7, 2)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(2)
      const sum = result!.reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(11.7, 5)
    })
  })

  describe('正常系: HP (hp)', () => {
    it('numRolls=1 で 299 を分解できる', () => {
      const result = decomposeRolls('hp', 299, 1)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(1)
      expect(result![0]).toBe(299)
    })

    it('numRolls=2 で 448 (209+239) を分解できる', () => {
      const result = decomposeRolls('hp', 448, 2)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(2)
      expect(result!.reduce((a, b) => a + b, 0)).toBe(448)
    })
  })

  describe('正常系: 誤差 ±1 による再試行', () => {
    it('hp で ±1 誤差のある値 507 (正確値は 208+299=507 なし → 209+299=508) を分解できる', () => {
      // 508 = 209 + 299 は有効だが入力は 507 (差 -1)
      const result = decomposeRolls('hp', 507, 2)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(2)
    })

    it('hp で ±1 誤差のある値 509 (正確値は 209+299=508 → +1) を分解できる', () => {
      // 508 = 209 + 299 は有効だが入力は 509 (差 +1)
      const result = decomposeRolls('hp', 509, 2)
      expect(result).not.toBeNull()
      expect(result).toHaveLength(2)
    })
  })

  describe('異常系: 分解不可能な値', () => {
    it('会心率で分解不可能な値は null を返す', () => {
      // critRate_ の最小ティアは 2.7、numRolls=1 で 1.0 は分解不可
      expect(decomposeRolls('critRate_', 1.0, 1)).toBeNull()
    })

    it('critRate_ で numRolls=1 かつ最大ティア超過値は null を返す', () => {
      // 最高ティアは 3.9、それを超える値は分解不可
      expect(decomposeRolls('critRate_', 100.0, 1)).toBeNull()
    })

    it('eleMas で numRolls=2 かつ到達不可能な値は null を返す', () => {
      // eleMas ティア [16,19,21,23]、2ロールの最大は 23+23=46、最小は 16+16=32
      // 50 は範囲外
      expect(decomposeRolls('eleMas', 50, 2)).toBeNull()
    })

    it('enerRech_ で ±1 でも分解不可能な値は null を返す', () => {
      // enerRech_ ティア [4.5,5.2,5.8,6.5]、1ロール最大 6.5。20.0 は ±1 でも不可
      expect(decomposeRolls('enerRech_', 20.0, 1)).toBeNull()
    })
  })

  describe('異常系: numRolls <= 0', () => {
    it('numRolls=0 は null を返す', () => {
      expect(decomposeRolls('critRate_', 3.9, 0)).toBeNull()
    })

    it('numRolls=-1 は null を返す', () => {
      expect(decomposeRolls('critRate_', 3.9, -1)).toBeNull()
    })

    it('numRolls=-100 は null を返す', () => {
      expect(decomposeRolls('eleMas', 23, -100)).toBeNull()
    })
  })

  describe('異常系: 未知のキー', () => {
    it('存在しないキーは null を返す', () => {
      // StatKey 型キャストで未知キーをテスト
      expect(decomposeRolls('unknown' as Parameters<typeof decomposeRolls>[0], 3.9, 1)).toBeNull()
    })
  })
})
