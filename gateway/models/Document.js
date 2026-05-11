import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  originalText: {
    type: String
  },
  simplifiedText: {
    type: String
  },
  clauses: {
    type: Array, // Array of { text, label, confidence }
    default: []
  },
  terms: {
    type: Array, // Array of { term, definition }
    default: []
  },
  originalScore: {
    type: Number
  },
  simplifiedScore: {
    type: Number
  },
  readability: {
    type: Object // original_score, simplified_score, etc.
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Since user is asking for Users model as well, we will define UserSchema implicitly here or in auth route
export default mongoose.model('Document', DocumentSchema);
