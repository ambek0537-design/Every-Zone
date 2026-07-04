import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/job.dart';
import 'application_flow_screen.dart';
import 'agency_profile_screen.dart';

class JobDetailScreen extends StatefulWidget {
  final Job job;
  final bool initiateApplicationImmediately;

  const JobDetailScreen({
    super.key,
    required this.job,
    this.initiateApplicationImmediately = false,
  });

  @override
  State<JobDetailScreen> createState() => _JobDetailScreenState();
}

class _JobDetailScreenState extends State<JobDetailScreen> {
  final OverseasState _state = OverseasState();
  bool _isSaved = false;

  @override
  void initState() {
    super.initState();
    _isSaved = _state.savedJobIds.contains(widget.job.id);
    _state.addListener(_onStateChanged);

    if (widget.initiateApplicationImmediately) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _launchApplicationFlow();
      });
    }
  }

  @override
  void dispose() {
    _state.removeListener(_onStateChanged);
    super.dispose();
  }

  void _onStateChanged() {
    if (mounted) {
      setState(() {
        _isSaved = _state.savedJobIds.contains(widget.job.id);
      });
    }
  }

  void _toggleSave() {
    _state.toggleSaveJob(widget.job.id);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_isSaved ? 'Job removed from saved list.' : 'Job saved to premium bookmarks!'),
        backgroundColor: AppColors.goldDark,
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void _shareJob() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'SHARE EMPLOYMENT SCHEME',
                style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.2),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildShareOption(Icons.message, 'Telegram'),
                  _buildShareOption(Icons.chat_bubble, 'WhatsApp'),
                  _buildShareOption(Icons.copy, 'Copy Link'),
                  _buildShareOption(Icons.more_horiz, 'More'),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  Widget _buildShareOption(IconData icon, String label) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$label shared successfully.'),
            backgroundColor: AppColors.success,
          ),
        );
      },
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.border),
            ),
            child: Icon(icon, color: AppColors.goldLight, size: 20),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
        ],
      ),
    );
  }

  void _launchApplicationFlow() {
    _state.startApplication(widget.job);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const ApplicationFlowScreen()),
    );
  }

  void _showContactAgencyDialog(String method) {
    final title = method == 'message' ? 'Secure Encryption Chat' : 'Premium VoIP Hotlink';
    final icon = method == 'message' ? Icons.forum : Icons.phone_in_talk;
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.card,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: AppColors.border)),
          title: Row(
            children: [
              Icon(icon, color: AppColors.goldLight),
              const SizedBox(width: 10),
              Text(title.toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black)),
            ],
          ),
          content: Text(
            method == 'message'
                ? 'Initiating verified secured channel chat with ${widget.job.agency.name}. Your document vault credentials will be request-linked upon consent.'
                : 'Connecting high-definition fiber line to ${widget.job.agency.name} headquarter: ${widget.job.agency.phoneNumber}.',
            style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, height: 1.4),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('DISMISS', style: TextStyle(color: AppColors.textMuted)),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(method == 'message' ? 'Session initialized successfully.' : 'Dialing active...'),
                    backgroundColor: AppColors.success,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium, foregroundColor: AppColors.background),
              child: const Text('CONNECT NOW', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
            )
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final job = widget.job;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Content Scroll
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Hero Back banner & Flag & Company details
              SliverAppBar(
                expandedHeight: 220,
                backgroundColor: AppColors.background,
                elevation: 0,
                scrolledUnderElevation: 0,
                pinned: true,
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
                    margin: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: Colors.black45, shape: BoxShape.circle),
                    child: IconButton(
                      icon: Icon(
                        _isSaved ? Icons.bookmark : Icons.bookmark_border,
                        color: _isSaved ? AppColors.goldLight : Colors.white,
                        size: 20,
                      ),
                      onPressed: _toggleSave,
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: Colors.black45, shape: BoxShape.circle),
                    child: IconButton(
                      icon: const Icon(Icons.share, color: Colors.white, size: 18),
                      onPressed: _shareJob,
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      // Destination Country Backdrop image
                      Image.network(
                        'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&q=80&w=600',
                        fit: BoxFit.cover,
                      ),
                      Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.black85, Colors.transparent, Colors.black85],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                        ),
                      ),
                      // Country Flag Overlay
                      Positioned(
                        right: 20,
                        bottom: 20,
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: const BoxDecoration(color: Colors.black45, shape: BoxShape.circle),
                          child: Text(job.countryFlag, style: const TextStyle(fontSize: 32)),
                        ),
                      )
                    ],
                  ),
                ),
              ),

              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title & Company
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(14),
                            child: Image.network(
                              job.companyLogo,
                              width: 54,
                              height: 54,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(color: AppColors.card, child: const Icon(Icons.business, color: AppColors.goldLight)),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  job.title,
                                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.black, height: 1.2),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  job.company,
                                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                                ),
                              ],
                            ),
                          )
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Essential contract badges
                      _buildContractSpecificationsGrid(job),
                      const SizedBox(height: 24),

                      // Core requirements bullet cards
                      _buildHeader('JOB QUALIFICATIONS & REQUIREMENTS'),
                      const SizedBox(height: 10),
                      _buildCardContainer(
                        Column(
                          children: job.requirements.map((req) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Icon(Icons.check_circle_outline, color: AppColors.goldLight, size: 16),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Text(
                                      req,
                                      style: const TextStyle(color: AppColors.textPrimary, fontSize: 11.5, height: 1.35),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Core responsibilities
                      _buildHeader('PRIMARY RESPONSIBILITIES'),
                      const SizedBox(height: 10),
                      _buildCardContainer(
                        Column(
                          children: job.responsibilities.map((resp) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Icon(Icons.arrow_right_alt, color: AppColors.success, size: 18),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      resp,
                                      style: const TextStyle(color: AppColors.textPrimary, fontSize: 11.5, height: 1.35),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Verified documents needed
                      _buildHeader('MANDATORY DOCUMENTS NEEDED'),
                      const SizedBox(height: 10),
                      _buildCardContainer(
                        Column(
                          children: job.documentsNeeded.map((doc) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              child: Row(
                                children: [
                                  const Icon(Icons.file_present_outlined, color: AppColors.textSecondary, size: 16),
                                  const SizedBox(width: 10),
                                  Text(
                                    doc,
                                    style: const TextStyle(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Agency details profile card
                      _buildHeader('VERIFIED RECRUITING AGENCY'),
                      const SizedBox(height: 10),
                      _buildAgencyCard(job.agency),
                      const SizedBox(height: 100), // Reserve scroll space for sticky bottom
                    ],
                  ),
                ),
              )
            ],
          ),

          // Sticky bottom bar
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: _buildStickyBottomAction(),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(String title) {
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

  Widget _buildCardContainer(Widget child) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: child,
    );
  }

  Widget _buildContractSpecificationsGrid(Job job) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
      childAspectRatio: 2.2,
      children: [
        _buildSpecCard('MONTHLY BUDGET', '${job.currency} ${job.salary}', Icons.monetization_on, AppColors.success),
        _buildSpecCard('CONTRACT LENGTH', job.contractLength, Icons.history_edu, AppColors.goldMedium),
        _buildSpecCard('WORKING HOURS', job.workingHours, Icons.schedule, Colors.blue),
        _buildSpecCard('DAYS OFF / WEEK', job.daysOff, Icons.weekend, Colors.purple),
        _buildSpecCard('ACCOMMODATION', job.accommodation ? 'Included' : 'Self-paid', Icons.home, Colors.teal),
        _buildSpecCard('AIR TICKETS', job.airTicketIncluded ? 'Sponsored' : 'Self-paid', Icons.flight, Colors.orange),
      ],
    );
  }

  Widget _buildSpecCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 16),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 7, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildAgencyCard(Agency agency) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.goldDark.withOpacity(0.35)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  agency.logoUrl,
                  width: 50,
                  height: 50,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          agency.name,
                          style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.verified, color: AppColors.goldLight, size: 14),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Gov License: ${agency.licenseNumber}',
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 9.5, fontFamily: 'JetBrains Mono'),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.star, color: AppColors.goldLight, size: 12),
                        const SizedBox(width: 4),
                        Text(
                          '${agency.rating} (${agency.completedPlacements}+ placements)',
                          style: const TextStyle(color: AppColors.textSecondary, fontSize: 10, fontFamily: 'JetBrains Mono'),
                        ),
                      ],
                    ),
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 14),
          const Divider(color: AppColors.border, height: 1),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppColors.border),
                ) != null
                    ? TextButton.icon(
                        onPressed: () => _showContactAgencyDialog('message'),
                        icon: const Icon(Icons.chat_bubble_outline, color: AppColors.goldLight, size: 14),
                        label: const Text('SECURE MSG', style: TextStyle(color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.bold)),
                        style: TextButton.styleFrom(
                          backgroundColor: AppColors.card,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10), side: const BorderSide(color: AppColors.border)),
                        ),
                      )
                    : const SizedBox.shrink(),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: TextButton.icon(
                  onPressed: () => _showContactAgencyDialog('call'),
                  icon: const Icon(Icons.phone_outlined, color: Colors.white, size: 14),
                  label: const Text('VOIP CALL', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  style: TextButton.styleFrom(
                    backgroundColor: AppColors.card,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10), side: const BorderSide(color: AppColors.border)),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => AgencyProfileScreen(agency: agency)),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppColors.goldDark.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.goldMedium.withOpacity(0.3)),
                  ),
                  child: const Text('PROFILE', style: TextStyle(color: AppColors.goldLight, fontSize: 9.5, fontWeight: FontWeight.black)),
                ),
              )
            ],
          )
        ],
      ),
    );
  }

  Widget _buildStickyBottomAction() {
    return Container(
      padding: const EdgeInsets.only(left: 20, right: 20, top: 16, bottom: 24),
      decoration: BoxDecoration(
        color: AppColors.surface.withOpacity(0.85),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: const BorderBorder(top: BorderSide(color: AppColors.border)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 15,
            offset: const Offset(0, -5),
          )
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('APPLICATION CLOSING', style: TextStyle(color: AppColors.textMuted, fontSize: 7, fontWeight: FontWeight.bold)),
              const SizedBox(height: 2),
              Text(
                widget.job.deadline,
                style: const TextStyle(color: AppColors.error, fontSize: 12, fontWeight: FontWeight.bold, fontFamily: 'JetBrains Mono'),
              ),
            ],
          ),
          const SizedBox(width: 20),
          Expanded(
            child: SizedBox(
              height: 48,
              child: ElevatedButton(
                onPressed: _launchApplicationFlow,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.goldLight,
                  foregroundColor: AppColors.background,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 4,
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('SECURE TRANSMIT APPLY', style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 0.5)),
                    SizedBox(width: 8),
                    Icon(Icons.send_rounded, size: 14),
                  ],
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}

// Custom BorderBorder class to overcome border issue in older SDKs if any
class BorderBorder extends Border {
  const BorderBorder({super.top, super.bottom});
}
