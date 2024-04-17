
// Thực hiện các chức năng của game Pikachu.
var gameDialog = document.getElementById("game-dialog");
var gameBoard = document.getElementById("board-game");
var isVisible = true;
var level = selectLevelValue();

var div = document.createElement("div");
div.image = document.createElement("img");


var setVisible = function(cell, flag) {
    this.cell = cell
    this.style.visibility = flag ? "visible" : "hidden";
}
var setDisplay = function(flag) {
    this.isVisible = flag;
    this.style.display = flag ? "block" : "none";
}



var row, col;
var selectedPokemonCells = [];
var matrixMap = createMatrix(11,18);

console.log(matrixMap);


// Thực hiện các chức năng khi StartGame.
function startGame() {
    gameDialog.style.display = 'none';  // Khi click Bắt đầu, Dialog biến mất.
    // View Hiển thị người dùng
    displayLevel();
    setNewLevel(level, 10, 0);
}
function createMatrix(rows, columns) {
    const matrix = [];


    // Tạo một mảng chứa các số từ 1 đến 36
    const numbers = [];
    for (let i = 1; i <= 36; i++) {
        numbers.push(i);
    }
    // Khởi tạo ma trận và gán các giá trị vào các ô
    let index = 0;
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j += 2) {
            const randomNumber = numbers[index++ % numbers.length];
            row.push(randomNumber);
            row.push(randomNumber);
        }
        matrix.push(row);
    }
    return matrix;
}

function pokemonCellsBtnAction(cell) {
    cell.addEventListener('click', function() {
        const namePokemonCell = cell.style.backgroundImage;
        const position = getPokemonPosition(cell); // Lấy vị trí của ô Pokemon được chọn
        // Kiểm tra xem ô Pokemon đã được lật hay chưa và đã có 2 ô được chọn chưa
        console.log("Bạn đã click vào " + namePokemonCell.slice(16, namePokemonCell.length - 5));
        if (!cell.classList.contains('flipped') && selectedPokemonCells.length < 2) {
            flipPokemon(cell, position.row, position.col);  // Lật ô Pokemon.
            selectedPokemonCells.push(cell); // Lưu lại ô Pokemon và vị trí của nó vào mảng selectedPokemonCells
            for (let i = 0; i < selectedPokemonCells.length; i++) {
                if (selectedPokemonCells[i]) { // Kiểm tra xem phần tử có tồn tại không
                    // setVisibleClickCell(selectedPokemonCells[i], "1");
                    selectedPokemonCells[i].style.padding = 1 + "px";
                }
            }
            // Kiểm tra nếu đã chọn đủ 2 ô Pokemon
            if (selectedPokemonCells.length === 2) {
                // Nếu 2 ô Pokemon giống nhau.
                if (checkMatch()) {
                    handleMatch();  // Xử lý khi 2 ô Pokemon giống nhau
                } else {
                    // Xử lý khi 2 ô Pokemon không giống nhau.
                    handleMismatch();
                }
            }
        }
    });
}
function checkMatch() {
    const img1 = selectedPokemonCells[0].style.backgroundImage; // Lấy backgroundImage của cell 1
    const img2 = selectedPokemonCells[1].style.backgroundImage; // Lấy backgroundImage của cell 2
    return img1 === img2;
}
function displayFinishedGame() {
    console.log('Chúc mừng bạn đã vượt qua mức độ: ' + selectLevelValue());
}
function getPokemonCellByPosition(row, col) {
    return document.querySelector(`div[row='${row}'][col='${col}']`);
}
// Hàm lấy vị trí của ô Pokemon trong ma trận
function getPokemonPosition(pokemonCell) {
    const row = Number.parseInt(pokemonCell.getAttribute('row')); //  Lấy giá trị của row
    const col = Number.parseInt(pokemonCell.getAttribute('col')); //  Lấy giá trị của col

    return { "row": row, "col": col}; // Trả về vị trí của ô Pokemon dưới dạng object
}
// Trong hàm flipPokemon:
function flipPokemon(cell, row, col) {
    cell.classList.add('flipped');  // Nếu người chơi chọn ô đầu tiên thì sẽ set class="flipped" cho ô đó.
}
function handleMatch() {
    const position1 = getPokemonPosition(selectedPokemonCells[0]);
    const position2 = getPokemonPosition(selectedPokemonCells[1]);

    console.log("Vị trí của Pokemon 1 : ", position1);
    console.log("Vị trí của Pokemon 2 : ", position2);

    // let matrix = createMatrix(12, 20);

    const cell1 = getPokemonCellByPosition(position1.row, position1.col);
    const cell2 = getPokemonCellByPosition(position2.row, position2.col);


    const path = checkTwoPoint(position1, position2);

    // DRAW LINE
    var lines = new Array();
    for (let i = 0; i < 3; i++) {   // Chỉ chứa 3 line khoảng cách giữa 2 cell
        lines[i] = document.createElement("div");
        lines[i].style.position = "absolute";
        lines[i].style.visibility = "hidden";
        lines[i].style.backgroundColor = "red";
    }

    var pathsList = [];

    // const path = checkPath(matrixMap, cell1, cell2);

    if (path != null) {    // Nếu đường đi hợp lệ.
        // console.log(path);
        if (selectLevelValue() == 1) {
            console.log(path);
            repaint("score", blood+=10);
            this.matrixMap[position1.row][position1.col] = 0;  //Đặt lại giá trị của 2 ô này thành giá trị không
            this.matrixMap[position2.row][position2.col] = 0;
            setHiddenVisibleCell(cell1, cell2, 'hidden', '0px')
            pathsList.push(path);
            drawLine(pathsList);
            // setTimeout("afterDrawPath()", 200);
        } else {
            setNoneDisplayCell(cell1, cell2, 'none');
        }
    } else {
        console.log("No Path");
    }
    selectedPokemonCells = [];  // Đặt lại ds ô POkemon đã chọn.
}
function drawLine(pathsList) {
    var point1 = pathsList[0];
    console.log("check: " + point1);
    var point2;
    var centre1, centre2;
    var i, rect;
    for (i = 1; i < pathsList.length; i++) {
        point2 = pathsList[i];
        centre1 = findCentre(point1.x, point1.y);
        centre2 = findCentre(point2.x, point2.y);
        rect = getRRR(centre1, centre2);
        // Tạo mới một div đại diện cho line và thiết lập các thuộc tính cần thiết
        var lineDiv = document.createElement("div");
        lineDiv.style.position = "absolute";
        lineDiv.style.left = rect.x - 30 + "px";
        lineDiv.style.top = rect.y + "px";
        lineDiv.style.width = rect.width + "px";
        lineDiv.style.height = rect.height + "px";
        lineDiv.style.backgroundColor = "red";
        // Thêm line vào trong linesContainer của pokemonCells
        let pokemonCells = document.getElementsByClassName('pokemonCells');
        pokemonCells.querySelector('.lines-container').appendChild(lineDiv);
        point1 = point2;
    }
    for (i = 1; i < pathsList.length; i++)
        lines[i - 1].style.visibility = "visible";
    console.log("check line");
}

function setNoneDisplayCell(cell1, cell2, display) {
    cell1.style.display = display;
    cell2.style.display = display;
}
function setHiddenVisibleCell(cell1, cell2, visible, padding) {
    cell1.style.visibility = visible;
    cell1.style.padding = padding;
    cell2.style.visibility = visible;
    cell2.style.padding = padding;
}
function handleMismatch() {
    for (let i = 0; i < selectedPokemonCells.length; i++) {
        selectedPokemonCells[i].style.padding = "0";
    }
    console.log("Hai Pokemon ko giống nhau.");
    selectedPokemonCells = [];  // Đặt lại ds ô POkemon đã chọn.
}

function showGameDialog() {
    gameDialog.style.display = 'block';
}
var level = document.getElementById('level');
var blood = document.getElementById('blood');
var totalscore = document.getElementById('totalscore');
function setNewLevel(level, blood, totalscore) {
    this.level = level;
    this.blood = blood;
    this.totalScore = totalscore;
    repaint("level", this.level);
    repaint("blood", this.blood);
    repaint("score", totalscore);
    createMap(level);
}
function setInfoClickSuccess(level, blood, totalscore) {
    this.level = level;
    this.blood = blood;
    this.totalScore = totalscore;
    repaint("level", this.level);
    repaint("blood", this.blood);
    repaint("score", totalscore);
}
// Tạo Map trò chơi.
function createMap(level) {
    level = selectLevelValue(); // Kiểm tra mức độ level người dùng đã chọn.
    let matrix = createMatrix(11,18);
    displayMap(matrix);
    generateImagePairs(matrix.length, matrix[0].length);
    // startTimer(300);
}
function shufflePokemonCells(row, col) {
    const pokemonCells = document.querySelectorAll('.pokemonCells');
    const shuffledCells = Array.from(pokemonCells).sort(() => Math.random() - 0.5); // Xáo trộn các ô

    const map = document.getElementById('game');
    map.innerHTML = ''; // Xóa nội dung của bảng game hiện tại

    for (let i = 0; i < shuffledCells.length; i++) {
        const cell = shuffledCells[i];

        // Tính chỉ số của dòng và cột cho ô hiện tại
        const rowIndex = Math.floor(i / col);
        const colIndex = i % col;

        // Thiết lập thuộc tính "row" và "col" cho tung ô.
        cell.setAttribute("row", rowIndex+"");
        cell.setAttribute("col", colIndex+"");

        map.appendChild(cell); // Thêm các ô đã xáo trộn vào bảng game

        // Nếu đã thêm đủ số cột ô vào hàng, tạo một hàng mới
        if ((i + 1) % col === 0) {
            const clearDiv = document.createElement('div');
            clearDiv.style.clear = 'both';
            map.appendChild(clearDiv);
        }
    }
}
function generateImagePairs(row, col) {
    const totalCells = row * col;
    const totalPairs = totalCells / 2;
    const imagePairs = [];  // Tạo 1 ds chứa các cặp ảnh giống nhau.

    for (let i = 0; i < totalPairs; i++) {
        const randomIndex = Math.floor(Math.random()*36) + 1;   // random cho trong 36 ảnh POkemon.
        const imagePair = [randomIndex, randomIndex];  // Lấy 1 cặp hình ảnh.
        imagePairs.push(imagePair); // push --> ds chưa.
    }
    // Sau đó tiến hành xáo tron vị tri cac hinh anh do.
    shufflePokemonCells(row, col);
    return imagePairs;
}
function setImg(pokemonCells, imgIndex) { // Hàm gán hình ảnh.
    let linkImg = "/asset/img/pieces"+imgIndex+".png";   // lấy link của ảnh trong folder.
    pokemonCells.style.backgroundImage = "url("+linkImg+")";    // gán background bằng link được lấy trên.
    pokemonCells.style.backgroundSize = "cover";    // cover ảnh toàn thẻ div.
}
function displayMap(matrix) {
    const map = document.getElementById('game');
    const row = matrix.length;
    const col = matrix[0].length;
    console.log(row + " " + col);
    if (!Array.isArray(matrix)) {
        console.error("Matrix is not an array!");
        return null; // Trả về null hoặc giá trị mặc định khác tùy vào trường hợp của bạn
    }
    for (const row of matrix) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        for (const value of row) {
            var pokemonCells = document.createElement("div");    // Tạo mỗi thẻ div cho mỗi PokemonCell
            pokemonCells.classList.add("pokemonCells"); //  Tao tên class cho từng Cell Pokemon.
            pokemonCellsBtnAction(pokemonCells);
            // let linesContainer = document.createElement("div");
            // linesContainer.classList.add("lines-container"); // Thêm class để dễ dàng tùy chỉnh CSS
            // pokemonCells.appendChild(linesContainer); // Thêm linesContainer vào mỗi pokemonCells
            pokemonCells.style.position = "relative";
            setImg(pokemonCells, value);    // Tạo function setIMG cho pokemonCells.
            rowDiv.appendChild(pokemonCells);  // Đưa vào map.
        }
        map.appendChild(rowDiv);
        map.style.margin = 100 + "px " + 150 + "px";
    }
    return map;
}
function showGameDialog() {
    gameDialog.style.display = 'block';
}

function repaint(id, value) {
    var el = document.getElementById(id);
    if (el.hasChildNodes())
        el.removeChild(el.firstChild);
    el.appendChild(document.createTextNode(value));
}
function selectLevelValue() {
    let selectElement = document.getElementById('game-level');
    return selectElement.value;
}
function displayLevel() {
    level = selectLevelValue();
    console.log("Bạn đã chọn mức độ: " + level);
}

window.onload = function() {
    showGameDialog();
};
