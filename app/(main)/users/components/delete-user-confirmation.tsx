"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThreeDots } from "react-loader-spinner";

// --------------------- DeleteUserConfirmation ---------------------
interface DeleteUserConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  loadingDeleteUser: boolean;
}

export function DeleteUserConfirmation({
  isOpen,
  onClose,
  onConfirm,
  userName,
  loadingDeleteUser,
}: DeleteUserConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete the user <strong>{userName}</strong>
            ? This action cannot be undone and will remove all associated data
            such as orders, inventory adjustments, and activity logs.
          </p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            disabled={loadingDeleteUser}
            className="flex-1"
            variant="destructive"
            onClick={onConfirm}
          >
            <span className={`${loadingDeleteUser ? "hidden" : "block"}`}>
              Delete
            </span>
            <ThreeDots
              visible={true}
              height="30"
              width="30"
              color="#fff"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperClass={`${loadingDeleteUser ? "block" : "!hidden"}`}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
