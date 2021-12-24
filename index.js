window.onload = function () {
  base_preguntas = readText("base-preguntas.json");
  interprete_bp = JSON.parse(base_preguntas);
  escogerPreguntaAleatoria();
};

let link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href =
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
link.media = "all";
document.getElementsByTagName("head")[0].appendChild(link);

baseDeDatosLogin = JSON.parse(localStorage.getItem("sistema-de-login"));

let usuarioLogueado;
let pregunta;
let posibles_respuestas;
btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4"),
  select_id("btn5"),
];

let preguntas_hechas = 0;
let preguntas_correctas = 0;
let preguntas_incorrectas = 0;

function escogerPreguntaAleatoria() {
  let n;
  if (preguntas_hechas === 0) n = Math.floor(Math.random() * 5);
  if (preguntas_hechas === 1) n = Math.floor(Math.random() * 5 + 5);
  if (preguntas_hechas === 2) n = Math.floor(Math.random() * 5 + 10);
  if (preguntas_hechas === 3) n = Math.floor(Math.random() * 5 + 15);
  if (preguntas_hechas === 4) n = Math.floor(Math.random() * 5 + 20);

  preguntas_hechas++;

  if (preguntas_incorrectas === 1) {
    swal.fire({
      title: "Gracias por Jugar",

      text:
        "Puntuación: " +
        preguntas_correctas +
        "/" +
        (preguntas_hechas - 1) +
        "   Intenta De Nuevo",
      icon: "success",
    });
    preguntas_correctas = 0;
    preguntas_hechas = 0;
    preguntas_incorrectas = 0;
    n = 0;
    reiniciar();
  }
  if (preguntas_hechas === 6) {
    swal.fire({
      title: "Juego finalizado",
      text: "Puntuación: " + preguntas_correctas + "/" + (preguntas_hechas - 1),
      icon: "success",
    });
    preguntas_correctas = 0;
    preguntas_hechas = 0;
    preguntas_incorrectas = 0;
    n = 0;

    reiniciar();
  }

  escogerPregunta(n);
}

if (!baseDeDatosLogin) {
  cargarDatosInicialesDeLaBaseDeDatosLogin();
}

function guardarDatosDeLaBaseDeDatosLogin() {
  localStorage.setItem("sistema-de-login", JSON.stringify(baseDeDatosLogin));
}

function cargarDatosInicialesDeLaBaseDeDatosLogin() {
  baseDeDatosLogin = {
    1234567890: {
      //Aquí se ponen los elementos por defecto del usuario
      contraseña: "abc",
      puntaje: 10,
    },
    "0987654321": {
      //Aquí se ponen los elementos por defecto del usuario
      contraseña: "def",
      puntaje: 10,
    },
    98765434567: {
      //Aquí se ponen los elementos por defecto del usuario
      contraseña: "ghi",
      puntaje: 10,
    },
  };
}

async function menúBásico() {
  opción_menúBásico = -1;
  await swal.fire({
    title: "Menú",
    showConfirmButton: false,
    html: `
        <button class="swal2-confirm swal2-styled" onclick='opción_menúBásico=0;Swal.close()'>
            Nuevo Jugador
        </button>
        <br>
        <button class="swal2-confirm swal2-styled" onclick='opción_menúBásico=1;Swal.close()'>
           Continuar
        </button>
        `,
  });
  switch (opción_menúBásico) {
    case 0:
      registrarNuevoUsuario();
      break;
    case 1:
      login();
      break;
    default:
      await menúBásico();
      break;
  }
}

async function mostrarUsuariosPorTabla(...propiedades) {
  if (!usuarioLogueado) {
    return;
  }
  let html = `
  <table class="table table-light table-striped">
    <theader>
    <th>
      Usuario
    </th>
  `;
  if (propiedades[0] == "*") {
    for (const usuario in baseDeDatosLogin) {
      for (const propiedad in baseDeDatosLogin[usuario]) {
        html += "<th>";
        html += propiedad;
        html += "</th>";
      }
      break;
    }
  } else {
    for (const propiedad of propiedades) {
      html += "<th>";
      html += propiedad;
      html += "</th>";
    }
  }
  html += "</theader><tbody>";
  for (const usuario in baseDeDatosLogin) {
    html += "<tr>";
    html += "<td>";
    html += usuario;
    html += "</td>";
    if (propiedades[0] == "*") {
      for (const propiedad in baseDeDatosLogin[usuario]) {
        html += "<td>";
        html += baseDeDatosLogin[usuario][propiedad];
        html += "</td>";
      }
    } else {
      for (const propiedad of propiedades) {
        html += "<td>";
        html += baseDeDatosLogin[usuario][propiedad];
        html += "</td>";
      }
    }

    html += "</tr>";
  }
  await swal.fire({
    text: "Usuarios",
    confirmButtonText: "Cerrar",
    html,
  });
}

async function registrarNuevoUsuario() {
  opción_registrarNuevoUsuario = -1;
  await swal.fire({
    title: "Registrar",
    showConfirmButton: false,
    html: `
        <input class="swal2-input" placeholder="Usuario" id="usuario">
        <input type="password" class="swal2-input" placeholder="Contraseña" id="contraseña">
        <button class="swal2-confirm swal2-styled" onclick='opción_registrarNuevoUsuario=0;Swal.clickConfirm()'>
            Crear
        </button>
        <button class="swal2-confirm swal2-styled" onclick='opción_registrarNuevoUsuario=1;Swal.close()'>
            Cancelar
        </button>
        `,
    preConfirm: () => {
      let usuario = document.getElementById("usuario").value;
      let contraseña = document.getElementById("contraseña").value;

      if (!usuario) {
        Swal.showValidationMessage("No hay usuario");
        return false;
      }
      if (!contraseña) {
        Swal.showValidationMessage("No hay contraseña");
        return false;
      }
      baseDeDatosLogin[usuario] = {};
      baseDeDatosLogin[usuario].contraseña = contraseña;
      baseDeDatosLogin[usuario].puntaje = preguntas_correctas;
      guardarDatosDeLaBaseDeDatosLogin();
      return true;
    },
  });
  switch (opción_registrarNuevoUsuario) {
    case 0:
      menúBásico();
      break;
    case 1:
      menúBásico();
      break;
    default:
      menúBásico();
      break;
  }
}

async function login() {
  await swal.fire({
    title: "Bienvenido",
    confirmButtonText: "Login",
    html: `
        <div style="margin:5px">
            <input class="swal2-input" placeholder="usuario" id="usuario">
            <input type="password" class="swal2-input" placeholder="contraseña" id="contraseña">
        </div>
        `,
    preConfirm: () => {
      let usuario = document.getElementById("usuario").value;
      let contraseña = document.getElementById("contraseña").value;
      if (!usuario) {
        Swal.showValidationMessage("No hay usuario");
        return false;
      }
      if (!contraseña) {
        Swal.showValidationMessage("No hay contraseña");
        return false;
      }
      let datos = baseDeDatosLogin[usuario];
      if (!datos) {
        Swal.showValidationMessage("El usuario no existe");
        return false;
      }
      if (datos.contraseña != contraseña) {
        Swal.showValidationMessage("Contraseña incorrecta");
        return false;
      }
      usuarioLogueado = datos;
      return true;
    },
  });
}

function escogerPregunta(n) {
  pregunta = interprete_bp[n];
  select_id("categoria").innerHTML = pregunta.categoria;
  select_id("pregunta").innerHTML = pregunta.pregunta;
  select_id("numero").innerHTML = n;
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas - 1);
  } else {
    select_id("puntaje").innerHTML = "";
  }

  style("imagen").objectFit = pregunta.objectFit;
  desordenarRespuestas(pregunta);
  if (pregunta.imagen) {
    select_id("imagen").setAttribute("src", pregunta.imagen);
    style("imagen").height = "200px";
    style("imagen").width = "100%";
  } else {
    style("imagen").height = "0px";
    style("imagen").width = "0px";
    setTimeout(() => {
      select_id("imagen").setAttribute("src", "");
    }, 500);
  }
}

function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3,
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];
  select_id("btn5").innerHTML = "Salir";
}

let suspender_botones = false;

function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] == pregunta.respuesta) {
    preguntas_correctas++;

    btn_correspondiente[i].style.background = "lightgreen";
  } else {
    preguntas_incorrectas++;
    btn_correspondiente[i].style.background = "pink";
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == pregunta.respuesta) {
      btn_correspondiente[j].style.background = "lightgreen";
      break;
    }
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 3000);
}

// let p = prompt("numero")

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "white";
  }
  escogerPreguntaAleatoria();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}
