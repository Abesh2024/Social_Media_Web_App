import axios from 'axios';
import toastFun from './showToast';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';


const useLogout = () => {
    const toast = toastFun();
    const setUser = useSetRecoilState(userAtom); // Correct usage of useSetRecoilState

    const logout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/user/logout`, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (response.data.error) {
                toast("Error", response.data.error, "error"); 
                return;
            }

            localStorage.removeItem("user-threads");
            setUser(null);

            toast("Success", "Logout successful!", "success");
        } catch (error) {
            toast("Error", error.message || "Failed to connect to the server.", "error"); 
        }
    };
    return logout;
}

export default useLogout
