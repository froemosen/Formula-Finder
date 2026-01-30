/*
let symbols = new Map([
    ["l", "length (meters, m)"],
    ["m", "mass (kilograms, kg)"],
    ["t", "time (seconds, s)"],
    ["I", "electric current (amperes, A)"],
    ["n", "amount of substance (moles, mol)"],
    ["T", "absolute temperature (kelvin, K)"],
    ["f", "frequency (hertz, Hz)"],
    ["F", "force (newtons, N)"],
    ["p", "pressure (pascals, Pa)"],
    ["E", "energy (joules, J)"],
    ["P", "power (watts, W)"],
    ["Q", "electric charge (coulombs, C)"],
    ["U", "electric potential (volts, V)"],
    ["B", "magnetic flux density (teslas, T)"],
    ["C", "capacitance (farads, F)"],
    ["R", "electrical resistance (ohms, Ω)"],
    ["A", "area (square meters, m²)"],
    ["V", "volume (cubic meters, m³)"],
    ["W", "work (joules, J)"],
    ["v", "speed/velocity (meters per second, m/s)"],
    ["\\rho", "density (kilograms per cubic meter, kg/m³)"],
    ["d", "distance (meters, m)"],
]);
*/

/*
let units = new Map([
    ["m", "meters (Length)"],
    ["kg", "kilograms (Mass)"],
    ["s", "seconds (Time)"],
    ["A", "amperes (Electric current)"],
    ["mol", "moles (Amount of substance)"],
    ["K", "kelvin (Absolute temperature)"],
    ["Hz", "hertz (Frequency)"],
    ["N", "newtons (Force)"],
    ["Pa", "pascals (Pressure)"],
    ["J", "joules (Energy)"],
    ["W", "watts (Power)"],
    ["C", "coulombs (Electric charge)"],
    ["V", "volts (Electric potential)"],
    ["T", "teslas (Magnetic flux density)"],
    ["F", "farads (Capacitance)"],
    ["\\Omega", "ohms (Electrical resistance)"],
    ["Bq", "becquerels (Radioactivity)"],
    ["Sv", "sieverts (Radiation dose)"],
    ["L", "liters (Volume)"],
    ["m^2", "square meters (Area)"],
    ["m^3", "cubic meters (Volume)"],
    ["t", "tons (Mass)"],
    ["bar", "bars (Pressure)"],
    ["atm", "atmospheres (Pressure)"],
    ["Wh", "watt-hours (Energy)"],
]);
*/

let unitsToSymbols = new Map([
    ["m", "l"],
    ["kg", "m"],
    ["s", "t"],
    ["A", "I"],
    ["mol", "n"],
    ["K", "T"],
    ["Hz", "f"],
    ["N", "F"],
    ["Pa", "p"],
    ["J", "E"],
    ["W", "P"],
    ["C", "Q"],
    ["V", "U"],
    ["T", "B"],
    ["F", "C"],
    ["\\Omega", "R"],
    ["m^2", "A"],
    ["m^3", "V"],
    ["L", "V"],
    ["t", "m"],
    ["bar", "p"],
    ["atm", "p"],
    ["Wh", "E"],
]);

let symbolsToUnits = new Map([
    ["l", "m"],
    ["m", "kg"],
    ["t", "s"],
    ["I", "A"],
    ["n", "mol"],
    ["T", "K"],
    ["f", "Hz"],
    ["F", "N"],
    ["p", "Pa"],
    ["E", "J"],
    ["P", "W"],
    ["Q", "C"],
    ["U", "V"],
    ["B", "T"],
    ["C", "F"],
    ["R", "\\Omega"],
    ["A", "m^2"],
    ["V", "m^3"],
    ["W", "J"],
    ["v", "m/s"],
]);



let SIQuants = new Map([
    ["n", 10**(-9)],
    ["\\mu", 10**(-6)],
    ["m", 10**(-3)],
    ["c", 10**(-2)],
    ["d", 10**(-1)],
    ["h", 10**2],
    ["k", 10**3],
    ["M", 10**6],
    ["G", 10**9],
]);

//read formulas from file formulas.txt
fetch("static/formulas.txt").then(response => response.text())


function findFormula() {
    let formulas = [];
    let symbols = new Set();
    let units = new Set();
    let valid = true;

    for (let i = 0; i <= inputCount; i++) {
        const symbolElement = document.getElementById(`symbol${i}`);
        const unitElement = document.getElementById(`unit${i}`);

        const symbol = symbolElement ? symbolElement.value.trim() : "";
        const unit = unitElement ? unitElement.value.trim() : "";
        console.log(`Processing input ${i}: Symbol=${symbol}, Unit=${unit}`);

        if (symbol != "") {
            symbols.add(symbol);
        }
        if (unit != "") {
            units.add(unit);
        }
    }

    //load in formulas.txt and check if each line contains all symbols, before reaching text "\quad "
    fetch("static/formulas.txt")
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            console.log("Loaded formulas:", lines);
            for (const line of lines) {
                valid = true; // Reset valid for each line
                const parts = line.split(/\\quad (.*)/);
                if (parts.length > 0) {
                    const formulaSymbols = parts[0].trim().split(/[ {}_]+/);
                    const formulaUnits = parts[1] ? parts[1].trim().split("$") : [];
                    console.log("Checking formula symbols:", formulaSymbols);
                    console.log("Input symbols:", symbols);
                    const formula = line.trim();
                    for (const symbol of symbols) {
                        if (!formulaSymbols.includes(symbol)) {
                            valid = false;
                            break; // No need to check further if one symbol doesn't match
                        }                   
                    }
                    for (const unit of units) {
                        if (!formulaUnits.includes(unit)) {
                            valid = false;
                            break; // No need to check further if one unit doesn't match
                        }
                    } 
                    if (valid) {
                        console.log("Adding formula:", formula);
                        formulas.push(formula);
                    }
                    
                }
            }
            console.log("Final formulas:", formulas);
            if (formulas.length == 0) {
                fetch("/api/formulafailed");
                formulas = ["\\text{No formula found}"];
            }
            else {
                fetch("/api/formulafound");
            }
            renderLatex(formulas);
        });
}

function writeOutInput() {
    let formulas = [];

    for (let i = 0; i <= inputCount; i++) {
        const symbolElement = document.getElementById(`symbol${i}`);
        const valueElement = document.getElementById(`value${i}`);
        const unitElement = document.getElementById(`unit${i}`);

        const symbol = symbolElement ? symbolElement.value.trim() : "";
        const value = valueElement ? valueElement.value.trim() : "";
        const unit = unitElement ? unitElement.value.trim() : "";
        console.log(`Processing input ${i}: Symbol=${symbol}, Value=${value}, Unit=${unit}`);

        //return html with the inputs
        if (symbol != "" && value != "" && unit != "") {
            formulas.push(`${symbol} = ${value}\\ ${unit}`);
        }
    }
    if (formulas.length == 0) {
        formulas = ["\\text{No formula found}"];
    }
    console.log("Final formulas:", formulas);
    renderLatex(formulas);
}


function fetchGreeting() {
    fetch("/api/greeting")
        .then(response => response.json())
        .then(data => {
            document.getElementById("greeting").innerText = data.message;
        });
}



let activeInput = null;

// Track which input was focused last
document.querySelectorAll('.latexInput').forEach(input => {
    input.addEventListener('focus', () => {
        activeInput = input;
    });
    
});

function insertSymbol(event, symbol) {
    event.preventDefault(); // prevent the button from stealing focus

    if (!activeInput) return; // no active input selected

    const start = activeInput.selectionStart;
    const end = activeInput.selectionEnd;

    const text = activeInput.value;
    activeInput.value = text.substring(0, start) + symbol + text.substring(end);

    activeInput.selectionStart = activeInput.selectionEnd = start + symbol.length;

    activeInput.focus();
}


let inputCount = 0; 

function toggleInputs(index) {
    const symbolInput = document.getElementById(`symbol${index}`);
    const unitInput = document.getElementById(`unit${index}`);
    
    if (symbolInput && unitInput) {
        if (symbolInput.value.trim() !== "") {
            unitInput.disabled = true;
            unitInput.style.opacity = "0.5";
            unitInput.style.cursor = "not-allowed";
        } else {
            unitInput.disabled = false;
            unitInput.style.opacity = "1";
            unitInput.style.cursor = "text";
        }
        
        if (unitInput.value.trim() !== "") {
            symbolInput.disabled = true;
            symbolInput.style.opacity = "0.5";
            symbolInput.style.cursor = "not-allowed";
        } else {
            symbolInput.disabled = false;
            symbolInput.style.opacity = "1";
            symbolInput.style.cursor = "text";
        }
    }
}

function addInputField() {
    inputCount++;
    const currentIndex = inputCount; // Capture the current value
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.gap = "10px";
    container.style.alignItems = "center";
    container.id = `inputGroup${currentIndex}`;

    const label = document.createElement("p");
    label.style.marginLeft = "50px";
    label.textContent = `Input ${currentIndex + 1}:`;
    container.appendChild(label);

    const symbolInput = document.createElement("input");
    symbolInput.type = "text";
    symbolInput.className = "latexInput";
    symbolInput.id = `symbol${currentIndex}`;
    symbolInput.placeholder = "Symbol";
    symbolInput.style.width = "80px";
    symbolInput.oninput = () => toggleInputs(currentIndex);

    const unitInput = document.createElement("input");
    unitInput.type = "text";
    unitInput.className = "latexInput";
    unitInput.id = `unit${currentIndex}`;
    unitInput.placeholder = "Unit";
    unitInput.style.width = "80px";
    unitInput.oninput = () => toggleInputs(currentIndex);

    // Add focus event listeners for symbol insertion
    symbolInput.addEventListener('focus', () => {
        activeInput = symbolInput;
    });
    unitInput.addEventListener('focus', () => {
        activeInput = unitInput;
    });

    container.appendChild(symbolInput);
    container.appendChild(unitInput);

    // Insert new line immediately after the last input line
    const parent = document.querySelector(".container");
    const firstInputLine = document.getElementById(`inputGroup${currentIndex-1}`);
    parent.insertBefore(container, firstInputLine.nextSibling);
}

function removeInputField() {
    if (inputCount >= 1) {
        const inputToRemove = document.getElementById(`inputGroup${inputCount}`);
        inputCount--;
        inputToRemove.remove();
    }
}

function renderLatex(formulas) {
    const outputDiv = document.getElementById("result");
    outputDiv.innerHTML =  "<hr>" + formulas.map(formula => {
        const parts = formula.split(/\\quad (.*)/);
        console.log("Infobox formula is: ", parts);
        console.log("Infobox will be filled with: ", parts[1].replaceAll("\\", "¤"));
        return `<div class="formula-container"> <div>\\(${parts[0]}\\)</div>
        <button class="infobutton" onclick="showInfo(event, '${parts[1].replaceAll("\\", "¤")}')">?</button>
        <hr>
        </div>`;
    }).join('');

    MathJax.typesetPromise();
}

function showInfo(event, formula) {
    const popup = document.createElement("div");
    popup.className = "info-popup";
    console.log("Popup content: ", formula.replaceAll("¤", "\\"));
    popup.innerHTML = `<div> \\( ${formula.replaceAll("¤", "\\")} \\) </div>`;
    document.body.appendChild(popup);
    MathJax.typesetPromise();

    const button = event.target;
    const rect = button.getBoundingClientRect();
    popup.style.position = "absolute";
    popup.style.left = `${rect.left + window.scrollX}px`;
    popup.style.top = `${rect.bottom + window.scrollY+30}px`;

    //Add horizontal scrolling to the popup
    popup.style.maxWidth = "700px";
    popup.style.overflowX = "auto";
    popup.style.zIndex = "1000"; // Ensure the popup is above other content


    // close when clicking outside the popup
    document.addEventListener("click", function closePopup(event) {
        if (!popup.contains(event.target) && event.target !== button) {
            popup.remove();
            document.removeEventListener("click", closePopup);
        }
    });
}

function makeExample() {
    // Add a second input field first
    addInputField();
    
    // Wait a moment for DOM to update, then set values and find formulas
    setTimeout(() => {
        const symbol0 = document.getElementById("symbol0");
        const unit0 = document.getElementById("unit0");
        const symbol1 = document.getElementById("symbol1");
        const unit1 = document.getElementById("unit1");
        
        if (symbol0 && unit0 && symbol1 && unit1) {
            symbol0.value = "U";
            unit0.value = "";
            symbol1.value = "";
            unit1.value = "\\Omega";
            toggleInputs(0);
            toggleInputs(1);
            
            // Automatically find and display formulas
            findFormula();
        }
    }, 100);
}

