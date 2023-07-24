"poor man's use server";

import { getEdgeContext } from 'server-actions-for-next-pages/context';
import { wrapMethod } from './actions-node';

export const config = {
  runtime: 'edge',
};

export { wrapMethod };

export async function serverAction({}) {
  const { req, res } = await getEdgeContext();
  res?.headers.set('x-server-action', 'true');
  const url = req?.url;
  return { url };
}
