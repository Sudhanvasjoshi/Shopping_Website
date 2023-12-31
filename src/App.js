
import { Route, Routes } from 'react-router-dom';
import { Header, CreateContainer,MainContainer } from './components';
import {AnimatePresence} from "framer-motion";
import { useStateValue } from './context/StateProvider';
import { getAllFoodItems } from './utils/firebaseFunctions';
import { useEffect } from 'react';
import { actionType } from './context/Reducer';

function App() {
  const [{}, dispatch] = useStateValue();
  const fetchData = async()  =>{
    await getAllFoodItems().then(data=>{
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        fooditems : data,
      });
    });
  };
  useEffect(()=>{
    fetchData();
  },[])
  return (
    <AnimatePresence exitBeforeEnter>
    <div className="flex w-screen h-auto flex-col bg-primary" > 
          <Header/>
          <main className="mt-14 md:mt-20 px-4 md:px-16 py-4 w-full">
            <Routes>
              <Route path = "/" element = {<MainContainer/>}  />
              <Route path = "/createItem" element = {<CreateContainer/>}/>
             </Routes>

          </main>
    </div>
    </AnimatePresence>
  );
}

export default App;
