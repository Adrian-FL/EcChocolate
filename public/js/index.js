const btnRes = document.getElementById("btnRes");
const article = document.querySelector("article");

const reservationContent = `
    <form id="form">
        <h2>Reservation</h2>
        <label for="fullName">Full name:</label>
        <input type="text" name="fName"><br>
        <label for="lastName">Phone number:</label>
        <input type="tel" name="phone" id="phone">
        <label for="guest">Number of gæstes:</label>
        <input type="number" name="guest"><br>
        <label for="date" name="dateIn">Date:</label>
        <input type="date" name="checkIn" id="checkIn"><br>
        <label for="reservation">Choos your reservation:</label>
        <select name="resType" id="resType">
            <option value="450">For 2 people incl. a hot drink: KR 450</option>
            <option value="620">For 2 people incl. a hot drink and a glass of bubbles: KR 620</option>
        </select><br><br><br>
        <button type="submit" id="reserv">Make Reservation</button>
        <button type="submit" id="cancel">Cancel back to Startpage</button>
    </form>
`;

btnRes.addEventListener("click", () => {
  article.innerHTML = reservationContent;

  const btnMakeReserv = document.getElementById("reserv");

  btnMakeReserv.addEventListener("click", () => {
    guestnum = Math.round(form.guest.value / 2);
    alert(` Dear ${form.fName.value}!  

      You made a reservation for ${form.guest.value} persons.
      Total prise for this reservation ${guestnum * form.resType.value} kr.

      We will wathing for you the ${form.checkIn.value}.

      Thank you for your reservation!
      `);
    document.location.href = "/index.html";
  });
  // Option 2 Cancel
  const btnCancel = document.getElementById("cancel");

  btnCancel.addEventListener("click", () => {
    document.location.href = "/index.html";
    alert(`You didn't make new reservation! 
    All information will be deleted and 
    you will be taken back to the start page...`);
  });
  //>>>>>>>>>>>>>>>  Here will read data  <<<<<<<<<<<<<<<<<<<<<

  const openRquest = indexedDB.open("EcChocolate", 1);
  let db;

  openRquest.onupgradeneeded = (e) => {
    //alert("onupgradeneeded invoked");

    const database = e.target.result;

    const dbTable = database.createObjectStore("Reservations", {
      keyPath: "id",
      autoIncrement: true,
      //indexedDB:"id",
    });
  };

  openRquest.onsuccess = (e) => {
    console.log("Database is ready for transaction!");

    db = openRquest.result;
  };

  openRquest.onerror = (e) => {
    alert("Error !");
  };

  //>>>>>>>>>>>>>>>  Functions  <<<<<<<<<<<<<<<<<<<<<<<<

  const form = document.querySelector("#form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const reservation = {
      FullName: form.fName.value,
      Phone: form.phone.value,
      Guests: form.guest.value,
      Dates: form.checkIn.value,
      Price: form.resType.value,
    };

    addReservation(reservation);

    form.reset();
  });

  // This function will use to add a object to indexedDB
  function addReservation(reservation) {
    let transaction = db.transaction("Reservations", "readwrite");

    let reservations = transaction.objectStore("Reservations");

    // Add a reservation to the table
    let request = reservations.add(reservation);

    request.onsucess = function () {
      alert("Your Reservation Is Registered !");
      //document.location.href = "/index.html";
    };

    request.onerror = function () {
      console.log(request.error);
    };
  }
});

// >>>>>>>>  Main footer picture and Links <<<<<<<<<<
//

let i = 0;

const dropdown = document.querySelector(".language");
const midleText = document.querySelector("#midleText");

dropdown.addEventListener("change", (e) => {
  switch (dropdown.value) {
    case "/api/products/category/ice":
      midleText.innerHTML = "EC ICE CREAM CAKE COLLECTION";
      break;
    case "/api/products/category/service":
      midleText.innerHTML = "EC SERVICE COLLECTION";
      break;
    case "/api/products/category/chocolate":
      midleText.innerHTML = "EC CHOCOLATE COLLECTION";
      break;
    case "/api/products/category/chocolate":
      midleText.innerHTML = "EC CHOCOLATE COLLECTION";
      break;
    case "/api/products":
      midleText.innerHTML = "EC All COLLECTION";
      break;
    case "/api/products/category/coffees":
      midleText.innerHTML = "EC COFFEES COLLECTION";
      break;
    case "/api/products/category/drinks":
      midleText.innerHTML = "EC DRINKS COLLECTION";
      break;
  }

  i++;

  fetch(dropdown.value)
    .then((res) => res.json())
    .then((data) => {
      const div = document.querySelector("#divMF");

      if (i > 0) {
        div.innerHTML = "";
      }

      data.forEach((d) => {
        //alert(d.description);
        const content = `
      <span>
        <img id="image2" src="/images/${d.image_path_desktop}" alt="midleImage">
        <a id="a2" href="">${d.name}</a>
      </span>
      
    `;
        div.innerHTML += content;
      });
    });
});
