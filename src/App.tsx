function App() {

  async function post(){
    let res = await fetch("http://localhost:5173/api/postProduct", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: "candel",
        category: "candels",
        price: 1500,
        description: "flower aroma",
      })
    })
    let data = await res.json();
    alert(data);
  }

  return (
    <div>
      <h1>App</h1>
      <button onClick={post}>Post</button>
    </div>
  )
}

export default App
