import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './App'
import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouterProvider,
} from "react-router-dom/server";
import routes from './routes';


export async function render(req: Request) {

  let origin = `${req.protocol}://${req.get("host")}`;
  let url = new URL(req.originalUrl || req.url, origin);
  
  let handler = createStaticHandler(routes);
  req = new Request(url);
  let context = await handler.query(req)  

  let router = createStaticRouter(
    handler.dataRoutes,
    context as StaticHandlerContext
  );

  const html = ReactDOMServer.renderToString(
        <StaticRouterProvider
          router={router}
          context={context  as StaticHandlerContext}
        />
  )
  return { html }
}
