
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, setDoc, collection, query, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseService';
import Layout from './components/Layout';
import Auth from './components/Auth';
import FeudBoard from './components/FeudBoard';
import { GameState, GameSession, Player } from './types';
import { FEUD_QUESTIONS, TEAM_PALETTE } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'player'>('player');
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const playSound = (type: 'correct' | 'wrong') => {
    const audios = {
      correct: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
      wrong: 'https://www.myinstants.com/media/sounds/family-feud-buzzer.mp3'
    };
    new Audio(audios[type]).play().catch(() => {});
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        // Get user role immediately
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
        
        // Listen for role updates
        onSnapshot(doc(db, 'users', u.uid), (snap) => {
          if (snap.exists()) setRole(snap.data().role);
        });
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const sessionRef = doc(db, 'game', 'current');
    const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        const newData = snapshot.data() as GameSession;
        if (session) {
          if (newData.revealedAnswers.length > session.revealedAnswers.length) playSound('correct');
          if (newData.strikes > session.strikes) playSound('wrong');
        }
        setSession(newData);
      } else {
        setSession(null);
      }
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    return onSnapshot(q, (snapshot) => {
      const pList: Player[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        if (data.role === 'player') pList.push(data as Player);
      });
      setPlayers(pList);
    });
  }, []);

  const initSession = async () => {
    if (!user || role !== 'admin') return;
    const sessionRef = doc(db, 'game', 'current');
    await setDoc(sessionRef, {
      state: GameState.WAITING,
      currentQuestionIndex: 0,
      revealedAnswers: [],
      strikes: 0,
      teamAScore: 0,
      teamBScore: 0,
      teamAColor: 'bg-blue-800',
      teamBColor: 'bg-red-800',
      adminId: user.uid
    });
  };

  if (loading) return <div className="h-screen flex flex-col items-center justify-center space-y-4"><div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div><p className="text-xl font-bold">جاري التحميل...</p></div>;
  if (!user) return <Layout title="تحدي العائلات"><Auth /></Layout>;

  const isAdmin = role === 'admin';
  const currentQ = session ? FEUD_QUESTIONS[session.currentQuestionIndex] : null;

  return (
    <Layout>
      {/* Scoreboard Header */}
      <div className="w-full flex justify-between items-center mb-8 gap-2">
        <div className={`text-center p-3 md:p-5 ${session?.teamAColor || 'bg-blue-900'} border-4 border-yellow-500 rounded-2xl shadow-xl flex-1 transition-all`}>
          <div className="text-[10px] md:text-sm font-bold opacity-80 uppercase tracking-widest">فريق أ</div>
          <div className="text-2xl md:text-5xl font-black text-white drop-shadow-md">{session?.teamAScore || 0}</div>
        </div>
        
        <div className="text-center px-2 flex-[1.5]">
          <h1 className="text-xl md:text-4xl font-black text-yellow-500 leading-tight drop-shadow-lg">تحدي العائلات</h1>
          {currentQ && session?.state === GameState.PLAYING && (
            <div className="mt-2 inline-block bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold animate-pulse">
              تصنيف: {currentQ.category}
            </div>
          )}
        </div>

        <div className={`text-center p-3 md:p-5 ${session?.teamBColor || 'bg-red-900'} border-4 border-yellow-500 rounded-2xl shadow-xl flex-1 transition-all`}>
          <div className="text-[10px] md:text-sm font-bold opacity-80 uppercase tracking-widest">فريق ب</div>
          <div className="text-2xl md:text-5xl font-black text-white drop-shadow-md">{session?.teamBScore || 0}</div>
        </div>
      </div>

      {/* Main Content Area */}
      {!session ? (
        <div className="text-center space-y-6 py-12">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">لا توجد مسابقة نشطة حالياً</h2>
            {isAdmin ? (
              <button 
                onClick={initSession}
                className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl transition transform hover:scale-105 active:scale-95"
              >
                إنشاء مسابقة جديدة
              </button>
            ) : (
              <p className="text-white/60 animate-pulse">يرجى الانتظار حتى يقوم المذيع ببدء الجولة...</p>
            )}
          </div>
        </div>
      ) : session.state === GameState.WAITING ? (
        <div className="text-center space-y-8 w-full">
          <div className="p-10 bg-black/20 rounded-3xl border-2 border-dashed border-white/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">قاعة الانتظار</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {players.length > 0 ? players.map(p => (
                <span key={p.uid} className="bg-white/10 px-4 py-1 rounded-full text-sm border border-white/10">
                  {p.name}
                </span>
              )) : <span className="text-white/40">لا يوجد لاعبون متصلون بعد</span>}
            </div>
          </div>
          
          {isAdmin && (
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6">
              <h3 className="font-bold text-yellow-500">إعدادات المذيع</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/20 rounded-xl space-y-2">
                  <p className="text-xs">لون فريق أ</p>
                  <div className="flex justify-center gap-2">
                    {TEAM_PALETTE.map(c => (
                      <button key={c.class} onClick={() => updateDoc(doc(db, 'game', 'current'), { teamAColor: c.class })} 
                              className={`w-6 h-6 rounded-full ${c.class} ${session.teamAColor === c.class ? 'ring-2 ring-white scale-125' : ''}`} />
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl space-y-2">
                  <p className="text-xs">لون فريق ب</p>
                  <div className="flex justify-center gap-2">
                    {TEAM_PALETTE.map(c => (
                      <button key={c.class} onClick={() => updateDoc(doc(db, 'game', 'current'), { teamBColor: c.class })} 
                              className={`w-6 h-6 rounded-full ${c.class} ${session.teamBColor === c.class ? 'ring-2 ring-white scale-125' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => updateDoc(doc(db, 'game', 'current'), { state: GameState.PLAYING })} 
                className="w-full bg-yellow-500 text-blue-900 py-4 rounded-xl font-black text-2xl shadow-2xl hover:bg-yellow-400 transition"
              >
                بدء المسابقة!
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full space-y-6">
          {currentQ && (
            <>
              <div className="text-center py-6 px-4 bg-white/5 rounded-2xl border border-white/10 mb-4 shadow-lg">
                <h2 className="text-xl md:text-3xl font-black leading-tight">{currentQ.text}</h2>
              </div>
              <FeudBoard 
                answers={currentQ.answers} 
                revealedIndices={session.revealedAnswers} 
                strikes={session.strikes} 
              />
            </>
          )}

          {isAdmin && currentQ && (
            <div className="mt-8 bg-blue-900/60 p-6 rounded-3xl border-2 border-yellow-500/30 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="font-bold text-yellow-500 flex items-center gap-2">
                  <i className="fas fa-crown"></i> لوحة التحكم
                </h3>
                <span className="text-[10px] bg-red-600 px-2 py-1 rounded font-bold uppercase">بث مباشر</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {currentQ.answers.map((ans, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      if (!session.revealedAnswers.includes(i)) {
                        updateDoc(doc(db, 'game', 'current'), { revealedAnswers: arrayUnion(i) });
                      }
                    }}
                    disabled={session.revealedAnswers.includes(i)}
                    className={`p-3 text-xs rounded-lg transition-all border border-white/10 truncate ${session.revealedAnswers.includes(i) ? 'bg-green-600/30 opacity-50' : 'bg-white/10 hover:bg-yellow-500 hover:text-blue-900 hover:font-bold'}`}
                  >
                    {ans.text} ({ans.points})
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-white/10">
                <button onClick={() => updateDoc(doc(db, 'game', 'current'), { strikes: increment(1) })} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-bold text-xs shadow-lg">خطأ X</button>
                <button onClick={() => updateDoc(doc(db, 'game', 'current'), { teamAScore: increment(10) })} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold text-xs shadow-lg">+10 لـ أ</button>
                <button onClick={() => updateDoc(doc(db, 'game', 'current'), { teamBScore: increment(10) })} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold text-xs shadow-lg">+10 لـ ب</button>
                <button onClick={() => updateDoc(doc(db, 'game', 'current'), { strikes: 0, revealedAnswers: [] })} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold text-xs">تصفير</button>
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-xs font-bold text-yellow-500">اختر السؤال:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {FEUD_QUESTIONS.map((q, idx) => (
                    <button 
                      key={q.id} 
                      onClick={() => updateDoc(doc(db, 'game', 'current'), { currentQuestionIndex: idx, revealedAnswers: [], strikes: 0 })}
                      className={`p-2 text-[10px] rounded border transition-colors ${session.currentQuestionIndex === idx ? 'bg-yellow-500 text-blue-900 border-yellow-500 font-bold' : 'bg-black/30 border-white/20 hover:border-yellow-500'}`}
                    >
                      {q.category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 flex gap-4 justify-center items-center opacity-40 text-[10px] hover:opacity-100 transition">
        <button onClick={() => auth.signOut()} className="underline">تسجيل خروج</button>
        {isAdmin && <button onClick={() => updateDoc(doc(db, 'game', 'current'), { state: GameState.FINISHED })} className="text-red-400">إغلاق الجلسة</button>}
      </div>
    </Layout>
  );
};

export default App;
