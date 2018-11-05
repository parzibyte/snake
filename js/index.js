const NADA = 0,
	PIEDRA = 1,
	MANZANA = 2,
	CUADRO_VERDE = 3,
	TAMANIO_SPRITES = 15,
	PARED_IZQUIERDA = 4,
	PARED_DERECHA = 5,
	PARED_ARRIBA = 6,
	PARED_ABAJO = 7;
let juegoComenzado = false;
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
			piedra:
				"https://image.ibb.co/e9jq0m/Greedy_Mouse_sprite.png"
		};
		this.contadorImagenes = 0;
		this.imagenesRequeridas = 9;
		this.serpiente = [
			new PedazoSerpiente(),
			new PedazoSerpiente(),
			new PedazoSerpiente()
		];
		this.canvas = document.querySelector("canvas");
		this.canvasCtx = this.canvas.getContext("2d");
		console.log("La anchura:", this.canvas.width);
		console.log("La altura:", this.canvas.height);
		this.longitudX = parseInt(this.canvas.width / TAMANIO_SPRITES);
		this.longitudY = parseInt(this.canvas.height / TAMANIO_SPRITES);
		this.matriz = this.obtenerMatrizEscenario(this.longitudY, this.longitudX);
		this.velocidadInicial = 250;
		this.velocidad = 1;
		this.incrementoVelocidad = 0.05;
		this.direcciones = {
			derecha: 1,
			izquierda: 2,
			arriba: 3,
			abajo: 4
		};
		this.siguienteDireccion = this.direcciones.derecha;
		this.direccion = this.direcciones.derecha;
		let dis = this;

		this._imagenes = {};
		for (let i in this.imagenes) {
			this._imagenes[i] = new Image();
			this._imagenes[i].src = this.imagenes[i];
			this._imagenes[i].addEventListener("load", () => {
				dis.contadorImagenes++;
				dis.comprobarSiSeTerminaronDeCargar();
			});
		}

		$("#canvas").click(evento => {
			let x = evento.clientX,
				y = evento.clientY,
				tercioXCanvas = this.canvas.width / 3,
				tercioYCanvas = this.canvas.height / 3;
			if (x <= tercioXCanvas && y >= tercioYCanvas && y <= tercioYCanvas * 2) {
				if (
					dis.direccion === dis.direcciones.arriba ||
					dis.direccion === dis.direcciones.abajo
				)
					dis.siguienteDireccion = dis.direcciones.izquierda;
			} else if (
				x >= tercioXCanvas * 2 &&
				x <= tercioXCanvas * 3 &&
				y >= tercioYCanvas &&
				y <= tercioYCanvas * 2
			) {
				if (
					dis.direccion === dis.direcciones.arriba ||
					dis.direccion === dis.direcciones.abajo
				)
					dis.siguienteDireccion = dis.direcciones.derecha;
			} else if (
				x >= tercioXCanvas &&
				x <= tercioXCanvas * 2 &&
				y >= 0 &&
				y <= tercioYCanvas
			) {
				if (
					dis.direccion === dis.direcciones.derecha ||
					dis.direccion === dis.direcciones.izquierda
				)
					dis.siguienteDireccion = dis.direcciones.arriba;
			} else if (
				x >= tercioXCanvas &&
				x <= tercioXCanvas * 2 &&
				y >= tercioYCanvas * 2 &&
				y <= tercioYCanvas * 3
			) {
				if (
					dis.direccion === dis.direcciones.derecha ||
					dis.direccion === dis.direcciones.izquierda
				)
					dis.siguienteDireccion = dis.direcciones.abajo;
			}
		});

		$(document).keydown(evento => {
			let direccion = this.teclas[evento.keyCode];
			if (direccion) {
				if (
					(this.direccion === this.direcciones.derecha ||
						this.direccion === this.direcciones.izquierda) &&
					(direccion === "arriba" || direccion === "abajo")
				)
					this.siguienteDireccion = this.direcciones[direccion];
				else if (
					(this.direccion === this.direcciones.arriba ||
						this.direccion === this.direcciones.abajo) &&
					(direccion === "derecha" || direccion === "izquierda")
				)
					this.siguienteDireccion = this.direcciones[direccion];
			}
		});
	}
	ponerManzanaEnAlgunLugar() {
		let x, y;
		do {
			x = Math.floor(Math.random() * (this.longitudX - 2 + 1) + 1);
			y = Math.floor(Math.random() * (this.longitudY - 2 + 1) + 1);
		} while (this.matriz[x][y] !== NADA);
		this.matriz[x][y] = MANZANA;
	}
	agregarPedazo() {
		this.serpiente.push(new PedazoSerpiente());
	}
	dibujarSerpiente() {
		this.direccion = this.siguienteDireccion;
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
		juegoComenzado = true;
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
			juegoComenzado = false;
		} else {
			setTimeout(() => {
				this.dibujar();
			}, this.velocidadInicial / this.velocidad);
		}
	}
	obtenerMatrizEscenario(altura = this.longitudY, anchura = this.longitudX) {
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
	getStatus() {
		return { matriz: this.matriz, serpiente: this.serpiente };
	}
}

$(window).on("load", function () {
	let canvas = document.querySelector("canvas");
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	var ctx = canvas.getContext("2d");
	ctx.font = "20px Comic Sans MS";
	ctx.fillStyle = "#ffffff";
	ctx.textAlign = "center";
	ctx.fillText(
		"Toca o haz click para comenzar",
		canvas.width / 2,
		canvas.height / 2
	);
	$(document).keyup(evento => {
		if (evento.keyCode === 13 && !juegoComenzado) new Juego();
	});

	$("#canvas").click(() => {
		console.log("juegoComenzado", juegoComenzado);
		if (!juegoComenzado) new Juego();
	});
});
