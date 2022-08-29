import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import useClickAway from 'react-use/lib/useClickAway';

import { useBreakpoint } from '@/core/hooks/breakpoint';
import { useIsMounted } from '@/core/hooks/mounted';

import { TabItem, TabPanels } from './Tab';

type TabMenuItem = {
  title: React.ReactNode;
  path: string;
};

type Props = {
  children?: ReactNode;
  tabMenu: TabMenuItem[];
};

export default function TabParam({ tabMenu, children }: Props) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const dropdownEl = useRef<HTMLDivElement>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [visibleMobileMenu, setVisibleMobileMenu] = useState(false);

  function handleTabChange(index: number) {
    router.push(
      { pathname: router.pathname, query: { view: tabMenu[index]?.path } },
      undefined,
      { scroll: false, shallow: true }
    );
  }

  useEffect(() => {
    if (router?.query?.view) {
      setSelectedTabIndex(
        tabMenu.findIndex((item) => router.query.view === item.path)
      );
    }
  }, [router.query]);

  useClickAway(dropdownEl, () => {
    setVisibleMobileMenu(false);
  });

  return (
    <Tab.Group
      selectedIndex={selectedTabIndex}
      onChange={(index) => handleTabChange(index)}
    >
      <Tab.List className="relative mb-6 bg-body text-sm uppercase before:absolute before:left-0 before:bottom-0 before:w-full before:rounded-sm before:bg-gray-200 dark:bg-dark dark:before:bg-gray-800 sm:gap-8 sm:rounded-none md:before:h-0.5">
        {isMounted && ['xs', 'sm'].indexOf(breakpoint) !== -1 ? (
          <div
            ref={dropdownEl}
            className="rounded-lg border-2 border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => setVisibleMobileMenu(!visibleMobileMenu)}
              className="flex w-full items-center justify-between py-2.5 px-4 uppercase text-gray-400 dark:text-gray-300 sm:px-5 sm:py-3.5"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {tabMenu[selectedTabIndex]?.title}
              </span>
            </button>
            <div
              className={classNames(
                'absolute top-full left-0 z-10 mt-1 grid w-full gap-0.5 rounded-lg border border-gray-200 bg-white p-2 text-left shadow-large dark:border-gray-700 dark:bg-gray-800 xs:gap-1',
                visibleMobileMenu
                  ? 'visible opacity-100'
                  : 'invisible opacity-0'
              )}
            >
              {tabMenu.map((item) => (
                <div
                  key={item.path}
                  onClick={() => setVisibleMobileMenu(false)}
                  className="w-full"
                >
                  <TabItem className="w-full">{item.title}</TabItem>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-6 md:gap-8 xl:gap-10 3xl:gap-12">
            {tabMenu.map((item) => (
              <TabItem key={item.path}>{item.title}</TabItem>
            ))}
          </div>
        )}
      </Tab.List>
      <TabPanels>{children}</TabPanels>
    </Tab.Group>
  );
}
