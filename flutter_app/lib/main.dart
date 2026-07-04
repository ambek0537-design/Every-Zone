import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'features/splash/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const EveryZoneApp());
}

class EveryZoneApp extends StatelessWidget {
  const EveryZoneApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Every-zone Super App',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark, // Always dark mode by default
      darkTheme: AppTheme.darkTheme,
      home: const SplashScreen(),
    );
  }
}
