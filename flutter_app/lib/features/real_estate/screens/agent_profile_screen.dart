import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/property.dart';
import 'property_detail_screen.dart';

class AgentProfileScreen extends StatefulWidget {
  final RealEstateAgent agent;

  const AgentProfileScreen({super.key, required this.agent});

  @override
  State<AgentProfileScreen> createState() => _AgentProfileScreenState();
}

class _AgentProfileScreenState extends State<AgentProfileScreen> {
  final RealEstateState _state = RealEstateState();
  final List<String> _helpfulReviewIds = [];
  final List<String> _reportedReviewIds = [];

  void _showActionToast(String msg, Color bg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: bg, duration: const Duration(seconds: 1)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final agent = widget.agent;
    
    // Fetch listings by this agent
    final listings = _state.properties.where((p) => p.agent.id == agent.id).toList();

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
          'VETTED BROKER CREDENTIALS',
          style: TextStyle(
            color: Colors.white,
            fontSize: 11,
            fontWeight: FontWeight.black,
            letterSpacing: 1.5,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hero Profile Info Card
              _buildProfileHeaderCard(agent),

              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Agent bio
                    _buildSectionHeader('PROFESSIONAL DOSSIER'),
                    const SizedBox(height: 8),
                    Text(
                      agent.bio,
                      style: const TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.45),
                    ),
                    const SizedBox(height: 24),

                    // Active listings by this agent
                    _buildSectionHeader('ACTIVE MANAGED PROPERTY DEEDS (${listings.length})'),
                    const SizedBox(height: 12),
                    if (listings.isEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
                        child: const Text('Agent has no active listings cleared by federal registry currently.', style: TextStyle(color: AppColors.textMuted, fontSize: 9.5), textAlign: TextAlign.center),
                      )
                    else
                      SizedBox(
                        height: 190,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          physics: const BouncingScrollPhysics(),
                          itemCount: listings.length,
                          itemBuilder: (context, idx) {
                            final p = listings[idx];
                            return _buildAgentListingCard(p);
                          },
                        ),
                      ),
                    const SizedBox(height: 28),

                    // Agent Reviews list
                    _buildSectionHeader('CLIENT ADVISOR REVIEW LOGS (${agent.reviews.length})'),
                    const SizedBox(height: 12),
                    _buildAgentReviewsList(agent),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontFamily: 'JetBrains Mono',
        fontSize: 10,
        fontWeight: FontWeight.black,
        color: AppColors.goldLight,
        letterSpacing: 1.5,
      ),
    );
  }

  Widget _buildProfileHeaderCard(RealEstateAgent agent) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(agent.photoUrl, width: 72, height: 72, fit: BoxFit.cover),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(agent.name, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.black)),
                        const SizedBox(width: 6),
                        const Icon(Icons.verified, color: AppColors.goldLight, size: 16),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('License clearance: ${agent.licenseNumber}', style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 9)),
                    const SizedBox(height: 2),
                    Text('Specializes: ${agent.specializations.join(', ')}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold)),
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 20),
          const Divider(color: AppColors.border, height: 1),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildHeaderStat('EXPERIENCE', '${agent.yearsExperience} yrs'),
              _buildHeaderStat('RATING', '${agent.rating} ★'),
              _buildHeaderStat('RESPONSE', agent.responseTime),
              _buildHeaderStat('TRUST VALUE', '${agent.trustScore}%'),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _showActionToast('Securing private audio call with Broker...', AppColors.success),
                  icon: const Icon(Icons.phone, size: 14),
                  label: const Text('CALL HOTLINE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldLight, foregroundColor: AppColors.background),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _showActionToast('Launching secure messaging sandbox...', AppColors.goldMedium),
                  icon: const Icon(Icons.forum_outlined, size: 14),
                  label: const Text('ENCRYPTED MESSAGE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(side: const BorderSide(color: AppColors.border)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderStat(String label, String val) {
    return Column(
      children: [
        Text(val, style: const TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 13, fontWeight: FontWeight.black)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildAgentListingCard(Property p) {
    final String formattedPrice = p.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');

    return GestureDetector(
      onTap: () {
        Navigator.push(context, MaterialPageRoute(builder: (_) => PropertyDetailScreen(property: p)));
      },
      child: Container(
        width: 160,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(11)),
              child: Image.network(p.images[0], height: 90, width: double.infinity, fit: BoxFit.cover),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(p.title, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                  Text(p.address, style: const TextStyle(color: AppColors.textMuted, fontSize: 8), maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 6),
                  Text('ETB $formattedPrice', style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.bold)),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildAgentReviewsList(RealEstateAgent agent) {
    if (agent.reviews.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
        child: const Text('No written client reviews filed on broker license registry currently.', style: TextStyle(color: AppColors.textMuted, fontSize: 9.5), textAlign: TextAlign.center),
      );
    }

    return Column(
      children: agent.reviews.map((rev) {
        final bool isHelpful = _helpfulReviewIds.contains(rev.id);
        final bool isReported = _reportedReviewIds.contains(rev.id);

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.border)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.account_circle, color: AppColors.textMuted, size: 14),
                      const SizedBox(width: 6),
                      Text(rev.reviewerName, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  Row(
                    children: List.generate(5, (starIdx) {
                      return Icon(Icons.star, color: starIdx < rev.rating ? AppColors.goldLight : Colors.white12, size: 10);
                    }),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              if (rev.isVerifiedBuyer)
                Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: Colors.green.withOpacity(0.12), borderRadius: BorderRadius.circular(4)),
                  child: const Text('VERIFIED SECURE BUYER', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.success, fontSize: 7, fontWeight: FontWeight.bold)),
                ),
              Text(rev.comment, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, height: 1.4)),
              const SizedBox(height: 12),
              const Divider(color: AppColors.border, height: 1),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  GestureDetector(
                    onTap: () {
                      if (isHelpful) return;
                      setState(() {
                        _helpfulReviewIds.add(rev.id);
                        rev.helpfulCount++;
                      });
                      _showActionToast('Review verified as helpful.', AppColors.success);
                    },
                    child: Row(
                      children: [
                        Icon(Icons.thumb_up_alt_outlined, color: isHelpful ? AppColors.goldLight : AppColors.textMuted, size: 11),
                        const SizedBox(width: 6),
                        Text('Helpful (${rev.helpfulCount})', style: TextStyle(fontFamily: 'JetBrains Mono', color: isHelpful ? AppColors.goldLight : AppColors.textMuted, fontSize: 8.5)),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      if (isReported) return;
                      setState(() {
                        _reportedReviewIds.add(rev.id);
                      });
                      _showActionToast('Report logged on review broker license entry.', AppColors.error);
                    },
                    child: Row(
                      children: [
                        Icon(Icons.flag_outlined, color: isReported ? AppColors.error : AppColors.textMuted, size: 11),
                        const SizedBox(width: 4),
                        Text(isReported ? 'Reported' : 'Report', style: TextStyle(fontFamily: 'JetBrains Mono', color: isReported ? AppColors.error : AppColors.textMuted, fontSize: 8.5)),
                      ],
                    ),
                  ),
                ],
              )
            ],
          ),
        );
      }).toList(),
    );
  }
}
