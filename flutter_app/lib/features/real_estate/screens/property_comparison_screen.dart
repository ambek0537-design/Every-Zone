import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/property.dart';
import 'property_detail_screen.dart';

class PropertyComparisonScreen extends StatefulWidget {
  const PropertyComparisonScreen({super.key});

  @override
  State<PropertyComparisonScreen> createState() => _PropertyComparisonScreenState();
}

class _PropertyComparisonScreenState extends State<PropertyComparisonScreen> {
  final RealEstateState _state = RealEstateState();

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
    // Get compared properties
    final comparedProps = _state.properties.where((p) => _state.comparisonIds.contains(p.id)).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'PROPERTY COMPARISON MATRIX',
          style: TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.black,
            letterSpacing: 1.5,
          ),
        ),
        actions: [
          if (comparedProps.isNotEmpty)
            TextButton(
              onPressed: () {
                _state.clearComparisons();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Cleared comparison queue.')),
                );
              },
              child: const Text('CLEAR ALL', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.error, fontSize: 10, fontWeight: FontWeight.bold)),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: comparedProps.isEmpty
            ? _buildEmptyState()
            : SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Overview header banner
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.compare_arrows, color: AppColors.goldLight, size: 20),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                'You are comparing ${comparedProps.length} property profiles side-by-side. Scroll horizontally to inspect specifications.',
                                style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, height: 1.35),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Scrollable specs matrix
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Left-most label Column (Locked column simulation)
                            _buildLabelsColumn(),
                            
                            // Prop columns
                            ...comparedProps.map((p) => _buildPropertyColumn(p)).toList(),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: AppColors.surface, shape: BoxShape.circle, border: Border.all(color: AppColors.border)),
              child: const Icon(Icons.add_chart, size: 48, color: AppColors.goldLight),
            ),
            const SizedBox(height: 24),
            const Text(
              'COMPARISON QUEUE IS VACANT',
              style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.5),
            ),
            const SizedBox(height: 10),
            const Text(
              'To analyze properties side-by-side, tap the comparison icon (📊) on any property listing within the home feed. You can compare up to 4 properties concurrently.',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium, foregroundColor: AppColors.background),
              child: const Text('DISCOVER PROPERTIES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabelsColumn() {
    const double rowHeight = 72;
    return Container(
      width: 100,
      margin: const EdgeInsets.only(top: 140), // Offset to align with header row heights
      decoration: const BoxDecoration(
        border: Border(right: BorderSide(color: AppColors.border, width: 1.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildRowLabel('PRICE', rowHeight),
          _buildRowLabel('CATEGORY', rowHeight),
          _buildRowLabel('TOTAL AREA', rowHeight),
          _buildRowLabel('BED/BATH', rowHeight),
          _buildRowLabel('PARKING', rowHeight),
          _buildRowLabel('FLOOR / AGE', rowHeight),
          _buildRowLabel('AI YIELD', rowHeight),
          _buildRowLabel('AMENITIES', 140),
        ],
      ),
    );
  }

  Widget _buildRowLabel(String label, double height) {
    return Container(
      height: height,
      alignment: Alignment.centerLeft,
      padding: const EdgeInsets.only(right: 8),
      child: Text(
        label,
        style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildPropertyColumn(Property prop) {
    const double columnWidth = 180;
    const double rowHeight = 72;
    final String formattedPrice = prop.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');

    return Container(
      width: columnWidth,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          // Header: Image, Title, Close Button
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                child: Image.network(prop.images[0], height: 80, width: double.infinity, fit: BoxFit.cover),
              ),
              Positioned(
                top: 4,
                right: 4,
                child: Container(
                  width: 22,
                  height: 22,
                  decoration: const BoxDecoration(color: Colors.black54, shape: BoxShape.circle),
                  child: IconButton(
                    padding: EdgeInsets.zero,
                    icon: const Icon(Icons.close, color: Colors.white, size: 12),
                    onPressed: () => _state.toggleComparison(prop.id),
                  ),
                ),
              ),
            ],
          ),
          
          // Prop Title
          Padding(
            padding: const EdgeInsets.all(8),
            child: Text(
              prop.title,
              style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
            ),
          ),
          
          const Divider(color: AppColors.border, height: 1),

          // Price Spec
          _buildValueRow(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('ETB $formattedPrice', style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11.5, fontWeight: FontWeight.bold)),
                if (prop.isNegotiable)
                  const Text('Negotiable', style: TextStyle(color: Colors.green, fontSize: 8, fontFamily: 'JetBrains Mono')),
              ],
            ),
            height: rowHeight,
          ),

          // Category
          _buildValueRow(
            child: Text(prop.type.label.toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
            height: rowHeight,
          ),

          // Area
          _buildValueRow(
            child: Text('${prop.areaSqm} sqm', style: const TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 11)),
            height: rowHeight,
          ),

          // Bed / Bath
          _buildValueRow(
            child: Text(
              '${prop.bedrooms} Bed / ${prop.bathrooms} Bath',
              style: const TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold),
            ),
            height: rowHeight,
          ),

          // Parking
          _buildValueRow(
            child: Text('${prop.parkingSpaces} vehicles', style: const TextStyle(color: Colors.white, fontSize: 10.5)),
            height: rowHeight,
          ),

          // Floor / Age
          _buildValueRow(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(prop.floorNumber == 0 ? 'Ground level' : 'Level ${prop.floorNumber}', style: const TextStyle(color: Colors.white, fontSize: 10)),
                Text('Built: ${prop.yearBuilt}', style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8.5)),
              ],
            ),
            height: rowHeight,
          ),

          // AI Yield
          _buildValueRow(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(color: AppColors.goldDark.withOpacity(0.12), borderRadius: BorderRadius.circular(6)),
              child: Text(
                '${prop.rentalYieldEstimate}% Yield (${prop.investmentScore}/100)',
                style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8.5, fontWeight: FontWeight.bold),
              ),
            ),
            height: rowHeight,
          ),

          // Amenities List Block
          _buildValueRow(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Wrap(
                  spacing: 4,
                  runSpacing: 4,
                  alignment: WrapAlignment.center,
                  children: prop.amenities.take(4).map((a) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(4), border: Border.all(color: AppColors.border)),
                      child: Text(a, style: const TextStyle(color: AppColors.textSecondary, fontSize: 7, fontWeight: FontWeight.bold)),
                    );
                  }).toList(),
                ),
              ),
            ),
            height: 140,
          ),

          // Explore Button
          Padding(
            padding: const EdgeInsets.all(12),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => PropertyDetailScreen(property: prop)));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.goldLight,
                  foregroundColor: AppColors.background,
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text('EXPLORE', style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.black)),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildValueRow({required Widget child, required double height}) {
    return Container(
      height: height,
      width: double.infinity,
      alignment: Alignment.center,
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.border, width: 0.5)),
      ),
      child: child,
    );
  }
}
