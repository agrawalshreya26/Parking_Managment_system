
// Total parking slots
let totalSlots = 10;

// Parking charges
let carRate = 20;
let bikeRate = 10;

// Get saved data from Local Storage
let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];


// Save data in Local Storage
function saveData() {

    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    localStorage.setItem("history", JSON.stringify(history));

}


// Update Dashboard
function updateDashboard() {

    let occupied = vehicles.length;
    let available = totalSlots - occupied;

    let totalElement = document.getElementById("totalSlots");
    let occupiedElement = document.getElementById("occupiedSlots");
    let availableElement = document.getElementById("availableSlots");

    if (totalElement) {
        totalElement.innerText = totalSlots;
        occupiedElement.innerText = occupied;
        availableElement.innerText = available;
    }

}


// Display Parking Slots
function displaySlots() {

    let slotBox = document.getElementById("parkingSlots");

    if (!slotBox) return;

    slotBox.innerHTML = "";

    for (let i = 1; i <= totalSlots; i++) {

        let occupied = vehicles.find(v => v.slot == i);

        let slot = document.createElement("div");

        slot.className = occupied ? "slot occupied" : "slot";

        if (occupied) {
            slot.innerHTML = "Slot " + i + "<br>Occupied";
        } else {
            slot.innerHTML = "Slot " + i + "<br>Available";
        }

        slotBox.appendChild(slot);

    }

}


// Display Parked Vehicles
function displayVehicles() {

    let table = document.getElementById("vehicleTable");

    if (!table) return;

    table.innerHTML = "";

    vehicles.forEach(function(vehicle, index) {

        let row = table.insertRow();

        row.insertCell(0).innerText = vehicle.number;
        row.insertCell(1).innerText = vehicle.type;
        row.insertCell(2).innerText = vehicle.slot;
        row.insertCell(3).innerText = vehicle.entry;

        let actionCell = row.insertCell(4);

        let button = document.createElement("button");

        button.innerText = "Exit";
        button.className = "exit-btn";

        button.onclick = function() {
            exitVehicle(index);
        };

        actionCell.appendChild(button);

    });

}


// Add New Vehicle
let parkingForm = document.getElementById("parkingForm");

if (parkingForm) {

    parkingForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let number = document.getElementById("vehicleNumber")
                    .value.trim().toUpperCase();

        let type = document.getElementById("vehicleType").value;

        // Check duplicate vehicle
        let duplicate = vehicles.find(v => v.number === number);

        if (duplicate) {

            alert("This vehicle is already parked!");
            return;

        }

        // Find available slot
        let availableSlot = 0;

        for (let i = 1; i <= totalSlots; i++) {

            let occupied = vehicles.find(v => v.slot == i);

            if (!occupied) {

                availableSlot = i;
                break;

            }

        }

        // Check parking availability
        if (availableSlot === 0) {

            alert("Parking is Full!");
            return;

        }

        // Get current entry time
        let entryTime = new Date();

        // Create vehicle object
        let vehicle = {

            number: number,
            type: type,
            slot: availableSlot,
            entry: entryTime.toLocaleString(),
            time: entryTime.getTime()

        };

        // Add vehicle to array
        vehicles.push(vehicle);

        saveData();

        alert("Vehicle Parked Successfully! Slot: " + availableSlot);

        parkingForm.reset();

        updateDashboard();
        displaySlots();
        displayVehicles();

    });

}


// Vehicle Exit Function
function exitVehicle(index) {

    let vehicle = vehicles[index];

    let exitTime = new Date();

    // Calculate parking hours
    let difference = exitTime.getTime() - vehicle.time;

    let hours = Math.ceil(difference / (1000 * 60 * 60));

    if (hours < 1) {
        hours = 1;
    }

    // Calculate parking fee
    let rate;

    if (vehicle.type === "Car") {
        rate = carRate;
    } else {
        rate = bikeRate;
    }

    let fee = hours * rate;

    let confirmExit = confirm(
        "Vehicle: " + vehicle.number +
        "\nParking Hours: " + hours +
        "\nTotal Fee: Rs. " + fee +
        "\n\nConfirm Vehicle Exit?"
    );

    if (!confirmExit) return;

    // Add details to history
    history.push({

        number: vehicle.number,
        slot: vehicle.slot,
        fee: fee,
        exit: exitTime.toLocaleString()

    });

    // Remove vehicle from parking
    vehicles.splice(index, 1);

    saveData();

    updateDashboard();
    displaySlots();
    displayVehicles();
    displayHistory();

}


// Display Parking History
function displayHistory() {

    let table = document.getElementById("historyTable");

    if (!table) return;

    table.innerHTML = "";

    history.forEach(function(vehicle) {

        let row = table.insertRow();

        row.insertCell(0).innerText = vehicle.number;
        row.insertCell(1).innerText = vehicle.slot;
        row.insertCell(2).innerText = "Rs. " + vehicle.fee;
        row.insertCell(3).innerText = vehicle.exit;

    });

}


// Run functions when page loads
updateDashboard();
displaySlots();
displayVehicles();
displayHistory();
