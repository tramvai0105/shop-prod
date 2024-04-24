import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import routes from "./routes.tsx"

function App() {

  const router = (typeof window !== 'undefined')
    ?createBrowserRouter(routes)
    :null;

  return (
    <>
      {(typeof window !== 'undefined' && router) 
      ?<RouterProvider router={router} />
      :<></>
      }
    </>
  )
}

export default App
