
# **Document Translator & Summarizer Chrome Extension**

## **Description**

The **Document Translator & Summarizer** Chrome extension allows users to quickly translate, summarize, and rewrite documents directly in the browser. Whether you are working with lengthy reports, e-commerce reviews, or need to translate documents to a different language, this extension provides a convenient and efficient solution for content processing on the web.

### **Key Features:**
- **Translate Documents**: Upload a document (PDF, DOCX, etc.) and translate it into any language.
- **Summarize Documents**: Summarize large documents to quickly get the main points and save time.
- **Rewrite Documents**: Reword paragraphs or sentences to improve clarity, simplify complex language, or make the text unique.
- **Review Summarization**: Extract and summarize product reviews from e-commerce sites like Amazon and eBay.

This extension streamlines document processing by leveraging cutting-edge AI models to help users interact with content more efficiently.

## **Problem Being Solved**

This extension addresses the challenges of dealing with large documents or multiple sources of content on the web, particularly:
- **Time-consuming translations**: Translating entire documents manually can be slow and difficult.
- **Overwhelming amounts of information**: Large documents and reviews can be overwhelming; this extension allows for quick summaries.
- **Need for rewriting**: Users often need help rewriting documents, whether for clarity or paraphrasing.

By automating the translation, summarization, and rewriting of documents directly within the browser, this extension saves users time and helps them focus on the most important information.

## **APIs Used**

### 1. **Google Gemini API (Generative AI)**
   - **Google Gemini** (formerly known as **Google AI**) is used for all the **AI-powered functionalities** such as translation, summarization, and rewriting. The extension utilizes this API to process and manipulate document content and to generate new summaries or rewritten versions.
   
   - **Used For**:
     - **Translation**: Automatically translating documents into various languages.
     - **Summarization**: Creating concise summaries of documents or reviews.
     - **Rewriting**: Paraphrasing content to make it more readable or unique.
   
   The API helps with efficient natural language processing (NLP), enabling seamless interaction with different types of document content.

### 2. **Google File Manager API**
   - **Google AI File Manager** is used to upload documents for processing, such as translating or summarizing them using the Gemini API. It helps manage and process files before sending them to the Google Gemini model for AI tasks.
   
   - **Used For**:
     - Uploading documents (PDF, DOCX) to the server.
     - Handling file processing between the user's browser and the backend.

### 3. **Google Chrome Extension API**
   - **Chrome Extension APIs** are used to create the extension's core functionality, including adding context menus, interacting with the browser tab, and injecting content scripts.
   
   - **Used For**:
     - Extracting reviews and content from e-commerce websites (such as Amazon and eBay).
     - Allowing users to interact with the extension through the browser action and context menus.

---

## **How to Use**

1. **Installation**:
   - Download the extension as a `.zip` file.
   - Go to **chrome://extensions/** in your Chrome browser.
   - Enable **Developer Mode**.
   - Click **Load unpacked** and select the folder containing the extension files.

2. **Usage**:
   - After installing, click on the extension icon in the toolbar.
   - Upload a document, select the language for translation, and choose the action (translate, summarize, or rewrite).
   - For review summarization, right-click on a page to extract and summarize reviews from supported websites.
   - You can also download the processed document in **PDF** or **Word** format.

## **Technologies Used**
- **JavaScript** for core extension functionality.
- **HTML/CSS** for the extension’s popup interface.
- **Google Gemini API** for AI-powered tasks (translation, summarization, rewriting).
- **Google File Manager API** for file management.
- **Multer** for handling file uploads in the backend.

## **Permissions**
The extension requires the following permissions:
- **activeTab**: To interact with the currently active tab, allowing the extension to extract reviews from web pages.
- **contextMenus**: To add custom right-click menu options for text translation, summarization, and rewriting.
- **tabs**: To access the currently active tab for review extraction and document processing.
- **storage**: To save user settings such as language preferences and file formats.

## **Privacy Policy**

This extension respects user privacy. It does not collect or store personal information. The extension only processes document content temporarily for the requested task (translation, summarization, or rewriting) and does not retain user data beyond that session.

For more information, please refer to our [Privacy Policy](link-to-privacy-policy).

---
## **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
