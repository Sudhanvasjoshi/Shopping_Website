import { async } from "@firebase/util";
import { collection, getDoc, orderBy, query, setDoc } from "firebase/firestore";
import { firestore } from "../firebase.config";
import { doc } from "firebase/firestore";
//saving data
export const saveItem = async(data) => {
    await setDoc(doc(firestore , "foodItems" , `${Date.now()}`,),data , {merge:true,});
};

export const getAllFoodItems = async() => {
    const items = await getDoc(
        query(collection(firestore,"fooditems"),orderBy("id","desc"))
    );
    return items.docs.map((doc)=>doc.data());
}