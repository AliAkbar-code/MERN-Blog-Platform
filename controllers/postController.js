import Post from '../models/Post.js';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Find resource
        query = Post.find(JSON.parse(queryStr))
            .populate({ path: 'author', select: 'username' })
            .populate({ path: 'categories', select: 'name slug' });

        // Search functionality
        if (req.query.search) {
            query = query.find({
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { content: { $regex: req.query.search, $options: 'i' } }
                ]
            });
        }

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Post.countDocuments(JSON.parse(queryStr));

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const posts = await query;

        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count: posts.length,
            pagination,
            data: posts
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate({ path: 'author', select: 'username email' })
            .populate({ path: 'categories', select: 'name slug' })
            .populate('comments');

        if (!post) {
            return res.status(404).json({ success: false, error: `Post not found with id of ${req.params.id}` });
        }

        // Increment view count
        post.views += 1;
        await post.save();

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Author, Admin)
export const createPost = async (req, res) => {
    try {
        // Add user to req.body
        req.body.author = req.user.id;

        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Owner, Admin)
export const updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: `Post not found with id of ${req.params.id}` });
        }

        // Make sure user is post owner or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: `User ${req.user.id} is not authorized to update this post` });
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Owner, Admin)
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: `Post not found with id of ${req.params.id}` });
        }

        // Make sure user is post owner or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: `User ${req.user.id} is not authorized to delete this post` });
        }

        await post.deleteOne(); // Use deleteOne to trigger any potential pre/post remove hooks

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: `Post not found with id of ${req.params.id}` });
        }

        // Check if the post has already been liked by this user
        if (post.likes.includes(req.user.id)) {
            // Unlike: Remove user ID from likes array
            post.likes = post.likes.filter(userId => userId.toString() !== req.user.id.toString());
        } else {
            // Like: Add user ID to likes array
            post.likes.push(req.user.id);
        }

        await post.save();

        res.status(200).json({ success: true, data: post.likes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
