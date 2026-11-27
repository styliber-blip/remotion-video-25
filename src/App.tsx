import { useRef, useState } from 'react'
import { Player } from '@remotion/player'
import { MyVideo, type MotionConfig, type MotionType } from './MyVideo'
import './App.css'

type Msg = { role: 'user' | 'bot'; text: string }

const defaultConfig: MotionConfig = {
  imageUrl: '',
  motion: 'kenburns',
  intensity: 1,
}

const buildImage = (prompt: string) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt,
  )}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 9999)}`

const askAI = async (text: string): Promise<string> => {
  const system =
    'You convert a user motion-graphic request into JSON only. ' +
    'Return strictly JSON with keys: imagePrompt (string, detailed english prompt for a character/scene), ' +
    'motion (one of kenburns,pan,zoom,rotate,shake,slide), intensity (number 0.2-2), durationSeconds (number 3-10). ' +
    'No markdown, no extra text.'
  const prompt = `${system}\nUser request: ${text}`
  const res = await fetch(
    `https://text.pollinations.ai/${encodeURIComponent(prompt)}`,
  )
  return (await res.text()).trim()
}

export default function App() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: 'صف لي الموشن الذي تريده، أو تحدث عبر الميكروفون.' },
  ])
  const [config, setConfig] = useState<MotionConfig>(defaultConfig)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [listening, setListening] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const durationInFrames = Math.round(
    (config as MotionConfig & { durationSeconds?: number }).durationSeconds
      ? ((config as MotionConfig & { durationSeconds?: number })
          .durationSeconds as number) * 30
      : 150,
  )

  const send = async (raw: string) => {
    const text = raw.trim()
    if (!text || busy) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setBusy(true)
    try {
      const answer = await askAI(text)
      let parsed: Record<string, unknown> = {}
      try {
        parsed = JSON.parse(
          answer.replace(/```json/gi, '').replace(/```/g, '').trim(),
        )
      } catch {
        parsed = {}
      }
      const imagePrompt =
        typeof parsed.imagePrompt === 'string' && parsed.imagePrompt
          ? parsed.imagePrompt
          : text
      const motion = (
        ['kenburns', 'pan', 'zoom', 'rotate', 'shake', 'slide'].includes(
          String(parsed.motion),
        )
          ? parsed.motion
          : 'kenburns'
      ) as MotionType
      const intensity =
        typeof parsed.intensity === 'number' ? parsed.intensity : 1
      const durationSeconds =
        typeof parsed.durationSeconds === 'number' ? parsed.durationSeconds : 5

      setConfig({
        imageUrl: buildImage(imagePrompt),
        motion,
        intensity,
        durationSeconds,
      } as MotionConfig)
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: `تم: حركة ${motion} لمدة ${durationSeconds} ثانية.`,
        },
      ])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'تعذر الاتصال بالذكاء الاصطناعي، حاول مجدداً.' },
      ])
    } finally {
      setBusy(false)
    }
  }

  const onFile = (file?: File) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setConfig((c) => ({ ...c, imageUrl: url }))
  }

  const startVoice = () => {
    const SR =
      (window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionLike
        webkitSpeechRecognition?: new () => SpeechRecognitionLike
      }).SpeechRecognition ||
      (window as unknown as {
        webkitSpeechRecognition?: new () => SpeechRecognitionLike
      }).webkitSpeechRecognition
    if (!SR) {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'المتصفح لا يدعم الإدخال الصوتي، استخدم الكتابة.' },
      ])
      return
    }
    const rec = new SR()
    rec.lang = 'ar'
    rec.interimResults = false
    rec.onresult = (e) => send(e.results[0][0].transcript)
    rec.onend = () => setListening(false)
    setListening(true)
    rec.start()
  }

  return (
    <div className="studio">
      <header>
        <h1>AI Motion Studio</h1>
        <p>تحدث أو اكتب وصف الحركة، وارفع صورة — الذكاء الاصطناعي المجاني ينفّذ</p>
      </header>

      <main>
        <section className="preview">
          <Player
            component={MyVideo}
            inputProps={config}
            durationInFrames={durationInFrames}
            fps={30}
            compositionWidth={1280}
            compositionHeight={720}
            style={{ width: '100%' }}
            controls
            loop
          />
        </section>

        <aside className="panel">
          <div className="chat">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="row">
            <input
              value={input}
              placeholder="صف الحركة..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
            />
            <button onClick={() => send(input)} disabled={busy}>
              إرسال
            </button>
          </div>

          <div className="row">
            <button onClick={startVoice} disabled={listening}>
              {listening ? 'أستمع...' : '🎤 تحدث'}
            </button>
            <button onClick={() => fileRef.current?.click()}>
              🖼️ رفع صورة
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>
        </aside>
      </main>

      <footer>
        <p>مجاني بالكامل — Pollinations AI + معالجة على السحابة</p>
      </footer>
    </div>
  )
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  onresult: (e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void
  onend: () => void
  start: () => void
}