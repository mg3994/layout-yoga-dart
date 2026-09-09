const assert = require('assert');
const CodeGenerator = require('../editor/js/codegen.js');

const sampleSchema = {
  version: "1.0.0",
  screenName: "TestScreen",
  dartModule: "TestController",
  root: {
    id: "testRoot",
    type: "Container",
    style: { flexDirection: "column", padding: 10 },
    children: [
      {
        id: "testButton",
        type: "Button",
        props: { text: "Click Me" },
        bindings: { onClick: "onTestClick" },
        style: { height: 40 }
      }
    ]
  }
};

console.log('Running CodeGenerator Unit Tests...');

// 1. Test Dart Generation
const dartCode = CodeGenerator.generateDartCode(sampleSchema);
assert.ok(dartCode.includes('class TestController'));
assert.ok(dartCode.includes('void onTestClick('));
assert.ok(dartCode.includes('package:dart_native/dart_native.dart'));
console.log('✔ Dart code generator passed.');

// 2. Test Swift Generation
const swiftCode = CodeGenerator.generateSwiftCode(sampleSchema);
assert.ok(swiftCode.includes('@objc(TestController)'));
assert.ok(swiftCode.includes('import YogaKit'));
assert.ok(swiftCode.includes('import dart_native'));
console.log('✔ Swift code generator passed.');

// 3. Test Kotlin Generation
const kotlinCode = CodeGenerator.generateKotlinCode(sampleSchema);
assert.ok(kotlinCode.includes('class TestController : DartNativeInterface()'));
assert.ok(kotlinCode.includes('YogaNodeFactory.create()'));
console.log('✔ Kotlin code generator passed.');

// 4. Test Objective-C Generation
const objcCode = CodeGenerator.generateObjectiveCCode(sampleSchema);
assert.ok(objcCode.includes('InterfaceEntry(TestController)'));
assert.ok(objcCode.includes('<YogaKit/UIView+Yoga.h>'));
console.log('✔ Objective-C code generator passed.');

// 5. Test Java Generation
const javaCode = CodeGenerator.generateJavaCode(sampleSchema);
assert.ok(javaCode.includes('public class TestController extends DartNativeInterface'));
assert.ok(javaCode.includes('YogaNodeFactory.create()'));
console.log('✔ Java code generator passed.');

// 6. Test Flutter Zero Generation
const flutterZeroYaml = CodeGenerator.generateFlutterZeroYaml(sampleSchema);
assert.ok(flutterZeroYaml.includes('flutter_zero:'));
assert.ok(flutterZeroYaml.includes('bridge_class: TestController'));
assert.ok(flutterZeroYaml.includes('zero_overhead_direct_dispatch: true'));
console.log('✔ Flutter Zero YAML generator passed.');

console.log('\nAll 6 CodeGenerator tests passed successfully!\n');
