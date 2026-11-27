import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'

export type MotionType =
  | 'kenburns'
  | 'pan'
  | 'zoom'
  | 'rotate'
  | 'shake'
  | 'slide'

export type MotionConfig = {
  imageUrl: string
  motion: MotionType
  intensity: number
}

export const MyVideo = ({ imageUrl, motion, intensity }: MotionConfig) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const t = frame / durationInFrames
  const k = Math.max(0.1, Math.min(2, intensity))

  let transform = 'none'

  if (motion === 'kenburns') {
    const scale = interpolate(t, [0, 1], [1, 1 + 0.18 * k])
    const x = interpolate(t, [0, 1], [-2 * k, 2 * k])
    transform = `scale(${scale}) translateX(${x}%)`
  } else if (motion === 'pan') {
    const x = interpolate(t, [0, 1], [-6 * k, 6 * k])
    transform = `scale(1.1) translateX(${x}%)`
  } else if (motion === 'zoom') {
    const scale = interpolate(t, [0, 1], [1, 1 + 0.25 * k])
    transform = `scale(${scale})`
  } else if (motion === 'rotate') {
    const r = interpolate(t, [0, 1], [-3 * k, 3 * k])
    transform = `scale(1.1) rotate(${r}deg)`
  } else if (motion === 'shake') {
    const r = Math.sin(frame / 2) * 1.2 * k
    const x = Math.cos(frame / 3) * 1.2 * k
    transform = `scale(1.08) translate(${x}%, ${r}%)`
  } else if (motion === 'slide') {
    const x = interpolate(t, [0, 1], [-100, 0])
    transform = `translateX(${x}%)`
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform,
            transformOrigin: 'center',
          }}
        />
      ) : (
        <div style={{ color: '#64748b', fontSize: 24 }}>
          ارفع صورة أو اكتب وصفاً للشخصية
        </div>
      )}
    </div>
  )
}