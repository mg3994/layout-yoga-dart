// ProductCardController.m - Generated Objective-C + YogaKit View for iOS
#import <UIKit/UIKit.h>
#import <YogaKit/UIView+Yoga.h>
#import <dart_native/DNInterface.h>

@interface ProductCardController : NSObject
@end

@implementation ProductCardController

InterfaceEntry(ProductCardController)

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
