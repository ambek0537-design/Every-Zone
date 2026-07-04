import 'package:flutter/material.dart';
import 'ez_colors.dart';
import 'ez_spacing.dart';
import 'ez_typography.dart';

class EZPrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double height;

  const EZPrimaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height = 54.0,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color bg = isDark ? EZColors.backgroundDark : EZColors.backgroundLight;
    final Color textCol = isDark ? EZColors.backgroundDark : Colors.white;

    return Container(
      width: width ?? double.infinity,
      height: height,
      decoration: BoxDecoration(
        borderRadius: EZBorderRadius.medium,
        gradient: onPressed == null ? null : EZColors.goldGradient,
        color: onPressed == null ? EZColors.disabledDark : null,
        boxShadow: onPressed == null
            ? null
            : [
                BoxShadow(
                  color: EZColors.goldDark.withOpacity(0.25),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
      ),
      child: ElevatedButton(
        onPressed: isLoading ? () {} : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: EZBorderRadius.medium,
          ),
        ),
        child: isLoading
            ? SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(textCol),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 18, color: textCol),
                    EZSpacing.w8,
                  ],
                  EZTypography.text(
                    text,
                    styleBuilder: EZTypography.button,
                    color: textCol,
                  ),
                ],
              ),
      ),
    );
  }
}

class EZSecondaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double height;

  const EZSecondaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height = 54.0,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color surfaceColor = isDark ? EZColors.surfaceDark : EZColors.surfaceLight;
    final Color textColor = isDark ? EZColors.blueLight : EZColors.blueMedium;

    return SizedBox(
      width: width ?? double.infinity,
      height: height,
      child: ElevatedButton(
        onPressed: isLoading ? () {} : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: surfaceColor,
          foregroundColor: textColor,
          elevation: 1,
          shadowColor: Colors.black12,
          shape: RoundedRectangleBorder(
            borderRadius: EZBorderRadius.medium,
            side: BorderSide(color: isDark ? EZColors.dividerDark : EZColors.dividerLight),
          ),
        ),
        child: isLoading
            ? SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(textColor),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 18, color: textColor),
                    EZSpacing.w8,
                  ],
                  EZTypography.text(
                    text,
                    styleBuilder: EZTypography.button,
                    color: textColor,
                  ),
                ],
              ),
      ),
    );
  }
}

class EZOutlinedButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double height;

  const EZOutlinedButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height = 54.0,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color textCol = isDark ? EZColors.textPrimaryDark : EZColors.textPrimaryLight;
    final Color borderCol = isDark ? EZColors.dividerDark : EZColors.dividerLight;

    return SizedBox(
      width: width ?? double.infinity,
      height: height,
      child: OutlinedButton(
        onPressed: isLoading ? () {} : onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: textCol,
          side: BorderSide(color: borderCol, width: 1.2),
          shape: RoundedRectangleBorder(
            borderRadius: EZBorderRadius.medium,
          ),
        ),
        child: isLoading
            ? SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(textCol),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 18, color: textCol),
                    EZSpacing.w8,
                  ],
                  EZTypography.text(
                    text,
                    styleBuilder: EZTypography.button,
                    color: textCol,
                  ),
                ],
              ),
      ),
    );
  }
}

class EZTextButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final Color? color;

  const EZTextButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.icon,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color textColor = color ?? (isDark ? EZColors.goldLight : EZColors.goldDark);

    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        foregroundColor: textColor,
        shape: RoundedRectangleBorder(
          borderRadius: EZBorderRadius.small,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 16, color: textColor),
            EZSpacing.w4,
          ],
          EZTypography.text(
            text,
            styleBuilder: EZTypography.button,
            color: textColor,
          ),
        ],
      ),
    );
  }
}

class EZDangerButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double height;

  const EZDangerButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height = 54.0,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? double.infinity,
      height: height,
      child: ElevatedButton(
        onPressed: isLoading ? () {} : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: EZColors.danger,
          foregroundColor: Colors.white,
          elevation: 2,
          shadowColor: EZColors.danger.withOpacity(0.3),
          shape: RoundedRectangleBorder(
            borderRadius: EZBorderRadius.medium,
          ),
        ),
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 18, color: Colors.white),
                    EZSpacing.w8,
                  ],
                  EZTypography.text(
                    text,
                    styleBuilder: EZTypography.button,
                    color: Colors.white,
                  ),
                ],
              ),
      ),
    );
  }
}

class EZSuccessButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double height;

  const EZSuccessButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height = 54.0,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? double.infinity,
      height: height,
      child: ElevatedButton(
        onPressed: isLoading ? () {} : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: EZColors.success,
          foregroundColor: Colors.white,
          elevation: 2,
          shadowColor: EZColors.success.withOpacity(0.3),
          shape: RoundedRectangleBorder(
            borderRadius: EZBorderRadius.medium,
          ),
        ),
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 18, color: Colors.white),
                    EZSpacing.w8,
                  ],
                  EZTypography.text(
                    text,
                    styleBuilder: EZTypography.button,
                    color: Colors.white,
                  ),
                ],
              ),
      ),
    );
  }
}

class EZIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;
  final Color? color;
  final double size;
  final double touchArea;

  const EZIconButton({
    super.key,
    required this.icon,
    required this.onPressed,
    this.color,
    this.size = 20.0,
    this.touchArea = 44.0,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color finalColor = color ?? (isDark ? EZColors.textPrimaryDark : EZColors.textPrimaryLight);

    return InkWell(
      onTap: onPressed,
      borderRadius: EZBorderRadius.circular,
      child: Container(
        width: touchArea,
        height: touchArea,
        alignment: Alignment.center,
        child: Icon(
          icon,
          color: finalColor,
          size: size,
        ),
      ),
    );
  }
}

class EZFloatingActionButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;
  final String? tooltip;

  const EZFloatingActionButton({
    super.key,
    required this.icon,
    required this.onPressed,
    this.tooltip,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: EZColors.goldGradient,
        boxShadow: [
          BoxShadow(
            color: EZColors.goldDark.withOpacity(0.4),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: FloatingActionButton(
        onPressed: onPressed,
        tooltip: tooltip,
        backgroundColor: Colors.transparent,
        foregroundColor: EZColors.backgroundDark,
        elevation: 0,
        focusElevation: 0,
        highlightElevation: 0,
        hoverElevation: 0,
        shape: const CircleBorder(),
        child: Icon(icon, size: 24),
      ),
    );
  }
}
