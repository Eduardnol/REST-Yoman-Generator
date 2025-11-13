# Generador de API REST - Spring Boot

Generador Yeoman para crear automáticamente APIs REST siguiendo el patrón de SectorAPI.

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

2. Ve a la carpeta del generador:
```bash
cd generators
```

3. Instala las dependencias:
```bash
npm install
```

4. Enlaza el generador localmente:
```bash
npm link
```

## 📖 Uso

Desde la raíz del proyecto, ejecuta:

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
generators/
├── package.json
├── README.md
├── install.sh
├── app/
│   ├── index.js
│   └── templates/
└── add-method/
    ├── index.js
    └── README.md
```

## 🔧 Sub-generadores

### Add Method

Permite añadir nuevos métodos/endpoints a entidades existentes.

**Uso:**
```bash
yo ./generators/add-method
```

Este sub-generador te permite:
- Añadir nuevos endpoints a entidades existentes
- Elegir el tipo HTTP (GET, POST, PUT, DELETE)
- Configurar paginación
- Definir DTOs de entrada y salida
- Generar automáticamente el código en API, Controller, Service y ServiceImpl

Ver [documentación completa del add-method](./add-method/README.md)
