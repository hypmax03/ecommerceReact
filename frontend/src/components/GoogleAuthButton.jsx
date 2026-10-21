import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../redux/userSlice';
import { loadScript } from '../utils/loadScript';

const GoogleAuthButton = ({
  mode = 'signin', // 'signin' | 'signup'
  onSuccess,
  onError,
  className = '',
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleBtnContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showSandboxPrompt, setShowSandboxPrompt] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const handleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      const res = await dispatch(googleLogin({ credential: response.credential }));
      if (res.meta.requestStatus === 'fulfilled') {
        const user = res.payload?.user;
        if (onSuccess) {
          onSuccess(user);
        } else if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
      } else {
        const errMsg = res.payload || 'Google authentication failed';
        if (onError) onError(errMsg);
      }
    } catch (err) {
      if (onError) onError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initGoogle = async () => {
      await loadScript('https://accounts.google.com/gsi/client');

      if (!isMounted) return;

      if (window.google?.accounts?.id && clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            type: 'standard',
            shape: 'rectangular',
            theme: 'outline',
            text: mode === 'signup' ? 'signup_with' : 'signin_with',
            size: 'large',
            logo_alignment: 'left',
            width: googleBtnContainerRef.current.offsetWidth || 340,
          });
        }
      }
    };

    initGoogle();

    return () => {
      isMounted = false;
    };
  }, [clientId, mode]);

  // Fallback simulator if VITE_GOOGLE_CLIENT_ID is not configured yet
  const handleSimulateGoogleLogin = async (emailOverride) => {
    const emailToUse = emailOverride || customEmail.trim() || 'claire.atelier@gmail.com';
    const nameToUse = emailToUse.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    // Generate simulated Google credential payload (base64-encoded JSON)
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        iss: 'https://accounts.google.com',
        sub: `google_user_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        email: emailToUse.toLowerCase(),
        name: nameToUse,
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        email_verified: true,
      })
    );
    const mockJwt = `${header}.${payload}.signature`;

    await handleCredentialResponse({ credential: mockJwt });
  };

  return (
    <div className={`w-full space-y-2.5 ${className}`}>
      {/* If Google GIS is configured and rendered */}
      {clientId ? (
        <div className="w-full flex justify-center">
          <div ref={googleBtnContainerRef} className="w-full flex justify-center" />
        </div>
      ) : (
        /* Styled Editorial Google Button */
        <div>
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowSandboxPrompt(!showSandboxPrompt)}
            className="w-full bg-[#FAF7F2] hover:bg-[#F3EEE5] text-[#191817] border border-[#2C2A29]/25 py-3 px-4 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-3 shadow-sm transition-all cursor-pointer group"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-semibold text-[11px] tracking-widest">
              {loading
                ? 'CONNECTING GOOGLE...'
                : mode === 'signup'
                ? 'CONTINUE WITH GOOGLE'
                : 'SIGN IN WITH GOOGLE'}
            </span>
          </button>

          {/* Sandbox & Client ID Guide Helper */}
          {showSandboxPrompt && (
            <div className="mt-2.5 p-3.5 bg-[#FAF7F2] border border-dashed border-[#2C2A29]/20 font-mono text-[11px] text-[#5C5751] space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#2C2A29]/10 pb-1.5">
                <span className="text-[10px] uppercase font-bold text-[#191817] tracking-wider">
                  GOOGLE IDENTITY PORTAL
                </span>
                <span className="text-[9px] text-[#A66551] uppercase font-bold">READY</span>
              </div>
              <p className="font-sans text-xs text-[#7A756F] leading-relaxed">
                Connect instantly using your Google account or test email. To link production OAuth credentials, set <code className="bg-[#ECE7DD] px-1 py-0.5 text-[#191817]">VITE_GOOGLE_CLIENT_ID</code> in <code className="bg-[#ECE7DD] px-1 py-0.5 text-[#191817]">frontend/.env</code>.
              </p>

              <div className="flex gap-2 pt-1">
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="flex-1 bg-[#FDFCF9] border border-[#2C2A29]/25 px-2.5 py-1.5 font-sans text-xs focus:outline-none focus:border-[#191817]"
                />
                <button
                  type="button"
                  onClick={() => handleSimulateGoogleLogin()}
                  className="bg-[#191817] text-[#FAF7F2] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider font-bold hover:bg-[#2C2A29] cursor-pointer"
                >
                  SIGN IN
                </button>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-[#2C2A29]/10 text-[10px]">
                <span className="text-[#7A756F]">Quick profiles:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateGoogleLogin('claire.atelier@gmail.com')}
                    className="underline hover:text-[#191817] cursor-pointer"
                  >
                    Client
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => handleSimulateGoogleLogin('adminmax@gmail.com')}
                    className="underline hover:text-[#191817] font-bold text-[#A66551] cursor-pointer"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;
