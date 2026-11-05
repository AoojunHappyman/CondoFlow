import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  Unit,
  Owner,
  Tenant,
  LeaseContract,
  Invoice,
  Payment,
  RepairRequest,
  Parcel,
  Announcement,
  NotificationItem,
  AuditLog,
  RoleDefinition,
  ToastMessage,
  TenantStatus,
  RepairStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ROLES,
  INITIAL_OWNERS,
  INITIAL_TENANTS,
  INITIAL_UNITS,
  INITIAL_CONTRACTS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_REPAIRS,
  INITIAL_PARCELS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import { delay } from '../lib/utils';

const STORAGE_KEY_PREFIX = 'condoflow_v1_';

interface AppContextType {
  // Auth & User
  currentUser: User | null;
  activeRole: UserRole;
  switchDemoRole: (role: UserRole) => void;
  login: (username: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  registerUser: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updateCurrentUserProfile: (data: Partial<User>) => Promise<boolean>;

  // Theme & Non-functional states
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMaintenanceMode: boolean;
  setMaintenanceMode: (enabled: boolean) => void;
  isSessionTimeoutWarning: boolean;
  setSessionTimeoutWarning: (show: boolean) => void;
  resetDemoData: () => void;

  // Data Store
  units: Unit[];
  owners: Owner[];
  tenants: Tenant[];
  contracts: LeaseContract[];
  invoices: Invoice[];
  payments: Payment[];
  repairs: RepairRequest[];
  parcels: Parcel[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  roles: RoleDefinition[];
  users: User[];

  // CRUD Operations
  addUnit: (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateUnit: (id: string, unit: Partial<Unit>) => Promise<boolean>;
  deleteUnit: (id: string) => Promise<{ success: boolean; error?: string }>;

  addOwner: (owner: Omit<Owner, 'id' | 'createdAt'>) => Promise<boolean>;
  updateOwner: (id: string, owner: Partial<Owner>) => Promise<boolean>;
  deleteOwner: (id: string) => Promise<boolean>;

  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => Promise<boolean>;
  updateTenant: (id: string, tenant: Partial<Tenant>) => Promise<boolean>;
  deleteTenant: (id: string) => Promise<boolean>;
  changeTenantStatus: (tenantId: string, newStatus: TenantStatus, reason: string) => Promise<boolean>;

  createContract: (contract: Omit<LeaseContract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  updateContract: (id: string, data: Partial<LeaseContract>) => Promise<boolean>;
  terminateContract: (id: string, reason: string) => Promise<boolean>;

  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => Promise<boolean>;
  batchCreateInvoices: (billingCycle: string, category: any, unitIds: string[]) => Promise<number>;
  cancelInvoice: (id: string) => Promise<boolean>;

  submitPayment: (data: {
    invoiceId: string;
    paidAmount: number;
    paymentDate: string;
    paymentTime: string;
    sourceBank: string;
    paymentMethod: 'transfer' | 'promptpay' | 'credit_card';
    referenceNumber: string;
    slipUrl?: string;
    note?: string;
  }) => Promise<boolean>;
  verifyPayment: (
    paymentId: string,
    isApproved: boolean,
    rejectionReason?: string,
    internalNote?: string
  ) => Promise<boolean>;

  createRepairRequest: (data: Omit<RepairRequest, 'id' | 'ticketNumber' | 'status' | 'updates' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateRepairStatus: (
    id: string,
    status: RepairStatus,
    technician?: string,
    appointmentDate?: string,
    note?: string
  ) => Promise<boolean>;
  closeRepairRequest: (id: string, completionNotes: string, photos?: string[]) => Promise<boolean>;
  rateRepairRequest: (id: string, rating: number, comment?: string) => Promise<boolean>;

  addParcel: (data: Omit<Parcel, 'id' | 'pickupCode' | 'status' | 'createdAt'>) => Promise<boolean>;
  handoverParcel: (id: string, code: string, staffName?: string) => Promise<{ success: boolean; error?: string }>;

  createAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt'>) => Promise<boolean>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  updateRolePermissions: (roleId: string, permissions: RoleDefinition['permissions']) => Promise<boolean>;

  // Toast feedback
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Active Navigation
  currentRoute: string;
  navigateTo: (route: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to load or initialize LocalStorage
  const loadStorage = <T,>(key: string, defaultVal: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const saveStorage = (key: string, val: any) => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
    } catch (err) {
      console.error('Storage write error', err);
    }
  };

  // State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return loadStorage<User | null>('currentUser', INITIAL_USERS[0]); // default admin for prototype
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser?.role || 'admin';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('condoflow_darkmode');
    return saved ? saved === 'true' : false;
  });

  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(() => {
    return loadStorage<boolean>('maintenanceMode', false);
  });

  const [isSessionTimeoutWarning, setSessionTimeoutWarning] = useState(false);

  // Data collections
  const [users, setUsers] = useState<User[]>(() => loadStorage('users', INITIAL_USERS));
  const [roles, setRoles] = useState<RoleDefinition[]>(() => loadStorage('roles', INITIAL_ROLES));
  const [units, setUnits] = useState<Unit[]>(() => loadStorage('units', INITIAL_UNITS));
  const [owners, setOwners] = useState<Owner[]>(() => loadStorage('owners', INITIAL_OWNERS));
  const [tenants, setTenants] = useState<Tenant[]>(() => loadStorage('tenants', INITIAL_TENANTS));
  const [contracts, setContracts] = useState<LeaseContract[]>(() => loadStorage('contracts', INITIAL_CONTRACTS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadStorage('invoices', INITIAL_INVOICES));
  const [payments, setPayments] = useState<Payment[]>(() => loadStorage('payments', INITIAL_PAYMENTS));
  const [repairs, setRepairs] = useState<RepairRequest[]>(() => loadStorage('repairs', INITIAL_REPAIRS));
  const [parcels, setParcels] = useState<Parcel[]>(() => loadStorage('parcels', INITIAL_PARCELS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadStorage('announcements', INITIAL_ANNOUNCEMENTS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStorage('notifications', INITIAL_NOTIFICATIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStorage('auditLogs', INITIAL_AUDIT_LOGS));

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/dashboard';
  });

  // Sync route with window hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentRoute(hash || '/dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('condoflow_darkmode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Sync current user to storage & role
  useEffect(() => {
    saveStorage('currentUser', currentUser);
    if (currentUser) {
      setActiveRole(currentUser.role);
    }
  }, [currentUser]);

  // Sync entities to storage
  useEffect(() => saveStorage('users', users), [users]);
  useEffect(() => saveStorage('roles', roles), [roles]);
  useEffect(() => saveStorage('units', units), [units]);
  useEffect(() => saveStorage('owners', owners), [owners]);
  useEffect(() => saveStorage('tenants', tenants), [tenants]);
  useEffect(() => saveStorage('contracts', contracts), [contracts]);
  useEffect(() => saveStorage('invoices', invoices), [invoices]);
  useEffect(() => saveStorage('payments', payments), [payments]);
  useEffect(() => saveStorage('repairs', repairs), [repairs]);
  useEffect(() => saveStorage('parcels', parcels), [parcels]);
  useEffect(() => saveStorage('announcements', announcements), [announcements]);
  useEffect(() => saveStorage('notifications', notifications), [notifications]);
  useEffect(() => saveStorage('auditLogs', auditLogs), [auditLogs]);
  useEffect(() => saveStorage('maintenanceMode', isMaintenanceMode), [isMaintenanceMode]);

  // Toast functions
  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper to append audit log
  const logAudit = (action: string, module: string, recordId: string, oldValue?: string, newValue?: string) => {
    const newLog: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString(),
      actorId: currentUser?.id || 'sys',
      actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'System',
      role: currentUser?.role === 'admin' ? 'ผู้ดูแลระบบ' : currentUser?.role === 'owner' ? 'เจ้าของห้อง' : currentUser?.role === 'tenant' ? 'ผู้เช่า' : 'ผู้ใช้งานทั่วไป',
      action,
      module,
      recordId,
      oldValue,
      newValue,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
      device: 'Web Client / Prototype Mode',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Switch demo account instantly
  const switchDemoRole = async (targetRole: UserRole) => {
    await delay(250);
    const targetUser = INITIAL_USERS.find(u => u.role === targetRole) || INITIAL_USERS[0];
    setCurrentUser(targetUser);
    setActiveRole(targetRole);
    logAudit(`สลับบทบาท Demo เป็น ${targetUser.role}`, 'users', targetUser.id);
    addToast('info', 'สลับบทบาททดลองใช้งานสำเร็จ', `เข้าสู่ระบบในฐานะ: ${targetUser.firstName} (${targetUser.role.toUpperCase()})`);
    
    // Redirect to matching dashboard
    if (targetRole === 'admin') navigateTo('/admin/dashboard');
    else navigateTo('/dashboard');
  };

  // Auth
  const login = async (username: string, specificRole?: UserRole) => {
    await delay(400);
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() || 
      u.email.toLowerCase() === username.toLowerCase() ||
      (specificRole && u.role === specificRole)
    );

    if (!user) {
      addToast('error', 'เข้าสู่ระบบไม่สำเร็จ', 'ไม่พบบัญชีผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
      return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
    }

    if (user.status === 'suspended') {
      addToast('error', 'บัญชีถูกระงับ', 'บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ');
      return { success: false, error: 'บัญชีนี้ถูกระงับการใช้งาน' };
    }

    const updatedUser = { ...user, lastLoginAt: new Date().toISOString() };
    setCurrentUser(updatedUser);
    setActiveRole(updatedUser.role);
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    logAudit('เข้าสู่ระบบสำเร็จ (Login)', 'users', user.id);
    addToast('success', 'เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับคุณ ${user.firstName} ${user.lastName}`);

    if (user.role === 'admin') navigateTo('/admin/dashboard');
    else navigateTo('/dashboard');

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      logAudit('ออกจากระบบ (Logout)', 'users', currentUser.id);
    }
    setCurrentUser(null);
    navigateTo('/login');
    addToast('info', 'ออกจากระบบเรียบร้อยแล้ว');
  };

  const registerUser = async (userData: Partial<User>) => {
    await delay(500);
    // Check duplicates
    const isDup = users.some(u => 
      u.username.toLowerCase() === (userData.username || '').toLowerCase() ||
      u.email.toLowerCase() === (userData.email || '').toLowerCase()
    );

    if (isDup) {
      addToast('error', 'สมัครสมาชิกไม่สำเร็จ', 'Username หรือ Email นี้มีในระบบแล้ว');
      return { success: false, error: 'Username หรือ Email มีในระบบแล้ว' };
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      username: userData.username || 'user' + Date.now().toString().slice(-4),
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      idCard: userData.idCard || '1-xxxx-xxxxx-00-0',
      role: 'user', // Default per requirements
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      address: userData.address || 'กรุงเทพมหานคร',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setUsers(prev => [newUser, ...prev]);
    logAudit('ลงทะเบียนผู้ใช้งานใหม่ (Register)', 'users', newUser.id, undefined, `Role: user, Name: ${newUser.firstName} ${newUser.lastName}`);
    
    // Auto add welcome notification
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        userId: newUser.id,
        title: 'ยินดีต้อนรับสู่ CondoFlow',
        message: 'บัญชีของคุณสร้างเสร็จสมบูรณ์แล้ว คุณสามารถค้นหาห้องชุดและอ่านประกาศได้ทันที',
        type: 'success',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addToast('success', 'สมัครสมาชิกสำเร็จ!', 'สามารถเข้าสู่ระบบด้วยบัญชีใหม่ได้ทันที');
    return { success: true };
  };

  const updateCurrentUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return false;
    await delay(400);
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    logAudit('แก้ไขข้อมูลส่วนตัว (Update Profile)', 'users', currentUser.id);
    addToast('success', 'บันทึกข้อมูลส่วนตัวเรียบร้อย');
    return true;
  };

  // Unit Operations
  const addUnit = async (unitData: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(400);
    // Duplicate check
    const exists = units.some(u => u.unitNumber.toLowerCase() === unitData.unitNumber.toLowerCase());
    if (exists) {
      addToast('error', 'ไม่สามารถเพิ่มห้องชุดได้', `เลขห้อง ${unitData.unitNumber} มีอยู่ในระบบแล้ว`);
      return false;
    }

    const newUnit: Unit = {
      ...unitData,
      id: 'unit-' + unitData.unitNumber.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUnits(prev => [newUnit, ...prev]);
    logAudit('เพิ่มห้องชุดใหม่ (Create Unit)', 'units', newUnit.id, undefined, `ห้อง ${newUnit.unitNumber} อาคาร ${newUnit.building}`);
    addToast('success', 'เพิ่มห้องชุดสำเร็จ', `ห้อง ${newUnit.unitNumber} ได้รับการบันทึกลงระบบแล้ว`);
    return true;
  };

  const updateUnit = async (id: string, updateData: Partial<Unit>) => {
    await delay(350);
    setUnits(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, ...updateData, updatedAt: new Date().toISOString() };
        logAudit('แก้ไขข้อมูลห้องชุด (Edit Unit)', 'units', id, JSON.stringify({ rentPrice: u.rentPrice, status: u.status }), JSON.stringify(updateData));
        return updated;
      }
      return u;
    }));
    addToast('success', 'แก้ไขข้อมูลห้องชุดเรียบร้อย');
    return true;
  };

  const deleteUnit = async (id: string) => {
    await delay(350);
    const targetUnit = units.find(u => u.id === id);
    if (!targetUnit) return { success: false, error: 'ไม่พบข้อมูลห้องชุด' };

    // Business rule: Cannot delete unit with active contract!
    const activeContract = contracts.find(c => c.unitId === id && (c.status === 'active' || c.status === 'expiring_soon'));
    if (activeContract) {
      addToast('error', 'ไม่อนุญาตให้ลบห้องชุด', `ห้อง ${targetUnit.unitNumber} มีสัญญาเช่าที่มีผลใช้งานอยู่ (${activeContract.contractNumber})`);
      return { success: false, error: 'ห้องชุดนี้มีสัญญาเช่าที่ยังใช้งานอยู่ ไม่สามารถลบได้' };
    }

    setUnits(prev => prev.filter(u => u.id !== id));
    logAudit('ลบห้องชุด (Delete Unit)', 'units', id, `ห้อง ${targetUnit.unitNumber}`);
    addToast('success', 'ลบห้องชุดสำเร็จ', `ห้อง ${targetUnit.unitNumber} ถูกลบออกจากระบบแล้ว`);
    return { success: true };
  };

  // Owner Operations
  const addOwner = async (ownerData: Omit<Owner, 'id' | 'createdAt'>) => {
    await delay(400);
    const newOwner: Owner = {
      ...ownerData,
      id: 'own-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setOwners(prev => [newOwner, ...prev]);
    logAudit('เพิ่มข้อมูลเจ้าของห้อง (Create Owner)', 'owners', newOwner.id, undefined, `${newOwner.firstName} ${newOwner.lastName}`);
    addToast('success', 'เพิ่มเจ้าของห้องสำเร็จ', `บันทึกคุณ ${newOwner.firstName} เรียบร้อยแล้ว`);
    return true;
  };

  const updateOwner = async (id: string, updateData: Partial<Owner>) => {
    await delay(350);
    setOwners(prev => prev.map(o => o.id === id ? { ...o, ...updateData } : o));
    logAudit('แก้ไขข้อมูลเจ้าของห้อง (Edit Owner)', 'owners', id);
    addToast('success', 'แก้ไขข้อมูลเจ้าของห้องเรียบร้อย');
    return true;
  };

  const deleteOwner = async (id: string) => {
    await delay(350);
    setOwners(prev => prev.filter(o => o.id !== id));
    logAudit('ลบข้อมูลเจ้าของห้อง (Delete Owner)', 'owners', id);
    addToast('success', 'ลบข้อมูลเจ้าของห้องเรียบร้อย');
    return true;
  };

  // Tenant Operations
  const addTenant = async (tenantData: Omit<Tenant, 'id' | 'createdAt'>) => {
    await delay(400);
    const newTenant: Tenant = {
      ...tenantData,
      id: 'tnt-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTenants(prev => [newTenant, ...prev]);
    logAudit('เพิ่มข้อมูลผู้เช่า (Create Tenant)', 'tenants', newTenant.id, undefined, `${newTenant.firstName} ${newTenant.lastName}`);
    addToast('success', 'เพิ่มผู้เช่าสำเร็จ', `บันทึกคุณ ${newTenant.firstName} เรียบร้อยแล้ว`);
    return true;
  };

  const updateTenant = async (id: string, updateData: Partial<Tenant>) => {
    await delay(350);
    setTenants(prev => prev.map(t => t.id === id ? { ...t, ...updateData } : t));
    logAudit('แก้ไขข้อมูลผู้เช่า (Edit Tenant)', 'tenants', id);
    addToast('success', 'แก้ไขข้อมูลผู้เช่าเรียบร้อย');
    return true;
  };

  const deleteTenant = async (id: string) => {
    await delay(350);
    setTenants(prev => prev.filter(t => t.id !== id));
    logAudit('ลบข้อมูลผู้เช่า (Delete Tenant)', 'tenants', id);
    addToast('success', 'ลบข้อมูลผู้เช่าเรียบร้อย');
    return true;
  };

  const changeTenantStatus = async (tenantId: string, newStatus: TenantStatus, reason: string) => {
    await delay(400);
    const target = tenants.find(t => t.id === tenantId);
    if (!target) return false;

    const oldStatus = target.status;
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        return { ...t, status: newStatus, statusReason: reason };
      }
      return t;
    }));

    // If moved out, also update unit status to vacant
    if (newStatus === 'moved_out' && target.currentUnitId) {
      setUnits(prev => prev.map(u => {
        if (u.id === target.currentUnitId) {
          return { ...u, status: 'vacant', currentTenantId: undefined, currentTenantName: undefined };
        }
        return u;
      }));
    }

    logAudit('เปลี่ยนสถานะผู้เช่า (Update Tenant Status)', 'tenants', tenantId, `เดิม: ${oldStatus}`, `ใหม่: ${newStatus}, เหตุผล: ${reason}`);
    
    // Send notification
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        userId: target.id,
        title: 'สถานะผู้เช่าของคุณถูกปรับปรุง',
        message: `สถานะของคุณได้รับการเปลี่ยนเป็น ${newStatus} เนื่องจาก: ${reason}`,
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addToast('success', 'เปลี่ยนสถานะผู้เช่าสำเร็จ', `ปรับปรุงสถานะเป็น ${newStatus}`);
    return true;
  };

  // Contract Operations
  const createContract = async (contractData: Omit<LeaseContract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt'>) => {
    await delay(450);
    const targetUnit = units.find(u => u.id === contractData.unitId);
    if (!targetUnit) return { success: false, error: 'ไม่พบข้อมูลห้องชุด' };

    // Check if unit already has active lease
    if (contractData.status === 'active' && targetUnit.status === 'occupied') {
      addToast('error', 'ไม่สามารถทำสัญญาได้', `ห้อง ${targetUnit.unitNumber} มีผู้เช่าอยู่แล้วในปัจจุบัน`);
      return { success: false, error: 'ห้องชุดนี้มีผู้เช่าอยู่แล้ว' };
    }

    const count = contracts.length + 1;
    const contractNumber = `CNT-2026-${String(count).padStart(3, '0')}`;
    const newContract: LeaseContract = {
      ...contractData,
      id: 'cnt-' + Date.now(),
      contractNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setContracts(prev => [newContract, ...prev]);

    // If active, update unit and tenant
    if (newContract.status === 'active') {
      setUnits(prev => prev.map(u => {
        if (u.id === newContract.unitId) {
          return {
            ...u,
            status: 'occupied',
            currentTenantId: newContract.tenantId,
            currentTenantName: newContract.tenantName,
          };
        }
        return u;
      }));

      setTenants(prev => prev.map(t => {
        if (t.id === newContract.tenantId) {
          return {
            ...t,
            currentUnitId: newContract.unitId,
            currentUnitNumber: newContract.unitNumber,
            status: 'renting',
            leaseStartDate: newContract.startDate,
            leaseEndDate: newContract.endDate,
          };
        }
        return t;
      }));
    }

    logAudit('สร้างสัญญาเช่าใหม่ (Create Lease)', 'contracts', newContract.id, undefined, `${newContract.contractNumber} ห้อง ${newContract.unitNumber} ผู้เช่า ${newContract.tenantName}`);
    addToast('success', 'สร้างสัญญาเช่าสำเร็จ', `เลขที่สัญญา: ${contractNumber}`);
    return { success: true };
  };

  const updateContract = async (id: string, data: Partial<LeaseContract>) => {
    await delay(350);
    setContracts(prev => prev.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));
    logAudit('แก้ไขสัญญาเช่า (Edit Lease)', 'contracts', id);
    addToast('success', 'แก้ไขสัญญาเช่าเรียบร้อย');
    return true;
  };

  const terminateContract = async (id: string, reason: string) => {
    await delay(400);
    const target = contracts.find(c => c.id === id);
    if (!target) return false;

    setContracts(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'terminated',
          terminatedReason: reason,
          terminatedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    }));

    // Release unit to vacant
    setUnits(prev => prev.map(u => {
      if (u.id === target.unitId) {
        return {
          ...u,
          status: 'vacant',
          currentTenantId: undefined,
          currentTenantName: undefined,
        };
      }
      return u;
    }));

    // Update tenant to moved_out
    setTenants(prev => prev.map(t => {
      if (t.id === target.tenantId) {
        return {
          ...t,
          status: 'moved_out',
          statusReason: `ยกเลิกสัญญา: ${reason}`,
        };
      }
      return t;
    }));

    logAudit('ยกเลิก/สิ้นสุดสัญญาเช่า (Terminate Lease)', 'contracts', id, `สัญญา ${target.contractNumber}`, `เหตุผล: ${reason}`);
    addToast('info', 'ยกเลิกสัญญาเช่าสำเร็จ', `ห้อง ${target.unitNumber} กลับสู่สถานะว่างพร้อมเช่า`);
    return true;
  };

  // Invoice Operations
  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    await delay(400);
    const count = invoices.length + 1;
    const invoiceNumber = `INV-2026-11-${String(count).padStart(3, '0')}`;
    const newInvoice: Invoice = {
      ...invoiceData,
      id: 'inv-' + Date.now(),
      invoiceNumber,
      createdAt: new Date().toISOString(),
    };

    setInvoices(prev => [newInvoice, ...prev]);
    logAudit('ออกใบแจ้งหนี้ใหม่ (Create Invoice)', 'invoices', newInvoice.id, undefined, `${newInvoice.invoiceNumber} ยอด ฿${newInvoice.totalAmount} ห้อง ${newInvoice.unitNumber}`);
    
    // Notify recipient
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        userId: newInvoice.recipientId,
        title: `มีใบแจ้งหนี้ใหม่ ${newInvoice.invoiceNumber}`,
        message: `ยอดชำระ ฿${newInvoice.totalAmount.toLocaleString()} กำหนดชำระ ${newInvoice.dueDate}`,
        type: 'warning',
        linkUrl: '/payments',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addToast('success', 'ออกใบแจ้งหนี้สำเร็จ', `เลขที่ ${invoiceNumber} ยอดรวม ฿${newInvoice.totalAmount.toLocaleString()}`);
    return true;
  };

  const batchCreateInvoices = async (billingCycle: string, category: any, unitIds: string[]) => {
    await delay(600);
    let createdCount = 0;
    const newInvoices: Invoice[] = [];

    units.forEach((u) => {
      if (unitIds.includes(u.id)) {
        const invNum = `INV-BATCH-${Date.now().toString().slice(-4)}-${String(createdCount + 1).padStart(2, '0')}`;
        const fee = category === 'common_fee' ? u.commonFee * 3 : u.rentPrice;
        const inv: Invoice = {
          id: 'inv-batch-' + Date.now() + '-' + createdCount,
          invoiceNumber: invNum,
          recipientId: u.currentTenantId || u.ownerId || 'usr-tenant-01',
          recipientName: u.currentTenantName || u.ownerName || 'ผู้พักอาศัย',
          recipientRole: category === 'common_fee' ? 'owner' : 'tenant',
          unitId: u.id,
          unitNumber: u.unitNumber,
          billingCycle,
          category,
          items: [{ id: 'item-1', description: `${category === 'common_fee' ? 'ค่าส่วนกลาง' : 'ค่าเช่า'} ประจำ ${billingCycle}`, amount: fee }],
          totalAmount: fee,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        newInvoices.push(inv);
        createdCount++;
      }
    });

    setInvoices(prev => [...newInvoices, ...prev]);
    logAudit('ออกใบแจ้งหนี้แบบกลุ่ม (Batch Create Invoices)', 'invoices', `BATCH-${billingCycle}`, undefined, `จำนวน ${createdCount} ใบ`);
    addToast('success', 'สร้างใบแจ้งหนี้แบบกลุ่มสำเร็จ', `สร้างใบแจ้งหนี้เรียบร้อยจำนวน ${createdCount} ฉบับ`);
    return createdCount;
  };

  const cancelInvoice = async (id: string) => {
    await delay(350);
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        logAudit('ยกเลิกใบแจ้งหนี้ (Cancel Invoice)', 'invoices', id, `เลขที่: ${inv.invoiceNumber}`);
        return { ...inv, status: 'cancelled' };
      }
      return inv;
    }));
    addToast('info', 'ยกเลิกใบแจ้งหนี้เรียบร้อย');
    return true;
  };

  // Payment Operations
  const submitPayment = async (data: {
    invoiceId: string;
    paidAmount: number;
    paymentDate: string;
    paymentTime: string;
    sourceBank: string;
    paymentMethod: 'transfer' | 'promptpay' | 'credit_card';
    referenceNumber: string;
    slipUrl?: string;
    note?: string;
  }) => {
    await delay(500);
    const targetInvoice = invoices.find(inv => inv.id === data.invoiceId);
    if (!targetInvoice) return false;

    const count = payments.length + 1;
    const paymentNumber = `PAY-2026-11-${String(count).padStart(3, '0')}`;
    const newPayment: Payment = {
      id: 'pay-' + Date.now(),
      paymentNumber,
      invoiceId: targetInvoice.id,
      invoiceNumber: targetInvoice.invoiceNumber,
      payerId: currentUser?.id || targetInvoice.recipientId,
      payerName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : targetInvoice.recipientName,
      unitNumber: targetInvoice.unitNumber,
      invoiceAmount: targetInvoice.totalAmount,
      paidAmount: data.paidAmount,
      paymentDate: data.paymentDate,
      paymentTime: data.paymentTime,
      sourceBank: data.sourceBank,
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      slipUrl: data.slipUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      status: 'pending_verification',
      internalNote: data.note,
      createdAt: new Date().toISOString(),
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update invoice status to 'verifying'
    setInvoices(prev => prev.map(inv => inv.id === targetInvoice.id ? { ...inv, status: 'verifying' } : inv));

    logAudit('แจ้งชำระเงิน (Submit Payment)', 'payments', newPayment.id, undefined, `${paymentNumber} ยอด ฿${data.paidAmount} ห้อง ${targetInvoice.unitNumber}`);
    
    // Notify admin
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        userId: 'usr-admin-01',
        title: `มีการแจ้งชำระเงินใหม่ ห้อง ${targetInvoice.unitNumber}`,
        message: `ยอดชำระ ฿${data.paidAmount.toLocaleString()} จาก ${newPayment.payerName} รอการตรวจสอบ`,
        type: 'warning',
        linkUrl: '/admin/payments',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addToast('success', 'ส่งหลักฐานการชำระเงินสำเร็จ', 'ระบบได้รับข้อมูลแล้ว นิติบุคคลจะทำการตรวจสอบโดยเร็ว');
    return true;
  };

  const verifyPayment = async (
    paymentId: string,
    isApproved: boolean,
    rejectionReason?: string,
    internalNote?: string
  ) => {
    await delay(450);
    const targetPayment = payments.find(p => p.id === paymentId);
    if (!targetPayment) return false;

    const receiptNumber = isApproved ? `RCP-2026-11-${Date.now().toString().slice(-3)}` : undefined;

    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: isApproved ? 'approved' : 'rejected',
          rejectionReason,
          internalNote: internalNote || p.internalNote,
          receiptNumber,
          verifiedAt: new Date().toISOString(),
          verifiedBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Admin',
        };
      }
      return p;
    }));

    // Update matching invoice
    setInvoices(prev => prev.map(inv => {
      if (inv.id === targetPayment.invoiceId) {
        return {
          ...inv,
          status: isApproved ? 'paid' : 'pending',
          receiptNumber: isApproved ? receiptNumber : undefined,
          paidAt: isApproved ? new Date().toISOString() : undefined,
        };
      }
      return inv;
    }));

    logAudit(
      isApproved ? 'อนุมัติการชำระเงิน (Approve Payment)' : 'ปฏิเสธการชำระเงิน (Reject Payment)',
      'payments',
      paymentId,
      `Status: pending_verification`,
      isApproved ? `อนุมัติแล้ว Receipt: ${receiptNumber}` : `ปฏิเสธ: ${rejectionReason}`
    );

    // Notify payer
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        userId: targetPayment.payerId,
        title: isApproved ? 'การชำระเงินได้รับการอนุมัติแล้ว' : 'การชำระเงินถูกปฏิเสธ',
        message: isApproved
          ? `ใบแจ้งหนี้ ${targetPayment.invoiceNumber} ออกใบเสร็จเลขที่ ${receiptNumber} เรียบร้อยแล้ว`
          : `การชำระเงินห้อง ${targetPayment.unitNumber} ไม่ผ่าน: ${rejectionReason}`,
        type: isApproved ? 'success' : 'danger',
        linkUrl: '/payments',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    if (isApproved) {
      addToast('success', 'อนุมัติการชำระเงินสำเร็จ', `สร้างใบเสร็จรับเงิน ${receiptNumber}`);
    } else {
      addToast('warning', 'ปฏิเสธการชำระเงินแล้ว', `ส่งแจ้งเตือนระบุเหตุผลให้ผู้ชำระทราบ`);
    }

    return true;
  };

  // Repair Operations
  const createRepairRequest = async (repairData: Omit<RepairRequest, 'id' | 'ticketNumber' | 'status' | 'updates' | 'createdAt' | 'updatedAt'>) => {
    await delay(450);
    const count = repairs.length + 1;
    const ticketNumber = `REP-2026-${String(count).padStart(3, '0')}`;
    const newRepair: RepairRequest = {
      ...repairData,
      id: 'rep-' + Date.now(),
      ticketNumber,
      status: 'submitted',
      updates: [
        {
          id: 'upd-' + Date.now(),
          timestamp: new Date().toISOString(),
          actor: currentUser ? `${currentUser.firstName} (${currentUser.role})` : 'ผู้แจ้ง',
          note: 'สร้างคำร้องแจ้งซ่อมในระบบ',
          status: 'submitted',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRepairs(prev => [newRepair, ...prev]);
    logAudit('สร้างคำร้องแจ้งซ่อม (Create Repair)', 'repairs', newRepair.id, undefined, `${ticketNumber}: ${newRepair.title}`);
    
    // Notify admin
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        userId: 'usr-admin-01',
        title: `คำร้องแจ้งซ่อมใหม่ ${ticketNumber}`,
        message: `${newRepair.title} (${newRepair.location}) ระดับความเร่งด่วน: ${newRepair.urgency}`,
        type: newRepair.urgency === 'emergency' ? 'danger' : 'info',
        linkUrl: '/admin/repairs',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addToast('success', 'ส่งคำร้องแจ้งซ่อมสำเร็จ', `รหัสคำร้อง: ${ticketNumber}`);
    return newRepair.id;
  };

  const updateRepairStatus = async (
    id: string,
    newStatus: RepairStatus,
    technician?: string,
    appointmentDate?: string,
    note?: string
  ) => {
    await delay(350);
    const target = repairs.find(r => r.id === id);
    if (!target) return false;

    setRepairs(prev => prev.map(r => {
      if (r.id === id) {
        const updateItem = {
          id: 'upd-' + Date.now(),
          timestamp: new Date().toISOString(),
          actor: currentUser ? `${currentUser.firstName} (${currentUser.role})` : 'เจ้าหน้าที่นิติบุคคล',
          note: note || `เปลี่ยนสถานะเป็น ${newStatus}${technician ? ` (มอบหมาย ${technician})` : ''}`,
          status: newStatus,
        };
        return {
          ...r,
          status: newStatus,
          assignedTechnician: technician || r.assignedTechnician,
          appointmentDate: appointmentDate || r.appointmentDate,
          updates: [...r.updates, updateItem],
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    }));

    logAudit('อัปเดตสถานะงานซ่อม (Update Repair)', 'repairs', id, `เดิม: ${target.status}`, `ใหม่: ${newStatus}`);
    
    // Notify requester
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        userId: target.requesterId,
        title: `อัปเดตคำร้องแจ้งซ่อม ${target.ticketNumber}`,
        message: `สถานะเปลี่ยนเป็น "${newStatus}" ${note ? `- ${note}` : ''}`,
        type: 'info',
        linkUrl: '/maintenance',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addToast('success', 'อัปเดตสถานะงานซ่อมสำเร็จ');
    return true;
  };

  const closeRepairRequest = async (id: string, completionNotes: string, photos?: string[]) => {
    await delay(400);
    const target = repairs.find(r => r.id === id);
    if (!target) return false;

    setRepairs(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'closed',
          completionNotes,
          completionPhotos: photos || r.completionPhotos,
          updates: [
            ...r.updates,
            {
              id: 'upd-' + Date.now(),
              timestamp: new Date().toISOString(),
              actor: currentUser ? `${currentUser.firstName} (${currentUser.role})` : 'Admin',
              note: `ปิดงานเรียบร้อย: ${completionNotes}`,
              status: 'closed',
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    }));

    logAudit('ปิดคำร้องแจ้งซ่อม (Close Repair)', 'repairs', id, undefined, completionNotes);
    
    // Notify requester to rate
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        userId: target.requesterId,
        title: `งานซ่อม ${target.ticketNumber} เสร็จสิ้นแล้ว`,
        message: 'งานซ่อมเสร็จเรียบร้อย กรุณาตรวจสอบและให้คะแนนความพึงพอใจ',
        type: 'success',
        linkUrl: '/maintenance',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addToast('success', 'ปิดงานซ่อมเรียบร้อยแล้ว', 'ส่งแจ้งเตือนให้ผู้รับบริการให้คะแนนความพึงพอใจ');
    return true;
  };

  const rateRepairRequest = async (id: string, rating: number, comment?: string) => {
    await delay(300);
    setRepairs(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, rating, ratingComment: comment, updatedAt: new Date().toISOString() };
      }
      return r;
    }));
    logAudit('ประเมินความพึงพอใจงานซ่อม (Rate Repair)', 'repairs', id, undefined, `คะแนน: ${rating} ดาว`);
    addToast('success', 'ขอบคุณสำหรับการประเมินความพึงพอใจ!');
    return true;
  };

  // Parcel Operations
  const addParcel = async (parcelData: Omit<Parcel, 'id' | 'pickupCode' | 'status' | 'createdAt'>) => {
    await delay(400);
    const pickupCode = 'CF-' + Math.floor(1000 + Math.random() * 9000);
    const newParcel: Parcel = {
      ...parcelData,
      id: 'pcl-' + Date.now(),
      pickupCode,
      status: 'pending_pickup',
      createdAt: new Date().toISOString(),
    };

    setParcels(prev => [newParcel, ...prev]);
    logAudit('บันทึกพัสดุใหม่ (Create Parcel)', 'parcels', newParcel.id, undefined, `${newParcel.courier} ห้อง ${newParcel.unitNumber} รหัส: ${pickupCode}`);
    
    // Notify recipient
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        userId: newParcel.recipientId,
        title: `พัสดุใหม่มาถึงแล้ว (${newParcel.courier})`,
        message: `พัสดุเลขที่ ${newParcel.trackingNumber} นำส่งที่ ${newParcel.pickupPoint} รหัสรับ: ${pickupCode}`,
        type: 'info',
        linkUrl: '/parcels',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addToast('success', 'บันทึกพัสดุสำเร็จ', `รหัสรับพัสดุ: ${pickupCode}`);
    return true;
  };

  const handoverParcel = async (id: string, code: string, staffName?: string) => {
    await delay(350);
    const target = parcels.find(p => p.id === id);
    if (!target) return { success: false, error: 'ไม่พบข้อมูลพัสดุ' };

    if (target.pickupCode.toUpperCase() !== code.trim().toUpperCase()) {
      addToast('error', 'รหัสรับพัสดุไม่ถูกต้อง', 'กรุณาตรวจสอบรหัส 4 หลักที่แสดงบนหน้าจอของผู้รับ');
      return { success: false, error: 'รหัสรับพัสดุไม่ถูกต้อง' };
    }

    setParcels(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'picked_up',
          pickedUpAt: new Date().toISOString(),
          handedOverBy: staffName || currentUser ? `${currentUser?.firstName} ${currentUser?.lastName}` : 'เจ้าหน้าที่นิติบุคคล',
        };
      }
      return p;
    }));

    logAudit('ส่งมอบพัสดุ (Handover Parcel)', 'parcels', id, undefined, `ผู้รับ: ${target.recipientName} รหัส: ${code}`);
    addToast('success', 'ส่งมอบพัสดุเรียบร้อยแล้ว');
    return { success: true };
  };

  // Announcements
  const createAnnouncement = async (data: Omit<Announcement, 'id' | 'createdAt'>) => {
    await delay(400);
    const newAnn: Announcement = {
      ...data,
      id: 'ann-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    logAudit('สร้างประกาศใหม่ (Create Announcement)', 'announcements', newAnn.id, undefined, newAnn.title);
    
    // Broadcast notification to targeted group
    const notifItem: NotificationItem = {
      id: 'notif-' + Date.now(),
      userId: 'all',
      title: `${newAnn.priority === 'urgent' ? '🚨 ประกาศด่วน: ' : '📢 ประกาศ: '}${newAnn.title}`,
      message: newAnn.content.slice(0, 100) + '...',
      type: newAnn.priority === 'urgent' ? 'danger' : 'info',
      linkUrl: '/announcements',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notifItem, ...prev]);

    addToast('success', 'เผยแพร่ประกาศเรียบร้อยแล้ว');
    return true;
  };

  // Notifications read/unread
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    addToast('info', 'ทำเครื่องหมายอ่านแล้วทั้งหมด');
  };

  // Role permissions update
  const updateRolePermissions = async (roleId: string, permissions: RoleDefinition['permissions']) => {
    await delay(400);
    setRoles(prev => prev.map(r => r.id === roleId ? { ...r, permissions } : r));
    logAudit('ปรับปรุงสิทธิ์บทบาท (Update Role Permissions)', 'roles', roleId);
    addToast('success', 'บันทึกการกำหนดสิทธิ์สำเร็จ');
    return true;
  };

  // Reset Demo Data
  const resetDemoData = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    setUsers(INITIAL_USERS);
    setRoles(INITIAL_ROLES);
    setUnits(INITIAL_UNITS);
    setOwners(INITIAL_OWNERS);
    setTenants(INITIAL_TENANTS);
    setContracts(INITIAL_CONTRACTS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setRepairs(INITIAL_REPAIRS);
    setParcels(INITIAL_PARCELS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(INITIAL_USERS[0]);
    setActiveRole('admin');
    setIsMaintenanceMode(false);
    addToast('info', 'รีเซ็ตข้อมูล Mock Data เรียบร้อยแล้ว', 'ข้อมูลระบบถูกคืนค่าเริ่มต้นสำหรับทดสอบ');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        switchDemoRole,
        login,
        logout,
        registerUser,
        updateCurrentUserProfile,
        isDarkMode,
        toggleDarkMode,
        isMaintenanceMode,
        setMaintenanceMode: setIsMaintenanceMode,
        isSessionTimeoutWarning,
        setSessionTimeoutWarning,
        resetDemoData,
        units,
        owners,
        tenants,
        contracts,
        invoices,
        payments,
        repairs,
        parcels,
        announcements,
        notifications,
        auditLogs,
        roles,
        users,
        addUnit,
        updateUnit,
        deleteUnit,
        addOwner,
        updateOwner,
        deleteOwner,
        addTenant,
        updateTenant,
        deleteTenant,
        changeTenantStatus,
        createContract,
        updateContract,
        terminateContract,
        createInvoice,
        batchCreateInvoices,
        cancelInvoice,
        submitPayment,
        verifyPayment,
        createRepairRequest,
        updateRepairStatus,
        closeRepairRequest,
        rateRepairRequest,
        addParcel,
        handoverParcel,
        createAnnouncement,
        markNotificationRead,
        markAllNotificationsRead,
        updateRolePermissions,
        toasts,
        addToast,
        removeToast,
        currentRoute,
        navigateTo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
