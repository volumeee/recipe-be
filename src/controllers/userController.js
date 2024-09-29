const User = require("../models/User");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { sanitizeInput } = require("../utils/xssSanitizer");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.delete(Number(id));
    res.status(200).json({
      status: "success",
      message: "Pengguna telah dihapus",
    });
  } catch (error) {
    if (error.message === "Pengguna tidak ditemukan") {
      next(createError(404, error.message));
    } else {
      next(error);
    }
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { nama, email, password } = req.body;

    const sanitizedName = sanitizeInput(nama);
    const sanitizedEmail = sanitizeInput(email);

    const existingUser = await User.findByEmail(sanitizedEmail);
    if (existingUser) {
      throw createError(409, "Pengguna sudah ada");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      nama: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "success",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, email, password } = req.body;

    if (Object.keys(req.body).length === 0) {
      throw createError(
        400,
        "Setidaknya 1 field harus diisi (nama, email, password)"
      );
    }

    const updateData = {};
    if (nama !== undefined) updateData.nama = sanitizeInput(nama);
    if (email !== undefined) {
      const sanitizedEmail = sanitizeInput(email);
      const existingUser = await User.findByEmail(sanitizedEmail);
      if (existingUser && existingUser.id !== Number(id)) {
        throw createError(409, "Email sudah digunakan oleh pengguna lain");
      }
      updateData.email = sanitizedEmail;
    }
    if (password !== undefined) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await User.update(Number(id), updateData);
    res.status(200).json({
      status: "success",
      user: {
        id: updatedUser.id,
        nama: updatedUser.nama,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    if (error.message === "Pengguna tidak ditemukan") {
      next(createError(404, error.message));
    } else {
      next(error);
    }
  }
};
