const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const sampleBtn = document.getElementById("sampleBtn");
const eventsList = document.getElementById("eventsList");
const emptyMsg = document.getElementById("emptyMsg");

function addEvent(title, date, category, desc) {
  emptyMsg.style.display = "none";

  const div = document.createElement("div");
  div.className = "event";
  div.innerHTML = `
    <strong>${title}</strong><br>
    📅 ${date} | 🏷️ ${category}<br>
    <small>${desc}</small>
  `;
  eventsList.appendChild(div);
}

addBtn.addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;
  const desc = document.getElementById("desc").value;

  if (!title || !date) {
    alert("Please fill required fields");
    return;
  }

  addEvent(title, date, category, desc);

  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
  document.getElementById("desc").value = "";
});

clearBtn.addEventListener("click", () => {
  eventsList.innerHTML = "";
  emptyMsg.style.display = "block";
});

sampleBtn.addEventListener("click", () => {
  addEvent("Web Dev Tech Conference", "03-02-2026", "Conference", "Annual Web Dev Tech Meet");
  addEvent("Java Script Workshop", "04-02-2026", "Workshop", "Mastery In Java Script");
});