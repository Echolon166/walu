import { useEffect, useState } from 'react';

import { useWeb3Context } from '../web3';
import { getInstance, UniversalProfileSchema } from './schemas';
import { Profile } from './types';

export const useProfile = (address: string): [Profile] => {
  const [profile, setProfile] = useState<Profile>(new Profile('', ''));

  const { web3 } = useWeb3Context();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileInstance = getInstance(
          UniversalProfileSchema,
          address as string,
          web3?.currentProvider
        );

        const result = await profileInstance.fetchData('LSP3Profile');
        const profileData = result.value;

        setProfile(new Profile(address, profileData));
      } catch (e) {
        console.log('error', e);
      }
    };

    fetchProfile();
  }, [address]);

  return [profile];
};
