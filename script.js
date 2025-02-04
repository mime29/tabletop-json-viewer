document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("drop-zone");
    // Grab the container for all collections
    const collectionsContainer = document.getElementById("collectionsContainer");

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
        collectionsContainer.innerHTML = ""; // Clear previous cards

        if (!data.ObjectStates || data.ObjectStates.length === 0) return;

        // Iterate through each ObjectState in the data
        data.ObjectStates.forEach((collection) => {
            // Create a wrapper for the collection
            const collectionWrapper = document.createElement("div");
            collectionWrapper.className = "collectionWrapper";

            // Create and append the title
            const title = document.createElement("h2");
            title.innerText = `${collection.Nickname} - ${collection.Name}`;
            collectionWrapper.appendChild(title);


            const deck = collection.CustomDeck["1"]; // Assuming single deck
            const faceUrl = deck.FaceUrl;
            const backUrl = deck.BackUrl;
            const numWidth = deck.NumWidth; // Number of columns
            const numHeight = deck.NumHeight; // Number of rows


            // Dimensions of each card in percentage
            const cardWidth = 100 / (numWidth - 1); // Width per card in %
            const cardHeight = 100 / (numHeight - 1); // Height per card in %


            // Create the card container
            const cardContainer = document.createElement("div");
            cardContainer.className = "cardContainer";
            cardContainer.id = "cardContainer";

            // Load the image to calculate its aspect ratio
            const img = new Image();
            img.src = backUrl;
            img.onload = () => {
                const cardRatio = img.width / img.height;

                // Add cards to the card container
                collection.ContainedObjects.forEach((cardData, index) => {
                    const col = index % numWidth; // Column index
                    const row = Math.floor(index / numWidth); // Row index

                    const card = document.createElement("div");
                    card.classList.add("card");
                    card.style.aspectRatio = cardRatio;

                    const frontSide = document.createElement("div");
                    frontSide.classList.add("side", "front");
                    frontSide.style.backgroundImage = `url(${faceUrl})`;
                    frontSide.style.backgroundPosition = `${col * cardWidth}% ${row * cardHeight}%`;

                    frontSide.style.backgroundSize = `${numWidth * 100}% ${numHeight * 100}%`;

                    const backSide = document.createElement("div");
                    backSide.classList.add("side", "back");
                    backSide.style.backgroundImage = `url(${backUrl})`;
                    backSide.style.backgroundSize = "cover";

                    card.appendChild(frontSide);
                    card.appendChild(backSide);
                    card.addEventListener("click", () => {
                        card.classList.toggle("flipped");
                    });

                    cardContainer.appendChild(card);

                });
            };

            // Add the card container to the wrapper
            collectionWrapper.appendChild(cardContainer);

            // Append the collection wrapper to the main container
            collectionsContainer.appendChild(collectionWrapper);

        });
    }
})