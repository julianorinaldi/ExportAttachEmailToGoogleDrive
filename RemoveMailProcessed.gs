function removeMailProcessed() { 
  
  var sheet   = SpreadsheetApp.getActiveSheet();
  
  var gmailLabels  = sheet.getRange("B1:B1").getValue();  
  var archiveLabel = sheet.getRange("B3:B3").getValue();
  var labelDeleted = "deleted";
  
  var moveToLabel =  GmailApp.getUserLabelByName(labelDeleted);
  
  if ( ! moveToLabel ) {    
    moveToLabel = GmailApp.createLabel(labelDeleted);    
  }
  
  var filter = "has:attachment label:" + archiveLabel + " label:" + gmailLabels;
  
  var threads = GmailApp.search(filter, 0, 100);  
  var me = Session.getActiveUser().getEmail();
  
  for (var x=0; x<threads.length; x++) {
    threads[x].addLabel(moveToLabel);
    threads[x].moveToTrash();
  }
}
 
 
function configure() {  
  reset();  
  ScriptApp.newTrigger("removeMailProcessed").timeBased().everyMinutes(60).create();  
  Browser.msgBox("Inciando", "Removendo emails processados.", Browser.Buttons.OK);  
}
 
function onOpen() {  
  var menu = [    
    { name: "Executar",   functionName: "configure" },
    { name: "Parar Script",    functionName: "reset"     }
  ];  
  SpreadsheetApp.getActiveSpreadsheet()
  .addMenu("Remover processados", menu);
}
 
function reset() {
  
  var triggers = ScriptApp.getProjectTriggers();  
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);    
  }
  
}