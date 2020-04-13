var canvas = document.getElementById('canvas'),
    elemLeft = canvas.offsetLeft,
    elemTop = canvas.offsetTop,
    context = canvas.getContext('2d'),
    elements = [];

canvas.addEventListener('click', canvasClick, false);

function draw() {
    if (canvas.getContext) {
        // Desenha o background azul
        context.fillStyle = "#0000FF";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Gera os dots e adiciona ao array
        for (let lin = 0; lin < 8; lin++) {
            for (let col = 0; col < 5; col++) {
                elements.push({
                    colour: "#FFFFFF",
                    width: 49,
                    height: 49,
                    x: 10 + (col * 50),
                    y: 10 + (lin * 50),
                    lin: lin,
                    col: col,
                });
            }
        }

        // Desenha os dots no canvas
        elements.forEach(function (ele) {
            context.fillStyle = ele.colour;
            context.fillRect(ele.x, ele.y, ele.width, ele.height);
        });

        // Escreve o codigo C corresponde aos dots
        readDots();
    }
}


function canvasClick(event) {
    var xVal = event.pageX - elemLeft,
        yVal = event.pageY - elemTop;
    // console.log("X: %s, Y: %s", event.clientX, event.clientY)
    // console.log("X: %s, Y: %s", xVal, yVal)

    elements.forEach(function (ele, idx) {
        if (yVal > ele.y && yVal < ele.y + ele.height && xVal > ele.x && xVal < ele.x + ele.width) {
            // console.debug(`element ${idx} clicked ${ele.lin}:${ele.col}`);
            let c = context.getImageData(ele.x, ele.y, 1, 1)
            // console.debug(c);
            let eleColor = rgbToHex(c.data[0], c.data[1], c.data[2]);
            // console.debug(eleColor)

            context.fillStyle = eleColor == "#0000FF" ? "#FFFFFF" : "#0000FF"
            context.fillRect(ele.x, ele.y, ele.width, ele.height);

            readDots();
        }
    });
    console.log(event);
    // console.log(this);
}


function readDots() {
    let code = document.querySelector( "#code" );
    code.innerHTML = "uint8_t custom_char[8] = {\n"

    elements.forEach(function (ele, idx) {
        let c = context.getImageData(ele.x, ele.y, 1, 1);
        let eleColor = rgbToHex(c.data[0], c.data[1], c.data[2]);
        let txt = eleColor == "#FFFFFF" ? 1 : 0;
        // console.debug(eleColor, idx)
        code.innerHTML+= idx%5 == 0 ? '&nbsp;&nbsp;&nbsp;&nbsp;0b' : ''
        code.innerHTML += '' + txt + ((idx+1) % 5 == 0 ? ',\n' : '')
    });

    code.innerHTML += "};"
}


function rgbToHex(r, g, b) {
    const hexR = ('0' + r.toString(16)).slice(-2),
        hexG = ('0' + g.toString(16)).slice(-2),
        hexB = ('0' + b.toString(16)).slice(-2)

    return ('#' + hexR + hexG + hexB).toUpperCase();
}


draw();