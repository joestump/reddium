import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { useAuth } from '../../contexts/AuthContext';

const LogoutPage = () => {
  const router = useRouter();
  const { setToken } = useAuth();

  useEffect(() => {
    const logout = async () => {
      destroyCookie(null, 'token', { path: '/' });
      setToken(null);
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/');
    };

    logout();
  }, [router, setToken]);

  return <div>Logging out...</div>;
};

export default LogoutPage;