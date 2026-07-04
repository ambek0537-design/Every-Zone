import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/custom_button.dart';
import '../shell/main_app_shell.dart';

class OTPVerificationScreen extends StatefulWidget {
  final String phoneNumber;

  const OTPVerificationScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<OTPVerificationScreen> createState() => _OTPVerificationScreenState();
}

class _OTPVerificationScreenState extends State<OTPVerificationScreen> {
  final List<TextEditingController> _pinControllers = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _pinFocusNodes = List.generate(6, (_) => FocusNode());
  
  Timer? _timer;
  int _secondsRemaining = 59;
  bool _canResend = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (var controller in _pinControllers) {
      controller.dispose();
    }
    for (var node in _pinFocusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  void _startTimer() {
    _canResend = false;
    _secondsRemaining = 59;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_secondsRemaining > 0) {
          _secondsRemaining--;
        } else {
          _canResend = true;
          _timer?.cancel();
        }
      });
    });
  }

  void _handleResendCode() {
    if (_canResend) {
      setState(() {
        _startTimer();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('A fresh 6-digit OTP code has been dispatched to ${widget.phoneNumber}.'),
          backgroundColor: AppColors.success,
        ),
      );
    }
  }

  void _handleVerify() {
    final otpCode = _pinControllers.map((c) => c.text).join();
    
    if (otpCode.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please complete the 6-digit code entry.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    // Simulate OTP authorization call
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Mobile device verified successfully. Escrow wallet activated!'),
            backgroundColor: AppColors.success,
          ),
        );

        // Navigate cleanly to Main App Shell with bottom navigation
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => const MainAppShell()),
          (route) => false,
        );
      }
    });
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
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                Text(
                  'Verify Device',
                  style: Theme.of(context).textTheme.displayMedium,
                ),
                const SizedBox(height: 8),
                RichText(
                  text: TextSpan(
                    style: const TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
                    children: [
                      const TextSpan(text: 'We sent a 6-digit security token via SMS to '),
                      TextSpan(
                        text: widget.phoneNumber.isNotEmpty ? widget.phoneNumber : '+251 911 *** ***',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.goldLight),
                      ),
                      const TextSpan(text: '. Enter the code below.'),
                    ],
                  ),
                ),
                const SizedBox(height: 48),

                // 6-digit custom OTP cells with auto focus switching
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(6, (index) {
                    return SizedBox(
                      width: 48,
                      height: 56,
                      child: TextField(
                        controller: _pinControllers[index],
                        focusNode: _pinFocusNodes[index],
                        keyboardType: TextInputType.number,
                        textAlign: TextAlign.center,
                        maxLength: 1,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.black,
                          color: AppColors.goldLight,
                        ),
                        decoration: InputDecoration(
                          counterText: '',
                          contentPadding: EdgeInsets.zero,
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(color: AppColors.border, width: 1.2),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(color: AppColors.goldMedium, width: 1.5),
                          ),
                        ),
                        onChanged: (value) {
                          if (value.isNotEmpty) {
                            if (index < 5) {
                              _pinFocusNodes[index + 1].requestFocus();
                            } else {
                              _pinFocusNodes[index].unfocus();
                            }
                          } else {
                            if (index > 0) {
                              _pinFocusNodes[index - 1].requestFocus();
                            }
                          }
                        },
                      ),
                    );
                  }),
                ),
                const SizedBox(height: 32),

                // Countdown timer and Resend section
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.schedule_outlined,
                      size: 14,
                      color: _canResend ? AppColors.textMuted : AppColors.goldMedium,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      _canResend ? 'Code expired.' : 'Resend code in 0:${_secondsRemaining.toString().padLeft(2, '0')}',
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.bold,
                        color: _canResend ? AppColors.textMuted : AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Center(
                  child: TextButton(
                    onPressed: _canResend ? _handleResendCode : null,
                    child: Text(
                      'RESEND CODE',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.black,
                        letterSpacing: 1.0,
                        color: _canResend ? AppColors.goldLight : AppColors.textMuted,
                      ),
                    ),
                  ),
                ),
                const Spacer(),

                // Verify Action Button
                CustomButton(
                  text: 'VERIFY & CONTINUE',
                  onPressed: _handleVerify,
                  isLoading: _isLoading,
                ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
