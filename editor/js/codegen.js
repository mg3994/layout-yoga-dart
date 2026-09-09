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
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeGenerator;
}
