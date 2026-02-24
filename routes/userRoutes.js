import express from 'express';
import { getUsers, getUser, updateUser, deleteUser, getAuthors } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/authors').get(getAuthors);

// All routes below require admin privileges
router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(getUsers);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

export default router;
