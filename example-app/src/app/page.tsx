'use client';

import { edgeServerAction } from '@/pages/api/actions-edge';
import { createUser, failingFunction } from '@/pages/api/actions-node';
import { useEffect, useState } from 'react';

export default function Home() {
  // throw new Error('This function fails');
  failingFunction({}).catch((error: any) => {
    console.error(error);
    return null;
  });
  const [state, setState] = useState();
  useEffect(() => {
    Promise.allSettled([
      edgeServerAction('home'),
      createUser({ name: 'test' }),
      failingFunction({}).catch((error: any) => {
        return { error };
        return null;
      }),
    ]).then((x) => setState(x as any));
  }, []);
  return (
    <div className='bg-gray-100 text-gray-800 flex flex-col items-center p-10'>
      <pre className='overflow-scroll'>
        {JSON.stringify(state || null, null, 2)}
      </pre>
    </div>
  );
}
