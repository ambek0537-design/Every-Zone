import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

enum ButtonType { primary, outline, text }

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final ButtonType type;
  final bool isLoading;
  final IconData? icon;
  final double? width;

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.type = ButtonType.primary,
    this.isLoading = false,
    this.icon,
    this.width,
  });

  @key
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    Widget buttonContent = Row(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null && !isLoading) ...[
          Icon(icon, size: 18),
          const SizedBox(width: 8),
        ],
        if (isLoading)
          SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2.5,
              valueColor: AlwaysStoppedAnimation<Color>(
                type == ButtonType.primary ? AppColors.background : AppColors.goldLight,
              ),
            ),
          )
        else
          Text(
            text,
            style: theme.textTheme.bodyLarge?.copyWith(
              color: type == ButtonType.primary ? AppColors.background : AppColors.textPrimary,
              fontWeight: FontWeight.black,
              letterSpacing: 0.8,
            ),
          ),
      ],
    );

    return SizedBox(
      width: width ?? double.infinity,
      height: 54, // Consistent luxury touch height
      child: type == ButtonType.primary
          ? Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                gradient: AppColors.goldGradient,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.goldDark.withOpacity(0.25),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ElevatedButton(
                onPressed: isLoading ? null : onPressed,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                ),
                child: buttonContent,
              ),
            )
          : type == ButtonType.outline
              ? OutlinedButton(
                  onPressed: isLoading ? null : onPressed,
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(
                      color: AppColors.border,
                      width: 1.2,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                  ),
                  child: buttonContent,
                )
              : TextButton(
                  onPressed: isLoading ? null : onPressed,
                  child: buttonContent,
                ),
    );
  }
}
