import { Actor, CollisionType, Color, Engine, Font, Text, vec } from "excalibur"

// 1 - Criar uma instancia de Engine, que representa o jogo.
const game = new Engine({
	width: 800,
	height: 600
})

// 2 - Cria barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40,
	width: 200,
	height: 20,
	color: Color.Chartreuse,
	name: "BarraJogador"
})

barra.body.collisionType = CollisionType.Fixed

// Insero o actor barra no game
game.add(barra)


// 3 - Movimentar a barra de acordo com o ponteiro do mouse
game.input.pointers.primary.on("move", (event) => {
	barra.pos.x = event.worldPos.x
})

// 4 - Criar o Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

// 5 - Criar movimentação bolinha
const velocidadeBolinha = vec(1000, 100)

// Apos 1 segundo (1000ms), define a velocidade da bolinha em x 
setTimeout( ()=> {
	bolinha.vel = velocidadeBolinha
},  1000)

// 6 - Fazer bolinha rebater na parede
bolinha.on("postupdate", () => {
	// Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x
	}
	
	// Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadeBolinha.x 
	}
	// Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y
	}

	// Se a bolinha colidir com o lado esquerdo
	// if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
	// 	bolinha.vel.y = -velocidadeBolinha.y
	// }
})

// Insere bolinha no game
game.add(bolinha)


// 7 - Criar os blocos
//
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

const larguraBLoco = (game.drawWidth / colunas) - padding - (padding / colunas)
// const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

// Renderização dos bloquinhos

// Renderiza 3 linhas
for(let j = 0; j < linhas; j++) {
	//Renderiza 5 bloquinhos
for(let i = 0; i  < colunas; i++) {
	listaBlocos.push(
		new Actor({
			x: xoffset + i * (larguraBLoco + padding) + padding,
			y: yoffset + j * (alturaBloco + padding) + padding,
			width: larguraBLoco,
			height: alturaBloco,
			color: corBloco[j]
		})
	)
}
}

listaBlocos.forEach( bloco => {
	// Deine o tipo de colisor de cada bloco
	bloco.body.collisionType = CollisionType.Active

	// Adiciona cada bloc no game
	game.add(bloco)
})

// Adicionando Pontuação
let pontos = 0

const textoPontos = new Text( {
	text: "Hello Wold",
	font: new Font({})
})

const objetoTexto = new Actor({
	x: game.drawHeight - 80 ,
	y: game.drawHeight - 15
})

objetoTexto.graphics.use(textoPontos)

game.add(objetoTexto)

let colidindo: boolean = false


bolinha.on("collisionstart", (event) => {
	// Verifica se abolinha colidiu com algun bloco destrutivel
	console.log(event.other.name);

	// Se o elemento colidido for um bloc da lista de blocos (destrutivel)
	if ( listaBlocos.includes(event.other)) {
		//Destruir o bloco colidido
		event.other.kill()
	}

	// Rebater a bolinha : Inverter as direceções x e y.
	let interseccao = event.contact.mtv.normalize()


	// Se nao esta colidindo
	// !colidindo 
	if (colidindo == false) {
		colidindo = true

		// Intersecção.x e Intersecção.y
		// O maior representa o eixo onde houve o contato
		if (Math.abs( interseccao.x ) > Math.abs(interseccao.y) ) {

			//bolinha.vel.x = -bolinha.vel.x
			// bolinha.vel.x = *= -1
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			//bolinha.vel.y = -bolinha.vel.y
			// bolinha.vel.y = *= -1
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}

})

bolinha.on("collisionend", () => {
	colidindo = false
})

bolinha.on("exitviewport", () => {
	alert("E morreu")
	window.location.reload()
})

// Inicia o game
game.start()
