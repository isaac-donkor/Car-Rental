const bookingList = document.getElementById("bookingList");

function loadBookings() {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  if (bookings.length === 0) {
    bookingList.innerHTML = "<p>No bookings found.</p>";
    return;
  }

  bookingList.innerHTML = "";

  bookings.forEach((booking) => {
    const div = document.createElement("div");
    div.classList.add("booking-item");
    div.innerHTML = `
      <p><strong>Car:</strong> ${booking.car}</p>
      <p><strong>Pickup:</strong> ${booking.pickup}</p>
      <p><strong>Drop-off:</strong> ${booking.dropoff}</p>
      <button onclick="deleteBooking(${booking.id})">Delete</button>
      <hr>
    `;
    bookingList.appendChild(div);
  });
}

function deleteBooking(id) {
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings = bookings.filter((b) => b.id !== id);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  loadBookings();
}

loadBookings();
