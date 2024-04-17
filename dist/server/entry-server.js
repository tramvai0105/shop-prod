import { jsxs, jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOMServer from "react-dom/server";
function App() {
  async function post() {
    let res = await fetch("http://localhost:5173/api/postProduct", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "candel",
        category: "candels",
        price: 1500,
        description: "flower aroma"
      })
    });
    let data = await res.json();
    alert(data);
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "App" }),
    /* @__PURE__ */ jsx("button", { onClick: post, children: "Post" })
  ] });
}
function render() {
  const html = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(App, {}) })
  );
  return { html };
}
export {
  render
};
