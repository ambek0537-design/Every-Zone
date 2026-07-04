import 'package:flutter/material.dart';
import 'ez_colors.dart';
import 'ez_spacing.dart';
import 'ez_typography.dart';

class EZTheme {
  // Automatic Theme Mode Selection Helper
  static ThemeMode get automaticThemeMode => ThemeMode.system;

  // Dark Theme
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: EZColors.backgroundDark,
      dividerColor: EZColors.dividerDark,
      primaryColor: EZColors.goldMedium,
      
      colorScheme: const ColorScheme.dark(
        primary: EZColors.goldMedium,
        secondary: EZColors.goldLight,
        background: EZColors.backgroundDark,
        surface: EZColors.surfaceDark,
        error: EZColors.danger,
        onPrimary: Colors.black,
        onSecondary: Colors.black,
        onBackground: EZColors.textPrimaryDark,
        onSurface: EZColors.textPrimaryDark,
      ),

      // Text Theme
      textTheme: TextTheme(
        displayLarge: EZTypography.displayLarge(color: EZColors.textPrimaryDark),
        displayMedium: EZTypography.displayMedium(color: EZColors.textPrimaryDark),
        headlineLarge: EZTypography.headline(color: EZColors.textPrimaryDark),
        titleLarge: EZTypography.title(color: EZColors.textPrimaryDark),
        bodyLarge: EZTypography.body(color: EZColors.textPrimaryDark),
        bodyMedium: EZTypography.body(color: EZColors.textSecondaryDark),
        labelLarge: EZTypography.button(color: Colors.black),
        labelSmall: EZTypography.label(color: EZColors.goldLight),
      ),

      // InputDecoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: EZColors.surfaceDark,
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        hintStyle: const TextStyle(
          fontSize: 13,
          color: EZColors.textMutedDark,
          fontWeight: FontWeight.w500,
        ),
        labelStyle: const TextStyle(
          fontSize: 13,
          color: EZColors.textSecondaryDark,
          fontWeight: FontWeight.w500,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: EZBorderRadius.medium, // Medium: 18px
          borderSide: const BorderSide(color: EZColors.dividerDark, width: 1.2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: EZBorderRadius.medium,
          borderSide: const BorderSide(color: EZColors.goldMedium, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: EZBorderRadius.medium,
          borderSide: const BorderSide(color: EZColors.danger, width: 1.2),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: EZBorderRadius.medium,
          borderSide: const BorderSide(color: EZColors.danger, width: 1.5),
        ),
      ),

      // ElevatedButton Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: EZColors.goldMedium,
          foregroundColor: Colors.black,
          elevation: 4,
          shadowColor: EZColors.goldDark.withOpacity(0.3),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: EZBorderRadius.medium,
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.black,
            letterSpacing: 0.5,
          ),
        ),
      ),

      // OutlinedButton Theme
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: EZColors.textPrimaryDark,
          side: const BorderSide(color: EZColors.dividerDark, width: 1.2),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: EZBorderRadius.medium,
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      // BottomNavigationBar Theme
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: EZColors.surfaceDark,
        selectedItemColor: EZColors.goldLight,
        unselectedItemColor: EZColors.textMutedDark,
        selectedLabelStyle: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
        unselectedLabelStyle: TextStyle(fontSize: 10, fontWeight: FontWeight.normal),
        type: BottomNavigationBarType.fixed,
        elevation: 12,
      ),
    );
  }

  // Light Theme
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: EZColors.backgroundLight,
      dividerColor: EZColors.dividerLight,
      primaryColor: EZColors.goldDark,
      
      colorScheme: const ColorScheme.light(
        primary: EZColors.goldDark,
        secondary: EZColors.goldMedium,
        background: EZColors.backgroundLight,
        surface: EZColors.surfaceLight,
        error: EZColors.danger,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onBackground: EZColors.textPrimaryLight,
        onSurface: EZColors.textPrimaryLight,
      ),

      // Text Theme
      textTheme: TextTheme(
        displayLarge: EZTypography.displayLarge(color: EZColors.textPrimaryLight),
        displayMedium: EZTypography.displayMedium(color: EZColors.textPrimaryLight),
        headlineLarge: EZTypography.headline(color: EZColors.textPrimaryLight),
        titleLarge: EZTypography.title(color: EZColors.textPrimaryLight),
        bodyLarge: EZTypography.body(color: EZColors.textPrimaryLight),
        bodyMedium: EZTypography.body(color: EZColors.textSecondaryLight),
        labelLarge: EZTypography.button(color: Colors.white),
        labelSmall: EZTypography.label(color: EZColors.goldDark),
      ),

      // InputDecoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: EZColors.surfaceLight,
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        hintStyle: const TextStyle(
          fontSize: 13,
          color: EZColors.textMutedLight,
          fontWeight: FontWeight.w500,
        ),
        labelStyle: const TextStyle(
          fontSize: 13,
          color: EZColors.textSecondaryLight,
          fontWeight: FontWeight.w500,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: EZBorderRadius.medium, // Medium: 18px
          borderSide: const BorderSide(color: EZColors.dividerLight, width: 1.2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: EZBorderRadius.medium,
          borderSide: const BorderSide(color: EZColors.goldDark, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: EZBorderRadius.medium,
          borderSide: const BorderSide(color: EZColors.danger, width: 1.2),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: EZBorderRadius.medium,
          borderSide: const BorderSide(color: EZColors.danger, width: 1.5),
        ),
      ),

      // ElevatedButton Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: EZColors.goldDark,
          foregroundColor: Colors.white,
          elevation: 4,
          shadowColor: EZColors.goldDark.withOpacity(0.15),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: EZBorderRadius.medium,
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.black,
            letterSpacing: 0.5,
          ),
        ),
      ),

      // OutlinedButton Theme
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: EZColors.textPrimaryLight,
          side: const BorderSide(color: EZColors.dividerLight, width: 1.2),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: EZBorderRadius.medium,
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      // BottomNavigationBar Theme
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: EZColors.surfaceLight,
        selectedItemColor: EZColors.goldDark,
        unselectedItemColor: EZColors.textMutedLight,
        selectedLabelStyle: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
        unselectedLabelStyle: TextStyle(fontSize: 10, fontWeight: FontWeight.normal),
        type: BottomNavigationBarType.fixed,
        elevation: 12,
      ),
    );
  }
}
