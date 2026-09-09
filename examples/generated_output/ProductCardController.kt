// ProductCardController.kt - Generated Kotlin + Yoga Layout for Android
package com.example.nativeui

import android.content.Context
import com.facebook.yoga.YogaNodeFactory
import com.facebook.yoga.YogaFlexDirection
import com.dartnative.dart_native.DartNativeInterface
import com.dartnative.dart_native.annotation.InterfaceEntry
import com.dartnative.dart_native.annotation.InterfaceMethod

@InterfaceEntry(name = "ProductCardController")
class ProductCardController : DartNativeInterface() {

    @InterfaceMethod(name = "renderLayout")
    fun renderLayout(layoutData: Map<String, Any>): Boolean {
        val rootNode = YogaNodeFactory.create()
        rootNode.flexDirection = YogaFlexDirection.COLUMN

        // Yoga native layout calculation
        rootNode.calculateLayout(1080f, 2340f)
        return true
    }
}
