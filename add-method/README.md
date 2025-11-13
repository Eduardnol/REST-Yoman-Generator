# Generador Add Method

Este sub-generador permite añadir nuevos métodos/endpoints a entidades existentes de forma automatizada.

## Uso

Para ejecutar el generador desde el directorio raíz del proyecto:

```bash
yo ./generators/add-method
```

O si has instalado el generador globalmente:

```bash
yo folder:add-method
```

## Flujo del Generador

El generador te hará las siguientes preguntas:

1. **Nombre de la entidad existente**: Por ejemplo, `Substancia`, `Empresa`, `Hipotesi`

2. **Paquete base**: El paquete raíz de tu aplicación (ej: `com.acme.project`)

3. **Nombre del método**: Debe ser camelCase, por ejemplo:
   - `getEstablimentsBySubstanciaId`
   - `searchSubstancias`

4. **Tipo de llamada HTTP**: GET, POST, PUT o DELETE

5. **¿Usa paginación?**: Si el método retorna resultados paginados

6. **Ruta del endpoint**: La ruta relativa, por ejemplo:
   - `/{id}/establiments`
   - `/search`
   - `/{id}/hipotesis`

7. **Parámetros de path**: Separados por coma (ej: `id`, `id,tipo`)

8. **DTO de entrada**: Solo para POST y PUT. El nombre del DTO que se recibe en el body (ej: `SubstanciaFilterDTO`)

9. **DTO de salida**: El DTO que se retorna (ej: `EstablimentTaulaSubstanciaDTO`)

10. **¿Es solo lectura?**: Para operaciones GET/POST de consulta, añade `@Transactional(readOnly = true)`

11. **Descripción del método**: Para la documentación Swagger

## Archivos Modificados

El generador actualiza automáticamente 4 archivos:

1. **`{Entity}API.java`**: Añade la firma del método en la interfaz de la API
2. **`{Entity}Controller.java`**: Implementa el método con las anotaciones HTTP correctas
3. **`{Entity}Service.java`**: Añade la firma del método en la interfaz del servicio
4. **`{Entity}ServiceImpl.java`**: Añade el esqueleto del método con un TODO para implementar

## Ejemplo de Uso

### Ejemplo 1: Endpoint GET con paginación

```
Nombre de la entidad: Substancia
Nombre del método: getEstablimentsBySubstanciaId
Tipo HTTP: POST
Usa paginación: Sí
Ruta: /{id}/establiments
Parámetros path: id
DTO entrada: (vacío)
DTO salida: EstablimentTaulaSubstanciaDTO
Solo lectura: Sí
```

Genera:
```
POST /api/v1/substancia/{id}/establiments
```

### Ejemplo 2: Endpoint POST con búsqueda

```
Nombre de la entidad: Substancia
Nombre del método: searchSubstancias
Tipo HTTP: POST
Usa paginación: Sí
Ruta: /search
Parámetros path: (vacío)
DTO entrada: SubstanciaFilterDTO
DTO salida: SubstanciaDTO
Solo lectura: Sí
```

Genera:
```
POST /api/v1/substancia/search
```

### Ejemplo 3: Endpoint DELETE

```
Nombre de la entidad: Substancia
Nombre del método: deleteSubstancia
Tipo HTTP: DELETE
Usa paginación: No
Ruta: /{id}
Parámetros path: id
```

Genera:
```
DELETE /api/v1/substancia/{id}
```

## Qué hace el generador

### En la API Interface:
- Añade anotaciones Swagger (`@Operation`, `@ApiResponses`)
- Añade parámetros con `@Parameter`
- Define el tipo de retorno correcto (`ResponseEntity<DTO>` o `ResponseEntity<ResponsePage<DTO>>`)

### En el Controller:
- Añade la anotación HTTP correcta (`@GetMapping`, `@PostMapping`, etc.)
- Maneja parámetros de path con `@PathVariable`
- Maneja paginación con `@RequestParam` y valores por defecto de `Constants`
- Llama al servicio y envuelve la respuesta con `ResponseUtil`

### En el Service Interface:
- Define la firma del método con tipos Java puros
- Usa `Pageable` para paginación
- Usa `Page<DTO>` como retorno para endpoints paginados

### En el Service Implementation:
- Añade `@Transactional(readOnly = true)` si es necesario
- Añade log de debug
- Crea el esqueleto del método con un `TODO: Implementar la lógica del método`
- Retorna `null` o vacío para que puedas implementar la lógica

## Después de Generar

1. **Implementar la lógica**: Busca el `TODO` en el ServiceImpl y añade tu lógica de negocio
2. **Revisar imports**: Asegúrate de que todos los DTOs y dependencias estén importados
3. **Ejecutar tests**: Verifica que la aplicación compile y funcione correctamente
4. **Ajustar validaciones**: Añade validaciones adicionales si es necesario

## Notas

- El generador NO sobrescribe código existente, solo añade nuevo código al final de cada clase
- Debes tener las entidades ya creadas (puedes usar el generador principal `yo ./generators/app`)
- Los DTOs deben existir previamente
- El generador asume una estructura de proyecto Spring Boot estándar

