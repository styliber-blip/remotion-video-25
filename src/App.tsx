import { useRef, useState } from 'react'
import { Client } from '@gradio/client'
import './App.css'

type Msg = { role: 'user' | 'bot'; text: string }

const SPACE = 'zerogpu-aoti/wan2-2-fp8da-aoti-faster'

const buildImage = (prompt: string) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt,
  )}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 9999)}`

export default function App() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'bot',
      text: 'صف الحركة أو تحدث عبر الميكروفون، ثم ارفع صورة (أو دعني أولّدها).',
    },
  ])
  const [videoUrl, setVideoUrl] = useState('')
  const [status, setStatus] = useState('')
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [listening, setListening] = useState(false)
  const [token, setToken] = useState(
    () => localStorage.getItem('hf_token') || '',
  )
  const fileRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<File | null>(null)

  const generate = async (raw: string) => {
    const text = raw.trim()
    if (!text || busy) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setBusy(true)
    setStatus('جارٍ التجهيز...')
    try {
      let imageUrl: string
      if (imageRef.current) {
        imageUrl = await new Promise<string>((resolve) => {
          const r = new FileReader()
          r.onload = () => resolve(String(r.result))
          r.readAsDataURL(imageRef.current as File)
        })
      } else {
        setStatus('جارٍ توليد الصورة...')
        imageUrl = buildImage(text)
      }

      setStatus('جارٍ الاتصال بالنموذج (قد يستغرق دقيقة)...')
      const client = await Client.connect(SPACE, {
        hf_token: token ? (token as `hf_${string}`) : undefined,
      })
      const result = await client.predict('/run/generate_video', {
        input_image: { url: imageUrl, meta: { _type: 'gradio.FileData' } },
        prompt: text,
        steps: 6,
        negative_prompt: '',
        duration_seconds: 4,
        guidance_scale: 1,
        guidance_scale_2: 1,
        seed: 42,
        randomize_seed: true,
      })

      const arr = result as unknown as Array<{ url?: string; path?: string }>
      const out = arr[0]
      const url = out?.url || out?.path || ''
      if (!url) throw new Error('no video url')
      setVideoUrl(url)
      setStatus('تم إنشاء الفيديو ✅')
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'تم توليد الفيديو، يمكنك تشغيله الآن.' },
      ])
    } catch (e) {
      setStatus('تعذّر التوليد — قد يكون النموذج مزدحماً أو الحصة اليومية انتهت.')
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: 'تعذّر التوليد. أضف مفتاح Hugging Face مجاني لرفع الحصة، أو حاول لاحقاً.',
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  const onFile = (file?: File) => {
    if (!file) return
    imageRef.current = file
    setMessages((m) => [
      ...m,
      { role: 'bot', text: 'تم رفع الصورة، صف الحركة الآن.' },
    ])
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
        { role: 'bot', text: 'المتصفح لا يدعم الصوت، استخدم الكتابة.' },
      ])
      return
    }
    const rec = new SR()
    rec.lang = 'ar'
    rec.interimResults = false
    rec.onresult = (e) => generate(e.results[0][0].transcript)
    rec.onend = () => setListening(false)
    setListening(true)
    rec.start()
  }

  return (
    <div className="studio">
      <header>
        <h1>AI Motion Studio</h1>
        <p>نموذج Wan 2.2 المجاني — صورة + وصف = فيديو متحرك</p>
      </header>

      <main>
        <section className="preview">
          {videoUrl ? (
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              autoPlay
              loop
              style={{ width: '100%' }}
            />
          ) : (
            <div className="placeholder">
              {status || 'ارفع صورة أو اكتب وصفاً للبدء'}
            </div>
          )}
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
              onKeyDown={(e) => e.key === 'Enter' && generate(input)}
            />
            <button onClick={() => generate(input)} disabled={busy}>
              {busy ? '...' : 'إنشاء'}
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

          <label className="token">
            مفتاح HF (اختياري لرفع الحصة)
            <input
              value={token}
              placeholder="hf_..."
              onChange={(e) => {
                setToken(e.target.value)
                localStorage.setItem('hf_token', e.target.value)
              }}
            />
          </label>

          {status && <p className="status">{status}</p>}
        </aside>
      </main>

      <footer>
        <p>مجاني — Hugging Face Wan 2.2 + Pollinations</p>
      </footer>
    </div>
  )
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  onresult: (e: {
    results: { [k: number]: { [k: number]: { transcript: string } } }
  }) => void
  onend: () => void
  start: () => void
}