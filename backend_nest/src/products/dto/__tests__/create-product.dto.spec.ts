import { validate } from 'class-validator';
import { CreateProductDto } from '../create-product.dto';

describe('CreateProductDto', () => {
  it('should validate a valid product DTO', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 'Producto de prueba';
    createProductDto.precio = 99.99;
    createProductDto.stock = 10;
    createProductDto.descripcion = 'Descripción del producto';
    createProductDto.imagen = 'https://example.com/image.jpg';

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(0);
  });

  it('should validate product with only required fields', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 'Producto de prueba';
    createProductDto.precio = 99.99;
    createProductDto.stock = 10;

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(0);
  });

  it('should reject empty nombre', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = '';
    createProductDto.precio = 99.99;
    createProductDto.stock = 10;

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('nombre');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should reject negative precio', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 'Producto de prueba';
    createProductDto.precio = -10;
    createProductDto.stock = 10;

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('precio');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should reject zero precio', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 'Producto de prueba';
    createProductDto.precio = 0;
    createProductDto.stock = 10;

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('precio');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should reject negative stock', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 'Producto de prueba';
    createProductDto.precio = 99.99;
    createProductDto.stock = -5;

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('stock');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should reject zero stock', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 'Producto de prueba';
    createProductDto.precio = 99.99;
    createProductDto.stock = 0;

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('stock');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should reject non-string nombre', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 123 as any;
    createProductDto.precio = 99.99;
    createProductDto.stock = 10;

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('nombre');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should reject non-number precio', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 'Producto de prueba';
    createProductDto.precio = '99.99' as any;
    createProductDto.stock = 10;

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('precio');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should reject non-number stock', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 'Producto de prueba';
    createProductDto.precio = 99.99;
    createProductDto.stock = '10' as any;

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('stock');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should accept optional fields as undefined', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 'Producto de prueba';
    createProductDto.precio = 99.99;
    createProductDto.stock = 10;
    createProductDto.descripcion = undefined;
    createProductDto.imagen = undefined;

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(0);
  });

  it('should accept optional fields as empty strings', async () => {
    const createProductDto = new CreateProductDto();
    createProductDto.nombre = 'Producto de prueba';
    createProductDto.precio = 99.99;
    createProductDto.stock = 10;
    createProductDto.descripcion = '';
    createProductDto.imagen = '';

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(0);
  });

  it('should reject missing required fields', async () => {
    const createProductDto = new CreateProductDto();

    const errors = await validate(createProductDto);
    expect(errors).toHaveLength(3); // nombre, precio, stock
    expect(errors.map(e => e.property)).toContain('nombre');
    expect(errors.map(e => e.property)).toContain('precio');
    expect(errors.map(e => e.property)).toContain('stock');
  });
});
