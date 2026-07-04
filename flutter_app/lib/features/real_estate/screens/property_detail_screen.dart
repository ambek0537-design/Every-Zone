import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/property.dart';
import 'schedule_visit_screen.dart';
import 'agent_profile_screen.dart';

class PropertyDetailScreen extends StatefulWidget {
  final Property property;

  const PropertyDetailScreen({super.key, required this.property});

  @override
  State<PropertyDetailScreen> createState() => _PropertyDetailScreenState();
}

class _PropertyDetailScreenState extends State<PropertyDetailScreen> {
  final RealEstateState _state = RealEstateState();
  String _activeGalleryTab = 'Photos'; // 'Photos' | '360° Tour' | 'Video Tour' | 'Floor Plans' | 'Map'
  int _currentPhotoIndex = 0;
  bool _isPlayingVideo = false;

  // Custom reviews feedback lists to keep state local
  final List<String> _reportedReviewIds = [];
  final List<String> _helpfulReviewIds = [];

  void _showActionToast(String msg, Color bg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: bg, duration: const Duration(seconds: 1)),
    );
  }

  @override
  void initState() {
    super.initState();
    _state.addListener(_onStateChanged);
  }

  @override
  void dispose() {
    _state.removeListener(_onStateChanged);
    super.dispose();
  }

  void _onStateChanged() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final prop = widget.property;
    final bool isFav = _state.isFavorite(prop.id);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Content Scrolling Area
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Hero Gallery Sliver Header
              _buildSliverGallery(prop),

              // Property Content Detail
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Breadcrumb & Category Tag
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.goldDark.withOpacity(0.12),
                              border: Border.all(color: AppColors.goldLight.withOpacity(0.3)),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              '${prop.type.label.toUpperCase()}  •  CERTIFIED #${prop.id.toUpperCase()}',
                              style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8.5, fontWeight: FontWeight.black),
                            ),
                          ),
                          Text(
                            prop.postedDate.toUpperCase(),
                            style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8.5),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Title
                      Text(
                        prop.title,
                        style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.black),
                      ),
                      const SizedBox(height: 6),

                      // Price & Negotiable Label
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            '${prop.currency} ${prop.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                            style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 22, fontWeight: FontWeight.black),
                          ),
                          const SizedBox(width: 10),
                          Text(
                            prop.isNegotiable ? 'NEGOTIABLE' : 'FIXED PRICE',
                            style: TextStyle(
                              fontFamily: 'JetBrains Mono',
                              color: prop.isNegotiable ? Colors.green : AppColors.textMuted,
                              fontSize: 9,
                              fontWeight: FontWeight.black,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Location text
                      Row(
                        children: [
                          const Icon(Icons.location_on, color: AppColors.goldLight, size: 14),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              '${prop.address}, ${prop.city}',
                              style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Core Specifications Grid
                      _buildSectionHeader('CORE PROPERTY PROFILE'),
                      const SizedBox(height: 12),
                      _buildSpecsGrid(prop),
                      const SizedBox(height: 28),

                      // AI-Driven Advanced Forecasts Panel
                      _buildSectionHeader('INTELLIGENT AI SYSTEM METRICS'),
                      const SizedBox(height: 12),
                      _buildAIMetricsPanel(prop),
                      const SizedBox(height: 28),

                      // Detailed Description
                      _buildSectionHeader('EXECUTIVE DESCRIPTION'),
                      const SizedBox(height: 8),
                      Text(
                        prop.description,
                        style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, height: 1.45),
                      ),
                      const SizedBox(height: 28),

                      // Amenities List
                      _buildSectionHeader('AMENITIES & DIGITAL CLEARANCE'),
                      const SizedBox(height: 12),
                      _buildAmenitiesList(prop),
                      const SizedBox(height: 28),

                      // Vetted Agent Card
                      _buildSectionHeader('TRUSTED DEALER ARCHITECT'),
                      const SizedBox(height: 12),
                      _buildAgentCard(prop),
                      const SizedBox(height: 28),

                      // Verified Buyer Reviews Section
                      _buildSectionHeader('AUTHENTIC APPLICANT REVIEWS (${prop.reviews.length})'),
                      const SizedBox(height: 12),
                      _buildReviewsList(prop),

                      const SizedBox(height: 100), // Spacing for sticky bottom
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Custom Close and Favorite Sticky Action Buttons
          Positioned(
            top: MediaQuery.of(context).padding.top + 8,
            left: 16,
            child: Container(
              decoration: const BoxDecoration(color: Colors.black45, shape: BoxShape.circle),
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ),

          Positioned(
            top: MediaQuery.of(context).padding.top + 8,
            right: 16,
            child: Container(
              decoration: const BoxDecoration(color: Colors.black45, shape: BoxShape.circle),
              child: IconButton(
                icon: Icon(isFav ? Icons.favorite : Icons.favorite_border, color: isFav ? AppColors.error : Colors.white, size: 20),
                onPressed: () {
                  _state.toggleFavorite(prop.id);
                  _showActionToast(
                    isFav ? 'Removed from your save collection.' : 'Saved to your Dream Houses collection!',
                    isFav ? AppColors.goldDark : AppColors.success,
                  );
                },
              ),
            ),
          ),

          // Sticky Bottom Actions Panel
          _buildStickyBottomPanel(prop),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontFamily: 'JetBrains Mono',
        fontSize: 10,
        fontWeight: FontWeight.black,
        color: AppColors.goldLight,
        letterSpacing: 1.5,
      ),
    );
  }

  // Gallery view with Parallax
  Widget _buildSliverGallery(Property prop) {
    return SliverAppBar(
      expandedHeight: 280,
      pinned: false,
      automaticallyImplyLeading: false,
      backgroundColor: AppColors.background,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Gallery content based on active tab
            _buildGalleryViewer(prop),

            // Top Ambient Dark Tint
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.black54, Colors.transparent, Colors.black80],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),

            // Inner Gallery Tab Overlays at bottom
            Positioned(
              bottom: 12,
              left: 12,
              right: 12,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: ['Photos', '360° Tour', 'Video Tour', 'Floor Plans', 'Map'].map((tab) {
                  final isSel = _activeGalleryTab == tab;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _activeGalleryTab = tab;
                        _isPlayingVideo = false; // Reset video
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: isSel ? AppColors.goldLight : Colors.black54,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: isSel ? AppColors.goldLight : AppColors.border, width: 0.5),
                      ),
                      child: Text(
                        tab.toUpperCase(),
                        style: TextStyle(
                          fontFamily: 'JetBrains Mono',
                          color: isSel ? AppColors.background : Colors.white70,
                          fontSize: 8,
                          fontWeight: FontWeight.black,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGalleryViewer(Property prop) {
    if (_activeGalleryTab == 'Photos') {
      return PageView.builder(
        itemCount: prop.images.length,
        onPageChanged: (idx) {
          setState(() {
            _currentPhotoIndex = idx;
          });
        },
        itemBuilder: (context, idx) {
          return Image.network(prop.images[idx], fit: BoxFit.cover);
        },
      );
    } else if (_activeGalleryTab == '360° Tour') {
      // Custom 360 virtual tour simulation
      return Stack(
        fit: StackFit.expand,
        children: [
          Image.network(prop.images[0], fit: BoxFit.cover),
          Container(color: Colors.black38),
          Center(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.background.withOpacity(0.85),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.goldLight),
              ),
              child: const Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.threed_rotation, color: AppColors.goldLight, size: 28),
                  SizedBox(height: 6),
                  Text('360° SPATIAL ROOM READY', style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  Text('Swipe to simulate room orientation', style: TextStyle(color: AppColors.textSecondary, fontSize: 8.5)),
                ],
              ),
            ),
          )
        ],
      );
    } else if (_activeGalleryTab == 'Video Tour') {
      return Stack(
        fit: StackFit.expand,
        children: [
          Image.network(prop.images[1 % prop.images.length], fit: BoxFit.cover),
          Container(color: Colors.black54),
          if (_isPlayingVideo) ...[
            const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(color: AppColors.goldLight),
                  SizedBox(height: 12),
                  Text('Streaming Premium Walkthrough...', style: TextStyle(color: Colors.white, fontSize: 10, fontFamily: 'JetBrains Mono')),
                ],
              ),
            ),
            Positioned(
              bottom: 40,
              right: 16,
              child: ElevatedButton.icon(
                onPressed: () => setState(() => _isPlayingVideo = false),
                icon: const Icon(Icons.pause, size: 12),
                label: const Text('STOP STREAM', style: TextStyle(fontSize: 8)),
              ),
            )
          ] else
            Center(
              child: GestureDetector(
                onTap: () => setState(() => _isPlayingVideo = true),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(color: AppColors.goldLight, shape: BoxShape.circle),
                  child: const Icon(Icons.play_arrow, color: AppColors.background, size: 32),
                ),
              ),
            ),
        ],
      );
    } else if (_activeGalleryTab == 'Floor Plans') {
      if (prop.floorPlans.isEmpty) {
        return const Center(child: Text('Blueprint Floorplan is undergoing agency clearance', style: TextStyle(color: AppColors.textMuted, fontSize: 11)));
      }
      return Image.network(prop.floorPlans[0], fit: BoxFit.contain);
    } else {
      // Map view
      return Stack(
        fit: StackFit.expand,
        children: [
          Container(
            color: AppColors.card,
            child: CustomPaint(
              painter: SimpleMapPainter(),
            ),
          ),
          Center(
            child: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: Colors.black.withOpacity(0.8), borderRadius: BorderRadius.circular(10)),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.streetview, color: AppColors.goldLight, size: 16),
                  const SizedBox(width: 8),
                  Text('STREET VIEW READY: ${_currentPhotoIndex == 0 ? "Front" : "Avenue"}', style: const TextStyle(color: Colors.white, fontSize: 9.5, fontFamily: 'JetBrains Mono')),
                ],
              ),
            ),
          )
        ],
      );
    }
  }

  Widget _buildSpecsGrid(Property prop) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: 3,
        childAspectRatio: 1.5,
        children: [
          _buildSpecCell('TOTAL AREA', '${prop.areaSqm} sqm', Icons.square_foot),
          _buildSpecCell('BEDROOMS', prop.bedrooms == 0 ? 'N/A' : '${prop.bedrooms} Bed', Icons.king_bed_outlined),
          _buildSpecCell('BATHROOMS', prop.bathrooms == 0 ? 'N/A' : '${prop.bathrooms} Bath', Icons.shower_outlined),
          _buildSpecCell('PARKING', '${prop.parkingSpaces} slots', Icons.local_parking_outlined),
          _buildSpecCell('FLOOR LEVEL', prop.floorNumber == 0 ? 'Ground' : 'Level ${prop.floorNumber}', Icons.layers_outlined),
          _buildSpecCell('CONSTRUCTED', '${prop.yearBuilt}', Icons.calendar_month_outlined),
        ],
      ),
    );
  }

  Widget _buildSpecCell(String title, String val, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          children: [
            Icon(icon, color: AppColors.goldLight, size: 12),
            const SizedBox(width: 4),
            Text(title, style: const TextStyle(color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold, fontFamily: 'JetBrains Mono')),
          ],
        ),
        const SizedBox(height: 4),
        Text(val, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildAIMetricsPanel(Property prop) {
    final String formattedPrediction = prop.predictedPrice2027.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.goldDark.withOpacity(0.35)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Icon(Icons.auto_awesome_outlined, color: AppColors.goldLight, size: 18),
              const SizedBox(width: 8),
              const Text('AI EVERY-ZONE ALGORITHMIC PROFILE', style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 11, fontWeight: FontWeight.black)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: AppColors.success.withOpacity(0.1), borderRadius: BorderRadius.circular(4)),
                child: const Text('VERIFIED', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.success, fontSize: 7, fontWeight: FontWeight.bold)),
              )
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildAIMetricCircle('INVESTMENT', '${prop.investmentScore}%', AppColors.success),
              _buildAIMetricCircle('NEIGHBORHOOD', '${prop.neighborhoodScore}/100', AppColors.goldLight),
              _buildAIMetricCircle('RENTAL YIELD', '${prop.rentalYieldEstimate}%', Colors.blue),
            ],
          ),
          const SizedBox(height: 20),
          const Divider(color: AppColors.border, height: 1),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('PROJECTED VALUATION (YEAR 2027)', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('ETB $formattedPrediction', style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 13, fontWeight: FontWeight.black)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(8)),
                child: const Row(
                  children: [
                    Icon(Icons.trending_up, color: AppColors.success, size: 12),
                    SizedBox(width: 4),
                    Text('+24% FORECAST', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.success, fontSize: 8.5, fontWeight: FontWeight.black)),
                  ],
                ),
              )
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAIMetricCircle(String title, String val, Color c) {
    return Column(
      children: [
        Container(
          width: 54,
          height: 54,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: c.withOpacity(0.4), width: 1.5),
            color: AppColors.card,
          ),
          alignment: Alignment.center,
          child: Text(
            val,
            style: TextStyle(fontFamily: 'JetBrains Mono', color: c, fontSize: 11, fontWeight: FontWeight.black),
          ),
        ),
        const SizedBox(height: 6),
        Text(title, style: const TextStyle(color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildAmenitiesList(Property prop) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.border)),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: prop.amenities.map((amenity) {
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.shield_outlined, color: AppColors.goldLight, size: 11),
                const SizedBox(width: 6),
                Text(amenity.toUpperCase(), style: const TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 8.5, fontWeight: FontWeight.bold)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAgentCard(Property prop) {
    final agent = prop.agent;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(agent.photoUrl, width: 48, height: 48, fit: BoxFit.cover),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(agent.name, style: const TextStyle(color: Colors.white, fontSize: 13.5, fontWeight: FontWeight.bold)),
                        const SizedBox(width: 4),
                        const Icon(Icons.verified, color: AppColors.goldLight, size: 14),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text('License: ${agent.licenseNumber}', style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8.5)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: AppColors.goldLight.withOpacity(0.12), borderRadius: BorderRadius.circular(6)),
                child: Column(
                  children: [
                    Text('${agent.trustScore}%', style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.black)),
                    const Text('TRUST', style: TextStyle(color: AppColors.textMuted, fontSize: 6.5, fontWeight: FontWeight.bold)),
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildAgentStat('EXPERIENCE', '${agent.yearsExperience} Years'),
              _buildAgentStat('RESPONSE', agent.responseTime),
              _buildAgentStat('RATING', '${agent.rating} ★'),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: AppColors.border, height: 1),
          const SizedBox(height: 12),
          // Agent quick actions
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _showActionToast('Dialing Agent hotline: ${agent.phoneNumber}...', AppColors.goldMedium),
                  icon: const Icon(Icons.phone_outlined, size: 14, color: Colors.white70),
                  label: const Text('CALL', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(side: const BorderSide(color: AppColors.border), padding: const EdgeInsets.symmetric(vertical: 10)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _showActionToast('Loading Secure Chat Portal...', AppColors.success),
                  icon: const Icon(Icons.forum_outlined, size: 14, color: Colors.white70),
                  label: const Text('MESSAGE', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(side: const BorderSide(color: AppColors.border), padding: const EdgeInsets.symmetric(vertical: 10)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _showActionToast('Routing WhatsApp gateway secure link...', Colors.green),
                  icon: const Icon(Icons.chat_bubble_outline, size: 14, color: Colors.white),
                  label: const Text('WHATSAPP', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green[800], padding: const EdgeInsets.symmetric(vertical: 10)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => AgentProfileScreen(agent: agent)));
            },
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('VIEW FULL PROFILE & OTHER LISTINGS', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8.5, fontWeight: FontWeight.black, decoration: TextDecoration.underline)),
                SizedBox(width: 4),
                Icon(Icons.arrow_outward, color: AppColors.goldLight, size: 10),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildAgentStat(String label, String val) {
    return Column(
      children: [
        Text(val, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 8, fontFamily: 'JetBrains Mono')),
      ],
    );
  }

  Widget _buildReviewsList(Property prop) {
    if (prop.reviews.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.border)),
        child: const Column(
          children: [
            Icon(Icons.rate_review_outlined, color: AppColors.textMuted, size: 28),
            SizedBox(height: 8),
            Text('NO VERIFIED REVIEWS YET', style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
            Text('Be the first to review once your physical visit is completed.', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5)),
          ],
        ),
      );
    }

    return Column(
      children: prop.reviews.map((rev) {
        final bool isHelpful = _helpfulReviewIds.contains(rev.id);
        final bool isReported = _reportedReviewIds.contains(rev.id);

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.account_circle, color: AppColors.textMuted, size: 16),
                      const SizedBox(width: 6),
                      Text(rev.reviewerName, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  Row(
                    children: List.generate(5, (starIdx) {
                      return Icon(Icons.star, color: starIdx < rev.rating ? AppColors.goldLight : Colors.white12, size: 10);
                    }),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              if (rev.isVerifiedBuyer)
                Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: Colors.green.withOpacity(0.12), borderRadius: BorderRadius.circular(4)),
                  child: const Text('VERIFIED BUYER / VISITOR', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.success, fontSize: 7, fontWeight: FontWeight.bold)),
                ),
              Text(
                rev.comment,
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, height: 1.4),
              ),
              if (rev.images.isNotEmpty) ...[
                const SizedBox(height: 10),
                SizedBox(
                  height: 50,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: rev.images.length,
                    itemBuilder: (context, iIdx) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: Image.network(rev.images[iIdx], width: 70, fit: BoxFit.cover),
                        ),
                      );
                    },
                  ),
                ),
              ],
              
              // Agent reply
              if (rev.agentReply != null) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.border)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.reply, color: AppColors.goldLight, size: 12),
                          const SizedBox(width: 6),
                          Text('REPLY FROM ${prop.agent.name.toUpperCase()}', style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8, fontWeight: FontWeight.black)),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(rev.agentReply!, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10.5, fontStyle: FontStyle.italic)),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 12),
              const Divider(color: AppColors.border, height: 1),
              const SizedBox(height: 8),

              // Helpful & Report
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () {
                      if (isHelpful) return;
                      setState(() {
                        _helpfulReviewIds.add(rev.id);
                        _state.incrementHelpful(prop.id, rev.id);
                      });
                      _showActionToast('Thank you for your feedback.', AppColors.success);
                    },
                    child: Row(
                      children: [
                        Icon(Icons.thumb_up_alt_outlined, color: isHelpful ? AppColors.goldLight : AppColors.textMuted, size: 12),
                        const SizedBox(width: 6),
                        Text(
                          'Helpful (${rev.helpfulCount})',
                          style: TextStyle(fontFamily: 'JetBrains Mono', color: isHelpful ? AppColors.goldLight : AppColors.textMuted, fontSize: 8.5),
                        ),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      if (isReported) return;
                      setState(() {
                        _reportedReviewIds.add(rev.id);
                        _state.reportReview(prop.id, rev.id);
                      });
                      _showActionToast('Review reported and queued for federal inspection.', AppColors.error);
                    },
                    child: Row(
                      children: [
                        Icon(Icons.flag_outlined, color: isReported ? AppColors.error : AppColors.textMuted, size: 12),
                        const SizedBox(width: 4),
                        Text(
                          isReported ? 'Reported' : 'Report',
                          style: TextStyle(fontFamily: 'JetBrains Mono', color: isReported ? AppColors.error : AppColors.textMuted, fontSize: 8.5),
                        ),
                      ],
                    ),
                  ),
                ],
              )
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildStickyBottomPanel(Property prop) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: const Border(top: BorderSide(color: AppColors.border)),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 10, offset: const Offset(0, -2))],
        ),
        child: Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ScheduleVisitScreen(propertyId: prop.id, propertyTitle: prop.title, agentName: prop.agent.name),
                    ),
                  );
                },
                icon: const Icon(Icons.calendar_month, color: AppColors.background, size: 14),
                label: const Text('SCHEDULE VISIT', style: TextStyle(color: AppColors.background, fontSize: 10, fontWeight: FontWeight.black)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.goldLight,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  _showActionToast('Transmitting secure property transaction offer dossier...', AppColors.success);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.card,
                  side: const BorderSide(color: AppColors.border),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: Text(
                  prop.currency.contains('/mo') ? 'RENT PROPERTY' : 'BUY PROPERTY',
                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class SimpleMapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.border
      ..strokeWidth = 1.0;

    // Draw some mock grid streets
    for (double i = 0; i < size.width; i += 40) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), paint);
    }
    for (double j = 0; j < size.height; j += 40) {
      canvas.drawLine(Offset(0, j), Offset(size.width, j), paint);
    }

    // Draw a main highway
    final mainRoadPaint = Paint()
      ..color = AppColors.surface
      ..strokeWidth = 12.0;
    canvas.drawLine(Offset(0, size.height / 2), Offset(size.width, size.height / 2), mainRoadPaint);

    // Draw target marker point
    final markerPaint = Paint()..color = AppColors.goldLight;
    canvas.drawCircle(Offset(size.width / 2, size.height / 2), 10, markerPaint);

    final innerMarkerPaint = Paint()..color = AppColors.background;
    canvas.drawCircle(Offset(size.width / 2, size.height / 2), 4, innerMarkerPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
