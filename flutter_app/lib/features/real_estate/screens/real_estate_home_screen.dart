import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/property.dart';
import 'property_detail_screen.dart';
import 'property_comparison_screen.dart';
import 'map_search_screen.dart';
import 'favorites_screen.dart';
import 'schedule_visit_screen.dart';

class RealEstateHomeScreen extends StatefulWidget {
  const RealEstateHomeScreen({super.key});

  @override
  State<RealEstateHomeScreen> createState() => _RealEstateHomeScreenState();
}

class _RealEstateHomeScreenState extends State<RealEstateHomeScreen> {
  final RealEstateState _state = RealEstateState();
  
  // Search parameters
  String _searchQuery = '';
  String _selectedSearchType = 'Houses'; // 'Houses' | 'Areas' | 'Agents'
  PropertyType? _selectedPropertyType;
  String _activeQuickFilter = 'All'; // 'All' | 'Buy' | 'Rent' | 'New' | 'Verified' | 'Featured' | 'Nearby' | 'Luxury'

  // Pagination for "Recently Added"
  final List<Property> _recentlyAddedProperties = [];
  bool _isLoadingMore = false;
  int _currentPage = 1;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _state.addListener(_onStateChanged);
    _loadMoreRecentProperties();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
        _loadMoreRecentProperties();
      }
    });
  }

  @override
  void dispose() {
    _state.removeListener(_onStateChanged);
    _scrollController.dispose();
    super.dispose();
  }

  void _onStateChanged() {
    if (mounted) setState(() {});
  }

  // Infinite Scroll Simulator
  void _loadMoreRecentProperties() {
    if (_isLoadingMore) return;
    setState(() {
      _isLoadingMore = true;
    });

    Future.delayed(const Duration(milliseconds: 1000), () {
      if (!mounted) return;
      
      // Simulate fetching paginated items from our mock list
      final allProps = _state.properties;
      final int start = (_currentPage - 1) * 3;
      
      if (start < allProps.length) {
        final end = (start + 3) < allProps.length ? start + 3 : allProps.length;
        _recentlyAddedProperties.addAll(allProps.sublist(start, end));
        _currentPage++;
      }
      
      setState(() {
        _isLoadingMore = false;
      });
    });
  }

  void _showVoiceSearchDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: AppColors.background,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(color: AppColors.border),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.mic, color: AppColors.goldLight, size: 54),
                const SizedBox(height: 24),
                const Text(
                  'SPEAK NOW',
                  style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 13, fontWeight: FontWeight.black, letterSpacing: 2),
                ),
                const SizedBox(height: 12),
                const Text(
                  '"Show me luxury villas in Bole with a pool"',
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 12, fontStyle: FontStyle.italic),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.goldMedium.withOpacity(0.5)),
                    color: AppColors.surface,
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                )
              ],
            ),
          ),
        );
      },
    );
  }

  void _showQRScannerDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: AppColors.background,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(color: AppColors.border),
          ),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text('SCAN PROPERTY QR', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black, fontFamily: 'JetBrains Mono')),
                    IconButton(icon: const Icon(Icons.close, color: Colors.white70), onPressed: () => Navigator.pop(context)),
                  ],
                ),
                const SizedBox(height: 20),
                Container(
                  width: 220,
                  height: 220,
                  decoration: BoxDecoration(
                    color: Colors.black26,
                    border: Border.all(color: AppColors.goldLight, width: 2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Scanner crosshair mock
                      Container(width: 180, height: 2, color: AppColors.goldLight.withOpacity(0.6)),
                      Container(width: 2, height: 180, color: AppColors.goldLight.withOpacity(0.6)),
                      const Icon(Icons.qr_code_scanner, size: 80, color: Colors.white30),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Point your camera at an Every-zone physical yard sign QR code to fetch the legal title deeds instantly.',
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 11, height: 1.4),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // Filter properties based on home parameters
  List<Property> _getFilteredProperties() {
    List<Property> list = _state.properties;

    // Filter by type
    if (_selectedPropertyType != null) {
      list = list.where((p) => p.type == _selectedPropertyType).toList();
    }

    // Filter by quick filter
    if (_activeQuickFilter == 'Buy') {
      list = list.where((p) => !p.currency.contains('/mo')).toList();
    } else if (_activeQuickFilter == 'Rent') {
      list = list.where((p) => p.currency.contains('/mo')).toList();
    } else if (_activeQuickFilter == 'New') {
      list = list.where((p) => p.yearBuilt >= 2024).toList();
    } else if (_activeQuickFilter == 'Verified') {
      list = list.where((p) => p.isVerified).toList();
    } else if (_activeQuickFilter == 'Featured') {
      list = list.where((p) => p.isFeatured).toList();
    } else if (_activeQuickFilter == 'Nearby') {
      list = list.where((p) => p.isNearby).toList();
    } else if (_activeQuickFilter == 'Luxury') {
      list = list.where((p) => p.price >= 50000000).toList();
    }

    // Filter by search query
    if (_searchQuery.trim().isNotEmpty) {
      final query = _searchQuery.toLowerCase();
      if (_selectedSearchType == 'Houses') {
        list = list.where((p) => p.title.toLowerCase().contains(query) || p.description.toLowerCase().contains(query)).toList();
      } else if (_selectedSearchType == 'Areas') {
        list = list.where((p) => p.address.toLowerCase().contains(query) || p.city.toLowerCase().contains(query)).toList();
      } else if (_selectedSearchType == 'Agents') {
        list = list.where((p) => p.agent.name.toLowerCase().contains(query)).toList();
      }
    }

    return list;
  }

  @override
  Widget build(BuildContext context) {
    final featured = _state.properties.where((p) => p.isFeatured).toList();
    final aiRecommended = _state.properties.where((p) => p.isAiRecommended).toList();
    final nearby = _state.properties.where((p) => p.isNearby).toList();
    final filtered = _getFilteredProperties();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Top Nav bar / Header
            _buildHeaderPanel(),

            // Main scroll area
            Expanded(
              child: RefreshIndicator(
                color: AppColors.goldLight,
                backgroundColor: AppColors.card,
                onRefresh: () async {
                  setState(() {
                    _currentPage = 1;
                    _recentlyAddedProperties.clear();
                  });
                  _loadMoreRecentProperties();
                },
                child: SingleChildScrollView(
                  controller: _scrollController,
                  physics: const BouncingScrollPhysics(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Quick Nav Shortcuts bar
                      _buildQuickNavShortcuts(),

                      // Top Search & Type Toggles
                      _buildSearchSection(),

                      // Property Types Horizontal List
                      _buildPropertyTypesSection(),

                      // Quick Filters Tabs
                      _buildQuickFiltersSection(),

                      // Conditional view: If searching/filtering is active, render search results. Else, render default sections
                      if (_searchQuery.trim().isNotEmpty || _selectedPropertyType != null || _activeQuickFilter != 'All') ...[
                        _buildSearchResultsSection(filtered),
                      ] else ...[
                        // Featured Properties Carousel
                        if (featured.isNotEmpty) _buildFeaturedCarousel(featured),
                        
                        // Recommended for You (AI based)
                        if (aiRecommended.isNotEmpty) _buildAIRecommendations(aiRecommended),

                        // Nearby Properties (Location based)
                        if (nearby.isNotEmpty) _buildNearbySection(nearby),

                        // Recently Added (Infinite Scroll)
                        _buildRecentlyAddedSection(),
                      ],
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderPanel() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  gradient: AppColors.goldGradient,
                  borderRadius: BorderRadius.circular(8),
                ),
                alignment: Alignment.center,
                child: const Text('✦', style: TextStyle(color: AppColors.background, fontSize: 16, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('EVERY-ZONE PREMIUM', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8.5, fontWeight: FontWeight.black, letterSpacing: 1.2)),
                  Text('Certified Real Estate', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              )
            ],
          ),
          // Comparison state floating badge
          if (_state.comparisonIds.isNotEmpty)
            GestureDetector(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const PropertyComparisonScreen()));
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.goldDark.withOpacity(0.2),
                  border: Border.all(color: AppColors.goldLight.withOpacity(0.5)),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.compare_arrows, color: AppColors.goldLight, size: 12),
                    const SizedBox(width: 4),
                    Text(
                      'COMPARE (${_state.comparisonIds.length})',
                      style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8, fontWeight: FontWeight.black),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildQuickNavShortcuts() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      color: AppColors.surface.withOpacity(0.5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildShortcutBtn(Icons.map_outlined, 'MAP SEARCH', () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const MapSearchScreen()));
          }),
          _buildShortcutBtn(Icons.favorite_outline, 'SAVED HOUSES', () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const FavoritesScreen()));
          }),
          _buildShortcutBtn(Icons.calendar_month_outlined, 'VISITS BOOKED', () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const ScheduleVisitScreen()));
          }),
        ],
      ),
    );
  }

  Widget _buildShortcutBtn(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppColors.goldLight, size: 12),
            const SizedBox(width: 6),
            Text(label, style: const TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 8.5, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchSection() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search type selection tabs
          Row(
            children: ['Houses', 'Areas', 'Agents'].map((type) {
              final isSel = _selectedSearchType == type;
              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedSearchType = type;
                  });
                },
                child: Container(
                  margin: const EdgeInsets.only(right: 8, bottom: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isSel ? AppColors.goldDark.withOpacity(0.15) : Colors.transparent,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: isSel ? AppColors.goldMedium : Colors.transparent, width: 1),
                  ),
                  child: Text(
                    'Search $type',
                    style: TextStyle(
                      fontFamily: 'JetBrains Mono',
                      color: isSel ? AppColors.goldLight : AppColors.textSecondary,
                      fontSize: 9.5,
                      fontWeight: isSel ? FontWeight.black : FontWeight.normal,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 4),
          // Search box
          Container(
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12),
                  child: Icon(Icons.search, color: AppColors.textMuted, size: 18),
                ),
                Expanded(
                  child: TextField(
                    onChanged: (val) {
                      setState(() {
                        _searchQuery = val;
                      });
                    },
                    style: const TextStyle(color: Colors.white, fontSize: 12),
                    decoration: InputDecoration(
                      hintText: 'Search properties by title, features...',
                      hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                      border: InputBorder.none,
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, color: Colors.white70, size: 16),
                              onPressed: () {
                                setState(() {
                                  _searchQuery = '';
                                });
                              },
                            )
                          : null,
                    ),
                  ),
                ),
                // Voice search trigger
                IconButton(
                  icon: const Icon(Icons.mic_none, color: AppColors.goldLight, size: 18),
                  onPressed: _showVoiceSearchDialog,
                ),
                // QR Scanner trigger
                IconButton(
                  icon: const Icon(Icons.qr_code_scanner_outlined, color: AppColors.goldLight, size: 18),
                  onPressed: _showQRScannerDialog,
                ),
                const SizedBox(width: 4),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPropertyTypesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text('PROPERTY CATEGORIES', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 9.5, fontWeight: FontWeight.black, letterSpacing: 1.2)),
              if (_selectedPropertyType != null)
                TextButton(
                  onPressed: () {
                    setState(() {
                      _selectedPropertyType = null;
                    });
                  },
                  child: const Text('CLEAR', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.error, fontSize: 8.5, fontWeight: FontWeight.bold)),
                )
            ],
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 64,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: PropertyType.values.length + 1,
            itemBuilder: (context, index) {
              if (index == PropertyType.values.length) {
                return _buildTypeItemCard(null, 'All', '🏰');
              }
              final type = PropertyType.values[index];
              return _buildTypeItemCard(type, type.label, type.icon);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildTypeItemCard(PropertyType? type, String label, String icon) {
    final bool isSel = _selectedPropertyType == type && (type != null || _selectedPropertyType == null && label == 'All');
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedPropertyType = type;
        });
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: isSel ? AppColors.goldDark.withOpacity(0.12) : AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSel ? AppColors.goldLight : AppColors.border),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(icon, style: const TextStyle(fontSize: 16)),
            const SizedBox(width: 8),
            Text(
              label.toUpperCase(),
              style: TextStyle(
                fontFamily: 'JetBrains Mono',
                color: isSel ? AppColors.goldLight : Colors.white,
                fontSize: 8.5,
                fontWeight: isSel ? FontWeight.black : FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickFiltersSection() {
    final List<String> filters = ['All', 'Buy', 'Rent', 'New', 'Verified', 'Featured', 'Nearby', 'Luxury'];
    return Padding(
      padding: const EdgeInsets.only(top: 16, bottom: 8),
      child: SizedBox(
        height: 34,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 12),
          itemCount: filters.length,
          itemBuilder: (context, index) {
            final f = filters[index];
            final bool isAct = _activeQuickFilter == f;
            return GestureDetector(
              onTap: () {
                setState(() {
                  _activeQuickFilter = f;
                });
              },
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: isAct ? AppColors.goldLight : AppColors.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: isAct ? AppColors.goldLight : AppColors.border),
                ),
                child: Center(
                  child: Text(
                    f.toUpperCase(),
                    style: TextStyle(
                      fontFamily: 'JetBrains Mono',
                      color: isAct ? AppColors.background : AppColors.textSecondary,
                      fontSize: 8,
                      fontWeight: FontWeight.black,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildSearchResultsSection(List<Property> list) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                'FILTERED SEARCH RESULTS (${list.length})',
                style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 1.2),
              ),
              TextButton(
                onPressed: () {
                  setState(() {
                    _searchQuery = '';
                    _selectedPropertyType = null;
                    _activeQuickFilter = 'All';
                  });
                },
                child: const Text('RESET ALL', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.error, fontSize: 9, fontWeight: FontWeight.bold)),
              )
            ],
          ),
          const SizedBox(height: 12),
          if (list.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.border)),
              child: const Column(
                children: [
                  Icon(Icons.house_siding_outlined, color: AppColors.textMuted, size: 36),
                  SizedBox(height: 12),
                  Text('NO PROPERTIES FOUND', style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
                  SizedBox(height: 6),
                  Text('Try relaxing your filter parameters to discover premium locations.', style: TextStyle(color: AppColors.textMuted, fontSize: 10), textAlign: TextAlign.center),
                ],
              ),
            )
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: list.length,
              itemBuilder: (context, index) {
                return _buildPropertyCard(list[index]);
              },
            ),
        ],
      ),
    );
  }

  Widget _buildFeaturedCarousel(List<Property> featured) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 16),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text('FEATURED PROPERTIES', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 9.5, fontWeight: FontWeight.black, letterSpacing: 1.2)),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 240,
          child: PageView.builder(
            physics: const BouncingScrollPhysics(),
            controller: PageController(viewportFraction: 0.9),
            itemCount: featured.length,
            itemBuilder: (context, index) {
              final prop = featured[index];
              return GestureDetector(
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => PropertyDetailScreen(property: prop)));
                },
                child: Container(
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      // Photo
                      ClipRRect(
                        borderRadius: BorderRadius.circular(19),
                        child: Image.network(prop.images[0], fit: BoxFit.cover),
                      ),
                      // Ambient Gradient
                      Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(19),
                          gradient: const LinearGradient(
                            colors: [Colors.transparent, Colors.black90],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                        ),
                      ),
                      // Featured Ribbon
                      Positioned(
                        top: 14,
                        left: 14,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            gradient: AppColors.goldGradient,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text('PREMIUM EXCLUSIVE', style: TextStyle(color: AppColors.background, fontSize: 8, fontWeight: FontWeight.black)),
                        ),
                      ),
                      // Details Box
                      Positioned(
                        bottom: 14,
                        left: 14,
                        right: 14,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${prop.currency} ${prop.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                              style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 16, fontWeight: FontWeight.black),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              prop.title.toUpperCase(),
                              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                const Icon(Icons.location_on_outlined, color: AppColors.textSecondary, size: 10),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    prop.address,
                                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 10),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
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
            },
          ),
        ),
      ],
    );
  }

  Widget _buildAIRecommendations(List<Property> recommended) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 24),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Icon(Icons.insights_outlined, color: AppColors.goldLight, size: 14),
              SizedBox(width: 6),
              Text('AI-ANALYZED RECOMMENDATIONS', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 9.5, fontWeight: FontWeight.black, letterSpacing: 1.2)),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 180,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: recommended.length,
            itemBuilder: (context, index) {
              final prop = recommended[index];
              return GestureDetector(
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => PropertyDetailScreen(property: prop)));
                },
                child: Container(
                  width: 260,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.goldDark.withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                        child: Image.network(prop.images[0], height: 90, width: double.infinity, fit: BoxFit.cover),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.between,
                              children: [
                                Expanded(
                                  child: Text(
                                    prop.title,
                                    style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                                  decoration: BoxDecoration(color: Colors.green.withOpacity(0.12), borderRadius: BorderRadius.circular(4)),
                                  child: Text(
                                    '${prop.investmentScore}% AI',
                                    style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.success, fontSize: 8, fontWeight: FontWeight.black),
                                  ),
                                )
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Yield: ${prop.rentalYieldEstimate}%  •  Score: ${prop.neighborhoodScore}/100',
                              style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${prop.currency} ${prop.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                              style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11.5, fontWeight: FontWeight.black),
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

  Widget _buildNearbySection(List<Property> nearby) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 24),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Icon(Icons.location_on_outlined, color: AppColors.goldLight, size: 14),
              SizedBox(width: 6),
              Text('NEARBY LOCATIONS', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 9.5, fontWeight: FontWeight.black, letterSpacing: 1.2)),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 160,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: nearby.length,
            itemBuilder: (context, index) {
              final prop = nearby[index];
              return GestureDetector(
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => PropertyDetailScreen(property: prop)));
                },
                child: Container(
                  width: 220,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                        child: Image.network(prop.images[0], height: 85, width: double.infinity, fit: BoxFit.cover),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              prop.title,
                              style: const TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              prop.address,
                              style: const TextStyle(color: AppColors.textSecondary, fontSize: 8.5),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${prop.currency} ${prop.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                              style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 10.5, fontWeight: FontWeight.bold),
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

  Widget _buildRecentlyAddedSection() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 12),
          const Text('RECENTLY ADDED TIMELINE', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 9.5, fontWeight: FontWeight.black, letterSpacing: 1.2)),
          const SizedBox(height: 12),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _recentlyAddedProperties.length,
            itemBuilder: (context, index) {
              return _buildPropertyCard(_recentlyAddedProperties[index]);
            },
          ),
          if (_isLoadingMore)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 24),
              child: Center(
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 1.5, color: AppColors.goldLight),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildPropertyCard(Property prop) {
    final bool isFav = _state.isFavorite(prop.id);
    final String formattedPrice = prop.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image top with badge overlays
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                child: Image.network(prop.images[0], height: 160, width: double.infinity, fit: BoxFit.cover),
              ),
              // Gradient Overlay
              Positioned.fill(
                child: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.black54, Colors.transparent],
                      begin: Alignment.bottomCenter,
                      end: Alignment.center,
                    ),
                  ),
                ),
              ),
              // Verification badge
              if (prop.isVerified)
                Positioned(
                  top: 10,
                  left: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.75),
                      border: Border.all(color: AppColors.goldLight),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.verified_user, color: AppColors.goldLight, size: 10),
                        SizedBox(width: 4),
                        Text('VERIFIED TITLES', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ),
              // Favorite button
              Positioned(
                top: 10,
                right: 10,
                child: Container(
                  decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(10)),
                  child: IconButton(
                    icon: Icon(
                      isFav ? Icons.favorite : Icons.favorite_border,
                      color: isFav ? AppColors.error : Colors.white,
                      size: 18,
                    ),
                    onPressed: () {
                      _state.toggleFavorite(prop.id);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(isFav ? 'Removed from saved houses.' : 'Added to saved houses.'),
                          backgroundColor: isFav ? AppColors.goldDark : AppColors.success,
                          duration: const Duration(milliseconds: 800),
                        ),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),

          // Body text
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text(
                      '${prop.type.label.toUpperCase()}  •  ${prop.yearBuilt}',
                      style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8.5),
                    ),
                    Text(
                      prop.postedDate,
                      style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8.5),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  prop.title,
                  style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined, color: AppColors.textSecondary, size: 10),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        prop.address,
                        style: const TextStyle(color: AppColors.textSecondary, fontSize: 10.5),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                // Specs Row
                Row(
                  children: [
                    _buildSpecIndicator(Icons.square_foot, '${prop.areaSqm} sqm'),
                    const SizedBox(width: 12),
                    if (prop.bedrooms > 0) ...[
                      _buildSpecIndicator(Icons.king_bed_outlined, '${prop.bedrooms} Beds'),
                      const SizedBox(width: 12),
                    ],
                    if (prop.bathrooms > 0) ...[
                      _buildSpecIndicator(Icons.shower_outlined, '${prop.bathrooms} Baths'),
                      const SizedBox(width: 12),
                    ],
                    _buildSpecIndicator(Icons.local_parking_outlined, prop.parkingSpaces.toString()),
                  ],
                ),
                const SizedBox(height: 12),
                const Divider(color: AppColors.border, height: 1),
                const SizedBox(height: 10),
                // Footer pricing & quick action
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${prop.currency} $formattedPrice',
                          style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 14.5, fontWeight: FontWeight.black),
                        ),
                        if (prop.isNegotiable)
                          const Text('NEGOTIABLE', style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.green, fontSize: 8, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    Row(
                      children: [
                        // Comparison toggle
                        IconButton(
                          icon: Icon(
                            _state.isInComparison(prop.id) ? Icons.check_box : Icons.add_chart_outlined,
                            color: _state.isInComparison(prop.id) ? AppColors.success : AppColors.goldLight,
                            size: 18,
                          ),
                          onPressed: () {
                            final success = _state.toggleComparison(prop.id);
                            if (!success && !_state.isInComparison(prop.id)) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Comparison queue limit reached (Max 4 properties).'),
                                  backgroundColor: AppColors.error,
                                ),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(_state.isInComparison(prop.id) ? 'Added to comparison list.' : 'Removed from comparison.'),
                                  backgroundColor: AppColors.goldDark,
                                  duration: const Duration(milliseconds: 600),
                                ),
                              );
                            }
                          },
                        ),
                        const SizedBox(width: 4),
                        ElevatedButton(
                          onPressed: () {
                            Navigator.push(context, MaterialPageRoute(builder: (_) => PropertyDetailScreen(property: prop)));
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.card,
                            side: const BorderSide(color: AppColors.border),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            minimumSize: Size.zero,
                          ),
                          child: const Text('EXPLORE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.black)),
                        ),
                      ],
                    ),
                  ],
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildSpecIndicator(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, color: AppColors.textSecondary, size: 12),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
      ],
    );
  }
}
