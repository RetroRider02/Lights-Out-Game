$(document).ready(function () {

    const gameArea = 5; //Elements per row

    let count = 0;
    let time = 0;
    let timerInterval;

    let circles = document.getElementsByClassName("circle");
    let panel = document.getElementsByClassName("winner-panel")[0];

    let clickSound = new Audio('./Audio/click.wav');
    let winSound = new Audio('./Audio/win.wav');

    let defaultMap = []; //Save the 5 by 5 game area

    $("#rand").click(function () {
        
        clickSound.play();
        
        clearGameMap(circles);
        start();
    });

    $("#reset").click(function () {
        
        clickSound.play();
        
        clearSteps();
        restartTimer();
        
        for (let i = 0; i < circles.length; i++) {
            if (defaultMap[i] === true) {
                circles[i].classList.add("on");
            } else {
                circles[i].classList.remove("on");
            }
        }
    });

    function printTime() {
        let currentTime = new Date(time);
        let minutes = currentTime.getMinutes();
        let seconds = currentTime.getSeconds();
        document.getElementById("time").innerText = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    function start() {
        
        defaultMap = [];
        
        clearSteps();
        restartTimer();

        for (let i = 0; i < circles.length; i++) {
            if (Math.floor(Math.random() * 100) < gameArea * gameArea) {
                circles[i].classList.toggle("on");
                defaultMap.push(true);
            } else {
                defaultMap.push(false);
            }
            circles[i].addEventListener("click", cellClick);
        }
    }

    function clearGameMap(circles){
        for (let i = 0; i < circles.length; i++) {
            circles[i].classList.remove("on");
            circles[i].removeEventListener("click", cellClick);
        }    
    }

    function cellClick() {
        
        clickSound.play();
        document.getElementById('steps').innerText = ++count;
        
        this.classList.toggle("on");
        let neighbors = getNeighbors(this);
        
        for (let i = 0; i < neighbors.length; i++) {
            neighbors[i].classList.toggle("on");
        }

        if (isWinner()) {
            panel.style.display = "block";
            document.getElementById('new_game').addEventListener("click", function () {
                panel.style.display = "none";
                clearGameMap(circles);
                start();
            });
        }
    }

    function getNeighbors(cell) {
        
        let i = Array.prototype.indexOf.call(circles, cell);
        let neighbors = [];
        let top = i < gameArea;
        let bottom = i >= gameArea * gameArea - gameArea;
        let left = i % gameArea === 0;
        let right = i % gameArea === gameArea - 1;

        if (!top) neighbors.push(circles[i - gameArea]);
        if (!bottom) neighbors.push(circles[i + gameArea]);
        if (!left) neighbors.push(circles[i - 1]);
        if (!right) neighbors.push(circles[i + 1]);

        return neighbors;
    }

    function isWinner() {
        
        if (!document.getElementsByClassName("on")[0]){
            winSound.play();
            clearInterval(timerInterval);
            return true;            
        }
        return false;
    }

    function restartTimer(){
        
        document.getElementById("time").innerText = "0:00";
        clearInterval(timerInterval);
        startTime = new Date();
        timerInterval = setInterval(function print() {
            time = new Date() - startTime;
            printTime();
        }, 1000);
    }

    function clearSteps(){
        
        count = 0;
        document.getElementById('steps').innerText = count;
    }

    start();
});