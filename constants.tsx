
import { FeudQuestion, Question } from './types';

export const FEUD_QUESTIONS: FeudQuestion[] = [
  {
    id: 1,
    category: "إسلامية",
    text: "ذكر في القرآن الكريم.. أسماء فواكه؟",
    answers: [
      { text: "رمان", points: 40 },
      { text: "تين", points: 25 },
      { text: "زيتون", points: 15 },
      { text: "عنب", points: 10 },
      { text: "رطب/تمر", points: 7 },
      { text: "موز/طلح", points: 3 }
    ]
  },
  {
    id: 2,
    category: "رياضية",
    text: "أندية كرة قدم سعودية مشهورة؟",
    answers: [
      { text: "الهلال", points: 35 },
      { text: "النصر", points: 30 },
      { text: "الاتحاد", points: 20 },
      { text: "الأهلي", points: 10 },
      { text: "الشباب", points: 3 },
      { text: "الاتفاق", points: 2 }
    ]
  },
  {
    id: 3,
    category: "ثقافية",
    text: "دولة عربية تبدأ بحرف الـ 'م'؟",
    answers: [
      { text: "مصر", points: 40 },
      { text: "المغرب", points: 30 },
      { text: "موريتانيا", points: 15 },
      { text: "مدينة (فلسطين)", points: 10 },
      { text: "مسقط (عمان)", points: 5 }
    ]
  },
  {
    id: 4,
    category: "فنية",
    text: "آلة موسيقية وترية؟",
    answers: [
      { text: "عود", points: 45 },
      { text: "جيتار", points: 25 },
      { text: "قانون", points: 15 },
      { text: "كمان", points: 10 },
      { text: "ربابة", points: 5 }
    ]
  }
];

export const TEAM_PALETTE = [
  { name: "أزرق ملكي", class: "bg-blue-700" },
  { name: "أحمر ناري", class: "bg-red-700" },
  { name: "أخضر زمردي", class: "bg-green-700" },
  { name: "بنفسجي غامق", class: "bg-purple-800" },
  { name: "ذهبي", class: "bg-yellow-600" },
  { name: "برتقالي", class: "bg-orange-600" }
];

export const INITIAL_QUESTIONS: Question[] = []; // Placeholder
export const PLAYER_COLORS = ['bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];
