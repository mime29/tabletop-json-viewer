document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("drop-zone");
    const cardContainer = document.getElementById("cardContainer");

    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropZone.style.backgroundColor = "#444";
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.style.backgroundColor = "";
    });

    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropZone.style.backgroundColor = "";

        const file = event.dataTransfer.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const jsonData = JSON.parse(e.target.result);
                displayCards(jsonData);
            };
            reader.readAsText(file);
        } else {
            alert("Please drop a valid JSON file.");
        }
    });

    function displayCards(data) {
        cardContainer.innerHTML = ""; // Clear previous cards
    
        if (!data.ObjectStates || data.ObjectStates.length === 0) return;
    
        const deck = data.ObjectStates[0].CustomDeck["1"]; // Assuming single deck
        const faceUrl = deck.FaceUrl;
        const backUrl = deck.BackUrl;
        const numWidth = deck.NumWidth; // Number of columns
        const numHeight = deck.NumHeight; // Number of rows
    
        // Dimensions of each card in percentage
        const cardWidth = 100 / (numWidth - 1); // Width per card in %
        const cardHeight = 100 / (numHeight - 1); // Height per card in %
    
        data.ObjectStates[0].ContainedObjects.forEach((cardData, index) => {
            const col = index % numWidth; // Column index
            const row = Math.floor(index / numWidth); // Row index
    
            console.log("col" + col);
            console.log("row" + row);

            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
    
            const frontSide = document.createElement("div");
            frontSide.classList.add("side", "front");
            frontSide.style.backgroundImage = `url(${faceUrl})`;
            frontSide.style.backgroundPosition = `${col * cardWidth}% ${row * cardHeight}%`;

            console.log("position: " + `${col * cardWidth}% ${row * cardHeight}%`);

            frontSide.style.backgroundSize = `${numWidth * 100}% ${numHeight * 100}%`;
    
            const backSide = document.createElement("div");
            backSide.classList.add("side", "back");
            backSide.style.backgroundImage = `url(${backUrl})`;
            backSide.style.backgroundSize = "cover";
    
            cardElement.appendChild(frontSide);
            cardElement.appendChild(backSide);
            cardElement.addEventListener("click", () => {
                cardElement.classList.toggle("flipped");
            });
    
            cardContainer.appendChild(cardElement);
        });
    }    
    
});
