# Yoga & DartNative Responsive UI Studio 🧘⚡

A cross-platform visual UI editor and code generation tool inspired by **[Yoga Layout](https://www.yogalayout.dev/)** and **[DartNative](https://www.dartnative.com/)**.

Design responsive flexbox mobile layouts visually, inspect flex properties across interactive device viewports (iPhone, Android, Tablet), attach event handlers & reactive state bindings, and compile native bridge UI controllers for iOS and Android with all application logic written in Dart.

---

## 🌟 Features

- 📱 **Interactive Device Viewports**: Real-time flexbox preview canvas supporting iPhone 14 Pro, Pixel 7 Pro, iPad Mini, and Responsive viewport sizes.
- 🧘 **Yoga Flexbox Inspector**: Full visual styling controls for `flexDirection`, `justifyContent`, `alignItems`, `alignSelf`, `flexGrow`, `flexShrink`, `aspectRatio`, padding, margins, and gaps.
- ⚡ **DartNative Integration**: Attach `onClick` handlers, `onChanged` handlers, and `stateBind` reactive properties directly linked to Dart classes via DartNative dynamic interface channels.
- 📊 **Live Mock State Preview**: Define mock JSON state data in the editor and watch state bindings resolve live on the canvas.
- 📁 **Preset Templates**: Built-in responsive templates for Profile Dashboards, Login Screens, and Settings Menus.
- ↩️ **Undo/Redo & Code Copy**: Full history state stack and one-click code copy to clipboard.
- 🛠️ **CLI Generator**: Command-line generator parsing JSON layout schemas into target native wrapper files across Dart, Swift (YogaKit), Kotlin (Yoga), Objective-C, and Java.

---

## 🚀 Quick Start: Visual Studio

To start the local visual editor web application:

```bash
python3 -m http.server 8080 --directory editor
```

Then open `http://localhost:8080` in your browser.

---

## 🛠️ CLI Usage

The repository includes a CLI tool (`cli/bin/generate.js`) to compile layout schema JSON files into native and Dart bridging code.

```bash
# Generate code for all target languages
node cli/bin/generate.js examples/sample_card.json ./output

# Generate code for specific targets only (swift, kotlin, dart)
node cli/bin/generate.js examples/sample_card.json ./output --targets swift,kotlin,dart
```

### Generated Output Files
- **Dart Controller**: `[module_name]_controller.dart` (`Interface` dynamic bridge)
- **iOS Swift View**: `[ModuleName].swift` (`YogaKit`)
- **Android Kotlin View**: `[ModuleName].kt` (`YogaNode`)
- **iOS Obj-C View**: `[ModuleName].m` (`YogaKit` + `DNInterface.h`)
- **Android Java View**: `[ModuleName].java` (`YogaNode` + `DartNativeInterface`)

---

## 🧪 Running Unit Tests

Run the code generator test suite:

```bash
node tests/codegen.test.js
```

---

## 📚 Technical Documentation

For detailed architectural mechanics of the DartNative zero-copy bridge (`objc_msgSend` / JNI interop) and Yoga C++ layout engine bindings, read **[DARTNATIVE_SKILL.md](./DARTNATIVE_SKILL.md)**.
