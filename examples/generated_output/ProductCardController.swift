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

            rootView.configureLayout { layout in
                layout.isEnabled = true
                layout.flexDirection = .column
                layout.width = YGValue(rootView.bounds.width)
                layout.height = YGValue(rootView.bounds.height)
            }

            rootView.yoga.applyLayout(preservingOrigin: true)
        }
        return true
    }
}
