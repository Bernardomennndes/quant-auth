import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';

export function withSSRAuth<Props>(fn: GetServerSideProps<Props>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<Props>> => {
    const cookies = parseCookies(ctx);

    if (!cookies['quantauth.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'quantauth.token');
        destroyCookie(ctx, 'quantauth.refreshToken');
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
}
