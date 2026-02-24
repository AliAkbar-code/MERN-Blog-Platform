import express from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost, toggleLike } from '../controllers/postController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

// Include other resource routers
import commentRouter from './commentRoutes.js';

const router = express.Router();

// Re-route into other resource routers
router.use('/:postId/comments', commentRouter);

router
    .route('/')
    .get(getPosts)
    .post(protect, authorize('author', 'admin'), createPost);

router
    .route('/:id')
    .get(getPost)
    .put(protect, authorize('author', 'admin'), updatePost)
    .delete(protect, authorize('author', 'admin'), deletePost);

router.put('/:id/like', protect, toggleLike);

export default router;
