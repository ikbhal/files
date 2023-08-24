const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { dir } = require('console');
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
// todo fodler support
app.put('/directories/files/:oldfileName/rename/:newFileName', (req, res) => {
  //lets accept directory name in body 

  // read directory name path parameter, check if it is . then use data directory, else create directory path 
  // create oldfilepath from directory name, oldfilename
  // create newfilepath from directory name, new file name
  const directoryName = req.query.directoryName;
  let directoryPath = '';
  if(directoryName === 'data') {
    directoryPath = DATA_DIR;
  } else {
    directoryPath = path.join(DATA_DIR, directoryName);
  }
  
  const oldFileName = req.body.oldFileName;
  const newFileName = req.body.newFileName;
  const oldFilePath = path.join(directoryPath, oldFileName);
  const newFilePath = path.join(directoryPath, newFileName);
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
// TODOO accept directory in path if possible
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
app.post('/directories/files', (req, res) => {
  // lets accdpt directory in body 

  const directoryName = req.body.directoryName;
  let directoryPath = '';
  if(directoryName === 'data') {
    directoryPath = DATA_DIR;
  } else {
    directoryPath = path.join(DATA_DIR, directoryName);
  }

  const fileName = req.body.fileName;
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

// delete file at diredtory relative to data folde
// path /directories/<directory>/files/<fileName>, delete method
app.delete('/directories/:directoryName/files/:fileName', (req, res) => {
  const directoryName = req.params.directoryName;
  let directoryPath = '';
  if(directoryName === 'data') {
    directoryPath = DATA_DIR;
  } else {
    directoryPath = path.join(DATA_DIR, directoryName);
  }

  const fileName = req.params.fileName;
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
app.get('/directories/files', (req, res) => {
  const directoryName = req.query.directoryName;

  let directoryPath = getDirectoryPath(directoryName);

  fs.readdir(directoryPath, (err, entries) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error listing entries');
    } else {
      const entryDetails = entries.map(entry => {
        const entryPath = path.join(directoryPath, entry);
        const isDirectory = fs.statSync(entryPath).isDirectory();
        return {
          name: entry,
          type: isDirectory ? 'directory' : 'file'
        };
      });
      res.json(entryDetails);
    }
  });
});


// save file with content at directory name, relative to data folder
// path /directories/<directory>/files/<fileName>, put method
app.put('/directories/files/:fileName', async (req, res) => {
  try {
    let filePath = getFilePath(req.body.directoryName, req.params.fileName);
    const fileContent = req.body.fileContent;

    fs.writeFile(filePath, fileContent, function(error) {
      if (error) {
          console.error("Error writing the file: " + error);
          res.status(500).send('An error occurred while saving the file');
      } else {
          console.log("File written successfully.");
          res.status(200).send('File saved successfully');
      }
  });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while saving the file');
  }
});

function getDirectoryPath(directoryName)
{
  if(directoryName === 'data') {
    directoryPath = DATA_DIR;
  } 
  else if(directoryName.startsWith('data/')) {
    directoryPath = directoryName;
  }
  else {
    directoryPath = path.join(DATA_DIR, directoryName);
  }
  return directoryPath;
}

function getFilePath(directoryName, fileName){
  const directoryPath = getDirectoryPath(directoryName);
  const filePath = path.join(directoryPath, fileName);
  return filePath;
}

// get file content at directory name, relative to data folder
// path /directories/<directory>/files/<fileName>, get method
app.get('/directories/files/:fileName', async (req, res) => {
  // lets accept directory name in query string
  try {
    const directoryPath = getDirectoryPath(req.query.directoryName);
    const fileName = req.params.fileName;
    const filePath = getFilePath(directoryPath, fileName);

    fs.readFile(filePath, 'utf-8', (err, fileContent) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading file content');
      } else {
        res.send(fileContent);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while getting the file content');
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
