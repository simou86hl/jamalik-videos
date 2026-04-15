import type { Badge, Habit, Challenge, ExpertSession, CommunityPost, WardrobeItem, LabRecipe, CycleDay } from '@/types';

// ============================================================
// Badges
// ============================================================
export const BADGES: Badge[] = [
  { id: 'b1', name: 'بداية جميلة', description: 'أكملت أول مقال', icon: 'BookOpen', requirement: 1, category: 'reading' },
  { id: 'b2', name: 'قارئة نشيطة', description: 'قرأت 10 مقالات', icon: 'Library', requirement: 10, category: 'reading' },
  { id: 'b3', name: 'محبة للمعرفة', description: 'قرأت 50 مقالاً', icon: 'GraduationCap', requirement: 50, category: 'reading' },
  { id: 'b4', name: 'طبّاخة مبدعة', description: 'جرّبت 5 وصفات', icon: 'ChefHat', requirement: 5, category: 'recipes' },
  { id: 'b5', name: 'سيدة المطبخ', description: 'جرّبت 20 وصفة', icon: 'Flame', requirement: 20, category: 'recipes' },
  { id: 'b6', name: 'نبتة أسبوع', description: 'نشاط متواصل 7 أيام', icon: 'Zap', requirement: 7, category: 'streak' },
  { id: 'b7', name: 'نبتة شهر', description: 'نشاط متواصل 30 يوم', icon: 'Star', requirement: 30, category: 'streak' },
  { id: 'b8', name: 'عضو مجتمع', description: 'شاركت 3 منشورات', icon: 'Users', requirement: 3, category: 'community' },
  { id: 'b9', name: 'محللة بشرة', description: 'أجريت تحليل البشرة', icon: 'Sparkles', requirement: 1, category: 'tools' },
  { id: 'b10', name: 'بطلّة التحدي', description: 'أكملت تحدي كامل', icon: 'Trophy', requirement: 1, category: 'challenges' },
  { id: 'b11', name: 'خبيرة تجميل', description: 'شاهدت 20 فيديو', icon: 'Video', requirement: 20, category: 'videos' },
  { id: 'b12', name: 'صحية وواعية', description: 'سجّلت عادات 14 يوم', icon: 'Heart', requirement: 14, category: 'habits' },
];

// ============================================================
// Default Habits
// ============================================================
export const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', name: 'شرب الماء', icon: 'Droplets', category: 'health', target: 8, unit: 'كؤوس', log: {} },
  { id: 'h2', name: 'النوم 8 ساعات', icon: 'Moon', category: 'wellness', target: 8, unit: 'ساعات', log: {} },
  { id: 'h3', name: 'روتين البشرة', icon: 'Sparkles', category: 'beauty', target: 2, unit: 'مرات (صباح/مساء)', log: {} },
  { id: 'h4', name: 'تمارين رياضية', icon: 'Dumbbell', category: 'fitness', target: 30, unit: 'دقيقة', log: {} },
  { id: 'h5', name: 'قراءة القرآن', icon: 'Book', category: 'spiritual', target: 1, unit: 'جزء', log: {} },
  { id: 'h6', name: 'تناول فواكه', icon: 'Apple', category: 'health', target: 3, unit: 'حصص', log: {} },
  { id: 'h7', name: 'المشي', icon: 'Footprints', category: 'fitness', target: 7000, unit: 'خطوة', log: {} },
  { id: 'h8', name: 'الصلاة في وقتها', icon: 'Star', category: 'spiritual', target: 5, unit: 'صلوات', log: {} },
];

// ============================================================
// Challenges
// ============================================================
export const CHALLENGES: Challenge[] = [
  {
    id: 'ch1', title: '21 يوم بشرة نضرة', description: 'تحدي العناية بالبشرة اليومية مع روتين مخصص لكل نوع بشرة',
    duration: 21, category: 'skincare', participants: 3420, icon: 'Sparkles',
    isActive: true, joinedDate: null, progress: 0,
    tasks: ['تنظيف الوجه صباحاً', 'ترطيب البشرة', 'وضع واقي الشمس', 'ماسك أسبوعي', 'شرب 8 أكواب ماء'],
  },
  {
    id: 'ch2', title: 'رمضان Wellness', description: 'تحدي صحي شامل خلال شهر رمضان للعناية بالجسم والروح',
    duration: 30, category: 'health', participants: 5680, icon: 'Heart',
    isActive: true, joinedDate: null, progress: 0,
    tasks: ['إفطار صحي', 'تمارين خفيفة بعد الإفطار', 'ترطيب كافٍ', 'قيام الليل', 'قراءة القرآن'],
  },
  {
    id: 'ch3', title: '14 يوم وصفات طبيعية', description: 'جرّبي وصفة طبيعية جديدة كل يوم من مكونات المطبخ',
    duration: 14, category: 'natural', participants: 1890, icon: 'Leaf',
    isActive: true, joinedDate: null, progress: 0,
    tasks: ['ماسك يومي', 'زيوت طبيعية', 'حمام طبيعي', 'مقشر طبيعي', 'وصفة شعر'],
  },
  {
    id: 'ch4', title: '30 يوم لياقة بدنية', description: 'برنامج تمارين منزلية لتحسين اللياقة وتنحيف الجسم',
    duration: 30, category: 'fitness', participants: 4210, icon: 'Dumbbell',
    isActive: true, joinedDate: null, progress: 0,
    tasks: ['تمارين cardio 20 دقيقة', 'يوغا 15 دقيقة', 'تمارين مقاومة', 'تمارين بطن', 'إطالة ومرونة'],
  },
  {
    id: 'ch5', title: '7 أيام مكياج احترافي', description: 'تعلمي تطبيق مكياج احترافي في 7 أيام مع تحديات يومية',
    duration: 7, category: 'beauty', participants: 2750, icon: 'Palette',
    isActive: true, joinedDate: null, progress: 0,
    tasks: ['مكياج يومي طبيعي', 'كونتور', 'أحمر شفاه', 'مكياج عيون', 'مكياج سهرة'],
  },
  {
    id: 'ch6', title: '21 يوم عناية بالشعر', description: 'روتين شامل للعناية بالشعر من الجذور حتى الأطراف',
    duration: 21, category: 'haircare', participants: 1560, icon: 'Scissors',
    isActive: false, joinedDate: null, progress: 0,
    tasks: ['زيت الشعر', 'شامبو مناسب', 'بلسم مرطب', 'ماسك شعر أسبوعي', 'تجنب الحرارة'],
  },
];

// ============================================================
// Expert Sessions
// ============================================================
export const EXPERT_SESSIONS: ExpertSession[] = [
  {
    id: 'es1', expertName: 'د. سارة المنصوري', specialty: 'أمراض جلدية',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964d31e?w=100&h=100&fit=crop',
    title: 'أسرار البشرة المشرقة', description: 'نصائح خبيرة جلدية للحصول على بشرة صحية ومتألقة',
    date: '2026-04-20', time: '20:00', duration: '60 دقيقة', isLive: false, isRegistered: false, category: 'skincare',
  },
  {
    id: 'es2', expertName: 'أ. نورا الحربي', specialty: 'تغذية صحية',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    title: 'التغذية السليمة للحامل', description: 'دليل غذائي شامل لكل مرحلة من مراحل الحمل',
    date: '2026-04-22', time: '19:00', duration: '45 دقيقة', isLive: false, isRegistered: false, category: 'health',
  },
  {
    id: 'es3', expertName: 'أ. ليلى الشمري', specialty: 'مكياج محترف',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    title: 'مكياج العروس الاحترافي', description: 'خطوات مكياج عروس من الدرجة الأولى مع أسرار المحترفين',
    date: '2026-04-25', time: '21:00', duration: '90 دقيقة', isLive: true, isRegistered: false, category: 'beauty',
  },
  {
    id: 'es4', expertName: 'مدربة رنا العمري', specialty: 'لياقة بدنية',
    avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&h=100&fit=crop',
    title: 'تمارين منزلية لإنقاص الوزن', description: 'برنامج تمارين فعال بدون معدات لإنقاص الوزن في المنزل',
    date: '2026-04-28', time: '18:00', duration: '45 دقيقة', isLive: false, isRegistered: false, category: 'fitness',
  },
  {
    id: 'es5', expertName: 'أ. هند القحطاني', specialty: 'تصميم أزياء',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop',
    title: 'اختيار الملابس حسب شكل الجسم', description: 'كيف تختارين الملابس التي تناسب شكل جسمك وتبرز جمالك',
    date: '2026-05-01', time: '20:00', duration: '60 دقيقة', isLive: false, isRegistered: false, category: 'fashion',
  },
];

// ============================================================
// Community Posts (sample)
// ============================================================
export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'cp1', authorName: 'سارة أحمد', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    content: 'جرّبت ماسك العسل والليمون لبشرة البشرة الدهنية والنتيجة مذهلة! بعد أسبوع من الاستخدام اليومي صارت بشرتي أنظف بكثير',
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop'],
    category: 'skincare', likes: 234, comments: 18, isLiked: false, createdAt: '2026-04-10', tags: ['ماسك طبيعي', 'بشرة دهنية'],
  },
  {
    id: 'cp2', authorName: 'نورة محمد', authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
    content: 'شاركوني إطلالة اليوم! تنسيق كاجوال أنيق للعمل مع عباية مطرزة',
    images: ['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=300&fit=crop'],
    category: 'fashion', likes: 456, comments: 32, isLiked: true, createdAt: '2026-04-12', tags: ['OOTD', 'كاجوال', 'عباية'],
  },
  {
    id: 'cp3', authorName: 'فاطمة علي', authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
    content: 'وصفة كنافة بالقشطة والجبن من الموقع — نجحت من أول مرة! عائلتي أحبتها جداً شكراً جمالكِ',
    images: ['https://images.unsplash.com/photo-1579888944880-d98341245702?w=400&h=300&fit=crop'],
    category: 'cooking', likes: 189, comments: 24, isLiked: false, createdAt: '2026-04-13', tags: ['كنافة', 'وصفة ناجحة'],
  },
  {
    id: 'cp4', authorName: 'ريم خالد', authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop',
    content: 'قبل وبعد شهر من استخدام زيت الأرغان للشعر — التطويل واضح والتكثيف ملاحظ! أنصح الجميع بتجربته',
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop'],
    category: 'haircare', likes: 567, comments: 45, isLiked: false, createdAt: '2026-04-14', tags: ['زيت أرغان', 'تطويل شعر'],
  },
];

// ============================================================
// Wardrobe Items (sample)
// ============================================================
export const SAMPLE_WARDROBE: WardrobeItem[] = [
  { id: 'w1', name: 'فستان سهرة أسود', category: 'dress', color: '#000000', season: 'all', occasion: 'party', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=250&fit=crop', brand: 'Zara', favorite: true },
  { id: 'w2', name: 'عباية بيضاء مطرزة', category: 'outerwear', color: '#FFFFFF', season: 'all', occasion: 'formal', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=200&h=250&fit=crop', brand: 'Sheikh Collection', favorite: true },
  { id: 'w3', name: 'بلوزة ساتان وردية', category: 'top', color: '#FFB6C1', season: 'spring', occasion: 'work', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200&h=250&fit=crop', brand: 'Mango', favorite: false },
  { id: 'w4', name: 'بنطلون جينز أزرق', category: 'bottom', color: '#4169E1', season: 'all', occasion: 'casual', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=250&fit=crop', brand: 'Levi\'s', favorite: false },
  { id: 'w5', name: 'حذاء كعب ذهبي', category: 'shoes', color: '#FFD700', season: 'all', occasion: 'party', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=250&fit=crop', brand: 'Aldo', favorite: true },
  { id: 'w6', name: 'حقيبة يد بنية', category: 'bag', color: '#8B4513', season: 'fall', occasion: 'work', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=250&fit=crop', brand: 'Michael Kors', favorite: false },
];

// ============================================================
// Lab Recipes (Natural Recipe Lab)
// ============================================================
export const LAB_RECIPES: LabRecipe[] = [
  {
    id: 'lr1', name: 'ماسك العسل والليمون للتفتيح', category: 'face',
    ingredients: [{ name: 'عسل طبيعي', amount: '2 ملعقة كبيرة', has: false }, { name: 'ليمون', amount: '1 حبة (عصير)', has: false }, { name: 'زيت زيتون', amount: '1 ملعقة صغيرة', has: false }],
    steps: ['اخلطي العسل مع عصير الليمون وزيت الزيتون', 'ضعي الماسك على وجه نظيف لمدة 15-20 دقيقة', 'اغسلي بماء دافئ ورطبي بشرتك'],
    benefits: ['تفتيح البشرة', 'ترطيب عميق', 'مكافحة التصبغات'], warnings: ['لا تستخدمي إذا كانت بشرتك حساسة جداً', 'تجنبي التعرض المباشر للشمس بعد الاستخدام'],
    skinType: ['normal', 'dry', 'combination'], pregnancySafe: true, duration: '20 دقيقة',
  },
  {
    id: 'lr2', name: 'حمام الزيت الدافئ للشعر', category: 'hair',
    ingredients: [{ name: 'زيت جوز الهند', amount: '3 ملاعق كبيرة', has: false }, { name: 'زيت زيتون', amount: '2 ملعقة كبيرة', has: false }, { name: 'عسل', amount: '1 ملعقة كبيرة', has: false }],
    steps: ['سخني الزيوت مع العسل على نار هادئة', 'دلّكي فروة الرأس بلطف لمدة 10 دقائق', 'غطي الشعر بقبعة دافئة لمدة 30 دقيقة', 'اغسلي بالشامبو مرتين'],
    benefits: ['تغذية عميقة', 'لمعان وحيوية', 'تقوية الشعر'], warnings: ['لا تسخني الزيت كثيراً'],
    skinType: [], pregnancySafe: true, duration: '45 دقيقة',
  },
  {
    id: 'lr3', name: 'مقشر القهوة والسكر للجسم', category: 'body',
    ingredients: [{ name: 'قهوة مطحونة', amount: 'نصف كوب', has: false }, { name: 'سكر بني', amount: 'نصف كوب', has: false }, { name: 'زيت جوز الهند', amount: 'ربع كوب', has: false }],
    steps: ['اخلطي جميع المكونات معاً', 'افركي الجسم بحركات دائرية أثناء الاستحمام', 'اشطفي بماء دافئ'],
    benefits: ['إزالة الخلايا الميتة', 'تنعيم البشرة', 'تحسين الدورة الدموية'], warnings: ['لا تستخدمي على بشرة مصابة أو ملتهبة'],
    skinType: [], pregnancySafe: true, duration: '15 دقيقة',
  },
  {
    id: 'lr4', name: 'تونر ماء الورد والألوفيرا', category: 'face',
    ingredients: [{ name: 'ماء ورد', amount: 'نصف كوب', has: false }, { name: 'جل ألوفيرا', amount: '2 ملعقة كبيرة', has: false }, { name: 'خلاصة خيار', amount: '2 ملعقة كبيرة', has: false }],
    steps: ['اخلطي جميع المكونات في زجاجة رذاذ', 'رشي على وجه نظيف صباحاً ومساءً', 'احفظي في الثلاجة لمدة أسبوع'],
    benefits: ['تنظيف وترطيب', 'تهدئة البشرة', 'تقليل المسام'], warnings: ['اختبري على جزء صغير من البشرة أولاً'],
    skinType: ['oily', 'combination', 'sensitive'], pregnancySafe: true, duration: '5 دقائق',
  },
  {
    id: 'lr5', name: 'ماسك الأفوكادو للشعر الجاف', category: 'hair',
    ingredients: [{ name: 'أفوكادو ناضج', amount: '1 حبة', has: false }, { name: 'بيضة', amount: '1 حبة', has: false }, { name: 'زيت زيتون', amount: '1 ملعقة كبيرة', has: false }],
    steps: ['اهرسي الأفوكادو وأضيفي البيضة والزيت', 'وزعي على الشعر من الجذور للأطراف', 'اتركي لمدة 30 دقيقة ثم اغسلي'],
    benefits: ['ترطيب مكثف', 'إصلاح التلف', 'لمعان طبيعي'], warnings: ['استخدمي ماء بارد للشطف حتى لا ينضج البيض'],
    skinType: [], pregnancySafe: false, duration: '35 دقيقة',
  },
];

// ============================================================
// AI Chat quick suggestions
// ============================================================
export const AI_CHAT_SUGGESTIONS = [
  'ما هو روتين البشرة المثالي؟',
  'وصفات سريعة لعشاء صحي',
  'كيف أتعامل مع تساقط الشعر؟',
  'نصائح لإطلالة سهرة أنيقة',
  'تمارين منزلية لحرق الدهون',
  'وصفات ماسكات طبيعية',
  'نصائح التغذية للحامل',
  'كيف أختار كريم واقي شمس مناسب؟',
];

// ============================================================
// Style advisor body types
// ============================================================
export const BODY_TYPE_TIPS = {
  slim: { name: 'نحيفة', tips: ['الملابس المتعددة الطبقات تعطي حجم', 'التنانير الواسعة والقمصان المنفوخة', 'الألوان الفاتحة والأنماط الكبيرة'] },
  average: { name: 'متوسطة', tips: ['كل الأنماط تناسبك', 'ركزي على إبراز نقاط القوة', 'الملابس الضيقة تبرز الأنثوية'] },
  curvy: { name: 'منحنية', tips: ['الملابس الخصرية تبرز الجمال', 'الأقمشة الملساء والقوية', 'الفستان المحابي خيار ممتاز'] },
  plus: { name: 'كاملة', tips: ['الملابس باللون الواحد تطول القوام', 'القماش المتدفق أنيق', 'تجنبي الأنماط الكبيرة جداً'] },
};
