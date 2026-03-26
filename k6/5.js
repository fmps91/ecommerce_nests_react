import http from 'k6/http';
import { check, sleep } from 'k6';

const data = JSON.parse(open('./3.json'));
const rols = data.productos;

export const options = {
  vus: 1,  // Un solo usuario virtual para controlar el orden
  iterations: productos.length, // Una iteración por cada producto
};

export default function () {
  // Usar __ITER que es el número de iteración actual (0-index)
  const producto = productos[__ITER % productos.length];
  
  console.log(`\n📦 Iteración ${__ITER + 1}/${productos.length}`);
  console.log(`Producto: ${producto.nombre}`);
  console.log(`Precio: $${producto.precio}`);
  console.log(`Stock: ${producto.stock}`);
  
  const payload = JSON.stringify({
    nombre: producto.nombre,
    precio: producto.precio,
    stock: producto.stock,
    descripcion: producto.descripcion,
    imagen: producto.imagen
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const url = 'http://host.docker.internal:3000/api/v1/products';
  const res = http.post(url, payload, params);
  
  check(res, {
    'status es 200 o 201': (r) => r.status === 200 || r.status === 201,
  });
  
  console.log(`Respuesta: ${res.status} - Tiempo: ${res.timings.duration}ms`);
  
  sleep(1);
}