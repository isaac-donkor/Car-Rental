document.getElementById("rentalForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const car = document.getElementById("car").value;
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;
  const confirmation = document.getElementById("confirmation");

  if (!car || !pickup || !dropoff) {
    confirmation.textContent = "Please fill in all fields.";
    confirmation.style.color = "red";
    return;
  }

  confirmation.textContent = `Booking Confirmed! You've booked a ${car} from ${pickup} to ${dropoff}.`;
  confirmation.style.color = "green";

  this.reset();
});
