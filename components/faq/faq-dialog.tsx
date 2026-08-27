"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { faqCategories, type Faq, type FaqCategory } from "@/mock-data/faqs";

type Draft = { question: string; answer: string; category: FaqCategory };
type Errors = Partial<Record<"question" | "answer", string>>;

function FaqForm({
  faq,
  onCancel,
  onSubmit,
}: {
  faq: Faq | null;
  onCancel: () => void;
  onSubmit: (draft: Draft) => void;
}) {
  const questionId = useId();
  const answerId = useId();
  const categoryId = useId();

  const [draft, setDraft] = useState<Draft>({
    question: faq?.question ?? "",
    answer: faq?.answer ?? "",
    category: faq?.category ?? "General",
  });
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors: Errors = {};
    if (!draft.question.trim()) nextErrors.question = "Question is required.";
    if (!draft.answer.trim()) nextErrors.answer = "Answer is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      question: draft.question.trim(),
      answer: draft.answer.trim(),
      category: draft.category,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-2">
        <Label htmlFor={questionId}>Question</Label>
        <Input
          id={questionId}
          value={draft.question}
          onChange={(e) => {
            setDraft((d) => ({ ...d, question: e.target.value }));
            setErrors((p) => ({ ...p, question: undefined }));
          }}
          placeholder="How do I create a new project?"
          autoFocus
          aria-invalid={Boolean(errors.question) || undefined}
        />
        {errors.question && (
          <p className="text-xs text-destructive">{errors.question}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={answerId}>Answer</Label>
        <Textarea
          id={answerId}
          value={draft.answer}
          onChange={(e) => {
            setDraft((d) => ({ ...d, answer: e.target.value }));
            setErrors((p) => ({ ...p, answer: undefined }));
          }}
          placeholder="Explain it in a sentence or two."
          rows={5}
          aria-invalid={Boolean(errors.answer) || undefined}
        />
        {errors.answer && (
          <p className="text-xs text-destructive">{errors.answer}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={categoryId}>Category</Label>
        <Select
          value={draft.category}
          onValueChange={(value) =>
            setDraft((d) => ({ ...d, category: value as FaqCategory }))
          }
        >
          <SelectTrigger id={categoryId} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {faqCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          {faq ? "Save changes" : "Add FAQ"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function FaqDialog({
  open,
  onOpenChange,
  faq,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: Faq | null;
  onSubmit: (draft: Draft) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          <DialogDescription>
            {faq
              ? "Update the question, answer, or category."
              : "Add a question and answer to the help centre."}
          </DialogDescription>
        </DialogHeader>

        <FaqForm
          key={faq?.id ?? "new"}
          faq={faq}
          onCancel={() => onOpenChange(false)}
          onSubmit={(draft) => {
            onSubmit(draft);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
