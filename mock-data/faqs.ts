export type FaqCategory = "General" | "Projects" | "Tasks" | "Team" | "Billing";

export const faqCategories: FaqCategory[] = [
  "General",
  "Projects",
  "Tasks",
  "Team",
  "Billing",
];

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
}

export const faqs: Faq[] = [
  {
    id: "f1",
    question: "How do I create a new project?",
    answer:
      "Open the Projects table and select New. Give the project a name, pick an owner and a due date, and it appears in the table straight away. Everything else — progress, task counts, status — updates as work is logged against it.",
    category: "Projects",
  },
  {
    id: "f2",
    question: "What do the project statuses mean?",
    answer:
      "In Progress means active work is being logged. On Hold means the project is paused but not cancelled, so it still counts toward your totals. Completed means every task is closed and the progress bar has reached 100%.",
    category: "Projects",
  },
  {
    id: "f3",
    question: "Can I change a project's owner after it is created?",
    answer:
      "Yes. Open the project row, choose Edit, and pick a different owner. Reassigning does not move the project's task history — it only changes who is accountable from that point on.",
    category: "Projects",
  },
  {
    id: "f4",
    question: "How is the progress percentage calculated?",
    answer:
      "Progress is the share of a project's tasks that are closed: completed tasks divided by total tasks. It is derived automatically, so you cannot set it by hand — close tasks and the bar moves.",
    category: "Tasks",
  },
  {
    id: "f5",
    question: "Why does a task still show as due today after I finish it?",
    answer:
      "Today's Tasks lists everything scheduled for the current day, whether or not it is closed. Use the filter to narrow the list down to a single project if the view feels crowded.",
    category: "Tasks",
  },
  {
    id: "f6",
    question: "Can I filter tasks by more than one project at a time?",
    answer:
      "Yes. The project filter is multi-select, so you can tick several projects and see their tasks side by side. Clear the filter to return to the full list.",
    category: "Tasks",
  },
  {
    id: "f7",
    question: "How do I invite a teammate?",
    answer:
      "Team members are added from the workspace settings. Once someone joins, they can be set as a project owner and their open tasks start appearing in the team workload chart.",
    category: "Team",
  },
  {
    id: "f8",
    question: "What does the team workload chart actually measure?",
    answer:
      "It counts open tasks per owner — total tasks minus completed ones — and shows the busiest people first. It is a snapshot of who is carrying the most right now, not a record of hours worked.",
    category: "Team",
  },
  {
    id: "f9",
    question: "Where can I update my name, email, or photo?",
    answer:
      "Open the user menu in the top right and choose Profile. The General tab covers your name, email, phone number, and profile photo; the Password tab handles your credentials.",
    category: "General",
  },
  {
    id: "f10",
    question: "Can I switch between light and dark mode?",
    answer:
      "Yes. The theme toggle sits in the header next to your avatar and follows your system setting by default. Your choice is remembered the next time you sign in.",
    category: "General",
  },
  {
    id: "f11",
    question: "How do I change the plan for my workspace?",
    answer:
      "Billing is managed from the workspace settings by anyone with an admin role. Changing plan takes effect immediately and the next invoice is prorated for the part of the cycle you have already used.",
    category: "Billing",
  },
  {
    id: "f12",
    question: "What happens to my data if I cancel?",
    answer:
      "Your workspace stays readable until the end of the billing period, then moves to a read-only archive for 30 days. You can export projects and tasks at any point during that window.",
    category: "Billing",
  },
];
