# Tests del Módulo Database

Este directorio contiene los tests para verificar que el módulo de base de datos está funcionando correctamente.

## Archivos de Tests

### 1. `database.providers.spec.ts`
Tests unitarios para los providers de la base de datos:
- Verifica la configuración del provider SEQUELIZE
- Testea la configuración de SSL
- Valida la configuración de logging según el entorno
- Prueba la creación de instancia de Sequelize

### 2. `database.integration.spec.ts`
Tests de integración que verifican:
- Importación correcta del módulo
- Configuración de variables de entorno
- Conexión a la base de datos (si está disponible)
- Registro de modelos

### 3. `database.module.spec.ts`
Tests completos del módulo que incluyen:
- Conexión real a la base de datos
- Verificación de modelos registrados
- Ejecución de consultas simples
- Verificación de tablas sincronizadas

## Ejecutar Tests

### Todos los tests del módulo database:
```bash
npm run test:database
```

### Tests en modo watch:
```bash
npm run test:database:watch
```

### Tests con coverage:
```bash
npm run test:database:coverage
```

## Configuración Requerida

Para ejecutar los tests de integración, necesitas tener configuradas las siguientes variables de entorno:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_base_de_datos
DB_SSL=false
NODE_ENV=test
```

## Tipos de Tests

1. **Unitarios**: No requieren conexión a la base de datos
2. **Integración**: Pueden requerir conexión pero son tolerantes a fallos
3. **E2E**: Requieren conexión completa a la base de datos

## Cobertura

Los tests cubren:
- ✅ Configuración del provider
- ✅ Manejo de variables de entorno
- ✅ Creación de instancia de Sequelize
- ✅ Registro de modelos
- ✅ Conexión y autenticación
- ✅ Sincronización de modelos
- ✅ Manejo de errores

## Notas

- Los tests están diseñados para funcionar en entornos CI/CD
- Los tests de integración son tolerantes a la falta de conexión a BD
- Se limpian correctamente las conexiones después de cada test
- Se usan mocks para evitar efectos secundarios en los tests unitarios
