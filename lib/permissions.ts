export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export interface PagePermissions {
    view: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
}

export interface UserPermissions {
    dashboard?: PagePermissions;
    transactions?: PagePermissions;
    categories?: PagePermissions;
    reports?: PagePermissions;
    users?: PagePermissions;
    settings?: PagePermissions;
    [key: string]: PagePermissions | undefined;
}

export const DEFAULT_PERMISSIONS: UserPermissions = {
    dashboard: { view: true },
    transactions: { view: true, create: true, update: true, delete: true },
    categories: { view: true, create: true, update: true, delete: true },
    reports: { view: true },
    users: { view: false },
    settings: { view: false },
};

export const ADMIN_PERMISSIONS: UserPermissions = {
    dashboard: { view: true },
    transactions: { view: true, create: true, update: true, delete: true },
    categories: { view: true, create: true, update: true, delete: true },
    reports: { view: true },
    users: { view: true, create: true, update: true, delete: true },
    settings: { view: true, create: true, update: true, delete: true },
};

export const PAGES_METADATA = [
    { id: 'dashboard', name: 'Dashboard', actions: ['view'] },
    { id: 'transactions', name: 'Transaksi', actions: ['view', 'create', 'update', 'delete'] },
    { id: 'categories', name: 'Kategori', actions: ['view', 'create', 'update', 'delete'] },
    { id: 'reports', name: 'Laporan', actions: ['view'] },
    { id: 'users', name: 'Pengguna', actions: ['view', 'create', 'update', 'delete'] },
    { id: 'settings', name: 'Pengaturan', actions: ['view', 'create', 'update', 'delete'] },
] as const;
