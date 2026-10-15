
const levels = [
    {
        title: "La escena del crimen",
        cat: "🐈‍⬛",
        story: "El atún desapareció a las 8:00 p. m. Los tres gatos estaban en casa. Debes descubrir quién estuvo en la cocina.",
        clue: "Hay huellas de patas mojadas desde la cocina hasta la ventana. Afuera está lloviendo.",
        hint: "Piensa cuál de los gatos pudo entrar desde afuera con las patas mojadas.",
        question: "¿Qué gato es el principal sospechoso?",
        answers: [
            "Michi, porque estaba durmiendo.",
            "Sombra, porque llegó de la calle con las patas mojadas.",
            "Bigotes, porque estaba tomando agua."
        ],
        correct: 1,
        explanation: "¡Correcto! Sombra dejó las huellas mojadas al entrar desde la calle."
    },
    {
        title: "El código secreto",
        cat: "🐱",
        story: "Encontraste una nota junto al plato vacío. Tiene una secuencia extraña escrita por el ladrón.",
        clue: "La nota dice: 2 - 4 - 8 - 16 - ?",
        hint: "Cada número se obtiene multiplicando el anterior por 2.",
        question: "¿Cuál es el siguiente número?",
        answers: [
            "20, porque se suman 4.",
            "24, porque se suman 8.",
            "32, porque cada número se multiplica por 2."
        ],
        correct: 2,
        explanation: "¡Bien pensado! La secuencia duplica cada número: 16 × 2 = 32."
    },
    {
        title: "La última declaración",
        cat: "🐈",
        story: "Los tres gatos dan su versión. Sabes que el culpable es el único que está mintiendo.",
        clue: "Michi dice: «Yo no fui». Sombra dice: «Bigotes fue el ladrón». Bigotes dice: «Sombra está mintiendo».",
        hint: "Si Sombra dice la verdad, Bigotes sería culpable. Comprueba qué ocurre con la declaración de Bigotes.",
        question: "¿Quién robó el atún?",
        answers: [
            "Michi",
            "Sombra",
            "Bigotes"
        ],
        correct: 2,
        explanation: "¡Caso resuelto! Bigotes robó el atún. Michi y Sombra dicen la verdad; Bigotes miente al decir que Sombra está mintiendo."
    }
];

let currentLevel = 0;
let score = 0;
let cluesUsed = 0;
let answeredCorrectly = false;
let hintUsed = false;

const $ = (id) => document.getElementById(id);

function renderLevel() {
    const level = levels[currentLevel];

    answeredCorrectly = false;
    hintUsed = false;

    $("levelNumber").textContent =
        `${String(currentLevel + 1).padStart(2, "0")} / ${String(levels.length).padStart(2, "0")}`;

    $("score").textContent = String(score).padStart(3, "0");
    $("caseNumber").textContent =
        `CASO ${String(currentLevel + 1).padStart(2, "0")}`;

    $("catAvatar").textContent = level.cat;
    $("levelTitle").textContent = level.title;
    $("story").textContent = level.story;
    $("clueText").textContent = level.clue;
    $("cluesCount").textContent = cluesUsed;

    $("progressBar").style.width =
        `${((currentLevel + 1) / levels.length) * 100}%`;

    $("hintButton").hidden = false;
    $("hintButton").disabled = false;
    $("hintButton").textContent = "✦ Revelar una pista";

    $("hintText").hidden = true;
    $("hintText").textContent = level.hint;

    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    $("nextButton").hidden = true;

    const answersContainer = $("answers");
    answersContainer.replaceChildren();

    level.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.className = "answer-button";
        button.textContent =
            `${String.fromCharCode(65 + index)}. ${answer}`;

        button.addEventListener("click", () => {
            checkAnswer(index, button);
        });

        answersContainer.appendChild(button);
    });
}

function showHint() {
    if (hintUsed || answeredCorrectly) {
        return;
    }

    hintUsed = true;
    cluesUsed++;

    $("cluesCount").textContent = cluesUsed;
    $("hintText").hidden = false;
    $("hintButton").textContent = "Pista revelada";
    $("hintButton").disabled = true;
}

function checkAnswer(selected, button) {
    if (answeredCorrectly) {
        return;
    }

    const level = levels[currentLevel];
    const buttons = $("answers").querySelectorAll("button");

    if (selected === level.correct) {
        answeredCorrectly = true;

        // Sin pista: 100 puntos. Con pista: 50 puntos.
        score += hintUsed ? 50 : 100;

        button.classList.add("correct");

        buttons.forEach((item) => {
            item.disabled = true;
        });

        $("score").textContent = String(score).padStart(3, "0");
        $("feedback").textContent = level.explanation;
        $("feedback").className = "feedback success";

        $("hintButton").hidden = true;
        $("nextButton").hidden = false;

        $("nextButton").textContent =
            currentLevel === levels.length - 1
                ? "Resolver el caso final →"
                : "Siguiente nivel →";

    } else {
        button.classList.add("wrong");
        button.disabled = true;

        $("feedback").textContent =
            "Esa deducción no encaja con las pruebas. Analiza las pistas e inténtalo otra vez.";

        $("feedback").className = "feedback error";
    }
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        renderLevel();
    } else {
        showEnding();
    }
}

function showEnding() {
    $("caseNumber").textContent = "CASO CERRADO";
    $("levelNumber").textContent = "03 / 03";
    $("catAvatar").textContent = "🐾";
    $("levelTitle").textContent = "¡Investigación terminada!";

    $("story").textContent =
        "Has llegado al final de la investigación. Cada pista te acercó a la verdad.";

    $("clueText").textContent =
        `Puntuación final: ${score} puntos. Pistas utilizadas: ${cluesUsed}.`;

    $("hintButton").hidden = true;
    $("hintText").hidden = true;
    $("answers").replaceChildren();

    $("feedback").textContent =
        "¡Gracias por jugar a Detective Michi! ¿Te atreves a intentarlo de nuevo?";

    $("feedback").className = "feedback success";
    $("nextButton").textContent = "↻ Jugar de nuevo";
    $("nextButton").hidden = false;

    $("progressBar").style.width = "100%";
}

function restartGame() {
    currentLevel = 0;
    score = 0;
    cluesUsed = 0;

    renderLevel();
}

$("hintButton").addEventListener("click", showHint);

$("nextButton").addEventListener("click", () => {
    if ($("caseNumber").textContent === "CASO CERRADO") {
        restartGame();
    } else if (answeredCorrectly) {
        nextLevel();
    }
});

// Iniciar el juego.
renderLevel();
