import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'

export type AnimationStyle = 'spin' | 'slide' | 'zoom' | 'fade'

export type MyVideoProps = {
  title: string
  subtitle: string
  bg1: string
  bg2: string
  accent: string
  style: AnimationStyle
}

export const MyVideo = ({
  title,
  subtitle,
  bg1,
  bg2,
  accent,
  style,
}: MyVideoProps) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const progress = frame / durationInFrames

  const opacity = interpolate(frame, [0, durationInFrames], [0, 1])
  const rotate = interpolate(frame, [0, durationInFrames], [0, 360])
  const slide = interpolate(frame, [0, durationInFrames], [-300, 0])
  const zoom = interpolate(frame, [0, durationInFrames], [0.2, 1])

  const transform =
    style === 'spin'
      ? `rotate(${rotate}deg)`
      : style === 'slide'
        ? `translateX(${slide}px)`
        : style === 'zoom'
          ? `scale(${zoom})`
          : 'none'

  const boxOpacity = style === 'fade' ? opacity : 1

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${bg1}, ${bg2})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        fontFamily: 'system-ui, sans-serif',
        color: '#fff',
      }}
    >
      <div
        style={{
          width: 220,
          height: 220,
          background: accent,
          borderRadius: 24,
          opacity: boxOpacity,
          transform,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 700,
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        ✦
      </div>
      <h1 style={{ fontSize: 56, margin: 0, opacity, textAlign: 'center' }}>
        {title}
      </h1>
      <p style={{ fontSize: 24, margin: 0, opacity, color: '#e2e8f0' }}>
        {subtitle}
      </p>
      <div
        style={{
          width: 300,
          height: 6,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.25)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: accent,
          }}
        />
      </div>
    </div>
  )
}