import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../shop/screens/shop_home_screen.dart';
import '../wallet/screens/wallet_screen.dart';
import '../overseas_employment/screens/jobs_home_screen.dart';
import '../real_estate/screens/real_estate_home_screen.dart';

class MainAppShell extends StatefulWidget {
  const MainAppShell({super.key});

  @override
  State<MainAppShell> createState() => _MainAppShellState();
}

class _MainAppShellState extends State<MainAppShell> {
  int _selectedTabIndex = 0;

  void _showQRScannerDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF131316),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
            side: const BorderSide(color: AppColors.border),
          ),
          title: const Row(
            children: [
              Icon(Icons.qr_code_scanner, color: Color(0xFFC9A227)),
              SizedBox(width: 10),
              Text(
                'BIOMETRIC QR SCANNER',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 180,
                height: 180,
                decoration: BoxDecoration(
                  border: Border.all(color: const Color(0xFFC9A227), width: 2.0),
                  borderRadius: BorderRadius.circular(20),
                ),
                alignment: Alignment.center,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    const Icon(Icons.qr_code, size: 100, color: Colors.white30),
                    // Animated scanning line
                    TweenAnimationBuilder<double>(
                      tween: Tween<double>(begin: 0.0, end: 1.0),
                      duration: const Duration(seconds: 2),
                      builder: (context, value, child) {
                        return Positioned(
                          top: 10 + (value * 160),
                          left: 10,
                          right: 10,
                          child: Container(
                            height: 2.5,
                            color: const Color(0xFF10B981),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Position the Every-zone merchant QR code within the frame to initiate safe escrow payments.',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 10.5, height: 1.4),
                textAlign: TextAlign.center,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('CANCEL', style: TextStyle(color: Colors.white30, fontSize: 10, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  // Render content dynamically based on selected bottom tab
  Widget _buildTabBody(int index) {
    switch (index) {
      case 0:
        return ShopHomeScreen(
          onScanPressed: () {
            _showQRScannerDialog();
          },
          onWalletPressed: () {
            setState(() {
              _selectedTabIndex = 5; // Switch to Portal Settings/Wallet Tab
            });
          },
        );
      case 1:
        return const RealEstateHomeScreen();
      case 2:
        return const JobsHomeScreen();
      case 3:
        return _buildGenericPlaceholder('Every-zone Lottery', '🎟', 'Participate in official high-yield state lottery draws and prizes.');
      case 4:
        return _buildGenericPlaceholder('Matchmaking Center', '💖', 'Premium vetted relationship bridging and cultural union matching.');
      case 5:
        return const WalletScreen();
      default:
        return const SizedBox.shrink();
    }
  }

  // Shop View Placeholder specifically reserving space for QR Scanner (Top-Right as requested)
  Widget _buildShopTabPlaceholder() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 12),
          // Elegant Header Row with QR space and Logo
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              // Logo Shield
              Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      gradient: AppColors.goldGradient,
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      '✦',
                      style: TextStyle(fontSize: 18, color: AppColors.background, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'EVERY-ZONE',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.5, color: AppColors.goldLight),
                      ),
                      Text(
                        'LUXURY MARKETPLACE',
                        style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: AppColors.textMuted),
                      ),
                    ],
                  )
                ],
              ),
              
              // Reserved Space for Contactless QR Pay Scanner (No notification bell as requested)
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.goldDark.withOpacity(0.35), width: 1.2),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.goldDark.withOpacity(0.08),
                      blurRadius: 8,
                    )
                  ],
                ),
                child: IconButton(
                  icon: const Icon(Icons.qr_code_scanner, color: AppColors.goldLight, size: 20),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Contactless QR Scanner: Reserved for Phase 2 implementation.'),
                        backgroundColor: AppColors.goldDark,
                      ),
                    );
                  },
                ),
              )
            ],
          ),
          const SizedBox(height: 36),

          // Main Promo Banner Space
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.border),
              image: DecorationImage(
                image: const NetworkImage('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600'),
                fit: BoxFit.cover,
                colorFilter: ColorFilter.mode(Colors.black.withOpacity(0.85), BlendMode.dstATop),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.goldDark.withOpacity(0.2),
                    border: Border.all(color: AppColors.goldMedium.withOpacity(0.4)),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text('✦ SPECIAL EDITION', style: TextStyle(fontSize: 8, fontWeight: FontWeight.black, color: AppColors.goldLight, letterSpacing: 1.0)),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Ethiopian Premium\nCouture Reimagined',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.black, color: Colors.white, height: 1.2),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Vetted Habesha Kemis and golden tilet attire.',
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.goldMedium,
                    foregroundColor: AppColors.background,
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('EXAMINE CATALOG', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                )
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Under Construction Notice (Phase 2 constraint)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: AppColors.border, width: 1.0),
            ),
            child: Row(
              children: [
                const Text('🛡', style: TextStyle(fontSize: 28)),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Phase 1 Completed Successfully',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Awaiting your Phase 2 instructions to construct live Shop listings, filters, and transaction drawers.',
                        style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3),
                      ),
                    ],
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Helper widget to construct luxury descriptive placeholders for secondary tabs
  Widget _buildGenericPlaceholder(String title, String icon, String description) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: AppColors.border, width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: AppColors.goldDark.withOpacity(0.04),
                  blurRadius: 20,
                )
              ],
            ),
            alignment: Alignment.center,
            child: Text(icon, style: const TextStyle(fontSize: 38)),
          ),
          const SizedBox(height: 24),
          Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.black, color: AppColors.textPrimary, letterSpacing: -0.5),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 10),
          Text(
            description,
            style: const TextStyle(fontSize: 12.5, color: AppColors.textSecondary, height: 1.4),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 40),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.goldMedium.withOpacity(0.05),
              border: Border.all(color: AppColors.goldMedium.withOpacity(0.2)),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('✦ ', style: TextStyle(color: AppColors.goldLight, fontWeight: FontWeight.bold, fontSize: 11)),
                Text('EVERY-ZONE PROTOTYPE RESERVED', style: TextStyle(fontSize: 9, fontWeight: FontWeight.black, color: AppColors.goldLight, letterSpacing: 0.8)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: _buildTabBody(_selectedTabIndex),
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(
            top: BorderSide(color: AppColors.border, width: 1.0),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedTabIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index; // Keep inner tracking if needed
              _selectedTabIndex = index;
            });
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.shopping_bag_outlined),
              activeIcon: Icon(Icons.shopping_bag, color: AppColors.goldLight),
              label: 'Shop',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.home_work_outlined),
              activeIcon: Icon(Icons.home_work, color: AppColors.goldLight),
              label: 'Houses',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.business_center_outlined),
              activeIcon: Icon(Icons.business_center, color: AppColors.goldLight),
              label: 'Agencies',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.confirmation_number_outlined),
              activeIcon: Icon(Icons.confirmation_number, color: AppColors.goldLight),
              label: 'Lottery',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.favorite_border_outlined),
              activeIcon: Icon(Icons.favorite, color: AppColors.goldLight),
              label: 'Matchmaking',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.wallet_outlined),
              activeIcon: Icon(Icons.wallet, color: AppColors.goldLight),
              label: 'Vault',
            ),
          ],
        ),
      ),
    );
  }
  
  // Backing fields for state transition support
  int _currentIndex = 0;
}
