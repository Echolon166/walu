import React from 'react';

import { useIsMounted } from '@/core/hooks/mounted';

import { AnchorLink } from './AnchorLink';

export const Logo: React.FC<React.SVGAttributes<{}>> = (props) => {
  const isMounted = useIsMounted();

  return (
    <AnchorLink
      href="/"
      className="flex w-28 outline-none sm:w-32 4xl:w-36"
      {...props}
    >
      <span className="relative flex overflow-hidden">
        {isMounted && <h1>Walu</h1>}
      </span>
    </AnchorLink>
  );
};
