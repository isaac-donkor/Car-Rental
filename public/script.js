document.getElementById("rentalForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const car = document.getElementById("car").value;
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;

  fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ car, pickup, dropoff })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("confirmation").textContent = `Booking confirmed! Booking ID: ${data.id}`;
    })
    .catch(err => {
      document.getElementById("confirmation").textContent = "Error booking car.";
    });

  this.reset();
});
