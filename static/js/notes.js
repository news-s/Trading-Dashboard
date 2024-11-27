function notes(){
    let container = document.getElementById('cont');
    document.getElementById('bot_title').innerText = "Notatki o firmie";
    container.innerHTML = `
    <div class="bot-notes-main-panel">
    <textarea class="note-area" placeholder="Wpisz tutaj swoje notatki..."></textarea>
    </div>
    <div class="button-list">
    <button class="add-note" onclick="add_note()">Add</button>
    </div>
    `
    
    const list = document.querySelector('.button-list')
    fetch('get_notes_list')
    .then(response => response.json())
    .then(data =>
      data.forEach(element => {
        list.innerHTML += `<button class="notes-select" onclick="load_note(${element.id}, '${element.title}')">${element.title} <button onclick="delete_note(${element.id}, ${element.title})">X</button></button>`;
      }))} // przeciętne doświadczenie z javascriptem

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
    notes(); // wywołanie funkcji notes() po dodaniu notatki
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