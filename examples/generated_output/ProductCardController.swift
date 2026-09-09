// ProductCardController.swift - Generated Swift + YogaKit View for iOS
import UIKit
import YogaKit
import dart_native

@objc(ProductCardController)
public class ProductCardController: NSObject {

    @objc public func renderLayout(_ layoutData: [String: Any]) -> Bool {
        DispatchQueue.main.async {
            guard let window = UIApplication.shared.windows.first(where: { $0.isKeyWindow }),
                  let rootView = window.rootViewController?.view else { return }

            // Node: cardRoot (Container)
            rootView.configureLayout { layout in
                layout.isEnabled = true
                layout.flexDirection = .column
                layout.padding = YGValue(20)
            }
            // Node: productImage (Image)
            rootView.configureLayout { layout in
                layout.isEnabled = true
                layout.width = YGValue(rootView.bounds.width)
                layout.height = YGValue(200)
            }
            // Node: titleRow (Container)
            rootView.configureLayout { layout in
                layout.isEnabled = true
                layout.flexDirection = .row
                layout.justifyContent = .spaceBetween
                layout.alignItems = .center
            }
            // Node: productTitle (Text)
            rootView.configureLayout { layout in
                layout.isEnabled = true
                layout.flexGrow = 1
            }
            // Node: productPrice (Text)
            rootView.configureLayout { layout in
                layout.isEnabled = true
            }
            // Node: buyButton (Button)
            rootView.configureLayout { layout in
                layout.isEnabled = true
                layout.justifyContent = .center
                layout.alignItems = .center
                layout.height = YGValue(44)
            }

            rootView.yoga.applyLayout(preservingOrigin: true)
        }
        return true
    }
}
