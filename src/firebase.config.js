import {getApp,getApps,initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyCOl-AQSguqwjSvTLLihy0uZY5_B4ATi4M",
    authDomain: "restaurant-5207e.firebaseapp.com",
    databaseURL: "https://restaurant-5207e-default-rtdb.firebaseio.com",
    projectId: "restaurant-5207e",
    storageBucket: "restaurant-5207e.appspot.com",
    messagingSenderId: "282863795682",
    appId: "1:282863795682:web:765350b70a697dd9de8dbb"
  };

const app = getApp.length >0 ? getApp() : initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const storage = getStorage(app)
export {app,firestore,storage};
