import React,{useState} from 'react';
import {motion} from 'framer-motion';
import {MdFastfood , MdCloudUpload,MdDelete,MdFoodBank , MdAttachMoney} from 'react-icons/md';
import { categories } from '../utils/data';
import Loader from './Loader';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase.config';
import { saveItem ,getAllFoodItems } from '../utils/firebaseFunctions';
import { actionType } from '../context/Reducer';
import { useStateValue } from '../context/StateProvider';
const CreateContainer = () => {
  const [title , settitle] = useState("");
  const [calorie , setcalorie] = useState("");
  const [price , setprice] = useState("");
  const [category , setcategory] = useState(null);
  const [field , setfield] = useState(false);
  const [alertStatus , setAlertStatus] = useState("danger");
  const [msg,setmsg] = useState(null);
  const [isLoading , setLoading] = useState(false);
  const [ImageAsset, setImageAsset] = useState(null);
  const [{}, dispatch] = useStateValue();
  
  const uploadImage = (e) => {
    setLoading(true);
    const imageFile = e.target.file[0];
    const storageRef = ref(storage ,`Images/${Date.now()}-${imageFile.name}`)
    const uploadTask = uploadBytesResumable(storageRef , imageFile);
    uploadTask.on('state_changed',(snapshot)=>{
      const uploadProgress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
    },
    (error) => {
      console.log(error)
      setfield(true)
      setmsg("Error while uploading : Try Again 🙇")
      setAlertStatus('danger')
      setTimeout (() =>{
        setfield(false)
        setLoading(false)
      },4000);
    },() => {
      getDownloadURL(uploadTask.snapshot.ref).then(DownloadURL => {
        setImageAsset(DownloadURL);
        setLoading(false);
        setfield(true);
        setmsg('image uploaded successfully 😊')
        setAlertStatus('Success')
        setTimeout(() =>{
          setfield(false);
        },4000);
      });
    } )   

  };
  const deleteImage = () => {
    setLoading(true)
    const deleteref = ref(storage,ImageAsset);
    deleteObject(deleteref).then(()=>{
      setImageAsset(null);
      setLoading(false);
      setfield(true);
        setmsg('image deleted successfully 😊')
        setAlertStatus('Success')
        setTimeout(() =>{
          setfield(false)
        },4000);
    });

  };
  const saveDetails = () => {
    setLoading(true);
    try{
      if((!title || !calorie || !ImageAsset || !price || !category))
      {
        setfield(true)
        setmsg('Required Fields are empty')
        setAlertStatus('danger')
        setTimeout (() =>{
          setfield(false)
          setLoading(false)
        },4000);
      }
      else{
        const data = {
          id:`${Date.now()}`,
          title : title,
          imageURL : ImageAsset,
          category : category,
          calorie :calorie,
          qty: 1,
          price:price
        }
        saveItem(data)
        setLoading(false);
        setfield(true);
        setmsg('Data uploaded successfully 😊')
        clearData();
        setAlertStatus('Success')
        setTimeout(() =>{
          setfield(false);       

        },4000);
        clearData();
      }     

    }catch(error){
      console.log(error)
      setfield(true)
      setmsg('Error while uploading : Try Again 🙇')
      setAlertStatus('danger')
      setTimeout (() =>{
        setfield(false)
        setLoading(false)
      },4000);
    }
    fetchData();
  };
  const clearData = ()=>{
    settitle("");
    setImageAsset(null)
    setcalorie("")
    setprice("")
    setcategory("Select Category")

  };
  const fetchData = async()  =>{
    await getAllFoodItems().then(data=>{
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        fooditems : data,
      });
    });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-[90%] md:w-[50%] border border-gray-300 rounded-lg flex flex-col p-4 items-center justify-center gap-4">
        {
          field && (
            <motion.p initial = {{opacity :0}}
            animate = {{opacity:1}} exit = {{opacity : 0}}
             className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
              alertStatus === 'danger' ?'bg-red-400 text-red-800': "bg-emerald-400 text-emerald-800"}`}>
              {msg}
            </motion.p>
          )
        }

      <div className=" w-full py-2 border-b border-gray-300 flex items-center gap-2 ">
        <MdFastfood className = "text-xl text-grey-700"/>
        <input type="text" required value = {title}placeholder= 'Give me a Title...' className="w-full h-full text-lg  bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
        onChange={(e) => settitle(e.target.value)} />
      </div>

      <div className="w-full">
        <select onChange={(e) => setcategory(e.target.value)} className = "outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer">
          <option value="other" className = "bg-white" > Select Category</option>
          {categories && categories.map((item) =>(
            <option key={item.id} className = "text-base border-0 outline-none capitalize bg-white text-headingColor" value={item.urlParamName}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-225 md:h-340 cursor-pointer rounded-lg">
        {isLoading ? <Loader/>:<>
         {!ImageAsset ? <>
         <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer ">
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 ">
            <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700"/>
            <p className="text-gray-500 text-3xl hover:text-gray-700">Click here to upload</p>
          </div>
          <input 
          type="file"
          name = "uploadimage"
          accept = "image/*"
          onChange = {uploadImage}
          className = "w-0 h-0"/>
          </label></>:<><div className="relative h-full"><img src={ImageAsset} alt = "" className = "w-full h-full object-cover"/>
          <button type="button" className = "absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out" onClick = {deleteImage}>
            <MdDelete className = "text-white"/>
            </button>
            </div></>

         }</>}

      </div>
      <div className="w-full flex flex-col md:flex-row items-center gap-3">
        <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
          <MdFoodBank className="text-gray-700 text-2xl"/>
          <input type = "text" required placeholder="Calories"  value = {calorie} onChange = {(e) => {setcalorie(e.target.value)}}className= "w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"></input>

        </div>
        <div className="w-full flex flex-col md:flex-row items-center gap-3">
        <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
          <MdAttachMoney className="text-gray-700 text-2xl"/>
          <input type = "text" required placeholder="Price" value = {price} onChange = {(e) => {setprice(e.target.value)}} className= "w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"></input>

        </div>
        </div>
        <div className="flex items-center w-full">
          <button type='button' className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-emerald-500 px-12 py-2 rounded-lg text-white font-semibold"onClick = {saveDetails}>Save</button></div>                

      </div>
      </div>
    </div>
  )
}

export default CreateContainer
