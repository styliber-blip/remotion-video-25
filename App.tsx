import { useState } from 'react'
import { Player } from '@remotion/player'
import { MyVideo, type AnimationStyle, type MyVideoProps } from './MyVideo'
import './App.css'

const defaultProps: MyVideoProps = {
  title: 'مرحبا بكم',
  subtitle: 'موشن غرافيك من السحابة',
  bg1: '#0f172a',
  bg2: '#1e293b',
  accent: '#38bdf8',
  style: 'spin',
}

export default function App() {
  const [props, setProps] = useState<MyVideoProps>(defaultProps)

  const update = <K extends keyof MyVideoProps>(
    key: K,
    value: MyVideoProps[K],
  ) => setProps((p) => ({ ...p, [key]: value }))

  return (
    <div className="studio">
      <header>
        <h1>Remotion Cloud Studio</h1>
        <p>تحكم بالموشن غرافيك مباشرة — التصدير يتم على السحابة</p>
      </header>

      <main>
        <section className="preview">
          <Player
            component={MyVideo}
            inputProps={props}
            durationInFrames={120}
            fps={30}
            compositionWidth={1280}
            compositionHeight={720}
            style={{ width: '100%' }}
            controls
            loop
          />
        </section>

        <aside className="panel">
          <label>
            العنوان
            <input
              value={props.title}
              onChange={(e) => update('title', e.target.value)}
            />
          </label>

          <label>
            النص الفرعي
            <input
              value={props.subtitle}
              onChange={(e) => update('subtitle', e.target.value)}
            />
          </label>

          <label>
            نمط الحركة
            <select
              value={props.style}
              onChange={(e) =>
                update('style', e.target.value as AnimationStyle)
              }
            >
              <option value="spin">دوران</option>
              <option value="slide">انزلاق</option>
              <option value="zoom">تكبير</option>
              <option value="fade">ظهور تدريجي</option>
            </select>
          </label>

          <label>
            لون الخلفية الأول
            <input
              type="color"
              value={props.bg1}
              onChange={(e) => update('bg1', e.target.value)}
            />
          </label>

          <label>
            لون الخلفية الثاني
            <input
              type="color"
              value={props.bg2}
              onChange={(e) => update('bg2', e.target.value)}
            />
          </label>

          <label>
            لون العنصر
            <input
              type="color"
              value={props.accent}
              onChange={(e) => update('accent', e.target.value)}
            />
          </label>
        </aside>
      </main>

      <footer>
        <p>المعاينة مباشرة في المتصفح — الإنتاج النهائي على GitHub Actions</p>
      </footer>
    </div>
  )
}
