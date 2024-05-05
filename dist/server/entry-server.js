import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import ReactDOMServer from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom/server.mjs";
import { useState, useEffect } from "react";
import { useLoaderData, Outlet } from "react-router-dom";
function ErrorPage() {
  return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-6xl", children: "Not Found 404" });
}
const login_bg = "_login_bg_1ohmd_1";
const styles = {
  login_bg
};
function LoginPage() {
  const [authData, setAuthData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [tokenData, setTokenData] = useState(false);
  const inputClass = "border shadow-md border-black px-2 bg-white text-lg py-1";
  useEffect(() => {
    checkToken();
  }, []);
  async function checkToken() {
    let res = await fetch("/auth/checktoken");
    let data = await res.json();
    setTokenData(data.message);
  }
  async function auth() {
    let res = await fetch(
      "/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authData)
      }
    );
    let data = await res.json();
    setMessage(data.message);
    checkToken();
  }
  return /* @__PURE__ */ jsx("div", { className: `${styles.login_bg} w-full h-full flex items-center justify-center`, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col shadow-xl overflow-hidden rounded-2xl w-fit border-[1px] border-black justify-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex drop-shadow-lg items-center flex-row p-2 bg-gray-800 text-white", children: [
      /* @__PURE__ */ jsx("a", { className: "font-bold text-xl select-none px-2 rounded-md hover:bg-white hover:text-gray-800", href: "/", children: "< На главную" }),
      tokenData ? /* @__PURE__ */ jsxs("div", { className: "ml-auto flex flex-col rounded-tr-lg font-bold border-[1px] border-white p-2", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Имя: ",
          tokenData.username
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Права: ",
          tokenData.privileges ? "Привилегия" : "Обычные"
        ] })
      ] }) : /* @__PURE__ */ jsx(Fragment, {})
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: (e) => e.preventDefault(), className: "flex text-lg flex-col bg-gray-50 px-20 pt-12 pb-10 gap-6", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold text-xl mx-auto select-none", children: "Авторизация" }),
      /* @__PURE__ */ jsx("input", { value: authData.username, onChange: (e) => setAuthData((prev) => {
        return { ...prev, username: e.target.value };
      }), className: inputClass, type: "text", placeholder: "Имя пользователя" }),
      /* @__PURE__ */ jsx("input", { value: authData.password, onChange: (e) => setAuthData((prev) => {
        return { ...prev, password: e.target.value };
      }), className: inputClass, type: "password", placeholder: "Пароль" }),
      /* @__PURE__ */ jsx("button", { onClick: auth, className: "border shadow-md hover:shadow-lg hover:bg-gray-50 border-black bg-white w-fit mt-4 px-3 py-2 mx-auto", children: "Войти" }),
      message ? /* @__PURE__ */ jsx("span", { className: "mx-auto underline", children: message }) : /* @__PURE__ */ jsx(Fragment, {})
    ] })
  ] }) });
}
function Product({ name, image, description, price }) {
  var _a;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 leading-5", children: [
    /* @__PURE__ */ jsx("div", { style: { height: "242px" }, className: "w-fit flex items-center overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: image, style: { width: "180px" }, className: "", alt: "" }) }),
    /* @__PURE__ */ jsx("span", { className: "font-bold text-[16px]", children: name }),
    /* @__PURE__ */ jsx("span", { className: "text-[14px]", children: description }),
    /* @__PURE__ */ jsx("span", { className: "text-[14px] font-bold", children: ((_a = price.toString().match(/\d{1,3}(?=(\d{3})*$)/g)) == null ? void 0 : _a.join(" ")) + " р." })
  ] });
}
function MainPage() {
  const data = useLoaderData();
  const [products, setProducts] = useState(data);
  useEffect(() => {
    getProducts();
  }, []);
  async function getProducts() {
    let data2 = await fetch("http://localhost:5173/api/products");
    let products2 = await data2.json();
    setProducts(products2);
  }
  return /* @__PURE__ */ jsx("div", { className: "flex justify-center w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-row gap-14", children: products.map((prod, i) => /* @__PURE__ */ jsx(Product, { image: prod.image, name: prod.name, price: prod.price, description: prod.description }, i)) }) });
}
function ProductPage() {
  return /* @__PURE__ */ jsx("div", { children: "Products" });
}
function Layout() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full h-full", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col w-full h-full", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
function Header() {
  return /* @__PURE__ */ jsx("header", { className: "h-16 w-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "", children: /* @__PURE__ */ jsx(HeaderLink, { children: "продукты" }) }) });
}
function HeaderLink({ children }) {
  return /* @__PURE__ */ jsx("a", { className: "text-[16px]", href: "/products", children: children.toUpperCase() });
}
const routes = [
  {
    path: "/",
    element: /* @__PURE__ */ jsx(Layout, {}),
    errorElement: /* @__PURE__ */ jsx(ErrorPage, {}),
    children: [
      {
        path: "/",
        loader: mainPageLoader,
        element: /* @__PURE__ */ jsx(MainPage, {})
      },
      {
        path: "/products",
        element: /* @__PURE__ */ jsx(ProductPage, {})
      }
    ]
  },
  {
    path: "/login",
    element: /* @__PURE__ */ jsx(LoginPage, {})
  }
];
async function mainPageLoader() {
  let data = await fetch("http://localhost:5173/api/products");
  let products = await data.json();
  return products;
}
async function render(req) {
  let origin = `${req.protocol}://${req.get("host")}`;
  let url = new URL(req.originalUrl || req.url, origin);
  let handler = createStaticHandler(routes);
  req = new Request(url);
  let context = await handler.query(req);
  let router = createStaticRouter(
    handler.dataRoutes,
    context
  );
  const html = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(
      StaticRouterProvider,
      {
        router,
        context
      }
    )
  );
  return { html };
}
export {
  render
};
