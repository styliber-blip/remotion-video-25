import { interpolate, Sequence, useCurrentFrame } from 'remotion'

export const MyVideo = () => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 60], [0, 1])
  const rotate = interpolate(frame, [0, 60], [0, 360])

  return (
    <Sequence durationInFrames={60}>
      <style>
        {`
          body {
            margin: 0;
            background: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: system-ui, sans-serif;
          }
        `}
      </style>
      <div
        style={{
          width: 200,
          height: 200,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: 16,
          opacity,
          transform: `rotate(${rotate}deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 24,
        }}
      >
        Remotion
      </div>
    </Sequence>
  )
}
