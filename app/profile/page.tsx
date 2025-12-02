'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  getCurrentUser,
  updateActiveUserDetail,
  UserDetail,
} from '@/lib/api';

interface UserProfileResponse {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  fullName: string;
  email: string;
  password?: string;
  role?: string;
  userDetails?: UserDetail[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
  const [activeDetailId, setActiveDetailId] = useState<number | null>(null);
  const tokenRef = useRef<string | null>(null);

  const fetchProfile = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!tokenRef.current) return;
      if (!options?.silent) {
        setLoading(true);
      }
      try {
        const profile = await getCurrentUser(tokenRef.current);
        setUser(profile);
        const active = profile.userDetails?.find((detail) => detail.isActive);
        setActiveDetailId(active?.id ?? null);
        setSelectedDetailId(active?.id ?? null);
        setError('');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Không thể tải thông tin người dùng.');
        }
        setUser(null);
      } finally {
        if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    tokenRef.current = localStorage.getItem('accessToken');
    if (!tokenRef.current) {
      setLoading(false);
      setError('Bạn chưa đăng nhập.');
      return;
    }

    fetchProfile();
  }, [fetchProfile]);

  const handleSaveActiveDetail = async () => {
    if (
      !tokenRef.current ||
      selectedDetailId === null ||
      selectedDetailId === activeDetailId
    ) {
      return;
    }

    setSaving(true);
    try {
      await updateActiveUserDetail(selectedDetailId, tokenRef.current);
      await fetchProfile({ silent: true });
      setActiveDetailId(selectedDetailId);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể cập nhật địa chỉ mặc định.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <p className="text-sm text-gray-600">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-700">
            {error || (
              <>
                Bạn chưa đăng nhập.{' '}
                <Link
                  href="/login"
                  className="font-medium text-rose-600 hover:text-rose-500"
                >
                  Đăng nhập
                </Link>{' '}
                để xem thông tin tài khoản.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h1 className="text-2xl font-semibold text-gray-900">
            Thông tin tài khoản
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Dữ liệu được đồng bộ từ backend.
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoRow label="Họ và tên" value={user.fullName} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow
              label="Ngày tạo"
              value={formatDate(user.createdAt) || '—'}
            />
            <InfoRow
              label="Cập nhật lần cuối"
              value={formatDate(user.updatedAt) || '—'}
            />
          </dl>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Địa chỉ & liên hệ
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Danh sách thông tin chi tiết (userDetails)
              </p>
            </div>
          </div>

          {user.userDetails && user.userDetails.length > 0 ? (
            <>
              <div className="mt-6 space-y-4">
                {([...user.userDetails].sort((a, b) => {
                  const aActive = a.isActive ? 1 : 0;
                  const bActive = b.isActive ? 1 : 0;
                  return bActive - aActive || a.id - b.id;
                }) as UserDetail[]).map((detail) => (
                  <div
                    key={detail.id}
                    onClick={() => setSelectedDetailId(detail.id)}
                    className={`cursor-pointer rounded-xl border p-6 transition-shadow ${
                      detail.isActive
                        ? 'border-emerald-400 bg-emerald-50/70 shadow-sm'
                        : 'border-gray-100 bg-gray-50/70 hover:border-rose-200 hover:bg-white'
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                            selectedDetailId === detail.id
                              ? 'border-rose-600 bg-rose-600'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {selectedDetailId === detail.id && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            Địa chỉ #{detail.id}
                          </p>
                          {(detail.isActive ||
                            selectedDetailId === detail.id) && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                                selectedDetailId === detail.id
                                  ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/30'
                                  : 'bg-gray-200 text-gray-700 ring-gray-300'
                              }`}
                            >
                              {detail.isActive && detail.id === selectedDetailId
                                ? 'Mặc định'
                                : detail.isActive
                                ? 'Hiện tại'
                                : selectedDetailId === detail.id
                                ? 'Sẽ đặt'
                                : 'Dự phòng'}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(detail.updatedAt) ||
                          formatDate(detail.createdAt) ||
                          ''}
                      </p>
                    </div>
                  <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoRow
                      label="Số điện thoại"
                      value={detail.phoneNumber || 'Chưa cập nhật'}
                    />
                    <InfoRow
                      label="Tỉnh / Thành phố"
                      value={detail.province || 'Chưa cập nhật'}
                    />
                    <InfoRow
                      label="Quận / Huyện"
                      value={detail.district || 'Chưa cập nhật'}
                    />
                    <InfoRow
                      label="Phường / Xã"
                      value={detail.ward || 'Chưa cập nhật'}
                    />
                    <InfoRow
                      label="Địa chỉ chi tiết"
                      value={detail.address || 'Chưa cập nhật'}
                      spanFull
                    />
                  </dl>
                </div>
              ))}
              </div>
              {selectedDetailId !== null &&
                selectedDetailId !== activeDetailId && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveActiveDetail}
                      disabled={saving}
                      className="inline-flex items-center rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                )}
            </>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-500">
                Chưa có thông tin chi tiết. Bạn có thể cập nhật sau.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return undefined;
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

function InfoRow({
  label,
  value,
  spanFull = false,
}: {
  label: string;
  value?: string | number | null;
  spanFull?: boolean;
}) {
  return (
    <div className={spanFull ? 'md:col-span-2' : undefined}>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{value ?? '—'}</dd>
    </div>
  );
}

