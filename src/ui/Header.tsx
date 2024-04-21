
export default function Header(){
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