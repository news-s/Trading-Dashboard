fetch('/get_list')
.then(response => response.json())
.then(data => {
    const list = document.getElementById('stocks-list');
    Object.keys(data).forEach(item => {
        list.innerHTML += `<li><button type="button" onclick="get_data('${item}')">${item} - ${data[item].toFixed(2)}/per stock</button><button onclick="removeFromFav('${item}')">X</button><br/></li>`;
    });
})