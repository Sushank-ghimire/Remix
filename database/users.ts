import mysql, { Connection } from "mysql2/promise";

interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

class User {
  private connection: Connection | null = null;

  constructor() {
    this.init();
  }
  private async init(): Promise<void> {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
      });
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }

  // Create a new user
  async createUser(user: User): Promise<number | null> {
    if (!this.connection) {
      console.error("Database connection not initialized.");
      return null;
    }

    const { name, email, password } = user;
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    try {
      const [result] = await this.connection.execute(query, [
        name,
        email,
        password,
      ]);
      return (result as any).insertId; // Type assertion for insertId
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  // Get a single user by ID
  async getUserById(id: number): Promise<User | null> {
    if (!this.connection) {
      console.error("Database connection not initialized.");
      return null;
    }

    const query = "SELECT * FROM users WHERE id = ?";
    try {
      const [rows] = await this.connection.execute(query, [id]);
      return (rows as User[])[0] || null;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      return null;
    }
  }

  // Close the database connection
  async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      console.log("Database connection closed.");
    }
  }
}

export default new User();
