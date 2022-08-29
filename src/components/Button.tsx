import classNames from 'classnames';
import { forwardRef, useImperativeHandle, useRef } from 'react';

type ShapeNames = 'rounded' | 'pill' | 'circle';
type VariantNames = 'ghost' | 'solid' | 'transparent';
type ColorNames =
  | 'primary'
  | 'white'
  | 'gray'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';
type SizeNames = 'large' | 'medium' | 'small' | 'mini';

const shapes: Record<ShapeNames, string[]> = {
  rounded: ['rounded-md sm:rounded-lg'],
  pill: ['rounded-full'],
  circle: ['rounded-full'],
};
const variants: Record<VariantNames, string[]> = {
  ghost: ['bg-transparent'],
  solid: ['text-white'],
  transparent: ['bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800'],
};
const colors: Record<ColorNames, string[]> = {
  primary: ['text-brand', 'bg-brand', 'border-brand'],
  white: ['text-gray-900', 'bg-white', 'border-white'],
  gray: ['text-gray-900', 'bg-gray-100', 'border-gray-100'],
  success: ['text-green-500', 'bg-green-500', 'border-green-500'],
  info: ['text-blue-500', 'bg-blue-500', 'border-blue-500'],
  warning: ['text-yellow-500', 'bg-yellow-500', 'border-yellow-500'],
  danger: ['text-red-500', 'bg-red-500', 'border-red-500'],
};
const sizes: Record<SizeNames, string[]> = {
  large: ['px-7 sm:px-9 h-11 sm:h-13', 'w-11 h-11 sm:w-13 sm:h-13'],
  medium: ['px-5 sm:px-8 h-10 sm:h-12', 'h-10 w-10 sm:w-12 sm:h-12'],
  small: ['px-7 h-10', 'w-10 h-10'],
  mini: ['px-4 h-8', 'w-8 h-8'],
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  disabled?: boolean;
  shape?: ShapeNames;
  variant?: VariantNames;
  color?: ColorNames;
  size?: SizeNames;
  fullWidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      isLoading,
      disabled,
      fullWidth,
      shape = 'pill',
      variant = 'solid',
      color = 'primary',
      size = 'medium',
      onClick,
      ...buttonProps
    },
    ref: React.Ref<HTMLButtonElement | null>
  ) => {
    const colorClassNames = colors[color];
    const sizeClassNames = sizes[size];
    const buttonRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => buttonRef.current);
    const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onClick && onClick(event);
    };

    let buttonColorClassNames = '';
    switch (variant) {
      case 'ghost':
        buttonColorClassNames = `border-2 border-solid ${colorClassNames[0]} ${colorClassNames[2]}`;
        break;

      case 'transparent':
        buttonColorClassNames = `${colorClassNames[0]} ${
          disabled || isLoading
            ? ''
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800'
        } `;
        break;

      default:
        buttonColorClassNames = `${colorClassNames[1]} ${colorClassNames[2]}`;
        break;
    }

    return (
      <button
        ref={buttonRef}
        onClick={clickHandler}
        className={classNames(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden text-center text-xs font-medium tracking-wider outline-none transition-all sm:text-sm',
          !disabled
            ? buttonColorClassNames
            : 'cursor-not-allowed bg-gray-100 text-gray-400',
          disabled || isLoading || variant === 'transparent'
            ? ''
            : 'hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none',
          isLoading && 'pointer-events-auto cursor-default focus:outline-none',
          fullWidth && 'w-full',
          color === 'white' || color === 'gray'
            ? 'text-gray-900 dark:text-white'
            : variants[variant],
          shapes[shape],
          shape === 'circle' ? `${sizeClassNames[1]}` : `${sizeClassNames[0]}`,
          className
        )}
        disabled={disabled}
        {...buttonProps}
      >
        <span className={classNames(isLoading && 'invisible opacity-0')}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
