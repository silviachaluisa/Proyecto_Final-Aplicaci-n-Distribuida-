import { Outlet, Navigate } from 'react-router-dom'

const Auth = () => {
    const token = localStorage.getItem("token")
    return (
        <>
          {token ? <Navigate to="/chats" />: <Outlet/>}
        </>
    )
}

export default Auth