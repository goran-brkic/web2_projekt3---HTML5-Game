var myGamePieces = [];
let numOfPieces = Math.floor(Math.random() * (10 - 2)) + 2;
let numOfHitPieces = 0;

function startGame() {
    for(let i = 0; i < numOfPieces; i++) {
        let randomX = Math.floor(Math.random() * (599 - 5)) + 5;
        let randomY = Math.floor(Math.random() * (389 - 5)) + 5;
        myGamePieces[i] = new component(50, 50, "red", randomX, randomY);
    }
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.id = "myGameCanvas";
        this.canvas.width = 600;
        this.canvas.height = 390;
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener('click', function(e) {
            var index = checkIfHit(myGamePieces, e.offsetX, e.offsetY);
            if (index !== false) {
                myGamePieces.splice(index, 1)
                numOfHitPieces++;
            }
        }, false);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
};

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed_x = Math.floor(Math.random() * (10 - 1)) + 1;
    this.speed_y = Math.floor(Math.random() * (10 - 1)) + 1;;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    };
    this.newPos = function () {
        let limit = Math.abs(Math.floor(this.speed_x - 2));
        if(limit == 0) limit = 1;
        if (this.x - this.width / 2 < 0){
            this.speed_x += Math.ceil(Math.random() * (limit + limit) - limit);
            this.speed_x = Math.abs(this.speed_x);
        }
        else if (this.x + this.width / 2 >= myGameArea.context.canvas.width){
            this.speed_x += Math.ceil(Math.random() * (limit + limit) - limit);
            this.speed_x = (-1)*Math.abs(this.speed_x);
        }
        if(Math.abs(this.speed_x) > 15)
            this.speed_x /= 2;

        limit = Math.abs(Math.floor(this.speed_y - 2));
        if (this.y - this.height / 2 < 0){
            this.speed_y += Math.ceil(Math.random() * (limit + limit) - limit);
            this.speed_y = (-1)*Math.abs(this.speed_y);
        }
        else if (this.y + this.height / 2 >= myGameArea.context.canvas.height){
            this.speed_y += Math.ceil(Math.random() * (limit + limit) - limit);
            this.speed_y = Math.abs(this.speed_y);
        } 
        if(Math.abs(this.speed_y) > 15)
            this.speed_y /= 2;

        this.x += this.speed_x;
        this.y -= this.speed_y;
    };
}

function updateGameArea() {
    myGameArea.clear();
    for(let i = 0; i < myGamePieces.length; i++) {
        myGamePieces[i].newPos();
        myGamePieces[i].update();
    }
    myGameArea.context.font = "18px Arial";
    myGameArea.context.textAlign = "right";
    myGameArea.context.fillText(`Ukupan broj meta: ${numOfPieces}`, 600, 15);
    myGameArea.context.fillText(`Broj pogođenih meta: ${numOfHitPieces}`, 600, 33);
    if(myGamePieces.length == 0){
        myGameArea.context.font = "25px Arial";
        myGameArea.context.textAlign = "center";
        myGameArea.context.strokeText('Pobijedili ste!', 300, 195);
    }
}


function checkIfHit(rects, x, y) {
    let isHit = false;
    for (let i = 0; i < rects.length; i++) {
        let left = rects[i].x-rects[i].width/2;
        let right = rects[i].x+rects[i].width/2;
        let top = rects[i].y-rects[i].height/2;
        let bottom = rects[i].y+rects[i].height/2;
        if (right >= x
            && left <= x
            && bottom >= y
            && top <= y) {
            isHit = i;
        }
    }
    return isHit;
}