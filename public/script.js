$(document).ready(function () {

   // Attach change event to updateFileName dropdown
   $('#updateFileName').on('change', function () {
    const selectedFileName = $(this).val();
    if (selectedFileName) {
      // Fetch file content based on selectedFileName
      $.ajax({
        url: `/files/${selectedFileName}`,
        method: 'GET',
        success: function (content) {
          $('#updateFileContent').val(content);
        },
        error: function (error) {
          console.error('Error fetching file content:', error);
        }
      });
    } else {
      $('#updateFileContent').val(''); // Clear textarea if no file is selected
    }
  });
  
  // Populate the file list
  function populateFileList() {
    $.ajax({
      url: '/listFiles',
      method: 'GET',
      success: function (files) {
        const fileList = $('#fileList tbody');
        fileList.empty();

        files.forEach(function (file) {
          fileList.append(`
              <tr>
                <td>${file}</td>
                <td>
                  <button class="delete-btn" data-file="${file}">Delete</button>
                  <button class="edit-btn" data-file="${file}">Edit</button>
                </td>
              </tr>
            `);
        });

        // Attach event listeners for delete and edit buttons
        $('.delete-btn').click(deleteFile);
        $('.edit-btn').click(editFile);
      },
      error: function (error) {
        console.error('Error fetching file list:', error);
      }
    });
  }

  // Delete file
  function deleteFile() {
    const fileName = $(this).data('file');
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      $.ajax({
        url: `/deleteFile/${fileName}`,
        method: 'DELETE',
        success: function () {
          populateFileList();
          $('#updateFileName').empty(); // Clear update dropdown
          populateUpdateFileDropdown();
          window.alert('File deleted successfully!');
        },
        error: function (error) {
          console.error('Error deleting file:', error);
        }
      });
    }
  }

  // Edit file
  // Edit file
  function editFile() {
    const fileName = $(this).data('file');
    $('#updateFileName').val(fileName).trigger('change'); // Trigger Select2 change event

    $.ajax({
      url: `/files/${fileName}`,
      method: 'GET',
      success: function (content) {
        $('#updateFileContent').val(content);
      },
      error: function (error) {
        console.error('Error fetching file content:', error);
      }
    });
  }


  // Populate update file dropdown and attach event handlers
  function populateUpdateFileDropdown() {
    const updateFileNameDropdown = $('#updateFileName');
    updateFileNameDropdown.empty();

    $.ajax({
      url: '/listFiles',
      method: 'GET',
      success: function (files) {
        files.forEach(function (file) {
          updateFileNameDropdown.append(`<option value="${file}">${file}</option>`);
        });
      },
      error: function (error) {
        console.error('Error fetching file list:', error);
      }
    });
  }

  // Submit create form
  $('#createForm').submit(function (e) {
    e.preventDefault();
    const createFileName = $('#createFileName').val();

    $.ajax({
      url: '/createFile',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ fileName: createFileName }),
      success: function () {
        populateFileList();
        $('#createFileName').val('');
        window.alert('File created successfully!');
       // reload the page
        location.reload();
      },
      error: function (error) {
        console.error('Error creating file:', error);
      }
    });
  });

  // Submit update form
  $('#updateForm').submit(function (e) {
    e.preventDefault();
    const updateFileName = $('#updateFileName').val();
    const updateFileContent = $('#updateFileContent').val();

    $.ajax({
      url: '/updateFile',
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ fileName: updateFileName, fileContent: updateFileContent }),
      success: function () {
        populateFileList();
        $('#updateFileContent').val('');
        window.alert('File updated successfully!');
      },
      error: function (error) {
        console.error('Error updating file:', error);
      }
    });
  });

  // Initial setup
  populateFileList();
  populateUpdateFileDropdown();
});


// Populate update file dropdown and attach event handlers
function populateUpdateFileDropdown() {
  const updateFileNameDropdown = $('#updateFileName');
  updateFileNameDropdown.empty();

  $.ajax({
    url: '/listFiles',
    method: 'GET',
    success: function (files) {
      files.forEach(function (file) {
        updateFileNameDropdown.append(new Option(file, file));
      });
    },
    error: function (error) {
      console.error('Error fetching file list:', error);
    }
  });
}