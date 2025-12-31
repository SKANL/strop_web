/**
 * User feature exports
 * Public API for the user management feature
 */

// Components
export { UsersPage } from "./components/UsersPage";
export { UserCard } from "./components/UserCard";
export { UserTable } from "./components/UserTable";
export { UserFilters } from "./components/UserFilters";
export { UserRoleBadge, UserRoleIcon } from "./components/UserRoleBadge";
export { UserStatusIndicator, UserStatusBadge } from "./components/UserStatusIndicator";
export { UserInviteDialog } from "./components/UserInviteDialog";
export { UserDetail } from "./components/UserDetail";
export { UserEditSheet } from "./components/UserEditSheet";
export { UserStatusConfirmDialog } from "./components/UserStatusConfirmDialog";

// Hooks
export {
  useUsers,
  useUser,
  useUsersByRole,
  getUserById,
} from "./hooks/useUsers";

// Types (re-export from mock types)
export type { User, UserRole, UserUI } from "@/lib/mock/types";
