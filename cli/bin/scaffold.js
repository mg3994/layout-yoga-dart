#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const CodeGenerator = require('../../editor/js/codegen.js');

function runScaffolder() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Flutter + DartNative + Yoga Project Scaffolder CLI

Usage:
  node cli/bin/scaffold.js <project-name> [output-dir]

Options:
  --help, -h     Show this help message
`);
    process.exit(0);
  }

  const projectName = args[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const targetDir = path.resolve(args[1] || `./${projectName}`);

  console.log(`\n🚀 Scaffolding Flutter + DartNative project in '${targetDir}'...`);

  // Create Directory Hierarchy
  const dirs = [
    targetDir,
    path.join(targetDir, 'lib'),
    path.join(targetDir, 'lib/generated'),
    path.join(targetDir, 'assets/layouts'),
    path.join(targetDir, 'ios/Runner'),
    path.join(targetDir, 'android/app/src/main/kotlin/com/example/nativeui')
  ];

  dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

  // 1. pubspec.yaml
  const pubspecContent = `name: ${projectName}
description: Flutter application with Yoga Layout and DartNative native UI rendering.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  dart_native: ^0.7.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/layouts/
`;
  fs.writeFileSync(path.join(targetDir, 'pubspec.yaml'), pubspecContent, 'utf8');

  // 2. Sample Layout Schema
  const sampleSchema = {
    version: "1.0.0",
    screenName: "MainDashboard",
    dartModule: "MainDashboardController",
    root: {
      id: "rootContainer",
      type: "Container",
      props: { backgroundColor: "#0f172a" },
      style: { flexDirection: "column", flexGrow: 1, padding: 20 },
      children: [
        {
          id: "welcomeText",
          type: "Text",
          props: { text: "Welcome to Yoga Native Studio", textColor: "#ffffff", fontSize: 20 },
          style: { padding: 10 }
        }
      ]
    }
  };
  fs.writeFileSync(path.join(targetDir, 'assets/layouts/main_dashboard.json'), JSON.stringify(sampleSchema, null, 2), 'utf8');

  // 3. Generated Dart Controller
  const dartCode = CodeGenerator.generateDartCode(sampleSchema);
  fs.writeFileSync(path.join(targetDir, 'lib/main_dashboard_controller.dart'), dartCode, 'utf8');

  // 4. Flutter Zero Manifest
  const flutterZeroYaml = CodeGenerator.generateFlutterZeroYaml(sampleSchema);
  fs.writeFileSync(path.join(targetDir, 'flutter_zero.yaml'), flutterZeroYaml, 'utf8');

  // 5. lib/main.dart
  const mainDartContent = `import 'package:flutter/material.dart';
import 'main_dashboard_controller.dart';

void main() {
  runApp(const YogaNativeApp());
}

class YogaNativeApp extends StatelessWidget {
  const YogaNativeApp({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = MainDashboardController();

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Yoga Native UI')),
        body: Center(
          child: ElevatedButton(
            onPressed: () async {
              final success = await controller.renderLayout({'screen': 'MainDashboard'});
              debugPrint('Render layout result: $success');
            },
            child: const Text('Render Native Yoga Layout'),
          ),
        ),
      ),
    );
  }
}
`;
  fs.writeFileSync(path.join(targetDir, 'lib/main.dart'), mainDartContent, 'utf8');

  // 6. Swift Native File
  const swiftCode = CodeGenerator.generateSwiftCode(sampleSchema);
  fs.writeFileSync(path.join(targetDir, 'ios/Runner/MainDashboardController.swift'), swiftCode, 'utf8');

  // 7. Kotlin Native File
  const kotlinCode = CodeGenerator.generateKotlinCode(sampleSchema);
  fs.writeFileSync(path.join(targetDir, 'android/app/src/main/kotlin/com/example/nativeui/MainDashboardController.kt'), kotlinCode, 'utf8');

  console.log(`
✅ Project successfully scaffolded at '${targetDir}'!

Next Steps:
  1. cd ${path.relative(process.cwd(), targetDir)}
  2. flutter pub get
  3. flutter run
`);
}

runScaffolder();
