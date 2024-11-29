fetch('/get_list')
.then(response => response.json())
.then(data => {
    const list = document.getElementById('stocks-list');
    Object.keys(data).forEach(item => {
        list.innerHTML += `<li><button type="button" onclick="get_data('${item}')">${item} - ${data[item].toFixed(2)}/per stock</button></li>`;
        list.innerHTML += `<button onclick="removeFromFav('${item}')">usuń z ulubionych</button><br/>`
    });
})