import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

const VIEWS = { SIGN_IN: 'sign_in', SIGN_UP: 'sign_up', FORGOT: 'forgot', VERIFY: 'verify' };

export default function AuthModal({ onClose }) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [view, setView]         = useState(VIEWS.SIGN_IN);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [info, setInfo]         = useState('');
  const [busy, setBusy]         = useState(false);
  const overlayRef              = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function reset() { setError(''); setInfo(''); }

  async function handleSignIn(e) {
    e.preventDefault();
    reset();
    setBusy(true);
    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) { setError(err.message); return; }
    onClose();
  }

  async function handleSignUp(e) {
    e.preventDefault();
    reset();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    setBusy(true);
    const { error: err } = await signUp(email, password);
    setBusy(false);
    if (err) { setError(err.message); return; }
    setView(VIEWS.VERIFY);
  }

  async function handleForgot(e) {
    e.preventDefault();
    reset();
    setBusy(true);
    const { error: err } = await resetPassword(email);
    setBusy(false);
    if (err) { setError(err.message); return; }
    setInfo('Password reset email sent. Check your inbox.');
  }

  const titles = {
    [VIEWS.SIGN_IN]: 'Sign in',
    [VIEWS.SIGN_UP]: 'Create account',
    [VIEWS.FORGOT]:  'Reset password',
    [VIEWS.VERIFY]:  'Check your email',
  };

  return (
    <div
      className="auth-overlay"
      ref={overlayRef}
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="auth-modal" role="dialog" aria-modal="true" aria-label={titles[view]}>
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>

        <div className="auth-logo">UWCompass</div>
        <h2 className="auth-title">{titles[view]}</h2>

        {view === VIEWS.VERIFY ? (
          <div className="auth-verify">
            <div className="auth-verify-icon">✉️</div>
            <p>We sent a confirmation link to <strong>{email}</strong>.</p>
            <p className="auth-verify-sub">Click the link in the email to activate your account, then sign in.</p>
            <button className="auth-btn auth-btn-primary" onClick={() => { setView(VIEWS.SIGN_IN); reset(); }}>
              Back to Sign In
            </button>
          </div>
        ) : view === VIEWS.SIGN_IN ? (
          <form onSubmit={handleSignIn} noValidate>
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-btn auth-btn-primary" type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
            <button
              type="button"
              className="auth-link"
              onClick={() => { setView(VIEWS.FORGOT); reset(); }}
            >
              Forgot password?
            </button>
            <div className="auth-divider" />
            <p className="auth-switch">
              Don&apos;t have an account?{' '}
              <button type="button" className="auth-link-inline" onClick={() => { setView(VIEWS.SIGN_UP); reset(); }}>
                Sign up
              </button>
            </p>
          </form>
        ) : view === VIEWS.SIGN_UP ? (
          <form onSubmit={handleSignUp} noValidate>
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label className="auth-label">Confirm password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-btn auth-btn-primary" type="submit" disabled={busy}>
              {busy ? 'Creating account…' : 'Create account'}
            </button>
            <div className="auth-divider" />
            <p className="auth-switch">
              Already have an account?{' '}
              <button type="button" className="auth-link-inline" onClick={() => { setView(VIEWS.SIGN_IN); reset(); }}>
                Sign in
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgot} noValidate>
            <p className="auth-forgot-desc">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            {error && <p className="auth-error">{error}</p>}
            {info  && <p className="auth-info">{info}</p>}
            <button className="auth-btn auth-btn-primary" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send reset link'}
            </button>
            <button
              type="button"
              className="auth-link"
              onClick={() => { setView(VIEWS.SIGN_IN); reset(); }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
