import UserModel from "../model/user.model.js";
import dotenv from "dotenv";
import EmailController from "./email.controller.js";

dotenv.config();
class UserController {
  async addUser(req, res) {
    const passwordRegex =
      /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/;
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "All data is mandatory for entry" });
      }
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error:
            "the password must be between 8 and 16 character long, with at least one digit, at least one lowercase ByteLengthQueuingStrategy, at least one uppercase letter, and al least one non-alphanumeric characyter.",
        });
      }
      const existingUserModel = await UserModel.findOne({ email });
      if (existingUserModel) {
        return res.status(400).json({ error: "The user already exist" });
      }
      const newUserModel = new UserModel({ username, email, password });
      await newUserModel.save();
      try {
        await EmailController.sendWelcomeEmail(newUserModel);
      } catch (e) {
        console.error("Error enviando correo de bienvenida:", e);
      }
      return res.status(201).json({ message: "User successfully registered" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async show(req, res) {
    try {
      const userModel = await UserModel.find();
      if (!userModel) throw new Error("User not found");
      return res.status(200).json({ data: userModel });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async findById(req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "User is required" });
      }
      const userModel = await UserModel.findOne({ _id: id });
      if (!userModel) throw new Error("User not found");
      return res.status(200).json({data: userModel }); 
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    const passwordRegex =
      /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/;
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "All data is mandatory fon entry" });
      }
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error:
            "the password must be between 8 and 16 character long, with at least one digit, at least one lowercase, at least one uppercase letter, and at least one non-alphanumeric character.",
        });
      }
      /*const existingUserModel = await UserModel.findOne({ email });
      if (!existingUserModel) {
        return res.status(400).json({ error: "User not found" });
      }*/
      const updateUser = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        { username,email, password },
        { new: true }
      );
      if (!updateUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(updateUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedUser = await UserModel.findOneAndDelete({
        _id: req.params.id,
      });
      if (!deletedUser) {
        return res.status(404).json({ error: "User not update" });
      }
      res.status(200).json({ messages: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  }
}
export default new UserController();