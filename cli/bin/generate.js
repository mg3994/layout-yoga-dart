#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const CodeGenerator = require('../../editor/js/codegen.js');

function runCLI() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Yoga & DartNative Layout Code Generator CLI

Usage:
  node cli/bin/generate.js <path-to-layout-schema.json> [output-dir]

Options:
  --help, -h    Show this help message
`);
    process.exit(0);
  }

  const inputFile = path.resolve(args[0]);
  const outputDir = path.resolve(args[1] || './generated_native');

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found at path '${inputFile}'`);
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const schema = JSON.parse(rawData);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const className = schema.dartModule || 'UIController';

    // Generate Dart Controller
    const dartCode = CodeGenerator.generateDartCode(schema);
    const dartFile = path.join(outputDir, `${className.toLowerCase()}_controller.dart`);
    fs.writeFileSync(dartFile, dartCode, 'utf8');

    // Generate iOS Objective-C Yoga View
    const objcCode = CodeGenerator.generateObjectiveCCode(schema);
    const objcFile = path.join(outputDir, `${className}.m`);
    fs.writeFileSync(objcFile, objcCode, 'utf8');

    // Generate Android Java Yoga View
    const javaCode = CodeGenerator.generateJavaCode(schema);
    const javaFile = path.join(outputDir, `${className}.java`);
    fs.writeFileSync(javaFile, javaCode, 'utf8');

    console.log(`\n Successfully generated native UI bridge files in '${outputDir}':`);
    console.log(`  - Dart Controller:   ${dartFile}`);
    console.log(`  - iOS YogaKit View:  ${objcFile}`);
    console.log(`  - Android Yoga View: ${javaFile}\n`);

  } catch (err) {
    console.error(`Failed to process layout schema: ${err.message}`);
    process.exit(1);
  }
}

runCLI();
