import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class OrderTrackingScreen extends StatefulWidget {
  final String orderNumber;
  final String deliveryMethod;
  final String address;

  const OrderTrackingScreen({
    super.key,
    required this.orderNumber,
    required this.deliveryMethod,
    required this.address,
  });

  @override
  State<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends State<OrderTrackingScreen> with SingleTickerProviderStateMixin {
  late AnimationController _mapAnimController;
  double _courierProgress = 0.65; // Progress from 0.0 to 1.0 along the route path
  Timer? _courierTimer;

  // Courier Information
  final Map<String, String> _courierInfo = {
    'name': 'Bekele Tolosa',
    'rating': '⭐ 4.97 (8,240 deliveries)',
    'vehicle': '⚡ Zero-Emission Electric Scooter',
    'plate': 'AA-3-B4021',
    'phone': '+251911894212',
    'status': 'Arriving in 12 mins',
  };

  // Tracking Timeline Stages
  final List<Map<String, dynamic>> _timelineStages = [
    {
      'title': 'ORDER DECLARED',
      'subtitle': 'Escrow collateral secured',
      'time': '11:45 AM',
      'date': 'July 3, 2026',
      'location': 'Chapa Gateway Node',
      'status': 'completed',
    },
    {
      'title': 'PREPARED & VERIFIED',
      'subtitle': 'Quality inspection certified',
      'time': '12:05 PM',
      'date': 'July 3, 2026',
      'location': 'Sabahar Heritage Store',
      'status': 'completed',
    },
    {
      'title': 'SECURELY PACKED',
      'subtitle': 'Shielded with security tape',
      'time': '12:30 PM',
      'date': 'July 3, 2026',
      'location': 'Bole Distribution Depot',
      'status': 'completed',
    },
    {
      'title': 'TRANSIT UNDERWAY',
      'subtitle': 'Courier courier dispatch live',
      'time': '12:45 PM',
      'date': 'July 3, 2026',
      'location': 'Bole Ring Road, Addis Ababa',
      'status': 'active',
    },
    {
      'title': 'OUT FOR DELIVERY',
      'subtitle': 'Courier arriving near destination',
      'time': 'Pending',
      'date': 'July 3, 2026',
      'location': 'Kazanchis Node Sector 2',
      'status': 'pending',
    },
    {
      'title': 'COMPLETED & VERIFIED',
      'subtitle': 'Escrow disbursement triggered',
      'time': 'Pending',
      'date': 'July 3, 2026',
      'location': 'Your exact GPS coordinate',
      'status': 'pending',
    },
  ];

  @override
  void initState() {
    super.initState();
    _mapAnimController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 15),
    )..repeat();

    // Slowly increment courier progress to simulate real-time advancement
    _courierTimer = Timer.periodic(const Duration(milliseconds: 1000), (timer) {
      if (mounted) {
        setState(() {
          if (_courierProgress < 0.95) {
            _courierProgress += 0.005;
          } else {
            _courierProgress = 0.50; // loop back for dynamic visualization
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _mapAnimController.dispose();
    _courierTimer?.cancel();
    super.dispose();
  }

  void _showContactCourierDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
            side: const BorderSide(color: AppColors.border),
          ),
          title: Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  image: DecorationImage(
                    image: NetworkImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_courierInfo['name']!.toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black)),
                  Text(_courierInfo['rating']!, style: const TextStyle(color: AppColors.textSecondary, fontSize: 8.5)),
                ],
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Direct secure connection to courier. Contact to sync delivery instructions.',
                style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 10, height: 1.4),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(12)),
                child: Column(
                  children: [
                    _buildCourierDetailRow('Plate No:', _courierInfo['plate']!),
                    _buildCourierDetailRow('Vehicle:', _courierInfo['vehicle']!),
                    _buildCourierDetailRow('Current speed:', '34 km/h'),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('📞 Simulating secure VoIP call to ${_courierInfo['name']}...'),
                    backgroundColor: AppColors.goldDark,
                  ),
                );
              },
              child: const Text('CALL COURIER', style: TextStyle(color: AppColors.goldLight, fontWeight: FontWeight.bold, fontSize: 10)),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('💬 Message dispatched to ${_courierInfo['name']}.'),
                    backgroundColor: AppColors.success,
                  ),
                );
              },
              child: const Text('SEND SECURE TEXT', style: TextStyle(color: AppColors.success, fontWeight: FontWeight.bold, fontSize: 10)),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('CLOSE', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
            ),
          ],
        );
      },
    );
  }

  Widget _buildCourierDetailRow(String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 9)),
          Text(val, style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'DELIVERY DISPATCH',
          style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black, letterSpacing: 1.5),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            // Interactive custom painted live map simulation
            _buildLiveMapWidget(),

            // Courier details banner
            _buildCourierBanner(),

            // Timeline stages list
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'TRANSIT JOURNEY LOG',
                    style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.0),
                  ),
                  const SizedBox(height: 16),
                  _buildTimelineList(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLiveMapWidget() {
    return Container(
      height: 220,
      width: double.infinity,
      color: Colors.black,
      child: Stack(
        children: [
          // Custom Painted Vector Roads & Pulsing Courier
          Positioned.fill(
            child: CustomPaint(
              painter: LiveMapPainter(
                progress: _courierProgress,
                rotationOffset: _mapAnimController.value,
              ),
            ),
          ),

          // Map Hub Labels
          const Positioned(
            top: 24,
            left: 24,
            child: MapHubLabel(name: 'BOLE HUB (DEPOT)'),
          ),

          Positioned(
            bottom: 32,
            right: 48,
            child: MapHubLabel(name: 'KAZANCHIS NODE (YOU)', isTarget: true),
          ),

          // Overlay status bar
          Positioned(
            top: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: Colors.black85,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.goldMedium.withOpacity(0.3)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.radar, color: AppColors.success, size: 10),
                  SizedBox(width: 6),
                  Text(
                    'LIVE SATELLITE DISPATCH ACTIVE',
                    style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.black, letterSpacing: 0.5),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCourierBanner() {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
          )
        ],
      ),
      child: Row(
        children: [
          // Courier photo
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.goldMedium, width: 1.0),
              image: const DecorationImage(
                image: NetworkImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'COURIER DISPATCHED',
                  style: TextStyle(color: AppColors.goldLight, fontSize: 8, fontWeight: FontWeight.black, letterSpacing: 0.5),
                ),
                const SizedBox(height: 2),
                Text(
                  _courierInfo['name']!.toUpperCase(),
                  style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black),
                ),
                const SizedBox(height: 2),
                Text(
                  '${_courierInfo['plate']} • ${_courierInfo['vehicle']}',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 9.5),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: _showContactCourierDialog,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.goldDark,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              minimumSize: Size.zero,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('CONTACT', style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.black)),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineList() {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _timelineStages.length,
      itemBuilder: (context, index) {
        final stage = _timelineStages[index];
        final isCompleted = stage['status'] == 'completed';
        final isActive = stage['status'] == 'active';

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left Date & Time Column
            SizedBox(
              width: 70,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    stage['time']!,
                    style: TextStyle(
                      color: isCompleted || isActive ? Colors.white : AppColors.textMuted,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    stage['date']!,
                    style: const TextStyle(color: AppColors.textMuted, fontSize: 8),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16),

            // Middle Timeline Graphic
            Column(
              children: [
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: isCompleted
                        ? AppColors.success
                        : (isActive ? AppColors.goldLight : Colors.transparent),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isCompleted
                          ? AppColors.success
                          : (isActive ? AppColors.goldLight : AppColors.border),
                      width: 2.0,
                    ),
                  ),
                  alignment: Alignment.center,
                  child: isCompleted
                      ? const Icon(Icons.check, size: 7, color: Colors.black)
                      : null,
                ),
                if (index < _timelineStages.length - 1)
                  Container(
                    width: 1.5,
                    height: 54,
                    color: isCompleted ? AppColors.success : AppColors.border,
                  ),
              ],
            ),
            const SizedBox(width: 16),

            // Right Info Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    stage['title']!,
                    style: TextStyle(
                      color: isCompleted
                          ? Colors.white
                          : (isActive ? AppColors.goldLight : AppColors.textMuted),
                      fontSize: 10.5,
                      fontWeight: FontWeight.black,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    stage['subtitle']!,
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 9.5),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, size: 10, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        stage['location']!,
                        style: const TextStyle(color: AppColors.textMuted, fontSize: 8.5, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}

class MapHubLabel extends StatelessWidget {
  final String name;
  final bool isTarget;

  const MapHubLabel({
    super.key,
    required this.name,
    this.isTarget = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.black85,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: isTarget ? AppColors.success : AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isTarget ? Icons.radio_button_checked : Icons.warehouse,
            color: isTarget ? AppColors.success : AppColors.goldLight,
            size: 10,
          ),
          const SizedBox(width: 6),
          Text(
            name,
            style: TextStyle(
              color: Colors.white,
              fontSize: 7.5,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

// Beautiful Custom Map Road Layout Painter
class LiveMapPainter extends CustomPainter {
  final double progress;
  final double rotationOffset;

  LiveMapPainter({
    required this.progress,
    required this.rotationOffset,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paintRoad = Paint()
      ..color = AppColors.border.withOpacity(0.5)
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final paintRoadLive = Paint()
      ..color = AppColors.goldMedium.withOpacity(0.3)
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    // Route from Bole depot to Kazanchis Node: a curved serpentine road
    path.moveTo(size.width * 0.15, size.height * 0.15);
    path.cubicTo(
      size.width * 0.45,
      size.height * 0.25,
      size.width * 0.25,
      size.height * 0.75,
      size.width * 0.85,
      size.height * 0.85,
    );

    // Draw grid coordinate circles
    final paintGrid = Paint()
      ..color = Colors.white.withOpacity(0.04)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    canvas.drawCircle(Offset(size.width * 0.5, size.height * 0.5), size.width * 0.35, paintGrid);
    canvas.drawCircle(Offset(size.width * 0.5, size.height * 0.5), size.width * 0.22, paintGrid);

    // Draw main base road
    canvas.drawPath(path, paintRoad);

    // Draw path traveled
    // (A simple approximation of traveled path)
    final pathTraveled = Path();
    pathTraveled.moveTo(size.width * 0.15, size.height * 0.15);
    final controlPoint1 = Offset(size.width * 0.45, size.height * 0.25);
    final controlPoint2 = Offset(size.width * 0.25, size.height * 0.75);
    final endPoint = Offset(size.width * 0.85, size.height * 0.85);

    // Find current coordinate along the path
    // Let's approximate the cubic bezier curve coords
    final t = progress;
    final u = 1.0 - t;
    final x = u * u * u * (size.width * 0.15) +
        3 * u * u * t * controlPoint1.dx +
        3 * u * t * t * controlPoint2.dx +
        t * t * t * endPoint.dx;
    final y = u * u * u * (size.height * 0.15) +
        3 * u * u * t * controlPoint1.dy +
        3 * u * t * t * controlPoint2.dy +
        t * t * t * endPoint.dy;

    final courierPos = Offset(x, y);

    // Draw secondary grid crossroads
    canvas.drawLine(Offset(0, size.height * 0.5), Offset(size.width, size.height * 0.5), paintGrid);
    canvas.drawLine(Offset(size.width * 0.5, 0), Offset(size.width * 0.5, size.height), paintGrid);

    // Draw Depot Node
    final paintHub = Paint()
      ..color = AppColors.goldDark
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(size.width * 0.15, size.height * 0.15), 6, paintHub);

    // Draw Target Node
    final paintTarget = Paint()
      ..color = AppColors.success
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(size.width * 0.85, size.height * 0.85), 6, paintTarget);

    // Draw pulsing ring around target
    final paintTargetRing = Paint()
      ..color = AppColors.success.withOpacity(0.2)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(Offset(size.width * 0.85, size.height * 0.85), 12 + (progress * 6), paintTargetRing);

    // Draw Courier Vehicle marker
    final paintScooterRing = Paint()
      ..color = AppColors.goldLight.withOpacity(0.3)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(courierPos, 14, paintScooterRing);

    final paintScooter = Paint()
      ..color = AppColors.goldLight
      ..style = PaintingStyle.fill;
    canvas.drawCircle(courierPos, 5, paintScooter);
  }

  @override
  bool shouldRepaint(covariant LiveMapPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.rotationOffset != rotationOffset;
  }
}
