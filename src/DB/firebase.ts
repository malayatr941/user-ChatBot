import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FapiKey,
  authDomain: process.env.FauthDomain,
  projectId: process.env.FprojectId,
  storageBucket: process.env.FstorageBucket,
  messagingSenderId: process.env.FmessagingSenderId,
  appId: process.env.FappId
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)