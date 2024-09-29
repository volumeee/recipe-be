const fs = require("fs").promises;
const path = require("path");
const config = require("../config");
const createError = require("http-errors");

class User {
  static async getAll(includePassword = false) {
    const data = await fs.readFile(config.dbUserPath, "utf8");
    const users = JSON.parse(data);

    if (!includePassword) {
      return users.map(({ password, ...user }) => user);
    }
    return users;
  }

  static async findByEmail(email) {
    const users = await this.getAll(true);
    return users.find((user) => user.email === email);
  }

  static async getLastId() {
    const users = await this.getAll(true);
    if (users.length === 0) return 0;
    return Math.max(...users.map((user) => user.id));
  }

  static async create({ nama, email, password }) {
    const users = await this.getAll(true);
    const lastId = await this.getLastId();
    const now = new Date().toISOString();

    const user = {
      id: lastId + 1,
      nama,
      email,
      password,
      created_at: now,
      updated_at: now,
    };

    users.push(user);
    await fs.writeFile(config.dbUserPath, JSON.stringify(users, null, 2));
    return user;
  }

  static async delete(id) {
    const users = await this.getAll(true);
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw createError(404, "Pengguna tidak ditemukan");
    }
    users.splice(index, 1);
    await fs.writeFile(config.dbUserPath, JSON.stringify(users, null, 2));
  }

  static async update(id, updateData) {
    const users = await this.getAll(true);
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw createError(404, "Pengguna tidak ditemukan");
    }

    const now = new Date().toISOString();

    users[index] = {
      ...users[index],
      ...updateData,
      updated_at: now,
    };

    await fs.writeFile(config.dbUserPath, JSON.stringify(users, null, 2));
    const { password: _, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  }
}

module.exports = User;
