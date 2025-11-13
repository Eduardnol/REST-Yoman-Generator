const Generator = require('yeoman-generator');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    this.log(chalk.yellow('\n==========================================='));
    this.log(chalk.yellow('  Añadir Método a Entidad Existente'));
    this.log(chalk.yellow('===========================================\n'));

    const answers = await this.prompt([
      {
        type: 'input',
        name: 'entityName',
        message: '¿Nombre de la entidad existente? (ej: Substancia, Empresa)',
        validate: input => {
          if (input.length === 0) {
            return 'El nombre de la entidad es requerido';
          }
          if (!/^[A-Z][a-zA-Z]*$/.test(input)) {
            return 'El nombre debe empezar con mayúscula y contener solo letras';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'packageName',
        message: 'Paquete base:',
        default: 'com.acme.project'
      },
      {
        type: 'input',
        name: 'methodName',
        message: '¿Nombre del método? (ej: getEstablimentsBySubstanciaId)',
        validate: input => {
          if (input.length === 0) {
            return 'El nombre del método es requerido';
          }
          if (!/^[a-z][a-zA-Z0-9]*$/.test(input)) {
            return 'El nombre debe empezar con minúscula y ser camelCase';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'httpMethod',
        message: '¿Tipo de llamada HTTP?',
        choices: ['GET', 'POST', 'PUT', 'DELETE'],
        default: 'GET'
      },
      {
        type: 'confirm',
        name: 'usePagination',
        message: '¿El método usa paginación?',
        default: false
      },
      {
        type: 'input',
        name: 'endpointPath',
        message: '¿Ruta del endpoint? (ej: /{id}/establiments, /search)',
        validate: input => {
          if (input.length === 0) {
            return 'La ruta es requerida';
          }
          if (!input.startsWith('/')) {
            return 'La ruta debe empezar con /';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'pathParameters',
        message: '¿Parámetros de path? (separados por coma, ej: id,tipo) [Enter si ninguno]:',
        default: ''
      },
      {
        type: 'input',
        name: 'inputDTO',
        message: '¿DTO de entrada? (nombre completo, ej: SubstanciaFilterDTO) [Enter si ninguno]:',
        default: '',
        when: answers => answers.httpMethod === 'POST' || answers.httpMethod === 'PUT'
      },
      {
        type: 'input',
        name: 'outputDTO',
        message: '¿DTO de salida? (ej: EstablimentTaulaSubstanciaDTO, SubstanciaDTO)',
        validate: input => {
          if (input.length === 0) {
            return 'El DTO de salida es requerido';
          }
          return true;
        },
        when: answers => answers.httpMethod !== 'DELETE'
      },
      {
        type: 'confirm',
        name: 'isReadOnly',
        message: '¿Es una operación de solo lectura? (@Transactional(readOnly = true))',
        default: answers => answers.httpMethod === 'GET',
        when: answers => answers.httpMethod === 'GET' || answers.httpMethod === 'POST'
      },
      {
        type: 'input',
        name: 'methodDescription',
        message: '¿Descripción del método para Swagger?',
        default: answers => `Método ${answers.methodName}`
      }
    ]);

    this.entityName = answers.entityName;
    this.entityNameLower = answers.entityName.toLowerCase();
    this.entityNameFirstLower = answers.entityName.charAt(0).toLowerCase() + answers.entityName.slice(1);
    this.packageName = answers.packageName;
    this.packagePath = answers.packageName.replace(/\./g, '/');
    this.methodName = answers.methodName;
    this.httpMethod = answers.httpMethod;
    this.usePagination = answers.usePagination;
    this.endpointPath = answers.endpointPath;
    this.pathParameters = answers.pathParameters ? answers.pathParameters.split(',').map(p => p.trim()).filter(p => p) : [];
    this.inputDTO = answers.inputDTO || null;
    this.outputDTO = answers.outputDTO || null;
    this.isReadOnly = answers.isReadOnly || false;
    this.methodDescription = answers.methodDescription;

    // Inferir tipo de retorno
    if (this.httpMethod === 'DELETE') {
      this.returnType = 'Void';
      this.serviceReturnType = 'void';
    } else if (this.usePagination) {
      this.returnType = `ResponsePage<${this.outputDTO}>`;
      this.serviceReturnType = `Page<${this.outputDTO}>`;
    } else {
      this.returnType = this.outputDTO;
      this.serviceReturnType = this.outputDTO;
    }
  }

  writing() {
    this.log(chalk.blue('\n📝 Añadiendo método a los archivos...\n'));

    // Rutas de archivos
    const apiPath = this.destinationPath(`src/main/java/${this.packagePath}/controller/${this.entityName}API.java`);
    const controllerPath = this.destinationPath(`src/main/java/${this.packagePath}/controller/impl/${this.entityName}Controller.java`);
    const servicePath = this.destinationPath(`src/main/java/${this.packagePath}/domain/${this.entityName}Service.java`);
    const serviceImplPath = this.destinationPath(`src/main/java/${this.packagePath}/domain/impl/${this.entityName}ServiceImpl.java`);

    // Verificar que los archivos existen
    if (!this.fs.exists(apiPath)) {
      this.log(chalk.red(`✗ No se encontró ${this.entityName}API.java`));
      return;
    }

    // Generar código para cada archivo
    this._updateAPIInterface(apiPath);
    this.log(chalk.green('✓ API Interface actualizada'));

    this._updateController(controllerPath);
    this.log(chalk.green('✓ Controller actualizado'));

    this._updateServiceInterface(servicePath);
    this.log(chalk.green('✓ Service Interface actualizado'));

    this._updateServiceImpl(serviceImplPath);
    this.log(chalk.green('✓ Service Implementation actualizado'));
  }

  _updateAPIInterface(filePath) {
    const content = this.fs.read(filePath);

    // Generar la firma del método
    const methodSignature = this._generateAPIMethodSignature();

    // Insertar antes del último '}'
    const lines = content.split('\n');
    const lastBraceIndex = lines.lastIndexOf('}');

    lines.splice(lastBraceIndex, 0, '', methodSignature);

    this.fs.write(filePath, lines.join('\n'));
  }

  _updateController(filePath) {
    const content = this.fs.read(filePath);

    // Generar la implementación del método
    const methodImpl = this._generateControllerMethodImpl();

    // Insertar antes del último '}'
    const lines = content.split('\n');
    const lastBraceIndex = lines.lastIndexOf('}');

    lines.splice(lastBraceIndex, 0, '', methodImpl);

    this.fs.write(filePath, lines.join('\n'));
  }

  _updateServiceInterface(filePath) {
    const content = this.fs.read(filePath);

    // Generar la firma del método
    const methodSignature = this._generateServiceMethodSignature();

    // Insertar antes del último '}'
    const lines = content.split('\n');
    const lastBraceIndex = lines.lastIndexOf('}');

    lines.splice(lastBraceIndex, 0, '', methodSignature);

    this.fs.write(filePath, lines.join('\n'));
  }

  _updateServiceImpl(filePath) {
    const content = this.fs.read(filePath);

    // Generar la implementación del método
    const methodImpl = this._generateServiceImplMethod();

    // Insertar antes del último '}'
    const lines = content.split('\n');
    const lastBraceIndex = lines.lastIndexOf('}');

    lines.splice(lastBraceIndex, 0, '', methodImpl);

    this.fs.write(filePath, lines.join('\n'));
  }

  _generateAPIMethodSignature() {
    const params = this._buildAPIParameters();
    const annotations = this._buildAPIAnnotations();

    return `${annotations}
  ResponseEntity<${this.returnType}> ${this.methodName}(${params.join(', ')});`;
  }

  _generateControllerMethodImpl() {
    const params = this._buildControllerParameters();
    const annotation = this._getHTTPAnnotation();
    const callService = this._buildServiceCall();

    return `  ${annotation}
  @Override
  public ResponseEntity<${this.returnType}> ${this.methodName}(${params.join(', ')}) {
    ${callService}
  }`;
  }

  _generateServiceMethodSignature() {
    const params = this._buildServiceParameters();

    return `  ${this.serviceReturnType} ${this.methodName}(${params.join(', ')});`;
  }

  _generateServiceImplMethod() {
    const params = this._buildServiceParameters();
    const transactional = this.isReadOnly ? '@Transactional(readOnly = true)' : '';

    return `  ${transactional ? transactional + '\n  ' : ''}@Override
  public ${this.serviceReturnType} ${this.methodName}(${params.join(', ')}) {
    log.debug("Request to ${this.methodName}");
    // TODO: Implementar la lógica del método
    ${this.serviceReturnType === 'void' ? '' : 'return null;'}
  }`;
  }

  _buildAPIParameters() {
    const params = [];

    // Parámetros de path
    this.pathParameters.forEach(param => {
      const paramType = param === 'id' ? 'Integer' : 'String';
      params.push(`@Parameter(description = "Parámetro ${param}") ${paramType} ${param}`);
    });

    // DTO de entrada
    if (this.inputDTO) {
      params.push(`@RequestBody(required = false) ${this.inputDTO} ${this._toLowerFirst(this.inputDTO)}`);
    }

    // Parámetros de paginación
    if (this.usePagination) {
      params.push('@Parameter(description = "Número de página") int page');
      params.push('@Parameter(description = "Registros por página") int rpp');
      params.push('@Parameter(description = "Campo de ordenación") String active');
      params.push('@Parameter(description = "Dirección de ordenación") String direction');
    }

    return params;
  }

  _buildControllerParameters() {
    const params = [];

    // Parámetros de path
    this.pathParameters.forEach(param => {
      const paramType = param === 'id' ? 'Integer' : 'String';
      params.push(`@PathVariable ${paramType} ${param}`);
    });

    // DTO de entrada
    if (this.inputDTO) {
      params.push(`@RequestBody(required = false) ${this.inputDTO} ${this._toLowerFirst(this.inputDTO)}`);
    }

    // Parámetros de paginación
    if (this.usePagination) {
      params.push('@RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUM) final int page');
      params.push('@RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) final int rpp');
      params.push('@RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) final String active');
      params.push('@RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) final String direction');
    }

    return params;
  }

  _buildServiceParameters() {
    const params = [];

    // Parámetros de path
    this.pathParameters.forEach(param => {
      const paramType = param === 'id' ? 'Integer' : 'String';
      params.push(`${paramType} ${param}`);
    });

    // DTO de entrada
    if (this.inputDTO) {
      params.push(`${this.inputDTO} ${this._toLowerFirst(this.inputDTO)}`);
    }

    // Paginación
    if (this.usePagination) {
      params.push('Pageable pageable');
    }

    return params;
  }

  _buildAPIAnnotations() {
    return `  @Operation(
      summary = "${this.methodDescription}",
      description = "${this.methodDescription}")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Éxito"),
    @ApiResponse(responseCode = "404", description = "No encontrado")
  })`;
  }

  _getHTTPAnnotation() {
    const mapping = {
      'GET': '@GetMapping',
      'POST': '@PostMapping',
      'PUT': '@PutMapping',
      'DELETE': '@DeleteMapping'
    };
    return `${mapping[this.httpMethod]}("${this.endpointPath}")`;
  }

  _buildServiceCall() {
    const serviceParams = [];

    // Parámetros de path
    this.pathParameters.forEach(param => {
      serviceParams.push(param);
    });

    // DTO de entrada
    if (this.inputDTO) {
      serviceParams.push(this._toLowerFirst(this.inputDTO));
    }

    // Paginación
    if (this.usePagination) {
      serviceParams.push('PageRequest.of(page, rpp, Sort.by(Sort.Direction.fromString(direction), active))');
    }

    const serviceCall = `${this.entityNameFirstLower}Service.${this.methodName}(${serviceParams.join(', ')})`;

    if (this.httpMethod === 'DELETE') {
      return `${serviceCall};\n    return ResponseEntity.noContent().build();`;
    } else if (this.usePagination) {
      return `Page<${this.outputDTO}> pageable = ${serviceCall};
    return ResponseUtil.wrapListOrNoContent(pageable.getContent(), pageable.getNumber(), pageable.getSize(), pageable.getTotalElements());`;
    } else {
      return `return ResponseEntity.ok(${serviceCall});`;
    }
  }

  _toLowerFirst(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  end() {
    this.log(chalk.green('\n==========================================='));
    this.log(chalk.green('  ✅ ¡Método añadido exitosamente!'));
    this.log(chalk.green('===========================================\n'));
    this.log(chalk.blue(`📦 Entidad: ${this.entityName}`));
    this.log(chalk.blue(`🔧 Método: ${this.methodName}`));
    this.log(chalk.blue(`🌐 Endpoint: ${this.httpMethod} /api/v1/${this.entityNameLower}${this.endpointPath}`));
    this.log(chalk.yellow('\n💡 No olvides:'));
    this.log(chalk.yellow('   1. Implementar la lógica en el ServiceImpl'));
    this.log(chalk.yellow('   2. Verificar y ajustar los imports necesarios'));
    this.log(chalk.yellow('   3. Ejecutar los tests\n'));
  }
};

