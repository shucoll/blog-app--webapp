import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../../../helpers/axios-orders';

import { useSnackbar } from 'notistack';

const ConfirmSignup = (props) => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (props.error) {
      enqueueSnackbar(props.error, { variant: 'error' });
      router.push('/auth/login');
    } else if (props.success) {
      enqueueSnackbar(
        'Email confirmation successful. Please login to continue',
        {
          variant: 'success',
        }
      );
      router.push('/auth/login');
    }
  }, [enqueueSnackbar, props.error, props.success, router]);

  return null;
};

export async function getServerSideProps({ query }) {
  const { token } = query;

  try {
    if (!token) {
      throw new Error('Invalid token, please try again with a valid token');
    }

    await axios.post(`/api/v1/users/confirmSignup/${token}`);

    return { props: { success: true } };
  } catch (error) {
    let errMessage;
    if (error.response) {
      errMessage = error.response.data.message;
    } else if (error.message) errMessage = error.message;
    else errMessage = 'Something went wrong, please try again later';

    return {
      props: { error: errMessage },
    };
  }
}

export default ConfirmSignup;
