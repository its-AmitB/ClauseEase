import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { hashMiddleware } from '../middleware/hashMiddleware.js';
import Document from '../models/Document.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.post('/upload', authMiddleware, upload.single('document'), hashMiddleware, async (req, res) => {
  try {
    // If we reach here, it wasn't cached
    const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    
    // Create form data to forward to Python service
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Call ML service directly using synchronous endpoint for simplicity as requested
    const mlResponse = await axios.post(`${mlUrl}/analyze/sync`, form, {
      headers: {
        ...form.getHeaders()
      },
      // Give sufficient timeout for ML inference
      timeout: 300000 
    });

    const data = mlResponse.data;

    // Save to Mongo
    const newDoc = new Document({
      userId: req.user.id,
      fileName: req.file.originalname,
      hash: req.fileHash,
      originalText: data.original_text,
      simplifiedText: data.simplified_text,
      clauses: data.clauses,
      terms: data.terms,
      originalScore: data.readability?.original_score,
      simplifiedScore: data.readability?.simplified_score,
      readability: data.readability
    });

    await newDoc.save();

    res.json({
      ...newDoc.toObject(),
      cached: false
    });

  } catch (error) {
    console.error('Upload & Analysis error:', error.response?.data || error.message);
    res.status(500).json({ error: 'ML Engine analysis failed' });
  }
});

export default router;
