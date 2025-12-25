import axios from 'axios';
import { cookies } from 'next/headers';

export const checkServerSession = async () => {
  const cookieStore = await cookies();

  return axios.get(
    'https://notehub-api.goit.study/auth/session',
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      withCredentials: true,
    }
  );
};

