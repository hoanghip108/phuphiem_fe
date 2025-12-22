'use client';

import { useState, useEffect } from 'react';
import type { UserDetail, UpdateUserDetailDto, Province, District, Ward } from '@/lib/api';
import { getProvinces, getDistrictsByProvince, getWardsByDistrict } from '@/lib/api';

interface UpdateAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateUserDetailDto) => Promise<void>;
  userDetail: UserDetail | null;
}

export default function UpdateAddressModal({
  isOpen,
  onClose,
  onSave,
  userDetail,
}: UpdateAddressModalProps) {
  const [formData, setFormData] = useState<UpdateUserDetailDto>({
    provinceId: undefined,
    districtId: undefined,
    wardId: undefined,
    address: '',
  });
  
  // Dropdown data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  
  // Loading states
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserDetailDto, string>>>({});
  const [saving, setSaving] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    if (isOpen) {
      setLoadingProvinces(true);
      getProvinces()
        .then((data) => setProvinces(data))
        .catch((error) => {
          console.error('Error loading provinces:', error);
          setErrors((prev) => ({ ...prev, provinceId: 'Không thể tải danh sách tỉnh/thành phố' }));
        })
        .finally(() => setLoadingProvinces(false));
    }
  }, [isOpen]);

  // Load districts when province changes
  useEffect(() => {
    if (!formData.provinceId) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const selectedProvince = provinces.find((p) => p.id === formData.provinceId);
    if (!selectedProvince) return;

    setLoadingDistricts(true);
    getDistrictsByProvince(selectedProvince.code)
      .then((data) => setDistricts(data))
      .catch((error) => {
        console.error('Error loading districts:', error);
        setErrors((prev) => ({ ...prev, districtId: 'Không thể tải danh sách quận/huyện' }));
      })
      .finally(() => setLoadingDistricts(false));
  }, [formData.provinceId, provinces]);

  // Load wards when district changes
  useEffect(() => {
    if (!formData.districtId) {
      setWards([]);
      return;
    }

    const selectedDistrict = districts.find((d) => d.id === formData.districtId);
    if (!selectedDistrict) return;

    setLoadingWards(true);
    getWardsByDistrict(selectedDistrict.code)
      .then((data) => setWards(data))
      .catch((error) => {
        console.error('Error loading wards:', error);
        setErrors((prev) => ({ ...prev, wardId: 'Không thể tải danh sách phường/xã' }));
      })
      .finally(() => setLoadingWards(false));
  }, [formData.districtId, districts]);

  useEffect(() => {
    if (isOpen) {
      if (userDetail) {
        // Cập nhật: điền dữ liệu hiện có
        setFormData({
          provinceId: userDetail.provinceId,
          districtId: userDetail.districtId,
          wardId: userDetail.wardId,
          address: userDetail.address || '',
        });
      } else {
        // Tạo mới: reset form về trống
        setFormData({
          provinceId: undefined,
          districtId: undefined,
          wardId: undefined,
          address: '',
        });
      }
      setErrors({});
    }
  }, [userDetail, isOpen]);

  const handleProvinceChange = (value: string) => {
    const provinceId = value ? Number(value) : undefined;
    setFormData((prev) => ({
      ...prev,
      provinceId,
      districtId: undefined, // Reset district
      wardId: undefined, // Reset ward
    }));
    if (errors.provinceId) {
      setErrors((prev) => ({ ...prev, provinceId: undefined }));
    }
  };

  const handleDistrictChange = (value: string) => {
    const districtId = value ? Number(value) : undefined;
    setFormData((prev) => ({
      ...prev,
      districtId,
      wardId: undefined, // Reset ward
    }));
    if (errors.districtId) {
      setErrors((prev) => ({ ...prev, districtId: undefined }));
    }
  };

  const handleWardChange = (value: string) => {
    const wardId = value ? Number(value) : undefined;
    setFormData((prev) => ({ ...prev, wardId }));
    if (errors.wardId) {
      setErrors((prev) => ({ ...prev, wardId: undefined }));
    }
  };

  const handleAddressChange = (value: string) => {
    setFormData((prev) => ({ ...prev, address: value }));
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateUserDetailDto, string>> = {};

    if (!formData.provinceId) {
      newErrors.provinceId = 'Vui lòng chọn tỉnh/thành phố';
    }
    if (!formData.districtId) {
      newErrors.districtId = 'Vui lòng chọn quận/huyện';
    }
    if (!formData.wardId) {
      newErrors.wardId = 'Vui lòng chọn phường/xã';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ chi tiết';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      // Lấy tên của province, district, ward để gửi lên backend
      const selectedProvince = provinces.find((p) => p.id === formData.provinceId);
      const selectedDistrict = districts.find((d) => d.id === formData.districtId);
      const selectedWard = wards.find((w) => w.id === formData.wardId);

      await onSave({
        ...formData,
        province: selectedProvince?.name,
        district: selectedDistrict?.name,
        ward: selectedWard?.name,
      });
      onClose();
    } catch (error) {
      console.error('Error updating address:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {userDetail ? 'Cập nhật địa chỉ' : 'Thêm mới địa chỉ'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
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
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Province */}
              <div>
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tỉnh / Thành phố <span className="text-red-500">*</span>
                </label>
                <select
                  id="province"
                  value={formData.provinceId || ''}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  disabled={loadingProvinces}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                    errors.provinceId
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-rose-500'
                  } ${loadingProvinces ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                >
                  <option value="">-- Chọn tỉnh/thành phố --</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.provinceId && (
                  <p className="mt-1 text-xs text-red-600">{errors.provinceId}</p>
                )}
              </div>

              {/* District */}
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quận / Huyện <span className="text-red-500">*</span>
                </label>
                <select
                  id="district"
                  value={formData.districtId || ''}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!formData.provinceId || loadingDistricts}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                    errors.districtId
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-rose-500'
                  } ${!formData.provinceId || loadingDistricts ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                >
                  <option value="">-- Chọn quận/huyện --</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.districtId && (
                  <p className="mt-1 text-xs text-red-600">{errors.districtId}</p>
                )}
              </div>

              {/* Ward */}
              <div>
                <label
                  htmlFor="ward"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phường / Xã <span className="text-red-500">*</span>
                </label>
                <select
                  id="ward"
                  value={formData.wardId || ''}
                  onChange={(e) => handleWardChange(e.target.value)}
                  disabled={!formData.districtId || loadingWards}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                    errors.wardId
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-rose-500'
                  } ${!formData.districtId || loadingWards ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                >
                  <option value="">-- Chọn phường/xã --</option>
                  {wards.map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.name}
                    </option>
                  ))}
                </select>
                {errors.wardId && (
                  <p className="mt-1 text-xs text-red-600">{errors.wardId}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Địa chỉ chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  rows={3}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                    errors.address
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-rose-500'
                  }`}
                  placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, ...)"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
