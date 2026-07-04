import 'package:flutter/material.dart';
import 'ez_colors.dart';
import 'ez_spacing.dart';
import 'ez_typography.dart';

class EZTextField extends StatelessWidget {
  final String hintText;
  final String? labelText;
  final TextEditingController? controller;
  final IconData? prefixIcon;
  final Widget? suffixIcon;
  final bool isPassword;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final ValueChanged<String>? onChanged;
  final bool enabled;

  const EZTextField({
    super.key,
    required this.hintText,
    this.labelText,
    this.controller,
    this.prefixIcon,
    this.suffixIcon,
    this.isPassword = false,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.onChanged,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color labelColor = isDark ? EZColors.textSecondaryDark : EZColors.textSecondaryLight;
    final Color styleColor = isDark ? EZColors.textPrimaryDark : EZColors.textPrimaryLight;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (labelText != null) ...[
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: EZTypography.text(
              labelText!,
              customStyle: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: labelColor,
                letterSpacing: 0.5,
              ),
            ),
          ),
        ],
        TextFormField(
          controller: controller,
          obscureText: isPassword,
          keyboardType: keyboardType,
          validator: validator,
          onChanged: onChanged,
          enabled: enabled,
          style: TextStyle(
            fontSize: 13.5,
            fontWeight: FontWeight.w600,
            color: enabled
                ? styleColor
                : (isDark ? EZColors.disabledDark : EZColors.disabledLight),
          ),
          decoration: InputDecoration(
            hintText: hintText,
            prefixIcon: prefixIcon != null
                ? Icon(
                    prefixIcon,
                    color: isDark ? EZColors.goldMedium : EZColors.goldDark,
                    size: 18,
                  )
                : null,
            suffixIcon: suffixIcon,
          ),
        ),
      ],
    );
  }
}

class EZSearchField extends StatelessWidget {
  final String hintText;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onMicPressed;
  final VoidCallback? onClearPressed;

  const EZSearchField({
    super.key,
    required this.hintText,
    this.controller,
    this.onChanged,
    this.onMicPressed,
    this.onClearPressed,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    return TextFormField(
      controller: controller,
      onChanged: onChanged,
      style: TextStyle(
        fontSize: 13.5,
        fontWeight: FontWeight.bold,
        color: isDark ? EZColors.textPrimaryDark : EZColors.textPrimaryLight,
      ),
      decoration: InputDecoration(
        hintText: hintText,
        prefixIcon: Icon(
          Icons.search,
          color: isDark ? EZColors.goldLight : EZColors.goldDark,
          size: 18,
        ),
        suffixIcon: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (controller != null && controller!.text.isNotEmpty && onClearPressed != null)
              IconButton(
                icon: const Icon(Icons.clear, size: 16),
                onPressed: onClearPressed,
              ),
            if (onMicPressed != null)
              IconButton(
                icon: Icon(
                  Icons.mic,
                  color: isDark ? EZColors.goldLight : EZColors.goldDark,
                  size: 16,
                ),
                onPressed: onMicPressed,
              ),
          ],
        ),
      ),
    );
  }
}

class EZPasswordField extends StatefulWidget {
  final String hintText;
  final String? labelText;
  final TextEditingController? controller;
  final String? Function(String?)? validator;

  const EZPasswordField({
    super.key,
    required this.hintText,
    this.labelText,
    this.controller,
    this.validator,
  });

  @override
  State<EZPasswordField> createState() => _EZPasswordFieldState();
}

class _EZPasswordFieldState extends State<EZPasswordField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    return EZTextField(
      hintText: widget.hintText,
      labelText: widget.labelText,
      controller: widget.controller,
      validator: widget.validator,
      isPassword: _obscureText,
      prefixIcon: Icons.lock_outline,
      suffixIcon: IconButton(
        icon: Icon(
          _obscureText ? Icons.visibility_off_outlined : Icons.visibility_outlined,
          color: EZColors.textMutedDark,
          size: 18,
        ),
        onPressed: () {
          setState(() {
            _obscureText = !_obscureText;
          });
        },
      ),
    );
  }
}

class EZOtpInput extends StatefulWidget {
  final int length;
  final ValueChanged<String> onCompleted;

  const EZOtpInput({
    super.key,
    this.length = 4,
    required this.onCompleted,
  });

  @override
  State<EZOtpInput> createState() => _EZOtpInputState();
}

class _EZOtpInputState extends State<EZOtpInput> {
  late List<TextEditingController> _controllers;
  late List<FocusNode> _focusNodes;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(widget.length, (_) => TextEditingController());
    _focusNodes = List.generate(widget.length, (_) => FocusNode());
  }

  @override
  void dispose() {
    for (var ctrl in _controllers) {
      ctrl.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  void _onChanged(String value, int index) {
    if (value.isNotEmpty) {
      if (index < widget.length - 1) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
        final otp = _controllers.map((c) => c.text).join();
        widget.onCompleted(otp);
      }
    } else {
      if (index > 0) {
        _focusNodes[index - 1].requestFocus();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: List.generate(widget.length, (index) {
        return SizedBox(
          width: 52,
          height: 56,
          child: TextFormField(
            controller: _controllers[index],
            focusNode: _focusNodes[index],
            keyboardType: TextInputType.number,
            textAlign: TextAlign.center,
            maxLength: 1,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.black,
              color: isDark ? EZColors.textPrimaryDark : EZColors.textPrimaryLight,
            ),
            decoration: InputDecoration(
              counterText: '',
              contentPadding: EdgeInsets.zero,
              enabledBorder: OutlineInputBorder(
                borderRadius: EZBorderRadius.small,
                borderSide: BorderSide(
                  color: isDark ? EZColors.dividerDark : EZColors.dividerLight,
                  width: 1.5,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: EZBorderRadius.small,
                borderSide: const BorderSide(
                  color: EZColors.goldMedium,
                  width: 2.0,
                ),
              ),
            ),
            onChanged: (val) => _onChanged(val, index),
          ),
        );
      }),
    );
  }
}

class EZPhoneInput extends StatelessWidget {
  final TextEditingController? controller;
  final String? labelText;
  final String initialCountryCode;
  final ValueChanged<String>? onCountryChanged;

  const EZPhoneInput({
    super.key,
    this.controller,
    this.labelText,
    this.initialCountryCode = '+251',
    this.onCountryChanged,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color labelColor = isDark ? EZColors.textSecondaryDark : EZColors.textSecondaryLight;
    final Color styleColor = isDark ? EZColors.textPrimaryDark : EZColors.textPrimaryLight;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (labelText != null) ...[
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: EZTypography.text(
              labelText!,
              customStyle: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: labelColor,
                letterSpacing: 0.5,
              ),
            ),
          ),
        ],
        Row(
          children: [
            GestureDetector(
              onTap: () {
                if (onCountryChanged != null) {
                  onCountryChanged!('+251'); // Simulating picker
                }
              },
              child: Container(
                height: 52,
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: isDark ? EZColors.surfaceDark : EZColors.surfaceLight,
                  borderRadius: EZBorderRadius.small,
                  border: Border.all(
                    color: isDark ? EZColors.dividerDark : EZColors.dividerLight,
                    width: 1.2,
                  ),
                ),
                alignment: Alignment.center,
                child: Row(
                  children: [
                    Text(
                      initialCountryCode == '+251' ? '🇪🇹' : '🇸🇦',
                      style: const TextStyle(fontSize: 16),
                    ),
                    EZSpacing.w6,
                    Text(
                      initialCountryCode,
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.black,
                        color: styleColor,
                      ),
                    ),
                    const Icon(Icons.arrow_drop_down, color: EZColors.goldMedium, size: 16),
                  ],
                ),
              ),
            ),
            EZSpacing.w12,
            Expanded(
              child: TextFormField(
                controller: controller,
                keyboardType: TextInputType.phone,
                style: TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w600,
                  color: styleColor,
                ),
                decoration: const InputDecoration(
                  hintText: '912 345 678',
                  prefixIcon: Icon(Icons.phone_outlined, size: 18, color: EZColors.goldMedium),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class EZDropdown<T> extends StatelessWidget {
  final String labelText;
  final T? value;
  final List<DropdownMenuItem<T>> items;
  final ValueChanged<T?> onChanged;
  final String? Function(T?)? validator;

  const EZDropdown({
    super.key,
    required this.labelText,
    required this.value,
    required this.items,
    required this.onChanged,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color labelColor = isDark ? EZColors.textSecondaryDark : EZColors.textSecondaryLight;
    final Color styleColor = isDark ? EZColors.textPrimaryDark : EZColors.textPrimaryLight;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: EZTypography.text(
            labelText,
            customStyle: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: labelColor,
              letterSpacing: 0.5,
            ),
          ),
        ),
        DropdownButtonFormField<T>(
          value: value,
          items: items,
          onChanged: onChanged,
          validator: validator,
          dropdownColor: isDark ? EZColors.cardDark : EZColors.cardLight,
          style: TextStyle(
            fontSize: 13.5,
            fontWeight: FontWeight.w600,
            color: styleColor,
          ),
          icon: const Icon(Icons.keyboard_arrow_down, color: EZColors.goldMedium),
          decoration: const InputDecoration(
            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        ),
      ],
    );
  }
}

class EZCountryPicker extends StatelessWidget {
  final String selectedCountry;
  final ValueChanged<String> onSelected;

  const EZCountryPicker({
    super.key,
    required this.selectedCountry,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final countries = [
      {'name': 'Ethiopia', 'flag': '🇪🇹', 'code': '+251'},
      {'name': 'Saudi Arabia', 'flag': '🇸🇦', 'code': '+966'},
      {'name': 'United Arab Emirates', 'flag': '🇦🇪', 'code': '+971'},
      {'name': 'Qatar', 'flag': '🇶🇦', 'code': '+974'},
      {'name': 'United States', 'flag': '🇺🇸', 'code': '+1'},
    ];

    return EZDropdown<String>(
      labelText: 'DESTINATION COUNTRY',
      value: selectedCountry,
      items: countries.map((c) {
        return DropdownMenuItem<String>(
          value: c['name'] as String,
          child: Row(
            children: [
              Text(c['flag'] as String, style: const TextStyle(fontSize: 16)),
              EZSpacing.w8,
              Text(c['name'] as String),
            ],
          ),
        );
      }).toList(),
      onChanged: (val) {
        if (val != null) onSelected(val);
      },
    );
  }
}

class EZDatePicker extends StatelessWidget {
  final String labelText;
  final DateTime? selectedDate;
  final ValueChanged<DateTime> onDateSelected;

  const EZDatePicker({
    super.key,
    required this.labelText,
    required this.selectedDate,
    required this.onDateSelected,
  });

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
      builder: (context, child) {
        final bool isDark = Theme.of(context).brightness == Brightness.dark;
        return Theme(
          data: child!.theme.copyWith(
            colorScheme: ColorScheme.dark(
              primary: EZColors.goldMedium,
              onPrimary: EZColors.backgroundDark,
              surface: isDark ? EZColors.surfaceDark : EZColors.surfaceLight,
              onSurface: isDark ? EZColors.textPrimaryDark : EZColors.textPrimaryLight,
            ),
          ),
          child: child,
        );
      },
    );
    if (picked != null && picked != selectedDate) {
      onDateSelected(picked);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final String formattedDate = selectedDate == null
        ? 'Select Date'
        : '${selectedDate!.day}/${selectedDate!.month}/${selectedDate!.year}';

    return GestureDetector(
      onTap: () => _selectDate(context),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: EZTypography.text(
              labelText,
              customStyle: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: isDark ? EZColors.textSecondaryDark : EZColors.textSecondaryLight,
                letterSpacing: 0.5,
              ),
            ),
          ),
          Container(
            height: 52,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: isDark ? EZColors.surfaceDark : EZColors.surfaceLight,
              borderRadius: EZBorderRadius.small,
              border: Border.all(
                color: isDark ? EZColors.dividerDark : EZColors.dividerLight,
                width: 1.2,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  formattedDate,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: selectedDate == null
                        ? EZColors.textMutedDark
                        : (isDark ? EZColors.textPrimaryDark : EZColors.textPrimaryLight),
                  ),
                ),
                const Icon(Icons.calendar_today, size: 16, color: EZColors.goldMedium),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class EZImagePicker extends StatelessWidget {
  final String labelText;
  final String? imageUrl;
  final VoidCallback onTap;

  const EZImagePicker({
    super.key,
    required this.labelText,
    required this.imageUrl,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color cardColor = isDark ? EZColors.cardDark : EZColors.cardLight;
    final Color borderCol = isDark ? EZColors.dividerDark : EZColors.dividerLight;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: EZTypography.text(
            labelText,
            customStyle: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: isDark ? EZColors.textSecondaryDark : EZColors.textSecondaryLight,
              letterSpacing: 0.5,
            ),
          ),
        ),
        GestureDetector(
          onTap: onTap,
          child: Container(
            height: 120,
            width: double.infinity,
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: EZBorderRadius.medium,
              border: Border.all(
                color: borderCol,
                width: 1.5,
              ),
            ),
            child: imageUrl != null
                ? ClipRRect(
                    borderRadius: EZBorderRadius.medium,
                    child: Image.network(
                      imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return const Center(child: Icon(Icons.broken_image, color: EZColors.danger));
                      },
                    ),
                  )
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.cloud_upload_outlined, size: 32, color: EZColors.goldMedium),
                      EZSpacing.h8,
                      EZTypography.text(
                        'TAP TO CHOOSE OR DRAG & DROP FILE',
                        styleBuilder: EZTypography.caption,
                        color: EZColors.goldMedium,
                      ),
                      EZSpacing.h4,
                      EZTypography.text(
                        'Supports JPG, PNG, PDF up to 10MB',
                        styleBuilder: EZTypography.caption,
                        color: EZColors.textMutedDark,
                      ),
                    ],
                  ),
          ),
        ),
      ],
    );
  }
}

class EZQrScannerField extends StatelessWidget {
  final String labelText;
  final TextEditingController? controller;
  final VoidCallback onScanPressed;

  const EZQrScannerField({
    super.key,
    required this.labelText,
    this.controller,
    required this.onScanPressed,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        EZTextField(
          hintText: 'Enter code or scan merchant QR',
          labelText: labelText,
          controller: controller,
          prefixIcon: Icons.qr_code,
          suffixIcon: IconButton(
            icon: const Icon(Icons.qr_code_scanner, color: EZColors.goldLight),
            onPressed: onScanPressed,
          ),
        ),
      ],
    );
  }
}
