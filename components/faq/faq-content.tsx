"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, HelpCircleIcon } from "@hugeicons/core-free-icons";
import {
  faqCategories,
  faqs as seedFaqs,
  type Faq,
  type FaqCategory,
} from "@/mock-data/faqs";
import { FaqItem } from "./faq-item";
import { FaqDialog } from "./faq-dialog";
import { allCategoryStyle, categoryStyles } from "./category-styles";

type Draft = { question: string; answer: string; category: FaqCategory };
type Tab = "All" | FaqCategory;

export function FaqContent() {
  const [items, setItems] = useState<Faq[]>(seedFaqs);
  const [tab, setTab] = useState<Tab>("All");
  const [editing, setEditing] = useState<Faq | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Faq | null>(null);

  const counts = useMemo(() => {
    const byCategory = new Map<FaqCategory, number>();
    for (const category of faqCategories) byCategory.set(category, 0);
    for (const item of items) {
      byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + 1);
    }
    return byCategory;
  }, [items]);

  const visible = useMemo(
    () => (tab === "All" ? items : items.filter((i) => i.category === tab)),
    [items, tab]
  );

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
    setItems((prev) => [{ id: `f${Date.now()}`, ...draft }, ...prev]);
    setTab((current) =>
      current === "All" || current === draft.category ? current : draft.category
    );
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setItems((prev) => prev.filter((item) => item.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  const tabs: Tab[] = ["All", ...faqCategories];

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-4 h-full">
      <div className="w-full space-y-6 mt-4">
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

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
          className="gap-0"
        >
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <TabsList className="h-auto">
              {tabs.map((name) => {
                const count =
                  name === "All" ? items.length : (counts.get(name) ?? 0);
                return (
                  <TabsTrigger key={name} value={name} className="h-8 gap-1.5">
                    {name}
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                        name === "All"
                          ? allCategoryStyle
                          : categoryStyles[name]
                      )}
                    >
                      {count}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </Tabs>

        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-border bg-muted/40">
              <HugeiconsIcon
                icon={HelpCircleIcon}
                className="size-5 text-muted-foreground"
              />
            </div>
            <p className="mt-3 text-sm font-medium">
              {tab === "All" ? "No FAQs yet" : `No FAQs in ${tab}`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "All"
                ? "Add your first question to get the help centre started."
                : "Add a question to this category, or switch to another tab."}
            </p>
            <Button size="sm" className="mt-4 gap-1.5" onClick={openAdd}>
              <HugeiconsIcon icon={Add01Icon} className="size-4" />
              Add FAQ
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {visible.map((faq, index) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                index={index + 1}
                onEdit={() => openEdit(faq)}
                onDelete={() => setPendingDelete(faq)}
              />
            ))}
          </div>
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
