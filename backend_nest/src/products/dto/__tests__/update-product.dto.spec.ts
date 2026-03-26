import { validate } from 'class-validator';
import { UpdateProductDto } from '../update-product.dto';

describe('UpdateProductDto', () => {
  it('should validate partial update with nombre', async () => {
    const updateProductDto = new UpdateProductDto();
    updateProductDto.nombre = 'Producto actualizado';

    const errors = await validate(updateProductDto);
    expect(errors).toHaveLength(0);
  });

  it('should validate partial update with precio', async () => {
    const updateProductDto = new UpdateProductDto();
    updateProductDto.precio = 149.99;

    const errors = await validate(updateProductDto);
    expect(errors).toHaveLength(0);
  });

  it('should validate partial update with stock', async () => {
    const updateProductDto = new UpdateProductDto();
    updateProductDto.stock = 25;

    const errors = await validate(updateProductDto);
    expect(errors).toHaveLength(0);
  });

  it('should validate partial update with optional fields', async () => {
    const updateProductDto = new UpdateProductDto();
    updateProductDto.descripcion = 'Nueva descripción';
    updateProductDto.imagen = 'https://example.com/new-image.jpg';

    const errors = await validate(updateProductDto);
    expect(errors).toHaveLength(0);
  });

  it('should validate complete update', async () => {
    const updateProductDto = new UpdateProductDto();
    updateProductDto.nombre = 'Producto completamente actualizado';
    updateProductDto.precio = 199.99;
    updateProductDto.stock = 50;
    updateProductDto.descripcion = 'Descripción completa actualizada';
    updateProductDto.imagen = 'https://example.com/complete-image.jpg';

    const errors = await validate(updateProductDto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid nombre in partial update', async () => {
    const updateProductDto = new UpdateProductDto();
    updateProductDto.nombre = '';

    const errors = await validate(updateProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('nombre');
  });

  it('should reject negative precio in partial update', async () => {
    const updateProductDto = new UpdateProductDto();
    updateProductDto.precio = -10;

    const errors = await validate(updateProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('precio');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should reject negative stock in partial update', async () => {
    const updateProductDto = new UpdateProductDto();
    updateProductDto.stock = -5;

    const errors = await validate(updateProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('stock');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should accept empty object', async () => {
    const updateProductDto = new UpdateProductDto();

    const errors = await validate(updateProductDto);
    expect(errors).toHaveLength(0);
  });

  it('should validate mixed valid and invalid fields', async () => {
    const updateProductDto = new UpdateProductDto();
    updateProductDto.nombre = 'Producto válido';
    updateProductDto.precio = -10; // inválido
    updateProductDto.stock = 15; // válido
    updateProductDto.descripcion = 'Descripción válida';

    const errors = await validate(updateProductDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('precio');
    expect(errors[0].constraints).toHaveProperty('min');
  });
});
