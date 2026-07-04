import 'package:flutter/material.dart';
import 'ez_colors.dart';
import 'ez_spacing.dart';
import 'ez_typography.dart';
import 'ez_buttons.dart';
import 'ez_inputs.dart';

class EZBottomSheet {
  // 1. Filter Bottom Sheet
  static void showFilter({
    required BuildContext context,
    required double maxPrice,
    required double initialMaxDistance,
    required bool initialVerifiedOnly,
    required Function(double maxPrice, double maxDistance, bool verifiedOnly) onApply,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).brightness == Brightness.dark
          ? EZColors.backgroundDark
          : EZColors.backgroundLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      builder: (context) {
        double currentPrice = maxPrice;
        double currentDistance = initialMaxDistance;
        bool currentVerified = initialVerifiedOnly;

        return StatefulBuilder(
          builder: (context, setSheetState) {
            final bool isDark = Theme.of(context).brightness == Brightness.dark;
            return Container(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.tune, color: EZColors.goldLight),
                          EZSpacing.w8,
                          EZTypography.text(
                            'FILTER OPTIONS',
                            styleBuilder: EZTypography.headline,
                          ),
                        ],
                      ),
                      EZIconButton(
                        icon: Icons.close,
                        size: 18,
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const Divider(color: EZColors.dividerDark, height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      EZTypography.text('MAX PRICE (ETB)', styleBuilder: EZTypography.title),
                      Text(
                        '${currentPrice.toStringAsFixed(0)} ETB',
                        style: const TextStyle(color: EZColors.goldLight, fontWeight: FontWeight.black, fontSize: 13),
                      ),
                    ],
                  ),
                  Slider(
                    value: currentPrice,
                    min: 100,
                    max: 1000000,
                    activeColor: EZColors.goldLight,
                    inactiveColor: isDark ? Colors.white12 : Colors.black12,
                    onChanged: (val) {
                      setSheetState(() => currentPrice = val);
                    },
                  ),
                  EZSpacing.h16,
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      EZTypography.text('MAX DISTANCE (KM)', styleBuilder: EZTypography.title),
                      Text(
                        '${currentDistance.toStringAsFixed(1)} KM',
                        style: const TextStyle(color: EZColors.goldLight, fontWeight: FontWeight.black, fontSize: 13),
                      ),
                    ],
                  ),
                  Slider(
                    value: currentDistance,
                    min: 1.0,
                    max: 50.0,
                    activeColor: EZColors.goldLight,
                    inactiveColor: isDark ? Colors.white12 : Colors.black12,
                    onChanged: (val) {
                      setSheetState(() => currentDistance = val);
                    },
                  ),
                  EZSpacing.h16,
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: EZTypography.text('VERIFIED SHIELDS ONLY', styleBuilder: EZTypography.title),
                    subtitle: EZTypography.text('Show only trusted merchants & brokers', styleBuilder: EZTypography.caption),
                    value: currentVerified,
                    activeColor: EZColors.goldLight,
                    onChanged: (val) {
                      setSheetState(() => currentVerified = val);
                    },
                  ),
                  EZSpacing.h24,
                  EZPrimaryButton(
                    text: 'APPLY FILTERS',
                    onPressed: () {
                      onApply(currentPrice, currentDistance, currentVerified);
                      Navigator.pop(context);
                    },
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // 2. Sort Bottom Sheet
  static void showSort({
    required BuildContext context,
    required String selectedOption,
    required List<String> options,
    required ValueChanged<String> onSelected,
  }) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).brightness == Brightness.dark
          ? EZColors.backgroundDark
          : EZColors.backgroundLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              EZTypography.text(
                'SORT BY',
                styleBuilder: EZTypography.headline,
              ),
              EZSpacing.h16,
              ...options.map((opt) {
                final isSelected = opt == selectedOption;
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: EZTypography.text(
                    opt.toUpperCase(),
                    styleBuilder: isSelected ? EZTypography.title : EZTypography.body,
                    color: isSelected ? EZColors.goldLight : null,
                  ),
                  trailing: isSelected ? const Icon(Icons.check, color: EZColors.goldLight) : null,
                  onTap: () {
                    onSelected(opt);
                    Navigator.pop(context);
                  },
                );
              }).toList(),
            ],
          ),
        );
      },
    );
  }

  // 3. Share Bottom Sheet
  static void showShare({
    required BuildContext context,
    required String shareTitle,
    required String shareUrl,
    required String shareCode,
  }) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).brightness == Brightness.dark
          ? EZColors.backgroundDark
          : EZColors.backgroundLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      builder: (context) {
        final bool isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              EZTypography.text(
                'SECURE LISTING SHARE',
                styleBuilder: EZTypography.headline,
              ),
              EZSpacing.h8,
              EZTypography.text(
                'Share listings, escrow links or referral codes securely.',
                styleBuilder: EZTypography.caption,
              ),
              EZSpacing.h20,
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: isDark ? EZColors.surfaceDark : EZColors.surfaceLight,
                  borderRadius: EZBorderRadius.small,
                  border: Border.all(color: isDark ? EZColors.dividerDark : EZColors.dividerLight),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        shareCode,
                        style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: FontWeight.black, color: EZColors.goldLight),
                      ),
                    ),
                    EZTextButton(
                      text: 'COPY',
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Share code copied to secure clipboard!'),
                            backgroundColor: EZColors.goldDark,
                          ),
                        );
                        Navigator.pop(context);
                      },
                    ),
                  ],
                ),
              ),
              EZSpacing.h20,
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _ShareChannel(icon: Icons.message, label: 'Telegram', onTap: () => Navigator.pop(context)),
                  _ShareChannel(icon: Icons.chat_bubble_outline, label: 'WhatsApp', onTap: () => Navigator.pop(context)),
                  _ShareChannel(icon: Icons.email_outlined, label: 'Email', onTap: () => Navigator.pop(context)),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  // 4. Report Bottom Sheet
  static void showReport({
    required BuildContext context,
    required String listingTitle,
    required Function(String reason, String comments) onReportSubmitted,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).brightness == Brightness.dark
          ? EZColors.backgroundDark
          : EZColors.backgroundLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      builder: (context) {
        String selectedReason = 'Fraud / Scam';
        final commentCtrl = TextEditingController();

        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.fromLTRB(24, 24, 24, MediaQuery.of(context).viewInsets.bottom + 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  EZTypography.text(
                    'REPORT LISTING',
                    styleBuilder: EZTypography.headline,
                    color: EZColors.danger,
                  ),
                  EZSpacing.h8,
                  EZTypography.text(
                    'Report fraud, duplicate listings, or offensive content regarding: $listingTitle',
                    styleBuilder: EZTypography.caption,
                  ),
                  EZSpacing.h16,
                  EZDropdown<String>(
                    labelText: 'REASON FOR REPORT',
                    value: selectedReason,
                    items: const [
                      DropdownMenuItem(value: 'Fraud / Scam', child: Text('Fraud / Scam')),
                      DropdownMenuItem(value: 'Inaccurate Details', child: Text('Inaccurate Details')),
                      DropdownMenuItem(value: 'Duplicate Listing', child: Text('Duplicate Listing')),
                      DropdownMenuItem(value: 'Inappropriate Content', child: Text('Inappropriate Content')),
                    ],
                    onChanged: (val) {
                      if (val != null) setSheetState(() => selectedReason = val);
                    },
                  ),
                  EZSpacing.h16,
                  EZTextField(
                    hintText: 'Add extra details or descriptions...',
                    labelText: 'ADDITIONAL COMMENTS',
                    controller: commentCtrl,
                  ),
                  EZSpacing.h24,
                  EZDangerButton(
                    text: 'SUBMIT SECURITY REPORT',
                    onPressed: () {
                      onReportSubmitted(selectedReason, commentCtrl.text);
                      Navigator.pop(context);
                    },
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // 5. Payment Bottom Sheet
  static void showPayment({
    required BuildContext context,
    required String itemName,
    required double price,
    required Function(String phoneNumber, String paymentMethod) onPaymentAuthorized,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).brightness == Brightness.dark
          ? EZColors.backgroundDark
          : EZColors.backgroundLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      builder: (context) {
        final phoneCtrl = TextEditingController();
        String paymentMethod = 'Chapa Wallet';

        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.fromLTRB(24, 24, 24, MediaQuery.of(context).viewInsets.bottom + 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Icon(Icons.security, color: EZColors.goldLight),
                      EZTypography.text('CHAPA ESCROW PAYMENT', styleBuilder: EZTypography.headline),
                      const Text(
                        '100% VETTED',
                        style: TextStyle(fontSize: 8, fontWeight: FontWeight.black, color: EZColors.success),
                      ),
                    ],
                  ),
                  const Divider(color: EZColors.dividerDark, height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      EZTypography.text(itemName, styleBuilder: EZTypography.title),
                      Text(
                        '${price.toStringAsFixed(0)} ETB',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.black, color: EZColors.goldLight),
                      ),
                    ],
                  ),
                  EZSpacing.h20,
                  EZDropdown<String>(
                    labelText: 'CHOOSE PAYMENT GATEWAY',
                    value: paymentMethod,
                    items: const [
                      DropdownMenuItem(value: 'Chapa Wallet', child: Text('Chapa Instant Escrow Wallet')),
                      DropdownMenuItem(value: 'CBE Birr', child: Text('CBE Birr API')),
                      DropdownMenuItem(value: 'Telebirr', child: Text('Telebirr Direct')),
                    ],
                    onChanged: (val) {
                      if (val != null) setSheetState(() => paymentMethod = val);
                    },
                  ),
                  EZSpacing.h16,
                  EZPhoneInput(
                    labelText: 'VERIFICATION PHONE NUMBER',
                    controller: phoneCtrl,
                  ),
                  EZSpacing.h24,
                  EZPrimaryButton(
                    text: 'AUTHORIZE CHAPA ESCROW',
                    onPressed: () {
                      onPaymentAuthorized(phoneCtrl.text, paymentMethod);
                      Navigator.pop(context);
                    },
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // 6. Address Picker Bottom Sheet
  static void showAddressPicker({
    required BuildContext context,
    required String selectedAddress,
    required List<String> availableRegions,
    required ValueChanged<String> onAddressPicked,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).brightness == Brightness.dark
          ? EZColors.backgroundDark
          : EZColors.backgroundLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      builder: (context) {
        final bool isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              EZTypography.text('PICK LOCATION ZONE', styleBuilder: EZTypography.headline),
              EZSpacing.h8,
              EZTypography.text('Vetted Real Estate or Product Pickup points in Addis Ababa.', styleBuilder: EZTypography.caption),
              EZSpacing.h16,
              Container(
                height: 120,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: isDark ? EZColors.cardDark : EZColors.cardLight,
                  borderRadius: EZBorderRadius.medium,
                  border: Border.all(color: isDark ? EZColors.dividerDark : EZColors.dividerLight),
                ),
                alignment: Alignment.center,
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.map_outlined, color: EZColors.goldMedium, size: 28),
                    EZSpacing.h8,
                    Text('SECURE ADD MAP PIN IN PROGRESS', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white24)),
                  ],
                ),
              ),
              EZSpacing.h16,
              SizedBox(
                height: 160,
                child: ListView(
                  physics: const BouncingScrollPhysics(),
                  children: availableRegions.map((region) {
                    final isSel = region == selectedAddress;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Icon(Icons.location_on_outlined, color: isSel ? EZColors.goldLight : EZColors.textMutedDark),
                      title: EZTypography.text(
                        region,
                        styleBuilder: isSel ? EZTypography.title : EZTypography.body,
                        color: isSel ? EZColors.goldLight : null,
                      ),
                      trailing: isSel ? const Icon(Icons.check_circle, color: EZColors.goldLight) : null,
                      onTap: () {
                        onAddressPicked(region);
                        Navigator.pop(context);
                      },
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _ShareChannel extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ShareChannel({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: EZColors.goldMedium.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: EZColors.goldLight),
          ),
          EZSpacing.h8,
          EZTypography.text(label, styleBuilder: EZTypography.caption),
        ],
      ),
    );
  }
}

class EZDialog {
  static void _showBaseDialog({
    required BuildContext context,
    required Widget icon,
    required String title,
    required String description,
    required List<Widget> actions,
  }) {
    showDialog(
      context: context,
      builder: (context) {
        final bool isDark = Theme.of(context).brightness == Brightness.dark;
        return AlertDialog(
          backgroundColor: isDark ? EZColors.backgroundDark : EZColors.backgroundLight,
          shape: RoundedRectangleBorder(
            borderRadius: EZBorderRadius.large,
            side: BorderSide(color: isDark ? EZColors.dividerDark : EZColors.dividerLight),
          ),
          title: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              icon,
              EZSpacing.h16,
              EZTypography.text(title, styleBuilder: EZTypography.headline, textAlign: TextAlign.center),
            ],
          ),
          content: EZTypography.text(
            description,
            styleBuilder: EZTypography.body,
            textAlign: TextAlign.center,
          ),
          actions: actions,
          actionsAlignment: MainAxisAlignment.center,
        );
      },
    );
  }

  // 1. Success Dialog
  static void showSuccess({
    required BuildContext context,
    required String title,
    required String description,
    VoidCallback? onConfirm,
  }) {
    _showBaseDialog(
      context: context,
      icon: Container(
        padding: const EdgeInsets.all(12),
        decoration: const BoxDecoration(color: EZColors.success, shape: BoxShape.circle),
        child: const Icon(Icons.check, color: Colors.white, size: 28),
      ),
      title: title,
      description: description,
      actions: [
        EZPrimaryButton(
          text: 'CONTINUE',
          width: 160,
          onPressed: () {
            Navigator.pop(context);
            if (onConfirm != null) onConfirm();
          },
        ),
      ],
    );
  }

  // 2. Error Dialog
  static void showError({
    required BuildContext context,
    required String title,
    required String description,
  }) {
    _showBaseDialog(
      context: context,
      icon: Container(
        padding: const EdgeInsets.all(12),
        decoration: const BoxDecoration(color: EZColors.danger, shape: BoxShape.circle),
        child: const Icon(Icons.error_outline, color: Colors.white, size: 28),
      ),
      title: title,
      description: description,
      actions: [
        EZPrimaryButton(
          text: 'DISMISS',
          width: 160,
          onPressed: () => Navigator.pop(context),
        ),
      ],
    );
  }

  // 3. Warning Dialog
  static void showWarning({
    required BuildContext context,
    required String title,
    required String description,
    required VoidCallback onProceed,
  }) {
    _showBaseDialog(
      context: context,
      icon: Container(
        padding: const EdgeInsets.all(12),
        decoration: const BoxDecoration(color: EZColors.warning, shape: BoxShape.circle),
        child: const Icon(Icons.warning_amber_rounded, color: Colors.white, size: 28),
      ),
      title: title,
      description: description,
      actions: [
        EZTextButton(
          text: 'CANCEL',
          onPressed: () => Navigator.pop(context),
        ),
        EZSpacing.w12,
        EZPrimaryButton(
          text: 'PROCEED',
          width: 120,
          onPressed: () {
            Navigator.pop(context);
            onProceed();
          },
        ),
      ],
    );
  }

  // 4. Delete Confirmation Dialog
  static void showDeleteConfirmation({
    required BuildContext context,
    required String itemName,
    required VoidCallback onDelete,
  }) {
    _showBaseDialog(
      context: context,
      icon: Container(
        padding: const EdgeInsets.all(12),
        decoration: const BoxDecoration(color: EZColors.danger, shape: BoxShape.circle),
        child: const Icon(Icons.delete_forever_outlined, color: Colors.white, size: 28),
      ),
      title: 'DELETE CONFIRMATION',
      description: 'Are you absolutely sure you want to delete this listing: "$itemName"? This action is permanent.',
      actions: [
        EZTextButton(
          text: 'CANCEL',
          onPressed: () => Navigator.pop(context),
        ),
        EZSpacing.w12,
        EZDangerButton(
          text: 'DELETE',
          width: 120,
          onPressed: () {
            Navigator.pop(context);
            onDelete();
          },
        ),
      ],
    );
  }

  // 5. Logout Dialog
  static void showLogout({
    required BuildContext context,
    required VoidCallback onLogout,
  }) {
    _showBaseDialog(
      context: context,
      icon: Container(
        padding: const EdgeInsets.all(12),
        decoration: const BoxDecoration(color: Colors.white10, shape: BoxShape.circle),
        child: const Icon(Icons.logout_outlined, color: Colors.white, size: 28),
      ),
      title: 'SECURE ACCOUNT LOGOUT',
      description: 'Log out from Every-zone server? Secure local keys and cache indexes will remain encrypted on your device.',
      actions: [
        EZTextButton(
          text: 'CANCEL',
          onPressed: () => Navigator.pop(context),
        ),
        EZSpacing.w12,
        EZPrimaryButton(
          text: 'LOGOUT',
          width: 120,
          onPressed: () {
            Navigator.pop(context);
            onLogout();
          },
        ),
      ],
    );
  }

  // 6. Payment Success Dialog
  static void showPaymentSuccess({
    required BuildContext context,
    required String escrowId,
    required double amount,
    required VoidCallback onDone,
  }) {
    _showBaseDialog(
      context: context,
      icon: Container(
        padding: const EdgeInsets.all(12),
        decoration: const BoxDecoration(color: EZColors.success, shape: BoxShape.circle),
        child: const Icon(Icons.verified_user_sharp, color: Colors.white, size: 28),
      ),
      title: 'CHAPA PAYMENTS DEPOSITED',
      description: 'Successfully deposited ${amount.toStringAsFixed(0)} ETB in secure Chapa Escrow vault.\n\nEscrow ID: $escrowId',
      actions: [
        EZPrimaryButton(
          text: 'VIEW ORDER',
          width: 160,
          onPressed: () {
            Navigator.pop(context);
            onDone();
          },
        ),
      ],
    );
  }
}
