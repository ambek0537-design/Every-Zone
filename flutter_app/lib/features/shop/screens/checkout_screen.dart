import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../data/cart_manager.dart';
import 'order_success_screen.dart';

extension NumberFormatting on double {
  String toLocaleString() {
    return toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]},',
    );
  }
}

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> with SingleTickerProviderStateMixin {
  final CartManager _cartManager = CartManager();
  int _currentStep = 0; // 0: Address, 1: Delivery, 2: Payment, 3: Review

  // Saved Addresses Data
  final List<Map<String, String>> _savedAddresses = [
    {
      'id': 'addr_1',
      'label': '🏢 Office (Kazanchis Node)',
      'details': 'Development Bank Tower, 4th Floor, Addis Ababa, Ethiopia',
      'coords': '9.0194° N, 38.7704° E',
    },
    {
      'id': 'addr_2',
      'label': '🏠 Home (Bole Atlas Estate)',
      'details': 'Villas No. 34B, Behind Axum Hotel, Addis Ababa, Ethiopia',
      'coords': '9.0105° N, 38.7836° E',
    },
  ];

  String _selectedAddressId = 'addr_1';
  bool _showAddNewAddress = false;
  final _newAddressLabelController = TextEditingController();
  final _newAddressDetailsController = TextEditingController();
  
  // GPS Sim state
  String _selectedGPSCoords = '9.0194° N, 38.7704° E';
  bool _isLocatingGPS = false;
  double _gpsRadarScale = 1.0;
  Timer? _gpsTimer;

  // Step 2 state
  String _selectedDelivery = 'Standard';

  // Step 3 state
  String _selectedPayment = 'Wallet'; // Wallet, Telebirr, Chapa, CBE, Card
  final List<Map<String, String>> _savedCards = [
    {'id': 'card_1', 'type': 'Commercial Bank of Ethiopia', 'label': 'CBE Birr •••• 4812', 'holder': 'AMBEK A.'},
    {'id': 'card_2', 'type': 'Visa Gold', 'label': 'Visa •••• 9012', 'holder': 'AMBEK A.'},
  ];
  String _selectedCardId = 'card_1';

  // Step 4 state
  bool _termsAccepted = true;
  final TextEditingController _orderNotesController = TextEditingController();

  // Payment experience simulation states
  bool _isProcessingPayment = false;
  String _processingStage = ''; // 'biometric', 'loading', 'otp', 'failed', 'refunded'
  final TextEditingController _otpController = TextEditingController();
  int _otpCountdown = 60;
  Timer? _otpTimer;
  bool _otpError = false;

  @override
  void initState() {
    super.initState();
    _selectedDelivery = _cartManager.deliveryMethod;
    if (_cartManager.deliveryAddressId != null) {
      _selectedAddressId = _cartManager.deliveryAddressId!;
    }
  }

  @override
  void dispose() {
    _newAddressLabelController.dispose();
    _newAddressDetailsController.dispose();
    _orderNotesController.dispose();
    _otpController.dispose();
    _gpsTimer?.cancel();
    _otpTimer?.cancel();
    super.dispose();
  }

  void _startGPSLocationSim() {
    setState(() {
      _isLocatingGPS = true;
    });

    _gpsTimer = Timer.periodic(const Duration(milliseconds: 150), (timer) {
      if (mounted) {
        setState(() {
          _gpsRadarScale = _gpsRadarScale == 1.0 ? 1.5 : 1.0;
        });
      }
    });

    Future.delayed(const Duration(seconds: 2), () {
      _gpsTimer?.cancel();
      if (mounted) {
        setState(() {
          _isLocatingGPS = false;
          _gpsRadarScale = 1.0;
          _selectedGPSCoords = '9.0227° N, 38.7460° E (Vetted Bole Hub Coords)';
          _newAddressDetailsController.text = 'Every-zone Bole Hub, Ring Road, Sector 5, Addis Ababa';
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🎯 Current location identified via military-grade GPS node.'),
            backgroundColor: AppColors.success,
          ),
        );
      }
    });
  }

  void _saveNewAddress() {
    if (_newAddressLabelController.text.isEmpty || _newAddressDetailsController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all address fields')),
      );
      return;
    }

    final newId = 'addr_${DateTime.now().millisecondsSinceEpoch}';
    setState(() {
      _savedAddresses.add({
        'id': newId,
        'label': '📍 ${_newAddressLabelController.text}',
        'details': _newAddressDetailsController.text,
        'coords': _selectedGPSCoords,
      });
      _selectedAddressId = newId;
      _showAddNewAddress = false;
      _newAddressLabelController.clear();
      _newAddressDetailsController.clear();
    });
  }

  void _nextStep() {
    if (_currentStep < 3) {
      setState(() {
        _currentStep++;
      });
      if (_currentStep == 1) {
        _cartManager.setDeliveryAddress(_selectedAddressId);
      } else if (_currentStep == 2) {
        _cartManager.setDeliveryMethod(_selectedDelivery);
      }
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
    }
  }

  // CORE PAYMENT EXPERIENCE SIMULATOR
  void _startPaymentProcess() {
    if (!_termsAccepted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You must accept Every-zone Terms and Joint-Escrow Shielding to complete purchase.')),
      );
      return;
    }

    setState(() {
      _isProcessingPayment = true;
      _processingStage = 'biometric';
    });
  }

  void _simulateBiometricAuthentication() {
    setState(() {
      _processingStage = 'loading';
    });

    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _processingStage = 'otp';
          _otpCountdown = 60;
        });
        _startOTPTimer();
      }
    });
  }

  void _startOTPTimer() {
    _otpTimer?.cancel();
    _otpTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          if (_otpCountdown > 0) {
            _otpCountdown--;
          } else {
            _otpTimer?.cancel();
          }
        });
      }
    });
  }

  void _verifyOTP() {
    if (_otpController.text == '1234') {
      _otpTimer?.cancel();
      _completeOrderSuccess();
    } else {
      setState(() {
        _otpError = true;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('⚠️ Invalid OTP code. Please use simulated code "1234" to pass.'), backgroundColor: AppColors.error),
      );
    }
  }

  void _retryFailedPayment() {
    setState(() {
      _otpController.clear();
      _otpError = false;
      _processingStage = 'loading';
    });
    Future.delayed(const Duration(seconds: 1.5), () {
      if (mounted) {
        setState(() {
          _processingStage = 'otp';
          _otpCountdown = 60;
        });
        _startOTPTimer();
      }
    });
  }

  void _completeOrderSuccess() {
    setState(() {
      _isProcessingPayment = false;
    });

    final total = _cartManager.grandTotal;
    final orderNum = 'EZ-2026-${DateTime.now().millisecondsSinceEpoch % 100000}';
    
    // Clear active cart but keep items in memory if saved
    _cartManager.clearCart();

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (context) => OrderSuccessScreen(
          orderNumber: orderNum,
          amountPaid: total,
          deliveryAddress: _savedAddresses.firstWhere((a) => a['id'] == _selectedAddressId)['details'] ?? 'Kazanchis Node',
          estimatedDelivery: _selectedDelivery == 'Express' ? 'Today (Same Day)' : 'Tomorrow, July 4, 2026',
        ),
      ),
      (route) => route.isFirst,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          backgroundColor: AppColors.background,
          appBar: AppBar(
            backgroundColor: AppColors.background,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: _prevStep,
            ),
            title: const Text(
              'SECURE CHECKOUT',
              style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black, letterSpacing: 1.5),
            ),
            centerTitle: true,
          ),
          body: Column(
            children: [
              // Step Indicators
              _buildStepIndicator(),

              // Core Step view
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: _buildCurrentStepBody(),
                  ),
                ),
              ),

              // Sticky Navigation Bottom
              _buildStickyBottomNavBar(),
            ],
          ),
        ),

        // FULL SCREEN PAYMENT EXPERIENCE OVERLAY
        if (_isProcessingPayment) _buildPaymentProcessingOverlay(),
      ],
    );
  }

  Widget _buildStepIndicator() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.border, width: 1.0)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _buildStepNode(0, 'ADDRESS', Icons.location_on),
          _buildStepLine(1),
          _buildStepNode(1, 'DELIVERY', Icons.local_shipping),
          _buildStepLine(2),
          _buildStepNode(2, 'PAYMENT', Icons.credit_card),
          _buildStepLine(3),
          _buildStepNode(3, 'REVIEW', Icons.fact_check),
        ],
      ),
    );
  }

  Widget _buildStepNode(int index, String label, IconData icon) {
    final isActive = _currentStep == index;
    final isDone = _currentStep > index;

    return Column(
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            color: isDone
                ? AppColors.success
                : (isActive ? AppColors.goldMedium : AppColors.card),
            shape: BoxShape.circle,
            border: Border.all(
              color: isDone
                  ? AppColors.success
                  : (isActive ? AppColors.goldLight : AppColors.border),
              width: 1.5,
            ),
          ),
          child: Icon(
            isDone ? Icons.check : icon,
            color: isDone || isActive ? Colors.black : AppColors.textMuted,
            size: 16,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: TextStyle(
            fontSize: 7.5,
            fontWeight: FontWeight.black,
            color: isDone
                ? AppColors.success
                : (isActive ? AppColors.goldLight : AppColors.textMuted),
            letterSpacing: 0.5,
          ),
        )
      ],
    );
  }

  Widget _buildStepLine(int targetIndex) {
    final isDone = _currentStep >= targetIndex;
    return Expanded(
      child: Container(
        height: 1.5,
        margin: const EdgeInsets.only(bottom: 14),
        color: isDone ? AppColors.success : AppColors.border,
      ),
    );
  }

  Widget _buildCurrentStepBody() {
    switch (_currentStep) {
      case 0:
        return _buildStep1Address();
      case 1:
        return _buildStep2Delivery();
      case 2:
        return _buildStep3Payment();
      case 3:
        return _buildStep4Review();
      default:
        return const SizedBox.shrink();
    }
  }

  // STEP 1: DELIVERY ADDRESS
  Widget _buildStep1Address() {
    return Column(
      key: const ValueKey('step_1_address'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'SELECT DELIVERY LOCATION',
          style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.0),
        ),
        const SizedBox(height: 12),

        // Saved list
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _savedAddresses.length,
          itemBuilder: (context, index) {
            final addr = _savedAddresses[index];
            final isSelected = _selectedAddressId == addr['id'];
            return GestureDetector(
              onTap: () {
                setState(() {
                  _selectedAddressId = addr['id']!;
                  _showAddNewAddress = false;
                });
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.surface : AppColors.surface.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected ? AppColors.goldMedium : AppColors.border,
                    width: isSelected ? 1.5 : 1.0,
                  ),
                ),
                child: Row(
                  children: [
                    Radio<String>(
                      value: addr['id']!,
                      groupValue: _selectedAddressId,
                      activeColor: AppColors.goldLight,
                      onChanged: (val) {
                        setState(() {
                          _selectedAddressId = val!;
                          _showAddNewAddress = false;
                        });
                      },
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            addr['label']!.toUpperCase(),
                            style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.black),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            addr['details']!,
                            style: const TextStyle(color: AppColors.textSecondary, fontSize: 10, height: 1.4),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              const Icon(Icons.gps_fixed, color: AppColors.goldDark, size: 10),
                              const SizedBox(width: 4),
                              Text(
                                addr['coords']!,
                                style: const TextStyle(color: AppColors.textMuted, fontSize: 8.5, fontWeight: FontWeight.bold),
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),

        const SizedBox(height: 14),

        // Add new address button
        if (!_showAddNewAddress)
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: AppColors.border),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
            ),
            onPressed: () {
              setState(() {
                _showAddNewAddress = true;
              });
            },
            icon: const Icon(Icons.add_location_alt, color: AppColors.goldLight, size: 16),
            label: const Text('ADD NEW ESCROW DELIVERY ADDRESS', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
          ),

        if (_showAddNewAddress) ...[
          const Divider(color: AppColors.border, height: 32),
          const Text(
            'GPS MAP PICKER NODE',
            style: TextStyle(color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 0.5),
          ),
          const SizedBox(height: 12),

          // Simulated high-tech radar map
          Container(
            height: 160,
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Stack(
              children: [
                // Grid background vector simulation
                Positioned.fill(
                  child: Opacity(
                    opacity: 0.1,
                    child: Image.network(
                      'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                // Map simulation lines using simple layout
                Center(
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Pulsing radar ring
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 150),
                        width: 100 * _gpsRadarScale,
                        height: 100 * _gpsRadarScale,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.goldLight.withOpacity(0.15), width: 1.5),
                        ),
                      ),
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 150),
                        width: 60 * _gpsRadarScale,
                        height: 60 * _gpsRadarScale,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.goldLight.withOpacity(0.3), width: 1.0),
                        ),
                      ),
                      const Icon(Icons.my_location, color: AppColors.goldLight, size: 24),
                    ],
                  ),
                ),
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: Colors.black85, borderRadius: BorderRadius.circular(8)),
                    child: Text(
                      'LAT/LNG: $_selectedGPSCoords',
                      style: const TextStyle(color: AppColors.success, fontSize: 8, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                    ),
                  ),
                ),
                // Use current location button
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black85,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      minimumSize: Size.zero,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: _startGPSLocationSim,
                    icon: _isLocatingGPS
                        ? const SizedBox(
                            width: 10,
                            height: 10,
                            child: CircularProgressIndicator(strokeWidth: 1.5, color: AppColors.goldLight),
                          )
                        : const Icon(Icons.gps_fixed, size: 10, color: AppColors.goldLight),
                    label: const Text('PIN CURRENT GPS', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Address inputs
          TextField(
            controller: _newAddressLabelController,
            style: const TextStyle(color: Colors.white, fontSize: 11),
            decoration: const InputDecoration(
              labelText: 'Address Label (e.g., Home Villa, Bole Atlas)',
              labelStyle: TextStyle(color: AppColors.textSecondary, fontSize: 10),
              border: UnderlineInputBorder(),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _newAddressDetailsController,
            style: const TextStyle(color: Colors.white, fontSize: 11),
            decoration: const InputDecoration(
              labelText: 'Exact Delivery Instructions / Physical details',
              labelStyle: TextStyle(color: AppColors.textSecondary, fontSize: 10),
              border: UnderlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() => _showAddNewAddress = false),
                  child: const Text('CANCEL', style: TextStyle(fontSize: 10)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: _saveNewAddress,
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium),
                  child: const Text('SAVE ADDRESS', style: TextStyle(fontSize: 10, color: Colors.black)),
                ),
              ),
            ],
          ),
        ],

        const SizedBox(height: 24),
        const Text(
          'DELIVERY NOTES (OPTIONAL)',
          style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.0),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _orderNotesController,
          maxLines: 2,
          style: const TextStyle(color: Colors.white, fontSize: 11),
          decoration: InputDecoration(
            hintText: 'e.g., Deliver after 5:00 PM, ring Kazanchis front desk bell...',
            hintStyle: const TextStyle(color: Colors.white24, fontSize: 10),
            filled: true,
            fillColor: AppColors.surface,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }

  // STEP 2: DELIVERY METHOD
  Widget _buildStep2Delivery() {
    return Column(
      key: const ValueKey('step_2_delivery'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'SELECT DELIVERY PRIORITY',
          style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.0),
        ),
        const SizedBox(height: 12),

        _buildDeliveryMethodOption(
          'Standard',
          '🚚 Standard Delivery',
          'Arrives: Tomorrow, July 4, 2026',
          'Subsidized standard parcel network dispatch.',
          '150 ETB',
        ),
        _buildDeliveryMethodOption(
          'Express',
          '⚡ Express Delivery',
          'Arrives: Today (Same Day Guaranteed)',
          'Immediate premium courier dispatch. Priority routing.',
          '350 ETB',
        ),
        _buildDeliveryMethodOption(
          'Pickup',
          '🏪 Bole Hub Self-Pickup',
          'Ready: In 2 hours',
          'Pick up directly from certified Every-zone Bole Atlas hub.',
          'FREE',
        ),
      ],
    );
  }

  Widget _buildDeliveryMethodOption(String id, String label, String arrival, String desc, String price) {
    final isSelected = _selectedDelivery == id;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedDelivery = id;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.surface : AppColors.surface.withOpacity(0.4),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected ? AppColors.goldMedium : AppColors.border,
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Row(
          children: [
            Radio<String>(
              value: id,
              groupValue: _selectedDelivery,
              activeColor: AppColors.goldLight,
              onChanged: (val) {
                setState(() {
                  _selectedDelivery = val!;
                });
              },
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text(
                        label.toUpperCase(),
                        style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black),
                      ),
                      Text(
                        price,
                        style: TextStyle(
                          color: id == 'Pickup' || isSelected ? AppColors.goldLight : Colors.white70,
                          fontSize: 12,
                          fontWeight: FontWeight.black,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    arrival,
                    style: const TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    desc,
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 9.5),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  // STEP 3: PAYMENT EXPERIENCE & METHODS
  Widget _buildStep3Payment() {
    return Column(
      key: const ValueKey('step_3_payment'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'CHOOSE SECURE GATEWAY',
          style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.0),
        ),
        const SizedBox(height: 12),

        _buildPaymentOption('Wallet', '🛡️ EVERY-ZONE ESCROW WALLET', 'Pay via secure digital vault with biometric validation.', true),
        _buildPaymentOption('Telebirr', '📱 TELEBIRR SECURE LINK', 'Instant redirect to Telebirr mobile money system.', false),
        _buildPaymentOption('Chapa', '💳 CHAPA INTEGRATED GATEWAY', 'Local bank card processing via secure Chapa APIs.', false),
        _buildPaymentOption('CBE', '🏛️ COMMERCIAL BANK (CBE BIRR)', 'CBE mobile banking link.', false),
        _buildPaymentOption('Card', '💳 CREDITS & BANK CARDS', 'Visa / Mastercard secure token.', false),

        if (_selectedPayment == 'Card') ...[
          const SizedBox(height: 20),
          const Text(
            'SAVED CARDS & ACCOUNTS',
            style: TextStyle(color: AppColors.goldLight, fontSize: 9.5, fontWeight: FontWeight.black, letterSpacing: 0.5),
          ),
          const SizedBox(height: 10),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _savedCards.length,
            itemBuilder: (context, index) {
              final card = _savedCards[index];
              final isSelected = _selectedCardId == card['id'];
              return GestureDetector(
                onTap: () => setState(() => _selectedCardId = card['id']!),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.surface : AppColors.surface.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: isSelected ? AppColors.goldMedium : AppColors.border),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.credit_card, color: isSelected ? AppColors.goldLight : Colors.white30, size: 18),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(card['label']!, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                            Text(card['type']!, style: const TextStyle(color: AppColors.textSecondary, fontSize: 8.5)),
                          ],
                        ),
                      ),
                      Radio<String>(
                        value: card['id']!,
                        groupValue: _selectedCardId,
                        activeColor: AppColors.goldLight,
                        onChanged: (val) => setState(() => _selectedCardId = val!),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],

        if (_selectedPayment == 'Wallet') ...[
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.goldDark.withOpacity(0.12),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.goldMedium.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.shield, color: AppColors.goldLight, size: 24),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'ESCROW SAFE-SHIELD ENGAGED',
                        style: TextStyle(color: AppColors.goldLight, fontSize: 9, fontWeight: FontWeight.black),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Your available balance is 18,500 ETB. Your total will be held in secure escrow. The seller is only paid after delivery approval.',
                        style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 9.5, height: 1.4),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          )
        ],
      ],
    );
  }

  Widget _buildPaymentOption(String id, String label, String desc, bool recommended) {
    final isSelected = _selectedPayment == id;
    return GestureDetector(
      onTap: () => setState(() => _selectedPayment = id),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.surface : AppColors.surface.withOpacity(0.4),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? AppColors.goldMedium : AppColors.border),
        ),
        child: Row(
          children: [
            Radio<String>(
              value: id,
              groupValue: _selectedPayment,
              activeColor: AppColors.goldLight,
              onChanged: (val) => setState(() => _selectedPayment = val!),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(label, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black)),
                      if (recommended) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                          decoration: BoxDecoration(color: AppColors.goldDark, borderRadius: BorderRadius.circular(4)),
                          child: const Text('RECOMMENDED', style: TextStyle(color: Colors.white, fontSize: 6.5, fontWeight: FontWeight.black)),
                        )
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(desc, style: const TextStyle(color: AppColors.textSecondary, fontSize: 9)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // STEP 4: REVIEW ORDER
  Widget _buildStep4Review() {
    final activeItems = _cartManager.items;
    final subtotal = _cartManager.subtotal;
    final discount = _cartManager.discount;
    final delivery = _cartManager.deliveryFee;
    final tax = _cartManager.tax;
    final total = _cartManager.grandTotal;

    final selectedAddress = _savedAddresses.firstWhere((a) => a['id'] == _selectedAddressId, orElse: () => _savedAddresses[0]);

    return Column(
      key: const ValueKey('step_4_review'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'ORDER SPECIFICATIONS',
          style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.0),
        ),
        const SizedBox(height: 12),

        // Items brief list
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.border)),
          child: Column(
            children: [
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: activeItems.length,
                itemBuilder: (context, index) {
                  final item = activeItems[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Expanded(
                          child: Text(
                            '${item.quantity}x ${item.product.title.toUpperCase()} (${item.color})',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(color: Colors.white, fontSize: 10.5),
                          ),
                        ),
                        Text(
                          '${item.totalPrice.toLocaleString()} ETB',
                          style: const TextStyle(color: AppColors.goldLight, fontSize: 10.5, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  );
                },
              ),
              const Divider(color: AppColors.border, height: 16),
              _buildSummaryRowSmall('Subtotal', '${subtotal.toLocaleString()} ETB'),
              if (discount > 0) _buildSummaryRowSmall('Coupon Discount', '- ${discount.toLocaleString()} ETB', color: AppColors.success),
              _buildSummaryRowSmall('Delivery (${_selectedDelivery})', delivery == 0 ? 'FREE' : '${delivery.toLocaleString()} ETB'),
              _buildSummaryRowSmall('VAT (15%)', '${tax.toLocaleString()} ETB'),
              const Divider(color: AppColors.border, height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text('TOTAL AMOUNT DUE', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black)),
                  Text('${total.toLocaleString()} ETB', style: const TextStyle(color: AppColors.goldLight, fontSize: 13, fontWeight: FontWeight.black)),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        // Selected Address & Delivery summary
        _buildReviewSummaryCard('DELIVERY NODE', selectedAddress['label'] ?? 'Office Node', selectedAddress['details'] ?? '', Icons.location_on),
        const SizedBox(height: 10),
        _buildReviewSummaryCard('GATEWAY METHOD', _selectedPayment.toUpperCase(), 'Decentralized shielded vault checkout.', Icons.shield_outlined),

        const SizedBox(height: 20),

        // Terms Checkbox
        CheckboxListTile(
          value: _termsAccepted,
          onChanged: (val) => setState(() => _termsAccepted = val!),
          activeColor: AppColors.goldLight,
          checkColor: Colors.black,
          title: const Text(
            'I accept the Every-zone Joint-Escrow Shielding Protocol. Funds will be held securely in escrow and only released when I receive the items and tap approve.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 9.5, height: 1.4),
          ),
          contentPadding: EdgeInsets.zero,
          controlType: ListTileControlType.leading,
        ),
      ],
    );
  }

  Widget _buildSummaryRowSmall(String label, String val, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 9.5)),
          Text(val, style: TextStyle(color: color ?? Colors.white, fontSize: 9.5, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildReviewSummaryCard(String title, String subtitle, String details, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.border)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppColors.goldLight, size: 16),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.black)),
                if (details.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(details, style: const TextStyle(color: AppColors.textSecondary, fontSize: 9.5, height: 1.3)),
                ],
              ],
            ),
          )
        ],
      ),
    );
  }

  // BOTTOM ACTIONS
  Widget _buildStickyBottomNavBar() {
    final total = _cartManager.grandTotal;

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: const Border(top: BorderSide(color: AppColors.border, width: 1.0)),
      ),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            if (_currentStep > 0)
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  side: const BorderSide(color: AppColors.border),
                ),
                onPressed: _prevStep,
                child: const Text('BACK', style: TextStyle(fontSize: 10, color: Colors.white70)),
              )
            else
              const SizedBox.shrink(),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: _currentStep == 3 ? AppColors.goldMedium : AppColors.goldDark,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _currentStep == 3 ? _startPaymentProcess : _nextStep,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      _currentStep == 3
                          ? 'PLACE ESCROW ORDER (${total.toLocaleString()} ETB)'
                          : 'CONTINUE',
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 0.5),
                    ),
                    const SizedBox(width: 6),
                    const Icon(Icons.arrow_forward, size: 12),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // HIGH FIDELITY PAY EXPERIENCE SIMULATED OVERLAYS
  Widget _buildPaymentProcessingOverlay() {
    return Material(
      color: Colors.black.withOpacity(0.9),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 36),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // STAGE 1: Biometrics Required
              if (_processingStage == 'biometric') ...[
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: AppColors.goldMedium, width: 1.5),
                    boxShadow: [BoxShadow(color: AppColors.goldLight.withOpacity(0.1), blurRadius: 40)],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.fingerprint, color: AppColors.goldLight, size: 68),
                      const SizedBox(height: 20),
                      const Text(
                        'BIOMETRIC VALIDATION',
                        style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black, letterSpacing: 1.5),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        'Every-zone Vault is requesting fingerprint or Face-unlock signature to approve direct ledger debit.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppColors.textSecondary, fontSize: 10.5, height: 1.4),
                      ),
                      const SizedBox(height: 28),
                      ElevatedButton(
                        onPressed: _simulateBiometricAuthentication,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.goldMedium,
                          foregroundColor: Colors.black,
                          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: const Text('APPROVE VIA FINGERPRINT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black)),
                      ),
                      const SizedBox(height: 12),
                      TextButton(
                        onPressed: () => setState(() => _isProcessingPayment = false),
                        child: const Text('CANCEL TRANSACTION', style: TextStyle(color: AppColors.textMuted, fontSize: 9.5)),
                      ),
                    ],
                  ),
                ),
              ],

              // STAGE 2: LOADING GATEWAY
              if (_processingStage == 'loading') ...[
                const SizedBox(
                  width: 50,
                  height: 50,
                  child: CircularProgressIndicator(strokeWidth: 2.0, color: AppColors.goldLight),
                ),
                const SizedBox(height: 24),
                const Text(
                  'LINKING SECURE LEDGER...',
                  style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 2.0),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Routing contract through Chapa and CBE vaults safely.',
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 9.5),
                ),
              ],

              // STAGE 3: OTP VERIFICATION
              if (_processingStage == 'otp') ...[
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: AppColors.goldDark.withOpacity(0.1), shape: BoxShape.circle),
                        child: const Icon(Icons.sms_failed, color: AppColors.goldLight, size: 32),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'ENTER ONE-TIME PASSWORD',
                        style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.0),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Enter the 4-digit security code dispatched to +251 ••• •• 9810.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppColors.textSecondary, fontSize: 10, height: 1.4),
                      ),
                      const SizedBox(height: 20),
                      
                      // Simulated hint block so they know what to type
                      Container(
                        padding: const EdgeInsets.all(8),
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(color: Colors.black26, borderRadius: BorderRadius.circular(8)),
                        child: const Text(
                          '💡 Developer Hint: Enter code "1234"',
                          style: TextStyle(color: AppColors.goldMedium, fontSize: 9.5, fontWeight: FontWeight.bold),
                        ),
                      ),

                      // Input pin
                      TextField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        maxLength: 4,
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 12),
                        decoration: InputDecoration(
                          counterText: '',
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.goldMedium)),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Code expires in $_otpCountdown seconds',
                        style: const TextStyle(color: AppColors.textMuted, fontSize: 9),
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => setState(() => _isProcessingPayment = false),
                              child: const Text('CANCEL', style: TextStyle(fontSize: 9.5)),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _verifyOTP,
                              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium, foregroundColor: Colors.black),
                              child: const Text('VERIFY & COMPLY', style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.black)),
                            ),
                          ),
                        ],
                      ),
                      
                      // Failed payment simulation triggers retry
                      if (_otpError) ...[
                        const SizedBox(height: 14),
                        TextButton(
                          onPressed: _retryFailedPayment,
                          child: const Text('RE-ROUTE CODE (RETRY)', style: TextStyle(color: AppColors.error, fontSize: 9, fontWeight: FontWeight.bold, decoration: TextDecoration.underline)),
                        )
                      ]
                    ],
                  ),
                )
              ],
            ],
          ),
        ),
      ),
    );
  }
}
