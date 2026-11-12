export type QualityTier = 'ULTRA' | 'HIGH' | 'BALANCED' | 'LOW' | 'FALLBACK'
export type QualityChoice = QualityTier | 'auto'

export const QUALITY_SETTINGS = {
  ULTRA: { dpr: 1.8, particles: 960 },
  HIGH: { dpr: 1.5, particles: 600 },
  BALANCED: { dpr: 1.15, particles: 300 },
  LOW: { dpr: 1, particles: 100 },
  FALLBACK: { dpr: 1, particles: 0 },
} as const

/** A callback cadence policy, not a GPU benchmark or a display refresh detector. */
export class AdaptiveQuality {
  tier: Exclude<QualityTier, 'FALLBACK'>
  private elapsed = 0
  private intervals: number[] = []
  private slowWindows = 0
  private fastWindows = 0
  constructor(initial: Exclude<QualityTier, 'FALLBACK'>) { this.tier = initial }
  sample(frameMs: number, dt: number): QualityTier | null {
    this.elapsed += dt
    this.intervals.push(frameMs)
    if (this.elapsed < 2 || this.intervals.length < 20) return null
    const sorted = this.intervals.sort((a, b) => a - b)
    const p90 = sorted[Math.floor((sorted.length - 1) * .9)]
    this.elapsed = 0
    this.intervals = []
    this.slowWindows = p90 > 28 ? this.slowWindows + 1 : 0
    this.fastWindows = p90 < 11 ? this.fastWindows + 1 : 0
    const tiers: Exclude<QualityTier, 'FALLBACK'>[] = ['LOW', 'BALANCED', 'HIGH', 'ULTRA']
    const index = tiers.indexOf(this.tier)
    if (this.slowWindows >= 2 && index > 0) {
      this.slowWindows = this.fastWindows = 0
      this.tier = tiers[index - 1]
      return this.tier
    }
    if (this.fastWindows >= 6 && index < tiers.length - 1) {
      this.slowWindows = this.fastWindows = 0
      this.tier = tiers[index + 1]
      return this.tier
    }
    return null
  }
  reset() { this.elapsed = 0; this.intervals = []; this.slowWindows = this.fastWindows = 0 }
}
