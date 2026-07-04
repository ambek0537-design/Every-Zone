import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/shop_models.dart';
import '../data/mock_shop_data.dart';
import '../data/cart_manager.dart';
import 'cart_screen.dart';
import 'shop_home_screen.dart'; // For formatting extension
import 'vendor_store_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({
    super.key,
    required this.product,
  });

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _currentGalleryIndex = 0;
  bool _isWishlisted = false;
  bool _is360Active = false;
  double _rotationAngle = 0.0; // Angle for 360 image simulation
  bool _isZoomed = false;

  @override
  Widget build(BuildContext context) {
    final p = widget.product;
    // Find the associated vendor
    final vendor = MockShopData.vendors.firstWhere(
      (v) => v.id == p.vendorId,
      orElse: () => MockShopData.vendors[0],
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Content Column
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Interactive Media Stage: Hero, swipe, 360, zoom support
                _buildProductMediaStage(p),

                Padding(
                  padding: const EdgeInsets.all(18.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Sizing & Tag Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFC9A227).withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: const Color(0xFFC9A227).withOpacity(0.4)),
                            ),
                            child: const Row(
                              children: [
                                Text('✦ ', style: TextStyle(color: Color(0xFFE2B755), fontWeight: FontWeight.bold, fontSize: 10)),
                                Text('SECURED ESCROW SHIELD', style: TextStyle(fontSize: 8, fontWeight: FontWeight.black, color: Color(0xFFE2B755))),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: p.stockStatus == 'In Stock'
                                  ? const Color(0xFF10B981).withOpacity(0.15)
                                  : const Color(0xFFEF4444).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              p.stockStatus.toUpperCase(),
                              style: TextStyle(
                                fontSize: 8.5,
                                fontWeight: FontWeight.black,
                                color: p.stockStatus == 'In Stock' ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Product Main Title
                      Text(
                        p.title,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.black,
                          color: Colors.white,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        p.titleAm,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Pricing block with discount & installment notice
                      _buildPricingBlock(p),
                      const SizedBox(height: 24),

                      // Vendor Mini Card
                      _buildVendorMiniCard(vendor),
                      const SizedBox(height: 24),

                      // Description Section
                      _buildSectionHeader('PRODUCT CATALOG SPEC'),
                      const SizedBox(height: 10),
                      Text(
                        p.description,
                        style: const TextStyle(fontSize: 12.5, color: AppColors.textSecondary, height: 1.5),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        p.descriptionAm,
                        style: const TextStyle(fontSize: 12, color: AppColors.textMuted, height: 1.5, fontStyle: FontStyle.italic),
                      ),
                      const SizedBox(height: 24),

                      // Technical Specifications
                      _buildSectionHeader('TECHNICAL PARAMETERS'),
                      const SizedBox(height: 12),
                      _buildSpecificationsTable(p),
                      const SizedBox(height: 24),

                      // Vendor Video Reels
                      _buildVendorVideosSection(),
                      const SizedBox(height: 24),

                      // Live Customer Reviews
                      _buildReviewsSection(p),
                      const SizedBox(height: 24),

                      // Customer Q&A
                      _buildQuestionsSection(p),
                      const SizedBox(height: 28),

                      // Recommended Products carousel
                      _buildRecommendedCarousel(p),
                      const SizedBox(height: 100), // Reserve spacer for Sticky bottom bar
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Custom Header Bar overlay with back button & controls
          _buildFloatingHeaderBar(p),

          // Sticky Bottom Bar: Buy Now & Add to Cart
          _buildStickyBottomBar(p, vendor),
        ],
      ),
    );
  }

  // Floating Header
  Widget _buildFloatingHeaderBar(Product p) {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 40),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.black.withOpacity(0.8), Colors.transparent],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            Container(
              decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(12)),
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            Row(
              children: [
                Container(
                  margin: const EdgeInsets.only(right: 8),
                  decoration: BoxDecoration(color: Colors.black45, shape: BoxShape.circle),
                  child: IconButton(
                    icon: Icon(
                      _isWishlisted ? Icons.favorite : Icons.favorite_border,
                      color: _isWishlisted ? const Color(0xFFEF4444) : Colors.white,
                      size: 20,
                    ),
                    onPressed: () {
                      setState(() {
                        _isWishlisted = !_isWishlisted;
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(_isWishlisted ? 'Saved securely to your Every-zone Watchlist' : 'Removed from Watchlist'),
                          backgroundColor: const Color(0xFFC9A227),
                        ),
                      );
                    },
                  ),
                ),
                Container(
                  decoration: BoxDecoration(color: Colors.black45, shape: BoxShape.circle),
                  child: IconButton(
                    icon: const Icon(Icons.share, color: Colors.white, size: 20),
                    onPressed: () {
                      _showShareSheet(p);
                    },
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  // Interactive 360 & Slide Gallery stage
  Widget _buildProductMediaStage(Product p) {
    return SizedBox(
      height: 380,
      child: Stack(
        children: [
          // Gallery PageView or 360 Viewer
          GestureDetector(
            onDoubleTap: () {
              setState(() {
                _isZoomed = !_isZoomed;
              });
            },
            onHorizontalDragUpdate: (details) {
              if (_is360Active) {
                setState(() {
                  _rotationAngle += details.delta.dx * 0.01;
                });
              }
            },
            child: AnimatedScale(
              scale: _isZoomed ? 1.6 : 1.0,
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOutBack,
              child: _is360Active
                  ? Container(
                      color: const Color(0xFF131316),
                      alignment: Alignment.center,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Transform.rotate(
                            angle: _rotationAngle,
                            child: Hero(
                              tag: 'product_image_${p.id}',
                              child: Image.network(
                                p.imageUrls[0],
                                fit: BoxFit.cover,
                                width: double.infinity,
                                height: double.infinity,
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 20,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(color: Colors.black85, borderRadius: BorderRadius.circular(20)),
                              child: const Row(
                                children: [
                                  Icon(Icons.swipe, color: Color(0xFFE2B755), size: 14),
                                  SizedBox(width: 8),
                                  Text('Drag horizontally to rotate 360° virtual preview', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          )
                        ],
                      ),
                    )
                  : PageView.builder(
                      itemCount: p.imageUrls.length,
                      onPageChanged: (idx) {
                        setState(() {
                          _currentGalleryIndex = idx;
                        });
                      },
                      itemBuilder: (context, idx) {
                        return Hero(
                          tag: idx == 0 ? 'product_image_${p.id}' : 'product_gallery_$idx',
                          child: Image.network(
                            p.imageUrls[idx],
                            fit: BoxFit.cover,
                            width: double.infinity,
                          ),
                        );
                      },
                    ),
            ),
          ),

          // Indicator Dots for slider
          if (!_is360Active)
            Positioned(
              bottom: 20,
              left: 20,
              child: Row(
                children: List.generate(p.imageUrls.length, (index) {
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: _currentGalleryIndex == index ? 24 : 8,
                    height: 8,
                    margin: const EdgeInsets.only(right: 6),
                    decoration: BoxDecoration(
                      color: _currentGalleryIndex == index ? const Color(0xFFE2B755) : Colors.white38,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  );
                }),
              ),
            ),

          // 360 Support toggle button
          Positioned(
            bottom: 16,
            right: 16,
            child: FloatingActionButton.small(
              backgroundColor: const Color(0xFF1A1F29).withOpacity(0.85),
              foregroundColor: const Color(0xFFE2B755),
              onPressed: () {
                setState(() {
                  _is360Active = !_is360Active;
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(_is360Active ? '360° Interactive Simulator Activated.' : 'Standard high-density gallery view.'),
                    backgroundColor: const Color(0xFFC9A227),
                  ),
                );
              },
              child: Icon(_is360Active ? Icons.view_in_ar : Icons.threed_rotation),
            ),
          )
        ],
      ),
    );
  }

  // Pricing details block
  Widget _buildPricingBlock(Product p) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F29),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                '${p.price.toLocaleString()} ETB',
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.black, color: Color(0xFFC9A227)),
              ),
              const SizedBox(width: 10),
              if (p.originalPrice != null) ...[
                Text(
                  '${p.originalPrice!.toLocaleString()} ETB',
                  style: const TextStyle(fontSize: 14, color: AppColors.textMuted, decoration: TextDecoration.lineThrough),
                ),
                const SizedBox(width: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: const Color(0xFFEF4444), borderRadius: BorderRadius.circular(4)),
                  child: Text(
                    '${p.discountPercentage}% OFF',
                    style: const TextStyle(fontSize: 8.5, fontWeight: FontWeight.black, color: Colors.white),
                  ),
                )
              ]
            ],
          ),
          if (p.installmentAvailable) ...[
            const SizedBox(height: 12),
            const Divider(color: Colors.white10),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.payment, color: Color(0xFF10B981), size: 16),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Escrow Installment Available',
                        style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.black, color: Colors.white),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Pay 4 installments of ${(p.price / 4).toLocaleString()} ETB/month with 0% interest.',
                        style: const TextStyle(fontSize: 9.5, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                )
              ],
            )
          ]
        ],
      ),
    );
  }

  // Vendor Mini Card
  Widget _buildVendorMiniCard(Vendor v) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F29),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              GestureDetector(
                onTap: () => _navigateToVendorStore(v),
                child: Hero(
                  tag: 'vendor_logo_${v.id}',
                  child: Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFFE2B755), width: 1.5),
                      image: DecorationImage(image: NetworkImage(v.logoUrl), fit: BoxFit.cover),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          v.name,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.black, color: Colors.white),
                        ),
                        if (v.isVerified) ...[
                          const SizedBox(width: 4),
                          const Icon(Icons.verified, color: Color(0xFF10B981), size: 12),
                        ]
                      ],
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Icon(Icons.star, color: Color(0xFFE2B755), size: 12),
                        const SizedBox(width: 2),
                        Text(
                          '${v.rating} • ${(v.followers / 1000).toStringAsFixed(1)}k followers',
                          style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.12), borderRadius: BorderRadius.circular(4)),
                      child: Text(
                        '${v.trustScore}% ESCROW RELIABILITY',
                        style: const TextStyle(fontSize: 7.5, fontWeight: FontWeight.black, color: Color(0xFF10B981)),
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textMuted),
                onPressed: () => _navigateToVendorStore(v),
              )
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: Colors.white10),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    _showChatDrawer(v);
                  },
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.message, size: 12, color: Color(0xFFE2B755)),
                      SizedBox(width: 6),
                      Text('MESSAGE', style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 0.5)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    _navigateToVendorStore(v);
                  },
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.store, size: 12, color: Color(0xFFE2B755)),
                      SizedBox(width: 6),
                      Text('VISIT STORE', style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 0.5)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Container(
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: IconButton(
                  icon: const Icon(Icons.phone, size: 14, color: Color(0xFF10B981)),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Simulating telephone link with verified merchant (+251-911-XXXXX)')),
                    );
                  },
                ),
              )
            ],
          )
        ],
      ),
    );
  }

  // Specifications
  Widget _buildSpecificationsTable(Product p) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F29),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.border),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: Column(
          children: List.generate(p.specifications.length, (index) {
            final spec = p.specifications[index];
            final parts = spec.split(': ');
            final key = parts[0];
            final val = parts.length > 1 ? parts[1] : '';
            return Container(
              color: index % 2 == 0 ? Colors.transparent : Colors.white.withOpacity(0.02),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Text(key, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                  ),
                  Expanded(
                    flex: 3,
                    child: Text(val, style: const TextStyle(fontSize: 10.5, color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          }),
        ),
      ),
    );
  }

  // Short Vendor Video Reels
  Widget _buildVendorVideosSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader('MERCHANT WORKSHOP STREAM'),
        const SizedBox(height: 12),
        SizedBox(
          height: 120,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: MockShopData.videos.length,
            itemBuilder: (context, index) {
              final video = MockShopData.videos[index];
              return GestureDetector(
                onTap: () {
                  _showVideoFullscreen(video);
                },
                child: Container(
                  width: 180,
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    image: DecorationImage(image: NetworkImage(video.thumbnailUrl), fit: BoxFit.cover),
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      color: Colors.black38,
                    ),
                    alignment: Alignment.center,
                    child: const Icon(Icons.play_circle_fill, color: Color(0xFFE2B755), size: 34),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // Live Customer Reviews
  Widget _buildReviewsSection(Product p) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            _buildSectionHeader('ESCROW-VERIFIED REVIEWS'),
            Row(
              children: [
                const Icon(Icons.star, color: Color(0xFFE2B755), size: 14),
                const SizedBox(width: 4),
                Text('${p.rating} (${p.reviewsCount})', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: Colors.white)),
              ],
            )
          ],
        ),
        const SizedBox(height: 12),
        Column(
          children: List.generate(p.reviews.length, (index) {
            final comment = p.reviews[index];
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF1A1F29),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('Anonymous Escrow Buyer', style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.12), borderRadius: BorderRadius.circular(4)),
                        child: const Row(
                          children: [
                            Icon(Icons.verified_user, color: Color(0xFF10B981), size: 8),
                            SizedBox(width: 3),
                            Text('VERIFIED PURCHASE', style: TextStyle(fontSize: 6.5, fontWeight: FontWeight.black, color: Color(0xFF10B981))),
                          ],
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(comment, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.4)),
                ],
              ),
            );
          }),
        ),
      ],
    );
  }

  // FAQs
  Widget _buildQuestionsSection(Product p) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader('VERIFIED INTERACTIVE Q&A'),
        const SizedBox(height: 12),
        Column(
          children: List.generate(p.questions.length, (index) {
            final qa = p.questions[index];
            final parts = qa.split('\n');
            final question = parts[0];
            final answer = parts.length > 1 ? parts[1] : '';
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF1A1F29),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                        decoration: BoxDecoration(color: const Color(0xFFC9A227).withOpacity(0.2), borderRadius: BorderRadius.circular(4)),
                        child: const Text('Q', style: TextStyle(fontSize: 8, fontWeight: FontWeight.black, color: Color(0xFFE2B755))),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(question, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                      )
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                        decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.12), borderRadius: BorderRadius.circular(4)),
                        child: const Text('A', style: TextStyle(fontSize: 8, fontWeight: FontWeight.black, color: Color(0xFF10B981))),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(answer, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.4)),
                      )
                    ],
                  ),
                ],
              ),
            );
          }),
        ),
      ],
    );
  }

  // Recommended Carousel
  Widget _buildRecommendedCarousel(Product activeProduct) {
    final others = MockShopData.products.where((item) => item.id != activeProduct.id).toList();
    if (others.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader('RECOMMENDED ALTERNATIVES'),
        const SizedBox(height: 12),
        SizedBox(
          height: 190,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: others.length,
            itemBuilder: (context, index) {
              final item = others[index];
              return GestureDetector(
                onTap: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => ProductDetailScreen(product: item)),
                  );
                },
                child: Container(
                  width: 120,
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
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                            image: DecorationImage(image: NetworkImage(item.imageUrls[0]), fit: BoxFit.cover),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(item.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.black, color: Colors.white)),
                            const SizedBox(height: 2),
                            Text('${item.price.toLocaleString()} ETB', style: const TextStyle(fontSize: 9, color: Color(0xFFE2B755), fontWeight: FontWeight.bold)),
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

  // Sticky Bottom Bar
  Widget _buildStickyBottomBar(Product p, Vendor v) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
        decoration: BoxDecoration(
          color: const Color(0xFF131316),
          border: const Border(top: BorderSide(color: AppColors.border, width: 1.0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 16,
              offset: const Offset(0, -4),
            )
          ],
        ),
        child: Row(
          children: [
            Expanded(
              flex: 2,
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  side: const BorderSide(color: Color(0xFFC9A227), width: 1.2),
                ),
                onPressed: () {
                  CartManager().addItem(p);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const CartScreen()),
                  );
                },
                child: const Text('ADD TO CART', style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: Color(0xFFE2B755), letterSpacing: 0.5)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              flex: 3,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFC9A227),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () {
                  _triggerInstantPurchaseFlow(p, v);
                },
                child: const Text('SECURE BUY NOW', style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 0.5)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Action helpers
  void _triggerInstantPurchaseFlow(Product p, Vendor v) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF131316),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: Row(
            children: [
              const Icon(Icons.shield, color: Color(0xFFC9A227), size: 24),
              const SizedBox(width: 10),
              const Text('SECURE JOINT-ESCROW', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'You are initiating a cryptographically secure purchase of "${p.title}" under Every-zone protection.',
                style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.black38, borderRadius: BorderRadius.circular(12)),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text('Total Value:', style: TextStyle(color: Colors.white60, fontSize: 10.5, fontWeight: FontWeight.bold)),
                    Text('${p.price.toLocaleString()} ETB', style: const TextStyle(color: Color(0xFFE2B755), fontSize: 12, fontWeight: FontWeight.black)),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              const Text(
                'Funds are safely held inside the joint Every-zone and Chapa security vault. The vendor is only paid when you receive and approve the items.',
                style: TextStyle(fontSize: 9, color: Color(0xFF10B981), height: 1.3, fontWeight: FontWeight.bold),
              )
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('ABORT', style: TextStyle(color: Colors.white30, fontSize: 10.5, fontWeight: FontWeight.bold)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFC9A227),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              ),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('🎉 Joint-Escrow Node Initialized: ${p.price.toLocaleString()} ETB secured successfully.'),
                    backgroundColor: const Color(0xFF10B981),
                  ),
                );
              },
              child: const Text('AUTHORIZE', style: TextStyle(fontSize: 10, color: Colors.black, fontWeight: FontWeight.black)),
            )
          ],
        );
      },
    );
  }

  void _showChatDrawer(Vendor v) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF131316),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      builder: (context) {
        return Container(
          padding: EdgeInsets.fromLTRB(16, 20, 16, MediaQuery.of(context).viewInsets.bottom + 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(backgroundImage: NetworkImage(v.logoUrl), radius: 18),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(v.name, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                      const Text('Biometrically secure customer gateway', style: TextStyle(color: Colors.white30, fontSize: 8)),
                    ],
                  ),
                  const Spacer(),
                  IconButton(icon: const Icon(Icons.close, color: Colors.white30, size: 16), onPressed: () => Navigator.pop(context)),
                ],
              ),
              const Divider(color: Colors.white10, height: 24),
              const SizedBox(height: 10),
              const Text('Typical response time: < 5 mins', style: TextStyle(color: Color(0xFF10B981), fontSize: 9.5, fontWeight: FontWeight.black)),
              const SizedBox(height: 12),
              TextField(
                style: const TextStyle(color: Colors.white, fontSize: 12),
                decoration: InputDecoration(
                  hintText: 'Type biometrically signed query...',
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.send, color: Color(0xFFE2B755), size: 16),
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Encrypted message signed and routed through Every-zone P2P gateway.')),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showVideoFullscreen(VendorVideo video) {
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Video Reels Feed',
      pageBuilder: (context, animation, secondaryAnimation) {
        return Scaffold(
          backgroundColor: Colors.black,
          body: Stack(
            alignment: Alignment.center,
            children: [
              // Mock stream indicator
              Image.network(video.thumbnailUrl, fit: BoxFit.fitHeight, width: double.infinity, height: double.infinity),
              const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.video_library, color: Color(0xFFE2B755), size: 54),
                    SizedBox(height: 14),
                    Text('LIVE PRODUCTION LOOP STREAMING', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.0)),
                  ],
                ),
              ),

              // Bottom reel controls
              Positioned(
                bottom: 40,
                left: 20,
                right: 20,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(video.description, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        const Icon(Icons.favorite, color: Color(0xFFEF4444), size: 16),
                        const SizedBox(width: 4),
                        Text('${video.likes}', style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
                        const SizedBox(width: 20),
                        const Icon(Icons.comment, color: Colors.white, size: 16),
                        const SizedBox(width: 4),
                        Text('${video.comments}', style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
                      ],
                    )
                  ],
                ),
              ),

              // Close overlay
              Positioned(
                top: 40,
                right: 20,
                child: Container(
                  decoration: const BoxDecoration(color: Colors.black54, shape: BoxShape.circle),
                  child: IconButton(
                    icon: const Icon(Icons.close, color: Colors.white, size: 18),
                    onPressed: () => Navigator.pop(context),
                  ),
                ),
              )
            ],
          ),
        );
      },
    );
  }

  void _showShareSheet(Product p) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF131316),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('SHARE SECURED LINK', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 1.5, color: Color(0xFFE2B755))),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildShareIcon(Icons.copy, 'Copy Hash'),
                  _buildShareIcon(Icons.message, 'Telegram'),
                  _buildShareIcon(Icons.alternate_email, 'Internal P2P'),
                ],
              )
            ],
          ),
        );
      },
    );
  }

  Widget _buildShareIcon(IconData icon, String label) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Cryptographic link shared successfully via: "$label"')),
        );
      },
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: const Color(0xFF1A1F29), border: Border.all(color: AppColors.border), shape: BoxShape.circle),
            child: Icon(icon, color: const Color(0xFFE2B755), size: 18),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 9.5, fontWeight: FontWeight.bold)),
        ],
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

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.black,
        letterSpacing: 1.0,
        color: Color(0xFFE2B755),
      ),
    );
  }
}
