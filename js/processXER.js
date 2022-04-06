//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// XER loading functions
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


function saveTextAsFile() {
    var textToSave = document.getElementById("inputTextToSave").value;
    var textToSaveAsBlob = new Blob([textToSave], { type: "text/plain" });
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs")
      .value;
    var downloadLink = document.createElement("a");
  
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  
    downloadLink.click();
  }
  
function destroyClickedElement(event) {
    document.body.removeChild(event.target);
  }
  
function loadFileAsText() {
    // Check for the various File API support.
    //if (window.File && window.FileReader && window.FileList && window.Blob) {
    if (window.File && window.FileReader) {
        // Great success! All the File APIs are supported.
    } else {
        alert("The File APIs are not fully supported in this browser.");
    }

    var fileToLoad = document.getElementById("filePicker").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("inputTextToSave").value = textFromFileLoaded;
        document.getElementById("inputFileNameToSaveAs").value = fileToLoad.name + "_CLEAN";
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
    }
  
function printLoadedText() {
    var loadedText = document.getElementById("inputTextToSave").value;
    swal("Success", "XER has loaded!", "success");
    }
  
  