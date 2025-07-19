import { Router } from "express";
import TaskController from '../controller/task.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();
const name = "/task";
const nameComment = "/task/comment";
const nameFiles = "/task/files";
// Verify token middleware
router.use(verifyToken);
// Route for user registration and list
router.route(name)
    .post(TaskController.addTask)
    .get(TaskController.getTasks);

//Route for user by ID
router.route(`${name}/:id`)
    .get(TaskController.getTaskId)
    .put(TaskController.updateTask);

router.route(`${nameComment}/:id`).post(TaskController.addComment);

router.route(`${nameFiles}/:id`)
    .post(TaskController.addFile);

export default router;
