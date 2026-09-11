"use client";

import { Link2, LoaderCircle, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createLinkAction } from "@/app/dashboard/actions";
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

export function CreateLinkDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const result = await createLinkAction({ url });

    if (!result.success) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setUrl("");
    setIsPending(false);
    setOpen(false);
    router.refresh();
  }

  function handleOpenChange(nextOpen: boolean): void {
    if (!nextOpen && !isPending) {
      setError(null);
    }
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="lg" />}>
        <Plus className="size-4" />
        Create link
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <div className="space-y-1">
            <DialogTitle className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Link2 className="size-4" />
              </span>
              Create a short link
            </DialogTitle>
            <DialogDescription>
              Paste a long URL and we will create a shareable short link for it.
            </DialogDescription>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="original-url" className="text-sm font-medium">
                Destination URL
              </label>
              <Input
                id="original-url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                autoFocus
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
                {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Link2 className="size-4" />}
                {isPending ? "Creating..." : "Create link"}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}