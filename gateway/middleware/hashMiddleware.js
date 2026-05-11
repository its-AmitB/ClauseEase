import crypto from 'crypto';
import Document from '../models/Document.js';

/**
 * Computes hash of uploaded file and checks cache.
 */
export const hashMiddleware = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const fileBuffer = req.file.buffer;
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const hash = hashSum.digest('hex');

    req.fileHash = hash;

    // Check if document already exists with this hash
    const cachedDoc = await Document.findOne({ hash });

    if (cachedDoc) {
      // Return cached result
      const resultObj = cachedDoc.toObject();
      return res.status(200).json({
        ...resultObj,
        cached: true
      });
    }

    // Not cached, proceed to ML
    next();
  } catch (error) {
    console.error("Hashing middleware error:", error);
    res.status(500).json({ error: 'Internal server error during document hashing' });
  }
};
