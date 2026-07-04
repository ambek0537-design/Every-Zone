import 'package:flutter/material.dart';

enum PropertyType {
  apartment,
  villa,
  condominium,
  commercial,
  office,
  warehouse,
  land,
  hotel,
}

extension PropertyTypeExtension on PropertyType {
  String get label {
    switch (this) {
      case PropertyType.apartment: return 'Apartment';
      case PropertyType.villa: return 'Villa';
      case PropertyType.condominium: return 'Condominium';
      case PropertyType.commercial: return 'Commercial';
      case PropertyType.office: return 'Office';
      case PropertyType.warehouse: return 'Warehouse';
      case PropertyType.land: return 'Land';
      case PropertyType.hotel: return 'Hotel';
    }
  }

  String get icon {
    switch (this) {
      case PropertyType.apartment: return '🏢';
      case PropertyType.villa: return '🏡';
      case PropertyType.condominium: return '🏙️';
      case PropertyType.commercial: return '🏪';
      case PropertyType.office: return '💼';
      case PropertyType.warehouse: return '🏭';
      case PropertyType.land: return '🪵';
      case PropertyType.hotel: return '🏨';
    }
  }
}

class RealEstateAgent {
  final String id;
  final String name;
  final String photoUrl;
  final String coverUrl;
  final bool isVerified;
  final int trustScore;
  final int yearsExperience;
  final String responseTime;
  final double rating;
  final int followers;
  final String licenseNumber;
  final String about;
  final String phoneNumber;
  final String email;
  final String location;
  final List<String> branches;
  final List<String> posts;
  final List<String> videos;
  final List<AgentReview> reviews;

  const RealEstateAgent({
    required this.id,
    required this.name,
    required this.photoUrl,
    required this.coverUrl,
    this.isVerified = true,
    required this.trustScore,
    required this.yearsExperience,
    required this.responseTime,
    required this.rating,
    required this.followers,
    required this.licenseNumber,
    required this.about,
    required this.phoneNumber,
    required this.email,
    required this.location,
    required this.branches,
    required this.posts,
    required this.videos,
    required this.reviews,
  });
}

class AgentReview {
  final String id;
  final String reviewerName;
  final double rating;
  final String comment;
  final String date;

  const AgentReview({
    required this.id,
    required this.reviewerName,
    required this.rating,
    required this.comment,
    required this.date,
  });
}

class PropertyReview {
  final String id;
  final String reviewerName;
  final double rating;
  final String comment;
  final bool isVerifiedBuyer;
  final List<String> images;
  final List<String> videos;
  final String? agentReply;
  int helpfulCount;
  bool isReported;

  PropertyReview({
    required this.id,
    required this.reviewerName,
    required this.rating,
    required this.comment,
    this.isVerifiedBuyer = true,
    this.images = const [],
    this.videos = const [],
    this.agentReply,
    this.helpfulCount = 0,
    this.isReported = false,
  });
}

class Property {
  final String id;
  final String title;
  final String description;
  final PropertyType type;
  final double price;
  final String currency;
  final bool isNegotiable;
  final double areaSqm;
  final int bedrooms;
  final int bathrooms;
  final int parkingSpaces;
  final int floorNumber;
  final int yearBuilt;
  final String address;
  final String city;
  final double latitude;
  final double longitude;
  final bool isVerified;
  final bool isFeatured;
  final bool isAiRecommended;
  final bool isNearby;
  final String postedDate;
  final List<String> images;
  final List<String> floorPlans;
  final String? videoTourUrl;
  final String? virtualTourUrl;
  final List<String> amenities;
  final RealEstateAgent agent;
  final List<PropertyReview> reviews;

  // AI-metrics
  final int neighborhoodScore;
  final int investmentScore;
  final double rentalYieldEstimate; // percentage, e.g. 7.4
  final double predictedPrice2027; // Price prediction

  const Property({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.price,
    this.currency = 'ETB',
    this.isNegotiable = true,
    required this.areaSqm,
    required this.bedrooms,
    required this.bathrooms,
    required this.parkingSpaces,
    required this.floorNumber,
    required this.yearBuilt,
    required this.address,
    required this.city,
    required this.latitude,
    required this.longitude,
    this.isVerified = true,
    this.isFeatured = false,
    this.isAiRecommended = false,
    this.isNearby = false,
    required this.postedDate,
    required this.images,
    required this.floorPlans,
    this.videoTourUrl,
    this.virtualTourUrl,
    required this.amenities,
    required this.agent,
    required this.reviews,
    required this.neighborhoodScore,
    required this.investmentScore,
    required this.rentalYieldEstimate,
    required this.predictedPrice2027,
  });
}

class VisitBooking {
  final String id;
  final String propertyId;
  final String propertyTitle;
  final String agentName;
  final DateTime date;
  final String timeSlot;
  final String notes;
  final bool enableReminder;
  final bool isConfirmed;

  const VisitBooking({
    required this.id,
    required this.propertyId,
    required this.propertyTitle,
    required this.agentName,
    required this.date,
    required this.timeSlot,
    required this.notes,
    this.enableReminder = true,
    this.isConfirmed = false,
  });
}

class RealEstateState extends ChangeNotifier {
  static final RealEstateState _instance = RealEstateState._internal();
  factory RealEstateState() => _instance;

  RealEstateState._internal() {
    _initData();
  }

  final List<Property> _properties = [];
  final List<RealEstateAgent> _agents = [];
  final List<String> _favoriteIds = [];
  final Map<String, List<String>> _collections = {
    'Dream Villas': [],
    'Affordable Rentals': [],
  };
  final Map<String, String> _propertyNotes = {};
  final List<String> _comparisonIds = [];
  final List<VisitBooking> _bookings = [];

  List<Property> get properties => _properties;
  List<RealEstateAgent> get agents => _agents;
  List<String> get favoriteIds => _favoriteIds;
  Map<String, List<String>> get collections => _collections;
  Map<String, String> get propertyNotes => _propertyNotes;
  List<String> get comparisonIds => _comparisonIds;
  List<VisitBooking> get bookings => _bookings;

  // Favorites
  bool isFavorite(String propertyId) => _favoriteIds.contains(propertyId);

  void toggleFavorite(String propertyId) {
    if (_favoriteIds.contains(propertyId)) {
      _favoriteIds.remove(propertyId);
      // Remove from collections too
      for (var col in _collections.values) {
        col.remove(propertyId);
      }
    } else {
      _favoriteIds.add(propertyId);
    }
    notifyListeners();
  }

  void saveToCollection(String propertyId, String collectionName) {
    if (!_collections.containsKey(collectionName)) {
      _collections[collectionName] = [];
    }
    if (!_collections[collectionName]!.contains(propertyId)) {
      _collections[collectionName]!.add(propertyId);
      if (!isFavorite(propertyId)) {
        _favoriteIds.add(propertyId);
      }
    }
    notifyListeners();
  }

  void removeFromCollection(String propertyId, String collectionName) {
    if (_collections.containsKey(collectionName)) {
      _collections[collectionName]!.remove(propertyId);
    }
    notifyListeners();
  }

  void createNewCollection(String name) {
    if (!_collections.containsKey(name) && name.trim().isNotEmpty) {
      _collections[name] = [];
      notifyListeners();
    }
  }

  void setPropertyNotes(String propertyId, String note) {
    _propertyNotes[propertyId] = note;
    notifyListeners();
  }

  // Comparisons (Max 4 properties)
  bool isInComparison(String propertyId) => _comparisonIds.contains(propertyId);

  bool toggleComparison(String propertyId) {
    if (_comparisonIds.contains(propertyId)) {
      _comparisonIds.remove(propertyId);
      notifyListeners();
      return false;
    } else {
      if (_comparisonIds.length >= 4) {
        return false; // Error: Max 4
      }
      _comparisonIds.add(propertyId);
      notifyListeners();
      return true;
    }
  }

  void clearComparisons() {
    _comparisonIds.clear();
    notifyListeners();
  }

  // Booking visits
  void addVisitBooking(VisitBooking booking) {
    _bookings.add(booking);
    notifyListeners();
  }

  void removeVisitBooking(String id) {
    _bookings.removeWhere((b) => b.id == id);
    notifyListeners();
  }

  void addPropertyReview(String propertyId, PropertyReview review) {
    final idx = _properties.indexWhere((p) => p.id == propertyId);
    if (idx != -1) {
      _properties[idx].reviews.add(review);
      notifyListeners();
    }
  }

  void incrementHelpful(String propertyId, String reviewId) {
    final prop = _properties.firstWhere((p) => p.id == propertyId);
    final rev = prop.reviews.firstWhere((r) => r.id == reviewId);
    rev.helpfulCount++;
    notifyListeners();
  }

  void reportReview(String propertyId, String reviewId) {
    final prop = _properties.firstWhere((p) => p.id == propertyId);
    final rev = prop.reviews.firstWhere((r) => r.id == reviewId);
    rev.isReported = true;
    notifyListeners();
  }

  void _initData() {
    // Agents
    final agent1 = RealEstateAgent(
      id: 'a1',
      name: 'Yared Selamu',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
      coverUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
      trustScore: 98,
      yearsExperience: 12,
      responseTime: 'Under 5 mins',
      rating: 4.9,
      followers: 4320,
      licenseNumber: 'LRE-ETH-2026-90432',
      about: 'Senior Luxury Consultant specializing in premium villas and penthouse suites in Bole, Kazanchis, and Old Airport areas. Focused on securing optimal investment values and providing fully vetted legal transfers.',
      phoneNumber: '+251 91 122 3344',
      email: 'yared.selamu@everyzone.et',
      location: 'Bole High Street, Hub 4, Addis Ababa',
      branches: ['Bole Hub', 'Kazanchis Premium Branch', 'Hawassa Lake Side Office'],
      posts: [
        '📢 INVESTOR ALERT: Construction on Bole SkyRise Condos is 85% complete. High potential for capital appreciation (projected 30% yield by 2027). Vetted by Every-zone Legal.',
        '🌟 FEATURED EXCLUSIVE: Luxury villa in Old Airport now open for early bookings. Complete biometric verification done. DM for immediate video tours.',
      ],
      videos: [
        'Bole Penthouse Virtual Walkthrough',
        'Kazanchis Commercial Complex - Structure Showcase',
      ],
      reviews: [
        const AgentReview(id: 'ar1', reviewerName: 'Dr. Alula', rating: 5.0, comment: 'Exceptional transparency. Yared guided our family through the complex land transfer without a single issue.', date: '3 weeks ago'),
        const AgentReview(id: 'ar2', reviewerName: 'Selamawit G.', rating: 4.8, comment: 'Very responsive on WhatsApp. Got me a great deal on my apartment lease.', date: '1 month ago'),
      ],
    );

    final agent2 = RealEstateAgent(
      id: 'a2',
      name: 'Tseday Giday',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
      trustScore: 95,
      yearsExperience: 8,
      responseTime: 'Under 15 mins',
      rating: 4.7,
      followers: 2150,
      licenseNumber: 'LRE-ETH-2026-88342',
      about: 'Ecosystem Specialist and Land acquisition lawyer. Expert in commercial workspaces, premium grade-A offices, and industrial warehouse structures in the Akaki-Kality industrial corridor.',
      phoneNumber: '+251 92 555 6677',
      email: 'tseday.giday@everyzone.et',
      location: 'Kality Industrial Zone, Gate 1, Addis Ababa',
      branches: ['Kality Corporate Hub', 'Bole Atlas Suite'],
      posts: [
        '🏢 Premium Grade-A corporate offices are seeing an influx of multinational tenants. Akaki-Kality area warehouse leasing is booming. Get in touch for certified plots.',
        '📝 New regulations regarding land registry in Addis Ababa are now live. We have processed the full checklist for all our listings.',
      ],
      videos: [
        'Kality Warehouse Commercial Tour',
        'How to verify title deeds in 5 minutes',
      ],
      reviews: [
        const AgentReview(id: 'ar3', reviewerName: 'Hana K.', rating: 5.0, comment: 'A brilliant real estate lawyer. Tseday protected our business assets and facilitated the lease seamlessly.', date: '2 weeks ago'),
      ],
    );

    _agents.addAll([agent1, agent2]);

    // Properties
    _properties.addAll([
      Property(
        id: 'p1',
        title: 'Bole Premium Royal Villa',
        description: 'Exquisite modern masterpiece situated in the most secure embassy-grade zone of Bole. Features a spacious triple-volume living room, premium white marble flooring, customized biometric entry control systems, and floor-to-ceiling high-contrast double-glazed glass windows offering beautiful suburban views. Includes an independent server room, private gym, separate sauna-steam complex, fully secure dual-redundant power generator room, and secure subterranean parking for up to 4 heavy-duty SUVs.',
        type: PropertyType.villa,
        price: 125000000,
        currency: 'ETB',
        isNegotiable: true,
        areaSqm: 850,
        bedrooms: 6,
        bathrooms: 8,
        parkingSpaces: 4,
        floorNumber: 2,
        yearBuilt: 2025,
        address: 'Woreda 03, Near Japan Embassy, Bole',
        city: 'Addis Ababa',
        latitude: 9.0123,
        longitude: 38.7845,
        isFeatured: true,
        isAiRecommended: true,
        postedDate: 'Today',
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
        ],
        floorPlans: [
          'https://images.unsplash.com/photo-1506422748879-887454f9dbf4?auto=format&fit=crop&q=80&w=400',
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=400',
        ],
        videoTourUrl: 'https://flutter.github.io/assets-for-api-docs/assets/videos/butterfly.mp4',
        virtualTourUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=600',
        amenities: [
          'Biometric Lock',
          'Solar Power',
          'Dual Generator',
          'Steam & Sauna',
          'Home Cinema',
          'Infinity Pool',
          'Staff Quarters',
          'High-Sec Guardhouse',
        ],
        agent: agent1,
        neighborhoodScore: 98,
        investmentScore: 94,
        rentalYieldEstimate: 8.5,
        predictedPrice2027: 155000000,
        reviews: [
          PropertyReview(
            id: 'pr1',
            reviewerName: 'Dawit Yohannes',
            rating: 5.0,
            comment: 'Visually immaculate property. Every aspect of construction follows European standards. Tested the generator and solar transition, completely seamless.',
            isVerifiedBuyer: true,
            images: [
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=150',
            ],
            agentReply: 'Thank you Dawit! We appreciate your meticulous inspection. We strive to provide only the absolute best structures.',
          ),
          PropertyReview(
            id: 'pr2',
            reviewerName: 'Mesfin A.',
            rating: 4.5,
            comment: 'Stunning design, but the access road has some minor peak-hour traffic. Inside, it is dead quiet and incredibly secure.',
            isVerifiedBuyer: true,
          ),
        ],
      ),
      Property(
        id: 'p2',
        title: 'Kazanchis Luxury Sky Penthouse',
        description: 'Commanding high-elevation penthouse perched atop the brand-new Zenith Towers in Kazanchis. Floor-to-ceiling glass offers unmatched panorama views of the Palace, Sheraton, and the growing Kazanchis skyline. Configured with designer Italian kitchens, fully integrated premium smart home controls, automated thermal curtains, dual master suites with integrated walk-in closets, and an expansive private wraparound sky deck. Complete with round-the-clock armed concierge desk, fast VIP express elevator, and full direct biometric clearance.',
        type: PropertyType.apartment,
        price: 84000000,
        currency: 'ETB',
        isNegotiable: false,
        areaSqm: 420,
        bedrooms: 4,
        bathrooms: 4,
        parkingSpaces: 2,
        floorNumber: 24,
        yearBuilt: 2026,
        address: 'Zenith Towers, Menelik II Avenue, Kazanchis',
        city: 'Addis Ababa',
        latitude: 9.0234,
        longitude: 38.7612,
        isFeatured: true,
        isAiRecommended: true,
        postedDate: 'Yesterday',
        images: [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
        ],
        floorPlans: [
          'https://images.unsplash.com/photo-1506422748879-887454f9dbf4?auto=format&fit=crop&q=80&w=400',
        ],
        videoTourUrl: 'https://flutter.github.io/assets-for-api-docs/assets/videos/butterfly.mp4',
        amenities: [
          'VIP Elevator',
          'Smart Controls',
          'Palace Skyline View',
          '24/7 Concierge',
          'Central HVAC',
          'Wrap Skydeck',
          'Italian Kitchen',
        ],
        agent: agent1,
        neighborhoodScore: 95,
        investmentScore: 97,
        rentalYieldEstimate: 9.2,
        predictedPrice2027: 108000000,
        reviews: [
          PropertyReview(
            id: 'pr3',
            reviewerName: 'Aster M.',
            rating: 5.0,
            comment: 'Living here feels like being in high-end Dubai or New York. The automated thermal control is a lifesaver in the Addis cool nights. Unbelievable sunset views!',
            isVerifiedBuyer: true,
          ),
        ],
      ),
      Property(
        id: 'p3',
        title: 'Old Airport Elegant Villa',
        description: 'Classic stately residence situated in the lush green residential quarter of Old Airport, boasting high-contrast wooden details, cathedral ceilings, spacious front and back manicured gardens, separate helper suites, stone fireplace, and a secure premium brick perimeter. Perfect for families looking for peaceful quiet, yet located within a short drive from top-tier international schools, local country clubs, and secure diplomatic compounds.',
        type: PropertyType.villa,
        price: 95000000,
        currency: 'ETB',
        isNegotiable: true,
        areaSqm: 650,
        bedrooms: 5,
        bathrooms: 5,
        parkingSpaces: 3,
        floorNumber: 2,
        yearBuilt: 2021,
        address: 'Karls Square Area, Old Airport',
        city: 'Addis Ababa',
        latitude: 9.0045,
        longitude: 38.7356,
        isFeatured: false,
        isNearby: true,
        postedDate: '3 days ago',
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
        ],
        floorPlans: [
          'https://images.unsplash.com/photo-1506422748879-887454f9dbf4?auto=format&fit=crop&q=80&w=400',
        ],
        amenities: [
          'Classic Fireplace',
          'Lush Gardens',
          'Perimeter Alarms',
          'Staff Quarters',
          'Hardwood Floors',
          'Secure Perimeter',
        ],
        agent: agent1,
        neighborhoodScore: 92,
        investmentScore: 89,
        rentalYieldEstimate: 7.1,
        predictedPrice2027: 110000000,
        reviews: [],
      ),
      Property(
        id: 'p4',
        title: 'Akaki Logistics Grade-A Warehouse',
        description: 'Massive, heavy-duty industrial warehouse structure designed for international freight forwarders, logistics firms, or industrial storage. Boasting clear-span interior height of 12 meters, floor load capacity of 8 tons per sqm, multiple heavy-duty automated hydraulic loading docks, concrete-paved trailer turnarounds, independent fire suppression systems, and comprehensive high-sec security boundaries. Conveniently located direct on the Akaki express tollway link.',
        type: PropertyType.warehouse,
        price: 450000, // Monthly rental
        currency: 'ETB/mo',
        isNegotiable: true,
        areaSqm: 2400,
        bedrooms: 0,
        bathrooms: 4,
        parkingSpaces: 10,
        floorNumber: 1,
        yearBuilt: 2024,
        address: 'Tollgate Link 2, Akaki-Kality Industrial Zone',
        city: 'Addis Ababa',
        latitude: 8.8912,
        longitude: 38.7990,
        isFeatured: false,
        isNearby: false,
        postedDate: '5 days ago',
        images: [
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
        ],
        floorPlans: [],
        amenities: [
          '12m Clear Height',
          '8-Ton Floor Load',
          'Hydraulic Docks',
          'Sprinkler System',
          'Trailer Turnaround',
          '24/7 Guard Patrol',
          '3-Phase Power',
        ],
        agent: agent2,
        neighborhoodScore: 85,
        investmentScore: 92,
        rentalYieldEstimate: 11.4,
        predictedPrice2027: 550000, // Predicted rent
        reviews: [
          PropertyReview(
            id: 'pr4',
            reviewerName: 'Ethio-Logistics Corp',
            rating: 4.8,
            comment: 'Perfect facility for storing container shipments. The loading docks operate flawlessly, and the 3-phase power stability has been completely steady.',
            isVerifiedBuyer: true,
          ),
        ],
      ),
      Property(
        id: 'p5',
        title: 'Bole Atlas Grade-A Premium Office',
        description: 'Superb premium corporate office floor located in the prestigious Atlas quarter. Ready for immediate move-in, designed with flexible acoustic partitioned cubicles, spacious conference boardroom with smart screens, modern server cabinets with dedicated cooling vents, private executive washroom suites, and kitchen lunchroom. Includes 4 registered underground parking spaces and high-sec security clearance.',
        type: PropertyType.office,
        price: 180000, // Monthly rental
        currency: 'ETB/mo',
        isNegotiable: true,
        areaSqm: 320,
        bedrooms: 0,
        bathrooms: 2,
        parkingSpaces: 4,
        floorNumber: 5,
        yearBuilt: 2023,
        address: 'Atlas Road, Office Floor 5, Bole',
        city: 'Addis Ababa',
        latitude: 9.0188,
        longitude: 38.7711,
        isFeatured: false,
        isNearby: true,
        postedDate: '1 week ago',
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
        ],
        floorPlans: [],
        amenities: [
          'Boardroom Screens',
          'Server Room AC',
          'Acoustic Partitions',
          'VIP Under-Parking',
          'Fiber Internet',
          'Direct Elevators',
        ],
        agent: agent2,
        neighborhoodScore: 96,
        investmentScore: 90,
        rentalYieldEstimate: 8.8,
        predictedPrice2027: 210000,
        reviews: [],
      ),
      Property(
        id: 'p6',
        title: 'Yeka Hills Panoramic Land Plot',
        description: 'Spectacular residential land plot situated on the prestigious crest of Yeka Hills. Features fully uninhibited, commanding panoramic views of the entire Addis Ababa valley. The plot has complete certified clearance, legally verified title deeds, perimeter stone foundation already built, water and power hookups connected, and pre-approved plans for a 3-story luxury modern residence. Secure diplomatic-grade neighbors.',
        type: PropertyType.land,
        price: 72000000,
        currency: 'ETB',
        isNegotiable: false,
        areaSqm: 1000,
        bedrooms: 0,
        bathrooms: 0,
        parkingSpaces: 0,
        floorNumber: 0,
        yearBuilt: 2026,
        address: 'Hillside Crest Route, Yeka',
        city: 'Addis Ababa',
        latitude: 9.0388,
        longitude: 38.8055,
        isFeatured: false,
        isNearby: false,
        postedDate: '2 weeks ago',
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
        ],
        floorPlans: [],
        amenities: [
          'Panoramic Views',
          'Title Deeds Cleared',
          'Stone Perimeter Built',
          'Water Hookup',
          'Power Hookup',
          'Diplomat Quarter',
        ],
        agent: agent2,
        neighborhoodScore: 94,
        investmentScore: 96,
        rentalYieldEstimate: 6.5,
        predictedPrice2027: 92000000,
        reviews: [],
      ),
    ]);

    // Initial bookmarks
    _favoriteIds.add('p1');
    _collections['Dream Villas']!.add('p1');
    _propertyNotes['p1'] = 'Checked Japan embassy proximity: exactly 200 meters. Extremely high-sec area.';
  }
}
