const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


document.addEventListener('DOMContentLoaded',()=> {
    fechData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click', e =>{
    addCarrito(e)
})


items.addEventListener('click', e=>{
    btnAccion(e)
})

const fechData = async () => {
    try{

        const res = await fetch('api.json') 
        const data = await res.json()
        //console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data => {
    //console.log(data)
    data.forEach(producto => {
        templateCard.querySelector('h4').textContent = producto.title
        templateCard.querySelector('h3').textContent = producto.precio 
        templateCard.querySelector('img').setAttribute("src",producto.thumbnailUrl)
        templateCard.querySelector('.add_cart').dataset.id= producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}


const addCarrito = e =>{
    //console.log(e.target.classList.contains('add_cart'))
    if (e.target.classList.contains('add_cart')) {
        //console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto =>{
    //console.log(objeto)
    const producto ={
        id: objeto.querySelector('.add_cart').dataset.id,
        title: objeto.querySelector('h4').textContent,
        precio: objeto.querySelector('h3').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    //console.log(carrito)
    pintarCarrito()
}


const pintarCarrito = () =>{
    //console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('.item-title').textContent = producto.title
        templateCarrito.querySelector('.item-cantidad').value = producto.cantidad
        templateCarrito.querySelector('.btndecrement').dataset.id = producto.id
        templateCarrito.querySelector('.btnincrement').dataset.id = producto.id
        templateCarrito.querySelector('.item-precio').textContent = 'Q '+producto.precio
        templateCarrito.querySelector('.item-subtotal').textContent = 'Q '+producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)

    })
    items.appendChild(fragment)
    pintarFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))
    
}

const pintarFooter = ()=>{
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        
        footer.innerHTML = '<th scope="row" colspan="5" class="text-center"><img src=img/bagsad.PNG width="100"><h1><b>Oops...</b></h1><br><h5 class="title-ops">it seems there are no products added...</h5></th>'
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad})=>acc+cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio})=>acc + cantidad * precio,0)
    //console.log(nPrecio)
    templateFooter.querySelector('.item-total-productos').textContent = nCantidad
    templateFooter.querySelector('.item-subtotal-general').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('btndelete-allproducts')
    btnVaciar.addEventListener('click',()=>{
        carrito = {}
        
        pintarCarrito()
  
    })
}


const btnAccion = e =>{
    //console.log(e.target.dataset.id)
    //console.log(carrito[e.target.dataset.id])
    //accion de aumentar
    
    if (e.target.classList.contains('btndecrement')) {
        const producto = carrito[e.target.dataset.id]
        //producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }


    if (e.target.classList.contains('btnincrement')) {
        const producto = carrito[e.target.dataset.id]
        //producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
        producto.cantidad++
        carrito[e.target.dataset.id]={...producto}
        pintarCarrito()
    }
    e.stopPropagation()
    
}