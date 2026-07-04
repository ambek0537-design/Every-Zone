import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/shop_models.dart';
import '../data/mock_shop_data.dart';
import 'shop_home_screen.dart'; // For formatting extension
import 'product_detail_screen.dart';

class VendorStoreScreen extends StatefulWidget {
  final Vendor vendor;

  const VendorStoreScreen({
    super.key,
    required this.vendor,
  });

  @override
  State<VendorStoreScreen> createState() => _VendorStoreScreenState();
}

class _VendorStoreScreenState extends State<VendorStoreScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isFollowing = false;
  String _activeCategoryFilter = 'all';
  String _activeSortFilter = 'popular';

  @override
  void initState() {
    super.initState();
    // 7 tabs: Products, Services, Posts, Videos, Reviews, About, Policies
    _tabController = TabController(length: 7, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final v = widget.vendor;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            // Custom Slivers for beautiful cover/logo overlay
            _buildCoverHeader(v),
            
            // Core Info Card (Verified badges, followers, trust scores)
            SliverToBoxAdapter(
              child: _buildCoreInfoSection(v),
            ),

            // Tab bar slider
            SliverPersistentHeader(
              pinned: true,
              delegate: _SliverAppBarDelegate(
                TabBar(
                  controller: _tabController,
                  isScrollable: true,
                  indicatorColor: const Color(0xFFC9A227),
                  labelColor: const Color(0xFFE2B755),
                  unselectedLabelColor: AppColors.textSecondary,
                  indicatorWeight: 3.0,
                  labelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 0.5),
                  unselectedLabelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                  tabs: const [
                    Tab(text: 'PRODUCTS'),
                    Tab(text: 'SERVICES'),
                    Tab(text: 'POSTS'),
                    Tab(text: 'VIDEOS'),
                    Tab(text: 'REVIEWS'),
                    Tab(text: 'ABOUT'),
                    Tab(text: 'POLICIES'),
                  ],
                ),
              ),
            ),
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildProductsTab(v),
            _buildServicesTab(v),
            _buildPostsTab(v),
            _buildVideosTab(v),
            _buildReviewsTab(v),
            _buildAboutTab(v),
            _buildPoliciesTab(v),
          ],
        ),
      ),
    );
  }

  // Cover Page Header
  Widget _buildCoverHeader(Vendor v) {
    return SliverAppBar(
      expandedHeight: 180,
      backgroundColor: AppColors.background,
      elevation: 0,
      pinned: true,
      leading: Container(
        margin: const EdgeInsets.all(8),
        decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(10)),
        child: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      actions: [
        Container(
          margin: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(10)),
          child: IconButton(
            icon: const Icon(Icons.share, color: Colors.white, size: 18),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Cryptographic company profile link for "${v.name}" copied.')),
              );
            },
          ),
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            Hero(
              tag: 'vendor_cover_${v.id}',
              child: Image.network(v.coverUrl, fit: BoxFit.cover),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.black.withOpacity(0.8), Colors.transparent, Colors.black.withOpacity(0.9)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Core business metadata & action buttons
  Widget _buildCoreInfoSection(Vendor v) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Logo & Title Alignment
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              // Circular Business Logo overlaying cover slightly
              Transform.translate(
                offset: const Offset(0, -10),
                child: Hero(
                  tag: 'vendor_logo_${v.id}',
                  child: Container(
                    width: 74,
                    height: 74,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.surface,
                      border: Border.all(color: const Color(0xFFC9A227), width: 2.0),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4)),
                      ],
                      image: DecorationImage(image: NetworkImage(v.logoUrl), fit: BoxFit.cover),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            v.name,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.black, color: Colors.white),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (v.isVerified)
                          const Icon(Icons.verified, color: Color(0xFF10B981), size: 14),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        if (v.isPremium)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            margin: const EdgeInsets.only(right: 6),
                            decoration: BoxDecoration(
                              color: const Color(0xFFC9A227).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(color: const Color(0xFFC9A227).withOpacity(0.3)),
                            ),
                            child: const Text('✦ PREMIUM MERCHANDISE', style: TextStyle(color: Color(0xFFE2B755), fontSize: 7, fontWeight: FontWeight.black)),
                          ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.12), borderRadius: BorderRadius.circular(4)),
                          child: Text('${v.trustScore}% ESCROW TRUST', style: const TextStyle(color: Color(0xFF10B981), fontSize: 7, fontWeight: FontWeight.black)),
                        ),
                      ],
                    ),
                  ],
                ),
              )
            ],
          ),

          // Business quick stats
          Container(
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1F29),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem('${(v.followers / 1000).toStringAsFixed(1)}k', 'Followers'),
                _buildStatItem('${v.ordersCompleted}', 'Orders Completed'),
                _buildStatItem(v.responseTime, 'Response Time'),
                _buildStatItem('${v.yearsOnPlatform} Years', 'Age in Zone'),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Responsive interactive action drawer buttons
          Row(
            children: [
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isFollowing ? const Color(0xFF1A1F29) : const Color(0xFFC9A227),
                    foregroundColor: _isFollowing ? Colors.white : Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: _isFollowing ? const BorderSide(color: Colors.white24) : BorderSide.none,
                    ),
                  ),
                  onPressed: () {
                    setState(() {
                      _isFollowing = !_isFollowing;
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(_isFollowing ? 'Now securely following ${v.name}!' : 'Unfollowed successfully.'),
                        backgroundColor: const Color(0xFFC9A227),
                      ),
                    );
                  },
                  child: Text(_isFollowing ? '✓ FOLLOWING' : '✦ FOLLOW VENDOR', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.black)),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                decoration: BoxDecoration(color: const Color(0xFF1A1F29), border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(12)),
                child: IconButton(
                  icon: const Icon(Icons.chat_bubble_outline, color: Color(0xFFE2B755), size: 16),
                  onPressed: () => _showQuickContact(v, 'Message'),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                decoration: BoxDecoration(color: const Color(0xFF1A1F29), border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(12)),
                child: IconButton(
                  icon: const Icon(Icons.phone_outlined, color: Color(0xFF10B981), size: 16),
                  onPressed: () => _showQuickContact(v, 'Telephone Dial'),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                decoration: BoxDecoration(color: const Color(0xFF1A1F29), border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(12)),
                child: IconButton(
                  icon: const Icon(Icons.directions_outlined, color: Colors.blueAccent, size: 16),
                  onPressed: () => _showQuickContact(v, 'Physical Radar Directions'),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                decoration: BoxDecoration(color: const Color(0xFF1A1F29), border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(12)),
                child: IconButton(
                  icon: const Icon(Icons.report_problem_outlined, color: AppColors.error, size: 16),
                  onPressed: () => _showArbitrationReport(v),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Business Details Quick lines
          Row(
            children: [
              const Icon(Icons.location_on, size: 12, color: AppColors.textMuted),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  v.address,
                  style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              const Icon(Icons.access_time_filled, size: 12, color: AppColors.textMuted),
              const SizedBox(width: 6),
              Text(
                'Open: ${v.openHours}',
                style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String val, String label) {
    return Column(
      children: [
        Text(val, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.black, color: Colors.white)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 9, color: AppColors.textMuted, fontWeight: FontWeight.bold)),
      ],
    );
  }

  // --- TABS IMPLEMENTATIONS ---

  // PRODUCTS TAB
  Widget _buildProductsTab(Vendor v) {
    final list = MockShopData.products.where((p) => p.vendorId == v.id).toList();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // Filter Sort row
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text('IN-STORE CATALOG', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, color: Color(0xFFE2B755))),
              Row(
                children: [
                  _buildTabActionChip('Popular', _activeSortFilter == 'popular', () {
                    setState(() {
                      _activeSortFilter = 'popular';
                    });
                  }),
                  const SizedBox(width: 8),
                  _buildTabActionChip('Price High', _activeSortFilter == 'price', () {
                    setState(() {
                      _activeSortFilter = 'price';
                    });
                  }),
                ],
              )
            ],
          ),
          const SizedBox(height: 14),

          Expanded(
            child: GridView.builder(
              physics: const BouncingScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.65,
                crossAxisSpacing: 14,
                mainAxisSpacing: 14,
              ),
              itemCount: list.length,
              itemBuilder: (context, index) {
                final p = list[index];
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => ProductDetailScreen(product: p)),
                    );
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF1A1F29),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                              image: DecorationImage(image: NetworkImage(p.imageUrls[0]), fit: BoxFit.cover),
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(p.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.black, color: Colors.white)),
                              const SizedBox(height: 2),
                              Text('${p.price.toLocaleString()} ETB', style: const TextStyle(fontSize: 10, color: Color(0xFFE2B755), fontWeight: FontWeight.black)),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }

  Widget _buildTabActionChip(String label, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFC9A227).withOpacity(0.15) : const Color(0xFF1A1F29),
          border: Border.all(color: isSelected ? const Color(0xFFC9A227) : AppColors.border),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(label, style: TextStyle(color: isSelected ? const Color(0xFFE2B755) : AppColors.textSecondary, fontSize: 9, fontWeight: FontWeight.bold)),
      ),
    );
  }

  // SERVICES TAB
  Widget _buildServicesTab(Vendor v) {
    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: MockShopData.services.length,
      itemBuilder: (context, index) {
        final service = MockShopData.services[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1F29),
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 76,
                height: 76,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(14),
                  image: DecorationImage(image: NetworkImage(service.imageUrl), fit: BoxFit.cover),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(service.title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: Colors.white)),
                    const SizedBox(height: 4),
                    Text('Duration: ${service.duration}', style: const TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text('Starting from ${service.startingPrice.toLocaleString()} ETB', style: const TextStyle(color: Color(0xFFE2B755), fontSize: 11, fontWeight: FontWeight.black)),
                  ],
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFC9A227),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () => _triggerServiceBooking(service),
                child: const Text('BOOK', style: TextStyle(fontSize: 9, fontWeight: FontWeight.black)),
              )
            ],
          ),
        );
      },
    );
  }

  void _triggerServiceBooking(VendorService service) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF131316),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: const Text('BOOK SPECIALIST NODE', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('You are booking: "${service.title}"', style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text(service.description, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10.5, height: 1.4)),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(10)),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text('Base Escrow Fee:', style: TextStyle(color: Colors.white60, fontSize: 10)),
                    Text('${service.startingPrice.toLocaleString()} ETB', style: const TextStyle(color: Color(0xFFE2B755), fontSize: 11, fontWeight: FontWeight.black)),
                  ],
                ),
              )
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCEL', style: TextStyle(color: Colors.white30, fontSize: 10))),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFC9A227)),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('🎉 Service appointment submitted. ${service.startingPrice.toLocaleString()} ETB locked in Escrow.'),
                    backgroundColor: const Color(0xFF10B981),
                  ),
                );
              },
              child: const Text('CONFIRM', style: TextStyle(fontSize: 10, color: Colors.black, fontWeight: FontWeight.black)),
            )
          ],
        );
      },
    );
  }

  // POSTS TAB
  Widget _buildPostsTab(Vendor v) {
    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: MockShopData.posts.length,
      itemBuilder: (context, index) {
        final post = MockShopData.posts[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1F29),
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: post.isPinned ? const Color(0xFFC9A227).withOpacity(0.3) : AppColors.border, width: post.isPinned ? 1.5 : 1.0),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(backgroundImage: NetworkImage(v.logoUrl), radius: 18),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(v.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                            if (post.isPinned) ...[
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                                decoration: BoxDecoration(color: const Color(0xFFC9A227).withOpacity(0.2), borderRadius: BorderRadius.circular(4)),
                                child: const Text('📌 PINNED', style: TextStyle(color: Color(0xFFE2B755), fontSize: 6.5, fontWeight: FontWeight.black)),
                              )
                            ]
                          ],
                        ),
                        Text(post.timestamp, style: const TextStyle(fontSize: 9, color: AppColors.textMuted)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(post.content, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4)),
              if (post.imageUrls.isNotEmpty) ...[
                const SizedBox(height: 12),
                SizedBox(
                  height: 140,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: post.imageUrls.length,
                    itemBuilder: (context, idx) {
                      return Container(
                        width: 200,
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(14),
                          image: DecorationImage(image: NetworkImage(post.imageUrls[idx]), fit: BoxFit.cover),
                        ),
                      );
                    },
                  ),
                ),
              ],
              const SizedBox(height: 14),
              const Divider(color: Colors.white10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildPostAction(Icons.thumb_up_outlined, '${post.likes} Likes'),
                  _buildPostAction(Icons.comment_outlined, '${post.comments} Comments'),
                  _buildPostAction(Icons.share_outlined, 'Share'),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPostAction(IconData icon, String label) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Interacting with live post: "$label"')),
        );
      },
      child: Row(
        children: [
          Icon(icon, size: 14, color: const Color(0xFFE2B755)),
          const SizedBox(width: 6),
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  // VIDEOS TAB
  Widget _buildVideosTab(Vendor v) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: GridView.builder(
        physics: const BouncingScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 1.3,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
        ),
        itemCount: MockShopData.videos.length,
        itemBuilder: (context, index) {
          final video = MockShopData.videos[index];
          return GestureDetector(
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Launching fullscreen premium video simulation...')),
              );
            },
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                image: DecorationImage(image: NetworkImage(video.thumbnailUrl), fit: BoxFit.cover),
              ),
              child: Container(
                decoration: BoxDecoration(borderRadius: BorderRadius.circular(16), color: Colors.black38),
                alignment: Alignment.center,
                child: const Icon(Icons.play_circle_fill, color: Color(0xFFE2B755), size: 38),
              ),
            ),
          );
        },
      ),
    );
  }

  // REVIEWS TAB
  Widget _buildReviewsTab(Vendor v) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('${v.rating}', style: const TextStyle(fontSize: 34, fontWeight: FontWeight.black, color: Colors.white)),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.star, color: Color(0xFFE2B755), size: 16),
                        Icon(Icons.star, color: Color(0xFFE2B755), size: 16),
                        Icon(Icons.star, color: Color(0xFFE2B755), size: 16),
                        Icon(Icons.star, color: Color(0xFFE2B755), size: 16),
                        Icon(Icons.star, color: Color(0xFFE2B755), size: 16),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('Based on ${v.ordersCompleted} escrow completions.', style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 24),

          const Text('CUSTOMER FEEDBACK', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, color: Color(0xFFE2B755))),
          const SizedBox(height: 12),

          Column(
            children: List.generate(MockShopData.reviews.length, (index) {
              final rev = MockShopData.reviews[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1F29),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Text(rev.reviewerName, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Colors.white)),
                        Text(rev.date, style: const TextStyle(fontSize: 9, color: AppColors.textMuted)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: List.generate(5, (starIdx) {
                        return Icon(
                          Icons.star,
                          size: 11,
                          color: starIdx < rev.rating.round() ? const Color(0xFFE2B755) : Colors.white24,
                        );
                      }),
                    ),
                    const SizedBox(height: 10),
                    Text(rev.comment, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, height: 1.4)),
                    
                    if (rev.vendorReply.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(color: Colors.black26, borderRadius: BorderRadius.circular(10)),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.store, color: Color(0xFFE2B755), size: 10),
                                SizedBox(width: 4),
                                Text('Vendor Official Response', style: TextStyle(color: Color(0xFFE2B755), fontSize: 9.5, fontWeight: FontWeight.bold)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(rev.vendorReply, style: const TextStyle(fontSize: 10.5, color: AppColors.textSecondary, height: 1.3)),
                          ],
                        ),
                      ),
                    ]
                  ],
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  // ABOUT TAB
  Widget _buildAboutTab(Vendor v) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('COMPANY BIOMETRIC STORY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, color: Color(0xFFE2B755))),
          const SizedBox(height: 10),
          Text(v.businessStory, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, height: 1.5)),
          const SizedBox(height: 24),

          const Text('GOVERNMENT COMPLIANCE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, color: Color(0xFFE2B755))),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: const Color(0xFF1A1F29), borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.border)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildAboutLine('Tax / License ID', v.licenseNumber),
                const Divider(color: Colors.white10),
                _buildAboutLine('Certified Credentials', v.certificates.join('\n• ')),
                const Divider(color: Colors.white10),
                _buildAboutLine('Authorized Domain', v.website),
              ],
            ),
          ),
          const SizedBox(height: 24),

          const Text('SOCIAL BRIDGE LINKS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, color: Color(0xFFE2B755))),
          const SizedBox(height: 12),
          Column(
            children: List.generate(v.socialLinks.length, (index) {
              final link = v.socialLinks[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: const Color(0xFF1A1F29), borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
                child: Row(
                  children: [
                    const Icon(Icons.link, size: 14, color: Color(0xFFE2B755)),
                    const SizedBox(width: 10),
                    Text(link, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                  ],
                ),
              );
            }),
          )
        ],
      ),
    );
  }

  Widget _buildAboutLine(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 9.5, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  // POLICIES TAB
  Widget _buildPoliciesTab(Vendor v) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('CHAPA CO-ESCROW PROTECTION POLICIES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, color: Color(0xFFE2B755))),
          const SizedBox(height: 12),
          _buildPolicyCard(
            'Escrow Release SLA',
            'Funds remain locked in the security vault for up to 5 business days post-delivery. Once you confirm standard verification of the items, Chapa dispatches payouts securely to the merchant.',
          ),
          _buildPolicyCard(
            'Delivery Lead & Late Fine SLA',
            'All products are dispatched within 24 hours. In case of delay exceeding 72 hours, the buyer can request a 100% immediate single-signature escrow refund.',
          ),
          _buildPolicyCard(
            'Refund & Arbitration Procedure',
            'Joint-arbitrators are assigned instantly from Every-zone when an issue is logged. Buyers and sellers submit photos biometrically for swift dispute resolution.',
          ),
        ],
      ),
    );
  }

  Widget _buildPolicyCard(String title, String text) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F29),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.verified, color: Color(0xFF10B981), size: 14),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: Colors.white)),
            ],
          ),
          const SizedBox(height: 8),
          Text(text, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10.5, height: 1.4)),
        ],
      ),
    );
  }

  // --- POPUP / SHEET ACTION HELPERS ---

  void _showQuickContact(Vendor v, String method) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Connecting through secure Every-zone node: "$method" with ${v.name}.'),
        backgroundColor: const Color(0xFFC9A227),
      ),
    );
  }

  void _showArbitrationReport(Vendor v) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF131316),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: const Text('SUBMIT AUDIT REPORT', style: TextStyle(color: AppColors.error, fontSize: 12, fontWeight: FontWeight.black)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Are you reporting ${v.name} for Escrow non-compliance or counterfeit issues?',
                style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 12),
              TextField(
                style: const TextStyle(color: Colors.white, fontSize: 11),
                decoration: InputDecoration(
                  hintText: 'Detailed grievance statement...',
                  fillColor: Colors.black12,
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCEL', style: TextStyle(color: Colors.white30, fontSize: 10))),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Report logged securely. Every-zone Compliance Division will audit this node immediately.')),
                );
              },
              child: const Text('SUBMIT', style: TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.black)),
            )
          ],
        );
      },
    );
  }
}

// Persistent delegate for beautiful custom tab layouts
class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar _tabBar;

  _SliverAppBarDelegate(this._tabBar);

  @override
  double get minExtent => _tabBar.preferredSize.height;
  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: AppColors.background,
      child: _tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}
