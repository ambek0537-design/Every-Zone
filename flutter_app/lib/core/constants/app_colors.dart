import 'package:flutter/material.dart';

class AppColors {
  // Premium dark luxury palette
  static const Color background = Color(0xFF09090B); // ultra dark zinc
  static const Color surface = Color(0xFF131316);    // elevated dark surface
  static const Color card = Color(0xFF1A1A20);       // cards & modals
  static const Color border = Color(0xFF27272A);     // subtle border grey

  // Brand Gold Accents (Ethiopian Premium Design)
  static const Color goldDark = Color(0xFF916E2E);
  static const Color goldMedium = Color(0xFFC5A059);
  static const Color goldLight = Color(0xFFE2B755);

  // Status & Utility Colors
  static const Color textPrimary = Color(0xFFF4F4F5);   // off-white
  static const Color textSecondary = Color(0xFFA1A1AA); // muted zinc grey
  static const Color textMuted = Color(0xFF71717A);     // dark zinc grey
  static const Color error = Color(0xFFEF4444);         // status red
  static const Color success = Color(0xFF10B981);       // status green

  // Gradients
  static const Gradient goldGradient = LinearGradient(
    colors: [goldDark, goldMedium, goldLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const Gradient surfaceGradient = LinearGradient(
    colors: [surface, background],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
