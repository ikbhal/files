const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// public
app.use(express.static(path.join(__dirname, 'public')));

// create data directory if it doesn't exist
const DATA_DIR = path.join(__dirname, 'data');

const FILES_DIR = path.join(__dirname, 'data'); // Directory to store files

// Create a new file
app.post('/createFile', (req, res) => {
  const fileName = req.body.fileName;
  const filePath = path.join(FILES_DIR, fileName);

  fs.writeFile(filePath, '', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating file');
    } else {
      res.status(200).send('File created successfully');
    }
  });
});

// Get file content
app.get('/files/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(FILES_DIR, fileName);

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching file content');
    } else {
      res.send(content);
    }
  });
});


// Update file content
app.put('/updateFile', (req, res) => {
  const fileName = req.body.fileName;
  const fileContent = req.body.fileContent;
  const filePath = path.join(FILES_DIR, fileName);

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating file');
    } else {
      res.status(200).send('File updated successfully');
    }
  });
});

// List files
app.get('/listFiles', (req, res) => {
  fs.readdir(FILES_DIR, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error listing files');
    } else {
      res.json(files);
    }
  });
});

// Delete a file
app.delete('/deleteFile/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(FILES_DIR, fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting file');
    } else {
      res.status(200).send('File deleted successfully');
    }
  });
});

const PORT = process.env.PORT || 3049;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
