import { useState } from "react";
import Catalogue from "./Catalogue";
import products from "../assets/products.svg"
import users from "../assets/users.svg"
import triangle from "../assets/triangle.svg"
import UsersMenu from "./UsersMenu";

enum Pages{
    Catalogue,
    Users,
}

export default function Layout(){

    const [page, setPage] = useState(Pages.Catalogue)

    function pageSetter(page: Pages){
        setPage(page);
    }

    return(
        <div className="h-full w-full px-4">
            <div className="h-full overflow-hidden flex">
                <div className="flex flex-col pl-4 py-8 gap-4 text-2xl">
                    <MenuButton choosen={page} svg={products} setter={pageSetter} page={Pages.Catalogue}>Каталог</MenuButton>
                    <MenuButton choosen={page} svg={users} setter={pageSetter} page={Pages.Users}>Пользователи</MenuButton>
                </div>
                <div className="border-l-[1px] border-gray-100 w-full flex">
                    {page == Pages.Catalogue ? <Catalogue/> : <></>}
                    {page == Pages.Users ? <UsersMenu/> : <></>}
                </div>
            </div>
        </div>
    )
}

function MenuButton({svg, setter, page, choosen, children}:{svg: string, setter: (page: Pages) => void, page: Pages, choosen: Pages, children: string}){
    return(
        <div className="flex mr-4">
            <div style={{background: choosen == page ? "rgb(243 244 246)" : ""}} onClick={()=>setter(page)} className="flex w-full select-none cursor-pointer shadow-md hover:shadow-lg hover:bg-gray-50 flex-row px-6 py-2 gap-3 border-[1px] border-gray-100 rounded-lg">
                <span style={{textDecoration: choosen === page ? "underline1" : ""}}>{children}</span>
                <img className="max-w-[35px] aspect-square" src={svg} alt={`${Pages.Catalogue}`}/>
            </div>
            {/* <div className="flex px-2 items-center">
                <img style={{transform: choosen === page ? "rotate(0deg)" : "rotate(90deg)"}} className="max-w-[30px] transition-transform duration-300 aspect-square" src={triangle}/>
            </div> */}
        </div>
    )
}