let myChart;  // Zmienna przechowująca instancję wykresu

    function run(){
      let tag = document.getElementById("tag").value;
      get_data(tag);
    }
    
    function get_data(tag){
      // Pobierz dane z endpointu Flask
      fetch(`/get_data/${tag}`)
        .then(response => response.json())
        .then(data => {
          // Przetwórz dane z JSON na format Chart.js
          const chartData = data.data.map(item => ({
            x: item.date, // Data
            y: item.close // Cena zamknięcia
          }));

          // Ustawienia animacji
          const totalDuration = 1000;
          const delayBetweenPoints = totalDuration / chartData.length;
          const previousY = (ctx) => 
            ctx.index === 0 
              ? ctx.chart.scales.y.getPixelForValue(100) 
              : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

          const animation = {
            x: {
              type: 'number',
              easing: 'linear',
              duration: delayBetweenPoints,
              from: NaN, // Punkt początkowy pomijany
              delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                  return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
              }
            },
            y: {
              type: 'number',
              easing: 'linear',
              duration: delayBetweenPoints,
              from: previousY,
              delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                  return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
              }
            }
          };

          // Konfiguracja wykresu
          const config = {
              type: 'line',
              data: {
                datasets: [{
                  label: `${tag} Close Prices`,
                  borderColor: 'blue',
                  borderWidth: 2,
                  radius: 0,
                  data: chartData,
                }]
              },
              options: {
                animation,
                interaction: {
                  intersect: false,
                  mode: 'index',  // Umożliwia wyświetlanie tooltipów tylko dla najbliższego punktu
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(tooltipItem) {
                        // Pobieramy datę i cenę dla danego punktu
                        const date = tooltipItem.raw.x;  // Data w tym przypadku to wartość na osi X
                        const price = tooltipItem.raw.y; // Cena to wartość na osi Y
                
                        // Formatowanie daty przy użyciu toLocaleDateString
                        const formattedDate = new Date(date).toLocaleDateString('en-US');  // Można dostosować formatowanie daty
                
                        // Zwracamy tekst dla tooltipa
                        return `Date: ${formattedDate} - Price: $${price.toFixed(2)}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      parser: "yyyy-MM-dd", // tu musisz naprawić aby działało na godziny
                      unit: 'day', // -||-
                      tooltipFormat: 'PP',
                    },
                    title: {
                      display: true,
                      text: 'Date'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Close Price (USD)'
                    }
                  }
                }
              }
            };

          document.getElementById('title').innerHTML = `<h1 style="text-align: center; color: black;">${tag} Stock Price Chart</h1>`
          // Jeśli wykres już istnieje, zaktualizuj dane
          if (myChart) {
            myChart.data.datasets[0].data = chartData;  // Zaktualizowanie danych wykresu
            myChart.update();  // Aktualizacja wykresu
          } else {
            // Jeśli wykres nie istnieje, stwórz go
            let ctx = document.getElementById('myChart').getContext('2d');
            myChart = new Chart(ctx, config);
          }
        })
        .catch(error => console.error('Błąd podczas pobierania danych:', error));
    }

    function get_price(tag) {
      // Używamy fetch, który zwraca Promise
      return fetch(`/get_price/${tag}`)
          .then(response => {
              // Jeśli odpowiedź nie jest OK, wyrzucamy błąd
              if (!response.ok) {
                  throw new Error('Błąd sieci');
              }
              return response.json(); // Oczekujemy JSON-a w odpowiedzi
          })
          .then(data => {
              // Zwracamy cenę (będzie dostępna, kiedy Promise zostanie rozwiązany)
              return data.current_price;
          })
          .catch(error => {
              // Obsługuje błędy i może zwrócić np. null w przypadku błędu
              console.error('Błąd pobierania ceny:', error);
              return null; // Możesz także zwrócić domyślną wartość, np. 0
          });
  }

    function addToFav(){
      let tag = document.getElementById("tag").value;
      fetch(`/add_fav/${tag}`)
        .then(response => response.json())
        .then(data => {
            try{
              data.message == "Brak danych dla podanego symbolu"
            }
            catch(error){
              document.getElementById('fav-message').innerHTML = data.message;
            }
            let list = document.getElementById('stocks-list');
            const li = document.createElement('li');
            get_price(tag).then(price => {
              list.innerHTML += `<li>
                  <button type="button" onclick="get_data('${tag}')">${tag} - ${price.toFixed(2)}/per stock</button>
              </li>`;
          })})
        .catch(error => {
          console.error('Błąd podczas dodawania do ulubionych:', error);
        });
    }