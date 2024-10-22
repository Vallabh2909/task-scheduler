<form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="task" className="text-sm font-medium">
                        Task Title
                      </Label>
                      <Input
                        id="task"
                        placeholder="Enter task title"
                        className="mt-1 block w-full"
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
                        placeholder="Enter task description"
                        className="mt-1 block w-full resize-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <RadioGroup
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
                      Estimated Time to Complete
                    </Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Input
                        id="duration"
                        type="number"
                        placeholder="Enter time"
                        className="w-full"
                      />
                      <Select defaultValue="hours">
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="category"
                        className="mt-1 block w-full"
                      >
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