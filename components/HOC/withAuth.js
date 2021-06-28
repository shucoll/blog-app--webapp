import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import AuthContext from '../../store/auth-context';
import ScreenLoader from '../UI/ScreenLoader';

export default function PrivateRoute({ protectedRoutes, children }) {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const { authenticating, token } = authCtx;

  const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

  useEffect(() => {
    if (!authenticating && !token && pathIsProtected) {
      router.push('/auth/login');
    }
  }, [authenticating, token, pathIsProtected]);

  if (!token && pathIsProtected) {
    return <ScreenLoader />;
  }

  return children;
}
