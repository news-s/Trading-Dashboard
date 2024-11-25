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
        list.innerHTML += `<button class="notes-select" onclick="loadNote(${element.id})">${element.title}</button>`;
      }))} // przeciętne doświadczenie z javascriptem

function loadNote(id, title){
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
    loadNote(data.id, title);
  });
}