import http from 'k6/http';
import { check, sleep } from 'k6';

/* export const options = {
  vus: 10,              // 10 usuarios virtuales
  duration: '30s',      // Durante 30 segundos
  thresholds: {
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones < 500ms
  },
}; */

export default function () {

  // Cambia localhost por host.docker.internal
  //ejemplo de la url de mi app
  //http://localhost:3000/api/v1/products
  //ahora como estamos haciendo con docker la url cambia a:
  //http://host.docker.internal:3000/api/v1/products

  const url = 'http://host.docker.internal:3000/api/v1/app';
  const res = http.get(url);

  check(res, {
    'status es 200': (r) => r.status === 200,
    'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}