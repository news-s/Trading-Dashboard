function notes() {
  const container = document.getElementById('cont');
  document.getElementById('bot_title').innerText = "Notatki o firmie";

  container.innerHTML = `
    <div class="notes-container flex flex-col gap-4">
      <div class="note-editor flex flex-col">
        <textarea class="note-area resize-none p-2 rounded shadow-sm" placeholder="Wpisz tutaj swoje notatki..."></textarea>
        <button class="add-note btn-primary ml-auto mt-2">Dodaj notatkę</button>
      </div>
      <div class="notes-list flex flex-col gap-2">
        </div>
    </div>
  `;

  const notesList = document.querySelector('.notes-list');

  fetch('get_notes_list')
    .then(response => response.json())
    .then(data => {
      data.forEach(element => {
        const noteButton = document.createElement('button');
        noteButton.classList.add('notes-select', 'btn', 'btn-outline');
        noteButton.innerText = element.title;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-note', 'btn', 'btn-danger', 'ml-2');
        deleteButton.innerText = 'X';

        deleteButton.addEventListener('click', () => delete_note(element.id, element.title));

        noteButton.appendChild(deleteButton);
        noteButton.addEventListener('click', () => load_note(element.id, element.title));
        notesList.appendChild(noteButton);
      });
    });
} // przeciętne doświadczenie z javascriptem

function load_note(id, title){
  document.getElementById('bot_title').innerText = "Notatka: " + title;
  fetch('get_note/' + id)
  .then(response => response.json())
  .then(data => {
    document.getElementsByClassName('note-area')[0].value = data.text;
  });
}

function add_note(){
  const note = document.getElementsByClassName('note-area')[0].value;
  const title = prompt("Podaj tytuł notatki:");
  fetch('add_note', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({text: note, title: title}),
  })
  .then(response => response.json())
  .then(data => {
    alert("Notatka została dodana.");
    notes();
    document.querySelector(`textarea[class="note-area"]`).innerText = "";
  });
}

function delete_note(id, title){
  fetch('delete_note/' + id)
 .then(response => response.json())
 let note = document.querySelector(`button[onclick="load_note(${id}, '${title}')"]`)
 let note_delete = document.querySelector(`button[onclick="delete_note(${id})"]`)
 document.querySelector(`textarea[class="note-area"]`).innerText = ""; // czyszczenie pola
 note.remove();
 note_delete.remove();
 alert("Notatka została usunięta.");
}