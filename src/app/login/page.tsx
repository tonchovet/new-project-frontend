/* ----------------------------------------------------------
 *  Minimal login page – uses Tailwind CSS + NextAuth hooks
 * ---------------------------------------------------------- */
'use client';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------------------
   *  While session data is loading, show a tiny spinner
   * ------------------------------------------------------------ */
  if (status === 'loading') {
    return <div className="h-screen flex items-center justify-center">Loading…</div>;
  }

  /* ------------------------------------------------------------
   *  If already signed in, redirect to the home page
   * ------------------------------------------------------------ */
  if (session?.user) {
    router.push('/');
    return null;
  }

  /* ------------------------------------------------------------
   *  Handle credentials (email/password) form submit
   * ------------------------------------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,   // We’ll redirect manually on success
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/');
    }
  };

  /* ------------------------------------------------------------
   *  Trigger Google OAuth flow
   * ------------------------------------------------------------ */
  const handleGoogle = () => {
    signIn('google');
  };

  /* ------------------------------------------------------------
   *  UI
   * ------------------------------------------------------------ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center justify-center">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-4 text-sm text-gray-500">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google OAuth button – you can replace this with an icon if you wish */}
        <div className="mt-4">
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center py-2 px-4 border rounded-md hover:bg-gray-50 transition-colors"
          >
            Sign in with Google
          </button>
        </div>

        {/* Optional “Register” link – create a /register page if you need it */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
