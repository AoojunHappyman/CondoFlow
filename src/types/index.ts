// CondoFlow TypeScript Definitions

export type UserRole = 'admin' | 'owner' | 'tenant' | 'user';

export interface User {
  id: string;
  username: string;
  password?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  idCard: string; // Plain or masked
  role: UserRole;
  status: 'active' | 'suspended';
  avatar: string;
  address: string;
  unitId?: string; // If tenant
  unitNumber?: string;
  ownedUnitIds?: string[]; // If owner
  createdAt: string;
  lastLoginAt: string;
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'manage_permissions';

export type SystemModule = 
  | 'users' 
  | 'units' 
  | 'owners' 
  | 'tenants' 
  | 'contracts' 
  | 'invoices' 
  | 'payments' 
  | 'repairs' 
  | 'parcels' 
  | 'announcements' 
  | 'reports' 
  | 'audit_log';

export interface RolePermission {
  module: SystemModule;
  actions: PermissionAction[];
}

export interface RoleDefinition {
  id: string;
  name: string;
  roleKey: UserRole | string;
  description: string;
  isSystem: boolean;
  userCount: number;
  permissions: Record<SystemModule, PermissionAction[]>;
}

export type UnitStatus = 'vacant' | 'occupied' | 'pending_move_in' | 'under_repair' | 'renovating';

export interface Unit {
  id: string;
  unitNumber: string; // e.g. "A-1205"
  building: 'A' | 'B';
  floor: number;
  roomType: 'Studio' | '1 Bedroom' | '2 Bedroom' | 'Penthouse';
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  rentPrice: number;
  commonFee: number;
  ownerId?: string;
  ownerName?: string;
  currentTenantId?: string;
  currentTenantName?: string;
  status: UnitStatus;
  description: string;
  images: string[];
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idCard: string;
  address: string;
  ownedUnitIds: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export type TenantStatus = 
  | 'pending_verification' 
  | 'pending_move_in' 
  | 'renting' 
  | 'expiring_soon' 
  | 'moved_out' 
  | 'suspended';

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idCard: string;
  currentUnitId?: string;
  currentUnitNumber?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  status: TenantStatus;
  accountStatus: 'active' | 'suspended';
  statusReason?: string;
  createdAt: string;
}

export type ContractStatus = 
  | 'draft' 
  | 'pending_start' 
  | 'active' 
  | 'expiring_soon' 
  | 'expired' 
  | 'terminated';

export interface LeaseContract {
  id: string;
  contractNumber: string; // e.g. "CNT-2026-001"
  unitId: string;
  unitNumber: string;
  ownerId: string;
  ownerName: string;
  tenantId: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  paymentDueDay: number;
  additionalTerms: string;
  attachments: string[];
  status: ContractStatus;
  terminatedReason?: string;
  terminatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'rent' 
  | 'common_fee' 
  | 'water' 
  | 'electric' 
  | 'penalty' 
  | 'damage' 
  | 'other';

export type InvoiceStatus = 
  | 'draft' 
  | 'pending' 
  | 'due_soon' 
  | 'overdue' 
  | 'verifying' 
  | 'paid' 
  | 'cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-11-001"
  recipientId: string;
  recipientName: string;
  recipientRole: 'tenant' | 'owner';
  unitId: string;
  unitNumber: string;
  billingCycle: string; // e.g. "พฤศจิกายน 2569"
  category: ExpenseCategory;
  items: InvoiceItem[];
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  note?: string;
  receiptNumber?: string;
  paidAt?: string;
  createdAt: string;
}

export type PaymentStatus = 'pending_verification' | 'approved' | 'rejected';

export interface Payment {
  id: string;
  paymentNumber: string; // e.g. "PAY-2026-11-001"
  invoiceId: string;
  invoiceNumber: string;
  payerId: string;
  payerName: string;
  unitNumber: string;
  invoiceAmount: number;
  paidAmount: number;
  paymentDate: string;
  paymentTime: string;
  sourceBank: string;
  paymentMethod: 'transfer' | 'promptpay' | 'credit_card';
  referenceNumber: string;
  slipUrl: string;
  status: PaymentStatus;
  rejectionReason?: string;
  internalNote?: string;
  receiptNumber?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
}

export type RepairCategory = 
  | 'electrical' 
  | 'plumbing' 
  | 'aircon' 
  | 'doors_windows' 
  | 'furniture' 
  | 'elevator' 
  | 'common_facility' 
  | 'internet' 
  | 'other';

export type RepairUrgency = 'low' | 'normal' | 'high' | 'emergency';

export type RepairStatus = 
  | 'submitted' 
  | 'received' 
  | 'pending_appointment' 
  | 'assigned' 
  | 'in_progress' 
  | 'waiting_parts' 
  | 'completed' 
  | 'closed' 
  | 'rejected';

export interface RepairUpdate {
  id: string;
  timestamp: string;
  actor: string;
  note: string;
  status: RepairStatus;
}

export interface RepairRequest {
  id: string;
  ticketNumber: string; // e.g. "REP-2026-001"
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  phone: string;
  areaType: 'unit' | 'common_area';
  location: string;
  category: RepairCategory;
  title: string;
  description: string;
  urgency: RepairUrgency;
  convenientDate: string;
  convenientTime: string;
  contactChannel: string;
  photos: string[];
  status: RepairStatus;
  assignedTechnician?: string;
  appointmentDate?: string;
  completionNotes?: string;
  completionPhotos?: string[];
  rating?: number; // 1-5
  ratingComment?: string;
  rejectionReason?: string;
  updates: RepairUpdate[];
  createdAt: string;
  updatedAt: string;
}

export type ParcelStatus = 
  | 'arrived' 
  | 'notified' 
  | 'pending_pickup' 
  | 'picked_up' 
  | 'returned' 
  | 'recipient_not_found';

export interface Parcel {
  id: string;
  trackingNumber: string;
  courier: string;
  recipientId: string;
  recipientName: string;
  unitNumber: string;
  arrivedAt: string;
  pickupPoint: string;
  pickupCode: string; // e.g. "CF-9204"
  parcelPhoto?: string;
  status: ParcelStatus;
  pickedUpAt?: string;
  handedOverBy?: string;
  createdAt: string;
}

export type AnnouncementCategory = 
  | 'general' 
  | 'maintenance' 
  | 'utility_cut' 
  | 'payment_reminder' 
  | 'emergency' 
  | 'activity' 
  | 'regulation';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  attachment?: string;
  targetAudience: 'all' | 'tenants' | 'owners' | 'building' | 'floor' | 'unit';
  targetBuilding?: string;
  targetFloor?: number;
  targetUnit?: string;
  startDate: string;
  endDate: string;
  priority: 'normal' | 'important' | 'urgent';
  isPinned: boolean;
  status: 'published' | 'scheduled' | 'archived';
  authorName: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string | 'all';
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface TransactionHistory {
  id: string;
  userId: string;
  timestamp: string;
  category: 'invoice' | 'payment' | 'repair' | 'parcel' | 'contract' | 'profile' | 'notification';
  title: string;
  details: string;
  status: string;
  actor: string;
  referenceId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  role: string;
  action: string;
  module: string;
  recordId: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  device: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
