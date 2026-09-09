/**
 * Code Generator Module for Yoga Layout & DartNative Bridge Code
 */
class CodeGenerator {
  /**
   * Generate Dart Controller class using DartNative Interface
   */
  static generateDartCode(schema) {
    const className = schema.dartModule || 'UIController';
    const screenName = schema.screenName || 'Screen';

    const collectBindings = (node, bindingsMap = []) => {
      if (node.bindings) {
        if (node.bindings.onClick) {
          bindingsMap.push({ id: node.id, type: 'onClick', method: node.bindings.onClick });
        }
        if (node.bindings.onChanged) {
          bindingsMap.push({ id: node.id, type: 'onChanged', method: node.bindings.onChanged });
        }
      }
      if (node.children) {
        node.children.forEach(c => collectBindings(c, bindingsMap));
      }
      return bindingsMap;
    };

    const bindings = collectBindings(schema.root);

    let methodsCode = bindings.map(b => `  /// Handler for ${b.type} on component '${b.id}'
  void ${b.method}(Map<String, dynamic> eventData) {
    print("Executing ${b.method} from ${screenName} with data: $eventData");
  }`).join('\n\n');

    if (!methodsCode) {
      methodsCode = `  /// Default action handler
  void handleUserAction(String action, Map<String, dynamic> args) {
    print("Action $action triggered on ${screenName}");
  }`;
    }

    return `import 'package:dart_native/dart_native.dart';

/// DartNative Dynamic Logic Controller for ${screenName}
class ${className} {
  final Interface _nativeBridge = Interface("${className}");

  ${className}() {
    _registerNativeHandlers();
  }

  /// Initialize and build native UI layout
  Future<bool> renderLayout(Map<String, dynamic> layoutJson) async {
    final result = await _nativeBridge.invokeMethod('renderLayout', args: [layoutJson]);
    return result as bool? ?? false;
  }

${methodsCode}

  void _registerNativeHandlers() {
    print("${className} bound with DartNative interface.");
  }
}
`;
  }

  /**
   * Recursively build Swift YogaKit layout nodes
   */
  static _buildSwiftNodeTree(node, varName = "rootView") {
    let lines = [];
    const s = node.style || {};

    lines.push(`            // Node: ${node.id} (${node.type})`);

    if (varName !== "rootView") {
      const viewClass = node.type === 'Button' ? 'UIButton()' : node.type === 'Text' ? 'UILabel()' : node.type === 'Image' ? 'UIImageView()' : node.type === 'TextInput' ? 'UITextField()' : 'UIView()';
      lines.push(`            let ${node.id} = ${viewClass}`);
      lines.push(`            ${varName}.addSubview(${node.id})`);
    }

    const currentVar = varName === "rootView" ? "rootView" : node.id;

    lines.push(`            ${currentVar}.configureLayout { layout in`);
    lines.push(`                layout.isEnabled = true`);
    if (s.flexDirection) lines.push(`                layout.flexDirection = .${s.flexDirection.replace('-reverse', 'Reverse')}`);
    if (s.justifyContent) lines.push(`                layout.justifyContent = .${s.justifyContent.replace('-start', 'Start').replace('-end', 'End').replace('-between', 'Between').replace('-around', 'Around').replace('-evenly', 'Evenly')}`);
    if (s.alignItems) lines.push(`                layout.alignItems = .${s.alignItems.replace('-start', 'Start').replace('-end', 'End')}`);
    if (s.flexGrow !== undefined) lines.push(`                layout.flexGrow = ${s.flexGrow}`);
    if (s.width) lines.push(`                layout.width = YGValue(${typeof s.width === 'number' ? s.width : 'rootView.bounds.width'})`);
    if (s.height) lines.push(`                layout.height = YGValue(${typeof s.height === 'number' ? s.height : 'rootView.bounds.height'})`);
    if (s.padding) lines.push(`                layout.padding = YGValue(${s.padding})`);
    lines.push(`            }`);

    if (node.children) {
      node.children.forEach(c => {
        lines.push(CodeGenerator._buildSwiftNodeTree(c, currentVar));
      });
    }

    return lines.join('\n');
  }

  /**
   * Generate iOS Swift Native View Code using YogaKit
   */
  static generateSwiftCode(schema) {
    const className = schema.dartModule || 'UIController';
    const treeCode = CodeGenerator._buildSwiftNodeTree(schema.root, "rootView");

    return `// ${className}.swift - Generated Swift + YogaKit View for iOS
import UIKit
import YogaKit
import dart_native

@objc(${className})
public class ${className}: NSObject {

    @objc public func renderLayout(_ layoutData: [String: Any]) -> Bool {
        DispatchQueue.main.async {
            guard let window = UIApplication.shared.windows.first(where: { $0.isKeyWindow }),
                  let rootView = window.rootViewController?.view else { return }

${treeCode}

            rootView.yoga.applyLayout(preservingOrigin: true)
        }
        return true
    }
}
`;
  }

  /**
   * Recursively build Kotlin Yoga layout nodes
   */
  static _buildKotlinNodeTree(node, parentVar = "rootNode") {
    let lines = [];
    const s = node.style || {};
    const nodeVar = `${node.id}Node`;

    lines.push(`        // Node: ${node.id} (${node.type})`);
    lines.push(`        val ${nodeVar} = YogaNodeFactory.create()`);
    if (s.flexDirection) lines.push(`        ${nodeVar}.flexDirection = YogaFlexDirection.${s.flexDirection.toUpperCase().replace('-', '_')}`);
    if (s.justifyContent) lines.push(`        ${nodeVar}.justifyContent = YogaJustify.${s.justifyContent.toUpperCase().replace('-', '_')}`);
    if (s.flexGrow !== undefined) lines.push(`        ${nodeVar}.flexGrow = ${s.flexGrow}f`);
    if (s.width && typeof s.width === 'number') lines.push(`        ${nodeVar}.setWidth(${s.width}f)`);
    if (s.height && typeof s.height === 'number') lines.push(`        ${nodeVar}.setHeight(${s.height}f)`);
    if (s.padding) lines.push(`        ${nodeVar}.setPadding(YogaEdge.ALL, ${s.padding}f)`);

    if (parentVar !== nodeVar) {
      lines.push(`        ${parentVar}.addChildAt(${nodeVar}, ${parentVar}.childCount)`);
    }

    if (node.children) {
      node.children.forEach(c => {
        lines.push(CodeGenerator._buildKotlinNodeTree(c, nodeVar));
      });
    }

    return lines.join('\n');
  }

  /**
   * Generate Android Kotlin Native Layout Code using Yoga
   */
  static generateKotlinCode(schema) {
    const className = schema.dartModule || 'UIController';
    const treeCode = CodeGenerator._buildKotlinNodeTree(schema.root, "rootNode");

    return `// ${className}.kt - Generated Kotlin + Yoga Layout for Android
package com.example.nativeui

import android.content.Context
import com.facebook.yoga.YogaNodeFactory
import com.facebook.yoga.YogaFlexDirection
import com.facebook.yoga.YogaJustify
import com.facebook.yoga.YogaEdge
import com.dartnative.dart_native.DartNativeInterface
import com.dartnative.dart_native.annotation.InterfaceEntry
import com.dartnative.dart_native.annotation.InterfaceMethod

@InterfaceEntry(name = "${className}")
class ${className} : DartNativeInterface() {

    @InterfaceMethod(name = "renderLayout")
    fun renderLayout(layoutData: Map<String, Any>): Boolean {
        val rootNode = YogaNodeFactory.create()

${treeCode}

        // Yoga native layout calculation
        rootNode.calculateLayout(1080f, 2340f)
        return true
    }
}
`;
  }

  /**
   * Generate iOS Objective-C Native View Code using YogaKit
   */
  static generateObjectiveCCode(schema) {
    const className = schema.dartModule || 'UIController';

    return `// ${className}.m - Generated Objective-C + YogaKit View for iOS
#import <UIKit/UIKit.h>
#import <YogaKit/UIView+Yoga.h>
#import <dart_native/DNInterface.h>

@interface ${className} : NSObject
@end

@implementation ${className}

InterfaceEntry(${className})

InterfaceMethod(renderLayout, renderLayoutWithData:(NSDictionary *)layoutData) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIWindow *window = [UIApplication sharedApplication].keyWindow;
        UIView *rootView = window.rootViewController.view;

        // Configure Root Yoga View
        [rootView configureLayoutWithBlock:^(YGLayout * _Nonnull layout) {
            layout.isEnabled = YES;
            layout.flexDirection = YGFlexDirectionColumn;
            layout.width = YGPointValue(rootView.bounds.size.width);
            layout.height = YGPointValue(rootView.bounds.size.height);
        }];

        [rootView.yoga applyLayoutPreservingOrigin:YES];
    });

    return @YES;
}

@end
`;
  }

  /**
   * Generate Android Java Native Layout Code using Yoga
   */
  static generateJavaCode(schema) {
    const className = schema.dartModule || 'UIController';

    return `// ${className}.java - Generated Java + Yoga Layout for Android
package com.example.nativeui;

import android.content.Context;
import android.view.ViewGroup;
import com.facebook.yoga.YogaNode;
import com.facebook.yoga.YogaNodeFactory;
import com.facebook.yoga.YogaFlexDirection;
import com.dartnative.dart_native.DartNativeInterface;
import com.dartnative.dart_native.annotation.InterfaceEntry;
import com.dartnative.dart_native.annotation.InterfaceMethod;
import java.util.Map;

@InterfaceEntry(name = "${className}")
public class ${className} extends DartNativeInterface {

    @InterfaceMethod(name = "renderLayout")
    public boolean renderLayout(Map<String, Object> layoutData) {
        YogaNode rootNode = YogaNodeFactory.create();
        rootNode.setFlexDirection(YogaFlexDirection.COLUMN);

        // Yoga native layout calculation
        rootNode.calculateLayout(1080, 2340);
        return true;
    }
}
`;
  }

  /**
   * Generate flutter_zero.yaml manifest for flutter_zero_tools integration
   */
  static generateFlutterZeroYaml(schema) {
    const className = schema.dartModule || 'UIController';
    const screenName = schema.screenName || 'Screen';

    return `# flutter_zero.yaml - Flutter Zero Tools Native Binding Manifest
name: ${screenName.toLowerCase()}_native_module
version: 1.0.0
description: Zero-overhead Yoga Layout and DartNative bridge specification for ${screenName}

flutter_zero:
  targets:
    ios:
      framework: YogaKit
      bridge_class: ${className}
      language: swift
      source_path: ios/Runner/${className}.swift
    android:
      framework: facebook_yoga
      bridge_class: com.example.nativeui.${className}
      language: kotlin
      source_path: android/app/src/main/kotlin/com/example/nativeui/${className}.kt

  bindings:
    module: ${className}
    schema_path: assets/layouts/${screenName.toLowerCase()}_layout.json
    hot_reload: true
    codegen:
      ffi_stubs: lib/generated/${className.toLowerCase()}_stubs.dart
      zero_overhead_direct_dispatch: true
`;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeGenerator;
}
