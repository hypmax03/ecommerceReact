import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUpRight } from 'iconoir-react';
import { loginUser } from '../redux/userSlice';
import Tape from '../components/Tape';
import HandwrittenNote from '../components/HandwrittenNote';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user || { loading: false });

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');

    const res = await dispatch(
      loginUser({
        email: email.trim().toLowerCase(),
        password,
      })
    );
    if (res.meta.requestStatus === 'fulfilled') {
      const user = res.payload?.user;
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setLoginError(res.payload || 'Invalid email or password.');
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-36 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#FDFCF9] p-8 sm:p-10 border border-[#2C2A29]/15 shadow-xl relative">
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none">
          <Tape rotate="-1deg" variant="kraft" text="CLIENT SIGN IN" width="w-36" />
        </div>

        <div className="text-center mb-8 border-b border-[#2C2A29]/15 pb-6">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#7A756F] block mb-1">
            ELORA • ACCOUNT PORTAL
          </span>
          <h1 className="font-serif text-3xl text-[#191817] font-normal">
            Sign In
          </h1>
          <p className="font-sans text-xs text-[#7A756F] mt-1">
            Access your orders, curation requests, or administrator dashboard.
          </p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 bg-[#FDF2F4] border border-[#8B263E]/30 text-[#8B263E] font-mono text-xs">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-3 font-sans text-xs text-[#191817] focus:outline-none focus:border-[#191817]"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-3 font-sans text-xs text-[#191817] focus:outline-none focus:border-[#191817]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest py-3.5 flex items-center justify-center gap-2 shadow-md transition-colors mt-2 cursor-pointer"
          >
            <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
            <ArrowUpRight width={14} height={14} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#2C2A29]/15 text-center space-y-3">
          <p className="font-sans text-xs text-[#7A756F]">
            First time visiting the atelier?{' '}
            <Link to="/register" className="font-mono text-xs font-bold text-[#191817] underline hover:text-[#A66551]">
              Create Account
            </Link>
          </p>

          <HandwrittenNote
            text="“exclusive access to private studio previews”"
            color="text-[#A66551]"
            className="text-sm"
          />
        </div>
      </div>
    </main>
  );
};

export default Login;
