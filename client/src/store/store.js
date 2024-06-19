import { atom } from 'jotai';

export const connectedUsersListStore = atom([]);

export const senderIdStore = atom('');
export const recieverStore = atom({});

export const chatArrayStore = atom([]);

export const userNameStore = atom('');

export const loginStateStore = atom(false);