/**
 * User state management hook using Nanostores
 * Provides reactive state for user data with mock data integration
 */

import { atom, computed } from "nanostores";
import { useStore } from "@nanostores/react";
import type { User, UserRole, ProjectMemberWithDetails } from "@/lib/mock/types";
import { mockUsers, getUserById as getMockUserById } from "@/lib/mock/users";
import { getUserProjectsWithDetails } from "@/lib/mock/project-members";

// ============================================
// ATOMS (Base State)
// ============================================

/**
 * Loading state for users
 */
export const $usersLoading = atom<boolean>(false);

/**
 * Error state for users
 */
export const $usersError = atom<string | null>(null);

/**
 * Raw users data
 */
export const $users = atom<User[]>(mockUsers);

/**
 * Currently selected user ID
 */
export const $selectedUserId = atom<string | null>(null);

/**
 * Filter: search query
 */
export const $userSearchQuery = atom<string>("");

/**
 * Filter: role filter
 */
export const $userRoleFilter = atom<UserRole | "ALL">("ALL");

/**
 * Filter: status filter (active/inactive/all)
 */
export const $userStatusFilter = atom<"ACTIVE" | "INACTIVE" | "ALL">("ALL");

// ============================================
// COMPUTED (Derived State)
// ============================================

/**
 * Get active users
 */
export const $activeUsers = computed($users, (users) =>
  users.filter((u) => u.isActive && !u.deletedAt)
);

/**
 * Get inactive users
 */
export const $inactiveUsers = computed($users, (users) =>
  users.filter((u) => !u.isActive && !u.deletedAt)
);

/**
 * Get users filtered by search and filters
 */
export const $filteredUsers = computed(
  [$users, $userSearchQuery, $userRoleFilter, $userStatusFilter],
  (users, query, roleFilter, statusFilter) => {
    let result = users.filter((u) => !u.deletedAt);

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(lowerQuery) ||
          u.email.toLowerCase().includes(lowerQuery) ||
          u.phone?.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by role
    if (roleFilter !== "ALL") {
      result = result.filter((u) => u.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((u) =>
        statusFilter === "ACTIVE" ? u.isActive : !u.isActive
      );
    }

    return result;
  }
);

/**
 * Currently selected user object
 */
export const $selectedUser = computed(
  [$users, $selectedUserId],
  (users, id) => (id ? users.find((u) => u.id === id) ?? null : null)
);

/**
 * User counts by role
 */
export const $userCounts = computed($users, (users) => {
  const active = users.filter((u) => u.isActive && !u.deletedAt);
  return {
    total: users.filter((u) => !u.deletedAt).length,
    active: active.length,
    inactive: users.filter((u) => !u.isActive && !u.deletedAt).length,
    byRole: {
      OWNER: active.filter((u) => u.role === "OWNER").length,
      SUPERINTENDENT: active.filter((u) => u.role === "SUPERINTENDENT").length,
      RESIDENT: active.filter((u) => u.role === "RESIDENT").length,
      CABO: active.filter((u) => u.role === "CABO").length,
    },
  };
});

// ============================================
// ACTIONS
// ============================================

/**
 * Refresh users from data source
 */
export async function refreshUsers(): Promise<void> {
  $usersLoading.set(true);
  $usersError.set(null);

  try {
    // Simulate API call - in production, this would fetch from Supabase
    await new Promise((resolve) => setTimeout(resolve, 500));
    $users.set(mockUsers);
  } catch (error) {
    $usersError.set(
      error instanceof Error ? error.message : "Error al cargar usuarios"
    );
  } finally {
    $usersLoading.set(false);
  }
}

/**
 * Select a user by ID
 */
export function selectUser(id: string | null): void {
  $selectedUserId.set(id);
}

/**
 * Update user search query
 */
export function setUserSearchQuery(query: string): void {
  $userSearchQuery.set(query);
}

/**
 * Update role filter
 */
export function setUserRoleFilter(role: UserRole | "ALL"): void {
  $userRoleFilter.set(role);
}

/**
 * Update status filter
 */
export function setUserStatusFilter(status: "ACTIVE" | "INACTIVE" | "ALL"): void {
  $userStatusFilter.set(status);
}

/**
 * Clear all filters
 */
export function clearUserFilters(): void {
  $userSearchQuery.set("");
  $userRoleFilter.set("ALL");
  $userStatusFilter.set("ALL");
}

/**
 * Optimistic update for user status (activate/deactivate)
 */
export function toggleUserStatus(id: string): void {
  $users.set(
    $users.get().map((user) =>
      user.id === id
        ? { ...user, isActive: !user.isActive, updatedAt: new Date().toISOString() }
        : user
    )
  );
}

/**
 * Optimistic update for user role
 */
export function updateUserRole(id: string, role: UserRole): void {
  $users.set(
    $users.get().map((user) =>
      user.id === id
        ? { ...user, role, updatedAt: new Date().toISOString() }
        : user
    )
  );
}

/**
 * Optimistic update for user data
 */
export function updateUser(id: string, data: Partial<User>): void {
  $users.set(
    $users.get().map((user) =>
      user.id === id
        ? { ...user, ...data, updatedAt: new Date().toISOString() }
        : user
    )
  );
}

/**
 * Add new user (optimistic)
 */
export function addUser(user: User): void {
  $users.set([...$users.get(), user]);
}

/**
 * Soft delete user
 */
export function deleteUser(id: string): void {
  $users.set(
    $users.get().map((user) =>
      user.id === id
        ? { ...user, deletedAt: new Date().toISOString() }
        : user
    )
  );
}

// ============================================
// HOOK
// ============================================

/**
 * React hook for user state
 * Provides reactive access to user data and actions
 */
export function useUsers() {
  const users = useStore($users);
  const filteredUsers = useStore($filteredUsers);
  const isLoading = useStore($usersLoading);
  const error = useStore($usersError);
  const selectedUser = useStore($selectedUser);
  const counts = useStore($userCounts);
  const searchQuery = useStore($userSearchQuery);
  const roleFilter = useStore($userRoleFilter);
  const statusFilter = useStore($userStatusFilter);

  return {
    // State
    users,
    filteredUsers,
    isLoading,
    error,
    selectedUser,
    counts,
    searchQuery,
    roleFilter,
    statusFilter,

    // Actions
    refresh: refreshUsers,
    select: selectUser,
    setSearchQuery: setUserSearchQuery,
    setRoleFilter: setUserRoleFilter,
    setStatusFilter: setUserStatusFilter,
    clearFilters: clearUserFilters,
    toggleStatus: toggleUserStatus,
    updateRole: updateUserRole,
    update: updateUser,
    add: addUser,
    delete: deleteUser,
  };
}

/**
 * Hook for getting a single user by ID
 */
export function useUser(userId: string | null) {
  const users = useStore($users);
  return userId ? users.find((u) => u.id === userId) ?? null : null;
}

/**
 * Hook for filtered users by role
 */
export function useUsersByRole(role: UserRole) {
  const users = useStore($users);
  return users.filter((u) => u.role === role && u.isActive && !u.deletedAt);
}

/**
 * Get user by ID (helper function)
 */
export function getUserById(id: string): User | undefined {
  return $users.get().find((u) => u.id === id);
}
