function info() {
    const container = document.getElementById('cont');
  
    fetch(`/info/${window.globalVariable}`)
      .then(response => response.json())
      .then(data => {
        if (data === undefined) {
          container.innerHTML = "Error fetching data";
          return;
        }
  
        console.log(data);
  
        const infoElement = document.createElement('div');
        infoElement.classList.add('info-container');
  
        infoElement.innerHTML = `
          <p><strong>Current Price:</strong> ${data.current_price}</p>
          <p><strong>Business Summary:</strong> ${data.longBusinessSummary}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Website:</strong> <a href="${data.website}">${data.website}</a></p>
          <p><strong>Location:</strong> ${data.city}, ${data.state}, ${data.country}</p>
          <p><strong>Industry & Sector:</strong> ${data.industry} - ${data.sector}</p>
          <p><strong>Employees:</strong> ${data.fullTimeEmployees}</p>
          <p><strong>Address:</strong> ${data.address1}</p>
          <p><strong>Underlying Symbol:</strong> ${data.underlyingSymbol}</p>
        `;
  
        container.appendChild(infoElement);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        container.innerHTML = "An error occurred. Please try again later.";
      });
  }