import User from '../models/UserSchema.js';
import Post from '../models/FeedSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Register User
export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username
            },
            'socialmedia',
            { expiresIn: '1d' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Post with Base64 Image
export const createPost = async (req, res) => {
    try {
        const { content, tag, image } = req.body;
        
        if (!content || !tag || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!image.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image format' });
        }

        const post = new Post({
            userId: req.user.userId,
            content,
            tag,
            image: image
        });

        await post.save();
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
