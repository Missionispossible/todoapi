const { v4: uuidv4 } = require("uuid");

// -----------------
// In-memory storage
// -----------------
let categories = [];
let tasks = [];
let subtasks = [];

// -----------------
// Status Mapping
// -----------------
const STATUS_MAP = {
  ACTIVE: 1,
  INACTIVE: 0,
  DELETED: 2,
};

const INT_TO_STATUS = {
  1: "ACTIVE",
  0: "INACTIVE",
  2: "DELETED",
};

// Helper: GraphQL enum -> int
const mapStatusToInt = (status) => {
  if (status === undefined || status === null) return undefined;
  const intVal = STATUS_MAP[status.toUpperCase()];
  if (intVal === undefined) throw new Error("Invalid status");
  return intVal;
};

// Helper: int -> GraphQL enum
const mapIntToStatus = (intVal) => {
  const status = INT_TO_STATUS[intVal];
  if (!status) throw new Error("Invalid status value in storage");
  return status;
};

// -----------------
// Resolvers
// -----------------
const resolvers = {
  Query: {
    getAllCategories: () => categories,

    getTasks: (_, { id, status, limit, skip }) => {
      // If ID is provided, return specific task
      if (id) {
        const task = tasks.find((t) => t.id === id);
        if (!task) return []; // Return empty array if not found
        return [{ ...task, status: mapIntToStatus(task.status) }];
      }

      // Otherwise, return filtered tasks
      let results = tasks;

      if (status && status.length > 0) {
        const statusInts = status.map(mapStatusToInt);
        results = results.filter((t) => statusInts.includes(t.status));
      }

      // Handle skip
      if (skip) {
        results = results.slice(skip);
      }

      // Handle limit: -1 means return ALL data (no limiting)
      if (limit && limit !== -1) {
        results = results.slice(0, limit);
      }

      return results.map((t) => ({ ...t, status: mapIntToStatus(t.status) }));
    },

    getTasksByCategory: (_, { categoryId }) =>
      tasks
        .filter((t) => t.category && t.category.id === categoryId)
        .map((t) => ({ ...t, status: mapIntToStatus(t.status) })),
  },

  Mutation: {
    createCategory: (_, { input }) => {
      if (!input.name || input.name.trim() === "") {
        throw new Error("Category name is required");
      }
      const newCategory = { id: uuidv4(), name: input.name };
      categories.push(newCategory);
      return newCategory;
    },

    createTask: (_, { input }) => {
      // Nullable category
      const category = input.categoryId
        ? categories.find((c) => c.id === input.categoryId) || null
        : null;

      const newTask = {
        id: uuidv4(),
        title: input.title,
        description: input.description || "",
        status: mapStatusToInt(input.status),
        category,
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      tasks.push(newTask);

      return { ...newTask, status: mapIntToStatus(newTask.status) };
    },

    updateTask: (_, { id, title, description, status, categoryId }) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) throw new Error("Task not found");

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) task.status = mapStatusToInt(status);
      if (categoryId !== undefined) {
        task.category = categoryId
          ? categories.find((c) => c.id === categoryId) || null
          : null;
      }

      task.updatedAt = new Date().toISOString();

      return { ...task, status: mapIntToStatus(task.status) };
    },

    deleteTask: (_, { id }) => {
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return false;
      tasks.splice(index, 1);
      return true;
    },

    createSubTask: (_, { input }) => {
      const task = tasks.find((t) => t.id === input.taskId);
      if (!task) throw new Error("Task not found");

      const subTask = {
        id: uuidv4(),
        title: input.title,
        completed: false,
      };

      task.subtasks.push(subTask);
      subtasks.push(subTask);
      return subTask;
    },

    updateSubTask: (_, { id, title, completed }) => {
      const subTask = subtasks.find((st) => st.id === id);
      if (!subTask) throw new Error("SubTask not found");

      if (title !== undefined) subTask.title = title;
      if (completed !== undefined) subTask.completed = completed;

      return subTask;
    },

    deleteSubTask: (_, { id }) => {
      const index = subtasks.findIndex((st) => st.id === id);
      if (index === -1) return false;
      subtasks.splice(index, 1);

      tasks.forEach((task) => {
        task.subtasks = task.subtasks.filter((st) => st.id !== id);
      });

      return true;
    },
  },
};

module.exports = resolvers;