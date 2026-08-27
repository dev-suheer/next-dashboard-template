"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, HelpCircleIcon } from "@hugeicons/core-free-icons";
import { faqs as seedFaqs, type Faq, type FaqCategory } from "@/mock-data/faqs";
import { FaqItem } from "./faq-item";
import { FaqDialog } from "./faq-dialog";

type Draft = { question: string; answer: string; category: FaqCategory };

export function FaqContent() {
  const [items, setItems] = useState<Faq[]>(seedFaqs);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Faq | null>(null);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(faq: Faq) {
    setEditing(faq);
    setFormOpen(true);
  }

  function handleSubmit(draft: Draft) {
    if (editing) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editing.id ? { ...item, ...draft } : item
        )
      );
      return;
    }
    setItems((prev) => [
      { id: `f${Date.now()}`, ...draft },
      ...prev,
    ]);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setItems((prev) => prev.filter((item) => item.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              FAQs
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add, edit, or remove the questions shown in your help centre.
            </p>
          </div>
          <Button size="sm" className="h-9 gap-1.5 shrink-0" onClick={openAdd}>
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
            Add FAQ
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-border bg-muted/40">
              <HugeiconsIcon
                icon={HelpCircleIcon}
                className="size-5 text-muted-foreground"
              />
            </div>
            <p className="mt-3 text-sm font-medium">No FAQs yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first question to get the help centre started.
            </p>
            <Button size="sm" className="mt-4 gap-1.5" onClick={openAdd}>
              <HugeiconsIcon icon={Add01Icon} className="size-4" />
              Add FAQ
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "question" : "questions"}
            </p>
            <div className="grid gap-3">
              {items.map((faq, index) => (
                <FaqItem
                  key={faq.id}
                  faq={faq}
                  index={index + 1}
                  onEdit={() => openEdit(faq)}
                  onDelete={() => setPendingDelete(faq)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <FaqDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        faq={editing}
        onSubmit={handleSubmit}
      />

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this FAQ?</DialogTitle>
            <DialogDescription>
              “{pendingDelete?.question}” will be removed from the help centre.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPendingDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
