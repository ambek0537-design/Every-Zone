import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../onboarding/onboarding_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.7, curve: Curves.easeIn),
      ),
    );

    _scaleAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.8, curve: Curves.elasticOut),
      ),
    );

    _animationController.forward();

    // Auto-navigate after 2 seconds (giving extra 500ms for animations to fully settle)
    Timer(const Duration(milliseconds: 2500), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) => const OnboardingScreen(),
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              return FadeTransition(opacity: animation, child: child);
            },
            transitionDuration: const Duration(milliseconds: 500),
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          color: AppColors.background,
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Elegant background lighting
            Positioned(
              top: -100,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.goldDark.withOpacity(0.08),
                  physics: const NeverScrollableScrollPhysics(), // stub or ignore
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.goldDark.withOpacity(0.12),
                      blurRadius: 100,
                      spreadRadius: 50,
                    )
                  ],
                ),
              ),
            ),
            
            // Core centered branding content
            AnimatedBuilder(
              animation: _animationController,
              builder: (context, child) {
                return Opacity(
                  opacity: _fadeAnimation.value,
                  child: Transform.scale(
                    scale: _scaleAnimation.value,
                    child: child,
                  ),
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Gold Luxury Diamond Shield Logo
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(24),
                      gradient: AppColors.goldGradient,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.goldDark.withOpacity(0.35),
                          blurRadius: 24,
                          offset: const Offset(0, 8),
                        )
                      ],
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      '✦',
                      style: TextStyle(
                        fontSize: 48,
                        color: AppColors.background,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // App Name
                  const Text(
                    'EVERY-ZONE',
                    style: TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.black,
                      letterSpacing: 4.0,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  
                  // Premium Subtitle
                  const Text(
                    'Everything in One Zone',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.goldMedium,
                      letterSpacing: 2.0,
                    ),
                  ),
                ],
              ),
            ),
            
            // Loading Animation Indicator at the bottom
            Positioned(
              bottom: 80,
              child: Column(
                children: [
                  SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.0,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppColors.goldMedium.withOpacity(0.7),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'SECURED PORTAL',
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
