import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate({
                path: 'user',
                select: 'username'
            });

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const addComment = async (req, res) => {
    try {
        req.body.post = req.params.postId;
        req.body.user = req.user.id;

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ success: false, error: `No post with the id of ${req.params.postId}` });
        }

        const comment = await Comment.create(req.body);

        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Comment owner, Admin)
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, error: `No comment with the id of ${req.params.id}` });
        }

        // Make sure user is comment owner or admin
        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to delete this comment` });
        }

        await comment.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
