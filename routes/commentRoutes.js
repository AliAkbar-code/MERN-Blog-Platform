import express from 'express';
import { getComments, addComment, deleteComment } from '../controllers/commentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

// Merge params to access postId from postRoutes
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getComments)
    .post(protect, addComment);

router
    .route('/:id')
    .delete(protect, deleteComment);

export default router;
