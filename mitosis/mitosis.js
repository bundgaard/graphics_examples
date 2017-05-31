const can = document.getElementById("mitosisCanvas");
const ctx = can.getContext("2d");
const W = can.width;
const H = can.height;
const SCALE = 20;
const ROWS = 0 | H / SCALE;
const COLS = 0 | W / SCALE;
const VW = SCALE * COLS;
const VH = SCALE * ROWS;

const fps = 20;
const interval = 1000 / fps;
let deltaTime = 0;
let lastTime = performance.now();
let frame = 0;

// entities
let symbolSize = 24;
let streams = [];
const Mitosis = () => {

};


const setup = () => {
    let x = 0;
    let y = 0;
    for (let i = 0; i < W / symbolSize; i++) {
        stream = new Stream();
        stream.generateSymbols(x, Math.floor(Math.random() * -2000));
        x += symbolSize;
        streams.push(stream);
    }
};

const renderLoop = (ms) => {
    requestAnimationFrame(renderLoop);
    const currentTime = performance.now();
    deltaTime = (currentTime - lastTime);
    if (deltaTime > interval) {
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, W, H);
        
        streams.forEach(stream => {
            stream.render();
        });

        frame += 1;
        lastTime = currentTime - (deltaTime % interval);
    }
};


function Symbol (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.switchInterval = Math.floor(Math.random() * 30 + 5);

    this.setRandomSymbol = function () {
        if (frame % this.switchInterval === 0) {
            this.value = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
        }
    };


    this.edges = function () {
        if (this.y > H) {
            this.y = 0;
            this.setRandomSymbol();
        }
    };

    this.rain = function () {

        this.y += this.speed;
        this.edges();
    };
}

function Stream () {
    this.symbols = [];
    this.totalSymbols = Math.floor(Math.random() * 30 + 5);
    this.speed = Math.floor(Math.random() * 20 + 5);
    
    this.generateSymbols = function (x, y) {
        let first = true;
        for (let i = 0; i < this.totalSymbols; i++) {
            let symbol = new Symbol(x, y, this.speed);
            symbol.setRandomSymbol();
            this.symbols.push(symbol);
            y -= symbolSize;
        }
    };

    this.render = function () {
        this.symbols.forEach(function (symbol) {
            ctx.font = "24px arial";
            ctx.fillStyle = "rgba(70,230,80,1)";
            ctx.fillText(symbol.value, symbol.x, symbol.y);
            symbol.rain();
            symbol.setRandomSymbol();
        });
    };

}

setup();
renderLoop(0);