
import { Kid, User, Behavior, Reward } from './types';

export const PARENT_USER: User = {
  id: 'parent',
  name: 'ولي الأمر',
  avatar: '👨‍👩‍👧‍👦',
};

export const KIDS_DATA: Kid[] = [
  {
    id: 'kid1',
    name: 'فاطمة',
    avatar: '👧',
    points: 120,
    pointHistory: [
        { id: 'ph1', behaviorId: 'b1', behaviorName: 'ترتيب الغرفة', points: 10, date: new Date(Date.now() - 86400000).toISOString() },
        { id: 'ph2', behaviorId: 'b4', behaviorName: 'شجار مع الأخ', points: -5, date: new Date().toISOString() },
    ],
    rewardHistory: [],
  },
  {
    id: 'kid2',
    name: 'أحمد',
    avatar: '👦',
    points: 85,
    pointHistory: [
        { id: 'ph3', behaviorId: 'b2', behaviorName: 'المساعدة في المطبخ', points: 15, date: new Date(Date.now() - 172800000).toISOString() },
    ],
    rewardHistory: [],
  },
];

export const BEHAVIORS_DATA: Behavior[] = [
  { id: 'b1', name: 'ترتيب الغرفة', points: 10, icon: '🛏️' },
  { id: 'b2', name: 'المساعدة في المطبخ', points: 15, icon: '🍳' },
  { id: 'b3', name: 'إكمال الواجبات المنزلية', points: 20, icon: '📚' },
  { id: 'b4', name: 'شجار مع الأخ', points: -5, icon: '😠' },
  { id: 'b5', name: 'عدم سماع الكلام', points: -10, icon: '🙅' },
];

export const REWARDS_DATA: Reward[] = [
  { id: 'r1', name: 'ساعة إضافية على التلفاز', cost: 50, icon: '📺' },
  { id: 'r2', name: 'شراء لعبة جديدة', cost: 200, icon: '🧸' },
  { id: 'r3', name: 'الذهاب إلى مدينة الملاهي', cost: 500, icon: '🎢' },
  { id: 'r4', name: 'آيس كريم', cost: 30, icon: '🍦' },
];
