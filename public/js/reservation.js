let db;
Reservations = [];
const btnU = document.querySelector("#btnUpdate");
const btnD = document.querySelector("#btnDelete");
const btnA = document.querySelector("#btnAdd");

const dbChanger = document.querySelector("#changer");
const dbNames = "EcChocolate";

const searchIn = document.querySelector(".search-button");

const mainEl = document.querySelector("main");

const footerEl = document.querySelector("footer");

const table = document.querySelector("#reservation");

const ul = document.createElement("ul");
const li = document.createElement("li");

footerEl.append(ul.appendChild(li));

// >>>>>>>>>>>>>>>>>>>>>>>>>>   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var DBOpenRequest = window.indexedDB.open(dbNames, 1);

DBOpenRequest.onsuccess = function (event) {
  footerEl.innerHTML += "<li>Database initialised.</li>";

  // store the result of opening the database in the db variable.

  db = DBOpenRequest.result;

  // Run the getData() function to get the data from the database

  searchIn.addEventListener("change", function (event) {
    //event.preventDefault();

    searchIt((Reservation) => {
      const tbody = table.querySelector("#resBody");

      Reservation.forEach((reserv) => {
        let total = Math.round(reserv.Guests / 2) * reserv.Price;

        const content = `
         <tr>
           <td>${reserv.id}</td>
           <td>${reserv.FullName}</td>
           <td>${reserv.Guests}</td>
           <td>${reserv.Price}</td>
           <td>${total}</td>
           <td>${reserv.Phone}</td>
           <td>${reserv.Dates}</td>
         </tr>
        `;

        tbody.innerHTML = content;
      });
    }, parseInt(searchIn.value));
  });

  if (!searchIn.value) {
    getReservation((Reservation) => {
      addToTable(Reservation);
    });
  } else {
    searchIt((Reservation) => {
      addToTable(Reservation);
    }, searchIn.value);
  }
};

function addToTable(Reservation) {
  const tbody = table.querySelector("#resBody");
  Reservation.forEach((reserv) => {
    let total = Math.round(reserv.Guests / 2) * reserv.Price;

    const content = `
     <tr>
       <td>${reserv.id}</td>
       <td>${reserv.FullName}</td>
       <td>${reserv.Guests}</td>
       <td>${reserv.Price}</td>
       <td>${total}</td>
       <td>${reserv.Phone}</td>
       <td>${reserv.Dates}</td>
     </tr>
    `;

    tbody.innerHTML += content;
  });
}

function getReservation(cbCompleted) {
  // 1. Retrieve reservations from indexedDB

  const transaction = db.transaction("Reservations", "readonly");
  const objectStore = transaction.objectStore("Reservations");

  const request = objectStore.openCursor();

  request.onsuccess = function (event) {
    const cursor = event.target.result;

    if (cursor) {
      Reservations.push(cursor.value);
      cursor.continue();
    } else {
      cbCompleted(Reservations);
    }
  };
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>> Search Function   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

function searchIt(seachCallback, idNum) {
  const searchResult = [];
  let idNumControl = 0;

  const transaction = db.transaction(["Reservations"], "readwrite");
  const objectStore = transaction.objectStore("Reservations");

  objectStore.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      //if (cursor.value.id === idNum) {
      if (cursor.value.id === idNum) {
        const updateData = cursor.value;

        const request = searchResult.push(updateData);

        idNumControl++;
      }

      cursor.continue();
    } else {
      if (idNumControl < 1) {
        alert(`The ID-number ${idNum} don't exist in date base.
        Pleas try again ...!`);
      } else {
        seachCallback(searchResult);
      }

      if (!idNum) {
        location.reload();
      }
      console.log("Search result ");
    }
  };
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// request.onsuccess = function() {
//   console.log('Result Send to screen');
// };

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

window.onload = () => {
  let request = window.indexedDB.open(dbNames, 1);

  request.onerror = function () {
    console.log("Database failed to open");
  };

  request.onsuccess = function () {
    console.log("Database opened successfully");

    db = request.result;
  };

  request.onupgradeneeded = function (e) {
    let db = e.target.result;

    let objectStore = db.createObjectStore("Reservations", {
      keyPath: "id",
      autoIncrement: true,
    });

    objectStore.createIndex("fullName", "fullName", { unique: false });
    objectStore.createIndex("guests", "guests", { unique: false });
    objectStore.createIndex("price", "price", { unique: false });
    objectStore.createIndex("phone", "phone", { unique: false });
    objectStore.createIndex("dates", "dates", { unique: false });

    console.log("Database setup complete");
    li.innerHTML = "Database setup complete";
  };

  // make a form to insert information

  btnA.addEventListener("click", (event) => {
    const section = document.querySelector("section");
    const reservationContent = reservationTemp();

    section.innerHTML = reservationContent;

    const btnAct = document.querySelector("#reserv");

    const form = document.querySelector("#form");

    btnAct.addEventListener("click", function (event) {
      event.preventDefault();

      const newReservation = {
        FullName: form.fName.value,
        Phone: form.phone.value,
        Guests: form.guest.value,
        Dates: form.checkIn.value,
        Price: form.resType.value,
      };

      //  Add object to Database

      let transaction = db.transaction(["Reservations"], "readwrite");

      let objectStore = transaction.objectStore("Reservations");

      let request = objectStore.add(newReservation);

      request.onsuccess = () => {
        form.reset();
      };

      transaction.oncomplete = () => {
        guestnum = Math.round(form.guest.value / 2);

        alert(` Dear ${form.fName.value}!  

            You made a reservation for ${form.guest.value} persons.
            Total prise for this reservation ${
              guestnum * form.resType.value
            } kr.
      
            We will wathing for you the ${form.checkIn.value}.
      
            Thank you for your reservation!
            `);
        location.reload();
        console.log("Transaction completed on the database");
      };

      transaction.onerror = () => {
        console.log("Transaction not completed, error!!!");
      };
    });
  });

  // >>>>>>>>>>>>>>>  Delete Data <<<<<<<<<<<<<<<<<<<<<<<<<<

  btnD.addEventListener("click", (event) => {
    const section = document.querySelector("section");

    const formContent = `
        <form id="form">
          <h2>Delete Reservation</h2>
          <label for="id">ID </label>
          <input id="idInput" type="number" name="idinput"><br>
        </form>
    `;

    section.innerHTML = formContent;

    const formEl = document.querySelector("form");

    const idEl = document.querySelector("#idInput");

    let idValue;

    idEl.addEventListener("change", (event) => {
      idValue = idEl.value;
      //alert(`idEl.value = ${Reservations[Reservations.length - 1].id}`);
      Reservations.forEach((reserv) => {
        if (idEl.value == reserv.id) {
          const reservationContent = deleteTepm(reserv);

          formEl.innerHTML = reservationContent;
        }
      });

      //<<<<<<<<<<<<<  >>>>>>>>>>>>>>>>>>>>>>>

      const btnAct = document.querySelector("#action");

      btnAct.addEventListener("click", function (event) {
        event.preventDefault();

        const form = document.querySelector("form");

        const reservation = {
          id: form.idinput.value,
          FullName: form.fName.value,
          Phone: form.phone.value,
          Guests: form.guest.value,
          Dates: form.checkIn.value,
          Price: form.resType.value,
        };

        var DBOpenRequest = window.indexedDB.open(dbNames, 1);

        DBOpenRequest.onsuccess = function (event) {
          footerEl.innerHTML += "<li>Database initialised.</li>";

          db = DBOpenRequest.result;

          deleteData();
        };

        function deleteData() {
          var transaction = db.transaction(["Reservations"], "readwrite");

          transaction.oncomplete = function (event) {
            footerEl.innerHTML += "<li>Transaction completed.</li>";
            location.reload();
          };

          transaction.onerror = function (event) {
            footerEl.innerHTML +=
              "<li>Transaction not opened due to error: " +
              transaction.error +
              "</li>";
          };

          // create an object store on the transaction
          var objectStore = transaction.objectStore("Reservations");

          // Make a request to delete the specified record out of the object store
          var objectStoreRequest = objectStore.delete(parseInt(idEl.value));

          objectStoreRequest.onsuccess = function (event) {
            // report the success of our request
            footerEl.innerHTML += "<li>Request successful.</li>";
            form.reset();
            location.reload();
          };
        }
      });
    });
  });
  //<<<<<<<<<<<<<  Update  >>>>>>>>>>>>>>>>>>>>>>>

  btnU.addEventListener("click", (event) => {
    const section = document.querySelector("section");

    const formContent = `
        <form id="form">
          <h2>Update Reservation</h2>
          <label for="id">ID </label>
          <input id="idInput" type="number" name="idinput"><br>
        </form>
    `;

    section.innerHTML = formContent;

    const formEl = document.querySelector("form");

    const idEl = document.querySelector("#idInput");

    let idValue;

    idEl.addEventListener("change", (event) => {
      idValue = idEl.value;
      //alert(`idEl.value = ${Reservations[Reservations.length - 1].id}`);
      Reservations.forEach((reserv) => {
        if (idEl.value == reserv.id) {
          const reservationContent = updateTemplate(reserv);

          formEl.innerHTML = reservationContent;
        }
      });

      //<<<<<<<<<<<<<  >>>>>>>>>>>>>>>>>>>>>>>

      const btnAct = document.querySelector("#action");

      btnAct.addEventListener("click", function (event) {
        event.preventDefault();
        //   alert("Update");

        const form = document.querySelector("form");
        let newId = parseInt(form.idinput.value);
        const reservation = {
          id: parseInt(form.idinput.value),
          FullName: form.fName.value,
          Phone: form.phone.value,
          Guests: form.guest.value,
          Dates: form.checkIn.value,
          Price: form.resType.value,
        };

        // >>>>>>>>>>>>>>>>  update   <<<<<<<<<<<<<<<<<<<<<<<<<<<<

        var DBOpenRequest = window.indexedDB.open(dbNames, 1);

        DBOpenRequest.onsuccess = function (event) {
          footerEl.innerHTML += "<li>Database initialised.</li>";

          db = DBOpenRequest.result;

          deleteData();
        };

        function deleteData() {
          var transaction = db.transaction(["Reservations"], "readwrite");

          transaction.oncomplete = function (event) {
            footerEl.innerHTML += "<li>Transaction completed.</li>";
            location.reload();
          };

          transaction.onerror = function (event) {
            footerEl.innerHTML +=
              "<li>Transaction not opened due to error: " +
              transaction.error +
              "</li>";
          };

          // create an object store on the transaction
          var objectStore = transaction.objectStore("Reservations");

          // Make a request to delete the specified record out of the object store
          var objectStoreRequest = objectStore.delete(parseInt(idEl.value));

          objectStoreRequest.onsuccess = function (event) {
            // report the success of our request
            footerEl.innerHTML += "<li>Request successful.</li>";

            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            let request = objectStore.add(reservation);

            request.onsuccess = () => {
              form.reset();
            };

            transaction.oncomplete = () => {
              guestnum = Math.round(form.guest.value / 2);

              alert(` Dear ${form.fName.value}!  
              
                  You made a reservation for ${form.guest.value} persons.
                  Total prise for this reservation ${
                    guestnum * form.resType.value
                  } kr.
            
                  We will wathing for you the ${form.checkIn.value}.
            
                  Thank you for your reservation!
                  `);
              location.reload();
              console.log("Transaction completed on the database");
            };

            transaction.onerror = () => {
              console.log("Transaction not completed, error!!!");
            };

            form.reset();
            location.reload();
          };
        }
        // >>>>>>>>>>>>>>>> / update   <<<<<<<<<<<<<<<<<<<<<<<<<<<<
      });
    });
  });
};
// >>>>>>>>>>>>>>>>  function   <<<<<<<<<<<<<<<<<<<<<<<<<<<<
function reservationTemp() {
  return `
        <form id="form">
            <h2>Add Reservation</h2>
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
        </form>
    `;
}

function deleteTepm(reserv) {
  return `    
          <h2>Delete Reservation</h2>
          <label for="id">ID </label>
          <input id="idUpdat" type="number" name="idinput" placeholder="${reserv.id}" disabled><br>
          <label for="fullName">Full name:</label>
          <input type="text" name="fName" placeholder="${reserv.FullName}"><br>
          <label for="lastName">Phone number:</label>
          <input type="tel" name="phone" id="phone" placeholder="${reserv.Phone}">
          <label for="guest">Number of gæstes:</label>
          <input type="number" name="guest" placeholder="${reserv.Guests}"><br>
          <label for="date" name="dateIn">Date:</label>
          <input type="date" name="checkIn" id="checkIn" value="${reserv.Dates}"><br>
          <label for="reservation">Choos your reservation:</label>
          <select name="resType" id="resType" value="${reserv.Price}">
              <option value="450">For 2 people incl. a hot drink: KR 450</option>
              <option value="620">For 2 people incl. a hot drink and a glass of bubbles: KR 620</option>
          </select><br>
          <button type="submit" id="action">Delete</button>
      
           `;
}

function updateTemplate(reserv) {
  return `    
          <h2>Update Reservation</h2>
          <label for="id">ID </label>
          <input id="idUpdat" type="number" name="idinput" value="${reserv.id}" disabled><br>
          <label for="fullName">Full name:</label>
          <input type="text" name="fName" value="${reserv.FullName}"><br>
          <label for="lastName">Phone number:</label>
          <input type="tel" name="phone" id="phone" value="${reserv.Phone}">
          <label for="guest">Number of gæstes:</label>
          <input type="number" name="guest" value="${reserv.Guests}"><br>
          <label for="date" name="dateIn">Date:</label>
          <input type="date" name="checkIn" id="checkIn" value="${reserv.Dates}"><br>
          <label for="reservation">Choos your reservation:</label>
          <select name="resType" id="resType" selected="${reserv.Price}">
              <option value="450">For 2 people incl. a hot drink: KR 450</option>
              <option value="620">For 2 people incl. a hot drink and a glass of bubbles: KR 620</option>
          </select><br>
          <button type="submit" id="action">Update</button>
      
           `;
}

