import 'package:flutter/material.dart';

class EZColors {
  // Primary Gold Accents (Ethiopian Premium Design)
  static const Color goldDark = Color(0xFF916E2E);
  static const Color goldMedium = Color(0xFFC5A059);
  static const Color goldLight = Color(0xFFE2B755);

  // Secondary Blue (High-fidelity contrasting Sapphire/Indigo)
  static const Color blueDark = Color(0xFF1E3A8A);
  static const Color blueMedium = Color(0xFF2563EB);
  static const Color blueLight = Color(0xFF60A5FA);

  // Status & Utility Colors
  static const Color success = Color(0xFF10B981);
  static const Color successLight = Color(0xDFF0FDF4); // for badges/tint
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningLight = Color(0xDFFFFBEB);
  static const Color danger = Color(0xFFEF4444);
  static const Color dangerLight = Color(0xDFFFEFEE);
  static const Color info = Color(0xFF06B6D4);
  static const Color infoLight = Color(0xDFFECFEF9);

  // Neutral Dark Theme Colors
  static const Color backgroundDark = Color(0xFF09090B); // Ultra dark zinc
  static const Color surfaceDark = Color(0xFF131316);    // Elevated dark surface
  static const Color cardDark = Color(0xFF1A1A20);       // Cards & Modals
  static const Color dividerDark = Color(0xFF27272A);    // Subtle border grey
  static const Color disabledDark = Color(0xFF3F3F46);   // Disabled grey
  static const Color textPrimaryDark = Color(0xFFF4F4F5);
  static const Color textSecondaryDark = Color(0xFFA1A1AA);
  static const Color textMutedDark = Color(0xFF71717A);

  // Neutral Light Theme Colors
  static const Color backgroundLight = Color(0xFFFAFAFA); // Crisp white-grey
  static const Color surfaceLight = Color(0xFFFFFFFF);    // Absolute white
  static const Color cardLight = Color(0xFFF4F4F5);       // Soft grey card
  static const Color dividerLight = Color(0xFFE4E4E7);    // Border grey
  static const Color disabledLight = Color(0xFFD4D4D8);   // Disabled grey
  static const Color textPrimaryLight = Color(0xFF18181B);
  static const Color textSecondaryLight = Color(0xFF52525B);
  static const Color textMutedLight = Color(0xFF8F90A6);

  // Gradients
  static const Gradient goldGradient = LinearGradient(
    colors: [goldDark, goldMedium, goldLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const Gradient blueGradient = LinearGradient(
    colors: [blueDark, blueMedium, blueLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const Gradient darkSurfaceGradient = LinearGradient(
    colors: [surfaceDark, backgroundDark],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const Gradient lightSurfaceGradient = LinearGradient(
    colors: [surfaceLight, backgroundLight],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
