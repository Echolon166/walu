import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useState } from 'react';

type Props = {
  button: ReactNode;
  panel: ReactNode;
  mainClassName?: string;
  buttonClassName?: string;
  panelClassName?: string;
};

export default function Disclosure({
  button,
  panel,
  mainClassName = '',
  buttonClassName = '',
  panelClassName = '',
}: Props) {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <div className={mainClassName}>
      <div className={buttonClassName} onClick={() => setIsExpand(!isExpand)}>
        {button}
      </div>
      <AnimatePresence initial={false}>
        {isExpand && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div
              className={classNames(
                'border-t border-dashed border-gray-200 dark:border-gray-700',
                panelClassName
              )}
            >
              {panel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
