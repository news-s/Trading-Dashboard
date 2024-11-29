function info() {
    let contener = document.getElementById('cont');
    
    fetch(`/info/${window.globalVariable}`)
    .then(response => response.json())
    .then(data => {
        contener.innerHTML = `
            <div>
                <p><strong>Current Price:</strong> ${data.current_price}</p>
                <p><strong>Business Summary:</strong> ${data.longBusinessSummary}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>UUID:</strong> ${data.uuid}</p>
                <p><strong>Website:</strong> <a href="${data.website}">${data.website}</a></p>
                <p><strong>City:</strong> ${data.city}</p>
                <p><strong>State:</strong> ${data.state}</p>
                <p><strong>Country:</strong> ${data.country}</p>
                <p><strong>Industry:</strong> ${data.industry}</p>
                <p><strong>Sector:</strong> ${data.sector}</p>
                <p><strong>Full-Time Employees:</strong> ${data.fullTimeEmployees}</p>
                <p><strong>Address:</strong> ${data.address1}</p>
                <p><strong>Underlying Symbol:</strong> ${data.underlyingSymbol}</p>
            </div>
        `;
    });
}