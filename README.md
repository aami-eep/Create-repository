# AI WhatsApp Agent

منصة SaaS تتيح لأي شركة أو متجر أو مطعم أو عيادة ربط حساب **WhatsApp Business**
الخاص بها، ليقوم الذكاء الاصطناعي بالرد التلقائي على استفسارات العملاء اعتماداً
على معلومات الشركة (الخدمات، المنتجات، الأسعار، الأسئلة الشائعة، ساعات العمل...).

النسخة الحالية جاهزة للإنتاج (Production-ready) ومبنية بالكامل على خدمات مجانية.

---

## 1. التقنيات المستخدمة

| الطبقة | التقنية |
|---|---|
| الواجهة الأمامية | Next.js 15 (App Router) + React 19 + TypeScript |
| التنسيق | Tailwind CSS |
| قاعدة البيانات + المصادقة | Supabase (مجاني) |
| الذكاء الاصطناعي | Gemini / Qwen / DeepSeek (طبقة موحّدة قابلة للتبديل) |
| الاستضافة | Vercel (مجاني) |
| واتساب | WhatsApp Business Cloud API (طبقة جاهزة، تُفعّل لاحقاً) |

---

## 2. هيكل المشروع

```
src/
  app/                      صفحات ومسارات API (App Router)
    page.tsx                الصفحة الرئيسية
    login/                  تسجيل الدخول بالبريد الإلكتروني
    dashboard/              لوحة التحكم (محمية بالمصادقة)
      page.tsx              نظرة عامة + إحصائيات
      settings/             إعدادات الشركة
      ai/                   إعدادات الذكاء الاصطناعي
      test/                 صفحة اختبار الردود
    api/
      chat/                 توليد رد للاختبار
      ai/test/              اختبار اتصال مزود ذكاء اصطناعي
      whatsapp/webhook/     استقبال رسائل واتساب (جاهز، غير مفعّل)
      auth/callback/        معالجة رابط تسجيل الدخول
  components/
    ui/                     مكونات واجهة أساسية (Button, Card, Input...)
    landing/                مكونات الصفحة الرئيسية
    dashboard/              مكونات لوحة التحكم
  lib/
    ai/                     طبقة الذكاء الاصطناعي الموحّدة
      config.ts             نقطة التحكم الوحيدة في المزود الافتراضي والأولوية
      registry.ts           سجل المزودين
      index.ts              generateReply() مع تبديل تلقائي عند الفشل
      providers/             تطبيق كل مزود (gemini, qwen, deepseek)
    whatsapp/               طبقة واتساب المستقلة
    supabase/               عملاء Supabase (browser, server, middleware)
  types/                    كل الأنواع المشتركة
supabase/
  schema.sql                سكيما قاعدة البيانات الكاملة (شغّلها مرة واحدة)
```

### طبقة الذكاء الاصطناعي (AI Provider Layer)

كل ملفات المزودين تطبّق واجهة واحدة موحّدة (`AIProvider`)، والتطبيق بأكمله
يستدعي دالة واحدة فقط: `generateReply()`. لتغيير المزود الافتراضي أو ترتيب
الأولوية، عدّل **ملف واحد فقط**:

```
src/lib/ai/config.ts
```

إذا فشل المزود المختار (مفتاح غير صالح، انقطاع الخدمة...) ينتقل النظام تلقائياً
للمزود التالي حسب الأولوية، بشرط أن يكون المستخدم قد أدخل مفتاح API له.

---

## 3. التشغيل لأول مرة (على جهاز الكمبيوتر)

### الخطوة 1: إنشاء مشروع Supabase مجاني

1. افتح [supabase.com](https://supabase.com) وسجّل دخولك (يمكن عبر GitHub).
2. اضغط **New Project**، اختر اسماً وكلمة مرور لقاعدة البيانات ومنطقة قريبة.
3. بعد إنشاء المشروع، اذهب إلى **SQL Editor** من القائمة الجانبية.
4. افتح ملف `supabase/schema.sql` من هذا المشروع، انسخ محتواه بالكامل،
   الصقه في SQL Editor، ثم اضغط **Run**. هذا ينشئ كل الجداول والحماية
   (RLS) تلقائياً.
5. اذهب إلى **Authentication > Providers** وتأكد أن **Email** مفعّل
   (مفعّل افتراضياً). في **Authentication > URL Configuration** أضف رابط
   موقعك لاحقاً (بعد النشر على Vercel) ضمن **Redirect URLs**، مثلاً:
   `https://your-app.vercel.app/api/auth/callback`
6. اذهب إلى **Project Settings > API** وانسخ ثلاث قيم ستحتاجها لاحقاً:
   - `Project URL`
   - `anon public` key
   - `service_role` key (سرّي - لا تشاركه أبداً)

### الخطوة 2: إعداد المتغيرات محلياً

انسخ `.env.example` إلى ملف جديد باسم `.env.local` وعبّئ القيم:

```bash
cp .env.example .env.local
```

### الخطوة 3: التثبيت والتشغيل

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

---

## 4. رفع المشروع إلى GitHub من الهاتف

يمكنك تنفيذ هذا بالكامل من هاتفك بدون كمبيوتر:

1. حمّل تطبيق **Working Copy** (iPhone) أو استخدم تطبيق **GitHub** الرسمي،
   أو ببساطة استخدم متصفح الهاتف مباشرة (الطريقة الأسهل، موضحة هنا):
2. افتح [github.com](https://github.com) من متصفح الهاتف وسجّل الدخول (أو أنشئ حساباً).
3. اضغط على أيقونة **+** أعلى الصفحة ثم **New repository**.
4. اختر اسماً للمستودع (مثلاً `ai-whatsapp-agent`)، اجعله **Public** أو
   **Private**، ثم اضغط **Create repository**.
5. في صفحة المستودع الفارغ، اضغط على رابط **uploading an existing file**.
6. اضغط **choose your files** وارفع كل ملفات المشروع (فك ضغط الملف الذي
   حصلت عليه أولاً باستخدام أي تطبيق لفك الضغط على الهاتف، مثل **Files**
   على أندرويد أو تطبيق **الملفات** على آيفون، ثم اختر كل الملفات والمجلدات
   من داخل المجلد المفكوك).
7. اكتب رسالة بسيطة مثل `initial commit` واضغط **Commit changes**.

> ملاحظة: بعض متصفحات الهاتف لا تدعم رفع مجلدات كاملة دفعة واحدة. إذا واجهت
> مشكلة، استخدم تطبيق **Working Copy** (مجاني جزئياً) على آيفون أو تطبيق
> **Termux + git** على أندرويد لرفع المشروع بأوامر git العادية:
>
> ```bash
> git init
> git add .
> git commit -m "initial commit"
> git branch -M main
> git remote add origin https://github.com/USERNAME/ai-whatsapp-agent.git
> git push -u origin main
> ```

---

## 5. النشر على Vercel من الهاتف

1. افتح [vercel.com](https://vercel.com) من متصفح الهاتف وسجّل الدخول
   باستخدام حساب **GitHub** نفسه (زر **Continue with GitHub**).
2. اضغط **Add New... > Project**.
3. ستظهر قائمة بمستودعات GitHub الخاصة بك - اختر `ai-whatsapp-agent` ثم
   اضغط **Import**.
4. في صفحة الإعدادات قبل النشر (**Configure Project**):
   - Vercel يكتشف Next.js تلقائياً، لا حاجة لتغيير أي إعداد بناء.
   - افتح قسم **Environment Variables** وأضف المتغيرات التالية واحداً تلو
     الآخر (الاسم ثم القيمة، ثم **Add**):
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `WHATSAPP_ENABLED` بالقيمة `false`
     - `WHATSAPP_VERIFY_TOKEN` بأي نص عشوائي
5. اضغط **Deploy** وانتظر دقيقتين تقريباً حتى يكتمل البناء.
6. بعد النشر، ستحصل على رابط مثل `https://ai-whatsapp-agent.vercel.app`.
7. ارجع إلى إعدادات Supabase (**Authentication > URL Configuration**) وأضف:
   - **Site URL**: `https://ai-whatsapp-agent.vercel.app`
   - **Redirect URLs**: `https://ai-whatsapp-agent.vercel.app/api/auth/callback`

الآن المشروع منشور بالكامل ويعمل.

---

## 6. إضافة مفاتيح الذكاء الاصطناعي (Gemini / Qwen / DeepSeek)

لا تُضاف مفاتيح الذكاء الاصطناعي كمتغيرات بيئة على Vercel، بل يدخلها كل
مستخدم بنفسه من داخل التطبيق حتى يستطيع كل صاحب شركة استخدام مفتاحه الخاص:

1. سجّل دخولك إلى المنصة بالبريد الإلكتروني.
2. من لوحة التحكم، افتح **إعدادات الذكاء الاصطناعي**.
3. اختر المزود الذي تريد استخدامه أولاً.
4. احصل على مفتاح API مجاني من أحد الروابط التالية:
   - **Gemini**: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   - **Qwen**: [dashscope.console.aliyun.com/apiKey](https://dashscope.console.aliyun.com/apiKey)
   - **DeepSeek**: [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
5. الصق المفتاح في الحقل المخصص، اضغط **اختبار الاتصال** للتأكد من صحته،
   ثم اضغط **حفظ الإعدادات**.
6. يمكنك تكرار الخطوة لأكثر من مزود - إذا فشل المزود الأول، سينتقل النظام
   تلقائياً للمزود التالي الذي أدخلت له مفتاحاً.

---

## 7. تجربة النظام قبل ربط واتساب

من لوحة التحكم، افتح **صفحة الاختبار**، واكتب أي رسالة كأنك عميل. سيرد
الذكاء الاصطناعي بناءً على المعلومات التي أدخلتها في **إعدادات الشركة**.

عدّل بيانات الشركة من هناك في أي وقت لتحسين جودة الردود.

---

## 8. ربط WhatsApp Business Cloud API (لاحقاً)

الطبقة جاهزة بالكامل في `src/lib/whatsapp/` و
`src/app/api/whatsapp/webhook/route.ts` لكنها غير مفعّلة افتراضياً. للتفعيل:

1. أنشئ تطبيقاً على [developers.facebook.com](https://developers.facebook.com)
   من نوع **Business**، وأضف منتج **WhatsApp**.
2. من إعدادات واتساب في التطبيق، احصل على `Phone Number ID` و
   `Temporary/Permanent Access Token`.
3. في Vercel، غيّر متغير `WHATSAPP_ENABLED` إلى `true` وأعد النشر.
4. اضبط رابط الـ Webhook في إعدادات Meta على:
   `https://your-app.vercel.app/api/whatsapp/webhook`
   واستخدم نفس القيمة الموجودة في `WHATSAPP_VERIFY_TOKEN` كـ Verify Token.
5. من جدول `whatsapp_connections` في Supabase، حدّث صف شركتك بإضافة
   `phone_number_id` و`access_token` وتغيير `status` إلى `connected`
   (يمكن لاحقاً إضافة واجهة لهذا من لوحة التحكم دون تعديل باقي الكود).

لا حاجة لتعديل أي ملف آخر في المشروع عند تفعيل واتساب.

---

## 9. الأمان

- كل شركة ترى بياناتها فقط بفضل **Row Level Security** في Supabase.
- مفاتيح API الخاصة بالذكاء الاصطناعي تُخزَّن في قاعدة بيانات محمية بـ RLS
  ولا تُرسَل أبداً إلى المتصفح إلا عند إدخالها.
- `SUPABASE_SERVICE_ROLE_KEY` يُستخدم فقط في مسار الـ Webhook على الخادم،
  ولا يجب أبداً كشفه في كود العميل (Client Components).

---

## 10. الترخيص

هذا المشروع جاهز للاستخدام والتعديل بحرية لأغراضك التجارية الخاصة.
