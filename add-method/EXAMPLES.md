# Ejemplo Práctico - Add Method Generator

Este documento muestra ejemplos prácticos basados en la entidad `Substancia` del proyecto.

## Caso de Uso 1: Obtener Establecimientos por Substancia

Este es el caso del método `getEstablimentsBySubstanciaId` que existe en SubstanciaController.

### Comando
```bash
yo ./generators/add-method
```

### Respuestas al Generador
```
? ¿Nombre de la entidad existente? Substancia
? Paquete base: com.acme.project
? ¿Nombre del método? getEstablimentsBySubstanciaId
? ¿Tipo de llamada HTTP? POST
? ¿El método usa paginación? Yes
? ¿Ruta del endpoint? /{id}/establiments
? ¿Parámetros de path? id
? ¿DTO de entrada? (presionar Enter - sin DTO de entrada)
? ¿DTO de salida? EstablimentTaulaSubstanciaDTO
? ¿Es una operación de solo lectura? Yes
? ¿Descripción del método para Swagger? Obtiene los establecimientos asociados a una substancia
```

### Código Generado

**SubstanciaAPI.java** - Se añade:
```java
@Operation(
    summary = "Obtiene los establecimientos asociados a una substancia",
    description = "Obtiene los establecimientos asociados a una substancia")
@ApiResponses({
  @ApiResponse(responseCode = "200", description = "Éxito"),
  @ApiResponse(responseCode = "404", description = "No encontrado")
})
ResponseEntity<ResponsePage<EstablimentTaulaSubstanciaDTO>> getEstablimentsBySubstanciaId(
    @Parameter(description = "Parámetro id") Integer id,
    @Parameter(description = "Número de página") int page,
    @Parameter(description = "Registros por página") int rpp,
    @Parameter(description = "Campo de ordenación") String active,
    @Parameter(description = "Dirección de ordenación") String direction);
```

**SubstanciaController.java** - Se añade:
```java
@PostMapping("/{id}/establiments")
@Override
public ResponseEntity<ResponsePage<EstablimentTaulaSubstanciaDTO>> getEstablimentsBySubstanciaId(
    @PathVariable Integer id,
    @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUM) final int page,
    @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) final int rpp,
    @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) final String active,
    @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) final String direction) {
  Page<EstablimentTaulaSubstanciaDTO> page = substanciaService.getEstablimentsBySubstanciaId(
      id,
      PageRequest.of(page, rpp, Sort.by(Sort.Direction.fromString(direction), active)));
  return ResponseUtil.wrapListOrNoContent(page.getContent(), page.getNumber(), page.getSize());
}
```

**SubstanciaService.java** - Se añade:
```java
Page<EstablimentTaulaSubstanciaDTO> getEstablimentsBySubstanciaId(Integer id, Pageable pageable);
```

**SubstanciaServiceImpl.java** - Se añade:
```java
@Transactional(readOnly = true)
@Override
public Page<EstablimentTaulaSubstanciaDTO> getEstablimentsBySubstanciaId(
    Integer id, Pageable pageable) {
  log.debug("Request to getEstablimentsBySubstanciaId");
  // TODO: Implementar la lógica del método
  return null;
}
```

### Implementación Manual Requerida

Después de generar, edita `SubstanciaServiceImpl.java` y reemplaza el TODO con:

```java
@Transactional(readOnly = true)
@Override
public Page<EstablimentTaulaSubstanciaDTO> getEstablimentsBySubstanciaId(
    Integer id, Pageable pageable) {
  log.debug("Request to get EstablimentTaulaSubstancia by Substancia id: {}", id);
  return establimentIndustrialSubstanciaRepository
      .findByIdSubstancia_Id(id, pageable)
      .map(substanciaMapper::toEstablimentTaulaSubstanciaDto);
}
```

---

## Caso de Uso 2: Buscar Substancias con Filtros

### Comando
```bash
yo ./generators/add-method
```

### Respuestas al Generador
```
? ¿Nombre de la entidad existente? Substancia
? Paquete base: com.acme.project
? ¿Nombre del método? searchSubstancias
? ¿Tipo de llamada HTTP? POST
? ¿El método usa paginación? Yes
? ¿Ruta del endpoint? /search
? ¿Parámetros de path? (presionar Enter - sin parámetros)
? ¿DTO de entrada? SubstanciaFilterDTO
? ¿DTO de salida? SubstanciaDTO
? ¿Es una operación de solo lectura? Yes
? ¿Descripción del método para Swagger? Busca substancias aplicando filtros
```

### Código Generado

**SubstanciaAPI.java** - Se añade:
```java
@Operation(
    summary = "Busca substancias aplicando filtros",
    description = "Busca substancias aplicando filtros")
@ApiResponses({
  @ApiResponse(responseCode = "200", description = "Éxito"),
  @ApiResponse(responseCode = "404", description = "No encontrado")
})
ResponseEntity<ResponsePage<SubstanciaDTO>> searchSubstancias(
    @RequestBody(required = false) SubstanciaFilterDTO substanciaFilterDTO,
    @Parameter(description = "Número de página") int page,
    @Parameter(description = "Registros por página") int rpp,
    @Parameter(description = "Campo de ordenación") String active,
    @Parameter(description = "Dirección de ordenación") String direction);
```

### Implementación Manual Requerida

```java
@Transactional(readOnly = true)
@Override
public Page<SubstanciaDTO> searchSubstancias(
    SubstanciaFilterDTO filter, Pageable pageable) {
  log.debug("Request to search all Substancias");
  return substanciaRepository
      .findAll(SubstanciaSpecification.filter(filter), pageable)
      .map(substanciaMapper::toDto);
}
```

---

## Caso de Uso 3: Eliminar una Substancia

### Comando
```bash
yo ./generators/add-method
```

### Respuestas al Generador
```
? ¿Nombre de la entidad existente? Substancia
? Paquete base: com.acme.project
? ¿Nombre del método? deleteSubstancia
? ¿Tipo de llamada HTTP? DELETE
? ¿El método usa paginación? No
? ¿Ruta del endpoint? /{id}
? ¿Parámetros de path? id
? ¿Descripción del método para Swagger? Elimina una substancia por su ID
```

### Código Generado

**SubstanciaAPI.java** - Se añade:
```java
@Operation(
    summary = "Elimina una substancia por su ID",
    description = "Elimina una substancia por su ID")
@ApiResponses({
  @ApiResponse(responseCode = "200", description = "Éxito"),
  @ApiResponse(responseCode = "404", description = "No encontrado")
})
ResponseEntity<Void> deleteSubstancia(@Parameter(description = "Parámetro id") Integer id);
```

**SubstanciaController.java** - Se añade:
```java
@DeleteMapping("/{id}")
@Override
public ResponseEntity<Void> deleteSubstancia(@PathVariable Integer id) {
  substanciaService.deleteSubstancia(id);
  return ResponseEntity.noContent().build();
}
```

### Implementación Manual Requerida

```java
@Override
public void deleteSubstancia(Long id) {
  log.debug("Request to delete Substancia by id: {}", id);
  if (!substanciaRepository.existsById(id)) {
    throw new RuntimeException("Substancia not found");
  }
  substanciaRepository.deleteById(id);
}
```

---

## Caso de Uso 4: Obtener Substancia por ID (sin paginación)

### Comando
```bash
yo ./generators/add-method
```

### Respuestas al Generador
```
? ¿Nombre de la entidad existente? Substancia
? Paquete base: com.acme.project
? ¿Nombre del método? getSubstanciaById
? ¿Tipo de llamada HTTP? GET
? ¿El método usa paginación? No
? ¿Ruta del endpoint? /{id}
? ¿Parámetros de path? id
? ¿DTO de salida? SubstanciaDTO
? ¿Es una operación de solo lectura? Yes
? ¿Descripción del método para Swagger? Obtiene una substancia por su ID
```

### Código Generado

**SubstanciaAPI.java** - Se añade:
```java
@Operation(
    summary = "Obtiene una substancia por su ID",
    description = "Obtiene una substancia por su ID")
@ApiResponses({
  @ApiResponse(responseCode = "200", description = "Éxito"),
  @ApiResponse(responseCode = "404", description = "No encontrado")
})
ResponseEntity<SubstanciaDTO> getSubstanciaById(
    @Parameter(description = "Parámetro id") Integer id);
```

**SubstanciaController.java** - Se añade:
```java
@GetMapping("/{id}")
@Override
public ResponseEntity<SubstanciaDTO> getSubstanciaById(@PathVariable Integer id) {
  return ResponseEntity.ok(substanciaService.getSubstanciaById(id));
}
```

**SubstanciaService.java** - Se añade:
```java
SubstanciaDTO getSubstanciaById(Integer id);
```

### Implementación Manual Requerida

```java
@Transactional(readOnly = true)
@Override
public SubstanciaDTO getSubstanciaById(Long id) {
  log.debug("Request to get Substancia by id: {}", id);
  return substanciaRepository.findById(id)
      .map(substanciaMapper::toDto)
      .orElseThrow(() -> new RuntimeException("Substancia not found"));
}
```

---

## Tips y Mejores Prácticas

1. **Nombres de métodos**: Usa nombres descriptivos y sigue el patrón:
   - `get{Entity}By{Criteria}` para consultas
   - `search{Entity}` para búsquedas con filtros
   - `create{Entity}` para crear
   - `update{Entity}` para actualizar
   - `delete{Entity}` para eliminar

2. **Paginación**: Úsala siempre que esperes retornar múltiples resultados

3. **DTOs de entrada**: Crea DTOs específicos para filtros (ej: `{Entity}FilterDTO`)

4. **Validaciones**: Después de generar el código, añade validaciones apropiadas en el ServiceImpl

5. **Manejo de errores**: Usa excepciones personalizadas en lugar de `RuntimeException`

6. **Logs**: El generador añade logs debug, pero puedes añadir más niveles según necesites

7. **Transacciones**: 
   - Usa `@Transactional(readOnly = true)` para consultas
   - Usa `@Transactional` sin parámetros para operaciones de escritura

