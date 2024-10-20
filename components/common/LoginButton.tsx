import { useConfig } from '../../functions/useConfig';
import Link from 'next/link';

const LoginButton = () => {
  const { config } = useConfig();
  const { REDDIUM_CLIENT_ID, REDDIUM_DISABLE_LOGIN, REDDIUM_DOMAIN } = config;
  const REDIRECT_URI = `${REDDIUM_DOMAIN}/login`;

  if (REDDIUM_DISABLE_LOGIN) {
    return null;
  }

  return (
    <Link href={`https://www.reddit.com/api/v1/authorize.compact?client_id=${REDDIUM_CLIENT_ID}&response_type=code&state=testing&redirect_uri=${REDIRECT_URI}&duration=temporary&scope=${encodeURIComponent(
      "read vote save identity subscribe"
    )}`}>
      <button className="my-4 ml-4 p-1 px-3 text-sm cursor-pointer max-w-full btn-black text-white outline-1px rounded">
        Login
      </button>
    </Link>
  );
};

export default LoginButton;
