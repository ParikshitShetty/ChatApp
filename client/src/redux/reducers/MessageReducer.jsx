import { MESSAGE_ADDER,MESSAGE_ERASER } from "../actionTypes/ActionTypes";

const initialState ={
    message : '',
}

const MessageReducer = (state = initialState, action) =>{
    switch (action.type) {
        case MESSAGE_ADDER:
            return{
                ...state,
                message : action.payload
            }
        
        case MESSAGE_ERASER:
            return{
                ...state,
                message : action.payload
            }
        default:
            return state;
    }
}
export default MessageReducer;