import React, { useRef } from "react";
import { useEffect, useState } from "react";
import styles from "./Catalogue.module.css"
import { key } from "localforage";

interface ProductInterface {
    name: string,
    category: string,
    price: number,
    description: string,
    image: string,
    _id: string,
}

interface FilterInterface {
    name: string,
    price: string,
    priceGT: boolean,
}

export default function Catalogue() {

    const [products, setProducts] = useState<ProductInterface[]>([])
    const [fProducts, setFProducts] = useState<ProductInterface[] | null>(null)
    const [filter, setFilter] = useState<FilterInterface>({name : "", price: "", priceGT: false});
    const [editProduct, setEditProduct] = useState<ProductInterface | null>(null)
    const [creater, setCreater] = useState(false);

    useEffect(() => {
        getProducts();
    }, [])

    useEffect(()=>{
        filterProducts(filter);
    }, [filter])

    async function getProducts() {
        let data = await fetch("http://localhost:5173/api/products");
        let products = await data.json() as ProductInterface[];
        setProducts(products)
    }

    function filterSetter(filter: FilterInterface){
        setFilter(filter)
    }

    function filterProducts(filter: FilterInterface){
        // let values = Object.values(filter);
        // let noFilter = true;
        // for(let i = 0; i < values.length; i++){
        //     let v = values[i]
        //     if(typeof v == "string" && v != ""){
        //         noFilter = false;
        //         break
        //     }
        // }
        // if(noFilter){
        //     setFProducts(null);
        //     return;
        // }
        let filtered = 
        products.filter(prod=>filter.name == "" || prod.name.includes(filter.name))
            .filter(prod=>filter.price == "" || isNaN(Number(filter.price)) 
            || (filter.priceGT && prod.price >= Number(filter.price))
            || (!filter.priceGT && prod.price <= Number(filter.price)))
        if(products.length == filtered.length){
            setFProducts(null);
            return
        }
        setFProducts(filtered)
    }

    function openEditor(id: string | null) {
        if(id === ""){
            setCreater(true);
            setEditProduct(null);
            return;
        }
        if (id == null) {
            setCreater(false);
            setEditProduct(null)
            getProducts();
        }
        let prod = products.find(prod => prod._id == id)
        if (prod) {
            setEditProduct({ ...prod })
        }
    }

    return (
        <div className="flex h-full relative pl-10 w-full">
            <Editor create={creater} product={editProduct} close={openEditor} />
            <div className="grid grid-cols-4 py-6 overflow-y-auto gap-14">
                {!fProducts && products.map((prod, i) =>
                    <Product key={i} data={prod} change={openEditor} />)}
                {fProducts && fProducts.map((prod, i) =>
                    <Product key={i} data={prod} change={openEditor} />)}
            </div>
            <div className="border-l-[1px] ml-auto gap-8 flex w-[30%] flex-col p-4 pt-8 text-lg border-gray-100">
                Изменить или добавить продукт.
                <button onClick={()=>openEditor("")} className="rounded-md px-4 shadow-sm hover:shadow-md hover:bg-gray-50 bg-white py-2 border border-black">Добавить</button>
                <Filter count={fProducts?.length} setter={filterSetter}/>
            </div>
        </div>
    )
}

function Product({ data, change, edit = false }: { data: ProductInterface, change: (id: string | null) => void, edit?: boolean }) {

    const [prod, setProd] = useState(data);

    useEffect(()=>{
        setProd(data);
    },[data])

    return (<div className="flex flex-col items-center gap-2 leading-4">
        <div style={{ height: (edit) ? "305px" : "230px" }} className="w-fit flex items-center overflow-hidden">
            <img src={data.image} style={{ width: (edit) ? "242px" : "180px" }} className="" alt="" />
        </div>
        <span className="font-bold text-[16px]">{prod.name}</span>
        <span className="text-[14px] whitespace-pre text-center">{prod.description.split("").reduce((acc, value, i)=>{
            if(i > 0 && i % 37 == 0){
                return acc + value + "\n"
            }
            return acc + value
        }, "")}</span>
        <span className="text-[14px] font-bold">{prod.price.toString().match(/\d{1,3}(?=(\d{3})*$)/g)?.join(" ") + " р."}</span>
        {(!edit) ? <button onClick={() => change(prod._id)} className="rounded-md px-4 shadow-sm hover:shadow-md hover:bg-gray-50 bg-white py-2 border border-black">Изменить</button> : <></>}
    </div>)
}

function Editor({ product, close, create }: { product: ProductInterface | null, close: (id: string | null) => void, create: boolean }) {

    let blankProd: ProductInterface = {
        name: "",
        category: "",
        price: 0,
        description: "",
        image: "",
        _id: "",
    }
    const [formData, setFormData] = useState<ProductInterface>((product) ? product : blankProd);
    const [file, setFile] = useState<File | null>(null)
    const [updateProd, setUpdateProd] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if(create){
            setFormData(blankProd)
        }
        if(!create && product) {
            setFormData(product)
        }
    }, [product])

    if (product == null && !create) {
        return (
            <></>
        )
    }

    function formDataSetter<K extends keyof ProductInterface, V extends ProductInterface[K]>(
        value: V,
        key: K
    ) {
        setFormData((prev) => {
            prev[key] = value
            return prev;
        })
        setUpdateProd(prev=> !prev);
    }

    async function editorFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if(create){
            postProduct();
        }else{
            putProduct();
        }
    }

    async function putProduct() {
        let body = new FormData();
        Object.keys(formData).forEach((key) => body.append(key, String(formData[key as keyof ProductInterface])))
        body.append("files", file as Blob)
        let res = await fetch("/api/putProduct",
            {
                method: "POST",
                body: body,
            })
        let resBody : {message: string} = await res.json();
        if (res.status !== 200) {
            setMessage(JSON.stringify(resBody.message))
            return
        }
        setMessage(resBody.message)
    }

    async function postProduct() {
        let body = new FormData();
        Object.keys(formData).forEach((key) => body.append(key, String(formData[key as keyof ProductInterface])))
        body.append("files", file as Blob)
        let res = await fetch("/api/postProduct",
            {
                method: "POST",
                body: body,
            })
        let resBody : {message: string} = await res.json();
        if (res.status !== 200) {
            setMessage(JSON.stringify(resBody.message))
            return
        }
        setMessage(resBody.message)
    }

    return (
        <div onClick={() => {close(null); setMessage("")}} className="absolute shadow-2xl bg-black bg-opacity-20 left-0 right-0 top-0 bottom-0 flex justify-center items-center">
            <div onClick={(e) => e.stopPropagation()} className="bg-white flex flex-row rounded-3xl p-10 gap-12">
                <Product edit={true} data={formData} change={close} />
                <form onSubmit={(e) => editorFormSubmit(e)} className="flex flex-col">
                    <span>Название</span>
                    <TextInput className={styles.editor_input} value={formData.name} setter={formDataSetter} property={"name"} />
                    <span>Описание</span>
                    <TextInput className={styles.editor_input} value={formData.description} setter={formDataSetter} property={"description"} />
                    <span>Цена</span>
                    <TextInput className={styles.editor_input} value={formData.price} setter={formDataSetter} property={"price"} num={true} />
                    <span>Фото</span>
                    <input className="mb-[14px]" accept="image/png, image/jpeg" onChange={(e) => setFile(e.target.files && e.target.files[0])} type="file" />
                    <span>Категория</span>
                    <select className={styles.editor_input}>
                        <option value={formData.category}>{formData.category}</option>
                    </select>
                    {message ? <span className="mx-auto my-3 text-lg underline">{message}</span> : <></>}
                    <button className="px-4 py-2 border-black shadow-sm hover:shadow-md hover:bg-gray-50 border w-fit h-fit mx-auto mt-[14px]" type="submit">Изменить</button>
                </form>
            </div>
        </div>
    )
}

function Filter({setter, count}:{setter: (filter: FilterInterface)=> void, count: number | undefined}){

    let _initFilter = {name : "", price: "", priceGT: false}

    const [filter, setFilter] = useState<FilterInterface>(_initFilter);

    useEffect(()=>{
        setter(filter);
    }, [filter])

    return(
        <div className="flex flex-col gap-2 border-t-[1px] border-gray-200 pt-4">
            <span>Фильтр по названию</span>
            <input value={filter.name} onChange={(e)=>setFilter((f)=>{return {...f, name: e.target.value}})} className="border-[1px] pl-2 border-black" type="text"/>
            <div className="flex flex-row justify-between">
                <span>Фильтр по цене</span>
                <select value={Number(filter.priceGT)} onChange={(e)=>setFilter((f)=>{return {...f, priceGT: Boolean(Number(e.target.value))}})}>
                    <option value={0}>Меньше</option>
                    <option value={1}>Больше</option>
                </select>
            </div>
            <input value={filter.price} onChange={(e)=>setFilter((f)=>{return {...f, price: e.target.value}})} className="border-[1px] pl-2 border-black" type="number"/>
            {count ? <span>Найдено по фильтру: {count}</span> : <></>}
            <button className="rounded-md px-6 mt-4 w-fit mx-auto shadow-sm hover:shadow-md hover:bg-gray-50 bg-white py-1 border border-black" onClick={()=>setFilter(_initFilter)}>Сброс фильтра</button>
       </div>
    )
}

export function TextInput({ value, property, setter, num = false, className = "" }: { value: string | number, property: string, setter: <K extends keyof ProductInterface, V extends ProductInterface[K]>(value: V, key: K) => void, num?: boolean, className?: string }) {

    const [inputValue, setInputValue] = useState(value)

    useEffect(() => {
        setInputValue(value)
    }, [value])

    useEffect(() => {
        setter(inputValue, property as keyof ProductInterface)
    }, [inputValue])

    return <input className={className} value={inputValue} onChange={(e) => setInputValue(e.target.value)} type={num ? "number" : "text"} />
}