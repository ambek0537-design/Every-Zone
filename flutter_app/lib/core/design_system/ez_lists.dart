import 'package:flutter/material.dart';
import 'ez_cards.dart';
import 'ez_spacing.dart';
import 'ez_typography.dart';

class EZVendorList extends StatelessWidget {
  final List<Map<String, dynamic>> vendors;
  final Function(String vendorId) onVendorTap;
  final bool shrinkWrap;
  final ScrollPhysics? physics;

  const EZVendorList({
    super.key,
    required this.vendors,
    required this.onVendorTap,
    this.shrinkWrap = false,
    this.physics,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      shrinkWrap: shrinkWrap,
      physics: physics ?? (shrinkWrap ? const NeverScrollableScrollPhysics() : const BouncingScrollPhysics()),
      itemCount: vendors.length,
      itemBuilder: (context, index) {
        final vendor = vendors[index];
        return EZVendorCard(
          name: vendor['name'] ?? '',
          logoUrl: vendor['logoUrl'] ?? '',
          description: vendor['description'] ?? '',
          rating: (vendor['rating'] ?? 5.0).toDouble(),
          followersCount: (vendor['followersCount'] ?? 100).toInt(),
          isVerified: vendor['isVerified'] ?? true,
          onTap: () => onVendorTap(vendor['id'] ?? ''),
        );
      },
    );
  }
}

class EZProductsList extends StatelessWidget {
  final List<Map<String, dynamic>> products;
  final Function(String productId) onProductTap;
  final Function(String productId)? onFavoriteTap;
  final bool isHorizontal;
  final bool shrinkWrap;
  final ScrollPhysics? physics;

  const EZProductsList({
    super.key,
    required this.products,
    required this.onProductTap,
    this.onFavoriteTap,
    this.isHorizontal = false,
    this.shrinkWrap = false,
    this.physics,
  });

  @override
  Widget build(BuildContext context) {
    if (isHorizontal) {
      return SizedBox(
        height: 240,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          itemCount: products.length,
          itemBuilder: (context, index) {
            final prod = products[index];
            return Padding(
              padding: const EdgeInsets.only(right: 12),
              child: EZProductCard(
                title: prod['title'] ?? '',
                imageUrl: prod['imageUrl'] ?? '',
                price: (prod['price'] ?? 0.0).toDouble(),
                rating: (prod['rating'] ?? 5.0).toDouble(),
                isVerified: prod['isVerified'] ?? true,
                isAiRecommended: prod['isAiRecommended'] ?? false,
                onTap: () => onProductTap(prod['id'] ?? ''),
                onFavoriteTap: onFavoriteTap != null ? () => onFavoriteTap!(prod['id'] ?? '') : null,
              ),
            );
          },
        ),
      );
    }

    return GridView.builder(
      shrinkWrap: shrinkWrap,
      physics: physics ?? (shrinkWrap ? const NeverScrollableScrollPhysics() : const BouncingScrollPhysics()),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.72,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        final prod = products[index];
        return EZProductCard(
          title: prod['title'] ?? '',
          imageUrl: prod['imageUrl'] ?? '',
          price: (prod['price'] ?? 0.0).toDouble(),
          rating: (prod['rating'] ?? 5.0).toDouble(),
          isVerified: prod['isVerified'] ?? true,
          isAiRecommended: prod['isAiRecommended'] ?? false,
          onTap: () => onProductTap(prod['id'] ?? ''),
          onFavoriteTap: onFavoriteTap != null ? () => onFavoriteTap!(prod['id'] ?? '') : null,
        );
      },
    );
  }
}

class EZServicesList extends StatelessWidget {
  final List<Map<String, dynamic>> services;
  final Function(String serviceId) onServiceTap;
  final bool shrinkWrap;
  final ScrollPhysics? physics;

  const EZServicesList({
    super.key,
    required this.services,
    required this.onServiceTap,
    this.shrinkWrap = false,
    this.physics,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      shrinkWrap: shrinkWrap,
      physics: physics ?? (shrinkWrap ? const NeverScrollableScrollPhysics() : const BouncingScrollPhysics()),
      itemCount: services.length,
      itemBuilder: (context, index) {
        final service = services[index];
        return EZServiceCard(
          title: service['title'] ?? '',
          category: service['category'] ?? '',
          basePrice: (service['basePrice'] ?? 0.0).toDouble(),
          rating: (service['rating'] ?? 5.0).toDouble(),
          onTap: () => onServiceTap(service['id'] ?? ''),
        );
      },
    );
  }
}

class EZPropertiesList extends StatelessWidget {
  final List<Map<String, dynamic>> properties;
  final Function(String propertyId) onPropertyTap;
  final bool shrinkWrap;
  final ScrollPhysics? physics;

  const EZPropertiesList({
    super.key,
    required this.properties,
    required this.onPropertyTap,
    this.shrinkWrap = false,
    this.physics,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      shrinkWrap: shrinkWrap,
      physics: physics ?? (shrinkWrap ? const NeverScrollableScrollPhysics() : const BouncingScrollPhysics()),
      itemCount: properties.length,
      itemBuilder: (context, index) {
        final prop = properties[index];
        return EZPropertyCard(
          title: prop['title'] ?? '',
          address: prop['address'] ?? '',
          price: (prop['price'] ?? 0.0).toDouble(),
          area: (prop['area'] ?? 0.0).toDouble(),
          beds: (prop['beds'] ?? 1).toInt(),
          baths: (prop['baths'] ?? 1).toInt(),
          imageUrl: prop['imageUrl'] ?? '',
          onTap: () => onPropertyTap(prop['id'] ?? ''),
        );
      },
    );
  }
}

class EZJobsList extends StatelessWidget {
  final List<Map<String, dynamic>> jobs;
  final Function(String jobId) onJobTap;
  final bool shrinkWrap;
  final ScrollPhysics? physics;

  const EZJobsList({
    super.key,
    required this.jobs,
    required this.onJobTap,
    this.shrinkWrap = false,
    this.physics,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      shrinkWrap: shrinkWrap,
      physics: physics ?? (shrinkWrap ? const NeverScrollableScrollPhysics() : const BouncingScrollPhysics()),
      itemCount: jobs.length,
      itemBuilder: (context, index) {
        final job = jobs[index];
        return EZJobCard(
          title: job['title'] ?? '',
          company: job['company'] ?? '',
          country: job['country'] ?? '',
          salary: job['salary'] ?? '',
          logoUrl: job['logoUrl'] ?? '',
          requirements: List<String>.from(job['requirements'] ?? []),
          onTap: () => onJobTap(job['id'] ?? ''),
        );
      },
    );
  }
}
