import { Composition } from 'remotion'
import { MyVideo } from './MyVideo'

export const Root = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={120}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        title: 'مرحبا بكم',
        subtitle: 'موشن غرافيك من السحابة',
        bg1: '#0f172a',
        bg2: '#1e293b',
        accent: '#38bdf8',
        style: 'spin',
      }}
    />
  )
}