require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const { jsPDF } = require('jspdf');
const docx = require('docx');

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Multer setup for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize GoogleGenerativeAI with your API_KEY (from .env file)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Helper function to create a PDF from text
function createPDF(text) {
    const doc = new jsPDF();
    doc.text(text, 10, 10);
    return doc.output('blob');
}

// Helper function to create a Word document from text
function createWordDocument(text) {
    const doc = new docx.Document({
        sections: [
            new docx.Section({
                children: [
                    new docx.Paragraph(text),
                ],
            }),
        ],
    });
    return docx.Packer.toBlob(doc);
}

// Route for translating, summarizing, and rewriting the document
app.post('/process-document', upload.single('document'), async (req, res) => {
    try {
        // Ensure a file was uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const { language, action } = req.body;

        // Upload the file to Google Gemini
        const uploadResponse = await fileManager.uploadFile(req.file.path, {
            mimeType: req.file.mimetype,
            displayName: req.file.originalname,
        });

        console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);

        let result;
        if (action === 'translate') {
            result = await model.generateContent([
                { fileData: { mimeType: uploadResponse.file.mimeType, fileUri: uploadResponse.file.uri } },
                { text: `Translate this document to ${language}` },
            ]);
        } else if (action === 'summarize') {
            result = await model.generateContent([
                { fileData: { mimeType: uploadResponse.file.mimeType, fileUri: uploadResponse.file.uri } },
                { text: "Summarize this document" },
            ]);
        } else if (action === 'rewrite') {
            result = await model.generateContent([
                { fileData: { mimeType: uploadResponse.file.mimeType, fileUri: uploadResponse.file.uri } },
                { text: "Rewrite this document" },
            ]);
        } else {
            return res.status(400).send('Invalid action');
        }

        const generatedText = result.response.text();
        res.json({ preview: generatedText, fileUri: uploadResponse.file.uri });
    } catch (error) {
        console.error("Error processing the document:", error);
        res.status(500).send('Error processing the document.');
    }
});

// Generate Review Summary
async function generateReviewSummary(reviews) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Summarize the following product reviews:\n\n${reviews}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    return summary;
}

// Route for handling the review summary generation
app.post('/generate-summary', async (req, res) => {
    const { reviews } = req.body;

    if (!reviews) {
        return res.status(400).send('No reviews provided');
    }
    try {
        const summary = await generateReviewSummary(reviews);
        res.json({ summary });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).send('Error generating review summary');
    }
});

// Route for generating and sending the downloadable file (PDF or Word)
app.post('/download-document', async (req, res) => {
    try {
        const { content, format } = req.body;

        // Generate the document based on the requested format (PDF or Word)
        let fileBuffer;
        if (format === 'pdf') {
            fileBuffer = await createPDF(content);
            res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
            res.contentType('application/pdf');
            res.send(fileBuffer);
        } else if (format === 'word') {
            fileBuffer = await createWordDocument(content);
            res.setHeader('Content-Disposition', 'attachment; filename="document.docx"');
            res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(fileBuffer);
        } else {
            res.status(400).send('Invalid file format');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating document for download.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
