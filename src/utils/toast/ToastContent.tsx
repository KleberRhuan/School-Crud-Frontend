import toast, { Toast } from 'react-hot-toast';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

interface ToastContentProps {
  t: Toast;
  type: 'success' | 'error' | 'warning' | 'info';
  msg: string;
}

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColorMap = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

export function ToastContent({ t, type, msg }: ToastContentProps) {
  const Icon = iconMap[type];

  return (
    <div
      className={classNames(
        'flex items-center w-full max-w-xs p-4 mb-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300',
        colorMap[type],
        {
          'animate-enter': t.visible,
          'animate-leave': !t.visible,
        }
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        <Icon className={classNames('w-5 h-5', iconColorMap[type])} />
      </div>
      <div className="ml-3 text-sm font-medium flex-1">{msg}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-black hover:bg-opacity-10 inline-flex items-center justify-center h-8 w-8 transition-colors"
        onClick={() => toast.dismiss(t.id)}
        aria-label="Fechar"
      >
        <XMarkIcon className="w-3 h-3" />
      </button>
    </div>
  );
} 