(loadPage = () => {
  fetch("http://localhost:3000/items")
    .then((res) => res.json())
    .then((data) => {
      displayUser(data);
    });
})();

const userDisplay = document.querySelector(".table"); //haetaan taulukkoelementti

displayUser = (data) => {
  userDisplay.innerHTML += ` 
            <thead> 
            <tr> 
                <th>Id</th> 
                <th>Nimi</th> 
                <th>Puhelin</th> 
                <th>Poista</th>
                <th>Muokkaa</th> 
            </tr> 
            </thead> `;
  displayRow(data);
};

displayRow = (data) => {
  data.forEach((user) => {
    userDisplay.innerHTML += ` 
                <tbody> 
                <tr> 
                    <td>${user.id}</td> 
                    <td>${user.nimi}</td> 
                    <td id="phone-${user.id}">${user.puhelin}</td> 
                    <td><input type="button" onClick="removeRow(${user.id})" value="X"/></td>
                    <td><input type="button" onClick="openEditForm(${user.id}, '${user.puhelin}')" value="Muokkaa"/></td>
                </tr> 
                </tbody> `;
  });
};

removeRow = async (id) => {
  console.log(id);
  let polku = "http://localhost:3000/items/" + id;

  await fetch(polku, { method: "DELETE" }).then(() =>
    console.log("poisto onnistui")
  );

  window.location.reload(); //ladataan sivu uudelleen - huono tapa: pitäisi päivittää vain joku alue
};

function openEditForm(id, phone) {
  const formHtml = `
        <form id="edit-form" onsubmit="updatePhone(event, ${id})">
          <label for="newPhone">Uusi puhelinnumero:</label>
          <input type="text" id="newPhone" name="puhelin" value="${phone}" required>
          <button type="submit">Tallenna</button>
          <button type="button" onclick="closeEditForm()">Peruuta</button>
        </form>`;

  document.getElementById("edit-container").innerHTML = formHtml;
}

function closeEditForm() {
  document.getElementById("edit-container").innerHTML = "";
}

async function updatePhone(event, id) {
  event.preventDefault();
  const newPhone = document.getElementById("newPhone").value;

  await fetch(`http://localhost:3000/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ puhelin: newPhone }),
  })
    .then((res) => res.json())
    .then(() => {
      document.getElementById(`phone-${id}`).textContent = newPhone;
      closeEditForm();
    })
    .catch((error) => console.error("Virhe päivitettäessä: ", error));
}

document
  .getElementById("puhelintieto_lomake")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const nimi = document.getElementById("nimi").value;
    const puhelin = document.getElementById("puhelin").value;

    const newItem = {
      nimi: nimi,
      puhelin: puhelin,
    };

    await fetch("http://localhost:3000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Uusi puhelintieto lisätty:", data);
        displayRow([data]);
      })
      .catch((error) => {
        console.error("Virhe tiedon lisäyksessä:", error);
      });
  });
