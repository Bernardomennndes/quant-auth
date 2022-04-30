import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies } from 'nookies';

export function withSSRGuest<Props>(fn: GetServerSideProps<Props>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const cookies = parseCookies(ctx);

    if (cookies['quantauth.token']) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }

    return await fn(ctx);
  };
}
