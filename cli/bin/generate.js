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
  node cli/bin/generate.js <path-to-layout-schema.json> [output-dir] [--targets swift,kotlin,objc,java,dart]

Options:
  --targets, -t  Comma-separated list of code targets (swift, kotlin, objc, java, dart). Default: all
  --help, -h     Show this help message
`);
    process.exit(0);
  }

  const inputFile = path.resolve(args[0]);
  const outputDir = path.resolve(args[1] && !args[1].startsWith('-') ? args[1] : './generated_native');

  let targets = ['swift', 'kotlin', 'objc', 'java', 'dart'];
  const targetsIdx = args.findIndex(a => a === '--targets' || a === '-t');
  if (targetsIdx !== -1 && args[targetsIdx + 1]) {
    targets = args[targetsIdx + 1].split(',').map(t => t.trim().toLowerCase());
  }

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

    console.log(`\n Generating native UI bridge files in '${outputDir}':`);

    if (targets.includes('dart')) {
      const code = CodeGenerator.generateDartCode(schema);
      const file = path.join(outputDir, `${className.toLowerCase()}_controller.dart`);
      fs.writeFileSync(file, code, 'utf8');
      console.log(`  - Dart Controller:   ${file}`);
    }

    if (targets.includes('swift')) {
      const code = CodeGenerator.generateSwiftCode(schema);
      const file = path.join(outputDir, `${className}.swift`);
      fs.writeFileSync(file, code, 'utf8');
      console.log(`  - iOS Swift View:    ${file}`);
    }

    if (targets.includes('kotlin')) {
      const code = CodeGenerator.generateKotlinCode(schema);
      const file = path.join(outputDir, `${className}.kt`);
      fs.writeFileSync(file, code, 'utf8');
      console.log(`  - Android Kotlin:   ${file}`);
    }

    if (targets.includes('objc')) {
      const code = CodeGenerator.generateObjectiveCCode(schema);
      const file = path.join(outputDir, `${className}.m`);
      fs.writeFileSync(file, code, 'utf8');
      console.log(`  - iOS YogaKit Obj-C: ${file}`);
    }

    if (targets.includes('java')) {
      const code = CodeGenerator.generateJavaCode(schema);
      const file = path.join(outputDir, `${className}.java`);
      fs.writeFileSync(file, code, 'utf8');
      console.log(`  - Android Java View: ${file}`);
    }

    console.log(`\n Done!\n`);

  } catch (err) {
    console.error(`Failed to process layout schema: ${err.message}`);
    process.exit(1);
  }
}

runCLI();
