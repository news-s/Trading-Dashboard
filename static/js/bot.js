function info(){
    let contener = document.getElementById('cont');
    
    fetch(`/info/${window.globalVariable}`)
    .then(response => response.json())
    .then(data => {
        contener.innerHTML = data.current_price;
        //Dodaj tutaj jakieś ważne inforamcje o spółce
    })
}