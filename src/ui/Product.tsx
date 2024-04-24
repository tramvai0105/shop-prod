import { useLoaderData } from "react-router-dom";

export default function Product({name, description, price}:{name: string, description: string, price: number}){
    return (<div className="flex flex-col items-center gap-2 leading-5">
        <img src="/32093976.jpg" className="w-[242px]" alt=""/>
        <span className="font-bold text-[16px]">{name}</span>
        <span className="text-[14px]">{description}</span>
        <span className="text-[14px] font-bold">{price.toString().match(/\d{1,3}(?=(\d{3})*$)/g)?.join(" ") + " р."}</span>
    </div>)
}