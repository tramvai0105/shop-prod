import express from 'express'
import { Product } from './models.js'
import inspector from "schema-inspector";
const apiRouter = express.Router()

// middleware that is specific to this router
const middleware = (req, res, next) => {
  //   console.log('Time: ', Date.now())
  next()
}
apiRouter.use(middleware)

apiRouter.get('/', (req, res) => {
  res.json(200)
})


apiRouter.get('/products', async (req, res) => {
  let products = await Product.find()
  res.send(JSON.stringify(products))
})

apiRouter.post('/postProduct', async (req, res) => {
  let validation = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      category: { type: 'string', minLength: 1 },
      price: { type: 'number', minLength: 1 },
      description: { type: 'string', minLength: 1 },
    },
  };
  let validated = inspector.validate(validation, req.body)
  if(!validated.valid){
    res.json({message: "Not valid data"})
  }
  let prod = new Product(req.body);
  try{
    await prod.save();
  }catch(error){
    res.json({message: error});
  }
  res.json(200)
})

export default apiRouter