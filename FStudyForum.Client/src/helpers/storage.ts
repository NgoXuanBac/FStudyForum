import { initializeApp } from "firebase/app";
import { deleteObject, getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChWkp9P9f2U_OlLFmzgB8YWqQr5Q3cAsg",
  authDomain: "fstudyforum.firebaseapp.com",
  projectId: "fstudyforum",
  storageBucket: "fstudyforum.appspot.com",
  messagingSenderId: "837834875365",
  appId: "1:837834875365:web:219fb1df2385e931ffcf0c",
  measurementId: "G-34X40HWD3R"
};
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const deleteFile = async (url: string) => {
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
};

export const deleteFiles = async (urls: string[]) => {
  const detelePromises = urls.map(url => deleteFile(url));
  await Promise.allSettled(detelePromises);
};
