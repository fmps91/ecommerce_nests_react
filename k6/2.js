import http from 'k6/http';
import { check, sleep } from 'k6';

/* export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Sube a 20 usuarios en 30s
    { duration: '1m', target: 20 },   // Mantiene 20 usuarios por 1 minuto
    { duration: '30s', target: 0 },   // Reduce a 0 en 30s
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // Menos del 1% de errores
    http_req_duration: ['p(99)<1000'], // 99% de peticiones < 1s
  },
}; */

export default function () {

  const payload = JSON.stringify({
    "nombre": "Monitor 42K",
    "precio": 1199.99,
    "stock": 20,
    "descripcion": "Monitor de 27 pulgadas, resolución 4K, panel IPS, 60Hz",
    "imagen": null
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };


  const url='http://host.docker.internal:3000/api/v1/products';

  const res = http.post(url, payload, params);


  check(res, {
    'status es 200': (r) => r.status === 200 || r.status === 201,
    'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}