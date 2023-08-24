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

// ----v2 changes start

// rename file api  accept old file name, new file name
app.put('/renameFile', (req, res) => {
  const oldFileName = req.body.oldFileName;
  const newFileName = req.body.newFileName;
  const oldFilePath = path.join(FILES_DIR, oldFileName);
  const newFilePath = path.join(FILES_DIR, newFileName);
  // run rename file command
  fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error renaming file');
    } else {
      res.status(200).send('File renamed successfully');
    } 
  });
});


// create diredtory api , accept directory name, create folder at data directory
app.post('/directories', (req, res) => {
  const directoryName = req.body.directoryName;
  const directoryPath = path.join(DATA_DIR, directoryName);
  fs.mkdir(directoryPath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating directory');
    } else {
      res.status(200).send('Directory created successfully');
    }
  });
});

// create file at folder api , accept folder directory name relative to data folder, file name 
// path directories/<directoryName>/files/<fileName>
app.post('/directories/:directoryName/files', (req, res) => {
  const directoryName = req.params.directoryName;
  const fileName = req.body.fileName;
  const directoryPath = path.join(DATA_DIR, directoryName);
  const filePath = path.join(directoryPath, fileName);
  fs.writeFile(filePath, '', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating file');
    } else {
      res.status(200).send('File created successfully');
    }
  });
});


// delete file at diredtory relative to data folder
// path /directories/<directory>/files/<fileName>, delete method
app.delete('/directories/:directoryName/files/:fileName', (req, res) => {
  const directoryName = req.params.directoryName;
  const fileName = req.params.fileName;
  const directoryPath = path.join(DATA_DIR, directoryName);
  const filePath = path.join(directoryPath, fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting file');
    } else {
      res.status(200).send('File deleted successfully');
    }
  });
});


// path /directories/<directory>/files/<fileName>, delete method
app.delete('/directories/:directoryName/files/:fileName', (req, res) => {
  const directoryName = req.params.directoryName;
  const fileName = req.params.fileName;
  const directoryPath = path.join(DATA_DIR, directoryName);
  const filePath = path.join(directoryPath, fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting file');
    } else {
      res.status(200).send('File deleted successfully');
    }
  });
});

// list files at directory relative to data folder
// path /directories/<directory>/files, get method
app.get('/directories/:directoryName/files', (req, res) => {
  const directoryName = req.params.directoryName;
  const directoryPath = path.join(DATA_DIR, directoryName);
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error listing files');
    } else {
      res.json(files);
    }
  });
});


// save file with content at directory name, relative to data folder
// path /directories/<directory>/files/<fileName>, put method
app.put('/directories/:directoryName/files/:fileName', async (req, res) => {
  try {
    const directoryName = req.params.directoryName;
    const fileName = req.params.fileName;
    const fileContent = req.body.fileContent;
    const directoryPath = path.join(DATA_DIR, directoryName);
    const filePath = path.join(directoryPath, fileName);

    // Ensure the directory exists
    await fs.mkdir(directoryPath, { recursive: true });

    // Write the file
    await fs.writeFile(filePath, fileContent);

    res.status(200).send('File saved successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while saving the file');
  }
});


// ---v2 changes end

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

const PORT = process.env.PORT || 3050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
