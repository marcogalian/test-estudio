// Array global para almacenar las preguntas cargadas
let questionsData = [];

// Función para mostrar una sección específica
function showSection(sectionId) {
    // Ocultar la pantalla de inicio y cualquier sección mostrada previamente
    document.getElementById('start-screen').classList.add('hidden');
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));

    // Mostrar la sección seleccionada
    document.getElementById(sectionId).classList.remove('hidden');
}

// Función para cargar el cuestionario desde un JSON específico
function loadQuiz(jsonFile, quizName) {
    // Ocultar cualquier sección y mostrar el contenedor del cuestionario
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById('quiz-container').classList.remove('hidden');

    // Cambiar el título del cuestionario
    document.getElementById('quiz-title').textContent = `Realizar cuestionario: ${quizName}`;

    // Cargar preguntas desde el archivo JSON
    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            questionsData = data;
            displayQuestions(questionsData);
        })
        .catch(error => console.error("Error al cargar el archivo JSON:", error));
}

// Mostrar preguntas y opciones en el contenedor de preguntas
function displayQuestions(questions) {
    const questionsContainer = document.getElementById('questions');
    questionsContainer.innerHTML = '';  // Limpiar el contenedor

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        // Agregar el texto de la pregunta
        const questionText = document.createElement('p');
        questionText.textContent = question.question;
        questionElement.appendChild(questionText);

        // Crear las opciones de respuesta como botones
        question.options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.classList.add('answer');
            optionButton.textContent = option;

            // Al hacer clic en una opción, la selecciona
            optionButton.addEventListener('click', () => {
                // Deseleccionar todas las demás opciones de la misma pregunta
                Array.from(questionElement.getElementsByClassName('answer')).forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Marcar la opción seleccionada
                optionButton.classList.add('selected');
            });

            questionElement.appendChild(optionButton);
        });

        questionsContainer.appendChild(questionElement);
    });

    // Ocultar botones de finalización al recargar preguntas
    document.getElementById('end-buttons').classList.add('hidden');
}

// Verificar las respuestas seleccionadas y marcar correctas e incorrectas
function checkAnswers() {
    const questions = document.getElementsByClassName('question');
    let score = 0;

    // Iterar sobre cada pregunta
    for (let i = 0; i < questions.length; i++) {
        const questionElement = questions[i];
        const correctAnswer = questionsData[i].correctAnswer;
        const selectedButton = questionElement.querySelector('.answer.selected');

        // Marcar respuestas correctas e incorrectas
        if (selectedButton) {
            const selectedAnswer = selectedButton.textContent;
            if (selectedAnswer === correctAnswer) {
                score++;
                selectedButton.classList.add('correct');
            } else {
                selectedButton.classList.add('incorrect');
            }

            // Marcar la respuesta correcta en verde
            Array.from(questionElement.getElementsByClassName('answer')).forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }
    }

    // Mostrar el total de aciertos en la parte superior
    const resultContainer = document.getElementById('result');
    resultContainer.textContent = `Total de aciertos: ${score} de ${questions.length}`;

    // Mostrar botones de finalización
    document.getElementById('end-buttons').classList.remove('hidden');
}

// Función para reiniciar el formulario sin volver al inicio
function resetQuiz() {
    displayQuestions(questionsData);  // Volver a cargar las preguntas
    document.getElementById('result').textContent = ''; // Limpiar el resultado
}

// Función para ir a la pantalla de inicio
function goToStart() {
    // Ocultar el contenedor del cuestionario y todas las secciones
    document.getElementById('quiz-container').classList.add('hidden');
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));

    // Limpiar el resultado y el contenedor de preguntas
    document.getElementById('result').textContent = '';
    document.getElementById('questions').innerHTML = '';

    // Mostrar la pantalla de inicio
    document.getElementById('start-screen').classList.remove('hidden');
}
