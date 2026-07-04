import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/job.dart';
import 'advanced_filter_screen.dart';
import 'job_detail_screen.dart';
import 'application_status_screen.dart';
import 'document_vault_screen.dart';
import 'notifications_screen.dart';
import 'agency_profile_screen.dart';

class JobsHomeScreen extends StatefulWidget {
  const JobsHomeScreen({super.key});

  @override
  State<JobsHomeScreen> createState() => _JobsHomeScreenState();
}

class _JobsHomeScreenState extends State<JobsHomeScreen> {
  final OverseasState _state = OverseasState();
  
  // Search state
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedCountryFilter = '';
  String _selectedCategoryFilter = '';
  
  // Recent searches simulation
  final List<String> _recentSearches = ['Dubai Hospitality', 'Saudi Driver', 'Nursing Riyadh'];
  
  // Voice search simulation state
  bool _isListening = false;

  // Pagination states for recently posted
  int _currentPage = 1;
  final int _itemsPerPage = 3;

  @override
  void initState() {
    super.initState();
    _state.addListener(_onStateChanged);
  }

  @override
  void dispose() {
    _state.removeListener(_onStateChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onStateChanged() {
    if (mounted) setState(() {});
  }

  // Voice Search dialog simulation
  void _showVoiceSearchDialog() {
    setState(() {
      _isListening = true;
    });
    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            // Simulated listening animation
            Future.delayed(const Duration(milliseconds: 1500), () {
              if (context.mounted && _isListening) {
                setDialogState(() {
                  _isListening = false;
                });
                _searchController.text = 'Executive Clinical Nurse Specialist';
                setState(() {
                  _searchQuery = 'Executive Clinical Nurse Specialist';
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Voice Match found: "Executive Clinical Nurse Specialist"'),
                    backgroundColor: AppColors.success,
                  ),
                );
              }
            });

            return AlertDialog(
              backgroundColor: AppColors.card,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: const BorderSide(color: AppColors.border),
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 16),
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      color: AppColors.goldDark.withOpacity(0.15),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.goldLight.withOpacity(0.4)),
                    ),
                    child: TweenAnimationBuilder<double>(
                      tween: Tween<double>(begin: 0.8, end: 1.2),
                      duration: const Duration(milliseconds: 800),
                      curve: Curves.easeInOut,
                      onEnd: () {},
                      builder: (context, value, child) {
                        return Transform.scale(
                          scale: _isListening ? value : 1.0,
                          child: const Icon(Icons.mic, color: AppColors.goldLight, size: 32),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    _isListening ? 'LISTENING CLEARLY...' : 'PROCESSING VOICE...',
                    style: const TextStyle(
                      fontFamily: 'JetBrains Mono',
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppColors.goldLight,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Speak now. Try saying "Nursing Jobs in Riyadh" or "Hotel driver UAE".',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  // Voice visualizer wave blocks
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      5,
                      (index) => Container(
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        width: 4,
                        height: _isListening ? (15.0 + (index % 3) * 12.0) : 6.0,
                        decoration: BoxDecoration(
                          color: AppColors.goldMedium.withOpacity(0.8),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                ],
              ),
              actionsAlignment: MainAxisAlignment.center,
              actions: [
                TextButton(
                  onPressed: () {
                    setState(() {
                      _isListening = false;
                    });
                    Navigator.pop(context);
                  },
                  child: const Text('CANCEL', style: TextStyle(color: AppColors.textSecondary)),
                )
              ],
            );
          },
        );
      },
    ).then((_) {
      setState(() {
        _isListening = false;
      });
    });
  }

  // Categories helper
  final List<Map<String, dynamic>> _categories = [
    {'name': 'Construction', 'icon': Icons.construction_outlined, 'color': Color(0xFF3B82F6)},
    {'name': 'Hotel', 'icon': Icons.hotel_outlined, 'color': Color(0xFF10B981)},
    {'name': 'Restaurant', 'icon': Icons.restaurant_outlined, 'color': Color(0xFFF59E0B)},
    {'name': 'Driver', 'icon': Icons.drive_eta_outlined, 'color': Color(0xFFEF4444)},
    {'name': 'Nurse', 'icon': Icons.medical_services_outlined, 'color': Color(0xFFEC4899)},
    {'name': 'Cleaner', 'icon': Icons.cleaning_services_outlined, 'color': Color(0xFF8B5CF6)},
    {'name': 'Factory', 'icon': Icons.precision_manufacturing_outlined, 'color': Color(0xFF6366F1)},
    {'name': 'Security', 'icon': Icons.security_outlined, 'color': Color(0xFF14B8A6)},
    {'name': 'Electrician', 'icon': Icons.electrical_services_outlined, 'color': Color(0xFFF97316)},
    {'name': 'Mechanic', 'icon': Icons.build_circle_outlined, 'color': Color(0xFF06B6D4)},
    {'name': 'Engineer', 'icon': Icons.architecture_outlined, 'color': Color(0xFF84CC16)},
  ];

  // Country filters
  final List<Map<String, String>> _countries = [
    {'name': 'Saudi Arabia', 'flag': '🇸🇦'},
    {'name': 'UAE', 'flag': '🇦🇪'},
    {'name': 'Qatar', 'flag': '🇶🇦'},
    {'name': 'Kuwait', 'flag': '🇰🇼'},
    {'name': 'Oman', 'flag': '🇴🇲'},
    {'name': 'Bahrain', 'flag': '🇧🇭'},
    {'name': 'Europe', 'flag': '🇪🇺'},
    {'name': 'Canada', 'flag': '🇨🇦'},
    {'name': 'Australia', 'flag': '🇦🇺'},
  ];

  List<Job> get _filteredJobs {
    return _state.jobs.where((job) {
      final matchesSearch = job.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          job.company.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          job.country.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          job.category.toLowerCase().contains(_searchQuery.toLowerCase());
          
      final matchesCountry = _selectedCountryFilter.isEmpty || job.country.toLowerCase() == _selectedCountryFilter.toLowerCase();
      final matchesCategory = _selectedCategoryFilter.isEmpty || job.category.toLowerCase() == _selectedCategoryFilter.toLowerCase();
      
      return matchesSearch && matchesCountry && matchesCategory;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredJobs;
    final aiRecommended = filtered.where((j) => j.isAiRecommended).toList();
    
    // Pagination slicing
    final int totalItems = filtered.length;
    final int maxPages = (totalItems / _itemsPerPage).ceil();
    final int startIndex = (_currentPage - 1) * _itemsPerPage;
    final int endIndex = startIndex + _itemsPerPage > totalItems ? totalItems : startIndex + _itemsPerPage;
    
    final paginatedJobs = totalItems > 0 ? filtered.sublist(startIndex, endIndex) : <Job>[];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.goldLight.withOpacity(0.5)),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text(
                '✦ PHASE 4',
                style: TextStyle(
                  color: AppColors.goldLight,
                  fontSize: 9,
                  fontWeight: FontWeight.black,
                  fontFamily: 'JetBrains Mono',
                  letterSpacing: 1.0,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              'OVERSEAS EMPLOYMENT',
              style: TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.black,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
        actions: [
          // Applications Status Badge Button
          Stack(
            alignment: Alignment.topRight,
            children: [
              IconButton(
                icon: const Icon(Icons.assignment_outlined, color: AppColors.textPrimary),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ApplicationStatusScreen()),
                  );
                },
              ),
              if (_state.applications.isNotEmpty)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: AppColors.goldLight,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '${_state.applications.length}',
                      style: const TextStyle(color: AppColors.background, fontSize: 8, fontWeight: FontWeight.bold),
                    ),
                  ),
                )
            ],
          ),
          // Document Vault Button
          IconButton(
            icon: const Icon(Icons.folder_shared_outlined, color: AppColors.textPrimary),
            tooltip: 'Document Vault',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const DocumentVaultScreen()),
              );
            },
          ),
          // Notification Bell Button
          Stack(
            alignment: Alignment.topRight,
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_none_outlined, color: AppColors.textPrimary),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                  );
                },
              ),
              if (_state.notifications.where((n) => !n.isRead).isNotEmpty)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: AppColors.error,
                      shape: BoxShape.circle,
                    ),
                  ),
                )
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Premium Search Bar Area
              _buildSearchBarSection(),
              const SizedBox(height: 20),

              // Recent Searches & Filter chips
              _buildRecentAndFiltersSection(),
              const SizedBox(height: 24),

              // Popular Countries
              _buildSectionTitle('Popular Countries', '📍'),
              const SizedBox(height: 12),
              _buildPopularCountriesGrid(),
              const SizedBox(height: 28),

              // Featured Agencies
              _buildSectionTitle('Featured Agencies', '🏛'),
              const SizedBox(height: 12),
              _buildFeaturedAgencies(),
              const SizedBox(height: 28),

              // Job Categories Grid
              _buildSectionTitle('Job Categories', '💼'),
              const SizedBox(height: 12),
              _buildJobCategoriesGrid(),
              const SizedBox(height: 28),

              // AI Recommended Jobs (Horizontal Scroll)
              if (aiRecommended.isNotEmpty) ...[
                _buildSectionTitle('AI Recommended Jobs', '✨'),
                const SizedBox(height: 12),
                _buildAiRecommendedScroll(aiRecommended),
                const SizedBox(height: 28),
              ],

              // Featured Jobs (Large Cards)
              _buildSectionTitle('Featured Employment Openings', '⭐'),
              const SizedBox(height: 12),
              _buildFeaturedJobsList(filtered),
              const SizedBox(height: 28),

              // Recently Posted (With Pagination/Infinite Scroll Controls)
              _buildSectionTitle('Recently Posted', '🕒'),
              const SizedBox(height: 12),
              _buildRecentlyPostedWithPagination(paginatedJobs, _currentPage, maxPages),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, String emoji) {
    return Row(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 16)),
        const SizedBox(width: 8),
        Text(
          title.toUpperCase(),
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.black,
            letterSpacing: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildSearchBarSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchController,
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  onChanged: (val) {
                    setState(() {
                      _searchQuery = val;
                      _currentPage = 1; // Reset to page 1
                    });
                  },
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.search, color: AppColors.goldMedium, size: 20),
                    hintText: 'Search Jobs, Countries, Companies...',
                    hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                    filled: true,
                    fillColor: AppColors.card,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              // Voice search mic button
              GestureDetector(
                onTap: _showVoiceSearchDialog,
                child: Container(
                  height: 48,
                  width: 48,
                  decoration: BoxDecoration(
                    color: AppColors.card,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: const Icon(Icons.mic, color: AppColors.goldLight, size: 20),
                ),
              ),
              const SizedBox(width: 10),
              // Advanced Filter button
              GestureDetector(
                onTap: () async {
                  final result = await Navigator.push<Map<String, String>>(
                    context,
                    MaterialPageRoute(builder: (_) => const AdvancedFilterScreen()),
                  );
                  if (result != null) {
                    setState(() {
                      _selectedCountryFilter = result['country'] ?? '';
                      _selectedCategoryFilter = result['category'] ?? '';
                      _searchQuery = result['query'] ?? '';
                    });
                  }
                },
                child: Container(
                  height: 48,
                  width: 48,
                  decoration: BoxDecoration(
                    color: AppColors.goldDark.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.goldMedium.withOpacity(0.3)),
                  ),
                  child: const Icon(Icons.tune, color: AppColors.goldLight, size: 20),
                ),
              )
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRecentAndFiltersSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_searchQuery.isEmpty && _selectedCountryFilter.isEmpty && _selectedCategoryFilter.isEmpty) ...[
          const Text(
            'RECENT SEARCHES',
            style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppColors.textMuted, letterSpacing: 1.0),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _recentSearches.map((term) {
              return GestureDetector(
                onTap: () {
                  setState(() {
                    _searchController.text = term;
                    _searchQuery = term;
                  });
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(30),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.history, color: AppColors.textMuted, size: 12),
                      const SizedBox(width: 6),
                      Text(term, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ] else ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text(
                'ACTIVE FILTERS',
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppColors.textMuted, letterSpacing: 1.0),
              ),
              TextButton(
                onPressed: () {
                  setState(() {
                    _searchController.clear();
                    _searchQuery = '';
                    _selectedCountryFilter = '';
                    _selectedCategoryFilter = '';
                  });
                },
                style: TextButton.styleFrom(minimumSize: Size.zero, padding: EdgeInsets.zero),
                child: const Text('CLEAR ALL', style: TextStyle(color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.bold)),
              )
            ],
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              if (_searchQuery.isNotEmpty)
                _buildActiveChip('Query: "$_searchQuery"', () {
                  setState(() {
                    _searchController.clear();
                    _searchQuery = '';
                  });
                }),
              if (_selectedCountryFilter.isNotEmpty)
                _buildActiveChip('Country: $_selectedCountryFilter', () {
                  setState(() {
                    _selectedCountryFilter = '';
                  });
                }),
              if (_selectedCategoryFilter.isNotEmpty)
                _buildActiveChip('Category: $_selectedCategoryFilter', () {
                  setState(() {
                    _selectedCategoryFilter = '';
                  });
                }),
            ],
          )
        ]
      ],
    );
  }

  Widget _buildActiveChip(String label, VoidCallback onRemove) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.goldDark.withOpacity(0.15),
        border: Border.all(color: AppColors.goldMedium.withOpacity(0.4)),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: const TextStyle(color: AppColors.goldLight, fontSize: 10.5, fontWeight: FontWeight.w500)),
          const SizedBox(width: 6),
          GestureDetector(
            onTap: onRemove,
            child: const Icon(Icons.close, color: AppColors.goldLight, size: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildPopularCountriesGrid() {
    return SizedBox(
      height: 90,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: _countries.length,
        itemBuilder: (context, index) {
          final country = _countries[index];
          final isSelected = _selectedCountryFilter.toLowerCase() == country['name']!.toLowerCase();
          return GestureDetector(
            onTap: () {
              setState(() {
                if (isSelected) {
                  _selectedCountryFilter = '';
                } else {
                  _selectedCountryFilter = country['name']!;
                }
                _currentPage = 1;
              });
            },
            child: Container(
              width: 105,
              margin: const EdgeInsets.only(right: 10),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.goldDark.withOpacity(0.2) : AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected ? AppColors.goldLight : AppColors.border,
                  width: isSelected ? 1.5 : 1.0,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(country['flag']!, style: const TextStyle(fontSize: 24)),
                  const SizedBox(height: 6),
                  Text(
                    country['name']!,
                    style: TextStyle(
                      color: isSelected ? AppColors.goldLight : Colors.white,
                      fontSize: 10,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFeaturedAgencies() {
    return SizedBox(
      height: 75,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: _state.agencies.length,
        itemBuilder: (context, index) {
          final agency = _state.agencies[index];
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => AgencyProfileScreen(agency: agency)),
              );
            },
            child: Container(
              width: 210,
              margin: const EdgeInsets.only(right: 12),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(
                      agency.logoUrl,
                      width: 44,
                      height: 44,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(color: AppColors.card, child: const Icon(Icons.business, color: AppColors.goldLight)),
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
                                agency.name,
                                style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const Icon(Icons.verified, color: AppColors.goldLight, size: 12),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${agency.completedPlacements}+ Deployed',
                          style: const TextStyle(color: AppColors.textSecondary, fontSize: 9.5),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            const Icon(Icons.star, color: AppColors.goldLight, size: 10),
                            const SizedBox(width: 2),
                            Text(
                              '${agency.rating} (${agency.followers} followers)',
                              style: const TextStyle(color: AppColors.textMuted, fontSize: 8.5, fontFamily: 'JetBrains Mono'),
                            ),
                          ],
                        )
                      ],
                    ),
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildJobCategoriesGrid() {
    return SizedBox(
      height: 85,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final cat = _categories[index];
          final isSelected = _selectedCategoryFilter.toLowerCase() == cat['name']!.toLowerCase();
          return GestureDetector(
            onTap: () {
              setState(() {
                if (isSelected) {
                  _selectedCategoryFilter = '';
                } else {
                  _selectedCategoryFilter = cat['name']!;
                }
                _currentPage = 1;
              });
            },
            child: Container(
              width: 85,
              margin: const EdgeInsets.only(right: 10),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.goldDark.withOpacity(0.15) : AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected ? AppColors.goldLight : AppColors.border,
                  width: isSelected ? 1.5 : 1.0,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: cat['color'].withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(cat['icon'], color: cat['color'], size: 18),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    cat['name'],
                    style: TextStyle(
                      color: isSelected ? AppColors.goldLight : AppColors.textPrimary,
                      fontSize: 9.5,
                      fontWeight: isSelected ? FontWeight.black : FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildAiRecommendedScroll(List<Job> aiRecommended) {
    return SizedBox(
      height: 145,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: aiRecommended.length,
        itemBuilder: (context, index) {
          final job = aiRecommended[index];
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => JobDetailScreen(job: job)),
              );
            },
            child: Container(
              width: 250,
              margin: const EdgeInsets.only(right: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.goldDark.withOpacity(0.35)),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.goldDark.withOpacity(0.05),
                    blurRadius: 10,
                  )
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.goldDark.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.auto_awesome, color: AppColors.goldLight, size: 10),
                            SizedBox(width: 4),
                            Text('AI MATCH', style: TextStyle(color: AppColors.goldLight, fontSize: 8, fontWeight: FontWeight.black, fontFamily: 'JetBrains Mono')),
                          ],
                        ),
                      ),
                      Text(job.countryFlag, style: const TextStyle(fontSize: 18)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    job.title,
                    style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    job.company,
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 10),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Spacer(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('SALARY BUDGET', style: TextStyle(color: AppColors.textMuted, fontSize: 7, fontWeight: FontWeight.bold)),
                          Text(
                            '${job.currency} ${job.salary}',
                            style: const TextStyle(color: AppColors.success, fontSize: 13, fontWeight: FontWeight.black, fontFamily: 'JetBrains Mono'),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white10,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text('DETAILS', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                      )
                    ],
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFeaturedJobsList(List<Job> jobs) {
    if (jobs.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 30),
        alignment: Alignment.center,
        child: const Text('No jobs match your active filters.', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
      );
    }
    
    return Column(
      children: jobs.take(2).map((job) {
        return GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => JobDetailScreen(job: job)),
            );
          },
          child: Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        job.companyLogo,
                        width: 48,
                        height: 48,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(color: AppColors.card, child: const Icon(Icons.business, color: AppColors.goldLight)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  job.title,
                                  style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.black),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Text(job.countryFlag, style: const TextStyle(fontSize: 16)),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text(
                            job.company,
                            style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.goldDark.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.verified, color: AppColors.goldLight, size: 10),
                                    const SizedBox(width: 4),
                                    Text(
                                      job.agency.name,
                                      style: const TextStyle(color: AppColors.goldLight, fontSize: 8.5, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Text('•', style: TextStyle(color: Colors.white30)),
                              const SizedBox(width: 8),
                              Text(
                                job.country,
                                style: const TextStyle(color: AppColors.textMuted, fontSize: 10),
                              )
                            ],
                          )
                        ],
                      ),
                    )
                  ],
                ),
                const SizedBox(height: 16),
                const Divider(color: AppColors.border, height: 1),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('GUARANTEED SALARY', style: TextStyle(color: AppColors.textMuted, fontSize: 7, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text(
                          '${job.currency} ${job.salary} / Month',
                          style: const TextStyle(color: AppColors.success, fontSize: 14, fontWeight: FontWeight.black, fontFamily: 'JetBrains Mono'),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text('DEADLINE', style: TextStyle(color: AppColors.textMuted, fontSize: 7, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text(
                          job.deadline,
                          style: const TextStyle(color: AppColors.error, fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'JetBrains Mono'),
                        ),
                      ],
                    )
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => JobDetailScreen(job: job)),
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.border),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: const Text('VIEW SCHEMAS & DETAILS', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      onPressed: () {
                        _state.startApplication(job);
                        // Open application flow directly
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => JobDetailScreen(job: job, initiateApplicationImmediately: true)),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.goldMedium,
                        foregroundColor: AppColors.background,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                      ),
                      child: const Text('APPLY NOW', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black)),
                    )
                  ],
                )
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildRecentlyPostedWithPagination(List<Job> jobs, int currentPage, int maxPages) {
    if (jobs.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 20),
        alignment: Alignment.center,
        child: const Text('No recent items.', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
      );
    }

    return Column(
      children: [
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: jobs.length,
          itemBuilder: (context, index) {
            final job = jobs[index];
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(
                      job.companyLogo,
                      width: 40,
                      height: 40,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(color: AppColors.card, child: const Icon(Icons.business, color: AppColors.goldLight)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                job.title,
                                style: const TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.bold),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 4),
                            Text(job.countryFlag, style: const TextStyle(fontSize: 14)),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Text(job.company, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
                            const SizedBox(width: 6),
                            const Text('•', style: TextStyle(color: Colors.white30, fontSize: 8)),
                            const SizedBox(width: 6),
                            Text(job.postedDate, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Text(
                              '${job.currency} ${job.salary}',
                              style: const TextStyle(color: AppColors.success, fontSize: 12, fontWeight: FontWeight.black, fontFamily: 'JetBrains Mono'),
                            ),
                            GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (_) => JobDetailScreen(job: job)),
                                );
                              },
                              child: const Text(
                                'QUICK APPLY →',
                                style: TextStyle(color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.black),
                              ),
                            )
                          ],
                        )
                      ],
                    ),
                  )
                ],
              ),
            );
          },
        ),
        
        // Pagination buttons (Satisfying lazy loading & offline pagination mock requirements cleanly)
        if (maxPages > 1) ...[
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Showing ${(_currentPage-1)*_itemsPerPage + 1} - ${(_currentPage-1)*_itemsPerPage + jobs.length} of ${_filteredJobs.length} jobs',
                style: const TextStyle(color: AppColors.textMuted, fontSize: 10, fontFamily: 'JetBrains Mono'),
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.chevron_left, color: Colors.white),
                    onPressed: _currentPage > 1
                        ? () {
                            setState(() {
                              _currentPage--;
                            });
                          }
                        : null,
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.goldDark.withOpacity(0.15),
                      border: Border.all(color: AppColors.goldMedium.withOpacity(0.3)),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'Page $_currentPage of $maxPages',
                      style: const TextStyle(color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.bold, fontFamily: 'JetBrains Mono'),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.chevron_right, color: Colors.white),
                    onPressed: _currentPage < maxPages
                        ? () {
                            setState(() {
                              _currentPage++;
                            });
                          }
                        : null,
                  ),
                ],
              )
            ],
          )
        ]
      ],
    );
  }
}
