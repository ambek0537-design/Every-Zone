import 'package:flutter/material.dart';
import 'ez_colors.dart';
import 'ez_spacing.dart';
import 'ez_typography.dart';
import 'ez_buttons.dart';

class EZSnackbar {
  static void _showBase({
    required BuildContext context,
    required String message,
    required Color backgroundColor,
    required IconData icon,
    Color textColor = Colors.white,
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: EZBorderRadius.small),
        margin: const EdgeInsets.all(16),
        content: Row(
          children: [
            Icon(icon, color: textColor, size: 20),
            EZSpacing.w12,
            Expanded(
              child: EZTypography.text(
                message,
                styleBuilder: EZTypography.body,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 1. Success
  static void showSuccess(BuildContext context, String message) {
    _showBase(
      context: context,
      message: message,
      backgroundColor: EZColors.success,
      icon: Icons.check_circle_outline,
    );
  }

  // 2. Error
  static void showError(BuildContext context, String message) {
    _showBase(
      context: context,
      message: message,
      backgroundColor: EZColors.danger,
      icon: Icons.error_outline,
    );
  }

  // 3. Information
  static void showInfo(BuildContext context, String message) {
    _showBase(
      context: context,
      message: message,
      backgroundColor: EZColors.info,
      icon: Icons.info_outline,
    );
  }

  // 4. Warning
  static void showWarning(BuildContext context, String message) {
    _showBase(
      context: context,
      message: message,
      backgroundColor: EZColors.warning,
      icon: Icons.warning_amber_rounded,
      textColor: Colors.black,
    );
  }
}

class EZLoading {
  // 1. Progress Ring
  static Widget progressRing({double size = 36.0, Color? color}) {
    return Center(
      child: SizedBox(
        width: size,
        height: size,
        child: CircularProgressIndicator(
          strokeWidth: 3.0,
          valueColor: AlwaysStoppedAnimation<Color>(color ?? EZColors.goldLight),
        ),
      ),
    );
  }

  // 2. Progress Bar
  static Widget progressBar({double height = 4.0, Color? color}) {
    return ClipRRect(
      borderRadius: EZBorderRadius.circular,
      child: LinearProgressIndicator(
        minHeight: height,
        valueColor: AlwaysStoppedAnimation<Color>(color ?? EZColors.goldMedium),
        backgroundColor: EZColors.dividerDark,
      ),
    );
  }

  // 3. Skeleton Box
  static Widget skeletonBox({
    required double width,
    required double height,
    BorderRadius? borderRadius,
  }) {
    return _EZShimmer(
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: EZColors.cardDark,
          borderRadius: borderRadius ?? EZBorderRadius.small,
        ),
      ),
    );
  }

  // 4. Skeleton List Loader
  static Widget skeletonList({int count = 3}) {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: count,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Row(
            children: [
              skeletonBox(width: 60, height: 60),
              EZSpacing.w16,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    skeletonBox(width: 140, height: 16),
                    EZSpacing.h8,
                    skeletonBox(width: double.infinity, height: 12),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// Private Shimmer animation wrapper using standard SingleTickerProviderStateMixin
class _EZShimmer extends StatefulWidget {
  final Widget child;

  const _EZShimmer({required this.child});

  @override
  State<_EZShimmer> createState() => _EZShimmerState();
}

class _EZShimmerState extends State<_EZShimmer> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: 0.35 + (_controller.value * 0.45),
          child: child,
        );
      },
      child: widget.child,
    );
  }
}

class EZEmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String amharicTitle;
  final String description;
  final String buttonText;
  final VoidCallback? onActionPressed;

  const EZEmptyState({
    super.key,
    required this.icon,
    required this.title,
    required this.amharicTitle,
    required this.description,
    required this.buttonText,
    this.onActionPressed,
  });

  // Factory constructors for requested specific Empty States
  static Widget noInternet({VoidCallback? onRetry}) {
    return EZEmptyState(
      icon: Icons.wifi_off_outlined,
      title: 'CONNECTION DISRUPTED',
      amharicTitle: 'የኢንተርኔት ግንኙነት የለም',
      description: 'Your secure Every-zone cache is active, but offline updates require cell networks or Wi-Fi.',
      buttonText: 'RETRY CONNECTION',
      onActionPressed: onRetry,
    );
  }

  static Widget noOrders({VoidCallback? onShop}) {
    return EZEmptyState(
      icon: Icons.shopping_bag_outlined,
      title: 'NO ESCROW CONTRACTS',
      amharicTitle: 'የተመዘገበ ትዕዛዝ የለም',
      description: 'You do not have any pending or completed transactions with our Chapa Escrow Guarantee.',
      buttonText: 'BROWSE PRODUCTS',
      onActionPressed: onShop,
    );
  }

  static Widget noProducts({VoidCallback? onRetry}) {
    return EZEmptyState(
      icon: Icons.hourglass_empty_rounded,
      title: 'OUT OF STOCK',
      amharicTitle: 'ምርቶች አልተገኙም',
      description: 'There are no active products matching your query listed under this store currently.',
      buttonText: 'REFRESH BROWSER',
      onActionPressed: onRetry,
    );
  }

  static Widget noJobs({VoidCallback? onExplore}) {
    return EZEmptyState(
      icon: Icons.business_center_outlined,
      title: 'NO PLACEMENT BULLETIN',
      amharicTitle: 'ክፍት የስራ መደቦች የሉም',
      description: 'We could not find active verified agency placements matching your skillset right now.',
      buttonText: 'EXPLORE ALL CAREERS',
      onActionPressed: onExplore,
    );
  }

  static Widget noHouses({VoidCallback? onSearch}) {
    return EZEmptyState(
      icon: Icons.home_work_outlined,
      title: 'NO LISTINGS DETECTED',
      amharicTitle: 'ቤት ወይም ይዞታ አልተገኘም',
      description: 'No verified real estate properties or commercial listings match your current filters.',
      buttonText: 'RESET ALL FILTERS',
      onActionPressed: onSearch,
    );
  }

  static Widget noNotifications({VoidCallback? onClear}) {
    return EZEmptyState(
      icon: Icons.notifications_none_outlined,
      title: 'COMMUNICATIONS SECURED',
      amharicTitle: 'ምንም ማስታወቂያ የለም',
      description: 'You are completely up-to-date! No alert payloads or system alerts are pending.',
      buttonText: 'REFRESH FEEDS',
      onActionPressed: onClear,
    );
  }

  static Widget noSearchResults({VoidCallback? onReset}) {
    return EZEmptyState(
      icon: Icons.search_off_outlined,
      title: 'NO KEYWORDS DETECTED',
      amharicTitle: 'ምንም ፍለጋ አልተገኘም',
      description: 'We matching index parameters for this keyword. Try "Habesha Kemis" or "Bole Villa".',
      buttonText: 'RESET FILTERS',
      onActionPressed: onReset,
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color titleCol = isDark ? EZColors.textPrimaryDark : EZColors.textPrimaryLight;
    final Color textCol = isDark ? EZColors.textSecondaryDark : EZColors.textSecondaryLight;

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 48),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isDark ? EZColors.surfaceDark : EZColors.surfaceLight,
                shape: BoxShape.circle,
                border: Border.all(color: isDark ? EZColors.dividerDark : EZColors.dividerLight),
              ),
              child: Icon(icon, size: 40, color: EZColors.goldMedium),
            ),
            EZSpacing.h24,
            EZTypography.text(
              title,
              styleBuilder: EZTypography.headline,
              color: titleCol,
              textAlign: TextAlign.center,
            ),
            EZSpacing.h6,
            EZTypography.text(
              amharicTitle,
              styleBuilder: EZTypography.title,
              color: EZColors.goldLight,
              textAlign: TextAlign.center,
            ),
            EZSpacing.h12,
            EZTypography.text(
              description,
              styleBuilder: EZTypography.body,
              color: textCol,
              textAlign: TextAlign.center,
            ),
            if (onActionPressed != null) ...[
              EZSpacing.h32,
              EZSecondaryButton(
                text: buttonText,
                width: 220,
                onPressed: onActionPressed,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
