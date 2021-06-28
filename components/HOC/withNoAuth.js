import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import AuthContext from '../../store/auth-context';
import ScreenLoader from '../UI/ScreenLoader';

export default function NoAuthRoute({ noAuthRoutes, children }) {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const { loading, token } = authCtx;

  const noAuth = noAuthRoutes.indexOf(router.pathname) !== -1;

  useEffect(() => {
    if (!loading && token && noAuth) {
      router.push('/user/my-blogs');
    }
  }, [loading, token, noAuth]);

  if (token && noAuth) {
    return <ScreenLoader />;
  }

  return children;
}
