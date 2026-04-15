---
Task ID: 1
Agent: Main Agent
Task: تصحيح شفافية شريط الإيقونات السفلي + إضافة قسم فيديوهات + استبدال أيقونة المفضلة

Work Log:
- قراءة وتحليل ملفات المشروع: Navbar.tsx, page.tsx, useStore.ts, types/index.ts, globals.css, constants.ts
- تصحيح شفافية الشريط السفلي: تغيير `glass-strong` إلى `bg-bg/95 backdrop-blur-xl shadow` لتقليل الشفافية
- استبدال أيقونة المفضلة (Heart) بأيقونة الفيديوهات (Video) في الشريط السفلي
- إضافة `'videos'` إلى نوع `SitePage` في types/index.ts
- إنشاء أنواع جديدة: `VideoCategorySlug` و `VideoItem` في types/index.ts
- إنشاء بيانات الفيديوهات: src/data/videoData.ts مع 26 فيديو في 8 أقسام
- إنشاء صفحة الفيديوهات: src/components/pages/VideoPage.tsx مع تصفية حسب القسم + فيديوهات مميزة + نافذة تفاصيل
- إضافة مسار `videos` في page.tsx
- بناء المشروع بنجاح

Stage Summary:
- شريط الإيقونات السفلي أصبح أقل شفافية (bg-bg/95)
- أيقونة المفضلة استبدلت بأيقونة فيديوهات في الشريط السفلي
- قسم فيديوهات جديد متعدد المحتوى مع 8 أقسام و 26 فيديو
- الملفات المعدلة/المضافة: Navbar.tsx, types/index.ts, page.tsx, videoData.ts (جديد), VideoPage.tsx (جديد)
