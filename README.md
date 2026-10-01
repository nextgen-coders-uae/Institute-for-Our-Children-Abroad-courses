# كورسات أبناؤنا في الخارج | Abnauona Courses

منصة ثنائية اللغة (العربية RTL افتراضياً + الإنجليزية LTR) لعرض وحجز كورسات **معهد أبناؤنا في الخارج – عجمان**.
مبنية بـ **Next.js 15 (App Router) + Tailwind CSS 4 + next-intl**. كل المحتوى في ملفات JSON وكل النصوص في ملفات ترجمة، فيمكن التعديل دون لمس الكود.

---

## ١) خريطة الموقع

| الصفحة | الرابط (`/ar` أو `/en`) | ملاحظات |
|---|---|---|
| الرئيسية | `/` | Hero، بحث سريع، الفئات، الأكثر طلباً، الأحدث، العرض + عدّاد تنازلي، لماذا نحن، الأرقام، الآراء، المدربون، المدونة، CTA |
| جميع الكورسات | `/courses` | فلترة (الفئة، اللغة، المستوى، العمر، نوع الحضور، السعر، المدة) + ترتيب + بحث فوري. الفلاتر في الرابط: `?category=languages&age=kids` |
| تفاصيل الكورس | `/courses/[slug]` | وصف، ماذا ستتعلم، المحتوى (Accordion)، المجموعات والمقاعد، المدرب، الشهادة، التقييمات، FAQ، كورسات مشابهة، صندوق حجز ثابت |
| الباقات والعروض | `/packages` | الباقات المجمّعة، برامج الخصم، الكوبونات العامة |
| اختبار تحديد المستوى | `/placement-test` | ٢٠ سؤالاً (A1–C1) + ترشيح كورس + إرسال النتيجة عبر واتساب |
| المدربون | `/instructors` | بطاقات المدربين وكورسات كل مدرب (`/instructors#id`) |
| من نحن | `/about` | العلاقة بالمعهد، الرؤية، الرسالة، القيم، الاعتمادات |
| المدونة | `/blog` ، `/blog/[slug]` | مقالات SEO |
| التحقق من الشهادات | `/verify-certificate` | يدعم `?id=ABC-2026-0001` (مناسب لـ QR على الشهادة) |
| الأسئلة الشائعة | `/faq` | مع FAQPage Schema |
| تواصل معنا | `/contact` | نموذج + خريطة Google + أرقام قابلة للنقر |
| الصفحات القانونية | `/policies/privacy` ، `/policies/terms` ، `/policies/refund` | |
| سلة الحجز | `/cart` | الحجز عبر واتساب |
| صفحة الشكر | `/booking/success` | رقم الحجز + خطوات الدفع والبدء |
| المفضلة | `/wishlist` | |
| 404 | أي رابط غير موجود | تصميم فرعوني |
| SEO | `/sitemap.xml` ، `/robots.txt` ، صور Open Graph تلقائية لكل كورس | |

---

## ٢) هيكل المشروع

```
├─ messages/              ← نصوص الواجهة: ar.json و en.json
├─ public/
│  ├─ images/brand/       ← الشعار (logo-mark.svg)
│  ├─ images/courses/     ← صور الكورسات (اختياري)
│  ├─ images/instructors/ ← صور المدربين (اختياري)
│  └─ patterns/           ← زخارف: نقوش هيروغليفية، إفريز اللوتس
└─ src/
   ├─ data/               ← ★ كل المحتوى القابل للتعديل (JSON)
   │  ├─ site.json          إعدادات عامة: التواصل، واتساب، الخصومات، العملات، شريط الإعلان، العرض والعداد، الأرقام
   │  ├─ courses.json       الكورسات والمجموعات والأسعار
   │  ├─ categories.json    الفئات وأيقوناتها
   │  ├─ instructors.json   المدربون
   │  ├─ packages.json      الباقات المجمعة
   │  ├─ coupons.json       الكوبونات (تُتحقق على الخادم — الأكواد الخاصة لا تصل للمتصفح)
   │  ├─ testimonials.json  آراء المتدربين
   │  ├─ blog.json          المقالات
   │  ├─ faq.json           الأسئلة الشائعة
   │  ├─ certificates.json  الشهادات للتحقق
   │  ├─ placement-test.json أسئلة اختبار المستوى والترشيحات
   │  └─ legal.json         نصوص السياسات
   ├─ app/[locale]/       ← الصفحات (كل مجلد = رابط)
   ├─ app/api/            ← coupons/validate ، forms/[type] ، certificates
   ├─ components/         ← مكونات قابلة لإعادة الاستخدام (layout, home, course, cart, forms, ui, icons…)
   ├─ i18n/               ← إعداد اللغات والتوجيه
   └─ lib/
      ├─ data.ts           طبقة الوصول للبيانات (تُستبدل لاحقاً بـ CMS/قاعدة بيانات دون تغيير الصفحات)
      ├─ pricing.ts        محرك الأسعار والخصومات (يُعاد استخدامه على الخادم مع الدفع الإلكتروني)
      ├─ whatsapp.ts       صيغة رسالة الحجز + رقم الحجز
      ├─ payments/         واجهة بوابات الدفع (المرحلة الثانية)
      ├─ seo.ts            Meta + hreflang + Open Graph
      └─ types.ts          الأنواع (منها أنواع المرحلة الثانية: Student, Enrollment, Invoice)
```

---

## ٣) التشغيل

المتطلبات: **Node.js 20+** (تم الاختبار على 22).

```bash
npm install
npm run dev          # http://localhost:3000  (يحوّل تلقائياً إلى /ar)
npm run build        # بناء نسخة الإنتاج
npm start            # تشغيل نسخة الإنتاج
npm run typecheck    # فحص الأنواع
```

انسخ `.env.example` إلى `.env.local` واضبط:

| المتغير | الوظيفة |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | رابط الموقع النهائي (للـ canonical و sitemap و Open Graph) |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID` / `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | أكواد التتبع (تعمل تلقائياً عند إضافتها) |
| `FORMS_WEBHOOK_URL` | رابط Webhook يستقبل نماذج التواصل/النشرة/«أبلغني» (Google Apps Script أو Make أو Zapier). بدونه تُسجّل في سجل الخادم فقط |

### النشر
- **Vercel** (الأسهل): اربط المستودع ← أضف متغيرات البيئة ← Deploy.
- **Netlify**: يعمل مع Next.js تلقائياً (Netlify Next Runtime).
- **استضافة عادية / VPS**: أي خادم يدعم Node.js: `npm run build && npm start` (يفضّل مع PM2 وخلف Nginx).
  > الموقع يحتاج Node.js لأن التحقق من الكوبونات والشهادات والنماذج يتم عبر API. الصفحات نفسها مولّدة مسبقاً (SSG) وسريعة جداً.

---

## ٤) إدارة المحتوى

### إضافة كورس جديد
أضف عنصراً إلى `src/data/courses.json` (انسخ كورساً موجوداً وعدّله):

```jsonc
{
  "id": "c-spanish-a1",                 // معرّف فريد ثابت (لا تغيّره بعد النشر)
  "slug": "spanish-a1",                 // رابط الصفحة: /ar/courses/spanish-a1 (حروف لاتينية صغيرة وشرطات)
  "category": "languages",              // id من categories.json
  "language": "english",                // اختياري: english | french | german | arabic
  "title":    { "ar": "…", "en": "…" },
  "subtitle": { "ar": "…", "en": "…" },
  "description": { "ar": "…", "en": "…" },
  "image": "/images/courses/spanish.webp", // اختياري — بدونه يُولَّد غلاف فرعوني تلقائياً
  "youtubeId": "dQw4w9WgXcQ",           // اختياري — فيديو تعريفي
  "instructorId": "salma-fathy",        // id من instructors.json
  "level": "beginner",                  // beginner | intermediate | advanced | all-levels
  "cefr": "A1",
  "ageGroups": ["teens", "adults"],     // kids | teens | adults
  "prices": {                           // أنواع الحضور المتاحة = المفاتيح الموجودة هنا
    "in-person": { "price": 800, "oldPrice": 950 },
    "online":    { "price": 700 },
    "recorded":  { "price": 300 }
  },
  "durationWeeks": 10, "sessionsCount": 20, "sessionMinutes": 75,
  "outcomes": [ { "ar": "…", "en": "…" } ],
  "audience": [ … ], "requirements": [ … ],
  "curriculum": [ { "title": { "ar": "…", "en": "…" }, "lessons": [ { "ar": "…", "en": "…" } ] } ],
  "groups": [
    { "id": "g1", "mode": "in-person", "days": { "ar": "السبت والثلاثاء", "en": "Sat & Tue" },
      "time": "17:30 – 18:45", "startDate": "2026-11-01",
      "seatsTotal": 10, "seatsLeft": 6, "earlyBirdUntil": "2026-10-20" }
  ],
  "faq": [ { "q": {…}, "a": {…} } ],
  "reviews": [ { "name": "…", "rating": 5, "date": "2026-01-01", "text": {…} } ],
  "rating": 4.8, "studentsCount": 0,
  "badges": ["new"],                    // new | bestseller (يدوية)
  "certificate": true,
  "publishedAt": "2026-10-01",          // يُستخدم في ترتيب «الأحدث»
  "popularity": 70                      // يُستخدم في ترتيب «الأكثر طلباً»
}
```

الشارات التالية تُحسب **تلقائياً** من المجموعات: «المقاعد محدودة» (٣ مقاعد أو أقل)، «يبدأ قريباً» (خلال ١٤ يوماً)، «مكتمل» (كل المجموعات ممتلئة ← يظهر نموذج «أبلغني عند فتح مجموعة جديدة»). لتحديث المقاعد عدّل `seatsLeft`.

### إضافة مدرب
أضف عنصراً إلى `src/data/instructors.json` (`id`, `name`, `title`, `bio`, `specialties`, `certifications`, `languages`, `yearsExperience`, `featured` لإظهاره في الرئيسية، و`photo` اختياري مثل `/images/instructors/name.webp`). ثم اربطه بالكورس عبر `instructorId`.

### إضافة كوبون خصم
أضف إلى `src/data/coupons.json`:
```json
{ "code": "RAMADAN20", "type": "percent", "value": 20, "public": true,
  "minSubtotal": 500, "expiresAt": "2027-03-31", "categories": ["languages"],
  "description": { "ar": "خصم ٢٠٪ على كورسات اللغات", "en": "20% off language courses" } }
```
- `type`: `percent` (نسبة) أو `fixed` (مبلغ بالدرهم).
- `public: true` يُظهره في صفحة العروض؛ `false` كود خاص (لا يظهر ولا يصل للمتصفح).
- `categories` اختياري لتقييده بفئات معيّنة.

### الخصومات الدائمة والعروض
في `src/data/site.json`:
- `discounts`: خصم الإخوة (الثاني / الثالث فأكثر)، خصم طلاب معهد أبناؤنا، خصم التسجيل المبكر، والحد الأقصى لمجموع الخصومات.
- `announcement`: نص شريط الإعلان العلوي ورابطه (أو `enabled: false` لإخفائه).
- `offer`: عنوان العرض ونصه وتاريخ انتهاء العدّاد `endsAt` والكود.
- `currencies`: سعر التحويل التقريبي للجنيه المصري (EGP) — حدّثها دورياً.
- `contact`: العنوان والهواتف ورقم واتساب الحجز والبريد.

### باقة / مقال / شهادة / سؤال شائع
- باقة: `packages.json` (قائمة `courseIds` + السعر + السعر قبل الخصم).
- مقال: `blog.json` (المحتوى كتل `p` / `h2` / `ul`).
- شهادة للتحقق: `certificates.json` (`id` هو الرقم المطبوع على الشهادة).
- الأسئلة الشائعة العامة: `faq.json`.

### نصوص الواجهة
كل النصوص في `messages/ar.json` و `messages/en.json` (نفس المفاتيح في الملفين). المفاتيح مفحوصة بـ TypeScript: أي مفتاح ناقص يظهر كخطأ عند `npm run typecheck`.

---

## ٥) نظام الحجز (المرحلة الأولى – واتساب)

1. المتدرب يختار نوع الحضور والمجموعة وعدد المتدربين (خصم الإخوة) ← «احجز الآن».
2. في السلة: بيانات المتدرب + ولي الأمر (إلزامي تحت ١٨) + الهاتف بكود الدولة + الكوبون + خصم طلاب المعهد.
3. «تأكيد الحجز عبر واتساب» يفتح `https://wa.me/971555515049?text=…` برسالة بالصيغة المتفق عليها ورقم حجز `ABC-YYYYMMDD-NNNN`.
4. صفحة الشكر تعرض رقم الحجز وخطوات الدفع مع زر لإعادة الإرسال.

الأسعار تُحسب في `src/lib/pricing.ts` بالترتيب: تسجيل مبكر ← إخوة ← طلاب المعهد ← كوبون ← الحد الأقصى.

## ٦) المرحلة الثانية (البنية جاهزة)

- **الدفع الإلكتروني** (Stripe / Telr / Network International / Tabby): نفّذ `PaymentProvider` في `src/lib/payments/` وأنشئ `POST /api/checkout` يعيد حساب السعر بـ `buildQuote()` على الخادم (لا تثق بسعر المتصفح) ثم Webhook لتأكيد الدفع. تعليمات التدفق مكتوبة في أعلى `src/lib/payments/index.ts`.
- **حساب المتدرب** (كورساتي، الجدول، الحضور، الشهادات، الفواتير): الأنواع `Student`, `Enrollment`, `Invoice` معرّفة في `src/lib/types.ts`. يُقترح Supabase أو Auth.js + Postgres.
- **لوحة تحكم الإدارة**: لأن كل الوصول للبيانات يمر عبر `src/lib/data.ts`، يمكن استبدال ملفات JSON بـ CMS (Sanity / Strapi / Payload) أو قاعدة بيانات دون تعديل الصفحات.

---

## ٧) محتوى وصور يجب استبدالها قبل الإطلاق ✅

- [ ] **الشعار**: `public/images/brand/logo-mark.svg` و `src/app/icon.svg` (أيقونة المتصفح) ← ضع شعار المعهد الرسمي (قوس المشربية).
- [ ] **الكورسات**: كل ما في `courses.json` بيانات تجريبية (الأسعار، المواعيد، المقاعد، التقييمات، أعداد المتدربين). يمكن إضافة صور حقيقية (WebP ‏1200×750) في `public/images/courses/` وربطها بحقل `image`.
- [ ] **المدربون**: الأسماء والنبذات والشهادات في `instructors.json` **وهمية** — استبدلها بالمدربين الحقيقيين وصورهم (WebP مربعة ≥ 400px).
- [ ] **آراء المتدربين** `testimonials.json` وتقييمات الكورسات: استبدلها بآراء حقيقية (بإذن أصحابها).
- [ ] **الأرقام والإحصائيات** في `site.json → stats`.
- [ ] **الشهادات** `certificates.json`: بيانات حقيقية (أو ربطها لاحقاً بقاعدة بيانات).
- [ ] **الاعتمادات والشراكات** في صفحة «من نحن» (أماكن الشعارات LOGO 1–4).
- [ ] **روابط التواصل الاجتماعي** في `site.json → social`.
- [ ] **النصوص القانونية** `legal.json`: نموذجية ويجب مراجعتها قانونياً.
- [ ] **نموذج الشهادة** في صفحة الكورس (مكوّن `CertificatePreview`) — يمكن استبداله بصورة الشهادة الفعلية.
- [ ] **الإحداثيات والخريطة** `site.json → contact.geo / mapQuery` للموقع الدقيق للمعهد.
- [ ] **الدومين** `NEXT_PUBLIC_SITE_URL` وأكواد Analytics/Pixels.
- [ ] **أسعار العملات** `site.json → currencies`.

---

## ملاحظات تقنية
- `next-intl` مثبّت على الإصدار **4.4.x** عمداً: الإصدارات الأحدث (4.5+) تعتمد على `@swc/core` كحزمة native إضافية دون حاجة لها هنا.
- صور Open Graph تُولَّد تلقائياً لكل كورس (`opengraph-image.tsx`) بالإنجليزية لأن مولّد الصور لا يدعم تشكيل الحروف العربية؛ عنوان المشاركة ووصفها يظهران بالعربية.
- الخطوط: Cairo + Reem Kufi (عربي)، Inter + Cinzel (إنجليزي) عبر `next/font` (استضافة ذاتية، بدون طلبات لـ Google عند الزائر).
