const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin');
const resultDisplay = document.getElementById('result');

const bigNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const mediumNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const smallNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const numberOfNumbers = bigNumbers.length;
const arcSize = (2 * Math.PI) / numberOfNumbers;
const radiusBig = 300;
const radiusMedium = 240;
const radiusSmall = 180;
let startAngleBig = 0;
let startAngleMedium = 0;
let startAngleSmall = 0;

const bigWords = [
    "Aplicar", "Proponer", "Optimizar", "Mejorar", "Implementar",
    "Planificar", "Diseñar", "Desarrollar", "Transformar", "Rediseñar"
];

const mediumWords = [
    "Procesamiento digital de imágenes", "Sistemas de salud y telemedicina",
    "Sistemas de transporte y logística", "Deep learning", "Sistemas de reconocimiento",
    "Tecnologías educativas", "Arquitecturas de nube y servicio", "Ciudades inteligentes",
    "Data science", "Reingeniería de procesos"
];

const smallWords = [
    "Empresas tecnológicas", "Adultos mayores", "Ciclistas", "Clínicas de Lima",
    "Pobladores de Lince", "Alumnos de la UNFV", "Empresas de software",
    "Países desarrollados", "Bancos", "Empresas de transportes"
];

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la ruleta grande detrás con divisiones y números
    drawWheelWithRadius(startAngleBig, radiusBig, '#7FFF00', bigNumbers);

    // Dibujar la ruleta mediana en el medio con divisiones y números
    drawWheelWithRadius(startAngleMedium, radiusMedium, '#FFD700', mediumNumbers);

    // Dibujar la ruleta pequeña en frente con divisiones y números
    drawWheelWithRadius(startAngleSmall, radiusSmall, '#FFA500', smallNumbers);

    // Dibujar el triángulo en la base
    drawTriangle(290, 550, 310, 550, 300, 500, '#333');

    // Mostrar las palabras en la leyenda
    displayWordsInLegend();
}

function drawWheelWithRadius(startAngle, radius, color, numbers) {
    const arcSize = (2 * Math.PI) / numbers.length;

    numbers.forEach((number, i) => {
        const angle = startAngle + i * arcSize;

        // Dibujar el arco del sector
        ctx.beginPath();
        ctx.arc(300, 300, radius, angle, angle + arcSize);
        ctx.lineTo(300, 300);
        ctx.fillStyle = color;
        ctx.fill();

        // Dibujar la línea divisoria en negro
        ctx.save();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;  // Ancho de la línea divisoria
        ctx.moveTo(300, 300);
        ctx.lineTo(300 + radius * Math.cos(angle), 300 + radius * Math.sin(angle));
        ctx.stroke();
        ctx.restore();

        // Texto en el centro del sector
        ctx.save();
        ctx.translate(300, 300);
        ctx.rotate(angle + arcSize / 2);
        ctx.fillStyle = '#000';
        
        // Ajustar el tamaño de la fuente
        ctx.font = 'bold 14px Arial';  // Ejemplo: Fuente en negrita y tamaño 14px

        ctx.fillText(number, radius - 20, 10);
        ctx.restore();
    });
}



function drawTriangle(x1, y1, x2, y2, x3, y3, color) {
    // Ajusta la coordenada Y de cada punto para mover el triángulo hacia abajo
    y1 += 50;  // Ajuste de posición hacia abajo
    y2 += 50;  // Ajuste de posición hacia abajo
    y3 += 50;  // Ajuste de posición hacia abajo

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fillStyle = color;
    ctx.fill();
}

function rotateWheel() {
    const spinAngleBig = 5 * Math.PI;     // Ángulo de giro para la ruleta grande (5π radianes)
    const spinAngleMedium = 7 * Math.PI;  // Ángulo de giro para la ruleta mediana (7π radianes)
    const spinAngleSmall = 6 * Math.PI;   // Ángulo de giro para la ruleta pequeña (6π radianes)
    const spinTime = 5000;                // Tiempo de giro en milisegundos (5 segundos)
    const startTime = new Date().getTime();
    const endTime = startTime + spinTime;
    
    function animate() {
        const currentTime = new Date().getTime();
        const remainingTime = endTime - currentTime;
        
        if (remainingTime <= 0) {
            drawWheel();
            showCombination();
            return;
        }
        
        const rotationSpeed = remainingTime / spinTime;
        startAngleBig += (spinAngleBig * rotationSpeed);
        startAngleMedium += (spinAngleMedium * rotationSpeed);
        startAngleSmall += (spinAngleSmall * rotationSpeed);
        drawWheel();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function showCombination() {
    // Coordenadas fijas para las 6 en punto en un reloj en la pantalla
    const x = 300;  // Coordenada X
    const y = 500;  // Coordenada Y

    // Encontrar la palabra más cercana a las coordenadas fijas (x, y)
    let closestBigWord = findClosestWord(startAngleBig, radiusBig, bigNumbers, bigWords, x, y);
    let closestMediumWord = findClosestWord(startAngleMedium, radiusMedium, mediumNumbers, mediumWords, x, y);
    let closestSmallWord = findClosestWord(startAngleSmall, radiusSmall, smallNumbers, smallWords, x, y);

    // Mostrar los resultados
    resultDisplay.innerHTML = `
        <p>${closestBigWord} - ${closestMediumWord} - ${closestSmallWord}</p>
    `;
}

function findClosestWord(startAngle, radius, numbers, words, x, y) {
    const arcSize = (2 * Math.PI) / numbers.length;
    let closestWord = '';
    let minDistance = Infinity;

    numbers.forEach((number, i) => {
        const angle = startAngle + i * arcSize + arcSize / 2;
        const centerX = 300 + radius * Math.cos(angle);
        const centerY = 300 + radius * Math.sin(angle);
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

        if (distance < minDistance) {
            minDistance = distance;
            closestWord = words[i];
        }
    });

    return closestWord;
}

function displayWordsInLegend() {
    const bigWordsList = document.getElementById('bigWordsList');
    const mediumWordsList = document.getElementById('mediumWordsList');
    const smallWordsList = document.getElementById('smallWordsList');

    // Limpiar listas previas
    bigWordsList.innerHTML = '';
    mediumWordsList.innerHTML = '';
    smallWordsList.innerHTML = '';

    // Llenar las listas con las palabras correspondientes
    bigWords.forEach((word, index) => {
        const li = document.createElement('li');
        li.textContent = `${bigNumbers[index]} - ${word}`;
        bigWordsList.appendChild(li);
    });

    mediumWords.forEach((word, index) => {
        const li = document.createElement('li');
        li.textContent = `${mediumNumbers[index]} - ${word}`;
        mediumWordsList.appendChild(li);
    });

    smallWords.forEach((word, index) => {
        const li = document.createElement('li');
        li.textContent = `${smallNumbers[index]} - ${word}`;
        smallWordsList.appendChild(li);
    });
}

spinButton.addEventListener('click', rotateWheel);

drawWheel();
