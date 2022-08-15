import type { NextPage } from 'next';

import { Web3Address, Web3Button } from '@/components';

const IndexPage: NextPage = () => (
  <>
    <Web3Button />
    <Web3Address />
  </>
);

export default IndexPage;
