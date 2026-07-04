import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/property.dart';
import 'property_detail_screen.dart';

class MapSearchScreen extends StatefulWidget {
  const MapSearchScreen({super.key});

  @override
  State<MapSearchScreen> createState() => _MapSearchScreenState();
}

class _MapSearchScreenState extends State<MapSearchScreen> {
  final RealEstateState _state = RealEstateState();
  
  // Interactive coordinates mapping properties to relative 0.0 - 1.0 positions
  final Map<String, Offset> _pinLocations = {
    'p1': const Offset(0.35, 0.45),
    'p2': const Offset(0.65, 0.35),
    'p3': const Offset(0.48, 0.65),
    'p4': const Offset(0.20, 0.70),
    'p5': const Offset(0.75, 0.75),
  };

  String _selectedPropertyId = 'p1';
  PropertyType? _mapFilterType;
  double _maxPriceLimit = 150000000; // ETB 150 Million default
  String _mapSearchQuery = '';

  final ScrollController _cardsScrollController = ScrollController();

  List<Property> _getMapProperties() {
    return _state.properties.where((p) {
      final matchesType = _mapFilterType == null || p.type == _mapFilterType;
      final matchesPrice = p.price <= _maxPriceLimit;
      final matchesQuery = _mapSearchQuery.isEmpty || 
          p.title.toLowerCase().contains(_mapSearchQuery.toLowerCase()) ||
          p.address.toLowerCase().contains(_mapSearchQuery.toLowerCase());
      return matchesType && matchesPrice && matchesQuery;
    }).toList();
  }

  void _onPinSelected(String id) {
    setState(() {
      _selectedPropertyId = id;
    });

    // Auto scroll bottom list to matching item
    final props = _getMapProperties();
    final idx = props.indexWhere((p) => p.id == id);
    if (idx != -1) {
      _cardsScrollController.animateTo(
        idx * 270.0,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final propertiesOnMap = _getMapProperties();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // 1. Fullscreen Custom Map Canvas
          GestureDetector(
            onTapDown: (details) {
              // Locate nearest pin
              final size = MediaQuery.of(context).size;
              double nearestDist = double.infinity;
              String? nearestId;

              _pinLocations.forEach((id, offset) {
                final double px = offset.dx * size.width;
                final double py = offset.dy * size.height;
                final double dist = (details.localPosition.dx - px) * (details.localPosition.dx - px) +
                                    (details.localPosition.dy - py) * (details.localPosition.dy - py);
                if (dist < 1600 && dist < nearestDist) { // Within 40px radius click
                  nearestDist = dist;
                  nearestId = id;
                }
              });

              if (nearestId != null) {
                _onPinSelected(nearestId!);
              }
            },
            child: SizedBox(
              width: double.infinity,
              height: double.infinity,
              child: CustomPaint(
                painter: MapCanvasPainter(
                  pinLocations: _pinLocations,
                  selectedId: _selectedPropertyId,
                  filteredIds: propertiesOnMap.map((p) => p.id).toList(),
                ),
              ),
            ),
          ),

          // 2. Top Glassmorphic search overlay
          Positioned(
            top: MediaQuery.of(context).padding.top + 8,
            left: 12,
            right: 12,
            child: Column(
              children: [
                _buildMapSearchInput(),
                const SizedBox(height: 8),
                _buildMapFiltersBar(),
              ],
            ),
          ),

          // 3. Bottom scrolling property card overlay
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Mini indicator of active pin
                Padding(
                  padding: const EdgeInsets.only(left: 16, bottom: 8),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: Colors.black.withOpacity(0.85), borderRadius: BorderRadius.circular(20)),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.location_on, color: AppColors.goldLight, size: 12),
                        const SizedBox(width: 6),
                        Text(
                          'HIGHLIGHTING ZONE: ${_selectedPropertyId.toUpperCase()}',
                          style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8, fontWeight: FontWeight.black),
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Card scroll view
                if (propertiesOnMap.isEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
                      child: const Text('NO PROPERTIES MATCHING MAP FILTER BOUNDARIES.', style: TextStyle(color: AppColors.textMuted, fontSize: 9.5, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                    ),
                  )
                else
                  SizedBox(
                    height: 120,
                    child: ListView.builder(
                      controller: _cardsScrollController,
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      itemCount: propertiesOnMap.length,
                      itemBuilder: (context, index) {
                        final prop = propertiesOnMap[index];
                        final bool isSel = prop.id == _selectedPropertyId;
                        return _buildMapPropertyCard(prop, isSel);
                      },
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMapSearchInput() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      height: 48,
      decoration: BoxDecoration(
        color: AppColors.background.withOpacity(0.95),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
          Expanded(
            child: TextField(
              onChanged: (val) {
                setState(() {
                  _mapSearchQuery = val;
                });
              },
              style: const TextStyle(color: Colors.white, fontSize: 12),
              decoration: const InputDecoration(
                hintText: 'Search Bole, Kazanchis, Old Airport...',
                hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 10.5),
                border: InputBorder.none,
              ),
            ),
          ),
          const Icon(Icons.tune, color: AppColors.goldLight, size: 16),
          const SizedBox(width: 8),
        ],
      ),
    );
  }

  Widget _buildMapFiltersBar() {
    return SizedBox(
      height: 32,
      child: ListView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        children: [
          // Price limits modal trigger
          GestureDetector(
            onTap: () {
              // Custom price modal
              showModalBottomSheet(
                context: context,
                backgroundColor: AppColors.background,
                shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
                builder: (context) {
                  return StatefulBuilder(
                    builder: (context, setModalState) {
                      return Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('BUDGET LIMIT THRESHOLD', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.black)),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.between,
                              children: [
                                const Text('ETB 5 Million', style: TextStyle(color: Colors.white70, fontSize: 10)),
                                Text('ETB ${(_maxPriceLimit / 1000000).toStringAsFixed(0)}M Max', style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.bold)),
                              ],
                            ),
                            Slider(
                              value: _maxPriceLimit,
                              min: 5000000,
                              max: 300000000,
                              activeColor: AppColors.goldLight,
                              inactiveColor: AppColors.border,
                              onChanged: (val) {
                                setModalState(() {
                                  _maxPriceLimit = val;
                                });
                                setState(() {
                                  _maxPriceLimit = val;
                                });
                              },
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: () => Navigator.pop(context),
                                style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldLight, foregroundColor: AppColors.background),
                                child: const Text('APPLY MAP FILTERS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                              ),
                            )
                          ],
                        ),
                      );
                    },
                  );
                },
              );
            },
            child: Container(
              margin: const EdgeInsets.only(right: 6),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.background.withOpacity(0.92),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  const Icon(Icons.attach_money, color: AppColors.goldLight, size: 10),
                  Text(
                    'Budget < ${(_maxPriceLimit / 1000000).toStringAsFixed(0)}M',
                    style: const TextStyle(color: Colors.white, fontSize: 8.5, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),

          // Types
          ...PropertyType.values.map((type) {
            final bool isSel = _mapFilterType == type;
            return GestureDetector(
              onTap: () {
                setState(() {
                  _mapFilterType = isSel ? null : type;
                });
              },
              child: Container(
                margin: const EdgeInsets.only(right: 6),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isSel ? AppColors.goldLight : AppColors.background.withOpacity(0.92),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isSel ? AppColors.goldLight : AppColors.border),
                ),
                child: Row(
                  children: [
                    Text(type.icon, style: const TextStyle(fontSize: 10)),
                    const SizedBox(width: 4),
                    Text(
                      type.label.toUpperCase(),
                      style: TextStyle(
                        color: isSel ? AppColors.background : Colors.white,
                        fontSize: 8.5,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  Widget _buildMapPropertyCard(Property prop, bool isSel) {
    final String formattedPrice = prop.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedPropertyId = prop.id;
        });
      },
      child: Container(
        width: 260,
        margin: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSel ? AppColors.goldLight : AppColors.border, width: isSel ? 1.5 : 1.0),
          boxShadow: isSel ? [BoxShadow(color: AppColors.goldMedium.withOpacity(0.3), blurRadius: 8, spreadRadius: 1)] : null,
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(prop.images[0], width: 80, height: double.infinity, fit: BoxFit.cover),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    prop.title,
                    style: const TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    prop.address,
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 8.5),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${prop.currency} $formattedPrice',
                    style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.black),
                  ),
                  const SizedBox(height: 2),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('${prop.areaSqm} sqm  •  ${prop.bedrooms} Bed', style: const TextStyle(color: AppColors.textMuted, fontSize: 7.5)),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => PropertyDetailScreen(property: prop)));
                        },
                        child: const Row(
                          children: [
                            Text('EXPLORE', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 7.5, fontWeight: FontWeight.black)),
                            Icon(Icons.arrow_right, color: AppColors.goldLight, size: 10),
                          ],
                        ),
                      )
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
}

class MapCanvasPainter extends CustomPainter {
  final Map<String, Offset> pinLocations;
  final String selectedId;
  final List<String> filteredIds;

  MapCanvasPainter({
    required this.pinLocations,
    required this.selectedId,
    required this.filteredIds,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Solid background layout
    final bgPaint = Paint()..color = const Color(0xFF0F0F12);
    canvas.drawRect(Offset.zero & size, bgPaint);

    // 2. Draw mock river or lake for luxury aesthetic
    final waterPaint = Paint()..color = const Color(0xFF131E2A);
    final waterPath = Path()
      ..moveTo(0, size.height * 0.8)
      ..quadraticBezierTo(size.width * 0.4, size.height * 0.82, size.width * 0.7, size.height * 0.95)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    canvas.drawPath(waterPath, waterPaint);

    // 3. Draw grid streets (Bole Grid architecture)
    final roadPaint = Paint()
      ..color = const Color(0xFF22222A)
      ..strokeWidth = 2.0;
    
    // Horizontal streets
    for (double i = 50; i < size.height; i += 90) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), roadPaint);
    }
    // Vertical avenues
    for (double j = 40; j < size.width; j += 80) {
      canvas.drawLine(Offset(j, 0), Offset(j, size.height), roadPaint);
    }

    // Main Diagonal Highway
    final highwayPaint = Paint()
      ..color = const Color(0xFF2A2A35)
      ..strokeWidth = 14.0;
    canvas.drawLine(Offset(0, size.height * 0.3), Offset(size.width, size.height * 0.7), highwayPaint);

    final highwayDashedPaint = Paint()
      ..color = AppColors.goldLight.withOpacity(0.2)
      ..strokeWidth = 1.0;
    canvas.drawLine(Offset(0, size.height * 0.3), Offset(size.width, size.height * 0.7), highwayDashedPaint);

    // 4. Render location names labels
    const textStyle = TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white24, fontSize: 8, fontWeight: FontWeight.bold);
    _drawLabel(canvas, size, 'BOLE ZONE', const Offset(0.2, 0.2), textStyle);
    _drawLabel(canvas, size, 'OLD AIRPORT', const Offset(0.8, 0.5), textStyle);
    _drawLabel(canvas, size, 'KAZANCHIS EXECUTIVE', const Offset(0.5, 0.8), textStyle);

    // 5. Render property pins
    pinLocations.forEach((id, relativeOffset) {
      final bool isFilteredIn = filteredIds.contains(id);
      if (!isFilteredIn) return; // Hide if filtered out

      final double px = relativeOffset.dx * size.width;
      final double py = relativeOffset.dy * size.height;
      final bool isSelected = id == selectedId;

      final pinColor = isSelected ? AppColors.goldLight : Colors.white70;

      // Draw pulse glow for selected pin
      if (isSelected) {
        final glowPaint = Paint()
          ..color = AppColors.goldMedium.withOpacity(0.25)
          ..style = PaintingStyle.fill;
        canvas.drawCircle(Offset(px, py), 26, glowPaint);
        
        final glowPaint2 = Paint()
          ..color = AppColors.goldMedium.withOpacity(0.15)
          ..style = PaintingStyle.fill;
        canvas.drawCircle(Offset(px, py), 44, glowPaint2);
      }

      // Pin outer ring
      final outerPaint = Paint()
        ..color = isSelected ? AppColors.goldDark : Colors.black80
        ..style = PaintingStyle.fill;
      canvas.drawCircle(Offset(px, py), 12, outerPaint);

      // Inner color circle
      final innerPaint = Paint()
        ..color = pinColor
        ..style = PaintingStyle.fill;
      canvas.drawCircle(Offset(px, py), 6, innerPaint);

      // Draw custom house indicator top triangle for selected
      if (isSelected) {
        final trianglePath = Path()
          ..moveTo(px, py - 20)
          ..lineTo(px - 10, py - 10)
          ..lineTo(px + 10, py - 10)
          ..close();
        canvas.drawPath(trianglePath, innerPaint);
      }
    });
  }

  void _drawLabel(Canvas canvas, Size size, String text, Offset relOffset, TextStyle style) {
    final textPainter = TextPainter(
      text: TextSpan(text: text, style: style),
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(canvas, Offset(relOffset.dx * size.width - textPainter.width/2, relOffset.dy * size.height - textPainter.height/2));
  }

  @override
  bool shouldRepaint(covariant MapCanvasPainter oldDelegate) {
    return oldDelegate.selectedId != selectedId || oldDelegate.filteredIds.length != filteredIds.length;
  }
}
