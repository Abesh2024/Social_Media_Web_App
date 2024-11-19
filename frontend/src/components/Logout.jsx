// import { Button } from '@chakra-ui/react';
// import axios from 'axios';
// import React from 'react';
// import { useSetRecoilState } from 'recoil';
// import userAtom from '../atoms/userAtom';
// import toastFun from '../hooks/showToast';
// import { FiLogOut } from "react-icons/fi";


// const Logout = () => {
//     const toast = toastFun();
//     const setUser = useSetRecoilState(userAtom); // Correct usage of useSetRecoilState

//     const handleLogout = async () => {
//         try {
//             const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/user/logout`, {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 withCredentials: true,
//             });

//             if (response.data.error) {
//                 toast("Error", response.data.error, "error"); 
//                 return;
//             }

//             localStorage.removeItem("user-threads");
//             setUser(null);

//             toast("Success", "Logout successful!", "success");
//         } catch (error) {
//             toast("Error", error.message || "Failed to connect to the server.", "error"); 
//         }
//     };

//     return (
//         <Button
//             position={"fixed"} top={"30px"} right={"30px"} size={"sm"}
//             onClick={handleLogout}
//         >
//             <FiLogOut  size="35"/>
//         </Button>
//     );
// };

// export default Logout;