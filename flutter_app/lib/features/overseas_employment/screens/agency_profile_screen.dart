import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/job.dart';
import 'job_detail_screen.dart';

class AgencyProfileScreen extends StatefulWidget {
  final Agency agency;

  const AgencyProfileScreen({super.key, required this.agency});

  @override
  State<AgencyProfileScreen> createState() => _AgencyProfileScreenState();
}

class _AgencyProfileScreenState extends State<AgencyProfileScreen> {
  final OverseasState _state = OverseasState();
  bool _isFollowing = false;

  void _showActionToast(String msg, Color bg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: bg, duration: const Duration(seconds: 1)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final agency = widget.agency;
    // Filter jobs belonging to this agency
    final openJobs = _state.jobs.where((j) => j.agency.id == agency.id).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Parallax Cover App Bar
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppColors.background,
            elevation: 0,
            leading: Container(
              margin: const EdgeInsets.all(8),
              decoration: const BoxDecoration(color: Colors.black45, shape: BoxShape.circle),
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            actions: [
              Container(
                margin: const EdgeInsets.all(8),
                decoration: const BoxDecoration(color: Colors.black45, shape: BoxShape.circle),
                child: IconButton(
                  icon: const Icon(Icons.more_vert, color: Colors.white),
                  onPressed: () {},
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    agency.coverUrl,
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.black54, Colors.transparent, Colors.black90],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Main Profile details
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Agency Header Info
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      // Logo Frame
                      Transform.translate(
                        offset: const Offset(0, -30),
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: AppColors.card,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: AppColors.border, width: 2),
                            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 10)],
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: Image.network(
                              agency.logoUrl,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    agency.name,
                                    style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.black),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Icon(Icons.verified, color: AppColors.goldLight, size: 16),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'License: ${agency.licenseNumber}',
                              style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 9.5),
                            ),
                            const SizedBox(height: 4),
                          ],
                        ),
                      )
                    ],
                  ),
                  
                  // Stats row
                  _buildStatsRow(agency),
                  const SizedBox(height: 20),

                  // About tab
                  _buildSectionHeader('ABOUT THE AGENCY'),
                  const SizedBox(height: 8),
                  Text(
                    agency.about,
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
                  ),
                  const SizedBox(height: 24),

                  // Policies Tab
                  _buildSectionHeader('ETHICAL PLACEMENT POLICIES'),
                  const SizedBox(height: 8),
                  _buildPoliciesList(agency.policies),
                  const SizedBox(height: 24),

                  // Contact actions panel (Message, Call, Directions)
                  _buildSectionHeader('DIRECT CHANNELS & GPS LOCATION'),
                  const SizedBox(height: 10),
                  _buildContactPanel(agency),
                  const SizedBox(height: 24),

                  // Open Vacancies Section
                  _buildSectionHeader('OPEN VACANCIES (${openJobs.length})'),
                  const SizedBox(height: 10),
                  _buildOpenJobsList(openJobs),
                  const SizedBox(height: 24),

                  // Videos & Posts stream
                  _buildSectionHeader('AGENCY BRIEFINGS & STREAM UPDATES'),
                  const SizedBox(height: 10),
                  _buildMediaStream(agency),
                  const SizedBox(height: 24),

                  // Reviews
                  _buildSectionHeader('VERIFIED APPLICANT REVIEWS'),
                  const SizedBox(height: 10),
                  _buildReviewsSection(agency.reviews),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          )
        ],
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

  Widget _buildStatsRow(Agency agency) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatColumn('Completed', '${agency.completedPlacements}+', Icons.task_alt),
          _buildStatColumn('Rating', '${agency.rating} ★', Icons.star_border),
          _buildStatColumn('Followers', '${(agency.followers / 1000).toStringAsFixed(1)}k', Icons.people_outline),
          // Follow button action
          GestureDetector(
            onTap: () {
              setState(() {
                _isFollowing = !_isFollowing;
              });
              _showActionToast(
                _isFollowing ? 'Following agency updates!' : 'Unfollowed agency.',
                _isFollowing ? AppColors.success : AppColors.goldDark,
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: _isFollowing ? Colors.transparent : AppColors.goldLight,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.goldLight),
              ),
              child: Text(
                _isFollowing ? 'FOLLOWED' : 'FOLLOW',
                style: TextStyle(
                  color: _isFollowing ? AppColors.goldLight : AppColors.background,
                  fontSize: 9,
                  fontWeight: FontWeight.black,
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildStatColumn(String label, String value, IconData icon) {
    return Column(
      children: [
        Row(
          children: [
            Icon(icon, color: AppColors.goldLight, size: 12),
            const SizedBox(width: 4),
            Text(
              value,
              style: const TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.black),
            ),
          ],
        ),
        const SizedBox(height: 3),
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 8)),
      ],
    );
  }

  Widget _buildPoliciesList(List<String> policies) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.border)),
      child: Column(
        children: policies.map((p) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.shield_outlined, color: AppColors.success, size: 14),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(p, style: const TextStyle(color: AppColors.textPrimary, fontSize: 11, height: 1.35)),
                )
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildContactPanel(Agency agency) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.border)),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _buildContactButton(Icons.forum_outlined, 'SECURE MSG', () {
                  _showActionToast('Encryption chat loaded for ${agency.name}', AppColors.success);
                }),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildContactButton(Icons.phone_outlined, 'DIAL HOTLINE', () {
                  _showActionToast('Dialing ${agency.phoneNumber}...', AppColors.goldMedium);
                }),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildContactButton(Icons.directions_outlined, 'DIRECTIONS', () {
                  _showActionToast('Calculating routing to: ${agency.branches[0]}...', Colors.blue);
                }),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(color: AppColors.border, height: 1),
          const SizedBox(height: 8),
          _buildInfoRow('MAIN HUB', agency.location, Icons.location_on_outlined),
          _buildInfoRow('BRANCHES', agency.branches.join(' | '), Icons.account_tree_outlined),
          _buildInfoRow('EMAIL', agency.email, Icons.email_outlined),
        ],
      ),
    );
  }

  Widget _buildContactButton(IconData icon, String label, VoidCallback onTap) {
    return TextButton.icon(
      onPressed: onTap,
      icon: Icon(icon, color: AppColors.goldLight, size: 14),
      label: Text(label, style: const TextStyle(color: Colors.white, fontSize: 9.5, fontWeight: FontWeight.bold)),
      style: TextButton.styleFrom(
        backgroundColor: AppColors.card,
        padding: const EdgeInsets.symmetric(vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8), side: const BorderSide(color: AppColors.border)),
      ),
    );
  }

  Widget _buildInfoRow(String label, String val, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppColors.textMuted, size: 14),
          const SizedBox(width: 8),
          Text(
            '$label: ',
            style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 9.5, fontWeight: FontWeight.bold),
          ),
          Expanded(
            child: Text(
              val,
              style: const TextStyle(color: AppColors.textPrimary, fontSize: 10),
              overflow: TextOverflow.ellipsis,
            ),
          )
        ],
      ),
    );
  }

  Widget _buildOpenJobsList(List<Job> jobs) {
    if (jobs.isEmpty) {
      return const Text('No jobs currently open.', style: TextStyle(color: AppColors.textMuted, fontSize: 11));
    }
    return Column(
      children: jobs.map((job) {
        return GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => JobDetailScreen(job: job)),
            );
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Text(job.countryFlag, style: const TextStyle(fontSize: 20)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(job.title, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
                      Text(job.company, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
                    ],
                  ),
                ),
                Text(
                  '${job.currency} ${job.salary}',
                  style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.success, fontSize: 11.5, fontWeight: FontWeight.bold),
                )
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildMediaStream(Agency agency) {
    return Column(
      children: agency.posts.map((post) {
        return Container(
          width: double.infinity,
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.stream, color: AppColors.goldLight, size: 14),
                  const SizedBox(width: 6),
                  const Text('BROADCAST POST', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8.5, fontWeight: FontWeight.bold)),
                  const Spacer(),
                  const Text('Recently', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5)),
                ],
              ),
              const SizedBox(height: 8),
              Text(post, style: const TextStyle(color: AppColors.textPrimary, fontSize: 11, height: 1.4)),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildReviewsSection(List<String> reviews) {
    return Column(
      children: reviews.map((r) {
        return Container(
          width: double.infinity,
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.account_circle_outlined, color: AppColors.textSecondary, size: 16),
                  const SizedBox(width: 8),
                  const Text('Verified Every-zone Applicant', style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
                  const Spacer(),
                  Row(
                    children: List.generate(5, (_) => const Icon(Icons.star, color: AppColors.goldLight, size: 8)),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text('"$r"', style: const TextStyle(color: AppColors.textSecondary, fontSize: 10.5, fontStyle: FontStyle.italic)),
            ],
          ),
        );
      }).toList(),
    );
  }
}
