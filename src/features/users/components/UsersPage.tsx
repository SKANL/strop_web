/**
 * Main user list page component
 * React Island for the user management section
 */
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Users2, UserPlus } from "lucide-react";
import type { User, UserRole } from "@/lib/mock/types";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { UserCard } from "./UserCard";
import { UserTable } from "./UserTable";
import { UserFilters, type ViewMode } from "./UserFilters";
import { UserInviteDialog } from "./UserInviteDialog";
import { UserDetail } from "./UserDetail";
import { UserEditSheet } from "./UserEditSheet";
import { UserStatusConfirmDialog } from "./UserStatusConfirmDialog";
import { useUsers } from "../hooks/useUsers";

interface UsersPageProps {
  initialUsers?: User[];
}

export function UsersPage({ initialUsers }: UsersPageProps) {
  // State management
  const {
    filteredUsers,
    counts,
    searchQuery,
    roleFilter,
    statusFilter,
    setSearchQuery,
    setRoleFilter,
    setStatusFilter,
    toggleStatus,
    update,
  } = useUsers();

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [statusConfirmUser, setStatusConfirmUser] = useState<User | null>(null);

  // Handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDetailDrawerOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditSheetOpen(true);
    setDetailDrawerOpen(false);
  };

  const handleToggleStatus = (user: User) => {
    setStatusConfirmUser(user);
    setDetailDrawerOpen(false);
  };

  const confirmToggleStatus = () => {
    if (statusConfirmUser) {
      toggleStatus(statusConfirmUser.id);
      setStatusConfirmUser(null);
    }
  };

  const handleEditSuccess = (userId: string, values: Partial<User>) => {
    update(userId, values);
    setEditSheetOpen(false);
    setSelectedUser(null);
  };

  const handleInviteSuccess = () => {
    // In a real app, this would refresh the user list
    console.log("User invited successfully");
  };

  // Stats for display
  const totalUsers = counts.total;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25">
              <Users2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Equipo de Trabajo
              </h1>
              <p className="text-sm text-gray-500">
                Gestiona los usuarios de tu organización
              </p>
            </div>
          </div>

          <Button
            onClick={() => setInviteDialogOpen(true)}
            className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invitar Usuario
          </Button>
        </motion.div>

        {/* Filters */}
        <UserFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalUsers={totalUsers}
          filteredCount={filteredUsers.length}
          counts={counts}
        />

        {/* User List */}
        <AnimatePresence mode="wait">
          {filteredUsers.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <Users2 className="h-12 w-12 text-gray-400" />
                  </EmptyMedia>
                  <EmptyTitle>
                    {searchQuery || roleFilter !== "ALL" || statusFilter !== "ALL"
                      ? "No se encontraron usuarios"
                      : "Sin usuarios"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {searchQuery || roleFilter !== "ALL" || statusFilter !== "ALL"
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Invita a miembros de tu equipo para comenzar"}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  {searchQuery || roleFilter !== "ALL" || statusFilter !== "ALL" ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setRoleFilter("ALL");
                        setStatusFilter("ALL");
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  ) : (
                    <Button onClick={() => setInviteDialogOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invitar Usuario
                    </Button>
                  )}
                </EmptyContent>
              </Empty>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredUsers.map((user, index) => (
                <UserCard
                  key={user.id}
                  user={user}
                  index={index}
                  onView={handleViewUser}
                  onEdit={handleEditUser}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <UserTable
                users={filteredUsers}
                onView={handleViewUser}
                onEdit={handleEditUser}
                onToggleStatus={handleToggleStatus}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialogs and Sheets */}
        <UserInviteDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
          onSuccess={handleInviteSuccess}
        />

        <UserDetail
          user={selectedUser}
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          onEdit={handleEditUser}
          onToggleStatus={handleToggleStatus}
        />

        <UserEditSheet
          user={selectedUser}
          open={editSheetOpen}
          onOpenChange={setEditSheetOpen}
          onSuccess={handleEditSuccess}
        />

        <UserStatusConfirmDialog
          user={statusConfirmUser}
          open={!!statusConfirmUser}
          onOpenChange={(open: boolean) => !open && setStatusConfirmUser(null)}
          onConfirm={confirmToggleStatus}
        />
      </div>
    </TooltipProvider>
  );
}
