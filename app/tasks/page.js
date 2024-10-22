"use client";

import * as React from "react";
import { Moon, Sun, Search, Filter, X, LayoutDashboard, CheckSquare, Calendar as CalendarIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
function formatDate(dateString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Use 24-hour format; set to true for 12-hour format
    };
  
    const date = new Date(dateString);
    return `${date.toLocaleString('en-US', options)}`;
  }
export default function TaskViewPage() {
    const [darkMode, setDarkMode] = React.useState(() => {
        // Check if the user has a preference stored in localStorage
        const storedTheme = localStorage.getItem("darkMode")
          return storedTheme 
        
      });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState(null);
  const [tasks, setTasks] = React.useState(() => {
    // Fetch tasks from localStorage on component mount
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : []; // Parse if tasks exist, otherwise return empty array
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesDate = !dateFilter || task.date === dateFilter.toISOString().split('T')[0];
    return matchesSearch && matchesCategory && matchesPriority && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setDateFilter(null);
  };

  return (
    <div className={cn("min-h-screen bg-background text-foreground", darkMode ? "dark" : "")}>
      <nav className="flex items-center justify-between border-b px-6 py-4">
        <div className="text-2xl font-bold">TaskMaster</div>
        <div className="flex items-center space-x-4">
          <Link href='/'>
            <Button variant="ghost">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href='/tasks'>
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
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold">Task View</h1>
        <div className="mb-6 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Category</h4>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Priority</h4>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Date</h4>
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={cn({
                      "bg-red-100 text-red-800": task.priority === "high",
                      "bg-yellow-100 text-yellow-800": task.priority === "medium",
                      "bg-green-100 text-green-800": task.priority === "low",
                    })}
                  >
                    {task.priority}
                  </Badge>
                  <span className="text-sm text-gray-500">{formatDate(task.date)}</span>
                </div>
                <Badge className="mt-2" variant="secondary">
                  {task.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
