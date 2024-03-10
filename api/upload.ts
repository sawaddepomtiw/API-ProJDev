import express from 'express';
import multer from "multer";

//create router of this API
export const router = express.Router();

router.get("/",(req, res)=>{
    res.send("Method GET in upload.ts")
});

// define config
const firebaseConfig = {
    apiKey: "AIzaSyAG1UnXuXcLwYw2Ktl247fOlErqoL1D9g4",
    authDomain: "dinomashpj.firebaseapp.com",
    projectId: "dinomashpj",
    storageBucket: "dinomashpj.appspot.com",
    messagingSenderId: "228180447858",
    appId: "1:228180447858:web:88e2f27a85395cf57b68eb",
    measurementId: "G-KE6ESR2B0X"
  };

//import lib
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
// initializeApp(firebaseConfig);
initializeApp(firebaseConfig);

const storage = getStorage();

class FileMiddleware {
    filename = "";
    //create multer object to save file in disk
    public readonly diskLoader = multer({
        //disk storage = save to memory
      storage: multer.memoryStorage(),
      //limit file size to be upload
      limits: {
        fileSize: 67108864, // 64 MByte
      },
    });
}

//POST /upload
const fileupload = new FileMiddleware();
//use fileupload object to handle uploading file
router.post("/image", fileupload.diskLoader.single("file"),async (req, res)=>{
  //create filename
  const filename = Math.round(Math.random()* 10000)+".png";
  //set name to be save firebase storage 
  const storageRef = ref(storage, "image/" + filename);
  // set detail of file to be upload
  const metadata = {
      contentType : req.file?.mimetype
  }
  //upload to storage 
  const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);
  //get url of image from storage
  const downloadurl = await getDownloadURL(snapshot.ref);
  
  res.status(200).json({
    downloadurls: [downloadurl] // ใส่ downloadurl เข้าไปใน array
});
  
});

