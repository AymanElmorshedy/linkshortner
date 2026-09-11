"use client";

import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteLinkAction, updateLinkAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Link } from "@/db/schema";

type LinkActionsProps = {
  link: Link;
};

export function LinkActions({ link }: LinkActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [url, setUrl] = useState(link.originalUrl);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleEdit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const result = await updateLinkAction({ linkId: link.id, url });

    if (!result.success) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    setEditOpen(false);
    router.refresh();
  }

  async function handleDelete(): Promise<void> {
    setIsPending(true);
    setError(null);

    const result = await deleteLinkAction({ linkId: link.id });

    if (!result.success) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    setDeleteOpen(false);
    router.refresh();
  }

  function handleEditOpenChange(open: boolean): void {
    if (!open && !isPending) {
      setError(null);
      setUrl(link.originalUrl);
    }
    setEditOpen(open);
  }

  function handleDeleteOpenChange(open: boolean): void {
    if (!open && !isPending) {
      setError(null);
    }
    setDeleteOpen(open);
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Dialog open={editOpen} onOpenChange={handleEditOpenChange}>
        <DialogTrigger
          render={
            <Button variant="ghost" size="icon" aria-label={`Edit ${link.shortCode}`} title="Edit link" />
          }
        >
          <Pencil />
        </DialogTrigger>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup>
            <div className="space-y-1">
              <DialogTitle>Edit link</DialogTitle>
              <DialogDescription>Update the destination URL for /{link.shortCode}.</DialogDescription>
            </div>
            <form className="space-y-4" onSubmit={handleEdit}>
              <div className="space-y-2">
                <label htmlFor={`edit-url-${link.id}`} className="text-sm font-medium">
                  Destination URL
                </label>
                <Input
                  id={`edit-url-${link.id}`}
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  required
                  disabled={isPending}
                />
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose render={<Button type="button" variant="outline" disabled={isPending} />}>
                  Cancel
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <LoaderCircle className="animate-spin" /> : <Pencil />}
                  {isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </DialogPopup>
        </DialogPortal>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              aria-label={`Delete ${link.shortCode}`}
              title="Delete link"
            />
          }
        >
          <Trash2 />
        </DialogTrigger>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup>
            <div className="space-y-1">
              <DialogTitle>Delete link?</DialogTitle>
              <DialogDescription>
                This will permanently delete /{link.shortCode}. This action cannot be undone.
              </DialogDescription>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="flex justify-end gap-2">
              <DialogClose render={<Button type="button" variant="outline" disabled={isPending} />}>
                Cancel
              </DialogClose>
              <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                {isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
                {isPending ? "Deleting..." : "Delete link"}
              </Button>
            </div>
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </div>
  );
}