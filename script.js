const daysContainer = document.querySelector(".days");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const selectedDateEl = document.getElementById("selected-date");
const noteInput = document.getElementById("note-input");
const saveNoteBtn = document.getElementById("save-note");
const notesList = document.getElementById("notes-list");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let today = new Date();
let currMonth = today.getMonth();
let currYear = today.getFullYear();
let activeDate = formatDate(today);

function formatDate(date) {
  // Returns YYYY-MM-DD string
  if (typeof date === 'string') return date;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function renderCalendar() {
  daysContainer.innerHTML = "";

  const firstDay = new Date(currYear, currMonth, 1);
  const lastDay = new Date(currYear, currMonth + 1, 0);
  const prevLastDay = new Date(currYear, currMonth, 0).getDate();
  const firstDayIndex = firstDay.getDay();
  const lastDayIndex = lastDay.getDay();
  const nextDays = 7 - lastDayIndex - 1;

  monthYear.innerText = `${months[currMonth]} ${currYear}`;

  // Previous month days
  for (let x = firstDayIndex; x > 0; x--) {
    const div = document.createElement("div");
    div.className = "inactive";
    div.textContent = prevLastDay - x + 1;
    daysContainer.appendChild(div);
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateObj = new Date(currYear, currMonth, i);
    const div = document.createElement("div");
    const dateStr = formatDate(dateObj);

    div.textContent = i;

    if (
      i === today.getDate() &&
      currMonth === today.getMonth() &&
      currYear === today.getFullYear()
    ) {
      div.classList.add("today");
    }
    if (dateStr === activeDate) {
      div.classList.add("selected");
    }
    if (getNotes(dateStr).length > 0) {
      div.classList.add('note-marker');
    }

    div.addEventListener("click", () => {
      activeDate = dateStr;
      renderCalendar();
      showNotes();
    });
    daysContainer.appendChild(div);
  }

  // Next month days
  for (let j = 1; j <= nextDays; j++) {
    const div = document.createElement("div");
    div.className = "inactive";
    div.textContent = j;
    daysContainer.appendChild(div);
  }
}

prevMonthBtn.addEventListener("click", () => {
  currMonth--;
  if (currMonth < 0) {
    currMonth = 11;
    currYear--;
  }
  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  currMonth++;
  if (currMonth > 11) {
    currMonth = 0;
    currYear++;
  }
  renderCalendar();
});

function showNotes() {
  selectedDateEl.textContent = 
    `Notes for ${months[parseInt(activeDate.substr(5, 2))-1]} ${parseInt(activeDate.substr(8,2))}, ${activeDate.substr(0, 4)}`;
  noteInput.value = "";
  renderNoteList();
}

function renderNoteList() {
  notesList.innerHTML = "";
  const notes = getNotes(activeDate);
  if (notes.length === 0) {
    notesList.innerHTML = `<div style="color:#b9b9b9;font-style:italic;font-size:14px;">No notes for this date.</div>`;
    return;
  }
  notes.forEach((note, idx) => {
    const entry = document.createElement('div');
    entry.className = "note-entry";
    entry.innerHTML = `
      ${note.text}
      <span class="note-time">${note.time}</span>
      <button title="Delete" class="delete-note">&#10006;</button>
    `;
    entry.querySelector('.delete-note').onclick = () => {
      deleteNote(activeDate, idx);
    }
    notesList.appendChild(entry);
  });
}

saveNoteBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();
  if (!text) return;
  const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const notes = getNotes(activeDate);
  notes.unshift({ text, time });
  localStorage.setItem('notes-' + activeDate, JSON.stringify(notes));
  noteInput.value = "";
  renderNoteList();
  renderCalendar();
});

function getNotes(dateStr) {
  return JSON.parse(localStorage.getItem('notes-' + dateStr) || '[]');
}

function deleteNote(dateStr, idx) {
  const notes = getNotes(dateStr);
  notes.splice(idx, 1);
  localStorage.setItem('notes-' + dateStr, JSON.stringify(notes));
  renderNoteList();
  renderCalendar();
}

// Initial render
renderCalendar();
showNotes();
