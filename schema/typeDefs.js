const { gql } = require("apollo-server");

const typeDefs = gql`
  # ------------------
  # Types
  # ------------------
  type Category {
    id: ID!
    name: String!
  }

  type SubTask {
    id: ID!
    title: String!
    completed: Boolean!
  }

  enum TaskStatus {
    ACTIVE   # 1
    INACTIVE # 0
    DELETED  # 2
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    category: Category
    subtasks: [SubTask!]
    createdAt: String!
    updatedAt: String!
  }

  # ------------------
  # Input Types
  # ------------------
  input TaskInput {
    title: String!
    description: String
    status: TaskStatus!
    categoryId: ID
  }

  input SubTaskInput {
    taskId: ID!
    title: String!
  }

  input CategoryInput {
    name: String!
  }

  # ------------------
  # Queries
  # ------------------
  type Query {
    getAllCategories: [Category!]!
    getTasks(id: ID, status: [TaskStatus], limit: Int, skip: Int): [Task!]!
    getTasksByCategory(categoryId: ID!): [Task!]!
  }

  # ------------------
  # Mutations
  # ------------------
  type Mutation {
    createCategory(input: CategoryInput!): Category!
    createTask(input: TaskInput!): Task!
    updateTask(
      id: ID!
      title: String
      description: String
      status: TaskStatus
      categoryId: ID
    ): Task!
    deleteTask(id: ID!): Boolean!

    createSubTask(input: SubTaskInput!): SubTask!
    updateSubTask(id: ID!, title: String, completed: Boolean): SubTask!
    deleteSubTask(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;