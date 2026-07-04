import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/custom_button.dart';
import '../../core/widgets/custom_text_field.dart';
import '../shell/main_app_shell.dart';
import 'forgot_password_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      // Mocking 1 second network loading latency for professional touch
      Future.delayed(const Duration(milliseconds: 1000), () {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
          // Go to Main App Shell (bottom nav container)
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => const MainAppShell()),
            (route) => false,
          );
        }
      });
    }
  }

  void _handleGuestMode() {
    // Immediate bypass with guest identifier
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const MainAppShell()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary, size: 20),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Container(
        color: AppColors.background,
        child: SafeArea(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 20),
                  // App branding token
                  Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          gradient: AppColors.goldGradient,
                        ),
                        alignment: Alignment.center,
                        child: const Text(
                          '✦',
                          style: TextStyle(
                            fontSize: 22,
                            color: AppColors.background,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'WELCOME BACK',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.black,
                              letterSpacing: 2.0,
                              color: AppColors.goldLight,
                            ),
                          ),
                          Text(
                            'Every-zone Luxury Portal',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textMuted,
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                  const SizedBox(height: 40),

                  // Header message
                  Text(
                    'Sign In',
                    style: Theme.of(context).textTheme.displayMedium,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Access your customized marketplace, real estate bids, and biometric escrow assets.',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 36),

                  // Large input fields matching the search-like UI spec
                  CustomTextField(
                    labelText: 'PHONE NUMBER',
                    hintText: 'e.g., +251 911 00 0000',
                    prefixIcon: Icons.phone_android_outlined,
                    keyboardType: TextInputType.phone,
                    controller: _phoneController,
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'Phone number is required';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  CustomTextField(
                    labelText: 'PASSWORD',
                    hintText: 'Enter your account security key',
                    prefixIcon: Icons.lock_outline,
                    isPassword: true,
                    controller: _passwordController,
                    validator: (val) {
                      if (val == null || val.isEmpty) {
                        return 'Password is required';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 14),

                  // Forgot Password Action trigger
                  Align(
                    alignment: Alignment.centerRight,
                    child: GestureDetector(
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (context) => const ForgotPasswordScreen()),
                        );
                      },
                      child: const Text(
                        'Forgot Password?',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.goldLight,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Core Login CTA Button
                  CustomButton(
                    text: 'LOGIN NOW',
                    onPressed: _handleLogin,
                    isLoading: _isLoading,
                  ),
                  const SizedBox(height: 14),

                  // Continue as Guest Option (Bypasses verification to main app shell)
                  CustomButton(
                    text: 'CONTINUE AS GUEST',
                    type: ButtonType.text,
                    onPressed: _handleGuestMode,
                  ),
                  const SizedBox(height: 40),

                  // Bottom footer redirection for Registration
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        "Don't have an account? ",
                        style: TextStyle(
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute(builder: (context) => const RegisterScreen()),
                          );
                        },
                        child: const Text(
                          'Create Account',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.black,
                            color: AppColors.goldLight,
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
