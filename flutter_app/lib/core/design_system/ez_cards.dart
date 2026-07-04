import 'package:flutter/material.dart';
import 'ez_colors.dart';
import 'ez_spacing.dart';
import 'ez_typography.dart';

class EZProductCard extends StatelessWidget {
  final String title;
  final String imageUrl;
  final double price;
  final double rating;
  final bool isVerified;
  final bool isAiRecommended;
  final VoidCallback onTap;
  final VoidCallback? onFavoriteTap;

  const EZProductCard({
    super.key,
    required this.title,
    required this.imageUrl,
    required this.price,
    required this.rating,
    this.isVerified = true,
    this.isAiRecommended = false,
    required this.onTap,
    this.onFavoriteTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color cardColor = isDark ? EZColors.cardDark : EZColors.cardLight;
    final Color borderCol = isDark ? EZColors.dividerDark : EZColors.dividerLight;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 170,
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: EZBorderRadius.medium,
          border: Border.all(color: borderCol, width: 1.0),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                  child: Image.network(
                    imageUrl,
                    height: 120,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (c, e, s) => Container(
                      height: 120,
                      color: isDark ? EZColors.surfaceDark : EZColors.surfaceLight,
                      child: const Icon(Icons.broken_image, color: EZColors.goldMedium),
                    ),
                  ),
                ),
                if (isAiRecommended)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.85),
                        borderRadius: EZBorderRadius.small,
                        border: Border.all(color: EZColors.goldLight, width: 0.8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.star, color: EZColors.goldLight, size: 10),
                          EZSpacing.w4,
                          const Text(
                            'AI MATCH',
                            style: TextStyle(fontSize: 8, fontWeight: FontWeight.black, color: EZColors.goldLight, letterSpacing: 0.5),
                          ),
                        ],
                      ),
                    ),
                  ),
                if (onFavoriteTap != null)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: onFavoriteTap,
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: Colors.black45,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.favorite_border, color: Colors.white, size: 14),
                      ),
                    ),
                  ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: EZTypography.text(
                          title,
                          styleBuilder: EZTypography.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (isVerified)
                        const Icon(Icons.verified, color: EZColors.goldLight, size: 14),
                    ],
                  ),
                  EZSpacing.h4,
                  Row(
                    children: [
                      const Icon(Icons.star, color: EZColors.goldLight, size: 12),
                      EZSpacing.w4,
                      Text(
                        rating.toString(),
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: Colors.white),
                      ),
                    ],
                  ),
                  EZSpacing.h12,
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${price.toStringAsFixed(0)} ETB',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.black,
                          color: EZColors.goldLight,
                        ),
                      ),
                      const Icon(Icons.add_shopping_cart, size: 14, color: Colors.white54),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class EZVendorCard extends StatelessWidget {
  final String name;
  final String logoUrl;
  final String description;
  final double rating;
  final int followersCount;
  final bool isVerified;
  final VoidCallback onTap;

  const EZVendorCard({
    super.key,
    required this.name,
    required this.logoUrl,
    required this.description,
    required this.rating,
    required this.followersCount,
    this.isVerified = true,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color cardColor = isDark ? EZColors.cardDark : EZColors.cardLight;
    final Color borderCol = isDark ? EZColors.dividerDark : EZColors.dividerLight;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: EZBorderRadius.medium,
          border: Border.all(color: borderCol, width: 1.0),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: EZBorderRadius.small,
              child: Image.network(
                logoUrl,
                width: 64,
                height: 64,
                fit: BoxFit.cover,
                errorBuilder: (c, e, s) => Container(
                  width: 64,
                  height: 64,
                  color: isDark ? EZColors.surfaceDark : EZColors.surfaceLight,
                  child: const Icon(Icons.storefront, color: EZColors.goldMedium),
                ),
              ),
            ),
            EZSpacing.w16,
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: EZTypography.text(
                          name,
                          styleBuilder: EZTypography.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (isVerified) ...[
                        EZSpacing.w4,
                        const Icon(Icons.verified, color: EZColors.goldLight, size: 16),
                      ],
                    ],
                  ),
                  EZSpacing.h4,
                  EZTypography.text(
                    description,
                    styleBuilder: EZTypography.caption,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  EZSpacing.h8,
                  Row(
                    children: [
                      const Icon(Icons.star, color: EZColors.goldLight, size: 12),
                      EZSpacing.w4,
                      Text(
                        rating.toString(),
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      EZSpacing.w12,
                      const Icon(Icons.people_outline, color: EZColors.textMutedDark, size: 12),
                      EZSpacing.w4,
                      Text(
                        '$followersCount followers',
                        style: const TextStyle(fontSize: 11, color: EZColors.textSecondaryDark),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const Icon(Icons.keyboard_arrow_right, color: Colors.white30),
          ],
        ),
      ),
    );
  }
}

class EZServiceCard extends StatelessWidget {
  final String title;
  final String category;
  final double basePrice;
  final double rating;
  final VoidCallback onTap;

  const EZServiceCard({
    super.key,
    required this.title,
    required this.category,
    required this.basePrice,
    required this.rating,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color cardColor = isDark ? EZColors.cardDark : EZColors.cardLight;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: EZBorderRadius.medium,
          border: Border.all(color: isDark ? EZColors.dividerDark : EZColors.dividerLight),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: EZColors.goldMedium.withOpacity(0.15),
                      borderRadius: EZBorderRadius.small,
                    ),
                    child: Text(
                      category.toUpperCase(),
                      style: const TextStyle(fontSize: 8, fontWeight: FontWeight.black, color: EZColors.goldLight),
                    ),
                  ),
                  EZSpacing.h8,
                  EZTypography.text(
                    title,
                    styleBuilder: EZTypography.title,
                  ),
                  EZSpacing.h6,
                  Row(
                    children: [
                      const Icon(Icons.star, color: EZColors.goldLight, size: 12),
                      EZSpacing.w4,
                      Text(
                        rating.toString(),
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Text(
                  'FROM',
                  style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: EZColors.textMutedDark, letterSpacing: 0.8),
                ),
                Text(
                  '${basePrice.toStringAsFixed(0)} ETB',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.black,
                    color: EZColors.goldLight,
                  ),
                ),
                EZSpacing.h12,
                const Icon(Icons.arrow_forward_ios, size: 12, color: Colors.white30),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class EZPropertyCard extends StatelessWidget {
  final String title;
  final String address;
  final double price;
  final double area;
  final int beds;
  final int baths;
  final String imageUrl;
  final VoidCallback onTap;

  const EZPropertyCard({
    super.key,
    required this.title,
    required this.address,
    required this.price,
    required this.area,
    required this.beds,
    required this.baths,
    required this.imageUrl,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color cardColor = isDark ? EZColors.cardDark : EZColors.cardLight;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: EZBorderRadius.large,
          border: Border.all(color: isDark ? EZColors.dividerDark : EZColors.dividerLight),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
              child: Image.network(
                imageUrl,
                height: 160,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (c, e, s) => Container(
                  height: 160,
                  color: isDark ? EZColors.surfaceDark : EZColors.surfaceLight,
                  child: const Icon(Icons.home, color: EZColors.goldMedium, size: 40),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: EZTypography.text(
                          title,
                          styleBuilder: EZTypography.headline,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Text(
                        '${price.toStringAsFixed(0)} ETB',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.black,
                          color: EZColors.goldLight,
                        ),
                      ),
                    ],
                  ),
                  EZSpacing.h6,
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, size: 14, color: EZColors.goldMedium),
                      EZSpacing.w4,
                      Expanded(
                        child: EZTypography.text(
                          address,
                          styleBuilder: EZTypography.caption,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  EZSpacing.h12,
                  const Divider(color: EZColors.dividerDark, height: 1),
                  EZSpacing.h12,
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.aspect_ratio, size: 14, color: Colors.white54),
                          EZSpacing.w4,
                          Text('$area sqm', style: const TextStyle(fontSize: 11, color: Colors.white70)),
                        ],
                      ),
                      Row(
                        children: [
                          const Icon(Icons.king_bed_outlined, size: 14, color: Colors.white54),
                          EZSpacing.w4,
                          Text('$beds Beds', style: const TextStyle(fontSize: 11, color: Colors.white70)),
                        ],
                      ),
                      Row(
                        children: [
                          const Icon(Icons.bathtub_outlined, size: 14, color: Colors.white54),
                          EZSpacing.w4,
                          Text('$baths Baths', style: const TextStyle(fontSize: 11, color: Colors.white70)),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class EZJobCard extends StatelessWidget {
  final String title;
  final String company;
  final String country;
  final String salary;
  final String logoUrl;
  final List<String> requirements;
  final VoidCallback onTap;

  const EZJobCard({
    super.key,
    required this.title,
    required this.company,
    required this.country,
    required this.salary,
    required this.logoUrl,
    required this.requirements,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color cardColor = isDark ? EZColors.cardDark : EZColors.cardLight;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: EZBorderRadius.medium,
          border: Border.all(color: isDark ? EZColors.dividerDark : EZColors.dividerLight),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                ClipRRect(
                  borderRadius: EZBorderRadius.small,
                  child: Image.network(
                    logoUrl,
                    width: 48,
                    height: 48,
                    fit: BoxFit.cover,
                    errorBuilder: (c, e, s) => Container(
                      width: 48,
                      height: 48,
                      color: isDark ? EZColors.surfaceDark : EZColors.surfaceLight,
                      child: const Icon(Icons.business_center, color: EZColors.goldMedium),
                    ),
                  ),
                ),
                EZSpacing.w16,
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      EZTypography.text(
                        title,
                        styleBuilder: EZTypography.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      EZSpacing.h4,
                      Text(
                        '$company • $country',
                        style: const TextStyle(fontSize: 11, color: EZColors.textSecondaryDark, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            EZSpacing.h12,
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: requirements.take(2).map((req) {
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: EZBorderRadius.small,
                    border: Border.all(color: isDark ? EZColors.dividerDark : EZColors.dividerLight, width: 0.8),
                  ),
                  child: Text(
                    req,
                    style: const TextStyle(fontSize: 9.5, color: Colors.white70),
                  ),
                );
              }).toList(),
            ),
            EZSpacing.h12,
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                Text(
                  salary,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.black,
                    color: EZColors.goldLight,
                  ),
                ),
                Row(
                  children: [
                    EZTypography.text(
                      'APPLY NOW',
                      styleBuilder: EZTypography.caption,
                      color: EZColors.goldMedium,
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.arrow_right_alt, color: EZColors.goldMedium, size: 14),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class EZOrderCard extends StatelessWidget {
  final String orderId;
  final String title;
  final double amount;
  final String status;
  final String date;
  final String escrowCode;

  const EZOrderCard({
    super.key,
    required this.orderId,
    required this.title,
    required this.amount,
    required this.status,
    required this.date,
    required this.escrowCode,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final isCompleted = status.toLowerCase().contains('complete') || status.toLowerCase().contains('deliver');

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? EZColors.cardDark : EZColors.cardLight,
        borderRadius: EZBorderRadius.medium,
        border: Border.all(color: isDark ? EZColors.dividerDark : EZColors.dividerLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'ORDER #$orderId',
                style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: FontWeight.black, color: Colors.white30),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isCompleted ? EZColors.success.withOpacity(0.1) : EZColors.warning.withOpacity(0.1),
                  borderRadius: EZBorderRadius.small,
                  border: Border.all(color: isCompleted ? EZColors.success : EZColors.warning, width: 0.8),
                ),
                child: Text(
                  status.toUpperCase(),
                  style: TextStyle(fontSize: 8, fontWeight: FontWeight.black, color: isCompleted ? EZColors.success : EZColors.warning),
                ),
              ),
            ],
          ),
          EZSpacing.h12,
          EZTypography.text(
            title,
            styleBuilder: EZTypography.title,
          ),
          EZSpacing.h4,
          Text(
            'Date: $date',
            style: const TextStyle(fontSize: 10.5, color: EZColors.textMutedDark),
          ),
          EZSpacing.h12,
          const Divider(color: EZColors.dividerDark, height: 1),
          EZSpacing.h12,
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('CHAPA ESCROW GUARANTEE', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white24)),
                  EZSpacing.h2,
                  Text(
                    escrowCode,
                    style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: FontWeight.bold, color: EZColors.goldLight),
                  ),
                ],
              ),
              Text(
                '${amount.toStringAsFixed(0)} ETB',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.black, color: Colors.white),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class EZWalletCard extends StatelessWidget {
  final double balance;
  final String currency;
  final String address;
  final VoidCallback onDeposit;
  final VoidCallback onWithdraw;

  const EZWalletCard({
    super.key,
    required this.balance,
    required this.currency,
    required this.address,
    required this.onDeposit,
    required this.onWithdraw,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: EZColors.goldGradient,
        borderRadius: EZBorderRadius.large,
        boxShadow: [
          BoxShadow(
            color: EZColors.goldDark.withOpacity(0.35),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'EVERY-ZONE SECURE CHAPA WALLET',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.black,
                  color: Colors.black45,
                  letterSpacing: 1.0,
                ),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                  color: Colors.black12,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.security, color: Colors.black54, size: 14),
              ),
            ],
          ),
          EZSpacing.h20,
          Row(
            baseline: TextBaseline.alphabetic,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            children: [
              Text(
                balance.toStringAsFixed(2),
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.black,
                  color: Colors.black,
                  letterSpacing: -1,
                ),
              ),
              EZSpacing.w6,
              Text(
                currency,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.black,
                  color: Colors.black54,
                ),
              ),
            ],
          ),
          EZSpacing.h12,
          Row(
            children: [
              const Icon(Icons.vpn_key_outlined, size: 12, color: Colors.black38),
              EZSpacing.w6,
              Text(
                address,
                style: const TextStyle(
                  fontFamily: 'JetBrains Mono',
                  fontSize: 9.5,
                  fontWeight: FontWeight.bold,
                  color: Colors.black45,
                ),
              ),
            ],
          ),
          EZSpacing.h24,
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: onDeposit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: EZBorderRadius.small),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('DEPOSIT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                ),
              ),
              EZSpacing.w12,
              Expanded(
                child: OutlinedButton(
                  onPressed: onWithdraw,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.black,
                    side: const BorderSide(color: Colors.black45, width: 1.2),
                    shape: RoundedRectangleBorder(borderRadius: EZBorderRadius.small),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('WITHDRAW', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}

class EZReviewCard extends StatelessWidget {
  final String authorName;
  final String authorAvatar;
  final double rating;
  final String comment;
  final String date;

  const EZReviewCard({
    super.key,
    required this.authorName,
    required this.authorAvatar,
    required this.rating,
    required this.comment,
    required this.date,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? EZColors.cardDark : EZColors.cardLight,
        borderRadius: EZBorderRadius.medium,
        border: Border.all(color: isDark ? EZColors.dividerDark : EZColors.dividerLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundImage: NetworkImage(authorAvatar),
                backgroundColor: EZColors.surfaceDark,
              ),
              EZSpacing.w12,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: EZTypography.text(
                            authorName,
                            styleBuilder: EZTypography.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const Icon(Icons.star, color: EZColors.goldLight, size: 12),
                        EZSpacing.w4,
                        Text(
                          rating.toString(),
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ],
                    ),
                    EZSpacing.h2,
                    Text(
                      date,
                      style: const TextStyle(fontSize: 10, color: EZColors.textMutedDark),
                    ),
                  ],
                ),
              )
            ],
          ),
          EZSpacing.h12,
          EZTypography.text(
            comment,
            styleBuilder: EZTypography.body,
          ),
        ],
      ),
    );
  }
}

class EZNotificationCard extends StatelessWidget {
  final String title;
  final String description;
  final String time;
  final bool isRead;
  final IconData icon;
  final VoidCallback? onTap;

  const EZNotificationCard({
    super.key,
    required this.title,
    required this.description,
    required this.time,
    required this.isRead,
    required this.icon,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color cardColor = isDark ? EZColors.cardDark : EZColors.cardLight;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: EZBorderRadius.small,
          border: Border.all(
            color: isRead
                ? (isDark ? EZColors.dividerDark : EZColors.dividerLight)
                : EZColors.goldMedium.withOpacity(0.5),
            width: isRead ? 1.0 : 1.5,
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isRead ? Colors.transparent : EZColors.goldMedium.withOpacity(0.1),
                shape: BoxShape.circle,
                border: Border.all(
                  color: isRead ? Colors.white10 : EZColors.goldMedium,
                  width: 1.0,
                ),
              ),
              child: Icon(icon, color: isRead ? EZColors.textMutedDark : EZColors.goldLight, size: 16),
            ),
            EZSpacing.w16,
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  EZTypography.text(
                    title,
                    styleBuilder: EZTypography.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  EZSpacing.h4,
                  EZTypography.text(
                    description,
                    styleBuilder: EZTypography.caption,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  EZSpacing.h6,
                  Text(
                    time,
                    style: const TextStyle(fontSize: 9.5, color: EZColors.textMutedDark),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
