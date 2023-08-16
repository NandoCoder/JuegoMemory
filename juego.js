document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const startButton = document.getElementById("startButton");
  const exitButton = document.getElementById("exitButton");
  const gameIcon = document.querySelector(".game-icon");
  const gameBoard = document.querySelector(".game-board");
  const timerContainer = document.querySelector(".timer-container");
  const timerText = document.querySelector(".timer-text");

  // Imagenes para las cartas
  const images = [
    "assets/DRAGONES/dragon-1.gif",
    "assets/DRAGONES/dragon-2.png",
    "assets/DRAGONES/dragon-3.gif",
    "assets/DRAGONES/dragon-4.png",
    "assets/DRAGONES/dragon-5.gif",
    "assets/DRAGONES/dragon-6.gif",
    "assets/DRAGONES/dragon-7.gif",
    "assets/DRAGONES/dragon-8.gif",
    "assets/DRAGONES/dragon-9.gif",
  ];

  // Variables del juego
  let flippedCards = 0;
  let matchedPairs = 0;
  let canFlip = true;
  let firstFlippedCard = null;
  let secondFlippedCard = null;
  let elapsedTime = 0;
  let timerInterval = null;

  // Actualizar el texto del temporizador
  function updateTimerText() {
    const minutes = Math.floor(elapsedTime / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsedTime % 60).toString().padStart(2, "0");
    timerText.textContent = `${minutes}:${seconds}`;
  }

  // Iniciar el temporizador
  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      elapsedTime++;
      updateTimerText();
    }, 1000);
  }

  // Detener el temporizador
  function stopTimer() {
    clearInterval(timerInterval);
  }

  // Restablecer el juego
  function resetGame() {
    stopTimer();
    elapsedTime = 0;
    timerContainer.style.display = "none";
    startButton.style.display = "block";
    exitButton.style.display = "none";
    gameBoard.innerHTML = "";
    gameIcon.style.display = "block";
    flippedCards = 0;
    matchedPairs = 0;
    firstFlippedCard = null;
    secondFlippedCard = null;
    canFlip = true;
  }

  // Evento para reiniciar el juego al hacer clic en el boton exit
  exitButton.addEventListener("click", resetGame);

  // Voltea una carta
  function flipCard(card) {
    card.classList.add("flipped");
    flippedCards++;

    if (flippedCards === 1) {
      firstFlippedCard = card;
    } else if (flippedCards === 2) {
      secondFlippedCard = card;
      canFlip = false;

      if (
        firstFlippedCard.querySelector(".back img").src ===
        secondFlippedCard.querySelector(".back img").src
      ) {
        setTimeout(() => {
          firstFlippedCard.classList.add("matched");
          secondFlippedCard.classList.add("matched");
          matchedPairs++;

          if (matchedPairs === images.length) {
            stopTimer();
          }

          flippedCards = 0;
          canFlip = true;
        }, 500);
      } else {
        setTimeout(() => {
          firstFlippedCard.classList.remove("flipped");
          secondFlippedCard.classList.remove("flipped");

          // Agrega la clase "shake" para la animación de vibración
          firstFlippedCard.classList.add("shake");
          secondFlippedCard.classList.add("shake");

          // Remueve la clase "shake" después de la animación
          setTimeout(() => {
            firstFlippedCard.classList.remove("shake");
            secondFlippedCard.classList.remove("shake");
          }, 400);

          flippedCards = 0;
          canFlip = true;
        }, 1000);
      }
    }
  }

  // Agrega event listeners a las cartas
  function attachCardEventListeners() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (
          canFlip &&
          !card.classList.contains("flipped") &&
          flippedCards < 2
        ) {
          if (flippedCards === 0) {
            startTimer();
          }
          flipCard(card);
        }
      });
    });
  }

  // Evento para iniciar el juego al hacer clic en el boton "Comenzar"
  startButton.addEventListener("click", () => {
    resetGame();

    timerContainer.style.display = "block";
    exitButton.style.display = "block";
    startButton.style.display = "none";
    gameIcon.style.display = "none";

    const shuffledImages = images
      .concat(images)
      .sort(() => Math.random() - 0.5);

    for (let i = 0; i < 3; i++) {
      const cardRow = document.createElement("div");
      cardRow.classList.add("card-row");

      for (let j = 0; j < 6; j++) {
        const card = document.createElement("div");
        card.classList.add("card");

        const front = document.createElement("div");
        front.classList.add("front");

        const back = document.createElement("div");
        back.classList.add("back");
        const img = document.createElement("img");
        img.src = shuffledImages.pop();
        back.appendChild(img);

        card.appendChild(front);
        card.appendChild(back);
        cardRow.appendChild(card);
      }

      gameBoard.appendChild(cardRow);
    }

    attachCardEventListeners();

    // Animacion para la presentacion de las cartas al inicio
    setTimeout(() => {
      const cardRow = document.querySelectorAll(".card-row");
      cardRow.forEach((row, index) => {
        setTimeout(() => {
          row.style.opacity = 1;
          row.style.transform = "scale(1)";
        }, index * 300);
      });
    }, 200);
  });
});
