// Map sound and images to not have to have multiple copies of MP3/JPG files
const sceneImageData = {
    intro: { file: "placeholder.jpg", alt: "placeholder" },
    start: { file: "placeholder.jpg", alt: "placeholder" },
    king: { file: "placeholder.jpg", alt: "placeholder" },
    plan: { file: "placeholder.jpg", alt: "placeholder" },
    organise: { file: "placeholder.jpg", alt: "placeholder" },
    lure: { file: "placeholder.jpg", alt: "placeholder" },
    friend: { file: "placeholder.jpg", alt: "placeholder" },
    self: { file: "placeholder.jpg", alt: "placeholder" }
};

const karmaAudioMap = {
    low: "low.mp3",
    neutral: "mid.mp3",
    high: "high.mp3"
};


let scenes = {};
let currentScene = "intro";
let karma = 0;

// Error handling and logging function for fetching JSON because it breaks regularly
async function loadScenes() {
    try {
        console.log("Fetching scenesW.json...");
        const response = await fetch("scenesW.json");
        scenes = await response.json();
        console.log("Scenes loaded:", scenes);
        renderScene(currentScene);
    } catch (error) {
        console.error("Scene load failed:", error);
        document.getElementById("story").innerText = "Failed to load story.";
    }
}

// Dynamic webpage rendering function
function renderScene(sceneId) {
    // Find current scene
    const scene = scenes[sceneId];
    currentScene = sceneId;

    // Endings based on karma
    let displayText = scene.text;
    if (sceneId === "self" && karma >= 2) {
        displayText = "The smell of sulfur nearly gagged Skuba on the walk. He placed the lure at the cave mouth and retreated. The dragon fell for it completely. The explosion tore through the mountain and silence followed. The people called him not a fool, but a savior. For once, the songs might be true.";
    } else if (sceneId === "self") {
        displayText = "The dragon exploded, yes. But so did the entire lower market. Nobody blamed Skuba to his face, the dragon was gone after all, but there was little celebration for the one who arguably caused more damage than the beast had. Just the quiet knowledge that sometimes, winning doesn't feel like it.";
    } else if (sceneId === "friend" && karma >= 1) {
        displayText = "Skuba's friend braved the drop-off and set the bait perfectly. The dragon took it, and though the blast shook the hills, the brave volunteer returned — burned, limping, but alive. Skuba and the rest of the conspirators carried him back together. It wasn’t a perfect win, but it was enough. It was never really about the glory.";
    } else if (sceneId === "friend") {
        displayText = "The poor soul who took the bait didn't come back. The dragon did, not dead, but notably less threatening than before. It fled the cave the next day, wings half-burned. The town was saved and the expected celebrations ensued, it did little to soothe the guilt.";
    }

    // Karma update function
    function updateKarma(next, delta) {
        // Restarting the game doesn't always lead to intro so to prevent karma staying between runs, OR function is an easy fix.
        return (next === "intro" || next === "start") ? 0 : karma + delta;
    }

    // Fetch story content and choices, clear previous choice variable.
    document.getElementById("story").innerHTML = displayText;
    const sceneChoices = document.getElementById("sceneChoices");
    sceneChoices.innerHTML = "";  

    // Load scene image from map
    const img = document.getElementById("sceneImage");
    const imageData = sceneImageData[sceneId];
    if (imageData) {
        img.src = `imagesW/${imageData.file}`;
        img.alt = imageData.alt;
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }
    

    // Load scene audio
    const audio = document.getElementById("sceneAudio");
    let mood = "neutral";
    if (karma > 0) mood = "high";
    else if (karma < 0) mood = "low";
    audio.src = `soundsW/${karmaAudioMap[mood]}`;
    audio.load();

    // Loop through each option
    scene.choices.forEach(option => {
        // Create the button for each option
        const btn = document.createElement("a");
        btn.href = "#";
        btn.className = "btn btn-outline-primary";
        btn.innerText = option.text;
        // Make the buttons work with karma
        btn.onclick = () => {
            // Update the temporary karma field
            karma = updateKarma(option.next, option.karma);
            document.getElementById("karma").innerText = karma;
            // Go again
            renderScene(option.next);
        };

        // Add the button to the choice box from the constant
        sceneChoices.append(btn);

        
    });
}
    


// Run the function to fetch scenes from JSON and load certain  menus
window.onload = () => {
    loadScenes();

    // Sidebar
    document.getElementById("menuToggle").onclick = function () {
        const sidebar = document.getElementById("mySidebar");
        const main = document.getElementById("main");
        const isOpen = sidebar.style.width === "250px";
        sidebar.style.width = isOpen ? "0" : "250px";
        main.style.marginLeft = isOpen ? "0" : "250px";
    };
    // Music
    document.getElementById("musicMenuBtn").onclick = function (e) {
        e.preventDefault();
        const musicMenu  = document.getElementById("musicCredits");
        musicMenu .style.display = musicMenu .style.display === "block" ? "none" : "block";
    };
    // Music button (now in bottom right)
    document.getElementById("muteToggle").onclick = function () {
        audioMuted = !audioMuted;
        const audio = document.getElementById("sceneAudio");
        audio.muted = audioMuted;
        this.innerText = audioMuted ? "🔊" : "🔇";
    };    
    // Menu click-off
    document.addEventListener("click", function (event) {
        const musicMenu  = document.getElementById("musicCredits");
        const toggleButton = document.getElementById("musicMenuBtn");
    
        if (!musicMenu.contains(event.target) && event.target !== toggleButton) {
            musicMenu .style.display = "none";
        }
    });
};
