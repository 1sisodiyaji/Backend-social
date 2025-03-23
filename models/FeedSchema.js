import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    enum: ['tea-post', 'red-flag'],
    required: true
  },
  image: {
    type: String, // This will store the base64 string
    required: true
  }
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;
