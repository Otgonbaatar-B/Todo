export type Priority = "low" | "medium" | "high";

export type Todo = {
  id: string;
  text: string;
  status: "backlog" | "todo" | "in-progress" | "review" | "done";
  priority: Priority;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
};
