const databaseURL =
  "https://landing-c6440-default-rtdb.firebaseio.com/data.json";

const sendData = () => {
  const form = document.getElementById("form");

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data["saved"] = new Date().toLocaleString("es-CO", {
    timeZone: "America/Guayaquil",
  });

  fetch(databaseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      return response.json();
    })
    .then(() => {
      alert(
        "Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces"
      );

      form.reset();
    })
    .catch(() => {
      alert("Hemos experimentado un error. ¡Vuelve pronto!");
    });
};

const getData = async () => {
  try {
    const response = await fetch(databaseURL);

    if (!response.ok) {
      alert("Hemos experimentado un error. ¡Vuelve pronto!");
    }

    const data = await response.json();

    if (!data) return;

    const subscribersCount = new Map();

    if (Object.keys(data).length > 0) {
      for (let key in data) {
        const { email, saved } = data[key];

        const date = saved.split(",")[0];

        const count = subscribersCount.get(date) || 0;
        subscribersCount.set(date, count + 1);
      }
    }

    const subscribers = document.getElementById("subscribers-data");

    if (subscribersCount.size > 0) {
      subscribers.innerHTML = "";

      subscribersCount.forEach((count, date) => {
        const rowTemplate = `
                    <tr>
                        <td>${date}</td>
                        <td>${count}</td>
                    </tr>`;

        subscribers.innerHTML += rowTemplate;
      });
    }
  } catch (error) {
    console.log(error);
    alert("Hemos experimentado un error. ¡Vuelve pronto!");
  }
};

const loaded = () => {
  const myform = document.getElementById("form");

  myform.addEventListener("submit", (eventSubmit) => {
    eventSubmit.preventDefault();

    const emailElement = document.querySelector(".form-control-lg");
    const emailText = emailElement.value;

    if (emailText.length === 0) {
      emailElement.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(50px)" },
          { transform: "translateX(-50px)" },
          { transform: "translateX(0)" },
        ],
        {
          duration: 400,
          easing: "linear",
        }
      );

      emailElement.focus();

      return;
    }

    sendData();
  });
};

window.addEventListener("DOMContentLoaded", () => getData());
window.addEventListener("load", loaded);
