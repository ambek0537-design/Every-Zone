import 'package:flutter/material.dart';

enum EZDeviceType {
  phone,
  tablet,
  foldable,
  desktop,
}

class EZResponsive extends StatelessWidget {
  final Widget phone;
  final Widget? tablet;
  final Widget? foldable;
  final Widget? desktop;

  const EZResponsive({
    super.key,
    required this.phone,
    this.tablet,
    this.foldable,
    this.desktop,
  });

  // Breakpoints
  static const double mobileMax = 600.0;
  static const double tabletMax = 900.0;
  static const double foldableMax = 1200.0;

  static EZDeviceType getDeviceType(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    if (width < mobileMax) {
      return EZDeviceType.phone;
    } else if (width < tabletMax) {
      return EZDeviceType.tablet;
    } else if (width < foldableMax) {
      return EZDeviceType.foldable;
    } else {
      return EZDeviceType.desktop;
    }
  }

  static bool isPhone(BuildContext context) => getDeviceType(context) == EZDeviceType.phone;
  static bool isTablet(BuildContext context) => getDeviceType(context) == EZDeviceType.tablet;
  static bool isFoldable(BuildContext context) => getDeviceType(context) == EZDeviceType.foldable;
  static bool isDesktop(BuildContext context) => getDeviceType(context) == EZDeviceType.desktop;

  static double responsiveWidth(BuildContext context, {required double phone, double? tablet, double? desktop}) {
    final type = getDeviceType(context);
    switch (type) {
      case EZDeviceType.phone:
        return phone;
      case EZDeviceType.tablet:
      case EZDeviceType.foldable:
        return tablet ?? phone;
      case EZDeviceType.desktop:
        return desktop ?? tablet ?? phone;
    }
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= foldableMax) {
          return desktop ?? foldable ?? tablet ?? phone;
        }
        if (constraints.maxWidth >= tabletMax) {
          return foldable ?? tablet ?? phone;
        }
        if (constraints.maxWidth >= mobileMax) {
          return tablet ?? phone;
        }
        return phone;
      },
    );
  }
}

// Convenient Extension for elegant BuildContext access
extension EZResponsiveExtension on BuildContext {
  EZDeviceType get deviceType => EZResponsive.getDeviceType(this);
  bool get isPhone => EZResponsive.isPhone(this);
  bool get isTablet => EZResponsive.isTablet(this);
  bool get isFoldable => EZResponsive.isFoldable(this);
  bool get isDesktop => EZResponsive.isDesktop(this);

  double get screenWidth => MediaQuery.of(this).size.width;
  double get screenHeight => MediaQuery.of(this).size.height;
}
