# DartNative & Yoga Layout Architecture & Skill Guide

## 1. Executive Summary

This guide outlines the architecture, inner workings, and integration patterns for building native cross-platform UI layouts driven by **Yoga Layout** and controlled by **Dart** via **DartNative**.

By combining **Yoga Layout** (a high-performance, cross-platform Flexbox layout engine written in C/C++) with **DartNative** (a low-overhead, synchronous/asynchronous native bridge using FFI / Objective-C runtime / Android JNI), developers can visually design responsive UIs, execute real native rendering on iOS/Android, and write all core application logic in Dart.

---

## 2. DartNative Mechanics & Concepts

### 2.1 Overview
Unlike traditional Flutter Channels which incur serialization, deserialization, and asynchronous message queue overhead, **DartNative** operates as a direct bridge:
- **iOS / macOS**: Leverages `libffi` and the Objective-C runtime (`objc_msgSend`) for direct, zero-copy method dispatch and object pointer passing between Dart and Objective-C/Swift.
- **Android**: Uses JNI (Java Native Interface) and C++ interop (`libdart_native.so`) to call Java/Kotlin methods synchronously or asynchronously with automatic parameter marshalling.

### 2.2 Core Components & Annotations
- **`Interface` (Dart side)**:
  Dart class used to bind and invoke native methods dynamically.
  ```dart
  final interface = Interface("MyNativeUIModule");

  // Synchronous method invocation
  String title = interface.invokeMethodSync('getTitle', args: []);

  // Asynchronous method invocation
  Future<void> updateLayout(Map<String, dynamic> layoutJson) {
    return interface.invokeMethod('updateLayout', args: [layoutJson]);
  }
  ```

- **`@InterfaceEntry` & `@InterfaceMethod` (Native side)**:
  - **Objective-C (iOS)**:
    ```objectivec
    @implementation MyNativeUIModule

    InterfaceEntry(MyNativeUIModule)

    InterfaceMethod(updateLayout, handleUpdateLayout:(NSDictionary *)json) {
        // Native layout update logic
        return @YES;
    }

    @end
    ```
  - **Java / Kotlin (Android)**:
    ```java
    DartNativePlugin.loadSo();

    @InterfaceEntry(name = "MyNativeUIModule")
    public class MyNativeUIModule extends DartNativeInterface {

        @InterfaceMethod(name = "updateLayout")
        public boolean updateLayout(Map<String, Object> json) {
            // Native layout update logic
            return true;
        }
    }
    ```

### 2.3 DartNative CLI & Codegen (`dart_native_gen`)
- Uses `source_gen` and `build_runner` in Dart.
- Generates strongly typed bridging code and handles automatic type conversion (e.g. Dart `String`, `num`, `List`, `Map` <-> Native `NSString`/`String`, `NSNumber`/`Primitive`, `NSArray`/`List`, `NSDictionary`/`Map`).

---

## 3. Yoga Layout Engine Mechanics

### 3.1 Overview
[Yoga Layout](https://www.yogalayout.dev/) is Meta's C/C++ cross-platform layout engine based on the CSS Flexbox standard.
Yoga calculates exact layout dimensions (`left`, `top`, `width`, `height`) for a tree of layout nodes based on flexible styling rules.

### 3.2 Key Flexbox Layout Properties in Yoga
- **Flex Direction**: `column` (default in Yoga), `row`, `column-reverse`, `row-reverse`
- **Flex Grow / Shrink / Basis**: `flexGrow`, `flexShrink`, `flexBasis`
- **Alignment**:
  - `justifyContent`: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`
  - `alignItems` / `alignSelf`: `flex-start`, `center`, `flex-end`, `stretch`, `baseline`
  - `alignContent`: `flex-start`, `center`, `flex-end`, `stretch`, `space-between`, `space-around`
- **Sizing**: `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight` (supports `px`, `%`, `auto`)
- **Spacing**: `margin`, `padding`, `gap`, `rowGap`, `columnGap`
- **Positioning**: `relative`, `absolute` (with `top`, `right`, `bottom`, `left`)

### 3.3 Native Platform Binding Strategy
1. **iOS (`YogaKit`)**:
   - `UIView` extension exposing `.yoga` property (`YGLayout`).
   - `view.yoga.isEnabled = YES;`
   - Configures styles on `view.yoga`.
   - `[view.yoga applyLayoutPreservingOrigin:YES];`

2. **Android (`facebook/yoga`)**:
   - Uses `YogaNode` tree backed by C++ `YGNodeRef`.
   - Maps `YogaNode` dimensions to Android `View.layout(left, top, right, bottom)`.

---

## 4. Visual Editor Architecture & End-to-End Workflow

```
 +-----------------------------------------------------------------------+
 |                         Visual UI Editor                              |
 |  - Canvas Viewport (Yoga Flexbox Layout Engine JS/Wasm Preview)        |
 |  - Component Tree Explorer & Property Inspector                        |
 |  - Device Viewports (iPhone, Android Phone, Tablet)                   |
 +-----------------------------------------------------------------------+
                                    |
                                    v [Generates Schema JSON]
 +-----------------------------------------------------------------------+
 |                        Layout JSON Schema                             |
 |  - Node hierarchy with responsive styles                              |
 |  - Native Component mapping (Container, Text, Image, Button, Input)  |
 |  - DartNative Event Bindings (onClick, onChange, onInit)              |
 +-----------------------------------------------------------------------+
                                    |
                                    v [CLI Generator Tool]
      +-----------------------------+-----------------------------+
      |                                                           |
      v                                                           v
 +-----------------------------+             +----------------------------------+
 |  Dart Logic Controllers     |             | Native UI View Generators        |
 |  - Interface dynamic calls  |             | - iOS Objective-C / Swift        |
 |  - Event handlers & state   |             |   (YogaKit + UIViews)            |
 |  - Core business logic      |             | - Android Java / Kotlin          |
 +-----------------------------+             |   (YogaNode + Android Views)     |
                                             +----------------------------------+
```

### 4.1 Key Design Principles
1. **Separation of Concerns**: Layout structures and styles are stored declaratively; native view generators create the platform views; Dart code contains the reactive state and business logic.
2. **Dynamic UI Capabilities**: The layout schema JSON can be packaged into the app or fetched dynamically over the wire (Server-Driven UI), allowing UI layout updates without submitting app store updates.
3. **High Performance**: Native components render natively with hardware acceleration, while layout computation is performed at native speed by C++ Yoga.
