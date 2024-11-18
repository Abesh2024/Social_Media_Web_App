
import { atom } from 'recoil';

const authScreenAtom = atom({
    key: "authAtom",
    default: "login"
})

export default authScreenAtom;