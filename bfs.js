const grid = document.querySelector('#grid')
const smallGrid = document.querySelector('.small-grid')
const mediumGrid = document.querySelector('.medium-grid')
const largeGrid = document.querySelector('.large-grid')
const start = document.querySelector('.start-visual')
const reset = document.querySelector('.reset')
const status = document.querySelector('.status')
const speed = document.querySelectorAll('.speed');
let motionSpeed = 20;

let board
let cols
let source = null,
	destination = null
let sRow = -1,
	sCol = -1
let dRow = -1,
	dCol = -1
let dest = null


const changeSpeed = (x, event) => {
	motionSpeed = 20
	motionSpeed *= x;
	console.log(motionSpeed);
	for (let i = 0; i < speed.length; i++) {
		if (speed[i].getAttribute("speed") == x) {
			speed[i].style.fontSize = "30px";
		} else {
			speed[i].style.fontSize = "20px";
		}
	}

}
const gridGenerator = (gridType) => {
	let nRows = 0
	let nCols = 0
	let content = ''
	let height = 0
	let width = 0
	if (gridType == 'small') {
		nRows = 10
		nCols = 10
		height = 45
		width = 50
	} else if (gridType == 'medium') {
		nRows = 17
		nCols = 17
		height = 25
		width = 30
	} else {
		nRows = 26
		nCols = 26
		height = 15
		width = 20
	}

	//Initialising new board
	board = new Array(nRows)

	//Initialising col

	for (let i = 0; i < board.length; i++) {
		board[i] = new Array(nCols)
	}

	for (let i = 0; i < nRows; ++i) {
		let innerContent = `<div class = "row row-${i}">`
		for (let j = 0; j < nCols; j++) {
			innerContent += `<div class="col col-${i}-${j}" row=${i} col = ${j} style="height: ${height}px;width:${width}px;border: 2px solid  #0a0349; 
            "></div>`
		}
		innerContent += `</div>`
		content += innerContent
		grid.innerHTML = content
	}
	activateColumns(height, width)
}

//Highlighting source and destination in board(when created).
const activateColumns = (height, width) => {
	cols = document.querySelectorAll('.col')
	for (let i = 0; i < cols.length; i++) {
		cols[i].addEventListener('click', () => {
			if (!source) {
				source = cols[i]
				cols[i].style.background = "url('./assets/starting.jpg')"
				cols[i].style.backgroundPosition = 'center'
				cols[i].style.backgroundRepeat = 'no-repeat'
				cols[i].style.backgroundSize = `${height}px ${width}px`

				sRow = cols[i].getAttribute('row')
				sCol = cols[i].getAttribute('col')
				board[sRow][sCol] = 1
			} else if (!destination) {

				if (parseInt(cols[i].getAttribute("row")) == sRow &&
					parseInt(cols[i].getAttribute("col")) == sCol) {
					return;
				}
				destination = cols[i];

				cols[i].style.background = "url('./assets/trophy.jpg')"
				cols[i].style.backgroundPosition = 'center'
				cols[i].style.backgroundRepeat = 'no-repeat'
				cols[i].style.backgroundSize = `${height}px ${width}px`
				dRow = cols[i].getAttribute('row')
				dCol = cols[i].getAttribute('col')
				board[dRow][dCol] = 2
			} else {
				if (parseInt(cols[i].getAttribute("row")) == sRow &&
					parseInt(cols[i].getAttribute("col")) == sCol || parseInt(cols[i].getAttribute("row")) == dRow &&
					parseInt(cols[i].getAttribute("col")) == dCol) {
					return;
				}

				let blockRow = parseInt(cols[i].getAttribute('row'))
				let blockCol = parseInt(cols[i].getAttribute('col'))
				cols[i].style.background = "url('./assets/danger.jpg')"
				cols[i].style.backgroundPosition = 'center'
				cols[i].style.backgroundRepeat = 'no-repeat'
				cols[i].style.backgroundSize = `${height}px ${width}px`
				board[blockRow][blockCol] = -1
			}
		})
	}
}
const createVisitedArray = () => {
	let boardRow = board.length
	let boardCol = board.length

	let vis = new Array(boardRow)
	for (let i = 0; i < vis.length; i++) vis[i] = new Array(boardCol).fill(false)

	// for (let i = 0; i < vis.length; i++) {
	//     for (let j = 0; j < vis.length; j++) {
	//         console.log(vis[i][j]);
	//     }
	// }

	return vis
}
class Node {
	constructor(row, col) {
		this.row = row
		this.col = col
	}
}

const validNode = (vis, node) => {
	console.log(node);
	if (
		node.row < 0 ||
		node.row >= board.length ||
		node.col < 0 ||
		node.col >= board.length ||
		board[node.row][node.col] == -1
	) {

		return false
	}
	if (vis[node.row][node.col]) {
		// console.log(node.row, node.col + "true");
		return false
	}
	// console.log(node);

	return true
}

const bfs = async () => {
	let queue = []
	let vis = createVisitedArray()
	vis[sRow][sCol] = true

	queue.push(new Node(parseInt(sRow), parseInt(sCol)))

	while (queue.length > 0) {
		let curr = queue.shift()

		// console.log(curr.row, curr.col, vis[curr.row][curr.col]);

		let rightNode = new Node(parseInt(curr.row), parseInt(curr.col) + 1)
		let topNode = new Node(parseInt(curr.row) + 1, parseInt(curr.col))
		let leftNode = new Node(parseInt(curr.row), parseInt(curr.col) - 1)
		let bottomNode = new Node(parseInt(curr.row) - 1, parseInt(curr.col))

		if (validNode(vis, topNode)) {
			if (board[topNode.row][topNode.col] == 2) {
				destination.style.background = "url('./assets/winner.png')"
				destination.style.backgroundPosition = 'center'
				destination.style.backgroundRepeat = 'no-repeat'
				destination.style.backgroundSize = '50px 50px'

				// alert("Position found at" + curr.row + " " + curr.col);
				return true;
			} else {
				await fillColor(topNode.row, topNode.col)
				queue.push(topNode)
				vis[topNode.row][topNode.col] = true
			}
		}
		if (validNode(vis, rightNode)) {
			if (board[rightNode.row][rightNode.col] == 2) {
				destination.style.background = "url('./assets/winner.png')"
				destination.style.backgroundPosition = 'center'
				destination.style.backgroundRepeat = 'no-repeat'
				destination.style.backgroundSize = '50px 50px'

				// alert("Position found at" + curr.row + " " + curr.col);
				return true;
			}
			else {
				await fillColor(rightNode.row, rightNode.col)
				queue.push(rightNode)
				vis[rightNode.row][rightNode.col] = true
			}
		}

		if (validNode(vis, leftNode)) {
			if (board[leftNode.row][leftNode.col] == 2) {
				destination.style.background = "url('./assets/winner.png')"
				destination.style.backgroundPosition = 'center'
				destination.style.backgroundRepeat = 'no-repeat'
				destination.style.backgroundSize = '50px 50px'

				// alert("Position found at" + curr.row + " " + curr.col);
				return true;
			}
			else {
				await fillColor(leftNode.row, leftNode.col)
				queue.push(leftNode)
				vis[leftNode.row][leftNode.col] = true
			}
		}
		if (validNode(vis, bottomNode)) {
			if (board[bottomNode.row][bottomNode.col] == 2) {
				destination.style.background = "url('./assets/winner.png')"
				destination.style.backgroundPosition = 'center'
				destination.style.backgroundRepeat = 'no-repeat'
				destination.style.backgroundSize = '50px 50px'

				// alert("Position found at" + curr.row + " " + curr.col);
				return true;
			}
			else {
				await fillColor(bottomNode.row, bottomNode.col)
				queue.push(bottomNode)

				vis[bottomNode.row][bottomNode.col] = true
			}
		}
	}
	return false;
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
const fillColor = async (r, c) => {
	console.log(c == 9)
	await sleep(motionSpeed)
	for (let i = 0; i < cols.length; i++) {
		if (
			parseInt(cols[i].getAttribute('row')) == r &&
			parseInt(cols[i].getAttribute('col')) == c
		) {
			const elem = document.querySelector(
				`.col-${parseInt(cols[i].getAttribute('row'))}-${parseInt(
					cols[i].getAttribute('col')
				)}`
			)

			// cols[i].style.backgroundColor = "#0a0349";
			cols[i].style.background = "url('./assets/cartoon.png')"
			cols[i].style.backgroundPosition = 'center'
			cols[i].style.backgroundRepeat = 'no-repeat'
			cols[i].style.backgroundSize = '50px 50px'
		}
	}
}

smallGrid.addEventListener('click', () => {
	; (source = null), (destination = null)
	gridGenerator('small')
})

mediumGrid.addEventListener('click', () => {
	; (source = null), (destination = null)
	gridGenerator('medium')
})

largeGrid.addEventListener('click', () => {
	; (source = null), (destination = null)
	gridGenerator('large')
})

reset.addEventListener('click', () => {
	; (source = null), (destination = null)
	grid.innerHTML = ''
})

const disableControls = () => {
	smallGrid.style.background = "grey";
	smallGrid.disabled = true;

	mediumGrid.disabled = true;
	mediumGrid.style.background = "grey";

	start.style.background = "grey";
	start.disabled = true;

	reset.style.background = "grey";
	reset.disabled = true;

	largeGrid.disabled = true;
	largeGrid.style.background = "grey";

	for (let i = 0; i < speed.length; i++) {
		speed[i].style.background = "grey";
		speed[i].disabled = true;
	}
}

const activateControls = () => {

	for (let i = 0; i < speed.length; i++) {
		speed[i].style.background = "#0a0349";
		speed[i].disabled = false;
	}

	smallGrid.style.background = "#0a0349";
	smallGrid.disabled = false;
	mediumGrid.disabled = false;
	mediumGrid.style.background = "#0a0349";
	largeGrid.disabled = false;
	largeGrid.style.background = "#0a0349";
	start.disabled = false;
	reset.disabled = false;
	start.style.background = "#0a0349";
	reset.style.background = "#0a0349";
}

start.addEventListener('click', async () => {

	disableControls();
	if (!source || !destination) {
		alert('Choose source and destination carefully')
	} else {
		if (await bfs()) {
			status.innerHTML = `Destination found at ${dRow},${dCol}`;
		} else {
			status.innerHTML = `Destination not found,Try choosing another positions`;

		}

	}
	activateControls();
})
