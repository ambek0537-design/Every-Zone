import 'package:flutter/material.dart';
import '../models/shop_models.dart';
import 'mock_shop_data.dart';

class CartItem {
  final String id;
  final Product product;
  final String color;
  final String size;
  int quantity;
  bool isSavedForLater;

  CartItem({
    required this.id,
    required this.product,
    this.color = 'Royal Gold',
    this.size = 'M',
    this.quantity = 1,
    this.isSavedForLater = false,
  });

  double get totalPrice => product.price * quantity;
}

class Coupon {
  final String code;
  final String description;
  final double discountPercent;
  final double discountAmount;
  final double minSpend;

  const Coupon({
    required this.code,
    required this.description,
    this.discountPercent = 0.0,
    this.discountAmount = 0.0,
    this.minSpend = 0.0,
  });
}

class CartManager extends ChangeNotifier {
  static final CartManager _instance = CartManager._internal();
  factory CartManager() => _instance;

  CartManager._internal() {
    _initializeCart();
  }

  final List<CartItem> _items = [];
  final List<Coupon> _availableCoupons = [
    const Coupon(code: 'EZWELCOM10', description: 'Save 10% on your first order', discountPercent: 10.0),
    const Coupon(code: 'HABESHA500', description: '500 ETB Flat discount on heritage couture', discountAmount: 500.0, minSpend: 10000.0),
    const Coupon(code: 'METROFREE', description: 'Free delivery on premium orders', discountAmount: 150.0, minSpend: 5000.0),
  ];

  Coupon? _appliedCoupon;
  String _deliveryMethod = 'Standard'; // Standard, Express, Pickup
  String? _deliveryAddressId = 'addr_1';
  String _deliveryNotes = '';

  List<CartItem> get items => _items.where((i) => !i.isSavedForLater).toList();
  List<CartItem> get savedItems => _items.where((i) => i.isSavedForLater).toList();
  List<Coupon> get availableCoupons => _availableCoupons;
  Coupon? get appliedCoupon => _appliedCoupon;
  String get deliveryMethod => _deliveryMethod;
  String? get deliveryAddressId => _deliveryAddressId;
  String get deliveryNotes => _deliveryNotes;

  void _initializeCart() {
    // Pre-populate with high fidelity items for a fully interactive experience
    if (MockShopData.products.isNotEmpty) {
      final kemis = MockShopData.products.firstWhere((p) => p.id == 'prd1', orElse: () => MockShopData.products.first);
      _items.add(CartItem(
        id: 'cart_1',
        product: kemis,
        color: 'Imperial Gold & Off-White',
        size: 'L',
        quantity: 1,
      ));

      // Try to find another product
      if (MockShopData.products.length > 2) {
        final secondaryPrd = MockShopData.products[2];
        _items.add(CartItem(
          id: 'cart_2',
          product: secondaryPrd,
          color: 'Matte Onyx Black',
          size: 'Standard',
          quantity: 2,
        ));
      }
    }
  }

  void addToCart(Product product, {String color = 'Imperial Gold', String size = 'M'}) {
    // Check if already in active cart
    final index = _items.indexWhere((i) => i.product.id == product.id && i.color == color && i.size == size && !i.isSavedForLater);
    if (index != -1) {
      _items[index].quantity += 1;
    } else {
      _items.add(CartItem(
        id: 'item_${DateTime.now().millisecondsSinceEpoch}',
        product: product,
        color: color,
        size: size,
        quantity: 1,
      ));
    }
    notifyListeners();
  }

  void removeFromCart(String itemId) {
    _items.removeWhere((i) => i.id == itemId);
    notifyListeners();
  }

  void updateQuantity(String itemId, int quantity) {
    final index = _items.indexWhere((i) => i.id == itemId);
    if (index != -1) {
      if (quantity <= 0) {
        _items.removeAt(index);
      } else {
        _items[index].quantity = quantity;
      }
      notifyListeners();
    }
  }

  void toggleSaveForLater(String itemId) {
    final index = _items.indexWhere((i) => i.id == itemId);
    if (index != -1) {
      _items[index].isSavedForLater = !_items[index].isSavedForLater;
      notifyListeners();
    }
  }

  void setDeliveryMethod(String method) {
    _deliveryMethod = method;
    notifyListeners();
  }

  void setDeliveryAddress(String addressId) {
    _deliveryAddressId = addressId;
    notifyListeners();
  }

  void setDeliveryNotes(String notes) {
    _deliveryNotes = notes;
    notifyListeners();
  }

  bool applyCoupon(String code) {
    final couponIndex = _availableCoupons.indexWhere((c) => c.code.toUpperCase() == code.toUpperCase().trim());
    if (couponIndex != -1) {
      final coupon = _availableCoupons[couponIndex];
      if (subtotal >= coupon.minSpend) {
        _appliedCoupon = coupon;
        notifyListeners();
        return true;
      }
    }
    return false;
  }

  void removeCoupon() {
    _appliedCoupon = null;
    notifyListeners();
  }

  // Calculations
  double get subtotal {
    return items.fold(0.0, (sum, i) => sum + i.totalPrice);
  }

  double get discount {
    if (_appliedCoupon == null) return 0.0;
    final c = _appliedCoupon!;
    if (c.discountPercent > 0) {
      return (subtotal * c.discountPercent) / 100;
    }
    return c.discountAmount;
  }

  double get deliveryFee {
    if (_deliveryMethod == 'Pickup') return 0.0;
    if (_deliveryMethod == 'Express') return 350.0;
    return 150.0; // Standard
  }

  double get tax {
    // 15% VAT on subtotal after discount
    return (subtotal - discount) * 0.15;
  }

  double get grandTotal {
    final total = subtotal - discount + deliveryFee + tax;
    return total < 0 ? 0.0 : total;
  }

  void clearCart() {
    _items.removeWhere((i) => !i.isSavedForLater);
    _appliedCoupon = null;
    _deliveryMethod = 'Standard';
    _deliveryNotes = '';
    notifyListeners();
  }
}
