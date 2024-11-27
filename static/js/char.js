let myChart;

    function run(){
      let tag = document.getElementById("tag").value.toUpperCase();
      get_data(tag);
    }
    
    function get_data(tag){
      fetch(`/get_data/${tag}`)
        .then(response => response.json())
        .then(data => {
          const chartData = data.data.map(item => ({
            x: item.date, 
            y: item.close
          }));

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
              from: NaN,
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
                  mode: 'index',
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(tooltipItem) {
                        const date = tooltipItem.raw.x;  
                        const price = tooltipItem.raw.y; 
                        const formattedDate = new Date(date).toLocaleDateString('en-US');

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
          window.globalVariable = tag
          if (myChart) {
            myChart.data.datasets[0].data = chartData;
            myChart.update();
          } else {
            let ctx = document.getElementById('myChart').getContext('2d');
            myChart = new Chart(ctx, config);
          }
        })
        .catch(error => console.error('Błąd podczas pobierania danych:', error));
    }

    function get_price(tag) {
      return fetch(`/get_price/${tag}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Błąd sieci');
              }
              return response.json();
          })
          .then(data => {
              return data.current_price;
          })
          .catch(error => {
              console.error('Błąd pobierania ceny:', error);
              return null;
          });
  }

    function addToFav(){
      let tag = document.getElementById("tag").value.toUpperCase();
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