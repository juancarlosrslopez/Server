import path from "path";
import { promises as fs} from 'fs';

export default async (req, res) => {
// Desestructurando de "req"
let { url, method } = req;

console.log(`📣 CLIENT-REQUEST: ${req.url} ${req.method}`);
const error500 = path.join(__dirname, './views/500.html');
// Enrutando peticiones
switch (url) {
  case '/':
// Peticion raiz
// Estableciendo cabeceras
try {
  const peraiz = path.join(__dirname, './views/index.html');
  const data = await fs.readFile(peraiz);
  res.writeHead(200, {"Content-Type": "text/html"});
  res.statusCode=200;
  res.end(data);
}  catch (err) {
  console.error(err);
  const data = await fs.readFile(error500);
  res.writeHead(500, {"Content-Type": "text/html"});
  res.statusCode=500;
  res.end(data);
  }break;

case '/author':
// Peticion raiz
// Estableciendo cabeceras
try {
  const me = path.join(__dirname, './views/author.html');
  const data = await fs.readFile(me);
  res.writeHead(200, {"Content-Type": "text/html"});
  res.statusCode=200;
  res.end(data);
}  catch (err) {
  console.error(err);
  const data = await fs.readFile(error500);
  res.writeHead(500, {"Content-Type": "text/html"});
  res.statusCode=500;
  res.end(data);
  }break;

case "/favicon.ico":
// Especificar la ubicación del archivo de icono
const faviconPath = path.join(__dirname, 'favicon.ico');
try {
const data = await fs.readFile(faviconPath);
res.writeHead(200, { 'Content-Type': 'image/x-icon' });
res.end(data);
} catch (err) {
console.error(err);
// Peticion raiz
// Estableciendo cabeceras
res.setHeader('Content-Type', 'text/html');
// Escribiendo la respuest
console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
console.log(`📣 Error: 500 ${err.method}`);
// Estableciendo codigo de respuesta
res.statusCode = 500;
// Cerrando la comunicacion
res.end();
}break;

case "/message":
// Verificando si es post
if (method === "POST") {
// Se crea una variable para almacenar los
// Datos entrantes del cliente
let body = "";
// Se registra un manejador de eventos
// Para la recepción de datos
req.on("data", (data => {
body += data;
if (body.length > 1e6) return req.socket.destroy();
}));
// Se registra una manejador de eventos
// para el termino de recepción de datos
req.on("end", async() => {
// Procesa el formulario
// Mediante URLSearchParams se extraen
// los campos del formulario
const params = new URLSearchParams(body);
// Se construye un objeto a partir de los datos
// en la variable params
const parsedParams = Object.fromEntries(params);
// almacenar el mensaje en un archivo.
fs.writeFile('message.txt', parsedParams.message);
// Establecer un codigo de respuesta
// Para redireccionamiento
res.statusCode = 302;
// Estableciendo el redireccionamiento
res.setHeader('Location', 'https://www.gamadero.tecnm.mx');

// Se finaliza la conexion
return res.end();
})
} else {
res.statusCode = 404;
res.write("404: Endpoint no encontrado")
res.end();
}
break;
// Continua con el defautl
default:
// Peticion raiz
// Estableciendo cabeceras
// Escribiendo la respuesta
try {
  const default404 = path.join(__dirname, './views/404.html');
  const data = await fs.readFile(default404);
  res.writeHead(404, {"Content-Type": "text/html"});
  res.statusCode=404;
  res.end(data);
}  catch (err) {
  console.error(err);
  const data = await fs.readFile(error500);
  res.writeHead(500, {"Content-Type": "text/html"});
  res.statusCode=500;
  res.end(data);
  }break;
}
}