function sendToGoogleDrive() { 
  
  var sheet   = SpreadsheetApp.getActiveSheet();
  
  var gmailLabels  = sheet.getRange("B1:B1").getValue();  
  var driveFolder  = sheet.getRange("B2:B2").getValue();  
  var archiveLabel = sheet.getRange("B3:B3").getValue();
  
  var moveToLabel =  GmailApp.getUserLabelByName(archiveLabel);
  
  if ( ! moveToLabel ) {    
    moveToLabel = GmailApp.createLabel(archiveLabel);    
  }
 
  var filter = "has:attachment -label:" + archiveLabel + " label:" + gmailLabels;
  
  var threads = GmailApp.search(filter, 0, 50);  
 
  var folder = DriveApp.getFoldersByName(driveFolder);
  
  if (folder.hasNext()) {
    folder = folder.next();
  } else {
    folder = DriveApp.createFolder(driveFolder);
  }
 
  for (var x=0; x<threads.length; x++) {
    
    var message = threads[x].getMessages()[0];
    
    var desc   = message.getSubject() + " #" + message.getId();
    var att    = message.getAttachments();
    
    for (var z=0; z<att.length; z++) {
      try {
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
 
 
function configure() {  
  reset();  
  ScriptApp.newTrigger("sendToGoogleDrive").timeBased().everyMinutes(10).create();  
  Browser.msgBox("Inciando", "Processamento em execução.", Browser.Buttons.OK);  
}
 
function onOpen() {  
  var menu = [    
    { name: "Executar",   functionName: "configure" },
    { name: "Parar Script",    functionName: "reset"     }
  ];  
  SpreadsheetApp.getActiveSpreadsheet()
  .addMenu("Extrair Anexos", menu);
}
 
function reset() {
  
  var triggers = ScriptApp.getProjectTriggers();  
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);    
  }
  
}