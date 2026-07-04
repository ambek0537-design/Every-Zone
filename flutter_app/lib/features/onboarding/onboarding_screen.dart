import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/custom_button.dart';
import '../auth/login_screen.dart';
import '../auth/register_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<OnboardingPageData> _pages = [
    OnboardingPageData(
      emoji: '🛒',
      title: 'Shop Everything',
      description: 'Buy high-quality products and unique local items from verified vendors across standard categories.',
    ),
    OnboardingPageData(
      emoji: '🏠',
      title: 'Find Houses',
      description: 'Rent, buy, or save beautiful properties with secure down-payment options and visual walkthroughs.',
    ),
    OnboardingPageData(
      emoji: '🌍',
      title: 'Work Abroad',
      description: 'Safely apply for overseas career paths with verified local recruitment agencies and track statuses.',
    ),
    OnboardingPageData(
      emoji: '💳',
      title: 'Secure Wallet',
      description: 'Enjoy frictionless peer-to-peer money transfers, deposits, bills payments, and protected escrows.',
    ),
    OnboardingPageData(
      emoji: '🎉',
      title: 'Welcome to Every-zone',
      description: 'Experience Ethiopia\'s unified premier digital ecosystem. Let\'s secure your luxury journey now.',
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _navigateToLogin() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => const LoginScreen()),
    );
  }

  void _navigateToRegister() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => const RegisterScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isLastPage = _currentIndex == _pages.length - 1;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          color: AppColors.background,
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header Row with Skip button (hidden on last page)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Brand Badge
                    Row(
                      children: [
                        const Text(
                          '✦',
                          style: TextStyle(
                            color: AppColors.goldMedium,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'EVERY-ZONE',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 2.0,
                            color: AppColors.textPrimary.withOpacity(0.9),
                          ),
                        ),
                      ],
                    ),
                    // Skip button
                    if (!isLastPage)
                      GestureDetector(
                        onTap: () {
                          _pageController.animateToPage(
                            _pages.length - 1,
                            duration: const Duration(milliseconds: 500),
                            curve: Curves.easeInOut,
                          );
                        },
                        child: const Text(
                          'SKIP',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.black,
                            color: AppColors.goldMedium,
                            letterSpacing: 1.0,
                          ),
                        ),
                      )
                    else
                      const SizedBox(width: 30),
                  ],
                ),
              ),

              // Dynamic content sliders
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: _pages.length,
                  onPageChanged: (index) {
                    setState(() {
                      _currentIndex = index;
                    });
                  },
                  itemBuilder: (context, index) {
                    final item = _pages[index];
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          // Floating Graphic Box with Glow
                          Container(
                            width: 140,
                            height: 140,
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(32),
                              border: Border.all(
                                color: AppColors.border,
                                width: 1.5,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.goldDark.withOpacity(0.05),
                                  blurRadius: 30,
                                  spreadRadius: 5,
                                )
                              ],
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              item.emoji,
                              style: const TextStyle(fontSize: 54),
                            ),
                          ),
                          const SizedBox(height: 48),

                          // Heading
                          Text(
                            item.title,
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.displayMedium,
                          ),
                          const SizedBox(height: 16),

                          // Description
                          Text(
                            item.description,
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  height: 1.5,
                                  fontSize: 13.5,
                                ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),

              // Bottom control panel (Progress dots and actions)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                child: Column(
                  children: [
                    // Dot indicators
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        _pages.length,
                        (index) => AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: _currentIndex == index ? 24 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(4),
                            color: _currentIndex == index
                                ? AppColors.goldMedium
                                : AppColors.border,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 36),

                    // Navigation buttons
                    if (!isLastPage)
                      CustomButton(
                        text: 'CONTINUE',
                        onPressed: () {
                          _pageController.nextPage(
                            duration: const Duration(milliseconds: 400),
                            curve: Curves.easeInOut,
                          );
                        },
                      )
                    else ...[
                      // Welcome Page dual actions
                      CustomButton(
                        text: 'LOGIN TO ACCOUNT',
                        onPressed: _navigateToLogin,
                      ),
                      const SizedBox(height: 12),
                      CustomButton(
                        text: 'CREATE NEW ACCOUNT',
                        type: ButtonType.outline,
                        onPressed: _navigateToRegister,
                      ),
                    ],
                    const SizedBox(height: 12),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}

class OnboardingPageData {
  final String emoji;
  final String title;
  final String description;

  OnboardingPageData({
    required this.emoji,
    required this.title,
    required this.description,
  });
}
