import { Composition } from 'remotion'
import { MyVideo } from './MyVideo'

export const Root = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={150}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        imageUrl: '',
        motion: 'kenburns',
        intensity: 1,
      }}
    />
  )
}