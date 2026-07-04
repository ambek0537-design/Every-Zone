import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/property.dart';
import 'property_detail_screen.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final RealEstateState _state = RealEstateState();
  String _activeTab = 'All Saved'; // 'All Saved' | 'Collections'
  
  // Create collection helper state
  final TextEditingController _collectionNameController = TextEditingController();
  String? _expandedNotesPropertyId;

  // Temporary text editor map for editing notes on the fly
  final Map<String, TextEditingController> _notesControllers = {};

  @override
  void initState() {
    super.initState();
    _state.addListener(_onStateChanged);
  }

  @override
  void dispose() {
    _state.removeListener(_onStateChanged);
    _collectionNameController.dispose();
    _notesControllers.forEach((_, controller) => controller.dispose());
    super.dispose();
  }

  void _onStateChanged() {
    if (mounted) setState(() {});
  }

  void _showCreateCollectionDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.background,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: AppColors.border),
          ),
          title: const Text('NEW EXCLUSIVE COLLECTION', style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.black)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('FOLDER NAME', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.border)),
                child: TextField(
                  controller: _collectionNameController,
                  style: const TextStyle(color: Colors.white, fontSize: 12),
                  decoration: const InputDecoration(
                    hintText: 'e.g., Bole Luxury Villas',
                    hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 10.5),
                    border: InputBorder.none,
                  ),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                _collectionNameController.clear();
                Navigator.pop(context);
              },
              child: const Text('CANCEL', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 9.5)),
            ),
            ElevatedButton(
              onPressed: () {
                final name = _collectionNameController.text.trim();
                if (name.isNotEmpty) {
                  _state.createCollection(name);
                  _collectionNameController.clear();
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Collection folder established successfully!'), backgroundColor: AppColors.success),
                  );
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldLight, foregroundColor: AppColors.background),
              child: const Text('CREATE', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 9.5, fontWeight: FontWeight.black)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // Fetch all favorited properties
    final favorites = _state.properties.where((p) => _state.favoriteIds.contains(p.id)).toList();
    final collections = _state.collections;

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
          'YOUR SAVE VAULT',
          style: TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.black,
            letterSpacing: 1.5,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Inner navigation tabs
            _buildVaultTabs(),
            const SizedBox(height: 12),

            Expanded(
              child: _activeTab == 'All Saved'
                  ? _buildAllSavedTab(favorites)
                  : _buildCollectionsTab(collections),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVaultTabs() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Row(
        children: ['All Saved', 'Collections'].map((tab) {
          final bool isAct = _activeTab == tab;
          return Expanded(
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _activeTab = tab;
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: isAct ? AppColors.goldLight : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: Text(
                  tab.toUpperCase(),
                  style: TextStyle(
                    fontFamily: 'JetBrains Mono',
                    color: isAct ? AppColors.background : AppColors.textSecondary,
                    fontSize: 9.5,
                    fontWeight: FontWeight.black,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAllSavedTab(List<Property> favorites) {
    if (favorites.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.favorite_border, color: AppColors.textMuted, size: 44),
              const SizedBox(height: 16),
              const Text('NO PROPERTIES SAVED YET', style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              const Text('Click the favorite icon on any property card to build your private premium collection list.', style: TextStyle(color: AppColors.textMuted, fontSize: 10), textAlign: TextAlign.center),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: favorites.length,
      itemBuilder: (context, index) {
        final prop = favorites[index];
        final bool isExpanded = _expandedNotesPropertyId == prop.id;
        final currentNotes = _state.propertyNotes[prop.id] ?? '';

        // Lazy initialize text controllers
        if (!_notesControllers.containsKey(prop.id)) {
          _notesControllers[prop.id] = TextEditingController(text: currentNotes);
        }

        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              // Property Row
              ListTile(
                contentPadding: const EdgeInsets.all(12),
                leading: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(prop.images[0], width: 70, height: 70, fit: BoxFit.cover),
                ),
                title: Text(prop.title, style: const TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(prop.address, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10), maxLines: 1, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Text(
                      '${prop.currency} ${prop.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                      style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11.5, fontWeight: FontWeight.black),
                    ),
                  ],
                ),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_forward_ios, color: Colors.white60, size: 14),
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => PropertyDetailScreen(property: prop)));
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 18),
                      onPressed: () {
                        _state.toggleFavorite(prop.id);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Removed from Private Vault.')),
                        );
                      },
                    ),
                  ],
                ),
              ),

              const Divider(color: AppColors.border, height: 1),

              // Expanding Custom Notes Drawer
              GestureDetector(
                onTap: () {
                  setState(() {
                    _expandedNotesPropertyId = isExpanded ? null : prop.id;
                  });
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  color: AppColors.card.withOpacity(0.5),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.edit_note, color: currentNotes.isNotEmpty ? AppColors.goldLight : AppColors.textMuted, size: 16),
                          const SizedBox(width: 8),
                          Text(
                            currentNotes.isNotEmpty ? 'READ / EDIT PERSONAL DOSSIER NOTES' : 'ADD SPECIAL LEGAL OR VISITING NOTES',
                            style: TextStyle(
                              fontFamily: 'JetBrains Mono',
                              color: currentNotes.isNotEmpty ? AppColors.goldLight : AppColors.textSecondary,
                              fontSize: 8.5,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      Icon(isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, color: AppColors.textMuted, size: 14),
                    ],
                  ),
                ),
              ),

              if (isExpanded)
                Container(
                  padding: const EdgeInsets.all(12),
                  color: AppColors.card,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.border)),
                        child: TextField(
                          controller: _notesControllers[prop.id],
                          maxLines: 3,
                          style: const TextStyle(color: Colors.white, fontSize: 11),
                          decoration: const InputDecoration(
                            hintText: 'e.g., Neighbors mention Bole water is constant, verify title deed with lawyer.',
                            hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 9.5),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          ElevatedButton(
                            onPressed: () {
                              final text = _notesControllers[prop.id]?.text.trim() ?? '';
                              _state.saveNotes(prop.id, text);
                              setState(() {
                                _expandedNotesPropertyId = null;
                              });
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Personal legal notes saved to cloud dossier.'), backgroundColor: AppColors.success),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.goldDark,
                              foregroundColor: AppColors.goldLight,
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              minimumSize: Size.zero,
                            ),
                            child: const Text('SAVE NOTE', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 8, fontWeight: FontWeight.black)),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildCollectionsTab(List<PropertyCollection> collections) {
    return Column(
      children: [
        // Create collection button
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: _showCreateCollectionDialog,
              icon: const Icon(Icons.create_new_folder_outlined, color: AppColors.goldLight, size: 16),
              label: const Text('CREATE NEW FOLDER', style: TextStyle(color: AppColors.goldLight, fontSize: 9.5, fontFamily: 'JetBrains Mono', fontWeight: FontWeight.black)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppColors.goldMedium, width: 1),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ),

        // List
        Expanded(
          child: collections.isEmpty
              ? const Center(child: Text('Create collection folder above to organize properties.', style: TextStyle(color: AppColors.textMuted, fontSize: 10)))
              : ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.all(16),
                  itemCount: collections.length,
                  itemBuilder: (context, index) {
                    final col = collections[index];
                    return _buildCollectionFolderCard(col);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildCollectionFolderCard(PropertyCollection col) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            leading: const Icon(Icons.folder, color: AppColors.goldLight, size: 36),
            title: Text(col.name, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black)),
            subtitle: Text('${col.propertyIds.length} properties categorized', style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
            trailing: IconButton(
              icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 18),
              onPressed: () {
                _state.deleteCollection(col.id);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Collection deleted.')),
                );
              },
            ),
          ),

          // Show properties inside this collection if expanded
          if (col.propertyIds.isNotEmpty) ...[
            const Divider(color: AppColors.border, height: 1),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: SizedBox(
                height: 64,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: col.propertyIds.length,
                  itemBuilder: (context, pIdx) {
                    final pId = col.propertyIds[pIdx];
                    final p = _state.properties.firstWhere((p) => p.id == pId, orElse: () => _state.properties[0]);
                    return Container(
                      width: 140,
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.border)),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: Image.network(p.images[0], width: 32, height: 32, fit: BoxFit.cover),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              p.title,
                              style: const TextStyle(color: Colors.white, fontSize: 8.5, fontWeight: FontWeight.bold),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          IconButton(
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            icon: const Icon(Icons.close, color: AppColors.error, size: 10),
                            onPressed: () {
                              _state.removeFromCollection(col.id, pId);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Removed from folder category.')),
                              );
                            },
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
          ] else
            const Padding(
              padding: EdgeInsets.only(bottom: 12),
              child: Text('No property items categorized. Save houses to folders on details screen.', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5)),
            ),
        ],
      ),
    );
  }
}
