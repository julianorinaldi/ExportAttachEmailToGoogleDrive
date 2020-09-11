# ExportAttachEmailToGoogleDrive
This repository represents a solution about you use mail attachment to copy to googleDrive account
You need create a Google Sheet and configure columns and cells similar the image below:

!{'GoogleSheet'}[]

# Scenario
I've a device MDHX (DVR) with many cameras. 
I configured the MDHX to all the cameras take a photo when has wherever movement, also, it's configured to send mail (gmail) these photos.
All the photos with movements are into mailbox.

# Problem to Solve
I would like that the all photos will go to my google drive, because I use google drive sync on my PC.
Because, when I'll need to verify a photo, I'll open the folder that was sync Google Drive.

# How to solve this problem
With strategy, I used the google scripts on google sheet.
For this, I needed to create a google sheet with some parameters on cells, and chose set into document two scripts with behaviors.
The name of scripts easily explain the objective:
 - Script: SendAttachToGoogleDrive
 - Script: RemoveMailProcessed

I don't to explain the scripts step by step because they are very ease, you only need view with calm.



For to configure script trigger, you can use the:
https://script.google.com/home