// Hàm kiểm tra với đường thẳng theo trục x, từ cột y1 đến y2


function checkLineX(y1, y2, x) {
    // Tìm điểm có cột nhỏ nhất và lớn nhất
    const min = Math.min(y1, y2);
    const max = Math.max(y1, y2);
    // Duyệt qua các cột
    for (let y = min; y <= max; y++) {
        console.log(matrixMap[x][y]);
        if (matrixMap[x][y] > 0) { // Nếu gặp chướng ngại vật thì chết
            console.log("die: " + x + "" + y);
            return false;
        }
        console.log("ok: " + x + "" + y);
    }
    // Không chết -> thành công
    return true;
}
// Hàm kiểm tra với đường thẳng theo trục y, từ hàng x1 đến x2
function checkLineY(x1, x2, y) {
    const min = Math.min(x1, x2);
    const max = Math.max(x1, x2);
    for (let x = min; x <= max; x++) {
        if (matrixMap[x][y] > 0) {
            console.log("die: " + x + "" + y);
            return false;
        }
        console.log("ok: " + x + "" + y);
    }
    return true;
}

// Hàm kiểm tra trong hình chữ nhật theo trục x
function checkRectX(p1, p2) {
    // Tìm điểm có cột nhỏ nhất và lớn nhất
    let pMinY = p1, pMaxY = p2;
    if (p1.y > p2.y) {
        pMinY = p2;
        pMaxY = p1;
    }
    for (let y = pMinY.y + 1; y < pMaxY.y; y++) {
        // Kiểm tra ba đoạn thẳng
        if (checkLineX(pMinY.y, y, pMinY.x)
            && checkLineY(pMinY.x, pMaxY.x, y)
            && checkLineX(y, pMaxY.y, pMaxY.x)) {
            console.log("Rect x");
            console.log("(" + pMinY.x + "," + pMinY.y + ") -> ("
                + pMinY.x + "," + y + ") -> (" + pMaxY.x + "," + y
                + ") -> (" + pMaxY.x + "," + pMaxY.y + ")");
            // Nếu ba đoạn thẳng đều đúng thì trả về cột y
            return y;
        }
    }
    // Nếu có một đoạn thẳng nào đó không đúng thì trả về -1
    return -1;
}

// Hàm kiểm tra trong hình chữ nhật theo trục y
function checkRectY(p1, p2) {
    // Tìm điểm có hàng nhỏ nhất và lớn nhất
    let pMinX = p1, pMaxX = p2;
    if (p1.x > p2.x) {
        pMinX = p2;
        pMaxX = p1;
    }
    // Tìm đường và hàng bắt đầu
    for (let x = pMinX.x + 1; x < pMaxX.x; x++) {
        if (checkLineY(pMinX.x, x, pMinX.y)
            && checkLineX(pMinX.y, pMaxX.y, x)
            && checkLineY(x, pMaxX.x, pMaxX.y)) {
            console.log("Rect y");
            console.log("(" + pMinX.x + "," + pMinX.y + ") -> (" + x
                + "," + pMinX.y + ") -> (" + x + "," + pMaxX.y
                + ") -> (" + pMaxX.x + "," + pMaxX.y + ")");
            return x;
        }
    }
    return -1;
}

// Hàm kiểm tra nhiều đường thẳng hơn theo trục x
function checkMoreLineX(p1, p2, type) {
    // Tìm điểm có hàng nhỏ nhất
    let pMinY = p1, pMaxY = p2;
    if (p1.y > p2.y) {
        pMinY = p2;
        pMaxY = p1;
    }
    // Tìm đường và hàng bắt đầu
    let y = pMaxY.y;
    let row = pMinY.x;
    if (type === -1) {
        y = pMinY.y;
        row = pMaxY.x;
    }
    // Kiểm tra nhiều hơn
    if (checkLineX(pMinY.y, pMaxY.y, row)) {
        while (matrixMap[pMinY.x][y] === 0
        && matrixMap[pMaxY.x][y] === 0) {
            if (checkLineY(pMinY.x, pMaxY.x, y)) {
                console.log("TH X " + type);
                console.log("(" + pMinY.x + "," + pMinY.y + ") -> ("
                    + pMinY.x + "," + y + ") -> (" + pMaxY.x + "," + y
                    + ") -> (" + pMaxY.x + "," + pMaxY.y + ")");
                return y;
            }
            y += type;
        }
    }
    return -1;
}

// Hàm kiểm tra nhiều đường thẳng hơn theo trục y
function checkMoreLineY(p1, p2, type) {
    let pMinX = p1, pMaxX = p2;
    if (p1.x > p2.x) {
        pMinX = p2;
        pMaxX = p1;
    }
    let x = pMaxX.x;
    let col = pMinX.y;
    if (type === -1) {
        x = pMinX.x;
        col = pMaxX.y;
    }
    if (checkLineY(pMinX.x, pMaxX.x, col)) {
        while (matrixMap[x][pMinX.y] === 0
        && matrixMap[x][pMaxX.x] === 0) {
            if (checkLineX(pMinX.y, pMaxX.y, x)) {
                console.log("TH Y " + type);
                console.log("(" + pMinX.x + "," + pMinX.y + ") -> ("
                    + x + "," + pMinX.y + ") -> (" + x + "," + pMaxX.y
                    + ") -> (" + pMaxX.x + "," + pMaxX.y + ")");
                return x;
            }
            x += type;
        }
    }
    return -1;
}

// Hàm kiểm tra hai điểm
function checkTwoPoint(p1, p2) {
    // Kiểm tra đường thẳng theo trục x
    if (p1.x === p2.x) {
        if (checkLineX(p1.y, p2.y, p1.x)) {
            return new MyLine(p1, p2);
        }
    }
    // Kiểm tra đường thẳng theo trục y
    if (p1.y === p2.y) {
        if (checkLineY(p1.x, p2.x, p1.y)) {
            return new MyLine(p1, p2);
        }
    }
    let t = -1; // t là cột tìm được
    // Kiểm tra trong hình chữ nhật theo trục x
    if ((t = checkRectX(p1, p2)) !== -1) {
        return new MyLine(new Point(p1.x, t), new Point(p2.x, t));
    }
    // Kiểm tra trong hình chữ nhật theo trục y
    if ((t = checkRectY(p1, p2)) !== -1) {
        return new MyLine(new Point(t, p1.y), new Point(t, p2.y));
    }
    // Kiểm tra nhiều hơn về phải
    if ((t = checkMoreLineX(p1, p2, 1)) !== -1) {
        return new MyLine(new Point(p1.x, t), new Point(p2.x, t));
    }
    // Kiểm tra nhiều hơn về trái
    if ((t = checkMoreLineX(p1, p2, -1)) !== -1) {
        return new MyLine(new Point(p1.x, t), new Point(p2.x, t));
    }
    // Kiểm tra nhiều hơn xuống dưới
    if ((t = checkMoreLineY(p1, p2, 1)) !== -1) {
        return new MyLine(new Point(t, p1.y), new Point(t, p2.y));
    }
    // Kiểm tra nhiều hơn lên trên
    if ((t = checkMoreLineY(p1, p2, -1)) !== -1) {
        return new MyLine(new Point(t, p1.y), new Point(t, p2.y));
    }
    return null;
}
function MyLine(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
}


function Point(x, y) {
    this.x = x;
    this.y = y;
}