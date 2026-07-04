import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/job.dart';

class ApplicationStatusScreen extends StatefulWidget {
  const ApplicationStatusScreen({super.key});

  @override
  State<ApplicationStatusScreen> createState() => _ApplicationStatusScreenState();
}

class _ApplicationStatusScreenState extends State<ApplicationStatusScreen> {
  final OverseasState _state = OverseasState();

  @override
  void initState() {
    super.initState();
    _state.addListener(_onStateChanged);
  }

  @override
  void dispose() {
    _state.removeListener(_onStateChanged);
    super.dispose();
  }

  void _onStateChanged() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final applications = _state.applications;

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
          'DOSSIER APPLICATION TRACKER',
          style: TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.black,
            letterSpacing: 1.5,
          ),
        ),
      ),
      body: SafeArea(
        child: applications.isEmpty
            ? _buildEmptyState()
            : ListView.builder(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.all(16),
                itemCount: applications.length,
                itemBuilder: (context, index) {
                  final jobId = applications.keys.elementAt(index);
                  final steps = applications[jobId]!;
                  final job = _state.jobs.firstWhere((j) => j.id == jobId);
                  return _buildTrackerCard(job, steps);
                },
              ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: AppColors.surface, shape: BoxShape.circle, border: Border.all(color: AppColors.border)),
              child: const Icon(Icons.timeline_outlined, size: 48, color: AppColors.goldLight),
            ),
            const SizedBox(height: 24),
            const Text(
              'NO ACTIVE TRACKING TIMELINE',
              style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.5),
            ),
            const SizedBox(height: 10),
            const Text(
              'You haven\'t transmitted any application dossiers yet. Once you submit, your secure progress will render here.',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium, foregroundColor: AppColors.background),
              child: const Text('EXPLORE VACANT SCHEMES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrackerCard(Job job, List<ApplicationStatusStep> steps) {
    // Determine the active step (first step that is not completed, or the last one if all are completed)
    int activeIndex = steps.indexWhere((s) => !s.isCompleted);
    if (activeIndex == -1) activeIndex = steps.length - 1;

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Job Card Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              border: const Border(bottom: BorderSide(color: AppColors.border)),
            ),
            child: Row(
              children: [
                Text(job.countryFlag, style: const TextStyle(fontSize: 28)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(job.title, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 2),
                      Text(job.company, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.goldDark.withOpacity(0.15),
                    border: Border.all(color: AppColors.goldMedium.withOpacity(0.3)),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    steps[activeIndex].status.toUpperCase(),
                    style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8.5, fontWeight: FontWeight.bold),
                  ),
                )
              ],
            ),
          ),

          // Timeline body
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'INTERACTION STATUS TIMELINE',
                  style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                
                // Timeline widget list
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: steps.length,
                  itemBuilder: (context, index) {
                    final step = steps[index];
                    final isDone = step.isCompleted || index < activeIndex;
                    final isCurrent = index == activeIndex;
                    
                    return _buildTimelineNode(
                      title: step.status,
                      date: step.date,
                      desc: step.description,
                      notes: step.notes,
                      isDone: isDone,
                      isCurrent: isCurrent,
                      isLast: index == steps.length - 1,
                    );
                  },
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildTimelineNode({
    required String title,
    required String date,
    required String desc,
    required String notes,
    required bool isDone,
    required bool isCurrent,
    required bool isLast,
  }) {
    Color nodeColor = AppColors.border;
    if (isDone) nodeColor = AppColors.success;
    if (isCurrent) nodeColor = AppColors.goldLight;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Left timeline node track
        Column(
          children: [
            Container(
              width: 16,
              height: 16,
              decoration: BoxDecoration(
                color: isCurrent ? AppColors.background : nodeColor,
                shape: BoxShape.circle,
                border: Border.all(
                  color: nodeColor,
                  width: isCurrent ? 4 : 1.5,
                ),
                boxShadow: isCurrent
                    ? [BoxShadow(color: AppColors.goldLight.withOpacity(0.3), blurRadius: 6)]
                    : null,
              ),
              child: isDone && !isCurrent
                  ? const Icon(Icons.check, size: 10, color: AppColors.background)
                  : null,
            ),
            if (!isLast)
              Container(
                width: 1.5,
                height: isCurrent ? 120 : 65,
                color: isDone ? AppColors.success : AppColors.border,
              )
          ],
        ),
        const SizedBox(width: 16),
        // Right description details
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(top: 1),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        color: isCurrent ? AppColors.goldLight : (isDone ? Colors.white : AppColors.textMuted),
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: Colors.white05, borderRadius: BorderRadius.circular(4)),
                      child: Text(
                        date,
                        style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  desc,
                  style: TextStyle(color: isDone ? AppColors.textSecondary : AppColors.textMuted, fontSize: 10.5),
                ),
                
                // Agency Notes collapsible area
                if (isCurrent) ...[
                  const SizedBox(height: 10),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.card,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.goldDark.withOpacity(0.2)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.assignment_ind_outlined, color: AppColors.goldLight, size: 12),
                            SizedBox(width: 6),
                            Text('OFFICIAL AGENCY INSTRUCTIONS', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 8, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          notes,
                          style: const TextStyle(color: AppColors.textPrimary, fontSize: 10, height: 1.35),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 16),
              ],
            ),
          ),
        )
      ],
    );
  }
}
