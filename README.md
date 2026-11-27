# موشن غرافيك على السحابة — بدون استخدام موارد جهازك

هذا المشروع يوفّر طريقة **مجانية بالكامل** لعرض وتصدير موشن غرافيك (فيديو متحرك) باستخدام **Remotion** على السحابة، دون تحميل جهازك الشخصي بأي معالجة أو رسم.

## كيف تعمل الطريقة (سحابية 100%)

| الجزء | الخدمة السحابية | التكلفة |
|------|---------------|--------|
| استديو الويب (العرض) | **Vercel** | مجاني |
| تصدير الفيديو (Render) | **GitHub Actions** (سحابة GitHub) | مجاني ضمن الحصة الشهرية |
| تخزين الفيديو الناتج | **GitHub Artifacts** | مجاني |

جهازك لا يُستخدم إلا لرفع الكود إلى GitHub فقط. كل المعالجة تحدث على سيرفرات GitHub وVercel.

---

## الخطوات

### 1. رفع المشروع إلى GitHub

```powershell
cd C:\remotion-video
git init
git add .
git commit -m "첫 번째 커밋: مشروع موشن غرافيك سحابي"
git branch -M main
git remote add origin https://github.com/مستخدمك/اسم-المستودع.git
git push -u origin main
```

### 2. تفعيل GitHub Actions للتصدير التلقائي

بعد الرفع، اذهب إلى مستودعك على GitHub → تبويب **Actions** → اختر workflow `Cloud Render Remotion Video` → اضغط **Run workflow**.

سيتم:
1. تشغيل سيرفر Ubuntu على سحابة GitHub
2. تثبيت Chromium + FFmpeg
3. تثبيت dependencias المشروع
4. تشغيل `remotion render` لتصدير الفيديو إلى `out.mp4`
5. رفع الفيديو كملف قابل للتنزيل (Artifact) في صفحة الـ workflow

يمكنك تنزيل الفيديو من صفحة الـ run بدون أي معالجة على جهازك.

### 3. نشر الاستديو على Vercel (مجاناً)

1. اذهب إلى [vercel.com](https://vercel.com) وسجل دخولك باستخدام حساب GitHub.
2. اضغط **Add New Project** → اختر المستودع `remotion-video`.
3. اضغط **Deploy**.

سيصبح لديك استديو ويب مباشر على رابط Vercel يعرض الموشن غرافيك في المتصفح بدون استخدام موارد جهازك.

---

## الملفات التي صممتها لك

| المسار | الغرض |
|-------|------|
| `src/Root.tsx` | نقطة الدخول لـ Remotion (يرسم الفيديو داخل `<RemotionRoot>`) |
| `src/MyVideo.tsx` | مكوّن الفيديو الحركي (مستطيل يدور ويظهر تدريجياً) |
| `src/main.tsx` | رسم تطبيق React في المتصفح |
| `.github/workflows/render.yml` | **GitHub Action** الذي يصدر الفيديو على سحابة GitHub تلقائياً |
| `vercel.json` | إعدادات نشر المشروع على Vercel مجاناً |
| `package.json` | حزم Remotion وسكربتات التشغيل |

---

## تخصيص الفيديو

عدّل `src/MyVideo.tsx` لتغيير الألوان، المدة، النصوص، أو إضافة رسوم متحركة أخرى. ثم ارفع التعديل إلى GitHub وسيقوم Git Action بإعادة تصدير الفيديو تلقائياً على السحابة.

---

## ملخص

- **لا تحمل معالج جهازك** — كل render على GitHub Actions.
- **لا تحمل Rams جهازك** — العرض على Vercel.
- **مجاني** ضمن حدود Vercel وGitHub Actions المجانية.
