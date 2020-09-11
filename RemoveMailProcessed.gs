function onOpen() {  
  var menu = [
    { name: "Executar",   functionName: "Configure" },
    { name: "Parar Script",    functionName: "Reset"     }
  ];  
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Remover processados", menu);
}

function Configure() {  
  Reset();
  ScriptApp.newTrigger("RemoveMailProcessed").timeBased().everyMinutes(15).create();
  Browser.msgBox("Inciando", "Removendo emails processados.", Browser.Buttons.OK);
}

function Reset() {
  var triggers = ScriptApp.getProjectTriggers();  
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);    
  }
}

function RemoveMailProcessed() {
 
  var sheet   = SpreadsheetApp.getActiveSheet();

  var gmailLabels  = sheet.getRange("B1:B1").getValue();  
  var archiveLabel = sheet.getRange("B2:B2").getValue();
  var labelDeleted = "deleted";
  
  var moveToLabel =  GmailApp.getUserLabelByName(labelDeleted);
  
  if ( ! moveToLabel ) {    
    moveToLabel = GmailApp.createLabel(labelDeleted);    
  }
  
  var filter = "has:attachment label:" + archiveLabel + " label:" + gmailLabels;
  
  var amountMailRead = 100;
  
  var threads = GmailApp.search(filter, 0, amountMailRead);  
  var me = Session.getActiveUser().getEmail();
  
  for (var x=0; x<threads.length; x++) {
    threads[x].addLabel(moveToLabel);
    threads[x].moveToTrash();
  }
}