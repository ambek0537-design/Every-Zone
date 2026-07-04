import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../shop/models/shop_models.dart';
import '../../shop/data/mock_shop_data.dart';
import '../../shop/screens/product_detail_screen.dart';
import '../../shop/screens/vendor_store_screen.dart';
import '../../real_estate/models/property.dart';
import '../../real_estate/screens/property_detail_screen.dart';
import '../../real_estate/screens/agent_profile_screen.dart';
import '../../overseas_employment/models/job.dart';
import '../../overseas_employment/screens/job_detail_screen.dart';
import '../../overseas_employment/screens/agency_profile_screen.dart';

enum SearchResultType {
  product,
  service,
  store,
  property,
  agent,
  job,
  recruitmentAgency,
  vehicle,
  post,
  video,
  user
}

extension SearchResultTypeExtension on SearchResultType {
  String get label {
    switch (this) {
      case SearchResultType.product: return 'Product';
      case SearchResultType.service: return 'Service';
      case SearchResultType.store: return 'Vendor';
      case SearchResultType.property: return 'Property';
      case SearchResultType.agent: return 'Agent';
      case SearchResultType.job: return 'Job';
      case SearchResultType.recruitmentAgency: return 'Agency';
      case SearchResultType.vehicle: return 'Vehicle';
      case SearchResultType.post: return 'Post';
      case SearchResultType.video: return 'Video';
      case SearchResultType.user: return 'User';
    }
  }

  IconData get icon {
    switch (this) {
      case SearchResultType.product: return Icons.shopping_bag_outlined;
      case SearchResultType.service: return Icons.handyman_outlined;
      case SearchResultType.store: return Icons.storefront_outlined;
      case SearchResultType.property: return Icons.home_outlined;
      case SearchResultType.agent: return Icons.badge_outlined;
      case SearchResultType.job: return Icons.business_center_outlined;
      case SearchResultType.recruitmentAgency: return Icons.corporate_fare_outlined;
      case SearchResultType.vehicle: return Icons.directions_car_outlined;
      case SearchResultType.post: return Icons.article_outlined;
      case SearchResultType.video: return Icons.play_circle_outline;
      case SearchResultType.user: return Icons.person_outline;
    }
  }
}

class SearchResultItem {
  final String id;
  final String title;
  final String subtitle;
  final String description;
  final String imageUrl;
  final SearchResultType type;
  final double rating;
  final double price;
  final String priceFormatted;
  final String extraInfo;
  final bool isVerified;
  final bool isAiRecommended;
  final dynamic rawObject;

  SearchResultItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.imageUrl,
    required this.type,
    required this.rating,
    required this.price,
    required this.priceFormatted,
    required this.extraInfo,
    required this.isVerified,
    required this.isAiRecommended,
    required this.rawObject,
  });
}

class UniversalSearchScreen extends StatefulWidget {
  const UniversalSearchScreen({super.key});

  @override
  State<UniversalSearchScreen> createState() => _UniversalSearchScreenState();
}

class _UniversalSearchScreenState extends State<UniversalSearchScreen> with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();
  
  // Tab index for results: 0: All, 1: Products, 2: Services, 3: Stores, 4: Properties, 5: Jobs, 6: Videos, 7: Posts, 8: People
  int _selectedTab = 0;
  
  // Search parameters & states
  String _query = '';
  Timer? _debounceTimer;
  bool _isSearching = false;
  bool _isLoadingResults = false;
  
  // Results & Simulation lists
  List<SearchResultItem> _allItems = [];
  List<SearchResultItem> _filteredResults = [];
  List<SearchResultItem> _paginatedResults = [];
  bool _isLoadingMore = false;
  int _currentPageLimit = 6;
  
  // SharedPreferences simulation for Recent & Suggested Searches
  final List<String> _recentSearches = [
    'royal woven wedding dress',
    'Kazanchis sky suite',
    'Saudi IT engineering job',
    'Sabahar authentic scarves',
  ];
  
  final List<String> _suggestedSearches = [
    'Wollo Black Opals Direct',
    'Luxury Villas Bole',
    'Ministry Level Gulf Contracts',
    'Sidamo Coffee Reserve Microlot',
    'Escrow Verified Gold Jewelry'
  ];

  // Stateful Track for clicked items (AI Discovery - Recently Viewed)
  static final List<SearchResultItem> _recentlyViewedItems = [];
  static SearchResultItem? _lastViewedItem;

  // Filter values
  double _filterMaxPrice = 50000000;
  double _filterMaxDistance = 50.0;
  double _filterMinRating = 0.0;
  bool _filterVerifiedOnly = false;
  bool _filterOpenNow = false;
  bool _filterNewest = false;
  bool _filterPopular = false;
  bool _filterAvailabilityOnly = false;

  @override
  void initState() {
    super.initState();
    _buildSearchDataset();
    
    // Autofocus search on launch
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _searchFocusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  // Pre-aggregate data from all modules into a single index
  void _buildSearchDataset() {
    final List<SearchResultItem> items = [];

    // 1. Shop Products & Vehicles & Services
    for (var prod in MockShopData.products) {
      SearchResultType type = SearchResultType.product;
      if (prod.categoryId == 'services') {
        type = SearchResultType.service;
      } else if (prod.categoryId == 'vehicles') {
        type = SearchResultType.vehicle;
      }

      items.add(SearchResultItem(
        id: prod.id,
        title: prod.title,
        subtitle: prod.titleAm,
        description: prod.description,
        imageUrl: prod.imageUrls.isNotEmpty ? prod.imageUrls[0] : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=300',
        type: type,
        rating: prod.rating,
        price: prod.price,
        priceFormatted: '${prod.price.toStringAsFixed(0)} ETB',
        extraInfo: prod.stockStatus,
        isVerified: true,
        isAiRecommended: prod.isAiRecommended,
        rawObject: prod,
      ));
    }

    // 2. Vendor Stores
    for (var vendor in MockShopData.vendors) {
      items.add(SearchResultItem(
        id: vendor.id,
        title: vendor.name,
        subtitle: 'Premium Certified Vendor',
        description: vendor.businessStory,
        imageUrl: vendor.logoUrl,
        type: SearchResultType.store,
        rating: vendor.rating,
        price: 0,
        priceFormatted: 'Free Escrow Protection',
        extraInfo: '${vendor.followers} Followers • ${vendor.responseTime} response',
        isVerified: vendor.isVerified,
        isAiRecommended: vendor.isPremium,
        rawObject: vendor,
      ));
    }

    // 3. Properties (Houses)
    final realEstateState = RealEstateState();
    for (var prop in realEstateState.properties) {
      items.add(SearchResultItem(
        id: prop.id,
        title: prop.title,
        subtitle: prop.address,
        description: prop.description,
        imageUrl: prop.images.isNotEmpty ? prop.images[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=300',
        type: SearchResultType.property,
        rating: prop.neighborhoodScore / 20.0, // map 100 to 5-star
        price: prop.price,
        priceFormatted: '${prop.price.toStringAsFixed(0)} ${prop.currency}',
        extraInfo: '${prop.areaSqm} sqm • ${prop.bedrooms} Bed • ${prop.bathrooms} Bath',
        isVerified: prop.isVerified,
        isAiRecommended: prop.isAiRecommended,
        rawObject: prop,
      ));
    }

    // 4. Real Estate Agents
    for (var agent in realEstateState.agents) {
      items.add(SearchResultItem(
        id: agent.id,
        title: agent.name,
        subtitle: 'Certified Broker - License ${agent.licenseNumber}',
        description: agent.about,
        imageUrl: agent.photoUrl,
        type: SearchResultType.agent,
        rating: agent.rating,
        price: 0,
        priceFormatted: 'Brokerage Hub',
        extraInfo: '${agent.yearsExperience} yrs exp • Trust Score: ${agent.trustScore}%',
        isVerified: agent.isVerified,
        isAiRecommended: agent.trustScore >= 96,
        rawObject: agent,
      ));
    }

    // 5. Jobs (Overseas)
    final overseasState = OverseasState();
    for (var job in overseasState.jobs) {
      items.add(SearchResultItem(
        id: job.id,
        title: job.title,
        subtitle: '${job.company} • ${job.countryFlag} ${job.country}',
        description: job.requirements.join(' • ') + '\n' + job.responsibilities.join(' • '),
        imageUrl: job.companyLogo,
        type: SearchResultType.job,
        rating: job.agency.rating,
        price: double.tryParse(job.salary.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0,
        priceFormatted: '${job.salary} ${job.currency}',
        extraInfo: 'Contract: ${job.contractLength} • Hours: ${job.workingHours}',
        isVerified: job.agency.isVerified,
        isAiRecommended: job.isAiRecommended,
        rawObject: job,
      ));
    }

    // 6. Recruitment Agencies
    for (var agency in overseasState.agencies) {
      items.add(SearchResultItem(
        id: agency.id,
        title: agency.name,
        subtitle: 'Licensed Ministry Agency ${agency.licenseNumber}',
        description: agency.about,
        imageUrl: agency.logoUrl,
        type: SearchResultType.recruitmentAgency,
        rating: agency.rating,
        price: 0,
        priceFormatted: 'Placements: ${agency.completedPlacements}',
        extraInfo: '${agency.followers} Followers • ${agency.location}',
        isVerified: agency.isVerified,
        isAiRecommended: agency.rating >= 4.8,
        rawObject: agency,
      ));
    }

    // 7. Posts (Extracted from Real Estate Agents & Recruitment Agencies)
    int postIndex = 1;
    for (var agent in realEstateState.agents) {
      for (var post in agent.posts) {
        items.add(SearchResultItem(
          id: 'post_$postIndex',
          title: 'Every-zone Insight post by ${agent.name}',
          subtitle: 'Real Estate Updates',
          description: post,
          imageUrl: agent.photoUrl,
          type: SearchResultType.post,
          rating: agent.rating,
          price: 0,
          priceFormatted: 'Vetted Insight',
          extraInfo: 'Posted recently • ✦ Certified Author',
          isVerified: agent.isVerified,
          isAiRecommended: true,
          rawObject: agent,
        ));
        postIndex++;
      }
    }
    for (var agency in overseasState.agencies) {
      for (var post in agency.posts) {
        items.add(SearchResultItem(
          id: 'post_$postIndex',
          title: 'Employment Bulletin by ${agency.name}',
          subtitle: 'Overseas Placements',
          description: post,
          imageUrl: agency.logoUrl,
          type: SearchResultType.post,
          rating: agency.rating,
          price: 0,
          priceFormatted: 'Official Circular',
          extraInfo: 'Posted recently',
          isVerified: agency.isVerified,
          isAiRecommended: true,
          rawObject: agency,
        ));
        postIndex++;
      }
    }

    // 8. Videos (Extracted from Agent videos / Agency videos)
    int videoIndex = 1;
    for (var agent in realEstateState.agents) {
      for (var video in agent.videos) {
        items.add(SearchResultItem(
          id: 'video_$videoIndex',
          title: video,
          subtitle: 'Virtual property walk-through by ${agent.name}',
          description: 'A dynamic high-definition virtual showcase of premium locations and features.',
          imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300',
          type: SearchResultType.video,
          rating: agent.rating,
          price: 0,
          priceFormatted: 'Vetted Video',
          extraInfo: 'Virtual Tour 360° available',
          isVerified: agent.isVerified,
          isAiRecommended: true,
          rawObject: agent,
        ));
        videoIndex++;
      }
    }
    for (var agency in overseasState.agencies) {
      for (var video in agency.videos) {
        items.add(SearchResultItem(
          id: 'video_$videoIndex',
          title: video,
          subtitle: 'Placement guidance walkthrough by ${agency.name}',
          description: 'Step-by-step guidance, visa procedures, and accommodation standards orientation video.',
          imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=300',
          type: SearchResultType.video,
          rating: agency.rating,
          price: 0,
          priceFormatted: 'Agency Broadcast',
          extraInfo: 'HD Biometric Video',
          isVerified: agency.isVerified,
          isAiRecommended: true,
          rawObject: agency,
        ));
        videoIndex++;
      }
    }

    // 9. Users
    final List<String> mockUserNames = [
      'Dawit Yohannes', 'Aster M.', 'Dr. Alula', 'Selamawit G.',
      'Amare Ketema', 'Hana K.', 'Lidya Teklay', 'Yonas Kebede'
    ];
    for (int i = 0; i < mockUserNames.length; i++) {
      items.add(SearchResultItem(
        id: 'usr_$i',
        title: mockUserNames[i],
        subtitle: 'Premium Member',
        description: 'Vetted Every-zone premium community member with verified vault deposits.',
        imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
        type: SearchResultType.user,
        rating: 4.9,
        price: 0,
        priceFormatted: 'Premium Account',
        extraInfo: 'Chapa Escrow Verified',
        isVerified: true,
        isAiRecommended: i % 2 == 0,
        rawObject: null,
      ));
    }

    _allItems = items;
  }

  // Debounced search trigger
  void _onSearchQueryChanged(String query) {
    if (_debounceTimer?.isActive ?? false) _debounceTimer?.cancel();
    
    setState(() {
      _query = query;
      _isSearching = query.isNotEmpty;
    });

    if (query.isEmpty) {
      setState(() {
        _filteredResults = [];
        _paginatedResults = [];
      });
      return;
    }

    setState(() {
      _isLoadingResults = true;
    });

    _debounceTimer = Timer(const Duration(milliseconds: 400), () {
      _executeSearch();
    });
  }

  // Execute search queries with smart ranking & filters
  void _executeSearch() {
    final sq = _query.toLowerCase().trim();
    if (sq.isEmpty) {
      setState(() {
        _filteredResults = [];
        _paginatedResults = [];
        _isLoadingResults = false;
      });
      return;
    }

    // 1. Core keyword filter
    List<SearchResultItem> list = _allItems.where((item) {
      return item.title.toLowerCase().contains(sq) ||
          item.subtitle.toLowerCase().contains(sq) ||
          item.description.toLowerCase().contains(sq) ||
          item.type.label.toLowerCase().contains(sq);
    }).toList();

    // 2. Smart Filters apply
    list = list.where((item) {
      // Price filter (only applies to non-zero price items like products, properties, jobs)
      if (item.price > 0 && item.price > _filterMaxPrice) return false;
      
      // Rating filter
      if (item.rating < _filterMinRating) return false;
      
      // Verified only
      if (_filterVerifiedOnly && !item.isVerified) return false;

      // Newest (Simulate filter)
      if (_filterNewest && !item.title.toLowerCase().contains('royal') && !item.title.toLowerCase().contains('today')) {
        // filter down slightly
      }
      
      return true;
    }).toList();

    // 3. Smart Ranking
    list.sort((a, b) {
      int scoreA = 0;
      int scoreB = 0;

      // Exact title match gets highest score
      if (a.title.toLowerCase() == sq) scoreA += 500;
      if (b.title.toLowerCase() == sq) scoreB += 500;

      // Title contains keyword
      if (a.title.toLowerCase().contains(sq)) scoreA += 200;
      if (b.title.toLowerCase().contains(sq)) scoreB += 200;

      // Description contains keyword
      if (a.description.toLowerCase().contains(sq)) scoreA += 50;
      if (b.description.toLowerCase().contains(sq)) scoreB += 50;

      // Verified badge boosts rank
      if (a.isVerified) scoreA += 80;
      if (b.isVerified) scoreB += 80;

      // AI Recommended boosts rank
      if (a.isAiRecommended) scoreA += 40;
      if (b.isAiRecommended) scoreB += 40;

      // Rating boost
      scoreA += (a.rating * 15).round();
      scoreB += (b.rating * 15).round();

      return scoreB.compareTo(scoreA); // Descending relevance
    });

    // 4. Tab filtering
    _filteredResults = list;
    _applyTabFiltering();

    setState(() {
      _isLoadingResults = false;
    });
  }

  // Filters results to current tab view
  void _applyTabFiltering() {
    List<SearchResultItem> tabList = [];
    if (_selectedTab == 0) {
      tabList = _filteredResults;
    } else {
      final SearchResultType? targetType = _getTargetTypeForTab(_selectedTab);
      if (targetType != null) {
        tabList = _filteredResults.where((item) {
          if (targetType == SearchResultType.product) {
            // Include products & vehicles in Product Tab
            return item.type == SearchResultType.product || item.type == SearchResultType.vehicle;
          }
          return item.type == targetType;
        }).toList();
      } else if (_selectedTab == 8) {
        // People: includes real estate agents & premium users
        tabList = _filteredResults.where((item) => item.type == SearchResultType.agent || item.type == SearchResultType.user).toList();
      }
    }

    _currentPageLimit = 6;
    _paginatedResults = tabList.take(_currentPageLimit).toList();
  }

  SearchResultType? _getTargetTypeForTab(int tabIndex) {
    switch (tabIndex) {
      case 1: return SearchResultType.product;
      case 2: return SearchResultType.service;
      case 3: return SearchResultType.store;
      case 4: return SearchResultType.property;
      case 5: return SearchResultType.job;
      case 6: return SearchResultType.video;
      case 7: return SearchResultType.post;
      default: return null;
    }
  }

  // Simulated dynamic lazy loading / infinite scroll trigger
  void _loadMoreResults() {
    if (_isLoadingMore) return;
    
    // Get full list of matching items for current tab
    List<SearchResultItem> fullTabList = [];
    if (_selectedTab == 0) {
      fullTabList = _filteredResults;
    } else {
      final SearchResultType? targetType = _getTargetTypeForTab(_selectedTab);
      if (targetType != null) {
        fullTabList = _filteredResults.where((item) {
          if (targetType == SearchResultType.product) {
            return item.type == SearchResultType.product || item.type == SearchResultType.vehicle;
          }
          return item.type == targetType;
        }).toList();
      } else if (_selectedTab == 8) {
        fullTabList = _filteredResults.where((item) => item.type == SearchResultType.agent || item.type == SearchResultType.user).toList();
      }
    }

    if (_paginatedResults.length >= fullTabList.length) return; // End of list

    setState(() {
      _isLoadingMore = true;
    });

    Timer(const Duration(milliseconds: 1200), () {
      if (!mounted) return;
      setState(() {
        _currentPageLimit += 4;
        _paginatedResults = fullTabList.take(_currentPageLimit).toList();
        _isLoadingMore = false;
      });
    });
  }

  // Voice Search Overlay simulation with pulsating concentric rings
  void _showVoiceSearchDialog() {
    bool isListening = true;
    String statusText = 'Listening for Every-zone prompt...';
    String recognizedText = '';
    Timer? listeningTimer;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            if (listeningTimer == null) {
              listeningTimer = Timer(const Duration(seconds: 2.5), () {
                if (context.mounted) {
                  setDialogState(() {
                    isListening = false;
                    statusText = 'Escrow Audio Decrypted!';
                    recognizedText = 'royal hand-woven Habesha Kemis Bole villa';
                  });
                }
              });
            }

            return Dialog(
              backgroundColor: const Color(0xFF0C0C0E),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: const BorderSide(color: AppColors.border, width: 1.2),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          '✦ SECURE VOICE SEARCH',
                          style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 1.0),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.white24, size: 16),
                          onPressed: () {
                            listeningTimer?.cancel();
                            Navigator.pop(context);
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        // Radial pulse rings
                        if (isListening)
                          TweenAnimationBuilder<double>(
                            tween: Tween<double>(begin: 1.0, end: 1.8),
                            duration: const Duration(milliseconds: 1200),
                            builder: (context, value, child) {
                              return Container(
                                width: 80 * value,
                                height: 80 * value,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: AppColors.goldMedium.withOpacity((2.0 - value) * 0.15),
                                ),
                              );
                            },
                          ),
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: AppColors.goldGradient,
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.goldDark.withOpacity(0.3),
                                blurRadius: 16,
                              ),
                            ],
                          ),
                          child: const Icon(Icons.mic, color: Colors.black, size: 36),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    Text(
                      statusText,
                      style: const TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                    if (recognizedText.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Text(
                          '"$recognizedText"',
                          style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black, fontStyle: FontStyle.italic),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          _searchController.text = recognizedText;
                          _onSearchQueryChanged(recognizedText);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.goldLight,
                          foregroundColor: Colors.black,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('EXECUTE AI SEARCH', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                      )
                    ] else ...[
                      const SizedBox(height: 16),
                      const Text(
                        'Say "Bole Villa", "Habesha Dress", "Coffee Microlots", etc.',
                        style: TextStyle(color: AppColors.textMuted, fontSize: 9.5),
                        textAlign: TextAlign.center,
                      ),
                    ]
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // QR Scanner integration Dialog
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
              Icon(Icons.qr_code_scanner, color: AppColors.goldLight),
              SizedBox(width: 10),
              Text(
                'EVERY-ZONE SMART SCANNER',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black, letterSpacing: 1.0),
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
                  border: Border.all(color: AppColors.goldMedium, width: 2.0),
                  borderRadius: BorderRadius.circular(20),
                ),
                alignment: Alignment.center,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    const Icon(Icons.qr_code, size: 100, color: Colors.white30),
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
                            color: AppColors.success,
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Position the Chapa merchant or product QR code within the frame to securely view listings or trigger payments.',
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

  // Advanced Smart Filters drawer/sheet
  void _showSmartFiltersSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F0F12),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setFilterState) {
            return Container(
              padding: EdgeInsets.fromLTRB(24, 24, 24, MediaQuery.of(context).viewInsets.bottom + 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.tune, color: AppColors.goldLight, size: 18),
                          SizedBox(width: 8),
                          Text(
                            'SMART SEARCH FILTERS',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.5, color: Colors.white),
                          ),
                        ],
                      ),
                      TextButton(
                        onPressed: () {
                          setFilterState(() {
                            _filterMaxPrice = 50000000;
                            _filterMaxDistance = 50.0;
                            _filterMinRating = 0.0;
                            _filterVerifiedOnly = false;
                            _filterOpenNow = false;
                            _filterNewest = false;
                            _filterPopular = false;
                            _filterAvailabilityOnly = false;
                          });
                        },
                        child: const Text('RESET ALL', style: TextStyle(color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.black)),
                      )
                    ],
                  ),
                  const Divider(color: AppColors.border, height: 24),
                  
                  // Price range slider
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('MAX PRICE (ETB)', style: TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold)),
                      Text(
                        _filterMaxPrice >= 50000000 ? 'No Limit' : '${_filterMaxPrice.toStringAsFixed(0)} ETB',
                        style: const TextStyle(color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black),
                      ),
                    ],
                  ),
                  Slider(
                    value: _filterMaxPrice,
                    min: 100,
                    max: 50000000,
                    activeColor: AppColors.goldLight,
                    inactiveColor: Colors.white12,
                    onChanged: (val) {
                      setFilterState(() {
                        _filterMaxPrice = val;
                      });
                    },
                  ),

                  // Distance slider
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('MAX DISTANCE (KM)', style: TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold)),
                      Text(
                        '${_filterMaxDistance.toStringAsFixed(1)} km',
                        style: const TextStyle(color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black),
                      ),
                    ],
                  ),
                  Slider(
                    value: _filterMaxDistance,
                    min: 1.0,
                    max: 50.0,
                    activeColor: AppColors.goldLight,
                    inactiveColor: Colors.white12,
                    onChanged: (val) {
                      setFilterState(() {
                        _filterMaxDistance = val;
                      });
                    },
                  ),

                  // Minimum Rating
                  const Text('MINIMUM VENDOR RATING', style: TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: List.generate(5, (index) {
                      final starVal = index + 1.0;
                      final isSelected = _filterMinRating == starVal;
                      return GestureDetector(
                        onTap: () {
                          setFilterState(() {
                            _filterMinRating = starVal;
                          });
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.goldMedium.withOpacity(0.15) : AppColors.surface,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: isSelected ? AppColors.goldMedium : AppColors.border),
                          ),
                          child: Row(
                            children: [
                              Text('${index + 1}', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                              const SizedBox(width: 4),
                              const Icon(Icons.star, color: AppColors.goldLight, size: 12),
                            ],
                          ),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 24),

                  // Switches
                  Row(
                    children: [
                      Expanded(
                        child: SwitchListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('VERIFIED SHIELDS ONLY', style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.black)),
                          subtitle: const Text('Displays verified sellers and agents only', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5)),
                          value: _filterVerifiedOnly,
                          activeColor: AppColors.goldLight,
                          onChanged: (val) {
                            setFilterState(() {
                              _filterVerifiedOnly = val;
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: SwitchListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('OPEN NOW / ACTIVE', style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.black)),
                          subtitle: const Text('Filter for operating hours and immediate availability', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5)),
                          value: _filterOpenNow,
                          activeColor: AppColors.goldLight,
                          onChanged: (val) {
                            setFilterState(() {
                              _filterOpenNow = val;
                            });
                          },
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _executeSearch();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.goldLight,
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text('APPLY SMART FILTERS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.0)),
                    ),
                  ),
                  const SizedBox(height: 12),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // Handle item click, tracking recently viewed (AI Discovery)
  void _handleItemClick(SearchResultItem item) {
    setState(() {
      _lastViewedItem = item;
      if (!_recentlyViewedItems.any((x) => x.id == item.id)) {
        _recentlyViewedItems.insert(0, item);
        if (_recentlyViewedItems.length > 5) {
          _recentlyViewedItems.removeLast();
        }
      }
    });

    // Route to actual core detailed pages based on content types
    if (item.type == SearchResultType.product || item.type == SearchResultType.vehicle) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => ProductDetailScreen(product: item.rawObject as Product)),
      );
    } else if (item.type == SearchResultType.service) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => ProductDetailScreen(product: item.rawObject as Product)),
      );
    } else if (item.type == SearchResultType.store) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => VendorStoreScreen(vendor: item.rawObject as Vendor)),
      );
    } else if (item.type == SearchResultType.property) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => PropertyDetailScreen(property: item.rawObject as Property)),
      );
    } else if (item.type == SearchResultType.agent) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => AgentProfileScreen(agent: item.rawObject as RealEstateAgent)),
      );
    } else if (item.type == SearchResultType.job) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => JobDetailScreen(job: item.rawObject as Job)),
      );
    } else if (item.type == SearchResultType.recruitmentAgency) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => AgencyProfileScreen(agency: item.rawObject as Agency)),
      );
    } else {
      // General item tap fallback toast
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Viewing detail for: ${item.title} (${item.type.label})'),
          backgroundColor: AppColors.goldDark,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildSearchHeader(),
            _buildTabSelector(),
            Expanded(
              child: NotificationListener<ScrollNotification>(
                onNotification: (ScrollNotification scrollInfo) {
                  if (!_isLoadingMore &&
                      scrollInfo.metrics.pixels >= scrollInfo.metrics.maxScrollExtent - 200) {
                    _loadMoreResults();
                  }
                  return true;
                },
                child: _isSearching ? _buildSearchResultsView() : _buildAiDiscoveryView(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Luxury unified search bar header with QR, Mic, and Filters button
  Widget _buildSearchHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.border, width: 1.0)),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
          const SizedBox(width: 4),
          Expanded(
            child: Container(
              height: 48,
              decoration: BoxDecoration(
                color: const Color(0xFF1A1A20),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border, width: 1.2),
              ),
              child: Row(
                children: [
                  const SizedBox(width: 12),
                  const Icon(Icons.search, color: AppColors.goldLight, size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      focusNode: _searchFocusNode,
                      style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                      onChanged: _onSearchQueryChanged,
                      decoration: const InputDecoration(
                        hintText: 'Search royal wear, villas, recruitment...',
                        hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 12),
                        border: InputBorder.none,
                        isDense: true,
                      ),
                    ),
                  ),
                  if (_query.isNotEmpty)
                    IconButton(
                      icon: const Icon(Icons.clear, color: Colors.white54, size: 16),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () {
                        _searchController.clear();
                        _onSearchQueryChanged('');
                      },
                    ),
                  IconButton(
                    icon: const Icon(Icons.mic, color: AppColors.goldLight, size: 16),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    onPressed: _showVoiceSearchDialog,
                  ),
                  const SizedBox(width: 6),
                ],
              ),
            ),
          ),
          const SizedBox(width: 10),
          GestureDetector(
            onTap: _showSmartFiltersSheet,
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFF1A1A20),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.tune, color: AppColors.goldLight, size: 18),
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: _showQRScannerDialog,
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFF1A1A20),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.goldMedium.withOpacity(0.4)),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.qr_code_scanner, color: AppColors.goldLight, size: 18),
            ),
          ),
        ],
      ),
    );
  }

  // Sliding tab selector bar
  Widget _buildTabSelector() {
    final tabs = ['All', 'Products', 'Services', 'Stores', 'Properties', 'Jobs', 'Videos', 'Posts', 'People'];
    return Container(
      height: 48,
      decoration: const BoxDecoration(
        color: Color(0xFF09090B),
        border: Border(bottom: BorderSide(color: AppColors.border, width: 1.0)),
      ),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: tabs.length,
        itemBuilder: (context, index) {
          final isSelected = _selectedTab == index;
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedTab = index;
                _applyTabFiltering();
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 18),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: isSelected ? AppColors.goldLight : Colors.transparent,
                    width: 2.0,
                  ),
                ),
              ),
              child: Text(
                tabs[index].toUpperCase(),
                style: TextStyle(
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                  fontWeight: isSelected ? FontWeight.black : FontWeight.bold,
                  color: isSelected ? AppColors.goldLight : AppColors.textMuted,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  // SEARCH RESULTS VIEW
  Widget _buildSearchResultsView() {
    if (_isLoadingResults) {
      return _buildSkeletonLoader();
    }

    if (_paginatedResults.isEmpty) {
      return _buildEmptyStateView();
    }

    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        // Synced status node indicator
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.cloud_done, size: 13, color: AppColors.success),
            const SizedBox(width: 6),
            Text(
              'SEARCH SECURED BY OFF-LINE CACHE INDEX',
              style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 16),
        
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _paginatedResults.length,
          itemBuilder: (context, index) {
            final item = _paginatedResults[index];
            return _buildResultCard(item);
          },
        ),

        // Lazy loading footer
        if (_isLoadingMore)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 24),
            child: Center(
              child: Column(
                children: [
                  const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.0,
                      valueColor: AlwaysStoppedAnimation<Color>(AppColors.goldLight),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'PAGE SYNCING FROM DECRYPTED CACHE...',
                    style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: AppColors.textMuted, letterSpacing: 0.8),
                  ),
                ],
              ),
            ),
          )
        else if (_filteredResults.length > _paginatedResults.length)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Center(
              child: Text(
                'SCROLL DOWN FOR MORE RESULTS',
                style: TextStyle(fontSize: 8.5, color: AppColors.textMuted, fontWeight: FontWeight.bold),
              ),
            ),
          )
        else
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 24),
            child: Center(
              child: Text(
                'END OF SEARCH FEEDS (SYNCHRONIZED)',
                style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 8, color: AppColors.textMuted, fontWeight: FontWeight.bold),
              ),
            ),
          ),
      ],
    );
  }

  // Result Skeleton (Pulsing Gold)
  Widget _buildSkeletonLoader() {
    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: 4,
      itemBuilder: (context, index) {
        return Container(
          margin: const EdgeInsets.bottom(16),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              const GoldShimmerSkeleton(width: 80, height: 80, borderRadius: 12),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const GoldShimmerSkeleton(width: 50, height: 14, borderRadius: 4),
                        const Spacer(),
                        const GoldShimmerSkeleton(width: 30, height: 14, borderRadius: 4),
                      ],
                    ),
                    const SizedBox(height: 10),
                    const GoldShimmerSkeleton(width: double.infinity, height: 16, borderRadius: 4),
                    const SizedBox(height: 8),
                    const GoldShimmerSkeleton(width: 120, height: 12, borderRadius: 4),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // Search result item card renderer
  Widget _buildResultCard(SearchResultItem item) {
    return Container(
      margin: const EdgeInsets.bottom(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border, width: 1.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () => _handleItemClick(item),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Item Image with dynamic referrer policy and Cache fallback
                  Stack(
                    children: [
                      Container(
                        width: 85,
                        height: 85,
                        decoration: BoxDecoration(
                          color: AppColors.card,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.border, width: 1.0),
                          image: DecorationImage(
                            image: NetworkImage(item.imageUrl),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      Positioned(
                        top: 4,
                        left: 4,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.black70,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: Icon(item.type.icon, color: AppColors.goldLight, size: 10),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFF1A1A20),
                                border: Border.all(color: AppColors.border),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                item.type.label.toUpperCase(),
                                style: const TextStyle(fontSize: 7.5, fontWeight: FontWeight.bold, color: AppColors.goldLight, letterSpacing: 0.5),
                              ),
                            ),
                            if (item.isVerified) ...[
                              const SizedBox(width: 6),
                              const Icon(Icons.verified, color: AppColors.success, size: 12),
                            ],
                            if (item.isAiRecommended) ...[
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                                decoration: BoxDecoration(
                                  color: AppColors.goldLight.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: const Text('AI RECS', style: TextStyle(color: AppColors.goldLight, fontSize: 6.5, fontWeight: FontWeight.black)),
                              ),
                            ],
                            const Spacer(),
                            if (item.rating > 0) ...[
                              const Icon(Icons.star, color: AppColors.goldLight, size: 11),
                              const SizedBox(width: 2),
                              Text(
                                item.rating.toStringAsFixed(1),
                                style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.black),
                              ),
                            ]
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          item.title,
                          style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black, letterSpacing: -0.2),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          item.subtitle,
                          style: const TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          item.description,
                          style: const TextStyle(color: AppColors.textMuted, fontSize: 9.5, height: 1.3),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            if (item.price > 0 || item.priceFormatted.isNotEmpty)
                              Text(
                                item.priceFormatted,
                                style: const TextStyle(color: AppColors.goldLight, fontSize: 11.5, fontWeight: FontWeight.black, fontFamily: 'JetBrains Mono'),
                              ),
                            if (item.extraInfo.isNotEmpty)
                              Text(
                                item.extraInfo,
                                style: const TextStyle(color: AppColors.textMuted, fontSize: 8.5, fontWeight: FontWeight.bold),
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
        ),
      ),
    );
  }

  // EMPTY STATE UI
  Widget _buildEmptyStateView() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      child: Column(
        children: [
          const SizedBox(height: 20),
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: AppColors.surface,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.border, width: 1.5),
              boxShadow: [
                BoxShape.circle == BoxShape.circle
                    ? BoxShadow(color: AppColors.goldDark.withOpacity(0.04), blurRadius: 20)
                    : const BoxShadow(),
              ],
            ),
            alignment: Alignment.center,
            child: const Text('🔍', style: TextStyle(fontSize: 48)),
          ),
          const SizedBox(height: 24),
          const Text(
            'NO VETTED PORTAL MATCHES',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.black, color: Colors.white, letterSpacing: 0.5),
          ),
          const SizedBox(height: 8),
          const Text(
            'No certified assets or services match your current query and smart filter parameters. Try expanding your limits.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _searchController.clear();
                _onSearchQueryChanged('');
                // reset filters
                _filterMaxPrice = 50000000;
                _filterMaxDistance = 50.0;
                _filterMinRating = 0.0;
                _filterVerifiedOnly = false;
              });
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.goldLight,
              foregroundColor: Colors.black,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('RESET FILTERS & RETRY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 36),
          
          // Suggestions section
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              '✦ SUGGESTED SECURED QUERIES',
              style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: FontWeight.black, color: AppColors.goldLight, letterSpacing: 1.0),
            ),
          ),
          const SizedBox(height: 12),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 3,
            itemBuilder: (context, idx) {
              return GestureDetector(
                onTap: () {
                  _searchController.text = _suggestedSearches[idx];
                  _onSearchQueryChanged(_suggestedSearches[idx]);
                },
                child: Container(
                  margin: const EdgeInsets.bottom(8),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.bolt, color: AppColors.goldLight, size: 14),
                      const SizedBox(width: 10),
                      Text(_suggestedSearches[idx], style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.bold)),
                      const Spacer(),
                      const Icon(Icons.arrow_forward_ios, color: Colors.white24, size: 10),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // AI DISCOVERY VIEW (Rendered on empty input)
  Widget _buildAiDiscoveryView() {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        _buildRecentSearchesSection(),
        const SizedBox(height: 24),
        _buildTrendingPortalsSection(),
        const SizedBox(height: 28),
        _buildContinueShoppingSection(),
        const SizedBox(height: 28),
        _buildAiRecommendationsSection(),
        const SizedBox(height: 28),
        _buildTrendingVendorsSection(),
        const SizedBox(height: 28),
        _buildRecentlyViewedSection(),
        const SizedBox(height: 24),
      ],
    );
  }

  // Recent searches layout
  Widget _buildRecentSearchesSection() {
    if (_recentSearches.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            const Text(
              '✦ RECENT ESCROW SEARCHES',
              style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: FontWeight.black, color: AppColors.goldLight, letterSpacing: 0.5),
            ),
            GestureDetector(
              onTap: () {
                setState(() {
                  _recentSearches.clear();
                });
              },
              child: const Text('CLEAR ALL', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _recentSearches.map((query) {
            return GestureDetector(
              onTap: () {
                _searchController.text = query;
                _onSearchQueryChanged(query);
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.history, color: AppColors.textMuted, size: 12),
                    const SizedBox(width: 6),
                    Text(query, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.bold)),
                    const SizedBox(width: 6),
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _recentSearches.remove(query);
                        });
                      },
                      child: const Icon(Icons.close, color: Colors.white24, size: 10),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  // Trending portal searches tags
  Widget _buildTrendingPortalsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '✦ TRENDING PORTALS (REAL-TIME)',
          style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: FontWeight.black, color: AppColors.goldLight, letterSpacing: 0.5),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _suggestedSearches.map((query) {
            return GestureDetector(
              onTap: () {
                _searchController.text = query;
                _onSearchQueryChanged(query);
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.trending_up, color: AppColors.goldLight, size: 12),
                    const SizedBox(width: 6),
                    Text(query, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  // Continue Shopping Section
  Widget _buildContinueShoppingSection() {
    if (_lastViewedItem == null) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '✦ CONTINUE EXAMINING',
          style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: FontWeight.black, color: AppColors.goldLight, letterSpacing: 0.5),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppColors.goldDark.withOpacity(0.35)),
          ),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.network(_lastViewedItem!.imageUrl, width: 50, height: 50, fit: BoxFit.cover),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_lastViewedItem!.title, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black)),
                    const SizedBox(height: 2),
                    Text(_lastViewedItem!.priceFormatted, style: const TextStyle(color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () => _handleItemClick(_lastViewedItem!),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.goldMedium,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: const Text('RESUME', style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // AI Recommendations
  Widget _buildAiRecommendationsSection() {
    // Pull some featured, AI-recommended, or high-rated items
    final recItems = _allItems.where((item) => item.isAiRecommended).toList().take(4).toList();
    if (recItems.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            const Text(
              '✦ AI HIGH-SHIELD RECOMMENDATIONS',
              style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: FontWeight.black, color: AppColors.goldLight, letterSpacing: 0.5),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.goldMedium.withOpacity(0.1),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text('99.4% MATCH', style: TextStyle(color: AppColors.goldLight, fontSize: 7.5, fontWeight: FontWeight.black)),
            )
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 155,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: recItems.length,
            itemBuilder: (context, idx) {
              final item = recItems[idx];
              return GestureDetector(
                onTap: () => _handleItemClick(item),
                child: Container(
                  width: 140,
                  margin: const EdgeInsets.only(right: 12),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Image.network(item.imageUrl, width: double.infinity, height: 75, fit: BoxFit.cover),
                      ),
                      const SizedBox(height: 8),
                      Text(item.title, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.black), maxLines: 1, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 2),
                      Text(item.type.label.toUpperCase(), style: const TextStyle(color: AppColors.goldLight, fontSize: 7, fontWeight: FontWeight.black)),
                      const Spacer(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Flexible(
                            child: Text(
                              item.price > 0 ? item.priceFormatted : 'Verified',
                              style: const TextStyle(color: Colors.white70, fontSize: 9, fontWeight: FontWeight.bold, overflow: TextOverflow.ellipsis),
                            ),
                          ),
                          Row(
                            children: [
                              const Icon(Icons.star, color: AppColors.goldLight, size: 8),
                              const SizedBox(width: 1.5),
                              Text(item.rating.toStringAsFixed(1), style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
                            ],
                          )
                        ],
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

  // Trending vendors
  Widget _buildTrendingVendorsSection() {
    final vendors = MockShopData.vendors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '✦ TRENDING VETTED SELLER CORPORATES',
          style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: FontWeight.black, color: AppColors.goldLight, letterSpacing: 0.5),
        ),
        const SizedBox(height: 12),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: vendors.length,
          itemBuilder: (context, index) {
            final vendor = vendors[index];
            return GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => VendorStoreScreen(vendor: vendor)),
                );
              },
              child: Container(
                margin: const EdgeInsets.bottom(10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(vendor.logoUrl, width: 44, height: 44, fit: BoxFit.cover),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(vendor.name, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black)),
                              const SizedBox(width: 6),
                              if (vendor.isVerified)
                                const Icon(Icons.verified, color: AppColors.success, size: 12),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(vendor.address, style: const TextStyle(color: AppColors.textMuted, fontSize: 9.5), maxLines: 1, overflow: TextOverflow.ellipsis),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        const Icon(Icons.star, color: AppColors.goldLight, size: 12),
                        const SizedBox(width: 3),
                        Text(vendor.rating.toStringAsFixed(1), style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black)),
                      ],
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

  // Recently Viewed
  Widget _buildRecentlyViewedSection() {
    if (_recentlyViewedItems.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '✦ YOUR RECENT HISTORY',
          style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: FontWeight.black, color: AppColors.goldLight, letterSpacing: 0.5),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 130,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: _recentlyViewedItems.length,
            itemBuilder: (context, idx) {
              final item = _recentlyViewedItems[idx];
              return GestureDetector(
                onTap: () => _handleItemClick(item),
                child: Container(
                  width: 110,
                  margin: const EdgeInsets.only(right: 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(item.imageUrl, width: double.infinity, height: 75, fit: BoxFit.cover),
                      ),
                      const SizedBox(height: 6),
                      Text(item.title, style: const TextStyle(color: Colors.white, fontSize: 9.5, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 2),
                      Text(item.type.label.toUpperCase(), style: const TextStyle(color: AppColors.textMuted, fontSize: 7, fontWeight: FontWeight.bold)),
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
}

class GoldShimmerSkeleton extends StatefulWidget {
  final double width;
  final double height;
  final double borderRadius;

  const GoldShimmerSkeleton({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius = 12,
  });

  @override
  State<GoldShimmerSkeleton> createState() => _GoldShimmerSkeletonState();
}

class _GoldShimmerSkeletonState extends State<GoldShimmerSkeleton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
    _opacityAnimation = Tween<double>(begin: 0.15, end: 0.4).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _opacityAnimation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            color: const Color(0xFFC9A227).withOpacity(_opacityAnimation.value),
            borderRadius: BorderRadius.circular(widget.borderRadius),
            border: Border.all(
              color: const Color(0xFFC9A227).withOpacity(_opacityAnimation.value * 0.5),
              width: 1.0,
            ),
          ),
        );
      },
    );
  }
}
