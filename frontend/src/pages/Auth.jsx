import SignUp from '../components/SignUp'
import Login from '../components/Login'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../atoms/AuthAtom'
// import { useState } from 'react'

const Auth = () => {
    const authScreenState = useRecoilValue(authScreenAtom)
    // console.log(authScreenState)
    
    return (
        <>
            {authScreenState === "login" ? <Login /> : <SignUp />}
        </>
    )
}

export default Auth
