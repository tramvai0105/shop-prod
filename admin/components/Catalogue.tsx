import React, { useRef } from "react";
import { useEffect, useState } from "react";
import styles from "./Catalogue.module.css"
import { json } from "stream/consumers";

interface ProductInterface {
    name: string,
    category: string,
    price: number,
    description: string,
    _id: string,
}

export default function Catalogue() {

    const [products, setProducts] = useState<ProductInterface[]>([])
    const [editProduct, setEditProduct] = useState<ProductInterface | null>(null)

    useEffect(() => {
        getProducts();
    }, [])

    async function getProducts() {
        let data = await fetch("http://localhost:5173/api/products");
        let products = await data.json() as ProductInterface[];
        setProducts(products)
    }

    function openEditor(id: string | null) {
        if (id == null) {
            setEditProduct(null)
            getProducts();
        }
        let prod = products.find(prod => prod._id == id)
        if (prod) {
            setEditProduct({ ...prod })
        }
    }

    return (
        <div className="flex h-full relative pl-10 gap-10 w-full">
            <Editor product={editProduct} close={openEditor} />
            <div className="flex pt-4 flex-row gap-14">
                {products.map((prod, i) =>
                    <Product key={i} data={prod} change={openEditor} />)}
            </div>
            <div className="border-l-[1px] p-4 pt-8 text-lg border-gray-100">
                Изменить или добавить продукт.
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
        <img src="/32093976.jpg" style={{ width: (edit) ? "242px" : "180px" }} className="" alt="" />
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

function Editor({ product, close }: { product: ProductInterface | null, close: (id: string | null) => void }) {

    let blankProd: ProductInterface = {
        name: "",
        category: "",
        price: 0,
        description: "",
        _id: "",
    }
    const [formData, setFormData] = useState<ProductInterface>((product) ? product : blankProd);
    const [file, setFile] = useState<File | null>(null)
    const [updateProd, setUpdateProd] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (product) {
            setFormData(product)
        }
    }, [product])

    if (product == null) {
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