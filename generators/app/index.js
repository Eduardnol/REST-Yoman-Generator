const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    this.log(chalk.yellow('\n==========================================='));
    this.log(chalk.yellow('  Generador de API REST - Spring Boot'));
    this.log(chalk.yellow('  Basado en el patrón Sector'));
    this.log(chalk.yellow('===========================================\n'));

    const answers = await this.prompt([
      {
        type: 'input',
        name: 'entityName',
        message: '¿Cuál es el nombre de la entidad? (ej: Sector, Usuario, Producto)',
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
        name: 'tableName',
        message: '¿Cuál es el nombre de la tabla en la base de datos?',
        default: answers => `in_${answers.entityName.toLowerCase()}`
      },
      {
        type: 'input',
        name: 'idColumnName',
        message: '¿Cuál es el nombre de la columna ID?',
        default: answers => `id_${answers.entityName.toLowerCase()}`
      },
      {
        type: 'input',
        name: 'sequenceName',
        message: '¿Cuál es el nombre de la secuencia?',
        default: answers => `${answers.tableName}_${answers.idColumnName}_seq`
      },
      {
        type: 'input',
        name: 'packageName',
        message: 'Paquete base:',
        default: 'com.acme.application'
      },
      {
        type: 'input',
        name: 'schema',
        message: 'Esquema de la base de datos:',
        default: 'acme_schema'
      },
      {
        type: 'confirm',
        name: 'includeCombo',
        message: '¿Incluir endpoint para combo?',
        default: true
      }
    ]);

    this.entityName = answers.entityName;
    this.entityNameLower = answers.entityName.toLowerCase();
    this.entityNameFirstLower = answers.entityName.charAt(0).toLowerCase() + answers.entityName.slice(1);
    this.packageName = answers.packageName;
    this.packagePath = answers.packageName.replace(/\./g, '/');
    this.tableName = answers.tableName;
    this.idColumnName = answers.idColumnName;
    this.sequenceName = answers.sequenceName;
    this.schema = answers.schema;
    this.includeCombo = answers.includeCombo;
  }

  writing() {
    this.log(chalk.blue('\n📝 Generando archivos...\n'));

    // Contador de archivos generados
    this.filesGenerated = 0;

    // Generar EntityMapper base si no existe
    this._generateBaseEntityMapper();

    // Generar Entity
    this._generateEntity();
    this.filesGenerated++;
    this.log(chalk.green('✓ Entity generada'));

    // Generar DTO
    this._generateDTO();
    this.filesGenerated++;
    this.log(chalk.green('✓ DTO generado'));

    // Generar Repository
    this._generateRepository();
    this.filesGenerated++;
    this.log(chalk.green('✓ Repository generado'));

    // Generar Mapper
    this._generateMapper();
    this.filesGenerated++;
    this.log(chalk.green('✓ Mapper generado'));

    // Generar Service Interface
    this._generateServiceInterface();
    this.filesGenerated++;
    this.log(chalk.green('✓ Service Interface generado'));

    // Generar Service Implementation
    this._generateServiceImpl();
    this.filesGenerated++;
    this.log(chalk.green('✓ Service Implementation generado'));

    // Generar API Interface
    this._generateAPIInterface();
    this.filesGenerated++;
    this.log(chalk.green('✓ API Interface generado'));

    // Generar Controller
    this._generateController();
    this.filesGenerated++;
    this.log(chalk.green('✓ Controller generado'));
  }

  _generateBaseEntityMapper() {
    const baseMapperPath = this.destinationPath(`src/main/java/${this.packagePath}/controller/mappers/EntityMapper.java`);

    // Solo generar si no existe
    if (!this.fs.exists(baseMapperPath)) {
      this.fs.copyTpl(
        this.templatePath('BaseEntityMapper.java.ejs'),
        baseMapperPath,
        {
          packageName: this.packageName
        }
      );
      this.filesGenerated++;
      this.log(chalk.green('✓ EntityMapper base generado'));
    } else {
      this.log(chalk.gray('  EntityMapper base ya existe (omitido)'));
    }
  }

  _generateEntity() {
    this.fs.copyTpl(
      this.templatePath('EntityEntity.java.ejs'),
      this.destinationPath(`src/main/java/${this.packagePath}/repository/entity/${this.entityName}Entity.java`),
      {
        packageName: this.packageName,
        entityName: this.entityName,
        tableName: this.tableName,
        schema: this.schema,
        idColumnName: this.idColumnName,
        sequenceName: this.sequenceName,
        entityNameLower: this.entityNameLower
      }
    );
  }

  _generateDTO() {
    this.fs.copyTpl(
      this.templatePath('EntityDTO.java.ejs'),
      this.destinationPath(`src/main/java/${this.packagePath}/controller/dto/${this.entityName}DTO.java`),
      {
        packageName: this.packageName,
        entityName: this.entityName
      }
    );
  }

  _generateRepository() {
    this.fs.copyTpl(
      this.templatePath('EntityRepository.java.ejs'),
      this.destinationPath(`src/main/java/${this.packagePath}/repository/${this.entityName}Repository.java`),
      {
        packageName: this.packageName,
        entityName: this.entityName
      }
    );
  }

  _generateMapper() {
    this.fs.copyTpl(
      this.templatePath('EntityMapper.java.ejs'),
      this.destinationPath(`src/main/java/${this.packagePath}/controller/mappers/${this.entityName}Mapper.java`),
      {
        packageName: this.packageName,
        entityName: this.entityName
      }
    );
  }

  _generateServiceInterface() {
    this.fs.copyTpl(
      this.templatePath('EntityService.java.ejs'),
      this.destinationPath(`src/main/java/${this.packagePath}/domain/${this.entityName}Service.java`),
      {
        packageName: this.packageName,
        entityName: this.entityName,
        includeCombo: this.includeCombo
      }
    );
  }

  _generateServiceImpl() {
    this.fs.copyTpl(
      this.templatePath('EntityServiceImpl.java.ejs'),
      this.destinationPath(`src/main/java/${this.packagePath}/domain/impl/${this.entityName}ServiceImpl.java`),
      {
        packageName: this.packageName,
        entityName: this.entityName,
        entityNameFirstLower: this.entityNameFirstLower,
        includeCombo: this.includeCombo
      }
    );
  }

  _generateAPIInterface() {
    this.fs.copyTpl(
      this.templatePath('EntityAPI.java.ejs'),
      this.destinationPath(`src/main/java/${this.packagePath}/controller/${this.entityName}API.java`),
      {
        packageName: this.packageName,
        entityName: this.entityName,
        includeCombo: this.includeCombo
      }
    );
  }

  _generateController() {
    this.fs.copyTpl(
      this.templatePath('EntityController.java.ejs'),
      this.destinationPath(`src/main/java/${this.packagePath}/controller/impl/${this.entityName}Controller.java`),
      {
        packageName: this.packageName,
        entityName: this.entityName,
        entityNameLower: this.entityNameLower,
        entityNameFirstLower: this.entityNameFirstLower,
        includeCombo: this.includeCombo
      }
    );
  }

  end() {
    this.log(chalk.green('\n==========================================='));
    this.log(chalk.green('  ✅ ¡API REST generada exitosamente!'));
    this.log(chalk.green('===========================================\n'));
    this.log(chalk.blue(`📦 Entidad: ${this.entityName}`));
    this.log(chalk.blue(`🌐 Endpoint: /api/v1/${this.entityNameLower}`));
    this.log(chalk.blue(`📁 Archivos generados: ${this.filesGenerated}`));
    this.log(chalk.yellow('\n💡 No olvides:'));
    this.log(chalk.yellow('   1. Verificar y ajustar los campos de la entidad'));
    this.log(chalk.yellow('   2. Crear la migración de base de datos si es necesario'));
    this.log(chalk.yellow('   3. Ejecutar los tests\n'));
  }
};
