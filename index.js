const inputEl = document.getElementById("input");
const infoTextEl = document.getElementById("info-text");
const meaningContainerEl = document.getElementById("meaning-container");
const titleEl = document.getElementById("title");
const meaningEl = document.getElementById("meaning");
const audioEl = document.getElementById("audio");

async function fetchAPI(word) {
  try {
    infoTextEl.style.display = "block";
    meaningContainerEl.style.display = "none";
    infoTextEl.innerText = `Searching the meaning of "${word}"`;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const res = await fetch(url);
    const result = await res.json();

    
    if (result.title) {
      meaningContainerEl.style.display = "block";
      infoTextEl.style.display = "none";
      titleEl.innerText = word;
      meaningEl.innerText = "N/A";
      
      audioEl.style.display = "none";
      audioEl.src = "";
      audioEl.load();
    } else {
      infoTextEl.style.display = "none";
      meaningContainerEl.style.display = "block";

      const entry = result[0];
      titleEl.innerText = entry.word || word;

    
      const definition =
        entry.meanings &&
        entry.meanings[0] &&
        entry.meanings[0].definitions &&
        entry.meanings[0].definitions[0] &&
        entry.meanings[0].definitions[0].definition;

      meaningEl.innerText = definition || "Definition not available";

      
      let audioUrl = "";
      if (Array.isArray(entry.phonetics)) {
        for (const p of entry.phonetics) {
          if (p && p.audio && p.audio.trim() !== "") {
            audioUrl = p.audio.trim();
            break;
          }
        }
      }

    
      if (audioUrl && audioUrl.startsWith("//")) {
        audioUrl = "https:" + audioUrl;
      } else if (audioUrl && audioUrl.startsWith("http:")) {
      
        audioUrl = audioUrl.replace(/^http:/, "https:");
      }

      if (audioUrl) {
        audioEl.src = audioUrl;
        audioEl.style.display = "inline-flex";
        audioEl.load();
      } else {
        audioEl.src = "";
        audioEl.style.display = "none";
        audioEl.load();
      }
    }
  } catch (error) {
    console.error(error);
    infoTextEl.innerText = `an error happened, try again later`;
    meaningContainerEl.style.display = "none";
    audioEl.style.display = "none";
    audioEl.src = "";
    audioEl.load();
  }
}

inputEl.addEventListener("keyup", (e) => {
  if (e.target.value && e.key === "Enter") {
    fetchAPI(e.target.value.trim());
  }
});
