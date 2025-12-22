'use client';

import { validatePassword } from '@/lib/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  show: boolean;
}

export default function PasswordStrengthIndicator({
  password,
  show,
}: PasswordStrengthIndicatorProps) {
  if (!show) return null;

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const validation = validatePassword(password);
  const allValid = validation.isValid;

  return (
    <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3">
      <p className="mb-2 text-xs font-semibold text-gray-700">
        Yêu cầu mật khẩu:
      </p>
      <ul className="space-y-1">
        <RequirementItem
          met={hasMinLength}
          text="Tối thiểu 8 ký tự"
        />
        <RequirementItem
          met={hasLetter}
          text="Có ít nhất một chữ cái"
        />
        <RequirementItem
          met={hasNumber}
          text="Có ít nhất một chữ số"
        />
      </ul>
      {allValid && (
        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-semibold">Mật khẩu đủ mạnh</span>
        </div>
      )}
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      {met ? (
        <svg
          className="h-4 w-4 flex-shrink-0 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 flex-shrink-0 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      <span className={met ? 'text-gray-700' : 'text-gray-500'}>{text}</span>
    </li>
  );
}

