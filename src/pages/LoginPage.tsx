import { useEffect, useState } from "react"
import styles from "./LoginPage.module.css"

export default function LoginPage() {

    const [authData, setAuthData] = useState({ username: "", password: "" })
    const [message, setMessage] = useState("")
    const [tokenData, setTokenData] = useState<{username: string, privileges: boolean} | false>(false)
    const inputClass = "border shadow-md border-black px-2 bg-white text-lg py-1"

    useEffect(()=>{
        checkToken();
    },[])

    async function checkToken(){
        let res = await fetch("/auth/checktoken");
        let data = await res.json();
        setTokenData(data.message);
    }

    async function auth() {
        let res = await fetch("/auth/login",
            {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(authData),
            })
        let data : {message: string} = await res.json();
        setMessage(data.message);
        checkToken()
    }

    return (
        <div className={`${styles.login_bg} w-full h-full flex items-center justify-center`}>
            <div className="flex flex-col shadow-xl overflow-hidden rounded-2xl w-fit border-[1px] border-black justify-center">
                <div className="flex drop-shadow-lg items-center flex-row p-2 bg-gray-800 text-white">
                    <a className="font-bold text-xl select-none px-2 rounded-md hover:bg-white hover:text-gray-800" href="/">{"< На главную"}</a>
                    {tokenData ? 
                    <div className="ml-auto flex flex-col rounded-tr-lg font-bold border-[1px] border-white p-2">
                        <span>Имя: {tokenData.username}</span> 
                        <span>Права: {tokenData.privileges ? "Привилегия" : "Обычные"}</span> 
                    </div>
                    : <></>}
                </div>
                <form onSubmit={(e)=>e.preventDefault()} className="flex text-lg flex-col bg-gray-50 px-20 pt-12 pb-10 gap-6">
                    <span className="font-bold text-xl mx-auto select-none">Авторизация</span>
                    <input value={authData.username} onChange={(e) => setAuthData(prev => { return { ...prev, username: e.target.value } })} className={inputClass} type="text" placeholder="Имя пользователя" />
                    <input value={authData.password} onChange={(e) => setAuthData(prev => { return { ...prev, password: e.target.value } })} className={inputClass} type="password" placeholder="Пароль" />
                    <button onClick={auth} className="border shadow-md hover:shadow-lg hover:bg-gray-50 border-black bg-white w-fit mt-4 px-3 py-2 mx-auto">Войти</button>
                    {message ? <span className="mx-auto underline">{message}</span> : <></>}
                </form>
            </div>
        </div>
    )
}