const NADA = 0,
	PIEDRA = 1,
	MANZANA = 2,
	CUADRO_VERDE = 3,
	TAMANIO_SPRITES = 15,
	PARED_IZQUIERDA = 4,
	PARED_DERECHA = 5,
	PARED_ARRIBA = 6,
	PARED_ABAJO = 7;

class PedazoSerpiente {
	constructor(x = 10, y = 10) {
		this.x = x;
		this.y = x;
	}
}
class Juego {
	constructor() {
		this.teclas = {
			"39": "derecha",
			"37": "izquierda",
			"38": "arriba",
			"40": "abajo"
		};
		this.imagenes = {
			comida: "https://image.ibb.co/gTiND6/snake_food.png",
			paredIzquierda: "https://image.ibb.co/n0FDLm/pared_izquierda_resized.png",
			paredDerecha: "https://image.ibb.co/j21nfm/pared_derecha_resized.png",
			paredArriba: "https://image.ibb.co/cxrW6R/pared_abajo_resized.png",
			paredAbajo: "https://image.ibb.co/hhar6R/pared_arriba_resized.png",
			cuadroVerde: "https://image.ibb.co/g4SURR/snake_pixel.png",
			manzana: "https://image.ibb.co/gTiND6/snake_food.png",
			raton: "https://image.ibb.co/e9jq0m/Greedy_Mouse_sprite.png",
			piedra: "https://i.pinimg.com/originals/5b/6f/68/5b6f6866bd7c34733c6cb847df92b2f7.jpg"
		};
		this.contadorImagenes = 0;
		this.imagenesRequeridas = 9;
		this.serpiente = [new PedazoSerpiente(), new PedazoSerpiente(), new PedazoSerpiente()];
		this.canvas = document.querySelector("canvas");
		this.canvasCtx = this.canvas.getContext("2d");
		this.longitudX = parseInt(this.canvas.width / TAMANIO_SPRITES);
		this.longitudY = parseInt(this.canvas.height / TAMANIO_SPRITES);
		console.log("longitudX", this.longitudX)
		console.log("longitudY", this.longitudY)
		
		this.matriz = this.obtenerMatrizEscenario(this.longitudY, this.longitudX);
		console.log(this.matriz);
		this.velocidadInicial = 500;
		this.velocidad = 1;
		this.incrementoVelocidad = 0.5;
		this.direcciones = {
			derecha: 1,
			izquierda: 2,
			arriba: 3,
			abajo: 4
		};
		this.direccion = this.direcciones.derecha;
		let dis = this;
		
		this._imagenes={};
		for(let i in this.imagenes){
			this._imagenes[i] = new Image();
			this._imagenes[i].src = this.imagenes[i];
			this._imagenes[i].addEventListener("load", () =>{
				dis.contadorImagenes++;
				dis.comprobarSiSeTerminaronDeCargar();
			});
		}

		$(document).keyup(evento => {
			let direccion = this.teclas[evento.keyCode];
			if (direccion) {
				if (
					(this.direccion === this.direcciones.derecha ||
						this.direccion === this.direcciones.izquierda) &&
					(direccion === "arriba" || direccion === "abajo")
				)
					this.direccion = this.direcciones[direccion];
				else if (
					(this.direccion === this.direcciones.arriba ||
						this.direccion === this.direcciones.abajo) &&
					(direccion === "derecha" || direccion === "izquierda")
				)
					this.direccion = this.direcciones[direccion];
			}
		});
	}
	ponerManzanaEnAlgunLugar() {
		
		let x, y;
		do {
			x = Math.floor(Math.random() * (this.longitudX - 1 + 1) + 1);
			y = Math.floor(Math.random() * (this.longitudY - 1 + 1) + 1);

		console.log("x",x);
		console.log("y",y);
		} while (this.matriz[x][y] !== NADA);
		this.matriz[x][y] = MANZANA;
	}
	agregarPedazo() {
		this.serpiente.push(new PedazoSerpiente());
	}
	dibujarSerpiente() {
		for (let x = this.serpiente.length - 1; x >= 1; x--) {
			this.serpiente[x].x = this.serpiente[x - 1].x;
			this.serpiente[x].y = this.serpiente[x - 1].y;
		}
		switch (this.direccion) {
			case this.direcciones.derecha:
				this.serpiente[0].x++;
				break;
			case this.direcciones.izquierda:
				this.serpiente[0].x--;
				break;
			case this.direcciones.arriba:
				this.serpiente[0].y--;
				break;
			case this.direcciones.abajo:
				this.serpiente[0].y++;
				break;
		}
		for (let x = this.serpiente.length - 1; x >= 0; x--) {
			this.canvasCtx.drawImage(
				this._imagenes.cuadroVerde,
				this.serpiente[x].x * TAMANIO_SPRITES,
				this.serpiente[x].y * TAMANIO_SPRITES,
				TAMANIO_SPRITES,
				TAMANIO_SPRITES
			);
		}
	}
	comprobarSiSeTerminaronDeCargar() {
		if (this.contadorImagenes === this.imagenesRequeridas) this.reiniciarJuego();
	}
	reiniciarJuego() {
		setTimeout(() => {
			this.ponerManzanaEnAlgunLugar();
			this.dibujar();
		}, this.velocidadInicial / this.velocidad);
	}
	dibujar() {
		let incrementoY = 0,
			incrementoX = 0;
		this.limpiarEscenario();
		this.dibujarMatriz();
		this.dibujarSerpiente();
		if (this.matriz[this.serpiente[0].x][this.serpiente[0].y] === MANZANA) {
			this.matriz[this.serpiente[0].x][this.serpiente[0].y] = NADA;
			this.agregarPedazo();
			this.ponerManzanaEnAlgunLugar();
			this.velocidad += this.incrementoVelocidad;
			setTimeout(() => {
				this.dibujar();
			}, this.velocidadInicial / this.velocidad);
		} else if (
			this.matriz[this.serpiente[0].x][this.serpiente[0].y] === PARED_ABAJO ||
			this.matriz[this.serpiente[0].x][this.serpiente[0].y] === PARED_ARRIBA ||
			this.matriz[this.serpiente[0].x][this.serpiente[0].y] === PARED_DERECHA ||
			this.matriz[this.serpiente[0].x][this.serpiente[0].y] === PARED_IZQUIERDA
		) {
			alert("Perdiste :'v");
		} else {
			setTimeout(() => {
				this.dibujar();
			}, this.velocidadInicial / this.velocidad);
		}
	}
	obtenerMatrizEscenario(altura = this.longitudY, anchura = this.longitudX) {
		console.log("altura", altura);
		console.log("anchura", anchura);
		let matriz = [];
		for (let x = 0; x < anchura; x++) {
			matriz.push([]);
			for (let y = 0; y < altura; y++) {
				if (x === 0) matriz[x].push(PARED_IZQUIERDA);
				else if (x === anchura - 1) matriz[x].push(PARED_DERECHA);
				else if (y === 0) matriz[x].push(PARED_ARRIBA);
				else if (y === altura - 1) matriz[x].push(PARED_ABAJO);
				else matriz[x].push(NADA);
			}
		}
		return matriz;
	}
	dibujarMatriz() {
		let posicionX = 0,
			posicionY = 0;
		for (let x = 0; x < this.matriz.length; x++) {
			for (let y = 0; y < this.matriz[x].length; y++) {
				switch (this.matriz[x][y]) {
					case PIEDRA:
						this.canvasCtx.drawImage(
							this._imagenes.piedra,
							x * TAMANIO_SPRITES,
							y * TAMANIO_SPRITES,
							TAMANIO_SPRITES,
							TAMANIO_SPRITES
						);
						break;
					case PARED_ARRIBA:
						this.canvasCtx.drawImage(
							this._imagenes.paredArriba,
							x * TAMANIO_SPRITES,
							y * TAMANIO_SPRITES,
							TAMANIO_SPRITES,
							TAMANIO_SPRITES
						);
						break;
					case PARED_ABAJO:
						this.canvasCtx.drawImage(
							this._imagenes.paredAbajo,
							x * TAMANIO_SPRITES,
							y * TAMANIO_SPRITES,
							TAMANIO_SPRITES,
							TAMANIO_SPRITES
						);
						break;
					case PARED_DERECHA:
						this.canvasCtx.drawImage(
							this._imagenes.paredDerecha,
							x * TAMANIO_SPRITES,
							y * TAMANIO_SPRITES,
							TAMANIO_SPRITES,
							TAMANIO_SPRITES
						);
						break;
					case PARED_IZQUIERDA:
						this.canvasCtx.drawImage(
							this._imagenes.paredIzquierda,
							x * TAMANIO_SPRITES,
							y * TAMANIO_SPRITES,
							TAMANIO_SPRITES,
							TAMANIO_SPRITES
						);
						break;
					case MANZANA:
						this.canvasCtx.drawImage(
							this._imagenes.manzana,
							x * TAMANIO_SPRITES,
							y * TAMANIO_SPRITES,
							TAMANIO_SPRITES,
							TAMANIO_SPRITES
						);
						break;
				}
			}
		}
	}
	limpiarEscenario() {
		this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

$(window).on("load", function() {
	let canvas = document.querySelector("canvas");
		canvas.width  = document.body.clientWidth;
		canvas.height  = document.body.clientHeight;
	$(document).keyup((evento)=>{
		if(evento.keyCode === 13) new Juego();
	});
	$(document).ready(()=>{
		$(document).on("resize", () =>{
			console.log("Cambiado tamaño")
		})
		let altura = $(document).height();
		console.log(altura);
	});
});