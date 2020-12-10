let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

// let logo = document.createElement('logo');
// document.body.appendChild(logo);
// logo.innerHTML = '<img src = "my-logo.jpg"<img>'

// let GameName = document.createElement('name');
// document.body.appendChild(GameName);
// GameName.innerHTML = '<h1>Moto GP</h1>'

canvas.width = window.innerWidth;
canvas.height = 550;

document.body.appendChild(canvas);

let perm = [];
while (perm.length < 255) {
    while (perm.includes(val = Math.floor(Math.random() * 255)));
    perm.push(val);
}


let lerp = (a,b,t) => a + (b - a) * (1- Math.cos(t * Math.PI)) / 2; 
let noise = x => {
    x = x * 0.01 % 255;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

// creating the player

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = 0;
        this.ySpeed = 0;
        this.rot = 0;
        this.rSpeed = 0;

        this.img = new Image();
        this.img.src = 'moto1.png'; 
        // this.img.src = document.getElementsByTagName("template")[0].innerHTML; // this is the picture from HTML
        this.draw = function () {
            let p1 = canvas.height - noise(t + this.x) * 0.25;
            let p2 = canvas.height - noise(t + 5 + this.x) * 0.25;
            let grounded = 0;

            if (p1 - 15 > this.y) {
                this.ySpeed += 0.1;
            } else {
                this.ySpeed -= this.y - (p1 - 15);
                this.y = p1 - 15;
                grounded = 1;
            }

            let angle = Math.atan2((p2 - 15) - this.y, (this.x + 25) - this.x); // if 25 is larger in (this.x + 25)   the moto is more stabele, jumps less
            this.y += this.ySpeed;

            if (!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5) {
                playing = false;
                this.speed = 5;
                k.ArrowUp = 1;
                this.x -= speed * 5;
            }


            if (grounded && playing) {
                this.rot -= (this.rot - angle) * 0.5;
                this.rSpeed = this.rSpeed - (angle - this.rot);
            }

            this.speed += (k.ArrowLeft - k.ArrowRigth) * 0.05;
            this.rot -= this.rSpeed * 0.1;
            if (this.rot > Math.PI)
                this.rot = -Math.PI;
            if (this.rot < -Math.PI)
                this.rot = Math.PI;

            // this.rot = angle; //  if this is on the moto will nor rotate 
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.drawImage(this.img, -15, -15, 30, 30);
            ctx.restore();
        };
    }
}

//  background and ground movement
let player = new Player();
let playing = true;
let t = 0;
let speed = 0;
let k = {ArrowUp: 0,ArrowDown: 0, ArrowLeft: 0, ArrowRigth: 0 }; // for arrow interaction
const loop = () => {
    speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01
    t += 10 * speed;
    ctx.fillStyle = '#19f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // further background
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < canvas.width; i++)
        ctx.lineTo(i, canvas.height * 0.8 - noise(t + i * 5 ) * 0.25);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fill();

    //closer ground + player
    ctx.fillStyle = '#233'
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < canvas.width; i++) 
        ctx.lineTo(i, canvas.height - noise(t + i) * 0.25);
    ctx.lineTo(canvas.width, canvas.height)    
    ctx.fill();

    player.draw();
    if(player.x < 0)
        restart();

    requestAnimationFrame(loop);
}

onkeydown = d => k[d.key] = 1;
onkeyup = d => k[d.key] = 0;

let restart = () => {
    player = new Player();
    t = 0;
    speed = 0;
    playing = true;
    k = {ArrowUp: 0,ArrowDown: 0, ArrowLeft: 0, ArrowRigth: 0 }; 
}

loop();

// instructions
const instructions = document.createElement('div');
instructions.innerHTML =  "<h3>Instructions:</h3></br>Arrow Up  &  Arrow Down = accelerate <br> Arrow Left  &  Arrow Rigth = boost/balance";
document.body.appendChild(instructions);