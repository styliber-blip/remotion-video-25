import { Composition } from 'remotion'
import { MyVideo } from './MyVideo'
import './App.css'

export default function App() {
  return (
    <div className="studio">
      <header>
        <h1>Remotion Cloud Studio</h1>
        <p>موشن غرافيك وسحابة — بدون استخدام موارد جهازك</p>
      </header>

      <main>
        <Composition
          id="MyVideo"
          component={MyVideo}
          durationInFrames={60}
          fps={30}
          width={1280}
          height={720}
        />
      </main>

      <footer>
        <p>تم العرض عبر سحابة Vercel + GitHub Actions</p>
      </footer>
    </div>
  )
}
