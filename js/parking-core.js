// data structure class Entry{
    constructor(owner,car,licensePlate){
        this.owner = owner;
//        this.car = car;
     //   this.licensePlate = licensePlate;
       // var now = new Date();
      //  var year = now.getFullYear();
      //  var day = now.getDay();
      //  var month = now.getMonth();
     // code apparent here   var hours = now.getHours();
        var minutes = now.getMinutes();
        var sec = now.getSeconds();
        day = String(day).padStart(2, 0);        
        month = String(month).padStart(2, 0);  
        hours = hours > 12 ? hours - 12 : hours;
        hours = String(hours).padStart(2, 0);        
        minutes = String(minutes).padStart(2, 0);        
        sec = String(sec).padStart(2, 0);        
        this.entryDate = `${year}-${month}-${day} ${hours}:${minutes}:${sec}`;
        this.exitDate = null;
    }
}
    class UI{
    static displayEntries(){
   
        const entries = Store.getEntries();
        entries.forEach((entry) => UI.addEntryToTable(entry));
    }
    static addEntryToTable(entry){
        const tableBody=document.querySelector('#tableBody');
        const row = document.createElement('tr');
        row.innerHTML = `   <td>${entry.owner}</td>
                            <td>${entry.car}</td>
                            <td class="lp-data">${entry.licensePlate}</td>
                            <td>${entry.entryDate}</td>
                            <td>${entry.exitDate || "N/A"}</td>
                            <td class='text-center'>
                                <div class="btn-group btn-group-sm">
                                    <button type="button" class="btn btn-sm btn-outline-primary rounded-0 p-1 d-flex align-items-center justify-content-center park-out"><span class="material-symbols-outlined fs-6">logout</span></button>
                                    <button type="button" class="btn btn-sm btn-outline-danger rounded-0 p-1 d-flex align-items-center justify-content-center delete"><span class="material-symbols-outlined fs-6">delete</span></button>
                                <div>
                            </td>`;
        tableBody.appendChild(row);
        this.parkOut(row.querySelector('.park-out'))
        if(entry.exitDate != null){
            row.querySelector('.park-out').setAttribute('disabled',true)
        }
        this.deleteEntry(row.querySelector('.delete'))
    }
    static clearInput(){
        //Selects all the inputs
        const inputs = document.querySelectorAll('.form-control');
        //Clear the content of each input
        inputs.forEach((input)=>input.value="");
    }
    static parkOut(target){
        target.addEventListener('click', (e)=>{
            e.preventDefault()
            if(confirm(`Are you sure to mark this car as exited? This action cannot be undone.`) === false)
            return false;
            var licensePlate = target.closest('tr').querySelector('.lp-data').innerText;
            var entry = Store.getEntry(licensePlate)
            var now = new Date();
            var year = now.getFullYear();
            var day = now.getDay();
            var month = now.getMonth();
            var hours = now.getHours();
            var minutes = now.getMinutes();
            var sec = now.getSeconds();
            day = String(day).padStart(2, 0);        
            month = String(month).padStart(2, 0);  
            hours = hours > 12 ? hours - 12 : hours;
            hours = String(hours).padStart(2, 0);        
            minutes = String(minutes).padStart(2, 0);        
            sec = String(sec).padStart(2, 0);   
            entry.exitDate = `${year}-${month}-${day} ${hours}:${minutes}:${sec}`;
            Store.updateEntry(licensePlate, entry)
            target.closest('tr').querySelector('td:nth-child(5)').innerText = entry.exitDate
            target.setAttribute('disabled', true)
            this.showAlert(`Car with [${licensePlate}] License Plate has exited from the parking lot.`, 'success')
        })
    }
    static deleteEntry(target){
        target.addEventListener('click', (e)=>{
            e.preventDefault()
            if(confirm(`Are you sure to delete this data? This action cannot be undone.`) === false)
            return false;
            //Call to UI function that removes entry from the table
            target.closest('tr').remove();
            //Get license plate to use as unique element of an entry
            var licensePlate = target.closest('tr').querySelector('.lp-data').innerText;
            //Call to Store function to remove entry from the local storage
            Store.removeEntries(licensePlate);
            //Show alert that entry was removed
            this.showAlert('Car successfully removed from the parking lot list','success');
        })
    }
    static showAlert(message,className){
        const div = document.createElement('div');
        div.className=`alert alert-${className} px-2 py-1 rounded-0`;
        div.appendChild(document.createTextNode(message));
        const msgContainer = document.getElementById('msg');
        msgContainer.innerHTML = ''
        msgContainer.appendChild(div);
        setTimeout(() => div.remove(),5000);
    }
    static validateInputs(){
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        if(owner === '' || car === '' || licensePlate === ''){
            UI.showAlert('All fields must me filled!','danger');
            return false;
        }
        return true;
   
    }
}

class Store{
    static getEntries(){
        let entries;
        if(localStorage.getItem('entries') === null){
            entries = [];
        }
        else{
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }
    static addEntries(entry){
        const entries = Store.getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }
    static removeEntries(licensePlate){
        const entries = Store.getEntries();
        entries.forEach((entry,index) => {
            if(entry.licensePlate === licensePlate){
                entries.splice(index, 1);
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }
    static getEntry(licensePlate){
        const entries = Store.getEntries();
        var selectedEntry = {};
        entries.forEach((entry,index) => {
            if(entry.licensePlate === licensePlate){
                selectedEntry = entry
            }
        });
        return selectedEntry

    }
    static updateEntry(licensePlate, data){
        const entries = Store.getEntries();
        entries.forEach((entry,index) => {
            if(entry.licensePlate === licensePlate){
                entries[index] = data
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}
    document.addEventListener('DOMContentLoaded',UI.displayEntries);

    document.querySelector('#entryForm').addEventListener('submit',(e)=>{
        e.preventDefault();
                const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        if(!UI.validateInputs()){
            return;
        }
        const entry = new Entry(owner, car, licensePlate);
        Store.addEntries(entry);
        UI.addEntryToTable(entry);
        UI.clearInput();
        UI.showAlert('Car successfully added to the parking lot','success');
    });
//Event Remove
    document.querySelector('#tableBody').querySelectorAll('.delete').forEach(item =>{
        
    })

//Event Search
    document.querySelector('#searchInput').addEventListener('keyup', function searchTable(){
        //Get value of the input search
        const searchValue = document.querySelector('#searchInput').value.toUpperCase();
        //Get all lines of table body
        const tableLine = (document.querySelector('#tableBody')).querySelectorAll('tr');
        //for loop #1 (used to pass all the lines)
        for(let i = 0; i < tableLine.length; i++){
            var count = 0;
            //Get all collumns of each line
            const lineValues = tableLine[i].querySelectorAll('td');
            //for loop #2 (used to pass all the collumns)
            for(let j = 0; j < lineValues.length - 1; j++){
                //Check if any collumn of the line starts with the input search string
                if((lineValues[j].innerHTML.toUpperCase()).startsWith(searchValue)){
                    count++;
                }
            }
            if(count > 0){
                //If any collumn contains the search value the display block
                tableLine[i].style.display = '';
            }else{
                //Else display none 
                tableLine[i].style.display = 'none';
            }
        }
    });
