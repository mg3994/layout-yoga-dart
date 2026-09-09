// ProductCardController.kt - Generated Kotlin + Yoga Layout for Android
package com.example.nativeui

import android.content.Context
import com.facebook.yoga.YogaNodeFactory
import com.facebook.yoga.YogaFlexDirection
import com.facebook.yoga.YogaJustify
import com.facebook.yoga.YogaEdge
import com.dartnative.dart_native.DartNativeInterface
import com.dartnative.dart_native.annotation.InterfaceEntry
import com.dartnative.dart_native.annotation.InterfaceMethod

@InterfaceEntry(name = "ProductCardController")
class ProductCardController : DartNativeInterface() {

    @InterfaceMethod(name = "renderLayout")
    fun renderLayout(layoutData: Map<String, Any>): Boolean {
        val rootNode = YogaNodeFactory.create()

        // Node: cardRoot (Container)
        val cardRootNode = YogaNodeFactory.create()
        cardRootNode.flexDirection = YogaFlexDirection.COLUMN
        cardRootNode.setPadding(YogaEdge.ALL, 20f)
        rootNode.addChildAt(cardRootNode, rootNode.childCount)
        // Node: productImage (Image)
        val productImageNode = YogaNodeFactory.create()
        productImageNode.setHeight(200f)
        cardRootNode.addChildAt(productImageNode, cardRootNode.childCount)
        // Node: titleRow (Container)
        val titleRowNode = YogaNodeFactory.create()
        titleRowNode.flexDirection = YogaFlexDirection.ROW
        titleRowNode.justifyContent = YogaJustify.SPACE_BETWEEN
        cardRootNode.addChildAt(titleRowNode, cardRootNode.childCount)
        // Node: productTitle (Text)
        val productTitleNode = YogaNodeFactory.create()
        productTitleNode.flexGrow = 1f
        titleRowNode.addChildAt(productTitleNode, titleRowNode.childCount)
        // Node: productPrice (Text)
        val productPriceNode = YogaNodeFactory.create()
        titleRowNode.addChildAt(productPriceNode, titleRowNode.childCount)
        // Node: buyButton (Button)
        val buyButtonNode = YogaNodeFactory.create()
        buyButtonNode.justifyContent = YogaJustify.CENTER
        buyButtonNode.setHeight(44f)
        cardRootNode.addChildAt(buyButtonNode, cardRootNode.childCount)

        // Yoga native layout calculation
        rootNode.calculateLayout(1080f, 2340f)
        return true
    }
}
