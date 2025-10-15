# Ejemplo de uso del generador

## Caso 1: Generar API para entidad "Producto"

```bash
yo spring-rest-api

# Responde las preguntas:
# ¿Cuál es el nombre de la entidad? Producto
# ¿Cuál es el nombre de la tabla en la base de datos? in_producto
# ¿Cuál es el nombre de la columna ID? id_producto
# ¿Cuál es el nombre de la secuencia? in_producto_id_producto_seq
# Paquete base: com.acme.application
# Esquema de la base de datos: acme_schema
# ¿Incluir endpoint para combo? Yes
```

## Caso 2: Generar API para entidad "Cliente"

```bash
yo spring-rest-api

# Responde las preguntas:
# ¿Cuál es el nombre de la entidad? Cliente
# ¿Cuál es el nombre de la tabla en la base de datos? in_cliente
# ¿Cuál es el nombre de la columna ID? id_cliente
# ¿Cuál es el nombre de la secuencia? in_cliente_id_cliente_seq
# Paquete base: com.acme.application
# Esquema de la base de datos: acme_schema
# ¿Incluir endpoint para combo? Yes
```

## Resultado esperado

Después de ejecutar el generador, tendrás:

✅ 8 archivos generados automáticamente
✅ Código siguiendo el patrón de SectorAPI
✅ Endpoint REST en `/api/v1/{entidad}/combo`
✅ Toda la estructura: Entity, DTO, Repository, Mapper, Service, Controller

## Próximos pasos

1. Revisa los archivos generados
2. Ajusta los campos de la entidad según necesites
3. Crea la migración de base de datos
4. Ejecuta los tests
5. ¡Listo para usar!

