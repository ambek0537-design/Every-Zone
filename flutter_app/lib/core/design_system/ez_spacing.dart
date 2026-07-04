import 'package:flutter/material.dart';

class EZSpacing {
  // Spacing values
  static const double xs = 4.0;
  static const double s = 8.0;
  static const double sm = 12.0;
  static const double m = 16.0;
  static const double ml = 20.0;
  static const double l = 24.0;
  static const double xl = 32.0;
  static const double xxl = 40.0;
  static const double xxxl = 48.0;
  static const double max = 64.0;

  // Sizedbox spacing helpers (Height)
  static const Widget h4 = SizedBox(height: xs);
  static const Widget h8 = SizedBox(height: s);
  static const Widget h12 = SizedBox(height: sm);
  static const Widget h16 = SizedBox(height: m);
  static const Widget h20 = SizedBox(height: ml);
  static const Widget h24 = SizedBox(height: l);
  static const Widget h32 = SizedBox(height: xl);
  static const Widget h40 = SizedBox(height: xxl);
  static const Widget h48 = SizedBox(height: xxxl);
  static const Widget h64 = SizedBox(height: max);

  // Sizedbox spacing helpers (Width)
  static const Widget w4 = SizedBox(width: xs);
  static const Widget w8 = SizedBox(width: s);
  static const Widget w12 = SizedBox(width: sm);
  static const Widget w16 = SizedBox(width: m);
  static const Widget w20 = SizedBox(width: ml);
  static const Widget w24 = SizedBox(width: l);
  static const Widget w32 = SizedBox(width: xl);
  static const Widget w40 = SizedBox(width: xxl);
  static const Widget w48 = SizedBox(width: xxxl);
  static const Widget w64 = SizedBox(width: max);

  // Padding helpers
  static const EdgeInsets padAllXs = EdgeInsets.all(xs);
  static const EdgeInsets padAllS = EdgeInsets.all(s);
  static const EdgeInsets padAllSm = EdgeInsets.all(sm);
  static const EdgeInsets padAllM = EdgeInsets.all(m);
  static const EdgeInsets padAllMl = EdgeInsets.all(ml);
  static const EdgeInsets padAllL = EdgeInsets.all(l);
  static const EdgeInsets padAllXl = EdgeInsets.all(xl);

  // Symmetric padding helpers
  static const EdgeInsets padH_S = EdgeInsets.symmetric(horizontal: s);
  static const EdgeInsets padH_M = EdgeInsets.symmetric(horizontal: m);
  static const EdgeInsets padH_L = EdgeInsets.symmetric(horizontal: l);
  static const EdgeInsets padV_S = EdgeInsets.symmetric(vertical: s);
  static const EdgeInsets padV_M = EdgeInsets.symmetric(vertical: m);
  static const EdgeInsets padV_L = EdgeInsets.symmetric(vertical: l);
}

class EZBorderRadius {
  // Radius values
  static const double smallVal = 12.0;
  static const double mediumVal = 18.0;
  static const double largeVal = 22.0;
  static const double extraVal = 30.0;
  static const double circularVal = 999.0;

  // BorderRadius objects
  static final BorderRadius small = BorderRadius.circular(smallVal);
  static final BorderRadius medium = BorderRadius.circular(mediumVal);
  static final BorderRadius large = BorderRadius.circular(largeVal);
  static final BorderRadius extra = BorderRadius.circular(extraVal);
  static final BorderRadius circular = BorderRadius.circular(circularVal);

  // Radius geometries
  static const Radius radSmall = Radius.circular(smallVal);
  static const Radius radMedium = Radius.circular(mediumVal);
  static const Radius radLarge = Radius.circular(largeVal);
  static const Radius radExtra = Radius.circular(extraVal);
  static const Radius radCircular = Radius.circular(circularVal);
}
