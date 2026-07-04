import 'package:flutter/material.dart';

class ShopCategory {
  final String id;
  final String name;
  final IconData icon;
  final Color color;

  const ShopCategory({
    required this.id,
    required this.name,
    required this.icon,
    required this.color,
  });
}

class PromoBanner {
  final String id;
  final String title;
  final String subtitle;
  final String imageUrl;
  final String tag;
  final String ctaText;

  const PromoBanner({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.imageUrl,
    required this.tag,
    required this.ctaText,
  });
}

class Product {
  final String id;
  final String title;
  final String titleAm;
  final double price;
  final double? originalPrice;
  final String description;
  final String descriptionAm;
  final List<String> imageUrls;
  final double rating;
  final int reviewsCount;
  final String categoryId;
  final String vendorId;
  final bool isFlashSale;
  final int? flashSaleQuantity;
  final int? flashSaleSold;
  final bool isTrending;
  final bool isAiRecommended;
  final List<String> specifications;
  final List<String> reviews;
  final List<String> questions;
  final bool installmentAvailable;
  final String stockStatus; // 'In Stock' | 'Low Stock' | 'Out of Stock'

  const Product({
    required this.id,
    required this.title,
    required this.titleAm,
    required this.price,
    this.originalPrice,
    required this.description,
    required this.descriptionAm,
    required this.imageUrls,
    required this.rating,
    required this.reviewsCount,
    required this.categoryId,
    required this.vendorId,
    this.isFlashSale = false,
    this.flashSaleQuantity,
    this.flashSaleSold,
    this.isTrending = false,
    this.isAiRecommended = false,
    required this.specifications,
    required this.reviews,
    required this.questions,
    this.installmentAvailable = true,
    this.stockStatus = 'In Stock',
  });

  int get discountPercentage {
    if (originalPrice == null || originalPrice! <= price) return 0;
    return (((originalPrice! - price) / originalPrice!) * 100).round();
  }
}

class Vendor {
  final String id;
  final String name;
  final String logoUrl;
  final String coverUrl;
  final double rating;
  final int followers;
  final bool isVerified;
  final bool isPremium;
  final int trustScore; // e.g., 98 for 98%
  final int ordersCompleted;
  final String responseTime; // e.g., "5 mins"
  final int yearsOnPlatform;
  final String address;
  final String openHours;
  final String businessStory;
  final String licenseNumber;
  final List<String> certificates;
  final String website;
  final List<String> socialLinks;

  const Vendor({
    required this.id,
    required this.name,
    required this.logoUrl,
    required this.coverUrl,
    required this.rating,
    required this.followers,
    this.isVerified = true,
    this.isPremium = true,
    required this.trustScore,
    required this.ordersCompleted,
    required this.responseTime,
    required this.yearsOnPlatform,
    required this.address,
    required this.openHours,
    required this.businessStory,
    required this.licenseNumber,
    required this.certificates,
    required this.website,
    required this.socialLinks,
  });
}

class VendorService {
  final String id;
  final String title;
  final String imageUrl;
  final double startingPrice;
  final String duration;
  final String description;

  const VendorService({
    required this.id,
    required this.title,
    required this.imageUrl,
    required this.startingPrice,
    required this.duration,
    required this.description,
  });
}

class VendorPost {
  final String id;
  final String type; // 'offer' | 'announcement' | 'standard'
  final String content;
  final List<String> imageUrls;
  final String videoUrl;
  final String timestamp;
  final int likes;
  final int comments;
  final bool isPinned;

  const VendorPost({
    required this.id,
    required this.type,
    required this.content,
    required this.imageUrls,
    this.videoUrl = '',
    required this.timestamp,
    required this.likes,
    required this.comments,
    this.isPinned = false,
  });
}

class VendorVideo {
  final String id;
  final String videoUrl;
  final String thumbnailUrl;
  final String description;
  final int likes;
  final int comments;

  const VendorVideo({
    required this.id,
    required this.videoUrl,
    required this.thumbnailUrl,
    required this.description,
    required this.likes,
    required this.comments,
  });
}

class VendorReview {
  final String id;
  final String reviewerName;
  final double rating;
  final String comment;
  final String date;
  final bool isVerifiedBuyer;
  final String vendorReply;
  final List<String> imageUrls;
  final int helpfulCount;

  const VendorReview({
    required this.id,
    required this.reviewerName,
    required this.rating,
    required this.comment,
    required this.date,
    this.isVerifiedBuyer = true,
    this.vendorReply = '',
    required this.imageUrls,
    this.helpfulCount = 0,
  });
}
