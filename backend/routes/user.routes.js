import { Router } from "express";
import UserController from "../controller/user.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();
const name = "/user";

router.use(verifyToken);

router.route(name)
  .post(UserController.addUser)
  .get(UserController.show);

router
  .route(`${name}/:id`)
  .get(UserController.findById)
  .put(UserController.update)
  .delete(UserController.delete);

export default router;