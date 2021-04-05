//Carga la lista de productos

$(document).ready(function(){
    $.ajax({type: "GET",
          url: "js/productos.js",
          dataType: "script",
    });
});

//Prepara las variables usadas en las funciones

var carrito = []
var storage = localStorage
var crt = ""
var carritoNum = "0"
let total = 0

//Lleva la cuenta de la cantidad total de productos en el carrito y los muestra en la pagina

function fullNum(){
	let notificacion = document.getElementById("notificacion")
	let carritoFull = document.getElementById("carrito-dropdown");
	for (const [key, value] of Object.entries(storage)){
		carritoNum = parseInt(carritoNum) + parseInt(storage[key])
	}
	if (carritoNum > 0){
		$("#notificacion").show()
		carritoFull.innerHTML = "🛒 (" + carritoNum + ")";
		if(carritoNum > 9){
			$("#notificacion").css("padding-left", "");
		}
		else{
			$("#notificacion").css("padding-left", "5px")
		}
		notificacion.innerHTML = carritoNum
		carritoNum = 0
	}
	else{
		carritoFull.innerHTML = "🛒";
		$("#notificacion").hide()
	}
}

//Calcula el costo total de todo lo comprado


function calcTotal(){
	total = 0
	for (const [key, value] of Object.entries(storage)){
		sub = parseInt(list[key].precio * storage[key])
		total = total + sub;
		let precioTotal = document.getElementById("precioTotal");
		if (precioTotal != null){
			precioTotal.innerHTML = "¥" + total
		}
	}
}

//Agrega productos al carrito en el localStorage y si ya estan en el mismo, le suma uno a la cantidad

function add(id){
	if(id in storage){
		storage[id] = parseInt(storage[id]) + 1
	}
	else{
		storage.setItem(id, 1);
	}
	enCarrito()
	fullNum()
}

function cantidadTotalMas(id){
	let suma = document.getElementById(id);
	suma.value = parseInt(suma.value) + 1
	cantidadTotal(id)
}

function cantidadTotalMenos(id){
	let resta = document.getElementById(id);
	resta.value = parseInt(resta.value) - 1
	cantidadTotal(id)
}

//Maneja la cantidad puesta en el input del carrito

function cantidadTotal(id){
	storage[id] = parseInt($("#" + id).val());
	if (storage[id] == 0){
		if (confirm("Esta seguro de que eliminar este produto?")){
		localStorage.removeItem(id)
		mostrarCarrito();
		}
		else{
			storage[id] = 1
			mostrarCarrito()
		}
	}
	else if(isNaN(storage[id]) || storage[id] < 0){
		alert("Apapapapapa, eso no es un numero valido, podria hacer que no pudieras poner cosas que no son numeros ahi, pero prefiero vaciarte el carrito en castigo.");
		localStorage.clear();
		mostrarCarrito();
	}
	let precio = document.getElementById("td" + id);
	if (precio != null){
		precio.innerHTML = "¥" + list[id].precio * storage[id];
	}
	calcTotal()
	fullNum()

}


//Vacia el carrito

function vaciar(){
        if (confirm("Esta seguro de que quiere vaciar su carrito?")){
			$(".cantidad").text("")
			localStorage.clear()
			$("#crt").text("Nada Aun")
			$("#ttl").text("El total seria de ¥0")
			mostrarCarrito();
			fullNum();
			$("#mostrarMiniCarrito").hide()
		}
}

//Muestra que objetos hay en el carrito en la pagina de productos

function enCarrito(){
	for (const [key, value] of Object.entries(storage)){
		let x = key
		$("#bp-" + x).html("(" + parseInt(storage[x]) + " en carrito)");
		$(".mobile__off #bp-" + x).html("(" + parseInt(storage[x]) + " en carrito)");
	}
}

//Genera la pagina de carrito

function mostrarCarrito(){
		let productosCarrito = []
		let mostrarCarrito = document.getElementById("main")
		for (const [key, value] of Object.entries(storage)){
			calcTotal()
			let producto = 
				`<tr>
					<td class="white" style="max-width: 50%; min-width: 20%;"><img style="max-width: 200px" class="col-12" src="img/${list[key].id}.jpg"></td> 
					<td scope="col" class="table__producto col-8 white"><b>${list[key].nombre}</b><p class="mobile__on">¥${list[key].precio}</p><p class="mobile__off">Tipo de producto: ${list[key].tipo}</p><p class="mobile__off">Tipo de modelo: ${list[key].modelo}</p></td> 
					<td class="white col-1 mobile__off">¥${list[key].precio}</td> 
					<td  class="white col-2"><div style="width: 100px; display: flex; overflow: clip"><button class="btn-secondary" style="height: 34px;" onclick="cantidadTotalMenos(${key})">-</button><input style="max-width: 35px; padding: 0; background-color: lightgray;" type="tel" value="${storage[key]}" class="col-12 cantidad" onchange="cantidadTotal(${list[key].numero})" id="${list[key].numero}" ><button class="btn-secondary" style="height: 34px" onclick="cantidadTotalMas(${key})">+</button></div>Subtotal:<p id="td${list[key].numero}">¥${parseInt(list[key].precio * storage[key])}</p></td>
				</tr>`
			productosCarrito.push(producto);
		}
		if (mostrarCarrito != null) {
			if (storage.length == 0){
				mostrarCarrito.innerHTML =  `<div class="background" style="display: flex;"><img src="img/vacio.png" class="mobile__on" style="position: absolute;left: 20px;max-height: 30px;top: 150px;"><b class="mobile__off" style="padding:10% 5% 0 5%; font-size: 4rem;">Aun no ha seleccionado ningun producto.</b><img style="padding-right: 5%; width:100%;" src="img/nada.png"></div>`
			}
			else{
				mostrarCarrito.innerHTML = 
				`<table class="table table-dark" style="margin-top:4%;">
			    	<thead>
						<tr>
					    	<th style="max-width: 50% min-width: 20%;"> </th>
						    <th scope="col" class="white col-9">Nombre</th>
						    <td class="white col-1 mobile__off" >Precio</td>
						    <td class="white col-2">Cantidad</td>
						</tr>
						 ${productosCarrito}
						<tr>
						    <td style="max-width: 50% min-width: 20%; display: flex;"><button onclick="vaciar()" class="btn btn-primary btn-file">Vaciar carrito</button></td>
					    	<td  class="white col-8"><p class="mobile__on">Total:</p></td>
						    <td scope="col" class="table__producto col-1 white mobile__off">Total:</td>
						    <td class="white col-2" id="precioTotal">¥${total}</td>
						</tr>
					</thead>
				</table>`
			}
		}
}

//Arma el carritod el dropdown

function mostrarMiniCarrito(){
		productosCarrito = []
		let mostrarMiniCarrito = document.getElementById("mostrarMiniCarrito");
		for (const [key, value] of Object.entries(storage)){
			calcTotal()
			let producto = 
				`<tr>
					<td class="white" style="width: 30%"><img class="col-12"  src="img/${list[key].id}.jpg"></td> 
					<td scope="col" class="table__producto col-9 white" style="width: 50%"><b>${list[key].nombre} x ${storage[key]}<p>¥${list[key].precio}</p></b></td> 
					<td  class="white col-1"><p>¥${parseInt(list[key].precio * storage[key])}</p></td>
				</tr>`
			productosCarrito.push(producto);
			final = (productosCarrito.join(""));
		}
		if (mostrarMiniCarrito != null) {
			if (storage.length == 0){
				mostrarMiniCarrito.innerHTML = `<div class="background" style="display: flex; height: 100%"><img src="img/vacio.png" style="position: absolute;left: 20px;max-height: 20%;"><img style="padding-right: 5%; width:100%;" src="img/nada.png"></div>`

			}
			else{
				mostrarMiniCarrito.innerHTML =
					`<table class="table table-dark" style="border-radius: 25px;">
				    	<thead>
							` + final + `
							<tr>
							    <td style="width: 30%"> <button onclick="vaciar()" class="btn btn-primary btn-file">Vaciar carrito</button></td>
						    	<td  class="white col-9" style="width: 50%"> <button onclick="mostrarCarrito()" id="carritoMobile" class="btn btn-primary btn-file">Ir a carrito</button></td>
							    <td class="white col-1" style="width: 10%" id="precioTotalMini">Total:¥${total}</td>
							</tr>
						</thead>
					</table>`
			}
		}
}

//Carga la pagina de productos

function productos(){
		let todos = []
		let productos = document.getElementById("main");
		if(productos != null){
			for (const [key, value] of Object.entries(list)){
				calcTotal()
				if(key > 0){
					let producto = 
						`<tr>
		                <th scope="col">
		                    <a class="pop">
		                        <img src="img/${list[key].id}.jpg" id="${list[key].id}" alt="${list[key].info}">
		                        <p class="mobile__on">¥${list[key].precio}</p><button class="mobile__on btn btn-primary btn-fil" onclick="add(${list[key].numero})" id="btn-${list[key].numero}">Agregar</button>
		                    </a>
		                </th>
		                <td scope="col" class="table__producto"><b>${list[key].info}</b><p class="mobile__on cantidad" id="bp-${[key]}"><p class="mobile__off">${list[key].descripcion}</p></td>
		                <td class="mobile__off">¥${list[key].precio}<button class="btn btn-primary btn-file" onclick="add(${list[key].numero})" id="btn-${list[key].numero}">Agregar</button><p class="cantidad" id="bp-${list[key].numero}"></p></td>
		                
		            </tr>`
					todos.push(producto);
				}
				productos.innerHTML =
					`<table class="table table-dark" style="margin-top:4%;">
				    	<thead>` 
						+ todos + `
						</thead>
					</table>`
				}
		}
}

//Se encarga de cargar las distintas paginas

$(document).ready(function(){
	if ($("#main").is(":empty")){
  		$("#main").load("home.html");
  		fullNum()
  	}

  	$("a").click(function(){
    	toLoad = (this.id)
    	if(toLoad != "dropdownMenuLink" && toLoad != "productos.html"){
	    	$("#main").load(toLoad);
	    	$(document).ajaxComplete(function() {
		  		enCarrito();
		  		fullNum();
 			})
 		}
 		else if(toLoad == "productos.html"){
 			productos();
 			enCarrito();
 		}
 		else{
 			$(".dropdown-menu").toggle()
 		}
 	})
})


//Maneja el menu dropdown del carrito

$(function(){
	$("#carrito-dropdown").on({
	  	mouseenter: function(){
	    	$(this).css("background-color", "lightgray");
	},
		mouseleave: function(){
	   		$(this).css("background-color", "lightblue");
			},
	  	click: function(){
	  		$(".carrito-dropdown").toggle();
	  			mostrarMiniCarrito();
		},
	})
});

//Cierra el carrito dropdown cuando se clickea dos veces. se clickea fuera del mismo o se se abre la pagina de carrito 

$(document).bind( "mouseup touchend", function(e){
    let container = $(".carrito-dropdown");
  	let button = $("#carrito-dropdown")
  	let dropdown = $(".dropdown-menu");
  	let dropdownbutton = $("#dropdownMenuLink")
    $("#carritoMobile").click(function(){
    	container.hide();
    })
  	if (((!dropdown.is(e.target) && dropdown.has(e.target).length === 0 && !dropdownbutton.is(e.target) && dropdownbutton.has(e.target).length === 0)) && ((!container.is(e.target) && container.has(e.target).length === 0 && !button.is(e.target) && button.has(e.target).length === 0))){
    	dropdown.hide();
        container.hide();
 	 }
});

//Abre el carrito en mobile

function cargarCarrito(){
	$(document).ajaxComplete(function() {
  		mostrarCarrito();
	});
}

//Envia el carrito y el formulario por mail a la persona que lo pidio con una copia para mi

function sendMail(params){
	for (const [key, value] of Object.entries(storage)){
		producto = list[key].nombre + " x" + storage[key] + "<br> ¥" + parseInt(list[key].precio) * parseInt(storage[key])
		carrito.push(producto);
		final = (carrito.join("<br>"));
	}
	var tempParams = {
		nombre: document.getElementById("nombre").value,
		email: document.getElementById("email").value,
		telefono: document.getElementById("telefono").value,
		info: document.getElementById("info").value,
		carrito: final,
	};

	emailjs.send("service_ng061r8","template_t3h9cqt",tempParams)
	.then(function(res){
		localStorage.clear();
		$("#main").load("home.html");
		alert("Mensaje enviado!");
	})
}

// Limpia el formulario


function limpiar() {
  $("#form").find("input:text").val("");
  $("#form").find("textarea").val("")
}
