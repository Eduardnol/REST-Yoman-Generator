# generator-spring-rest-api

[![npm version](https://badge.fury.io/js/generator-spring-rest-api.svg)](https://badge.fury.io/js/generator-spring-rest-api)

> Generador Yeoman para crear automáticamente APIs REST para Spring Boot siguiendo el patrón de SectorAPI.

## 📋 Requisitos previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Yeoman

## 🚀 Instalación

### Opción rápida
> Ejecuta `install.sh`

### Opción manual
1. Instala Yeoman globalmente si no lo tienes:
```bash
npm install -g yo
```

2. Instala las dependencias del generador:
```bash
npm install
```

3. Enlaza el generador localmente:
```bash
npm link
```

## 📖 Uso

Desde la raíz del proyecto Spring Boot donde quieras generar los archivos, ejecuta:

```bash
yo spring-rest-api
```

El generador te pedirá la siguiente información:

- **Nombre de la entidad**: Por ejemplo, `Producto`, `Cliente`, `Usuario` (debe empezar con mayúscula)
- **Nombre de la tabla**: Por defecto será `in_<entidad_lowercase>`
- **Nombre de la columna ID**: Por defecto será `id_<entidad_lowercase>`
- **Nombre de la secuencia**: Por defecto será `<tabla>_<id>_seq`
- **Paquete base**: Por defecto `com.acme.application`
- **Esquema de base de datos**: Por defecto `acme_schema`
- **¿Incluir endpoint combo?**: Por defecto `Sí`

## 📁 Archivos generados

El generador creará 8 archivos siguiendo el patrón de SectorAPI:

1. **Entity**: `src/main/java/.../repository/entity/{Entity}Entity.java`
2. **DTO**: `src/main/java/.../controller/dto/{Entity}DTO.java`
3. **Repository**: `src/main/java/.../repository/{Entity}Repository.java`
4. **Mapper**: `src/main/java/.../controller/mappers/{Entity}Mapper.java`
5. **Service Interface**: `src/main/java/.../domain/{Entity}Service.java`
6. **Service Implementation**: `src/main/java/.../domain/impl/{Entity}ServiceImpl.java`
7. **API Interface**: `src/main/java/.../controller/{Entity}API.java`
8. **Controller**: `src/main/java/.../controller/impl/{Entity}Controller.java`

## 🎯 Ejemplo

Para una entidad llamada `Producto`:

```bash
yo spring-rest-api
? ¿Cuál es el nombre de la entidad? Producto
? ¿Cuál es el nombre de la tabla en la base de datos? in_producto
? ¿Cuál es el nombre de la columna ID? id_producto
? ¿Cuál es el nombre de la secuencia? in_producto_id_producto_seq
? Paquete base: com.acme.application
? Esquema de la base de datos: acme_schema
? ¿Incluir endpoint para combo? Yes
```

Esto generará:
- Endpoint: `/api/v1/producto/combo`
- Todos los archivos necesarios para la API REST

## ⚠️ Notas importantes

1. Los archivos generados tienen una estructura básica con solo el campo `nom`
2. Deberás ajustar los campos adicionales según tus necesidades
3. No olvides crear la migración de base de datos correspondiente
4. Ejecuta los tests después de generar los archivos

## 🛠️ Estructura del generador

```
generator-spring-rest-api/
├── package.json
├── README.md
├── __tests__/
│   └── app.test.js
└── generators/
    └── app/
        ├── index.js
        └── templates/
            ├── BaseEntityMapper.java.ejs
            ├── EntityEntity.java.ejs
            ├── EntityDTO.java.ejs
            ├── EntityRepository.java.ejs
            ├── EntityMapper.java.ejs
            ├── EntityService.java.ejs
            ├── EntityServiceImpl.java.ejs
            ├── EntityAPI.java.ejs
            └── EntityController.java.ejs
```

## 🧪 Testing

Para ejecutar los tests:

```bash
npm test
```

## 📝 Personalización

Puedes modificar las plantillas `.ejs` en `generators/app/templates/` para ajustar el código generado según tus necesidades.

Las plantillas usan la sintaxis EJS:
- `<%= variable %>`: Imprime el valor de la variable
- `<% if (condition) { %>....<% } %>`: Condicionales
- Variables disponibles: `entityName`, `entityNameLower`, `entityNameFirstLower`, `packageName`, `tableName`, etc.

## 📄 Licencia

MIT

