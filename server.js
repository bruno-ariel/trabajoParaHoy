import express from "express";

const app = express();
const PORT = 3000

//queremos servir los archivos estaticos desde la carpeta pública

app.use(express.static("./public"))

app.use(express.json())
//configuracion para recibir formularios
app.use(express.urlencoded({ extended: true }))

app.post("/test", (req, res) =>{
    console.log(req.body)
    res.sendStatus(200)
})
import handlebars from "express-handlebars"
//configurar un motor de plantillas
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", "./views")

const workspaces = [
    {
        id: 1,
        name: "workspace 1",
    },
    {
        id: 2,
        name: "workspace 2",
    },
    {
        id: 3,
        name: "workspace 3",
    },
]

const products = [
    {
        id: 1,
        name: "Monitor BenQ Gaming",
        price: 200.000,
        description: "full hd de 23 pulgadas",
        stock: 10,
        is_sale: true,
        offer: 150.000
    },
    {
        id: 2,
        name: "Celular Xiaomi",
        price: 450.000,
        description: "celular de 6gb de ram",
        stock: 20,
        is_sale: false,
        offer: 400.000
    },
    {
        id: 3,
        name: "auriculares Sony",
        price: 60.000,
        description: " auriculares inalambricos",
        stock: 30,
        is_sale: true,
        offer: 50.000
    },
    {
        id: 4,
        name: "smartwatch Apple",
        price: 400.000,
        description: "smartwatch de 4gb de ram",
        stock: 40,
        is_sale: false,
        offer: 300.000
    },
    {
        id: 5,
        name: "teclado mecanico",
        price: 150.000,
        description: "teclado mecanico inalambrico",
        stock: 50,
        is_sale: false,
        offer: 100.000
    }
]

app.get("/" , (req, res) => {
    res.render("home", {layout: "main" , 
        data: {
            title: "Bienvenido usuario",
            html: "<b> >> hola << </b>",
            workspaces
        }
    })
})

app.get("/products" , (req, res) => {
    res.render("products", {layout: "main" , 
        data: {
            title: "Lista de productos",
            products
        }
    })
})

app.get ("/products/new", (req, res) => {
    res.render("create_product", {layout: "main"})
})
app.post("/products/new", (req, res) => {
    console.log(req.body)
    const { product_name , product_price , product_description , product_stock } = req.body

    const errors_state = {
        product_name: false
    }
    // aca validamos los campos 

    if (product_name.length < 3) {
        errors_state.product_name = "El producto debe tener al menos 3 caracteres"
    }
    else if (product_name.length > 20) {
        errors_state.product_name = "El producto no debe tener mas de 20 caracteres"
    }
    else if (products.find(products => products.name == product_name) ) {
        errors_state.product_name = "El producto ya existe"
    }
    if (product_price < 0) {
        errors_state.product_price = "El precio no puede ser 0"
    }
    if (product_stock < 0) {
        errors_state.product_stock = "tiene que haber un stock"
    }
    // aca validamos si hay errores
    let hay_errores = false
    //field = campo
    for (let field in errors_state) {
        if (errors_state[field]) {
            hay_errores = true
        }
    }
    if (hay_errores){
        return res.render("create_product", {
            layout: "main",
            data: {
                errors: errors_state
            }
        })
        
    }

    const new_product = {
        id: products.length + 1,
        name: product_name,
        price: 0,
        description: "",
        stock: 0,
        is_sale: false,
        offer: 0
    }
    products.push(new_product) 

    res.redirect("/products")

    if (!product_name || products.find (products => products.name == product_name)) {
        return res.render("create_product", {
            layout: "main",
            data: {
                errors: {
                    errors: errors_state
                }
            }
        })
    }
    res.render("create_product", {layout: "main"})
})


app.get("/products/:id",(req, res) => {
    const { id } = req.params
    const products_found = products.find( products => products.id == id)
    res.render("products_detail", {
        layout: "main",
        data: {
            products_info: products_found
        }
    })
})


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
