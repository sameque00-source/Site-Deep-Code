import { describe, expect, it } from 'vitest'
import { AdaptiveQuality } from './performance'

function feed(controller: AdaptiveQuality, frameMs: number, seconds: number) {
  const changes: string[] = []
  for (let i = 0; i < Math.ceil(seconds * 1000 / frameMs); i++) {
    const next = controller.sample(frameMs, frameMs / 1000)
    if (next) changes.push(next)
  }
  return changes
}

describe('adaptive callback cadence policy', () => {
  it('keeps stable 60Hz cadence instead of treating it as failed 90Hz hardware', () => {
    const controller = new AdaptiveQuality('HIGH')
    expect(feed(controller, 1000 / 60, 20)).toEqual([])
    expect(controller.tier).toBe('HIGH')
  })
  it('requires sustained slow windows and does not react to one isolated spike', () => {
    const controller = new AdaptiveQuality('HIGH')
    feed(controller, 1000 / 60, 1)
    controller.sample(120, .12)
    expect(feed(controller, 1000 / 60, 4)).toEqual([])
    expect(feed(controller, 40, 4.1)).toContain('BALANCED')
  })
  it('forgets partial observations on resume and upgrades only after prolonged headroom', () => {
    const controller = new AdaptiveQuality('BALANCED')
    feed(controller, 40, 2.1)
    controller.reset()
    expect(feed(controller, 40, 2.1)).toEqual([])
    controller.reset()
    expect(feed(controller, 8, 10)).toEqual([])
    expect(feed(controller, 8, 2.2)).toEqual(['HIGH'])
  })
})
