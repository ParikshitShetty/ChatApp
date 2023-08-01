import { MESSAGE_ADDER,MESSAGE_ERASER } from "../actionTypes/ActionTypes";

const messageAdder = (mess) =>{
    return{
        type : MESSAGE_ADDER,
        payload : mess,
    }
}

const messageDeleter = (empty) =>{
    return{
        type : MESSAGE_ERASER,
        payload : empty,
    }
}

export {messageAdder,messageDeleter};