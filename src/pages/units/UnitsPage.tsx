import React, { useState, useMemo } from 'react';
import {
  Building,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  LayoutGrid,
  List,
  Edit,
  Trash2,
  Eye,
  X,
  Check,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Unit, UnitStatus } from '../../types';
import { formatCurrency, exportToCSV } from '../../lib/utils';
import { Badge, getUnitStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';

export const UnitsPage: React.FC = () => {
  const { units, addUnit, updateUnit, deleteUnit, activeRole, navigateTo, addToast } = useApp();

  const isAdmin = activeRole === 'admin';

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(60000);

  // View Mode: 'card' or 'table'
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Add/Edit Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State for Add / Edit
  const [unitForm, setUnitForm] = useState({
    unitNumber: '',
    building: 'A' as 'A' | 'B',
    floor: 3,
    roomType: '1 Bedroom' as Unit['roomType'],
    sizeSqm: 35.0,
    bedrooms: 1,
    bathrooms: 1,
    rentPrice: 15000,
    commonFee: 1750,
    status: 'vacant' as UnitStatus,
    description: '',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    features: ['เฟอร์นิเจอร์ครบ', 'แอร์ Inverter', 'เครื่องทำน้ำอุ่น'],
  });

  // Filtered List
  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchSearch =
        unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBuilding = selectedBuilding === 'all' || unit.building === selectedBuilding;
      const matchFloor = selectedFloor === 'all' || unit.floor === Number(selectedFloor);
      const matchStatus = selectedStatus === 'all' || unit.status === selectedStatus;
      const matchType = selectedType === 'all' || unit.roomType === selectedType;
      const matchPrice = unit.rentPrice <= priceRange;

      return matchSearch && matchBuilding && matchFloor && matchStatus && matchType && matchPrice;
    });
  }, [units, searchTerm, selectedBuilding, selectedFloor, selectedStatus, selectedType, priceRange]);

  // Paginated List
  const totalPages = Math.ceil(filteredUnits.length / pageSize) || 1;
  const paginatedUnits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUnits.slice(start, start + pageSize);
  }, [filteredUnits, currentPage, pageSize]);

  // Reset Filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedBuilding('all');
    setSelectedFloor('all');
    setSelectedStatus('all');
    setSelectedType('all');
    setPriceRange(60000);
    setCurrentPage(1);
  };

  // Add Unit Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addUnit(unitForm);
    if (success) {
      setIsAddModalOpen(false);
      resetUnitForm();
    }
  };

  // Edit Unit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit) return;
    const success = await updateUnit(editingUnit.id, unitForm);
    if (success) {
      setEditingUnit(null);
    }
  };

  // Open Edit Modal
  const openEditModal = (unit: Unit) => {
    setEditingUnit(unit);
    setUnitForm({
      unitNumber: unit.unitNumber,
      building: unit.building,
      floor: unit.floor,
      roomType: unit.roomType,
      sizeSqm: unit.sizeSqm,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      rentPrice: unit.rentPrice,
      commonFee: unit.commonFee,
      status: unit.status,
      description: unit.description,
      images: unit.images,
      features: unit.features || [],
    });
  };

  const resetUnitForm = () => {
    setUnitForm({
      unitNumber: '',
      building: 'A',
      floor: 3,
      roomType: '1 Bedroom',
      sizeSqm: 35.0,
      bedrooms: 1,
      bathrooms: 1,
      rentPrice: 15000,
      commonFee: 1750,
      status: 'vacant',
      description: '',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
      features: ['เฟอร์นิเจอร์ครบ', 'แอร์ Inverter', 'เครื่องทำน้ำอุ่น'],
    });
  };

  // Delete Unit Confirm
  const handleDeleteConfirm = async () => {
    if (!unitToDelete) return;
    setIsDeleting(true);
    const res = await deleteUnit(unitToDelete.id);
    setIsDeleting(false);
    if (res.success) {
      setUnitToDelete(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const exportData = filteredUnits.map(u => ({
      'Unit ID': u.id,
      'เลขห้อง': u.unitNumber,
      'อาคาร': u.building,
      'ชั้น': u.floor,
      'ประเภทห้อง': u.roomType,
      'ขนาด (ตร.ม.)': u.sizeSqm,
      'ห้องนอน': u.bedrooms,
      'ห้องน้ำ': u.bathrooms,
      'ราคาเช่า (บาท)': u.rentPrice,
      'ค่าส่วนกลาง (บาท)': u.commonFee,
      'สถานะ': u.status,
      'เจ้าของห้อง': u.ownerName || '-',
      'ผู้เช่าปัจจุบัน': u.currentTenantName || '-',
    }));
    exportToCSV(`CondoFlow_Units_${new Date().toISOString().slice(0, 10)}`, exportData);
    addToast('success', 'ส่งออกข้อมูล CSV สำเร็จ');
  };

  // Mock Import CSV
  const handleImportMockCSV = () => {
    const mockNewUnitNumber = `A-${Math.floor(10 + Math.random() * 6)}${String(Math.floor(1 + Math.random() * 8)).padStart(2, '0')}`;
    addUnit({
      unitNumber: mockNewUnitNumber,
      building: 'A',
      floor: 10,
      roomType: '1 Bedroom',
      sizeSqm: 36.5,
      bedrooms: 1,
      bathrooms: 1,
      rentPrice: 16000,
      commonFee: 1800,
      status: 'vacant',
      description: 'ห้องนำเข้าจำลองจากระบบ CSV ภายนอก พร้อมอยู่',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
      features: ['Imported via CSV', 'Fully Furnished'],
    });
    addToast('success', 'นำเข้าข้อมูล Mock CSV สำเร็จ', `เพิ่มห้องชุด ${mockNewUnitNumber} เข้าระบบแล้ว`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            {isAdmin ? 'จัดการข้อมูลห้องชุดในโครงการ' : 'ค้นหาและเลือกดูห้องชุด (Unit Catalog)'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'เพิ่ม แก้ไข ลบ ตรวจสอบสถานะ และออกรายงานห้องชุดทั้งหมด 20 ยูนิต'
              : 'เลือกดูห้องชุดที่ว่างสำหรับเช่า พร้อมรายละเอียดสิ่งอำนวยความสะดวก'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <>
              <button
                onClick={handleImportMockCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="จำลองการนำเข้าไฟล์ CSV"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Import Mock CSV</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => {
                  resetUnitForm();
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มห้องชุดใหม่</span>
              </button>
            </>
          )}

          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-xl p-1 border border-slate-300 dark:border-slate-700 ml-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาเลขห้อง (เช่น A-1205)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Building Filter */}
          <div>
            <select
              value={selectedBuilding}
              onChange={e => {
                setSelectedBuilding(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
            >
              <option value="all">อาคารทั้งหมด (A & B)</option>
              <option value="A">อาคาร A</option>
              <option value="B">อาคาร B</option>
            </select>
          </div>

          {/* Room Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={e => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
            >
              <option value="all">ทุกประเภทห้องชุด</option>
              <option value="Studio">Studio</option>
              <option value="1 Bedroom">1 Bedroom</option>
              <option value="2 Bedroom">2 Bedroom</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
            >
              <option value="all">ทุกสถานะห้อง</option>
              <option value="vacant">ว่าง (Vacant)</option>
              <option value="occupied">มีผู้เช่า (Occupied)</option>
              <option value="pending_move_in">รอเข้าอยู่ (Pending Move-in)</option>
              <option value="under_repair">อยู่ระหว่างซ่อม (Under Repair)</option>
              <option value="renovating">ปิดปรับปรุง (Renovating)</option>
            </select>
          </div>

          {/* Clear Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearFilters}
              className="w-full py-2 px-3 rounded-xl text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-3">
            <span>งบค่าเช่าสูงสุด: <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(priceRange)}/เดือน</strong></span>
            <input
              type="range"
              min={10000}
              max={60000}
              step={2000}
              value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              className="w-36 sm:w-56 accent-brand-600"
            />
          </div>
          <div className="text-slate-400">
            พบห้องชุดตรงตามเงื่อนไข: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{filteredUnits.length}</strong> จาก {units.length} ยูนิต
          </div>
        </div>
      </div>

      {/* Main Units Content: Card View vs Table View */}
      {filteredUnits.length === 0 ? (
        <EmptyState
          title="ไม่พบห้องชุดที่ตรงกับเงื่อนไข"
          description="ลองปรับเปลี่ยนตัวกรองค้นหา หรือกดปุ่มล้างตัวกรองเพื่อดูห้องชุดทั้งหมด"
          action={
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white shadow"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          }
        />
      ) : viewMode === 'card' ? (
        /* Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginatedUnits.map(unit => (
            <div
              key={unit.id}
              className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-brand-500/50 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image & Status Badge */}
                <div className="relative h-44 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => navigateTo(`/units/${unit.id}`)}>
                  <img
                    src={unit.images[0]}
                    alt={unit.unitNumber}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    {getUnitStatusBadge(unit.status)}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    อาคาร {unit.building} • ชั้น {unit.floor}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h3
                        onClick={() => navigateTo(`/units/${unit.id}`)}
                        className="font-bold text-lg text-slate-900 dark:text-white font-heading hover:text-brand-600 transition-colors cursor-pointer"
                      >
                        ห้อง {unit.unitNumber}
                      </h3>
                      <p className="text-xs text-slate-500">{unit.roomType} • {unit.sizeSqm} ตร.ม.</p>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-brand-600 text-base">
                        {formatCurrency(unit.rentPrice)}
                      </span>
                      <span className="text-[10px] text-slate-400">/ เดือน</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {unit.description}
                  </p>

                  {/* Privacy Aware Owner/Tenant Display */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ค่าส่วนกลาง:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(unit.commonFee)}/ด.</span>
                    </div>
                    {isAdmin && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">เจ้าของห้อง:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">{unit.ownerName || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ผู้เช่าปัจจุบัน:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">{unit.currentTenantName || '-'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => navigateTo(`/units/${unit.id}`)}
                  className="font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>ดูรายละเอียด</span>
                </button>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(unit)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                      title="แก้ไขห้องชุด"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setUnitToDelete(unit)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40"
                      title="ลบห้องชุด"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                  <th className="py-3.5 px-4">เลขห้อง</th>
                  <th className="py-3.5 px-4">อาคาร / ชั้น</th>
                  <th className="py-3.5 px-4">ประเภทห้อง</th>
                  <th className="py-3.5 px-4">ขนาด</th>
                  <th className="py-3.5 px-4">ราคาเช่า</th>
                  <th className="py-3.5 px-4">ค่าส่วนกลาง</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  {isAdmin && <th className="py-3.5 px-4">เจ้าของห้อง</th>}
                  {isAdmin && <th className="py-3.5 px-4">ผู้เช่าปัจจุบัน</th>}
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedUnits.map(unit => (
                  <tr key={unit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-brand-600 dark:text-brand-400">
                      {unit.unitNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      อาคาร {unit.building} ชั้น {unit.floor}
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                      {unit.roomType}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {unit.sizeSqm} ตร.ม.
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(unit.rentPrice)}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatCurrency(unit.commonFee)}
                    </td>
                    <td className="py-3 px-4">
                      {getUnitStatusBadge(unit.status)}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {unit.ownerName || '-'}
                      </td>
                    )}
                    {isAdmin && (
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {unit.currentTenantName || '-'}
                      </td>
                    )}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigateTo(`/units/${unit.id}`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => openEditModal(unit)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="แก้ไข"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setUnitToDelete(unit)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="ลบ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {filteredUnits.length > pageSize && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>
            แสดงหน้า {currentPage} จาก {totalPages} (ทั้งหมด {filteredUnits.length} รายการ)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded-xl font-medium transition-colors ${
                  currentPage === idx + 1
                    ? 'bg-brand-600 text-white font-bold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Unit Modal */}
      {(isAddModalOpen || editingUnit) && (
        <Modal
          isOpen={isAddModalOpen || !!editingUnit}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingUnit(null);
          }}
          title={editingUnit ? `แก้ไขข้อมูลห้องชุด ${editingUnit.unitNumber}` : 'เพิ่มห้องชุดใหม่ลงในโครงการ'}
          description="กรอกข้อมูลคุณสมบัติห้องชุด ค่าเช่า และสถานะห้อง"
          maxWidth="2xl"
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingUnit(null);
                }}
                className="px-3.5 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={editingUnit ? handleEditSubmit : handleAddSubmit}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow"
              >
                {editingUnit ? 'บันทึกการแก้ไข' : 'บันทึกห้องชุด'}
              </button>
            </>
          }
        >
          <form className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">เลขห้องชุด <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  disabled={!!editingUnit}
                  value={unitForm.unitNumber}
                  onChange={e => setUnitForm({ ...unitForm, unitNumber: e.target.value })}
                  placeholder="เช่น A-1601"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">อาคาร <span className="text-rose-500">*</span></label>
                <select
                  value={unitForm.building}
                  onChange={e => setUnitForm({ ...unitForm, building: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="A">อาคาร A</option>
                  <option value="B">อาคาร B</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ชั้น <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={unitForm.floor}
                  onChange={e => setUnitForm({ ...unitForm, floor: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">ประเภทห้องชุด</label>
                <select
                  value={unitForm.roomType}
                  onChange={e => setUnitForm({ ...unitForm, roomType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="Studio">Studio</option>
                  <option value="1 Bedroom">1 Bedroom</option>
                  <option value="2 Bedroom">2 Bedroom</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ขนาดพื้นที่ (ตร.ม.)</label>
                <input
                  type="number"
                  step="0.5"
                  value={unitForm.sizeSqm}
                  onChange={e => setUnitForm({ ...unitForm, sizeSqm: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">สถานะห้อง</label>
                <select
                  value={unitForm.status}
                  onChange={e => setUnitForm({ ...unitForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="vacant">ว่าง (Vacant)</option>
                  <option value="occupied">มีผู้เช่า (Occupied)</option>
                  <option value="pending_move_in">รอเข้าอยู่ (Pending Move-in)</option>
                  <option value="under_repair">อยู่ระหว่างซ่อม (Under Repair)</option>
                  <option value="renovating">ปิดปรับปรุง (Renovating)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">ราคาค่าเช่าต่อเดือน (บาท)</label>
                <input
                  type="number"
                  step="500"
                  value={unitForm.rentPrice}
                  onChange={e => setUnitForm({ ...unitForm, rentPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ค่าส่วนกลางต่อเดือน (บาท)</label>
                <input
                  type="number"
                  step="50"
                  value={unitForm.commonFee}
                  onChange={e => setUnitForm({ ...unitForm, commonFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">รายละเอียดและจุดเด่นห้องชุด</label>
              <textarea
                rows={3}
                value={unitForm.description}
                onChange={e => setUnitForm({ ...unitForm, description: e.target.value })}
                placeholder="เช่น ห้องมุม วิวเมือง ทิศเหนือ เฟอร์นิเจอร์ครบ พร้อมเครื่องซักผ้า..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Unit Safety Check Dialog */}
      <ConfirmDialog
        isOpen={!!unitToDelete}
        onClose={() => setUnitToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`ยืนยันการลบห้องชุด ${unitToDelete?.unitNumber}`}
        message={
          <div className="space-y-2">
            <p>ท่านต้องการลบห้องชุด <strong>{unitToDelete?.unitNumber}</strong> ออกจากฐานข้อมูลระบบใช่หรือไม่?</p>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              * กฎความปลอดภัยทางธุรกิจ: ระบบจะปฏิเสธการลบโดยอัตโนมัติหากห้องชุดนี้มีสัญญาเช่าที่ยัง Active อยู่
            </p>
          </div>
        }
        confirmLabel="ยืนยันการลบห้อง"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
