
import React, { useState } from 'react';
import { auth, db } from '../firebaseService';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        
        // Robust Admin Check: Check if any settings/admin doc exists
        const adminDoc = await getDoc(doc(db, 'settings', 'admin'));
        let role = 'player';
        
        if (!adminDoc.exists()) {
          // If no admin ever existed, make this user the first admin
          await setDoc(doc(db, 'settings', 'admin'), { uid: user.uid, email: email });
          role = 'admin';
        }

        // Save user profile
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name || email.split('@')[0],
          email: email,
          role: role,
          score: 0,
          color: 'bg-indigo-500',
          createdAt: new Date()
        });
      }
    } catch (err: any) {
      console.error(err);
      let msg = "حدث خطأ ما، يرجى المحاولة لاحقاً";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') msg = "البريد أو كلمة المرور غير صحيحة";
      if (err.code === 'auth/email-already-in-use') msg = "هذا البريد مسجل مسبقاً";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl animate-in zoom-in-95 duration-300">
      <h2 className="text-3xl font-black text-center mb-8 text-yellow-500">{isLogin ? 'دخول المسابقة' : 'تسجيل جديد'}</h2>
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-xl mb-6 text-sm text-center animate-pulse">
          {error}
        </div>
      )}
      <form onSubmit={handleAuth} className="space-y-4">
        {!isLogin && (
          <div className="space-y-1">
            <label className="text-xs px-2 opacity-60">الاسم المستعار</label>
            <input
              type="text"
              placeholder="مثلاً: بطل العائلة"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/30 border border-white/10"
              required={!isLogin}
            />
          </div>
        )}
        <div className="space-y-1">
          <label className="text-xs px-2 opacity-60">البريد الإلكتروني</label>
          <input
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/10 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/30 border border-white/10"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs px-2 opacity-60">كلمة المرور</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/30 border border-white/10"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-black py-4 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
               <div className="w-4 h-4 border-2 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
               <span>جاري المعالجة...</span>
            </div>
          ) : (isLogin ? 'دخول سريع' : 'إنشاء حسابي')}
        </button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-8 text-sm opacity-50 hover:opacity-100 transition-all hover:text-yellow-400"
      >
        {isLogin ? 'لا تملك حساب؟ سجل الآن مجاناً' : 'لديك حساب بالفعل؟ سجل دخولك'}
      </button>
    </div>
  );
};

export default Auth;
