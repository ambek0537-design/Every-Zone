import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/custom_button.dart';
import '../../core/widgets/custom_text_field.dart';
import 'otp_verification_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _agreeToTerms = false;
  bool _isLoading = false;
  double _passwordStrength = 0.0; // 0.0 to 1.0
  String _strengthLabel = 'Empty';
  Color _strengthColor = AppColors.textMuted;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  // Reactive Password strength estimation based on characters, digits, and length
  void _evaluatePasswordStrength(String password) {
    if (password.isEmpty) {
      setState(() {
        _passwordStrength = 0.0;
        _strengthLabel = 'Empty';
        _strengthColor = AppColors.textMuted;
      });
      return;
    }

    double score = 0.0;
    if (password.length >= 6) score += 0.3;
    if (password.length >= 10) score += 0.2;
    if (password.contains(RegExp(r'[0-9]'))) score += 0.25;
    if (password.contains(RegExp(r'[A-Z]'))) score += 0.25;

    setState(() {
      _passwordStrength = score;
      if (score <= 0.3) {
        _strengthLabel = 'Weak';
        _strengthColor = AppColors.error;
      } else if (score <= 0.7) {
        _strengthLabel = 'Medium';
        _strengthColor = Colors.orange;
      } else {
        _strengthLabel = 'Strong';
        _strengthColor = AppColors.goldLight;
      }
    });
  }

  void _handleRegister() {
    if (_formKey.currentState!.validate()) {
      if (!_agreeToTerms) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please accept the Terms of Service and Privacy Policy.'),
            backgroundColor: AppColors.error,
          ),
        );
        return;
      }

      setState(() {
        _isLoading = true;
      });

      // Simulate network request
      Future.delayed(const Duration(milliseconds: 1200), () {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
          // Redirect user to OTP Verification flow to secure their mobile number
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => OTPVerificationScreen(
                phoneNumber: _phoneController.text.trim(),
              ),
            ),
          );
        }
      });
    }
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
                  const SizedBox(height: 10),
                  Text(
                    'Create Account',
                    style: Theme.of(context).textTheme.displayMedium,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Register now to join the Every-zone decentralized marketplace network.',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 30),

                  // Double columns for Name fields
                  Row(
                    children: [
                      Expanded(
                        child: CustomTextField(
                          labelText: 'FIRST NAME',
                          hintText: 'John',
                          controller: _firstNameController,
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) {
                              return 'Required';
                            }
                            return null;
                          },
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: CustomTextField(
                          labelText: 'LAST NAME',
                          hintText: 'Doe',
                          controller: _lastNameController,
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) {
                              return 'Required';
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  CustomTextField(
                    labelText: 'PHONE NUMBER',
                    hintText: 'e.g., +251 911 000 000',
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
                    labelText: 'EMAIL ADDRESS (OPTIONAL)',
                    hintText: 'e.g., mail@example.com',
                    prefixIcon: Icons.email_outlined,
                    keyboardType: TextInputType.emailAddress,
                    controller: _emailController,
                  ),
                  const SizedBox(height: 20),

                  CustomTextField(
                    labelText: 'PASSWORD',
                    hintText: 'Choose a strong security key',
                    prefixIcon: Icons.lock_outline,
                    isPassword: true,
                    controller: _passwordController,
                    onChanged: _evaluatePasswordStrength,
                    validator: (val) {
                      if (val == null || val.isEmpty) {
                        return 'Password is required';
                      }
                      if (val.length < 6) {
                        return 'Must be at least 6 characters';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 8),

                  // Interactive Password Strength Indicators
                  Row(
                    children: [
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(2),
                          child: LinearProgressIndicator(
                            value: _passwordStrength,
                            backgroundColor: AppColors.border,
                            valueColor: AlwaysStoppedAnimation<Color>(_strengthColor),
                            minHeight: 4,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        _strengthLabel,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: _strengthColor,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  CustomTextField(
                    labelText: 'CONFIRM PASSWORD',
                    hintText: 'Verify your security key',
                    prefixIcon: Icons.lock_outline,
                    isPassword: true,
                    controller: _confirmPasswordController,
                    validator: (val) {
                      if (val == null || val.isEmpty) {
                        return 'Please confirm password';
                      }
                      if (val != _passwordController.text) {
                        return 'Passwords do not match';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),

                  // Stateful Terms and Conditions Checkbox
                  Row(
                    children: [
                      SizedBox(
                        height: 24,
                        width: 24,
                        child: Checkbox(
                          value: _agreeToTerms,
                          activeColor: AppColors.goldMedium,
                          checkColor: AppColors.background,
                          side: const BorderSide(color: AppColors.border, width: 1.5),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(6),
                          ),
                          onChanged: (bool? val) {
                            setState(() {
                              _agreeToTerms = val ?? false;
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Text(
                          'I agree to the Terms of Service & Privacy Protocol.',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 36),

                  // Core Registration CTA Button
                  CustomButton(
                    text: 'CREATE ACCOUNT',
                    onPressed: _handleRegister,
                    isLoading: _isLoading,
                  ),
                  const SizedBox(height: 32),

                  // Footer Redirect
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        "Already have an account? ",
                        style: TextStyle(
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.of(context).pop();
                        },
                        child: const Text(
                          'Sign In',
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
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
