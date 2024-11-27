fetch('/get_list')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('stocks-list');
    Object.keys(data).forEach(item => {
      list.innerHTML += `
        <li class="py-2 px-4 border-b border-gray-200">
          <button type="button" onclick="get_data('${item}')" class="flex items-center justify-between w-full">
            <span class="text-lg font-medium">${item}</span>
            <span class="text-sm text-gray-500">${data[item].toFixed(2)}/per stock</span>
          </button>
        </li>
      `;
    });
  });