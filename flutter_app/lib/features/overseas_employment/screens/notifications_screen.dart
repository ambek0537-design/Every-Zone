import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/job.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
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

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'success': return AppColors.success;
      case 'info': return Colors.blue;
      case 'warning': return Colors.orange;
      case 'alert': return AppColors.error;
      default: return AppColors.goldLight;
    }
  }

  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'success': return Icons.verified_user_outlined;
      case 'info': return Icons.calendar_month_outlined;
      case 'warning': return Icons.medical_services_outlined;
      case 'alert': return Icons.warning_amber_outlined;
      default: return Icons.notifications_active_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final list = _state.notifications;

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
          'EMPLOYMENT BROADCASTS',
          style: TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.black,
            letterSpacing: 1.5,
          ),
        ),
        actions: [
          if (list.isNotEmpty)
            TextButton(
              onPressed: () {
                _state.clearNotifications();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Cleared all notifications.')),
                );
              },
              child: const Text('CLEAR ALL', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold, fontFamily: 'JetBrains Mono')),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: list.isEmpty
            ? _buildEmptyState()
            : ListView.builder(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.all(16),
                itemCount: list.length,
                itemBuilder: (context, index) {
                  final notif = list[index];
                  final color = _getNotificationColor(notif.type);
                  final icon = _getNotificationIcon(notif.type);
                  
                  return GestureDetector(
                    onTap: () {
                      _state.markNotificationRead(notif.id);
                    },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: notif.isRead ? AppColors.surface : AppColors.card,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: notif.isRead ? AppColors.border : color.withOpacity(0.3),
                          width: notif.isRead ? 1.0 : 1.5,
                        ),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
                            child: Icon(icon, color: color, size: 18),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.between,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        notif.title,
                                        style: TextStyle(
                                          color: notif.isRead ? Colors.white70 : Colors.white,
                                          fontSize: 12,
                                          fontWeight: notif.isRead ? FontWeight.bold : FontWeight.black,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    if (!notif.isRead)
                                      Container(
                                        width: 6,
                                        height: 6,
                                        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                                      )
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  notif.body,
                                  style: TextStyle(color: notif.isRead ? AppColors.textMuted : AppColors.textSecondary, fontSize: 10.5, height: 1.35),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    const Icon(Icons.access_time, color: AppColors.textMuted, size: 10),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${notif.timestamp.hour}:${notif.timestamp.minute.toString().padLeft(2, '0')}',
                                      style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 9),
                                    )
                                  ],
                                )
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return const Center(
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.notifications_off_outlined, size: 44, color: AppColors.textMuted),
            SizedBox(height: 16),
            Text(
              'NO BROADCASTS FOUND',
              style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.5),
            ),
            SizedBox(height: 6),
            Text(
              'Your incoming notifications and work clearances are currently silent.',
              style: TextStyle(color: AppColors.textMuted, fontSize: 11),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
