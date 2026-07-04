import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/shop_models.dart';
import '../data/mock_shop_data.dart';
import 'product_detail_screen.dart';
import 'vendor_store_screen.dart';
import 'cart_screen.dart';
import '../../search/screens/search_screen.dart';

class ShopHomeScreen extends StatefulWidget {
  final VoidCallback onScanPressed;
  final VoidCallback onWalletPressed;

  const ShopHomeScreen({
    super.key,
    required this.onScanPressed,
    required this.onWalletPressed,
  });

  @override
  State<ShopHomeScreen> createState() => _ShopHomeScreenState();
}

class _ShopHomeScreenState extends State<ShopHomeScreen> with SingleTickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  final PageController _promoPageController = PageController(initialPage: 1000); // For infinite scroll PageView
  
  // Search placeholder animation fields
  late Timer _placeholderTimer;
  int _placeholderIndex = 0;
  final List<String> _searchPlaceholders = [
    "Search royal hand-woven garments...",
    "Search certified residential real estate...",
    "Search verified international recruitment jobs...",
    "Search escrow-shielded professional services...",
    "Search rare Wollo gemstones & jewelry..."
  ];

  // Auto sliding promo banner timer
  Timer? _promoTimer;
  
  // Flash sale countdown timer state
  late Timer _countdownTimer;
  Duration _flashDuration = const Duration(hours: 3, minutes: 44, seconds: 12);

  // Lazy loading state simulation
  final List<Product> _visibleTrendingProducts = [];
  bool _isLoadingMore = false;
  int _trendingLimit = 2;

  // Selected sub-category filter for grid view
  String _selectedCategoryFilter = 'all';

  @override
  void initState() {
    super.initState();
    _visibleTrendingProducts.addAll(MockShopData.products.where((p) => !p.isFlashSale).take(_trendingLimit));

    // Animated Placeholder loop
    _placeholderTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (mounted) {
        setState(() {
          _placeholderIndex = (_placeholderIndex + 1) % _searchPlaceholders.length;
        });
      }
    });

    // Auto-sliding Promo Banner
    _promoTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (_promoPageController.hasClients) {
        _promoPageController.nextPage(
          duration: const Duration(milliseconds: 800),
          curve: Curves.easeInOutCubic,
        );
      }
    });

    // Countdown Timer (Flash Sale)
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          if (_flashDuration.inSeconds > 0) {
            _flashDuration = _flashDuration - const Duration(seconds: 1);
          } else {
            _flashDuration = const Duration(hours: 4, minutes: 0, seconds: 0); // reset
          }
        });
      }
    });

    // Infinite scroll controller listener
    _scrollController.addListener(() {
      if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
        _loadMoreTrendingItems();
      }
    });
  }

  void _loadMoreTrendingItems() {
    if (_isLoadingMore || _visibleTrendingProducts.length >= MockShopData.products.length) return;

    setState(() {
      _isLoadingMore = true;
    });

    // Simulate network delay
    Timer(const Duration(milliseconds: 1000), () {
      if (mounted) {
        setState(() {
          final allNonFlash = MockShopData.products;
          final currentLength = _visibleTrendingProducts.length;
          final nextItems = allNonFlash.skip(currentLength).take(2);
          _visibleTrendingProducts.addAll(nextItems);
          _isLoadingMore = false;
        });
      }
    });
  }

  @override
  void dispose() {
    _placeholderTimer.cancel();
    _promoTimer?.cancel();
    _countdownTimer.cancel();
    _promoPageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  // Formatting utility for timer
  String _formatDuration(Duration d) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    String twoDigitMinutes = twoDigits(d.inMinutes.remainder(60));
    String twoDigitSeconds = twoDigits(d.inSeconds.remainder(60));
    return "${twoDigits(d.inHours)} : $twoDigitMinutes : $twoDigitSeconds";
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return RefreshIndicator(
      color: const Color(0xFFC9A227),
      backgroundColor: const Color(0xFF1A1F29),
      onRefresh: () async {
        await Future.delayed(const Duration(milliseconds: 1200));
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Marketplace feed synchronized with secure Chapa node.', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      },
      child: CustomScrollView(
        controller: _scrollController,
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          // App Bar Area (Sliver)
          _buildSliverAppBar(),

          // Search Field & Category grid area
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Beautiful Animated Search Bar
                  _buildAnimatedSearchBar(),
                  const SizedBox(height: 24),

                  // Categories Grid with animated taps
                  _buildCategoryGridSection(),
                  const SizedBox(height: 24),

                  // Auto sliding Infinite Promo Slider
                  _buildPromoSliderSection(),
                  const SizedBox(height: 28),

                  // AI Recommendations Section ("Recommended For You")
                  _buildAiRecommendationsSection(),
                  const SizedBox(height: 28),

                  // Nearby Section (Vendors / Products)
                  _buildNearbySection(),
                  const SizedBox(height: 28),

                  // Flash Sale Section with timer & progress bar
                  _buildFlashSaleSection(),
                  const SizedBox(height: 28),

                  // Top Vendors list with ratings
                  _buildTopVendorsSection(),
                  const SizedBox(height: 32),

                  // Trending Grid Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.trending_up, color: Color(0xFFC9A227), size: 20),
                          SizedBox(width: 8),
                          Text(
                            'TRENDING EXHIBITIONS',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.black,
                              letterSpacing: 1.0,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFC9A227).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'LAZY LOADED',
                          style: TextStyle(fontSize: 8, fontWeight: FontWeight.black, color: Color(0xFFE2B755)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),

          // Lazy loaded Trending Grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.64,
                crossAxisSpacing: 14,
                mainAxisSpacing: 14,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final product = _visibleTrendingProducts[index];
                  return _buildProductCard(product);
                },
                childCount: _visibleTrendingProducts.length,
              ),
            ),
          ),

          // Loading skeletal spinner or offline cached label
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 32),
              child: Center(
                child: _isLoadingMore
                    ? Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.0,
                              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFC9A227)),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'DECRYP-SYNCING NEW RELEASES...',
                            style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: AppColors.textMuted, letterSpacing: 1.0),
                          ),
                        ],
                      )
                    : Row(
                        mainAxisAlignment: MainAxisSize.center,
                        children: [
                          const Icon(Icons.cloud_done, size: 14, color: Color(0xFF10B981)),
                          const SizedBox(width: 6),
                          Text(
                            'Offline Cache Synchronized (End of Feed)',
                            style: TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Responsive Silver App Bar
  Widget _buildSliverAppBar() {
    return SliverAppBar(
      backgroundColor: AppColors.background,
      pinned: true,
      elevation: 4,
      surfaceTintColor: Colors.transparent,
      title: Row(
        children: [
          // Elegant Diamond Shield logo
          Container(
            width: 34,
            height: 34,
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
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.black, letterSpacing: 1.5, color: Color(0xFFE2B755)),
              ),
              Text(
                'METROPOLITAN MARKETPLACE',
                style: TextStyle(fontSize: 7.5, fontWeight: FontWeight.bold, color: AppColors.textMuted, letterSpacing: 0.5),
              ),
            ],
          ),
        ],
      ),
      actions: [
        // Custom Wallet button with premium gold background
        GestureDetector(
          onTap: widget.onWalletPressed,
          child: Container(
            margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1F29),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFC9A227).withOpacity(0.4), width: 1.0),
            ),
            child: const Row(
              children: [
                Icon(Icons.account_balance_wallet_outlined, color: Color(0xFFE2B755), size: 14),
                SizedBox(width: 6),
                Text(
                  '18,500 ETB',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, color: Colors.white, letterSpacing: 0.2),
                ),
              ],
            ),
          ),
        ),

        // Shopping Cart button
        Container(
          margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1F29),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border, width: 1.0),
          ),
          child: IconButton(
            icon: const Icon(Icons.shopping_cart_outlined, color: Color(0xFFE2B755), size: 16),
            padding: EdgeInsets.zero,
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const CartScreen()),
              );
            },
            tooltip: 'View Shopping Cart',
          ),
        ),
        
        // Scan QR button with gold highlight
        Container(
          margin: const EdgeInsets.only(right: 16, top: 10, bottom: 10),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1F29),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border, width: 1.0),
          ),
          child: IconButton(
            icon: const Icon(Icons.qr_code_scanner, color: Color(0xFFE2B755), size: 16),
            padding: EdgeInsets.zero,
            onPressed: widget.onScanPressed,
            tooltip: 'Launch Contactless Chapa Scanner',
          ),
        ),
      ],
    );
  }

  // Beautiful Animated Search Bar
  Widget _buildAnimatedSearchBar() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F29),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.border, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const UniversalSearchScreen()),
            );
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            child: Row(
              children: [
                const Icon(Icons.search, color: Color(0xFFE2B755), size: 18),
                const SizedBox(width: 12),
                Expanded(
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    transitionBuilder: (child, animation) {
                      return FadeTransition(
                        opacity: animation,
                        child: SlideTransition(
                          position: Tween<Offset>(
                            begin: const Offset(0, 0.2),
                            end: Offset.zero,
                          ).animate(animation),
                          child: child,
                        ),
                      );
                    },
                    child: Text(
                      _searchPlaceholders[_placeholderIndex],
                      key: ValueKey<int>(_placeholderIndex),
                      style: const TextStyle(
                        fontSize: 12.5,
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
                const Icon(Icons.mic, color: AppColors.textMuted, size: 18),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Bottom Sheet Custom Search Engine Overlay with smart category filters
  void _showSearchOverlay() {
    String searchQuery = '';
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0E1117),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final filteredSuggestions = MockShopData.products.where((p) {
              final sq = searchQuery.toLowerCase();
              return p.title.toLowerCase().contains(sq) ||
                  p.titleAm.toLowerCase().contains(sq) ||
                  p.description.toLowerCase().contains(sq);
            }).toList();

            return Container(
              padding: EdgeInsets.fromLTRB(20, 24, 20, MediaQuery.of(context).viewInsets.bottom + 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text(
                        'UNIVERSAL SEARCH GATEWAY',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.5, color: Color(0xFFE2B755)),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white, size: 18),
                        onPressed: () => Navigator.pop(context),
                      )
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    autofocus: true,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: InputDecoration(
                      hintText: "Enter keywords (phone, dress, house, job)...",
                      prefixIcon: const Icon(Icons.search, color: Color(0xFFC9A227)),
                      suffixIcon: searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, color: Colors.white, size: 16),
                              onPressed: () {
                                setModalState(() {
                                  searchQuery = '';
                                });
                              },
                            )
                          : const Icon(Icons.mic, color: Colors.white24),
                      fillColor: const Color(0xFF1A1F29),
                    ),
                    onChanged: (val) {
                      setModalState(() {
                        searchQuery = val;
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'TRENDING PORTALS',
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppColors.textMuted, letterSpacing: 1.0),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildSearchPill(context, 'Habesha Kemis', '👗'),
                      _buildSearchPill(context, 'Real Estate Rent', '🏠'),
                      _buildSearchPill(context, 'Europe Jobs', '🌍'),
                      _buildSearchPill(context, 'Organic Coffee', '☕'),
                    ],
                  ),
                  if (searchQuery.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    Text(
                      'FOUND RESULTS (${filteredSuggestions.length})',
                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF10B981), letterSpacing: 1.0),
                    ),
                    const SizedBox(height: 10),
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxHeight: 220),
                      child: ListView.builder(
                        shrinkWrap: true,
                        itemCount: filteredSuggestions.length,
                        itemBuilder: (context, index) {
                          final product = filteredSuggestions[index];
                          return ListTile(
                            contentPadding: EdgeInsets.zero,
                            leading: Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10),
                                image: DecorationImage(image: NetworkImage(product.imageUrls[0]), fit: BoxFit.cover),
                              ),
                            ),
                            title: Text(product.title, style: const TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.bold)),
                            subtitle: Text('${product.price.toLocaleString()} ETB', style: const TextStyle(color: Color(0xFFE2B755), fontSize: 11)),
                            trailing: const Icon(Icons.arrow_forward_ios, size: 12, color: Colors.white30),
                            onTap: () {
                              Navigator.pop(context);
                              _navigateToProductDetail(product);
                            },
                          );
                        },
                      ),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildSearchPill(BuildContext context, String title, String emoji) {
    return ActionChip(
      backgroundColor: const Color(0xFF1A1F29),
      side: const BorderSide(color: AppColors.border),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 12)),
          const SizedBox(width: 4),
          Text(title, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
        ],
      ),
      onPressed: () {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Auto-filtered by saved category label: "$title"'),
            backgroundColor: const Color(0xFFC9A227),
          ),
        );
      },
    );
  }

  // Dynamic Category Grid with animated icons and subtle press states
  Widget _buildCategoryGridSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            const Text(
              'ELITE CLASSIFIED PORTALS',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.black,
                letterSpacing: 1.2,
                color: Color(0xFFE2B755),
              ),
            ),
            GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Viewing all 48 specialized marketplace subdivisions.')),
                );
              },
              child: const Text(
                'View All ✦',
                style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 5,
            childAspectRatio: 0.8,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
          ),
          itemCount: 10, // Top 10 categories
          itemBuilder: (context, index) {
            final cat = MockShopData.categories[index];
            final isSelected = _selectedCategoryFilter == cat.id;

            return GestureDetector(
              onTap: () {
                setState(() {
                  _selectedCategoryFilter = isSelected ? 'all' : cat.id;
                  
                  // Apply standard filters to Mock listing simulation
                  _visibleTrendingProducts.clear();
                  if (_selectedCategoryFilter == 'all') {
                    _visibleTrendingProducts.addAll(MockShopData.products.take(_trendingLimit));
                  } else {
                    _visibleTrendingProducts.addAll(
                      MockShopData.products.where((p) => p.categoryId == _selectedCategoryFilter),
                    );
                  }
                });
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                decoration: BoxDecoration(
                  color: isSelected ? cat.color.withOpacity(0.15) : const Color(0xFF1A1F29),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected ? cat.color : AppColors.border,
                    width: isSelected ? 1.5 : 1.0,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    AnimatedScale(
                      scale: isSelected ? 1.2 : 1.0,
                      duration: const Duration(milliseconds: 200),
                      child: Icon(cat.icon, color: isSelected ? cat.color : const Color(0xFFE2B755), size: 18),
                    ),
                    const SizedBox(height: 8),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Text(
                        cat.name,
                        style: TextStyle(
                          fontSize: 8.5,
                          fontWeight: isSelected ? FontWeight.black : FontWeight.bold,
                          color: isSelected ? Colors.white : AppColors.textSecondary,
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  // Promotion Page Slider (Auto sliding & infinite)
  Widget _buildPromoSliderSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'EDITORIAL MASTERPIECES',
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 1.2, color: Color(0xFFC9A227)),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 170,
          child: PageView.builder(
            controller: _promoPageController,
            itemBuilder: (context, index) {
              final bannerIndex = index % MockShopData.promoBanners.length;
              final banner = MockShopData.promoBanners[bannerIndex];
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(22),
                  image: DecorationImage(
                    image: NetworkImage(banner.imageUrl),
                    fit: BoxFit.cover,
                  ),
                ),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(22),
                    gradient: LinearGradient(
                      colors: [
                        Colors.black.withOpacity(0.95),
                        Colors.black.withOpacity(0.2),
                      ],
                      begin: Alignment.bottomLeft,
                      end: Alignment.topRight,
                    ),
                  ),
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFC9A227).withOpacity(0.2),
                          border: Border.all(color: const Color(0xFFE2B755).withOpacity(0.4)),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          banner.tag,
                          style: const TextStyle(fontSize: 7, fontWeight: FontWeight.black, color: Color(0xFFE2B755), letterSpacing: 1.0),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        banner.title,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.black, color: Colors.white, height: 1.2),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        banner.subtitle,
                        style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        height: 28,
                        child: ElevatedButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Launching exhibition category layout for: "${banner.title}"')),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFC9A227),
                            foregroundColor: Colors.black,
                            padding: const EdgeInsets.symmetric(horizontal: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          child: Text(banner.ctaText, style: const TextStyle(fontSize: 8.5, fontWeight: FontWeight.black)),
                        ),
                      )
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // AI SECTION: "Recommended For You"
  Widget _buildAiRecommendationsSection() {
    final aiProducts = MockShopData.products.where((p) => p.isAiRecommended).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            const Row(
              children: [
                Icon(Icons.psychology, color: Color(0xFFC9A227), size: 16),
                SizedBox(width: 6),
                Text(
                  'COGNITIVE AI SELECTION',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 1.2, color: Color(0xFFE2B755)),
                ),
              ],
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('99% CLOUDSYNC MATCH', style: TextStyle(fontSize: 7, fontWeight: FontWeight.black, color: Color(0xFF10B981))),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 190,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: aiProducts.length,
            itemBuilder: (context, index) {
              final product = aiProducts[index];
              return GestureDetector(
                onTap: () => _navigateToProductDetail(product),
                child: Container(
                  width: 130,
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A1F29),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Stack(
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                                image: DecorationImage(
                                  image: NetworkImage(product.imageUrls[0]),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            Positioned(
                              top: 6,
                              left: 6,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Colors.black.withOpacity(0.6),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.star, color: Color(0xFFE2B755), size: 8),
                                    SizedBox(width: 2),
                                    Text('AI', style: TextStyle(color: Colors.white, fontSize: 6.5, fontWeight: FontWeight.black)),
                                  ],
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              product.title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.black, color: Colors.white),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${product.price.toLocaleString()} ETB',
                              style: const TextStyle(fontSize: 9, fontWeight: FontWeight.black, color: Color(0xFFE2B755)),
                            ),
                            const SizedBox(height: 4),
                            // Micro progress bar matching match percentage
                            Row(
                              children: [
                                Expanded(
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: const LinearProgressIndicator(
                                      value: 0.98,
                                      minHeight: 2.5,
                                      backgroundColor: Colors.white10,
                                      valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Text('98%', style: TextStyle(fontSize: 7, color: Color(0xFF10B981), fontWeight: FontWeight.black)),
                              ],
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // NEARBY Section: Location Aware Products & Services
  Widget _buildNearbySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          children: [
            Icon(Icons.location_on, color: Color(0xFFEF4444), size: 16),
            SizedBox(width: 6),
            Text(
              'LOCALIZED RADAR NODES (BOLE)',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 1.2, color: Color(0xFFE2B755)),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1F29),
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: const Color(0xFFEF4444).withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.my_location, color: Color(0xFFEF4444), size: 18),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '3 Premium Vendors within 800m',
                      style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.black, color: Colors.white),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Verified near Bole Medhanialem Cathedral, Addis Ababa',
                      style: TextStyle(fontSize: 9.5, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios, size: 12, color: AppColors.textMuted),
            ],
          ),
        ),
      ],
    );
  }

  // FLASH SALE Section: Countdown & Progress Bar
  Widget _buildFlashSaleSection() {
    final flashProducts = MockShopData.products.where((p) => p.isFlashSale).toList();
    if (flashProducts.isEmpty) return const SizedBox.shrink();
    
    final p = flashProducts[0]; // main flash item
    final soldRatio = (p.flashSaleSold ?? 0) / (p.flashSaleQuantity ?? 10);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            Row(
              children: [
                const Icon(Icons.flash_on, color: Color(0xFFF59E0B), size: 16),
                const SizedBox(width: 6),
                const Text(
                  'CHAPA MICRO-FLASH SALE',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 1.2, color: Color(0xFFE2B755)),
                ),
                const SizedBox(width: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEF4444).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    _formatDuration(_flashDuration),
                    style: const TextStyle(fontSize: 8.5, fontWeight: FontWeight.black, color: Color(0xFFEF4444), fontFamily: 'monospace'),
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 12),
        GestureDetector(
          onTap: () => _navigateToProductDetail(p),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1F29),
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.2)),
            ),
            child: Row(
              children: [
                Hero(
                  tag: 'product_image_${p.id}',
                  child: Container(
                    width: 76,
                    height: 76,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      image: DecorationImage(image: NetworkImage(p.imageUrls[0]), fit: BoxFit.cover),
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        p.title,
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: Colors.white),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            '${p.price.toLocaleString()} ETB',
                            style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.black, color: Color(0xFFC9A227)),
                          ),
                          const SizedBox(width: 8),
                          if (p.originalPrice != null)
                            Text(
                              '${p.originalPrice!.toLocaleString()} ETB',
                              style: const TextStyle(fontSize: 9.5, color: AppColors.textMuted, decoration: TextDecoration.lineThrough),
                            ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: LinearProgressIndicator(
                          value: soldRatio,
                          minHeight: 4,
                          backgroundColor: Colors.white10,
                          valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFEF4444)),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Text(
                            'Limited to ${p.flashSaleQuantity} items',
                            style: const TextStyle(fontSize: 8.5, color: AppColors.textMuted, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            '${(soldRatio * 100).round()}% SECURED',
                            style: const TextStyle(fontSize: 8.5, color: Color(0xFFEF4444), fontWeight: FontWeight.black),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // TOP VENDORS Horizontal Scroll Section
  Widget _buildTopVendorsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'VERIFIED METROPOLITAN VENDORS',
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 1.2, color: Color(0xFFC9A227)),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 84,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: MockShopData.vendors.length,
            itemBuilder: (context, index) {
              final vendor = MockShopData.vendors[index];
              return GestureDetector(
                onTap: () => _navigateToVendorStore(vendor),
                child: Container(
                  width: 210,
                  margin: const EdgeInsets.only(right: 12),
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A1F29),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      Hero(
                        tag: 'vendor_logo_${vendor.id}',
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: const Color(0xFFE2B755), width: 1.2),
                            image: DecorationImage(image: NetworkImage(vendor.logoUrl), fit: BoxFit.cover),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    vendor.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.black, color: Colors.white),
                                  ),
                                ),
                                if (vendor.isVerified)
                                  const Icon(Icons.verified, color: Color(0xFF10B981), size: 10),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                const Icon(Icons.star, color: Color(0xFFE2B755), size: 10),
                                const SizedBox(width: 2),
                                Text(
                                  '${vendor.rating} (${(vendor.followers / 1000).toStringAsFixed(1)}k)',
                                  style: const TextStyle(fontSize: 8.5, color: AppColors.textSecondary, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${vendor.trustScore}% ESCROW TRUST',
                              style: const TextStyle(fontSize: 7.5, color: Color(0xFF10B981), fontWeight: FontWeight.black),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // Classic Product Card representing our elegant high-density shop listings
  Widget _buildProductCard(Product p) {
    return GestureDetector(
      onTap: () => _navigateToProductDetail(p),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1F29),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.border, width: 1.0),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Stack
            Expanded(
              child: Stack(
                children: [
                  Hero(
                    tag: 'product_image_${p.id}',
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
                        image: DecorationImage(
                          image: NetworkImage(p.imageUrls[0]),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                  if (p.discountPercentage > 0)
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEF4444),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '-${p.discountPercentage}%',
                          style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.black),
                        ),
                      ),
                    ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.all(5),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.5),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.favorite_border, color: Colors.white, size: 12),
                    ),
                  ),
                ],
              ),
            ),
            
            // Product Information
            Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    p.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: Colors.white),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    p.titleAm,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 8.5, color: AppColors.textMuted, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${p.price.toLocaleString()} ETB',
                            style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.black, color: Color(0xFFE2B755)),
                          ),
                          if (p.installmentAvailable)
                            const Text(
                              'Installments OK',
                              style: TextStyle(fontSize: 7.5, color: Color(0xFF10B981), fontWeight: FontWeight.black),
                            ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: p.stockStatus == 'In Stock'
                              ? const Color(0xFF10B981).withOpacity(0.12)
                              : const Color(0xFFF59E0B).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          p.stockStatus,
                          style: TextStyle(
                            fontSize: 7,
                            fontWeight: FontWeight.black,
                            color: p.stockStatus == 'In Stock' ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  // Route Handlers
  void _navigateToProductDetail(Product product) {
    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => ProductDetailScreen(product: product),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(1, 0),
              end: Offset.zero,
            ).animate(CurvedAnimation(parent: animation, curve: Curves.easeInOutCubic)),
            child: child,
          );
        },
      ),
    );
  }

  void _navigateToVendorStore(Vendor vendor) {
    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => VendorStoreScreen(vendor: vendor),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(1, 0),
              end: Offset.zero,
            ).animate(CurvedAnimation(parent: animation, curve: Curves.easeInOutCubic)),
            child: child,
          );
        },
      ),
    );
  }
}

// Convenient extension for nice formatting
extension NumberFormatting on double {
  String toLocaleString() {
    return toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]},',
    );
  }
}
