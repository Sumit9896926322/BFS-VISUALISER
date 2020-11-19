const grid = document.querySelector("#grid");
const smallGrid = document.querySelector(".small-grid");
const mediumGrid = document.querySelector(".medium-grid");
const largeGrid = document.querySelector(".large-grid");
const start = document.querySelector(".start-visual");
const reset = document.querySelector(".reset");
const status = document.querySelector(".status");
let board;
let cols;
let source = null, destination = null;
let sRow = -1, sCol = -1;
let dRow = -1, dCol = -1;
let dest = null;


const gridGenerator = (gridType) => {
    let nRows = 0;
    let nCols = 0;
    let content = "";
    let height = 0;
    let width = 0;
    if (gridType == "small") {
        nRows = 10;
        nCols = 10;
        height = 45;
        width = 50;
    } else if (gridType == "medium") {
        nRows = 17;
        nCols = 17;
        height = 25;
        width = 30;
    } else {
        nRows = 26;
        nCols = 26;
        height = 15;
        width = 20;
    }


    //Initialising new board
    board = new Array(nRows);

    //Initialising col

    for (let i = 0; i < board.length; i++) {
        board[i] = new Array(nCols);
    }

    for (let i = 0; i < nRows; ++i) {
        let innerContent = `<div class = "row row-${i}">`;
        for (let j = 0; j < nCols; j++) {

            innerContent += `<div class="col col-${i}-${j}" row=${i} col = ${j} style="height: ${height}px;width:${width}px;border: 2px solid  #0a0349; 
            "></div>`;
        }
        innerContent += `</div>`;
        content += innerContent;
        grid.innerHTML = content;
    }
    activateColumns(height, width);
}

//Highlighting source and destination in board(when created).
const activateColumns = (height, width) => {

    cols = document.querySelectorAll(".col");
    for (let i = 0; i < cols.length; i++) {
        cols[i].addEventListener("click", () => {

            if (!source) {
                source = cols[i];
                cols[i].style.background = "url('./assets/starting.jpg')";
                cols[i].style.backgroundPosition = "center";
                cols[i].style.backgroundRepeat = "no-repeat";
                cols[i].style.backgroundSize = `${height}px ${width}px`;

                sRow = cols[i].getAttribute("row");
                sCol = cols[i].getAttribute("col");
                board[sRow][sCol] = 1;

            }
            else if (!destination) {
                destination = cols[i];

                cols[i].style.background = "url('./assets/trophy.jpg')";
                cols[i].style.backgroundPosition = "center";
                cols[i].style.backgroundRepeat = "no-repeat";
                cols[i].style.backgroundSize = `${height}px ${width}px`;
                dRow = cols[i].getAttribute("row");
                dCol = cols[i].getAttribute("col");
                board[dRow][dCol] = 2;
            } else {
                let blockRow = parseInt(cols[i].getAttribute("row"));
                let blockCol = parseInt(cols[i].getAttribute("col"));
                cols[i].style.background = "url('./assets/danger.jpg')";
                cols[i].style.backgroundPosition = "center";
                cols[i].style.backgroundRepeat = "no-repeat";
                cols[i].style.backgroundSize = `${height}px ${width}px`;
                board[blockRow][blockCol] = -1;

            }

        });
    }


}
const createVisitedArray = () => {
    let boardRow = board.length;
    let boardCol = board.length;

    let vis = new Array(boardRow);
    for (let i = 0; i < vis.length; i++)
        vis[i] = new Array(boardCol).fill(false);


    // for (let i = 0; i < vis.length; i++) {
    //     for (let j = 0; j < vis.length; j++) {
    //         console.log(vis[i][j]);
    //     }
    // }

    return vis;
}
class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

const validNode = (vis, node) => {

    if (node.row < 0 || node.row >= board.length || node.col < 0 || node.col >= board.length || board[node.row][node.col] == -1) {
        // console.log(node.row, node.col + "index error");
        return false;
    }
    if (vis[node.row][node.col]) {
        // console.log(node.row, node.col + "true");
        return false;

    }
    console.log(node);

    return true;
}

const bfs = async () => {

    let queue = [];
    let vis = createVisitedArray();
    vis[sRow][sCol] = true;

    queue.push(new Node(parseInt(sRow), parseInt(sCol)));


    while (queue.length > 0) {
        let curr = queue.shift();

        // console.log(curr.row, curr.col, vis[curr.row][curr.col]);
        if (board[curr.row][curr.col] == 2) {


            destination.style.background = "url('./assets/winner.png')";
            destination.style.backgroundPosition = "center";
            destination.style.backgroundRepeat = "no-repeat";
            destination.style.backgroundSize = "50px 50px";

            // alert("Position found at" + curr.row + " " + curr.col);
            return;
        }

        let rightNode = new Node(parseInt(curr.row), parseInt(curr.col) + 1);
        let topNode = new Node(parseInt(curr.row) + 1, parseInt(curr.col));
        let leftNode = new Node(parseInt(curr.row), parseInt(curr.col) - 1);
        let bottomNode = new Node(parseInt(curr.row) - 1, parseInt(curr.col));

        if (validNode(vis, topNode)) {
            await fillColor(curr.row, curr.col).then(() => {

                queue.push(topNode);
                vis[topNode.row][topNode.col] = true;
            });

        }
        if (validNode(vis, rightNode)) {
            await fillColor(curr.row, curr.col).then(() => {

                queue.push(rightNode);
                vis[rightNode.row][rightNode.col] = true;
            });

        }



        if (validNode(vis, leftNode)) {
            await fillColor(curr.row, curr.col).then(() => {
                queue.push(leftNode);
                vis[leftNode.row][leftNode.col] = true;
            });

        }
        if (validNode(vis, bottomNode)) {
            await fillColor(curr.row, curr.col).then(() => {

                queue.push(bottomNode);

                vis[bottomNode.row][bottomNode.col] = true;
            });

        }

    }


}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const fillColor = async (r, c) => {

    console.log(r, c);
    await sleep(10);
    for (let i = 0; i < cols.length; i++) {


        if (parseInt(cols[i].getAttribute("row")) == r && parseInt(cols[i].getAttribute("col")) == c) {
            const elem = document.querySelector(`.col-${parseInt(cols[i].getAttribute("row"))}-${parseInt(cols[i].getAttribute("col"))}`);

            // cols[i].style.backgroundColor = "#0a0349";
            cols[i].style.background = "url('./assets/cartoon.png')";
            cols[i].style.backgroundPosition = "center";
            cols[i].style.backgroundRepeat = "no-repeat";
            cols[i].style.backgroundSize = "50px 50px";


        }
    }
}

smallGrid.addEventListener("click", () => {
    source = null, destination = null;
    gridGenerator("small");
});


mediumGrid.addEventListener("click", () => {
    source = null, destination = null;
    gridGenerator("medium");
});

largeGrid.addEventListener("click", () => {
    source = null, destination = null;
    gridGenerator("large");
});

reset.addEventListener("click", () => {
    source = null, destination = null;
    grid.innerHTML = "";
});
start.addEventListener("click", async () => {

    if (!source || !destination) {
        alert("Choose source and destination carefully");
    } else {
        bfs();

    }
});
