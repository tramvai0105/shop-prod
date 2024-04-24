import { useEffect, useState } from "react"
import Product from "../ui/Product"
import { useLoaderData } from "react-router-dom"

export interface ProductInterface{
    name: string,
    category: string,
    price: number,
    description: string,
  }

export default function MainPage(){

    const data = useLoaderData() as ProductInterface[];
    const [products, setProducts] = useState<ProductInterface[]>(data)
    
    useEffect(()=>{
        getProducts();
    },[])

    async function getProducts(){
        let data = await fetch("http://localhost:5173/api/products");
        let products = await data.json() as ProductInterface[];
        setProducts(products)
    }

    return(
        <div className="flex justify-center w-full">
            <div className="flex flex-row gap-14">
            {products.map((prod, i)=>
            <Product key={i} name={prod.name} price={prod.price} description={prod.description}/>)}
            </div>
        </div>
    )
}