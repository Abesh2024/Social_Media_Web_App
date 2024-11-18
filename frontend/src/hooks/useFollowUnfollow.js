import React, { useState } from 'react'
import toastFun from './showToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const useFollowUnfollow = (user) => {
    // console.log(user);
    
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
    const [updating, setUpdating] = useState(false);
    const toast = toastFun();
    
    const handelFollowUnfolloow = async() => {
        if(!currentUser) {
            toast("error", "Register as an user first", "error")
            return;
        }
        if(updating) return
        setUpdating(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/user/follow/${user._id}`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            })

            const data = await res.json()
            console.log(data);
            // console.log(user._id);
            if(data.error){
                toast("error", data.error, "error")
                return;
            }

            if(following) {
                toast("success", `unfollowed ${user.name}`, "success")
                user.followers.pop()
            } else {
                toast("success", `Followed ${user.name}`, "success")
                user.followers.push(currentUser?._id)
            }

            setFollowing(!following)

        } catch (error) {
        toast("error", error, "error")
        } finally {
            setUpdating(false)
        }
    }
  return {handelFollowUnfolloow, updating, following}
}

export default useFollowUnfollow
