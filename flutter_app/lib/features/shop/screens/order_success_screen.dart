import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import 'order_tracking_screen.dart';

class OrderSuccessScreen extends StatefulWidget {
  final String orderNumber;
  final double amountPaid;
  final String deliveryAddress;
  final String estimatedDelivery;

  const OrderSuccessScreen({
    super.key,
    required this.orderNumber,
    required this.amountPaid,
    required this.deliveryAddress,
    required this.estimatedDelivery,
  });

  @override
  State<OrderSuccessScreen> createState() => _OrderSuccessScreenState();
}

class _OrderSuccessScreenState extends State<OrderSuccessScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    _scaleAnimation = Tween<double>(begin: 0.2, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.elasticOut),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: const Interval(0.4, 1.0, curve: Curves.easeIn)),
    );

    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _showInvoiceDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
            side: const BorderSide(color: AppColors.border),
          ),
          title: const Row(
            children: [
              Icon(Icons.receipt_long, color: AppColors.goldLight),
              SizedBox(width: 10),
              Text(
                'JOINT-ESCROW INVOICE',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black, letterSpacing: 0.5),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'EVERY-ZONE DIGITAL RECEIPT',
                style: TextStyle(color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.black, letterSpacing: 1.0),
              ),
              const SizedBox(height: 12),
              _buildInvoiceRow('Receipt Ref:', widget.orderNumber),
              _buildInvoiceRow('Secure Hash:', 'TXH-CHAPA-${widget.orderNumber.split('-').last}X'),
              _buildInvoiceRow('Custodian:', 'Chapa & CBE Escrow-Shield'),
              _buildInvoiceRow('Amount Locked:', '${widget.amountPaid.toStringAsFixed(0)} ETB'),
              _buildInvoiceRow('Release Code:', 'AUTO-MATCH-2026'),
              const Divider(color: AppColors.border, height: 24),
              const Text(
                'Your funds are securely held in trust. The vendor cannot access them until you mark the order as received and verified.',
                style: TextStyle(color: AppColors.success, fontSize: 9.5, height: 1.4, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('📥 Invoice PDF downloaded: ${widget.orderNumber}.pdf'),
                    backgroundColor: AppColors.success,
                  ),
                );
              },
              child: const Text('DOWNLOAD PDF', style: TextStyle(color: AppColors.goldLight, fontWeight: FontWeight.bold, fontSize: 10)),
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

  Widget _buildInvoiceRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Rotating & Scaling checkmark animation
              ScaleTransition(
                scale: _scaleAnimation,
                child: Center(
                  child: Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      color: AppColors.success.withOpacity(0.12),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.success, width: 2.0),
                    ),
                    alignment: Alignment.center,
                    child: const Icon(Icons.check_circle_outline, color: AppColors.success, size: 54),
                  ),
                ),
              ),
              const SizedBox(height: 36),

              // Fade-in text content
              FadeTransition(
                opacity: _fadeAnimation,
                child: Column(
                  children: [
                    const Text(
                      'ESCROW SECURED SUCCESSFULLY',
                      style: TextStyle(
                        color: AppColors.success,
                        fontSize: 10.5,
                        fontWeight: FontWeight.black,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'ORDER COMPLIED',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.black,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Your joint-escrow node has initialized successfully. Funds will remain locked in trust until courier transit complies with your physical requirements.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.7),
                        fontSize: 12,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Order Info Card
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Column(
                        children: [
                          _buildInfoRow('ORDER REFERENCE', widget.orderNumber, isGold: true),
                          const Divider(color: AppColors.border, height: 20),
                          _buildInfoRow('SECURED VALUE', '${widget.amountPaid.toStringAsFixed(0)} ETB'),
                          const Divider(color: AppColors.border, height: 20),
                          _buildInfoRow('ESTIMATED ARRIVAL', widget.estimatedDelivery, isSuccess: true),
                          const Divider(color: AppColors.border, height: 20),
                          _buildInfoRow('DELIVERY NODE', widget.deliveryAddress.split(',').first),
                        ],
                      ),
                    ),
                    const SizedBox(height: 48),

                    // Action buttons
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => OrderTrackingScreen(
                                orderNumber: widget.orderNumber,
                                deliveryMethod: widget.estimatedDelivery.contains('Today') ? 'Express' : 'Standard',
                                address: widget.deliveryAddress,
                              ),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.goldMedium,
                          foregroundColor: Colors.black,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('TRACK LIVE SHIPMENT', style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 0.5)),
                            SizedBox(width: 8),
                            Icon(Icons.map, size: 14),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: _showInvoiceDialog,
                            icon: const Icon(Icons.receipt, size: 14, color: AppColors.goldLight),
                            label: const Text('DOWNLOAD INVOICE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: AppColors.border),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              Navigator.popUntil(context, (route) => route.isFirst);
                            },
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: AppColors.border),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: const Text('CONTINUE SHOPPING', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                          ),
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
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isGold = false, bool isSuccess = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.between,
      children: [
        Text(
          label,
          style: const TextStyle(color: AppColors.textSecondary, fontSize: 9, fontWeight: FontWeight.bold),
        ),
        Text(
          value,
          style: TextStyle(
            color: isGold
                ? AppColors.goldLight
                : (isSuccess ? AppColors.success : Colors.white),
            fontSize: 10.5,
            fontWeight: FontWeight.black,
          ),
        ),
      ],
    );
  }
}
