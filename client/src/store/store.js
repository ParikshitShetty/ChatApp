import { atom } from 'jotai';
import { randomHexColorCode } from '../common/colorGenerator';

export const connectedUsersListStore = atom([]);

export const senderIdStore = atom('');
export const recieverStore = atom({});

export const chatArrayStore = atom([]);
export const groupchatArrayStore = atom([]);

export const userNameStore = atom('');

export const loginStateStore = atom(false);

// Chat Mode
export const GroupChatModeState = atom(false);
export const GroupState = atom({
        groupName: null, 
        no_of_people_active: null 
    }
);

export const GroupDataState = atom([
    {
        groupName: "common", 
        no_of_people_active: 0,
        color: randomHexColorCode()
    }
]);

// For chat loader
export const chatLoaderState = atom(false);
export const groupChatLoaderState = atom(false);