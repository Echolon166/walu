import type { NextPage } from 'next';

import { Web3Address } from '@/components/Web3Address';
import { Web3Button } from '@/components/Web3Button';

const IndexPage: NextPage = () => (
  <>
    <Web3Button />
    <Web3Address />
  </>
);

export default IndexPage;
