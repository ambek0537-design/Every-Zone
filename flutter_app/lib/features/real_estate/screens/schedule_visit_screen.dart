import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/property.dart';

class ScheduleVisitScreen extends StatefulWidget {
  final String? propertyId;
  final String? propertyTitle;
  final String? agentName;

  const ScheduleVisitScreen({
    super.key,
    this.propertyId,
    this.propertyTitle,
    this.agentName,
  });

  @override
  State<ScheduleVisitScreen> createState() => _ScheduleVisitScreenState();
}

class _ScheduleVisitScreenState extends State<ScheduleVisitScreen> {
  final RealEstateState _state = RealEstateState();

  // Active form parameters
  late String _selectedPropertyId;
  late String _selectedPropertyTitle;
  late String _selectedAgentName;

  DateTime _selectedDate = DateTime(2026, 7, 10);
  String _selectedTimeSlot = '10:00 AM';
  final TextEditingController _notesController = TextEditingController();
  bool _enableReminder = true;
  bool _syncGoogleCalendar = true;

  final List<String> _timeSlots = ['09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  // July 2026 dates simulation list
  final List<DateTime> _calendarDays = List.generate(
    14,
    (index) => DateTime(2026, 7, 5 + index),
  );

  @override
  void initState() {
    super.initState();
    _state.addListener(_onStateChanged);
    
    // Fallbacks if loaded generally
    _selectedPropertyId = widget.propertyId ?? (_state.properties.isNotEmpty ? _state.properties[0].id : 'p1');
    _selectedPropertyTitle = widget.propertyTitle ?? (_state.properties.isNotEmpty ? _state.properties[0].title : 'Bole Premium Royal Villa');
    _selectedAgentName = widget.agentName ?? (_state.properties.isNotEmpty ? _state.properties[0].agent.name : 'Yared Selamu');
  }

  @override
  void dispose() {
    _state.removeListener(_onStateChanged);
    _notesController.dispose();
    super.dispose();
  }

  void _onStateChanged() {
    if (mounted) setState(() {});
  }

  void _submitBooking() {
    final booking = VisitBooking(
      id: 'v_${DateTime.now().millisecondsSinceEpoch}',
      propertyId: _selectedPropertyId,
      propertyTitle: _selectedPropertyTitle,
      agentName: _selectedAgentName,
      date: _selectedDate,
      timeSlot: _selectedTimeSlot,
      notes: _notesController.text,
      enableReminder: _enableReminder,
      isConfirmed: true, // Auto-cleared by AI agency system
    );

    _state.addVisitBooking(booking);

    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: AppColors.background,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(color: AppColors.border),
          ),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.check_circle_outline, color: AppColors.success, size: 54),
                const SizedBox(height: 16),
                const Text(
                  'VISIT CLEARANCE REGISTERED',
                  style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.5),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),
                Text(
                  'Your physical inspection at $_selectedPropertyTitle is confirmed with $_selectedAgentName for ${_selectedDate.day}/${_selectedDate.month}/2026 at $_selectedTimeSlot.',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, height: 1.4),
                  textAlign: TextAlign.center,
                ),
                if (_syncGoogleCalendar) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: Colors.blue.withOpacity(0.08), borderRadius: BorderRadius.circular(8)),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.calendar_today, color: Colors.blue, size: 12),
                        SizedBox(width: 8),
                        Text('Synced to Google Calendar secure API', style: TextStyle(color: Colors.blue, fontSize: 9, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context); // Close dialog
                    _notesController.clear();
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldLight, foregroundColor: AppColors.background),
                  child: const Text('VIEW ACTIVE SCHEDULES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                )
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final activeBookings = _state.bookings;

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
          'INSPECTION SCHEDULER',
          style: TextStyle(
            color: Colors.white,
            fontSize: 11.5,
            fontWeight: FontWeight.black,
            letterSpacing: 1.5,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Info warning panel
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.privacy_tip_outlined, color: AppColors.goldLight, size: 18),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Scheduling physical inspections requires a verified biometric profile. Confirmed bookings will automatically pair with your Google Calendar.',
                        style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 10.5, height: 1.35),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Form Header
              _buildSectionHeader('BOOK SECURE INSPECTION'),
              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Property Target Spec
                    const Text('TARGET PROPERTY', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(
                      _selectedPropertyTitle,
                      style: const TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.bold),
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text('Vetted Agent Representative: $_selectedAgentName', style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
                    const SizedBox(height: 16),
                    const Divider(color: AppColors.border, height: 1),
                    const SizedBox(height: 16),

                    // Calendar Days Selection Grid
                    const Text('SELECT DATE (JULY 2026)', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 10),
                    SizedBox(
                      height: 56,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        itemCount: _calendarDays.length,
                        itemBuilder: (context, idx) {
                          final day = _calendarDays[idx];
                          final bool isSel = day.day == _selectedDate.day;
                          final String dayName = _getDayAbbreviation(day.weekday);

                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedDate = day;
                              });
                            },
                            child: Container(
                              width: 44,
                              margin: const EdgeInsets.only(right: 8),
                              decoration: BoxDecoration(
                                color: isSel ? AppColors.goldLight : AppColors.card,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: isSel ? AppColors.goldLight : AppColors.border),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    dayName,
                                    style: TextStyle(
                                      fontFamily: 'JetBrains Mono',
                                      color: isSel ? AppColors.background : AppColors.textMuted,
                                      fontSize: 7.5,
                                      fontWeight: FontWeight.black,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${day.day}',
                                    style: TextStyle(
                                      fontFamily: 'JetBrains Mono',
                                      color: isSel ? AppColors.background : Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.black,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Time slots Selection List
                    const Text('AVAILABLE TIME SLOTS', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _timeSlots.map((slot) {
                        final bool isSel = _selectedTimeSlot == slot;
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedTimeSlot = slot;
                            });
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: isSel ? AppColors.goldDark.withOpacity(0.15) : AppColors.card,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: isSel ? AppColors.goldMedium : AppColors.border),
                            ),
                            child: Text(
                              slot,
                              style: TextStyle(
                                fontFamily: 'JetBrains Mono',
                                color: isSel ? AppColors.goldLight : Colors.white70,
                                fontSize: 9,
                                fontWeight: isSel ? FontWeight.black : FontWeight.normal,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),

                    // Notes Controller
                    const Text('SPECIAL INSPECTION NOTES', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.border)),
                      child: TextField(
                        controller: _notesController,
                        maxLines: 2,
                        style: const TextStyle(color: Colors.white, fontSize: 11),
                        decoration: const InputDecoration(
                          hintText: 'Describe accessibility requirements or companion access list...',
                          hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 10),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Sync & reminder options
                    SwitchListTile(
                      value: _enableReminder,
                      onChanged: (val) => setState(() => _enableReminder = val),
                      activeColor: AppColors.goldLight,
                      contentPadding: EdgeInsets.zero,
                      title: const Text('ENABLE SMS & BIOMETRIC REMINDER', style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
                      subtitle: const Text('SMS triggers 2 hours before the inspection clearance.', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5)),
                    ),
                    SwitchListTile(
                      value: _syncGoogleCalendar,
                      onChanged: (val) => setState(() => _syncGoogleCalendar = val),
                      activeColor: AppColors.goldLight,
                      contentPadding: EdgeInsets.zero,
                      title: const Text('GOOGLE CALENDAR READY SYNC', style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
                      subtitle: const Text('Sync confirmation directly into linked Google Calendar account.', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5)),
                    ),
                    const SizedBox(height: 12),

                    // Confirm Booking Action
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _submitBooking,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.goldLight,
                          foregroundColor: AppColors.background,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text('CONFIRM INSPECTION APPOINTMENT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black)),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Booking history list
              _buildSectionHeader('YOUR ACTIVE SCHEDULING TIMELINE'),
              const SizedBox(height: 12),
              if (activeBookings.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.border)),
                  child: const Column(
                    children: [
                      Icon(Icons.calendar_today_outlined, color: AppColors.textMuted, size: 28),
                      SizedBox(height: 10),
                      Text('NO VISITS SCHEDULED YET', style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      SizedBox(height: 4),
                      Text('Your active inspection timeline is clean. Submit a booking form above to get cleared.', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5), textAlign: TextAlign.center),
                    ],
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: activeBookings.length,
                  itemBuilder: (context, idx) {
                    final b = activeBookings[idx];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Expanded(
                                child: Text(
                                  b.propertyTitle,
                                  style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.bold),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                                decoration: BoxDecoration(color: Colors.green.withOpacity(0.12), borderRadius: BorderRadius.circular(4)),
                                child: const Text('CONFIRMED', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.success, fontSize: 7, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text('Vetted Representative: ${b.agentName}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 9.5)),
                          const SizedBox(height: 10),
                          const Divider(color: AppColors.border, height: 1),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              _buildBookingDetailBadge(Icons.calendar_month, '${b.date.day}/${b.date.month}/2026'),
                              const SizedBox(width: 14),
                              _buildBookingDetailBadge(Icons.access_time, b.timeSlot),
                              const Spacer(),
                              IconButton(
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                                icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 16),
                                onPressed: () {
                                  _state.removeVisitBooking(b.id);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Inspection appointment deleted.')),
                                  );
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
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

  Widget _buildBookingDetailBadge(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, color: AppColors.goldLight, size: 12),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(fontFamily: 'JetBrains Mono', color: Colors.white, fontSize: 9)),
      ],
    );
  }

  String _getDayAbbreviation(int weekday) {
    switch (weekday) {
      case DateTime.monday: return 'MON';
      case DateTime.tuesday: return 'TUE';
      case DateTime.wednesday: return 'WED';
      case DateTime.thursday: return 'THU';
      case DateTime.friday: return 'FRI';
      case DateTime.saturday: return 'SAT';
      case DateTime.sunday: return 'SUN';
      default: return 'DAY';
    }
  }
}
