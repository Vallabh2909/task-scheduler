"use client";

import * as React from "react";
import {
  Moon,
  Sun,
  Plus,
  Briefcase,
  User,
  AlertCircle,
  Calendar as CalendarIcon,
  Settings,
  LayoutDashboard,
  CheckSquare,
  Trash2,
  RefreshCw,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isSameDay, parseISO } from "date-fns";
import Link from "next/link";

export default function TaskSchedulerHomepage() {
  const [darkMode, setDarkMode] = React.useState(() => {
    // Check if the user has a preference stored in localStorage
    const storedTheme = localStorage.getItem("darkMode");

    return storedTheme;
  });
  const [tasks, setTasks] = React.useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [date, setDate] = React.useState(new Date());
  const [rescheduleTask, setRescheduleTask] = React.useState(null);
  const today = new Date();
  const categories = [
    { name: "Work", icon: Briefcase },
    { name: "Personal", icon: User },
    { name: "Urgent", icon: AlertCircle },
  ];

  const stats = {
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.length - tasks.filter((task) => task.completed).length,
    totalTime: tasks.reduce((total, task) => total + (task.duration || 0), 0),
  };

  const getWorkloadColor = (hours) => {
    if (hours < 4) return "bg-green-500";
    if (hours < 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTodaysTasks = () => {
    return sortedTasks.filter((task) => isSameDay(parseISO(task.date), today));
  };

  const calculateMonthlyWorkload = (year, month) => {
    const workload = {};
    tasks.forEach((task) => {
      const taskDate = new Date(task.date);
      if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
        const dateKey = taskDate.toISOString().split("T")[0];
        if (dateKey in workload) {
          workload[dateKey] += task.duration || 0;
        } else {
          workload[dateKey] = task.duration || 0;
        }
      }
    });
    return workload;
  };

  const monthlyWorkload = React.useMemo(
    () => calculateMonthlyWorkload(date.getFullYear(), date.getMonth()),
    [date, tasks]
  );

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const addTask = (task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
  };

  const completeTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const updateTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    return (a.duration || 0) - (b.duration || 0);
  });

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground",
        darkMode ? "dark" : ""
      )}
    >
      <nav className="flex items-center justify-between border-b px-6 py-4">
        <div className="text-2xl font-bold">TaskMaster</div>
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/tasks">
            <Button variant="ghost">
              <CheckSquare className="mr-2 h-4 w-4" />
              Tasks
            </Button>
          </Link>
          <Button variant="ghost">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className="ml-4"
          />
        </div>
      </nav>
      <div className="flex">
        <aside className="w-80 border-r p-4">
          <div className="mb-6">
            <h2 className="mb-2 font-semibold">Categories</h2>
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                className="w-full justify-start"
              >
                <category.icon className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
          <div>
            <h2 className="mb-2 font-semibold">Workload Calendar</h2>
            <div className="rounded-md p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-lg border text-[#18181b] border-gray-300 shadow-md transition-all duration-200 hover:shadow-lg"
                components={{
                  Day: ({ date, ...props }) => {
                    const dateKey = date.toISOString().split("T")[0];
                    const workload = monthlyWorkload[dateKey] || 0;
                    const colorClass = getWorkloadColor(workload);
                    return (
                      <div
                        {...props}
                        className={cn(
                          props.className,
                          "flex items-center justify-center w-8 h-8 p-1 transition-all duration-200 rounded-full hover:bg-gray-200 aria-selected:bg-blue-200 aria-selected:text-blue-600",
                          colorClass,
                          workload > 0 && "text-primary-foreground"
                        )}
                      >
                        {date.getDate()}
                      </div>
                    );
                  },
                }}
              />
            </div>
            <div className="mt-2 text-sm">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                <span>&lt; 4 hours</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                <span>4-6 hours</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                <span>&gt; 6 hours</span>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="mb-6 rounded-lg bg-blue-100 p-4 dark:bg-blue-900">
            <h2 className="mb-2 text-lg font-semibold">Next Upcoming Task</h2>
            <p className="text-sm">
              {tasks.length > 0
                ? "Next task: " + sortedTasks[0].title
                : "No upcoming tasks."}
            </p>
          </div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Todays Tasks</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Add New Task
                  </DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    const task = {
                      id: Date.now(),
                      title: form.task.value,
                      description: form.description.value,
                      category: form.category.value,
                      priority: form.priority.value,
                      duration: Number(form.duration.value),
                      completed: false,
                      date: date.toISOString(),
                    };
                    addTask(task);
                    form.reset();
                    setDate(new Date());
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="task" className="text-sm font-medium">
                        Task Title
                      </Label>
                      <Input
                        id="task"
                        name="task"
                        placeholder="Enter task title"
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter task description"
                        className="mt-1 block w-full resize-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <RadioGroup
                      name="priority"
                      defaultValue="medium"
                      className="mt-2 flex space-x-4"
                    >
                      {["low", "medium", "high"].map((priority) => (
                        <div key={priority} className="flex items-center">
                          <RadioGroupItem value={priority} id={priority} />
                          <Label htmlFor={priority} className="ml-2 capitalize">
                            {priority}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "mt-1 w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-sm font-medium">
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        className="mt-1 block w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-sm font-medium">
                      Estimated Time to Complete (in hours)
                    </Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        placeholder="Enter time in hours"
                        className="w-full"
                        required
                      />
                      <span className="ml-2">hours</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category
                    </Label>
                    <Select id="category" name="category">
                      <SelectTrigger className="mt-1 block w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Add Task
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            {getTodaysTasks().map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={cn("h-3 w-3 rounded-full", {
                      "bg-red-500": task.priority === "high",
                      "bg-yellow-500": task.priority === "medium",
                      "bg-green-500": task.priority === "low",
                    })}
                  />
                  <span className="font-medium">{task.title}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{task.category}</span>
                  {!task.completed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => completeTask(task.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRescheduleTask(task)}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reschedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Reschedule Task</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target;
                          const updatedTask = {
                            ...rescheduleTask,
                            date: new Date(
                              form.date.value + "T" + form.time.value
                            ).toISOString(),
                          };
                          updateTask(updatedTask);
                          setRescheduleTask(null);
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="reschedule-title">Task Title</Label>
                          <Input
                            id="reschedule-title"
                            value={rescheduleTask?.title}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label htmlFor="reschedule-date">New Date</Label>
                          <Input
                            id="reschedule-date"
                            name="date"
                            type="date"
                            defaultValue={rescheduleTask?.date.split("T")[0]}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="reschedule-time">New Time</Label>
                          <Input
                            id="reschedule-time"
                            name="time"
                            type="time"
                            defaultValue={rescheduleTask?.date
                              .split("T")[1]
                              .substring(0, 5)}
                            required
                          />
                        </div>
                        <Button type="submit">Update Task</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h2 className="font-semibold">Stats</h2>
            <p>Total Tasks: {tasks.length}</p>
            <p>Completed: {stats.completed}</p>
            <p>Pending: {stats.pending}</p>
            <p>Estimated Total Time: {stats.totalTime} hours</p>
          </div>
        </main>
      </div>
    </div>
  );
}
