import http from 'k6/http';
import { check, sleep } from 'k6';

// Cargar datos del archivo JSON
const data = JSON.parse(open('./4.json'));
const productos = data.productos; // Acceder al array de productos

export const options = {
  vus: 1,                    // 1 usuario virtual
  //duration: '30s',           // Duración de la prueba
  iterations: 10,            // Cada VU ejecuta 10 iteraciones (total 1 peticiones)
};

export default function () {
  // Seleccionar un producto aleatorio del array
  const randomIndex = Math.floor(Math.random() * productos.length);
  const producto = productos[randomIndex];
  
  // Preparar el payload con los datos del producto
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
  
  // Enviar petición POST
  const res = http.post(url, payload, params);
  
  // Verificar respuesta
  check(res, {
    'status es 200 o 201': (r) => r.status === 200 || r.status === 201,
    //'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500,
  });
  
  if (!success) {
    console.log(`❌ Error en producto ${producto.nombre}: Status ${res.status}`);
  } else {
    console.log(`✅ Producto ${producto.nombre} creado exitosamente - Tiempo: ${res.timings.duration}ms`);
  }
  
  // Pequeña pausa entre iteraciones
  sleep(1);
}

// Función de configuración inicial (opcional)
export function setup() {
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 INICIANDO PRUEBA DE PRODUCTOS`);
  console.log(`📦 Total productos cargados: ${productos.length}`);
  console.log('='.repeat(60) + '\n');
  
  // Mostrar lista de productos a probar
  productos.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.nombre} - $${p.precio} (Stock: ${p.stock})`);
  });
  console.log('\n' + '='.repeat(60) + '\n');
  
  return { startTime: new Date().toISOString() };
}

// Función de limpieza final (opcional)
export function teardown(data) {
  console.log('\n' + '='.repeat(60));
  console.log(`✅ PRUEBA FINALIZADA`);
  console.log(`⏰ Inicio: ${data.startTime}`);
  console.log(`⏰ Final: ${new Date().toISOString()}`);
  console.log('='.repeat(60));
}