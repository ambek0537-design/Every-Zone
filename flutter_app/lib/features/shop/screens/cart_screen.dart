import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../data/cart_manager.dart';
import 'checkout_screen.dart';

extension NumberFormatting on double {
  String toLocaleString() {
    return toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]},',
    );
  }
}

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final CartManager _cartManager = CartManager();
  final TextEditingController _couponController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _cartManager.addListener(_onCartChanged);
  }

  @override
  void dispose() {
    _cartManager.removeListener(_onCartChanged);
    _couponController.dispose();
    super.dispose();
  }

  void _onCartChanged() {
    if (mounted) setState(() {});
  }

  void _applyCouponCode() {
    final code = _couponController.text;
    if (code.isEmpty) return;

    final success = _cartManager.applyCoupon(code);
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🎟️ Coupon "$code" applied successfully!'),
          backgroundColor: AppColors.success,
        ),
      );
      _couponController.clear();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('⚠️ Invalid coupon or minimum spend not met.'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final activeItems = _cartManager.items;
    final savedItems = _cartManager.savedItems;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'SHOPPING CART',
          style: TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.black,
            letterSpacing: 1.5,
          ),
        ),
        centerTitle: true,
        actions: [
          if (activeItems.isNotEmpty)
            TextButton(
              onPressed: () {
                _cartManager.clearCart();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Cart cleared.')),
                );
              },
              child: const Text(
                'CLEAR',
                style: TextStyle(
                  color: AppColors.error,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
        ],
      ),
      body: activeItems.isEmpty && savedItems.isEmpty
          ? _buildEmptyCart()
          : Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Estimated Delivery Banner
                        if (activeItems.isNotEmpty) ...[
                          _buildDeliveryPromoBanner(),
                          const SizedBox(height: 24),
                        ],

                        // Active items title
                        if (activeItems.isNotEmpty) ...[
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              const Text(
                                'CART ITEMS',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.black,
                                  letterSpacing: 1.0,
                                ),
                              ),
                              Text(
                                '${activeItems.length} items',
                                style: const TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          // Items list
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: activeItems.length,
                            itemBuilder: (context, index) {
                              final item = activeItems[index];
                              return _buildCartItemCard(item);
                            },
                          ),
                        ],

                        // Saved for Later section
                        if (savedItems.isNotEmpty) ...[
                          const SizedBox(height: 32),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              const Text(
                                'SAVED FOR LATER',
                                style: TextStyle(
                                  color: AppColors.goldLight,
                                  fontSize: 11,
                                  fontWeight: FontWeight.black,
                                  letterSpacing: 1.0,
                                ),
                              ),
                              Text(
                                '${savedItems.length} items',
                                style: const TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: savedItems.length,
                            itemBuilder: (context, index) {
                              final item = savedItems[index];
                              return _buildSavedItemCard(item);
                            },
                          ),
                        ],

                        // Order Summary Calculations (only if active items are present)
                        if (activeItems.isNotEmpty) ...[
                          const SizedBox(height: 32),
                          const Text(
                            'ORDER SUMMARY',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.black,
                              letterSpacing: 1.0,
                            ),
                          ),
                          const SizedBox(height: 12),
                          _buildOrderSummaryCard(),
                          const SizedBox(height: 24),
                        ],
                      ],
                    ),
                  ),
                ),

                // Sticky Bottom Checkout Panel
                if (activeItems.isNotEmpty) _buildStickyBottomPanel(),
              ],
            ),
    );
  }

  Widget _buildEmptyCart() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: AppColors.surface,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.border, width: 1.5),
              ),
              child: const Icon(
                Icons.shopping_bag_outlined,
                size: 48,
                color: AppColors.goldLight,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'YOUR CART IS EMPTY',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.black,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Explore Every-zone premium marketplace to add custom hand-woven attire or cyber-shield gear.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 12,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.goldMedium,
                foregroundColor: AppColors.background,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: const Text(
                'CONTINUE SHOPPING',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 0.5),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeliveryPromoBanner() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.goldDark.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.local_shipping, color: AppColors.goldLight, size: 18),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'ESTIMATED METROPOLITAN ARRIVAL',
                  style: TextStyle(
                    color: AppColors.goldLight,
                    fontSize: 8,
                    fontWeight: FontWeight.black,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _cartManager.deliveryMethod == 'Express'
                      ? 'Express: Today (Same Day Dispatch guaranteed)'
                      : 'Standard: Tomorrow, July 4, 2026',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCartItemCard(CartItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image block
          Container(
            width: 80,
            height: 95,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
              image: item.product.imageUrls.isNotEmpty
                  ? DecorationImage(
                      image: NetworkImage(item.product.imageUrls[0]),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: item.product.imageUrls.isEmpty
                ? const Icon(Icons.image, color: Colors.white24)
                : null,
          ),
          const SizedBox(width: 14),
          // Details block
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.product.title.toUpperCase(),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.black,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Vendor: ${_getVendorName(item.product.vendorId)}',
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 9.5,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.border,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Col: ${item.color}',
                        style: const TextStyle(color: Colors.white70, fontSize: 8.5),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.border,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Size: ${item.size}',
                        style: const TextStyle(color: Colors.white70, fontSize: 8.5),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Price & Stepper row
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${item.product.price.toLocaleString()} ETB',
                          style: const TextStyle(
                            color: AppColors.goldLight,
                            fontSize: 12,
                            fontWeight: FontWeight.black,
                          ),
                        ),
                        if (item.quantity > 1)
                          Text(
                            'Total: ${item.totalPrice.toLocaleString()} ETB',
                            style: const TextStyle(
                              color: AppColors.textMuted,
                              fontSize: 9.5,
                            ),
                          ),
                      ],
                    ),
                    // Stepper Widget
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.card,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove, size: 14, color: Colors.white54),
                            onPressed: () => _cartManager.updateQuantity(item.id, item.quantity - 1),
                            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                            padding: EdgeInsets.zero,
                          ),
                          Text(
                            '${item.quantity}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.add, size: 14, color: Colors.white54),
                            onPressed: () => _cartManager.updateQuantity(item.id, item.quantity + 1),
                            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                            padding: EdgeInsets.zero,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                // Action options
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton.icon(
                      onPressed: () => _cartManager.toggleSaveForLater(item.id),
                      icon: const Icon(Icons.bookmark_border, size: 11, color: AppColors.goldMedium),
                      label: const Text(
                        'SAVE FOR LATER',
                        style: TextStyle(fontSize: 8.5, color: AppColors.goldMedium, fontWeight: FontWeight.bold),
                      ),
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                    ),
                    const SizedBox(width: 8),
                    TextButton.icon(
                      onPressed: () => _cartManager.removeFromCart(item.id),
                      icon: const Icon(Icons.delete_outline, size: 11, color: AppColors.error),
                      label: const Text(
                        'REMOVE',
                        style: TextStyle(fontSize: 8.5, color: AppColors.error, fontWeight: FontWeight.bold),
                      ),
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSavedItemCard(CartItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface.withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border.withOpacity(0.6)),
      ),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 60,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(8),
              image: item.product.imageUrls.isNotEmpty
                  ? DecorationImage(
                      image: NetworkImage(item.product.imageUrls[0]),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.product.title.toUpperCase(),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${item.product.price.toLocaleString()} ETB',
                  style: const TextStyle(
                    color: AppColors.goldMedium,
                    fontSize: 10.5,
                  ),
                ),
              ],
            ),
          ),
          Column(
            children: [
              ElevatedButton(
                onPressed: () => _cartManager.toggleSaveForLater(item.id),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.goldDark,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  minimumSize: Size.zero,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('MOVE TO CART', style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.black)),
              ),
              const SizedBox(height: 4),
              TextButton(
                onPressed: () => _cartManager.removeFromCart(item.id),
                style: TextButton.styleFrom(
                  padding: EdgeInsets.zero,
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: const Text(
                  'DELETE',
                  style: TextStyle(color: AppColors.error, fontSize: 8.5, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderSummaryCard() {
    final subtotal = _cartManager.subtotal;
    final discount = _cartManager.discount;
    final delivery = _cartManager.deliveryFee;
    final tax = _cartManager.tax;
    final total = _cartManager.grandTotal;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Promo input
          Row(
            children: [
              Expanded(
                child: Container(
                  height: 40,
                  decoration: BoxDecoration(
                    color: AppColors.card,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: TextField(
                    controller: _couponController,
                    style: const TextStyle(color: Colors.white, fontSize: 11),
                    decoration: const InputDecoration(
                      hintText: 'Enter Coupon (e.g. EZWELCOM10)',
                      hintStyle: TextStyle(color: Colors.white24, fontSize: 10),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              ElevatedButton(
                onPressed: _applyCouponCode,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.goldMedium,
                  foregroundColor: AppColors.background,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  height: 40,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: const Text('APPLY', style: TextStyle(fontSize: 9, fontWeight: FontWeight.black)),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Recommended coupons accordion
          _buildRecommendedCouponsDropdown(),

          const Divider(color: AppColors.border, height: 24),

          // Subtotal Row
          _buildSummaryRow('Subtotal', '${subtotal.toLocaleString()} ETB'),
          const SizedBox(height: 8),

          // Discount Row
          if (discount > 0) ...[
            _buildSummaryRow(
              'Coupon Discount (${_cartManager.appliedCoupon?.code})',
              '- ${discount.toLocaleString()} ETB',
              valueColor: AppColors.success,
              leading: GestureDetector(
                onTap: () {
                  _cartManager.removeCoupon();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Coupon removed')),
                  );
                },
                child: const Icon(Icons.cancel, size: 12, color: AppColors.error),
              ),
            ),
            const SizedBox(height: 8),
          ],

          // Delivery Row
          _buildSummaryRow(
            'Delivery Fee (${_cartManager.deliveryMethod})',
            delivery == 0.0 ? 'FREE' : '${delivery.toLocaleString()} ETB',
            valueColor: delivery == 0.0 ? AppColors.success : null,
          ),
          const SizedBox(height: 8),

          // Tax Row
          _buildSummaryRow('Tax (15% VAT)', '${tax.toLocaleString()} ETB'),
          const Divider(color: AppColors.border, height: 28),

          // Grand Total
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text(
                'GRAND TOTAL',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.black,
                  letterSpacing: 0.5,
                ),
              ),
              Text(
                '${total.toLocaleString()} ETB',
                style: const TextStyle(
                  color: AppColors.goldLight,
                  fontSize: 16,
                  fontWeight: FontWeight.black,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendedCouponsDropdown() {
    return Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        title: const Row(
          children: [
            Icon(Icons.local_offer, color: AppColors.goldLight, size: 12),
            SizedBox(width: 6),
            Text(
              'VIEW RECOMMENDED COUPONS',
              style: TextStyle(color: AppColors.goldLight, fontSize: 8.5, fontWeight: FontWeight.black),
            ),
          ],
        ),
        tilePadding: EdgeInsets.zero,
        dense: true,
        children: _cartManager.availableCoupons.map((coupon) {
          final isSpendMet = _cartManager.subtotal >= coupon.minSpend;
          return Container(
            margin: const EdgeInsets.only(bottom: 6),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: _cartManager.appliedCoupon?.code == coupon.code
                    ? AppColors.goldMedium
                    : AppColors.border,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        coupon.code,
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.black),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        coupon.description,
                        style: const TextStyle(color: AppColors.textSecondary, fontSize: 8.5),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: isSpendMet
                      ? () {
                          _cartManager.applyCoupon(coupon.code);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('🎟️ Applied "${coupon.code}" successfully!'),
                              backgroundColor: AppColors.success,
                            ),
                          );
                        }
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _cartManager.appliedCoupon?.code == coupon.code
                        ? AppColors.success
                        : AppColors.goldDark,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    minimumSize: Size.zero,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                  ),
                  child: Text(
                    _cartManager.appliedCoupon?.code == coupon.code ? 'APPLIED' : 'CLAIM',
                    style: const TextStyle(fontSize: 8, fontWeight: FontWeight.black, color: Colors.white),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {Color? valueColor, Widget? leading}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.between,
      children: [
        Row(
          children: [
            if (leading != null) ...[
              leading,
              const SizedBox(width: 6),
            ],
            Text(
              label,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 10.5,
              ),
            ),
          ],
        ),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? Colors.white,
            fontSize: 10.5,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildStickyBottomPanel() {
    final total = _cartManager.grandTotal;

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: const Border(top: BorderSide(color: AppColors.border, width: 1.0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 16,
            offset: const Offset(0, -4),
          )
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'GRAND TOTAL DUE',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 8.5,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${total.toLocaleString()} ETB',
                    style: const TextStyle(
                      color: AppColors.goldLight,
                      fontSize: 16,
                      fontWeight: FontWeight.black,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              flex: 2,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const CheckoutScreen(),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.goldMedium,
                  foregroundColor: AppColors.background,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'PROCEED TO SECURE CHECKOUT',
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.black,
                        letterSpacing: 0.5,
                      ),
                    ),
                    SizedBox(width: 6),
                    Icon(Icons.arrow_forward, size: 12),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getVendorName(String vendorId) {
    if (vendorId == 'v1') return 'Sabahar Heritage Weaves';
    if (vendorId == 'v2') return 'Every-zone Hardware Lab';
    return 'Premium Partner Store';
  }
}
