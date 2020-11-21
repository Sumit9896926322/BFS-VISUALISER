const grid = document.querySelector('#grid')
const smallGrid = document.querySelector('.small-grid')
const mediumGrid = document.querySelector('.medium-grid')
const largeGrid = document.querySelector('.large-grid')
const start = document.querySelector('.start-visual')
const reset = document.querySelector('.reset')
const status = document.querySelector('.status')
const speed = document.querySelectorAll('.speed');
let motionSpeed = 20;//Transition speed global variable

/*sRow = source-row
  sCol = source-col
  dRow = destination-row
  dCol = destination-col
*/
let board
let cols
let source = null,
	destination = null
let sRow = -1,
	sCol = -1
let dRow = -1,
	dCol = -1
let dest = null



//control transition speed 
const changeSpeed = (x, event) => {
	motionSpeed = 20
	motionSpeed *= x;
	console.log(motionSpeed);
	for (let i = 0; i < speed.length; i++) {
		if (speed[i].getAttribute("speed") == x) {
			speed[i].style.boxShadow = "5px 5px grey";
		} else {
			speed[i].style.boxShadow = "";
		}
	}

}



//Generating grid type
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
	//Maintainng three states with variable source,destination and blocke.
	cols = document.querySelectorAll('.col')
	for (let i = 0; i < cols.length; i++) {
		cols[i].addEventListener('click', () => {

			if (!source) {
				//Marking cell as source
				source = cols[i]
				cols[i].style.background = "url('./assets/starting.jpg')"
				cols[i].style.backgroundPosition = 'center'
				cols[i].style.backgroundRepeat = 'no-repeat'
				cols[i].style.backgroundSize = `${height}px ${width}px`

				sRow = cols[i].getAttribute('row')
				sCol = cols[i].getAttribute('col')
				board[sRow][sCol] = 1
			} else if (!destination) {
				//Marking cell as destination

				//Source and destination can't be same.
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
				//source and destination can't be selected as blocked cell
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
				//placing the wall or making cell blocked
				board[blockRow][blockCol] = -1;
			}
		})
	}
}
const createVisitedArray = () => {
	let boardRow = board.length
	let boardCol = board.length

	//Initialising visited array with default value as null
	let vis = new Array(boardRow)
	for (let i = 0; i < vis.length; i++) vis[i] = new Array(boardCol).fill(false)



	return vis
}
class Node {
	constructor(row, col) {
		this.row = row
		this.col = col
	}
}

//return true if the node is in boundary and not blocked
const validNode = (vis, node) => {

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
		return false
	}


	return true
}

const bfs = async () => {
	let queue = []
	let vis = createVisitedArray()
	vis[sRow][sCol] = true

	queue.push(new Node(parseInt(sRow), parseInt(sCol)))

	while (queue.length > 0) {
		let curr = queue.shift()

		/*
		Exploring all the directions
		1.right
		2.top
		3.left
		4.bottom
		*/
		let rightNode = new Node(parseInt(curr.row), parseInt(curr.col) + 1)
		let topNode = new Node(parseInt(curr.row) + 1, parseInt(curr.col))
		let leftNode = new Node(parseInt(curr.row), parseInt(curr.col) - 1)
		let bottomNode = new Node(parseInt(curr.row) - 1, parseInt(curr.col))

		if (validNode(vis, topNode)) {
			if (board[topNode.row][topNode.col] == 2) {
				//Setting custom styles if it reached destination cell.
				destination.style.background = "url('./assets/winner.png')"
				destination.style.backgroundPosition = 'center'
				destination.style.backgroundRepeat = 'no-repeat'
				destination.style.backgroundSize = '50px 50px'

				return true;
			} else {
				//waiting for the fillColor to complete its execution.
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

//Asynchronous function to block execution while sleeping
const fillColor = async (r, c) => {
	console.log(c == 9)
	await sleep(motionSpeed)
	for (let i = 0; i < cols.length; i++) {
		if (
			parseInt(cols[i].getAttribute('row')) == r &&
			parseInt(cols[i].getAttribute('col')) == c
		) {
			//Targetting the same box which is being transitioned
			const elem = document.querySelector(
				`.col-${parseInt(cols[i].getAttribute('row'))}-${parseInt(
					cols[i].getAttribute('col')
				)}`
			)


			cols[i].style.background = "url('./assets/cartoon.png')"
			cols[i].style.backgroundPosition = 'center'
			cols[i].style.backgroundRepeat = 'no-repeat'
			cols[i].style.backgroundSize = '50px 50px'
		}
	}
}

const emptyStatus = () => {
	status.innerHTML = "";
}
//Generating grid from user demand
smallGrid.addEventListener('click', () => {
	; (source = null), (destination = null)
	gridGenerator('small')
	emptyStatus();
})

mediumGrid.addEventListener('click', () => {
	; (source = null), (destination = null)
	gridGenerator('medium')
	emptyStatus();
})

largeGrid.addEventListener('click', () => {
	; (source = null), (destination = null)
	gridGenerator('large')
	emptyStatus();
})


//Clearing the grid
reset.addEventListener('click', () => {
	; (source = null), (destination = null)
	grid.innerHTML = ''
	emptyStatus();
})


//Disabling button click while transition is being done.
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
/*


INSERT INTO student (name,email,phone,courseID) VALUES ("Taylor","lacinia.orci.consectetuer@sedhendrerit.co.uk","1-932-656-2530",30),("Silas","Praesent.eu.nulla@magnamalesuada.com","1-480-646-9091",13),("Justine","luctus@urna.edu","1-112-251-4810",21),("Madison","Duis.at@Namligulaelit.edu","1-262-658-2352",30),("Duncan","malesuada.vel@volutpatnuncsit.com","1-473-593-5044",28),("Emma","nostra.per.inceptos@variusorciin.com","1-410-216-7044",1),("Madeline","velit.Pellentesque@parturientmontes.net","1-782-550-8823",30),("Buckminster","non.dapibus.rutrum@Inornaresagittis.co.uk","1-470-332-5108",22),("Keane","montes.nascetur@nequevitaesemper.org","1-578-881-5600",25),("Ella","quam@nuncsed.net","1-566-595-8620",21);
INSERT INTO student (name,email,phone,courseID) VALUES ("Hasad","arcu.Nunc.mauris@etultrices.co.uk","1-873-797-5256",18),("Nicole","enim@tinciduntnequevitae.edu","1-972-338-2640",15),("Haley","Praesent.luctus@rhoncusDonec.net","1-495-602-1559",1),("Lewis","vel.sapien@velest.com","1-359-790-4500",28),("Illana","mauris@idrisusquis.net","1-200-237-2514",10),("Lara","augue.scelerisque.mollis@Phasellusdolorelit.co.uk","1-826-556-5238",1),("Karyn","enim.Etiam.imperdiet@Nullasemper.ca","1-230-986-7791",25),("Nell","Nunc.pulvinar@nullaatsem.co.uk","1-378-609-3473",28),("Felix","in@nonenimMauris.co.uk","1-259-751-7934",17),("Addison","vitae@tinciduntaliquamarcu.co.uk","1-889-657-0237",17);
INSERT INTO student (name,email,phone,courseID) VALUES ("Beau","diam.Duis.mi@dui.net","1-974-511-5403",26),("Lacota","ultricies.ornare.elit@ridiculusmusProin.co.uk","1-378-767-4680",11),("Lamar","magnis.dis.parturient@erat.org","1-404-811-7808",4),("Hillary","rutrum.eu.ultrices@ornareelit.com","1-294-671-8930",18),("Libby","Sed@nonarcu.net","1-123-231-5166",30),("Lev","quis@diamluctus.co.uk","1-374-961-0994",1),("Michelle","interdum@orciUt.ca","1-452-558-5375",24),("Hanae","Suspendisse.dui@duinec.com","1-871-727-7564",8),("Orlando","sem.eget.massa@dictumcursus.ca","1-687-595-6887",28),("Devin","ultrices.Duis@etmagnisdis.edu","1-159-694-2226",4);
INSERT INTO student (name,email,phone,courseID) VALUES ("William","fringilla.mi@id.ca","1-236-929-7670",18),("Yvette","hendrerit.consectetuer@magnaCras.org","1-304-881-0712",11),("Jana","consectetuer@gravidasagittis.net","1-269-563-4786",19),("Colton","nonummy@velitegestaslacinia.com","1-886-418-4423",27),("Simone","Sed.diam@sitametconsectetuer.net","1-680-895-8307",12),("Francis","In@Phaselluslibero.co.uk","1-720-228-1855",18),("Boris","laoreet.posuere@necmollisvitae.ca","1-611-493-5356",2),("Dieter","arcu.Curabitur@Curabiturconsequatlectus.com","1-336-234-7933",25),("Halla","eu.augue.porttitor@penatibusetmagnis.org","1-585-699-3483",3),("Aubrey","arcu.et.pede@consectetueradipiscingelit.com","1-531-340-3735",10);
INSERT INTO student (name,email,phone,courseID) VALUES ("Hasad","tellus@dapibusligula.org","1-144-179-8188",23),("Uriel","at.velit.Pellentesque@tinciduntvehicula.edu","1-548-654-4500",21),("Phillip","a.sollicitudin.orci@hendreritidante.ca","1-798-763-9792",20),("Ayanna","facilisis.non@nonfeugiat.com","1-213-247-4719",2),("Dorian","mattis.Integer.eu@nisiMauris.co.uk","1-391-182-9456",22),("Karyn","morbi.tristique.senectus@cursus.org","1-535-284-9302",11),("Gretchen","auctor.vitae.aliquet@tempusloremfringilla.com","1-694-261-0290",4),("Barrett","faucibus.ut@egestasadui.ca","1-749-360-1836",21),("Sophia","Integer@Aenean.com","1-168-352-8365",1),("Margaret","bibendum.Donec@eu.net","1-712-630-0255",1);
INSERT INTO student (name,email,phone,courseID) VALUES ("Kiayada","non.ante.bibendum@sitametrisus.co.uk","1-986-819-4980",6),("Ryder","fringilla.ornare.placerat@lectus.com","1-367-927-7983",25),("Jonas","Donec.nibh.Quisque@mattisornarelectus.com","1-200-298-4176",6),("Cade","at.lacus.Quisque@sempererat.org","1-463-405-8806",23),("Rooney","quam.Pellentesque@Aeneanmassa.edu","1-754-341-6860",19),("Lewis","ornare.libero.at@ultrices.com","1-235-576-1994",18),("Dennis","Nunc.pulvinar@Aliquamvulputate.com","1-173-368-2195",15),("Nomlanga","eget.laoreet.posuere@at.net","1-636-288-9715",6),("Bree","lectus.pede@ornare.edu","1-976-467-0311",9),("Sopoline","lacinia@Donecelementum.ca","1-732-901-0629",6);
INSERT INTO student (name,email,phone,courseID) VALUES ("Xantha","ullamcorper@erosturpis.co.uk","1-419-847-6131",30),("Vivien","litora.torquent.per@semut.org","1-296-935-9005",7),("Aretha","Nullam@nullaDonec.co.uk","1-446-556-8693",3),("Tasha","Pellentesque.ut@liberoProin.edu","1-502-153-1733",19),("Julian","eget.magna.Suspendisse@bibendumDonecfelis.net","1-384-374-8124",25),("Stella","vitae.posuere@aliquetmolestietellus.ca","1-818-225-2606",22),("Nora","mauris.sagittis@ligulaeuenim.net","1-594-737-8496",11),("Kiona","dictum.Phasellus.in@odioAliquam.ca","1-773-597-0578",14),("Meredith","diam@sed.org","1-641-768-1108",27),("Uriel","at@ametluctus.net","1-357-709-1524",3);
INSERT INTO student (name,email,phone,courseID) VALUES ("Anika","elit.pretium.et@aliquet.net","1-717-890-4464",18),("Kelsie","rutrum@pedeSuspendissedui.co.uk","1-338-395-0669",4),("Ralph","lorem.auctor.quis@faucibus.co.uk","1-468-193-9499",21),("Macy","consequat.lectus@ornaresagittisfelis.ca","1-575-464-2969",30),("Christian","primis.in.faucibus@justo.org","1-930-545-3772",6),("Jade","non.ante@disparturient.com","1-520-374-6327",2),("Tasha","ultrices.posuere.cubilia@pede.org","1-569-310-8731",5),("Oren","dui.semper@Fuscefeugiat.com","1-314-455-4380",9),("Macy","ornare.In@Classaptenttaciti.edu","1-158-340-9232",18),("Jameson","fringilla.est@nonummyipsum.org","1-618-332-3252",20);
INSERT INTO student (name,email,phone,courseID) VALUES ("Slade","viverra.Donec.tempus@lectusconvallis.net","1-178-745-1146",10),("Savannah","faucibus@nuncrisus.co.uk","1-430-654-4748",21),("Leo","auctor@sempercursus.com","1-119-881-6193",11),("Belle","massa.Integer@sitametconsectetuer.com","1-279-285-7865",7),("Graiden","Nunc.mauris@consequatenim.com","1-159-603-1824",4),("Callie","luctus.vulputate.nisi@necimperdietnec.net","1-258-795-7244",19),("Brenda","placerat.Cras@odioAliquamvulputate.co.uk","1-505-697-8448",17),("Samantha","dapibus@convallisdolorQuisque.edu","1-483-916-2885",30),("Hammett","molestie.sodales@amet.net","1-747-397-4665",27),("Kim","Quisque.tincidunt@nullaCraseu.ca","1-824-862-2403",2);
INSERT INTO student (name,email,phone,courseID) VALUES ("Stone","scelerisque@commodoat.edu","1-527-773-4031",11),("Samuel","interdum.ligula@Cum.net","1-929-725-5148",11),("Cruz","Ut.nec.urna@ipsum.com","1-960-865-2136",23),("Madeson","penatibus.et.magnis@at.co.uk","1-351-710-5167",17),("Deanna","amet@tristiquepellentesque.edu","1-144-913-0716",13),("Nehru","fermentum.fermentum.arcu@metusAenean.co.uk","1-349-302-4385",12),("Maisie","diam.vel.arcu@magna.edu","1-284-629-4291",2),("Aaron","iaculis.lacus.pede@Donecfeugiatmetus.net","1-613-101-9065",17),("Chastity","lorem@lobortisClassaptent.net","1-406-861-2642",3),("Declan","ac.fermentum@Nuncpulvinar.edu","1-297-843-1070",29);



*/
//Making button able to work after the transition is done/
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


//Call bfs only if source and destination are selected
start.addEventListener('click', async () => {

	disableControls();
	if (!source || !destination) {
		alert('Choose source and destination carefully or try changing grid')
	} else {
		if (await bfs()) {
			status.innerHTML = `Destination found at ${dRow},${dCol}`;
		} else {
			status.innerHTML = `Destination not found,Try choosing another positions`;

		}
		source = null;
		destination = null;
	}
	activateControls();
})
