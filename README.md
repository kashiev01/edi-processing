# edi-processing script
Small app to automatically process EDI files 

## Prerequisites 
1. Node.js install
2. NPM / Yarn installed

## What is needed before running 
1. Create 'edi-uploads' folder in project root folder
2. Download all EDI files from GDrive
3. Upload all EDI files into 'edi-uploads' folder
4. Add .env file with credentials into project root folder


## How to run script
1. git clone https://github.com/kashiev01/edi-processing.git
2. cd edi-processing
3. npm install
4. npm run start:dev

##How to send request (start processing)
1. 1st option: Go to http://localhost:3001/api and click on Post "Execute" button
2. 2nd option: open Postman and send Post request to http://localhost:3001/prod 
