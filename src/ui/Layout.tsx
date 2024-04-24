import { Outlet } from "react-router-dom"

export default function Layout(){
    return(
        <div className="flex flex-col w-full h-full">
            <Header/>
            <div className="flex flex-col w-full h-full"> 
            <Outlet/>
            </div>
        </div>
    )
}

export function Header(){
    return(
        <header className="h-16 w-full flex items-center justify-center">
            <div className="">
                <HeaderLink>продукты</HeaderLink>
            </div>
        </header>
    )
}

function HeaderLink({children}:{children:string}){
    return <a className="text-[16px]" href="/products">
        {children.toUpperCase()}
    </a>
}