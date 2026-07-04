import 'package:flutter/material.dart';
import 'ez_colors.dart';

class EZTypography {
  // Support English / Amharic / RTL
  // Amharic requires a slightly larger height multiplier to avoid clipping Ge'ez characters.
  static const double _amharicHeightMultiplier = 1.35;
  static const double _englishHeightMultiplier = 1.2;

  // Primary Font Families
  static const String sansFontFamily = 'Inter';
  static const String monoFontFamily = 'JetBrains Mono';

  // Base TextStyle Generator with responsive language & RTL adjustments
  static TextStyle _baseStyle({
    required double fontSize,
    required FontWeight fontWeight,
    required Color color,
    double letterSpacing = 0.0,
    bool isAmharic = false,
  }) {
    return TextStyle(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      letterSpacing: isAmharic ? 0.0 : letterSpacing,
      height: isAmharic ? _amharicHeightMultiplier : _englishHeightMultiplier,
      fontFamily: isAmharic ? 'sans-serif' : sansFontFamily,
    );
  }

  // Display Large
  static TextStyle displayLarge({Color color = EZColors.textPrimaryDark, bool isAmharic = false}) {
    return _baseStyle(
      fontSize: 32.0,
      fontWeight: FontWeight.black,
      color: color,
      letterSpacing: -1.0,
      isAmharic: isAmharic,
    );
  }

  // Display Medium
  static TextStyle displayMedium({Color color = EZColors.textPrimaryDark, bool isAmharic = false}) {
    return _baseStyle(
      fontSize: 24.0,
      fontWeight: FontWeight.extrabold,
      color: color,
      letterSpacing: -0.5,
      isAmharic: isAmharic,
    );
  }

  // Headline
  static TextStyle headline({Color color = EZColors.textPrimaryDark, bool isAmharic = false}) {
    return _baseStyle(
      fontSize: 20.0,
      fontWeight: FontWeight.bold,
      color: color,
      letterSpacing: -0.2,
      isAmharic: isAmharic,
    );
  }

  // Title
  static TextStyle title({Color color = EZColors.textPrimaryDark, bool isAmharic = false}) {
    return _baseStyle(
      fontSize: 16.0,
      fontWeight: FontWeight.w600,
      color: color,
      isAmharic: isAmharic,
    );
  }

  // Body
  static TextStyle body({Color color = EZColors.textSecondaryDark, bool isAmharic = false}) {
    return _baseStyle(
      fontSize: 14.0,
      fontWeight: FontWeight.normal,
      color: color,
      isAmharic: isAmharic,
    );
  }

  // Caption
  static TextStyle caption({Color color = EZColors.textMutedDark, bool isAmharic = false}) {
    return _baseStyle(
      fontSize: 11.0,
      fontWeight: FontWeight.normal,
      color: color,
      isAmharic: isAmharic,
    );
  }

  // Button
  static TextStyle button({Color color = Colors.black, bool isAmharic = false}) {
    return _baseStyle(
      fontSize: 13.0,
      fontWeight: FontWeight.black,
      letterSpacing: 0.8,
      isAmharic: isAmharic,
    );
  }

  // Label
  static TextStyle label({Color color = EZColors.goldLight, bool isAmharic = false}) {
    return _baseStyle(
      fontSize: 10.0,
      fontWeight: FontWeight.bold,
      letterSpacing: 1.2,
      isAmharic: isAmharic,
    );
  }

  // Dual Language Widget wrapper to auto-detect Amharic text patterns and apply styling
  static Widget text(
    String textStr, {
    TextStyle Function({Color color, bool isAmharic})? styleBuilder,
    TextStyle? customStyle,
    Color? color,
    TextAlign? textAlign,
    int? maxLines,
    TextOverflow? overflow,
    TextDirection? textDirection,
  }) {
    final bool isAmharic = _detectAmharic(textStr);
    final TextDirection direction = textDirection ?? (isAmharic ? TextDirection.ltr : TextDirection.ltr);

    TextStyle resolvedStyle;
    if (customStyle != null) {
      resolvedStyle = customStyle.copyWith(
        height: isAmharic ? _amharicHeightMultiplier : customStyle.height,
      );
    } else {
      final builder = styleBuilder ?? body;
      resolvedStyle = builder(
        color: color ?? EZColors.textPrimaryDark,
        isAmharic: isAmharic,
      );
    }

    return Text(
      textStr,
      style: resolvedStyle,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
      textDirection: direction,
    );
  }

  // Standard helper to detect if string contains Ge'ez unicode blocks (Amharic)
  static bool _detectAmharic(String input) {
    for (int i = 0; i < input.length; i++) {
      int codeUnit = input.codeUnitAt(i);
      // Ge'ez Unicode Block is between 0x1200 and 0x137F
      if (codeUnit >= 0x1200 && codeUnit <= 0x137F) {
        return true;
      }
    }
    return false;
  }
}
