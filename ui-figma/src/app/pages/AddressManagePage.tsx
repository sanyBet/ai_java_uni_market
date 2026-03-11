import { ChevronLeft, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import toast from 'react-hot-toast';

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: '1',
    name: '张三',
    phone: '138****8888',
    province: '浙江省',
    city: '杭州市',
    district: '西湖区',
    detail: '文三路XX号XX大厦XX室',
    isDefault: true,
  },
  {
    id: '2',
    name: '李四',
    phone: '139****9999',
    province: '浙江省',
    city: '杭州市',
    district: '滨江区',
    detail: '滨盛路XX号XX中心XX层',
    isDefault: false,
  },
];

export function AddressManagePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSelectMode = searchParams.get('select') === 'true';
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '浙江省',
    city: '杭州市',
    district: '西湖区',
    detail: '',
    isDefault: false,
  });

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success('默认地址设置成功');
  };

  const handleDelete = (id: string) => {
    if (addresses.length === 1) {
      toast.error('至少保留一个收货地址');
      return;
    }
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.success('地址删除成功');
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      isDefault: address.isDefault,
    });
    setShowAddForm(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      name: '',
      phone: '',
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
      detail: '',
      isDefault: false,
    });
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.detail) {
      toast.error('请填写完整信息');
      return;
    }

    if (editingAddress) {
      // 编辑
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addr, ...formData }
            : formData.isDefault
            ? { ...addr, isDefault: false }
            : addr
        )
      );
      toast.success('地址修改成功');
    } else {
      // 新增
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
      };
      
      if (formData.isDefault) {
        setAddresses([
          newAddress,
          ...addresses.map((addr) => ({ ...addr, isDefault: false })),
        ]);
      } else {
        setAddresses([...addresses, newAddress]);
      }
      toast.success('地址添加成功');
    }
    
    setShowAddForm(false);
  };

  const handleSelect = (address: Address) => {
    if (isSelectMode) {
      // 将选中的地址通过 state 传递回去
      navigate('/checkout', { state: { selectedAddress: address } });
    }
  };

  if (showAddForm) {
    return (
      <div className="bg-gray-50 min-h-screen pb-24">
        {/* Header */}
        <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b">
          <div className="flex items-center">
            <button onClick={() => setShowAddForm(false)}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="flex-1 text-lg font-semibold text-center">
              {editingAddress ? '编辑地址' : '新增地址'}
            </h1>
            <div className="w-6" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white mt-2 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">收货人</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入收货人姓名"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">手机号码</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入手机号码"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">所在地区</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option>浙江省</option>
                  <option>江苏省</option>
                  <option>上海市</option>
                </select>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option>杭州市</option>
                  <option>宁波市</option>
                  <option>温州市</option>
                </select>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option>西湖区</option>
                  <option>滨江区</option>
                  <option>余杭区</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">详细地址</label>
              <textarea
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                placeholder="街道、楼牌号等"
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-800">设为默认地址</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  formData.isDefault ? 'bg-red-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    formData.isDefault ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 bg-red-500 text-white rounded-full font-medium"
          >
            保存
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-lg font-semibold text-center">
            {isSelectMode ? '选择收货地址' : '收货地址'}
          </h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Address List */}
      <div className="mt-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            onClick={() => handleSelect(address)}
            className={`bg-white mb-2 p-4 ${isSelectMode ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{address.name}</span>
                  <span className="text-gray-600">{address.phone}</span>
                  {address.isDefault && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-500 text-xs rounded">
                      默认
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {address.province}
                  {address.city}
                  {address.district}
                  {address.detail}
                </p>
                
                {!isSelectMode && (
                  <div className="flex gap-4 text-sm">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-gray-600"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-gray-600"
                    >
                      删除
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-red-500"
                      >
                        设为默认
                      </button>
                    )}
                  </div>
                )}
              </div>
              {isSelectMode && (
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    address.isDefault ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {address.isDefault && (
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Button */}
      <button
        onClick={handleAddNew}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[350px] max-w-[calc(100%-32px)] py-3 bg-red-500 text-white rounded-full font-medium flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        新增收货地址
      </button>
    </div>
  );
}