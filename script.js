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

  const booking = {
    car,
    pickup,
    dropoff,
    id: Date.now()
  };

  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  confirmation.textContent = `Booking Confirmed for ${car} from ${pickup} to ${dropoff}.`;
  confirmation.style.color = "green";

  this.reset();
});
