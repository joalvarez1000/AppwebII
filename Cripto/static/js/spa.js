/* creamos objeto categorias que luego irán en movimientos, no es necesario ponerolo con comillas*/
let categoria = [ "EUR", "ETH" , "LTC" , "BNB" , "EOS" , "XML" , "TRX" , "BTC" , "XRP" , "BCH" , "USDT" , "BSV" , "ADA" ]

let valorEur = 0

let saldoCriptomonedas

let losMovimientos

xhr = new XMLHttpRequest()

//recibe la respuesta cuando llamamos a la api
function recibeRespuesta() {
    if (this.readyState === 4 && (this.status === 200 || this.status === 201 )) {
        const respuesta = JSON.parse(this.responseText)

        if (respuesta.status !== 'success') {
            alert("Se ha producido un error en acceso a servidor "+ respuesta.mensaje)
            return
        }

        alert(respuesta.mensaje)

        llamaApiMovimientos()
    }
}




function gestionaRespuestaApiCointmarket () {
    
    if (this.readyState === 4 && this.status ===200) {
        console.log (this.responseText)
        const respuesta = JSON.parse(this.responseText)
        
        if (respuesta.status.error_message !== null) {
            alert ("No se han encontrado resultados")
            return
        }
    
    const movimiento = {}
    movimiento.moneda_to     = document.querySelector ("#to").value
    /*Llamar al valor de la respuesta JSON  */
    const PrecioTo = respuesta.data.quote[movimiento.moneda_to].price
  

    

    /* Seleccionar el id del selector del html para el precio*/ 
    var cantidad_to = document.querySelector ("#cantidad_to")
    cantidad_to.innerHTML = "0"
   

    /* Crear los elementos donde colgaran en el html 
    const div = document.createElement ("div")
    const p = document.createElement ("p")
    div.className = "precioTo"
    p.setAttribute ("id", "cantidad_to")
    p.innerHTML = PrecioTo
    div.appendChild (p)
    cantidad_to.appendChild (div)*/
    
    cantidad_to.innerHTML =PrecioTo
    
    }
    
}



//busca el movimiento en el que hemos click, por el id, y ese movimiento lo informa en el formulario
function gestionaValorizado () {
    
    if (this.readyState === 4 && this.status ===200) {
        console.log (this.responseText)
        const respuesta = JSON.parse(this.responseText)
        
        if (respuesta.status !== 'success') {
            alert ("No se han encontrado resultados")
            return
        }
    const invertidoResultado = parseFloat( document.querySelector ("#invertidoResultado").outerText)
    valorEur = parseFloat( respuesta.mensaje)

    console.log (valorEur)
    console.log (invertidoResultado)
    var valorizado = document.querySelector ("#valorizado")
    valorizado.innerHTML = ""
   
    /* calculo para el resultado*/

    const resultadoEur = invertidoResultado + valorEur    

    /* Crear los elementos donde colgaran en el html */
    const div = document.createElement ("div")
    const p = document.createElement ("p")
    div.className = "valorizado"
    p.setAttribute ("id", "valorEur")
    p.innerHTML = valorEur
    div.appendChild (p)
    valorizado.appendChild (div)

    var resultado = document.querySelector ("#resultado")
    resultado.innerHTML= ""

    const div2 = document.createElement("div")
    const p2 = document.createElement ("p")
    div2.className = "resultado"
    p2.setAttribute ("id", "resultadoEur")
    p2.innerHTML = resultadoEur
    div2.appendChild (p2)
    resultado.appendChild(div2)
    
    }
}
//muestra la lista
function muestraMovimientos() {
    if (this.readyState === 4 && this.status === 200) {
        const respuesta = JSON.parse(this.responseText) 

        if (respuesta.status !== 'success') {
            alert("Se ha producido un error en la consulta de movimientos")
            return
        }

        losMovimientos = respuesta.movimientos
        
        const tbody = document.querySelector(".tabla-movimientos tbody")
        tbody.innerHTML = ""

        for (let i = 0; i < respuesta.movimientos.length; i++) {
            const movimiento = respuesta.movimientos[i]
            const fila = document.createElement("tr")
            

            //renderiza la tabla en el html
            const dentro = `
                <td>${movimiento.date}</td>
                <td>${movimiento.time}</td>
                <td>${movimiento.moneda_from}</td>
                <td>${movimiento.cantidad_from}</td>
                <td>${movimiento.moneda_to}</td>
                <td>${movimiento.cantidad_to}</td>
            `

            /* operador ternario de javascripts -> funciona como if -> ? ["verdadero"] : [ "falso"] */

            fila.innerHTML = dentro /* Creamos la fila*/
            
            tbody.appendChild(fila)
             
        }
        var key = {
            EUR : 0,
            ETH : 0,
            LTC : 0,
            BNB : 0,
            EOS : 0,
            XML : 0,
            TRX : 0,
            BTC : 0,
            XRP : 0,
            BCH : 0,
            USDT: 0,
            BSV : 0,
            ADA : 0
        }

        /* Fórmula para renderizar los saldos por criptomoneda */
        const tbody2 = document.querySelector(".saldo-movimientos tbody")
        tbody2.innerHTML = ""
        const movimiento = respuesta.movimientos
        for (let i = 0; i < movimiento.length; i++) {
            key[movimiento[i].moneda_from] -= movimiento[i].cantidad_from
            key[movimiento[i].moneda_to] += movimiento[i].cantidad_to
        }

        saldoCriptomonedas = key
        console.log (saldoCriptomonedas)
        for (let i=0; i<categoria.length; i++){
            const fila = document.createElement("tr")
            
            const dentro = `
                            <td>${categoria[i]}</td>
                            <td>${key[categoria[i]]}</td>
                            `
            /* operador ternario de javascripts -> funciona como if -> ? ["verdadero"] : [ "falso"]*/

            fila.innerHTML = dentro /* Creamos la fila*/
            
            tbody2.appendChild(fila)

            
        }
        
        
        document.querySelector("#actualizar")
                .addEventListener("click", (evento) => {
                    evento.preventDefault()
                    
                    /* renderizamos el saldo de lo invertido en Euros */
                    const invertido = document.querySelector("#invertido")
                    invertido.innerHTML =""

                    const p1 = document.createElement("p")
                    p1.setAttribute ("id", "invertidoResultado")
                    const var1 = key["EUR"].toFixed(8)
                    
                    p1.innerHTML = var1
                    

                    invertido.appendChild (p1)

                    
                    const llamadaclave = key
                    console.log (JSON.stringify(llamadaclave))
                    xhr.open ('POST', `http://localhost:5000/api/v1/actualizar`, true)
                    xhr.onload = gestionaValorizado
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")    
                    xhr.send(JSON.stringify(llamadaclave))
                    
                })       
    }
}



function gestionaRespuestaApiSaldo () {
    if (this.readyState === 4 && this.status ===200) {
        console.log (this.responseText)
        const respuesta = JSON.parse(this.responseText)
        
        if (respuesta.status.error_message !== null) {
            alert ("No se han encontrado resultados")
            return
        }
    
    const movimiento = {}
    movimiento.moneda_to     = document.querySelector ("#to").value
    /*Llamar al valor de la respuesta JSON  */
    const PrecioTo = respuesta.data.quote[movimiento.moneda_to].price
  

    

    /* Seleccionar el id del selector del html para el precio*/ 
    var cantidad_to = document.querySelector ("#cto")
    cantidad_to.innerHTML = ""
   

    /* Crear los elementos donde colgaran en el html */
    const div = document.createElement ("div")
    const p = document.createElement ("p")
    div.className = "precioTo"
    p.setAttribute ("id", "cantidad_to")
    p.innerHTML = PrecioTo
    div.appendChild (p)
    cantidad_to.appendChild (div)

    }
}


//recupera todos los movimmientos
function llamaApiMovimientos(){
    xhr.open("GET", `http://localhost:5000/api/v1/movimientos`, true)
    xhr.onload = muestraMovimientos
    xhr.send()
}

function capturaFormMovimiento () {
        
    
    const movimiento = {}
    
    
    movimiento.moneda_from   = document.querySelector("#from").value
    movimiento.cantidad_from = document.querySelector("#cantidad_from").value
    movimiento.moneda_to     = document.querySelector("#to").value
    movimiento.cantidad_to   = document.querySelector("#cantidad_to").outerText
    return movimiento
}

//funcion para validar el modifica y el crea
function validar(movimiento) {
    

    if (movimiento.moneda_from === movimiento.moneda_to){
        alert ("Los Symbol no pueden tener el mismo valor")
        return false
    }
    
    if ( movimiento.moneda_from !== "EUR" && movimiento.cantidad_from > saldoCriptomonedas[movimiento.moneda_from]) {
        alert ("la cantidad no puede superar el saldo actual")
        return false
    }

    if (movimiento.cantidad_from === "0") {
        alert("Indique Cantidad para symbol deseado")
        return false
    }
        
    
    
    if (movimiento.cantidad_to === "0") {
        alert("Debe solicitar valor")
        return false
    }

    //if (!movimiento.esGasto && movimiento.categoria) {
    //    alert("Un ingreso no puede tener categoria")
    //    return false
    //}

    //if (movimiento.cantidad <=0) {
    //    alert ("la cantidad ha de ser positiva")
    //    return false
    //}

    return true
}

function llamaApiCoinmarket (evento) {
    evento.preventDefault ()
    

    

    const movimiento = {}
    movimiento.moneda_from   = document.querySelector ("#from").value
    movimiento.cantidad_from = document.querySelector ("#cantidad_from").value
    movimiento.moneda_to     = document.querySelector ("#to").value
    
    if (!validar(movimiento)) {
        return
    }

    xhr.open ('GET', `http://localhost:5000/api/v1/par/${movimiento.moneda_from}/${movimiento.moneda_to}/${movimiento.cantidad_from}`, true)
    xhr.onload = gestionaRespuestaApiCointmarket
   
    xhr.send()
    console.log ("lanzado")
}

function llamaApiBorraMovimiento (ev) {
    ev.preventDefault()
    id = document.querySelector("#idMovimiento").value
    
    if (!id) {
        alert ("Selecciona un movimiento antes!")
        return
    }

    xhr.open('DELETE',`http://localhost:5000/api/v1/movimiento/${id}`, true)
    xhr.onload = recibeRespuestaApiCointmarket
    xhr.send( )
}

function llamaApiCreaCoinMovimiento (evento) {
    evento.preventDefault()
    const movimiento = capturaFormMovimiento()
    console.log (movimiento.moneda_from)
    //llamar a la funcion validacion
    if (!validar(movimiento)) {
        return
    }

    xhr.open('POST',`http://localhost:5000/api/v1/movimiento`, true)
    xhr.onload = recibeRespuesta
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    
    xhr.send(JSON.stringify(movimiento))
}

window.onload = function() {
    llamaApiMovimientos()
       
    document.querySelector("#valor")
        .addEventListener("click", llamaApiCoinmarket)
    
    document.querySelector("#ok")
        .addEventListener("click", llamaApiCreaCoinMovimiento)
    
    document.querySelector("#cantidad_from")
        .addEventListener("change", (evento) => {
            evento.preventDefault()
            var cantidad_to = document.querySelector ("#cantidad_to")
            cantidad_to.innerHTML = "0"
            
        })
    
}