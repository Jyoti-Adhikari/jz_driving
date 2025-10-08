const Document = require('../models/documentModel');

const uploadDocument = async (req, res) => {
  try {
    const { type, fileUrl } = req.body;

    const document = await Document.create({
      userId: req.user._id,
      type,
      fileUrl,
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: 'Invalid document data', error: error.message });
  }
};

const reviewDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.status = req.body.status || document.status;
    document.reviewedBy = req.user._id;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing document', error: error.message });
  }
};

module.exports = { uploadDocument, reviewDocument };
