export const actionType = {
    SET_USER :'SET_USER',
    SET_FOOD_ITEMS:"SET_FOOD_ITEMS"

}
const reducer = (state,action) =>{
    console.log(action);
    switch(action.type){
        case actionType.SET_USER:
            return{
                ...state,
                user:action.user,
            };
            case actionType.SET_FOOD_ITEMS:
            return{
                ...state,
                fooditems:action.fooditems,
            };
            default:
                return state;

    }
};
export default reducer;
