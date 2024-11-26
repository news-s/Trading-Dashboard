function info(){
    let contener = document.getElementById('cont');
    
    fetch(`/info/${window.globalVariable}`)
    .then(response => response.json())
    .then(data => {
        contener.innerHTML = "";
        if(data == undefined){
            contener.innerHTML = "Error fetching data";
            return;
        }
        console.log(data);
        contener.innerHTML += data.current_price;
        //contener.innerHTML += data.longBusinessSummary;
        contener.innerHTML += data.phone;
        contener.innerHTML += data.uuid;
        contener.innerHTML += `<a href="${data.website}">${data.website}</a>`;
        contener.innerHTML += data.city;
        contener.innerHTML += data.state;
        contener.innerHTML += data.country;
        contener.innerHTML += data.industry;
        contener.innerHTML += data.sector;
        contener.innerHTML += data.fullTimeEmployees;
        contener.innerHTML += data.address1;
        contener.innerHTML += data.underlyingSymbol;
    })
}