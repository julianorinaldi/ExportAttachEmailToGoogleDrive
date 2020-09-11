function onOpen() {  
  // Method/Event called when open Google sheet - Used to create a menu
  var menu = [    
    { name: "Executar",   functionName: "Configure" },
    { name: "Parar Script",    functionName: "Reset"     }
  ];  
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Extrair Anexos", menu);
}

function SendAttachToGoogleDrive() { 
  
  var amountMailsRead = 100;
  
  var sheet   = SpreadsheetApp.getActiveSheet();
  
  var gmailLabels  = sheet.getRange("B1:B1").getValue();  
  var archiveLabel = sheet.getRange("B3:B2").getValue();
 
  var moveToLabel =  GmailApp.getUserLabelByName(archiveLabel);
  
  if ( ! moveToLabel ) {    
    moveToLabel = GmailApp.createLabel(archiveLabel);    
  }
 
  var filter = "has:attachment -label:" + archiveLabel + " label:" + gmailLabels;
  
  var threads = GmailApp.search(filter, 0, amountMailsRead);  
 
  for (var x=0; x<threads.length; x++) {
    
    var message = threads[x].getMessages()[0];
    
    var desc   = message.getSubject() + " #" + message.getId();
    var att    = message.getAttachments();
    
    for (var z=0; z<att.length; z++) {
      try {
        var folderName = "unknown";
        
        //Attach file name: "ch06_20200911_151952_E.jpg"
        var fileName = att[z].getName();
        Logger.log(fileName);
        
        var splitName = fileName.split("_");
        if (splitName.length > 3)
        {
          var channel = splitName[0];
          var dateFile = splitName[1];
          var timeFile = splitName[2];
          folderName = dateFile;
        }
        
        var folder = DriveApp.getFoldersByName(folderName);
        if (folder.hasNext()) {
            folder = folder.next();
        } else {
            folder = DriveApp.createFolder(dateFile);
        }
        
        Logger.log(folderName);
        
        file = folder.createFile(att[z]);
        file.setDescription(desc);
      }
      catch (e) {
        Logger.log(e.toString());
      }
    }
    threads[x].addLabel(moveToLabel);    
  }
}
 
function Configure() {  
  Reset();  
  ScriptApp.newTrigger("SendAttachToGoogleDrive").timeBased().everyMinutes(5).create();  
  Browser.msgBox("Inciando", "Processamento em execução.", Browser.Buttons.OK);  
}

function Reset() {
  var triggers = ScriptApp.getProjectTriggers();  
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);    
  }
}