const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-spring-rest-api:app', () => {
  describe('generates Spring Boot REST API files', () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          entityName: 'Producto',
          tableName: 'in_producto',
          idColumnName: 'id_producto',
          sequenceName: 'in_producto_id_producto_seq',
          packageName: 'com.acme.application',
          schema: 'acme_schema',
          includeCombo: true
        });
    });

    it('creates entity file', () => {
      assert.file(['src/main/java/com/acme/application/repository/entity/ProductoEntity.java']);
    });

    it('creates DTO file', () => {
      assert.file(['src/main/java/com/acme/application/controller/dto/ProductoDTO.java']);
    });

    it('creates repository file', () => {
      assert.file(['src/main/java/com/acme/application/repository/ProductoRepository.java']);
    });

    it('creates mapper file', () => {
      assert.file(['src/main/java/com/acme/application/controller/mappers/ProductoMapper.java']);
    });

    it('creates service interface file', () => {
      assert.file(['src/main/java/com/acme/application/domain/ProductoService.java']);
    });

    it('creates service implementation file', () => {
      assert.file(['src/main/java/com/acme/application/domain/impl/ProductoServiceImpl.java']);
    });

    it('creates API interface file', () => {
      assert.file(['src/main/java/com/acme/application/controller/ProductoAPI.java']);
    });

    it('creates controller file', () => {
      assert.file(['src/main/java/com/acme/application/controller/impl/ProductoController.java']);
    });

    it('creates base entity mapper file', () => {
      assert.file(['src/main/java/com/acme/application/controller/mappers/EntityMapper.java']);
    });
  });

  describe('generates content correctly', () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          entityName: 'Cliente',
          tableName: 'in_cliente',
          idColumnName: 'id_cliente',
          sequenceName: 'in_cliente_id_cliente_seq',
          packageName: 'com.example.myapp',
          schema: 'example_schema',
          includeCombo: false
        });
    });

    it('entity contains correct package name', () => {
      assert.fileContent(
        'src/main/java/com/example/myapp/repository/entity/ClienteEntity.java',
        'package com.example.myapp.repository.entity;'
      );
    });

    it('entity contains correct table name', () => {
      assert.fileContent(
        'src/main/java/com/example/myapp/repository/entity/ClienteEntity.java',
        '@Table(name = "in_cliente", schema = "example_schema")'
      );
    });

    it('entity contains correct entity name', () => {
      assert.fileContent(
        'src/main/java/com/example/myapp/repository/entity/ClienteEntity.java',
        'public class ClienteEntity'
      );
    });

    it('DTO contains correct entity name', () => {
      assert.fileContent(
        'src/main/java/com/example/myapp/controller/dto/ClienteDTO.java',
        'public class ClienteDTO'
      );
    });
  });

  describe('validates entity name input', () => {
    it('rejects empty entity name', () => {
      const Generator = require('../generators/app');
      const prompts = [
        {
          type: 'input',
          name: 'entityName',
          validate: input => {
            if (input.length === 0) {
              return 'El nombre de la entidad es requerido';
            }
            if (!/^[A-Z][a-zA-Z]*$/.test(input)) {
              return 'El nombre debe empezar con mayúscula y contener solo letras';
            }
            return true;
          }
        }
      ];

      const validateFn = prompts[0].validate;
      expect(validateFn('')).toBe('El nombre de la entidad es requerido');
      expect(validateFn('producto')).toBe('El nombre debe empezar con mayúscula y contener solo letras');
      expect(validateFn('Producto123')).toBe('El nombre debe empezar con mayúscula y contener solo letras');
      expect(validateFn('Producto')).toBe(true);
    });
  });
});
