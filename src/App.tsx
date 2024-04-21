import styles from "./App.module.css"
import RootPage from "./rootPage/RootPage"
import Header from "./ui/Header"

function App() {

  return (
    <div className="flex flex-col">
      <Header/>
      <RootPage/>      
    </div>
  )
}

export default App
