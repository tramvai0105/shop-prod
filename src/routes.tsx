import ErrorPage from "./pages/ErrorPage";
import MainPage, { ProductInterface } from "./pages/MainPage";
import ProductPage from "./pages/ProductPage";
import Layout from "./ui/Layout"

const  routes = [
    {
      path: "/",
      element: <Layout/>,
      errorElement: <ErrorPage/>,
      children: [
        {
          path: "/",
          loader: mainPageLoader,
          element: <MainPage/>,
        },
        {
          path: "/products",
          element: <ProductPage/>,
        },
      ]
    },
  ]

async function mainPageLoader(){
  let data = await fetch("http://localhost:5173/api/products");
  let products = await data.json() as ProductInterface[];
  return products;
}

export default routes;