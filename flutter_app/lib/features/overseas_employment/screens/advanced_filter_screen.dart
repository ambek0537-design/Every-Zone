import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class AdvancedFilterScreen extends StatefulWidget {
  const AdvancedFilterScreen({super.key});

  @override
  State<AdvancedFilterScreen> createState() => _AdvancedFilterScreenState();
}

class _AdvancedFilterScreenState extends State<AdvancedFilterScreen> {
  // Filter variables
  String _selectedCountry = '';
  double _minSalary = 1000;
  double _maxSalary = 5000;
  String _selectedExperience = 'Any';
  String _selectedEducation = 'Any';
  String _selectedLanguage = 'Any';
  String _selectedGender = 'Any';
  String _selectedContractLength = 'Any';
  
  bool _accommodation = true;
  bool _foodIncluded = true;
  bool _medicalInsurance = true;
  bool _visaIncluded = true;
  bool _airTicketIncluded = true;
  bool _verifiedAgenciesOnly = true;

  final List<String> _countries = [
    'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Europe', 'Canada', 'Australia'
  ];

  final List<String> _experiences = ['Any', 'No Experience', '1-2 Years', '3-5 Years', '5+ Years'];
  final List<String> _educations = ['Any', 'Secondary School', 'Vocational / TVET', 'Diploma', 'Bachelor\'s Degree'];
  final List<String> _languages = ['Any', 'Basic English', 'Fluent English', 'Arabic', 'German'];
  final List<String> _genders = ['Any', 'Male Preferred', 'Female Preferred'];
  final List<String> _contracts = ['Any', '1 Year', '2 Years', '3 Years'];

  @override
  Widget build(BuildContext context) {
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
          'ADVANCED FILTER',
          style: TextStyle(
            color: Colors.white,
            fontSize: 13,
            fontWeight: FontWeight.black,
            letterSpacing: 1.5,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _selectedCountry = '';
                _minSalary = 1000;
                _maxSalary = 5000;
                _selectedExperience = 'Any';
                _selectedEducation = 'Any';
                _selectedLanguage = 'Any';
                _selectedGender = 'Any';
                _selectedContractLength = 'Any';
                _accommodation = false;
                _foodIncluded = false;
                _medicalInsurance = false;
                _visaIncluded = false;
                _airTicketIncluded = false;
                _verifiedAgenciesOnly = false;
              });
            },
            child: const Text('RESET', style: TextStyle(color: AppColors.error, fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'JetBrains Mono')),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Country Selector
              _buildSectionHeader('DESTINATION COUNTRY'),
              const SizedBox(height: 8),
              _buildCountryChips(),
              const SizedBox(height: 24),

              // Salary Range Slider
              _buildSectionHeader('SALARY RANGE ($)'),
              const SizedBox(height: 12),
              _buildSalarySlider(),
              const SizedBox(height: 24),

              // Experience & Education Row
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionHeader('EXPERIENCE'),
                        const SizedBox(height: 8),
                        _buildDropdown(
                          value: _selectedExperience,
                          items: _experiences,
                          onChanged: (val) {
                            setState(() {
                              _selectedExperience = val!;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionHeader('EDUCATION'),
                        const SizedBox(height: 8),
                        _buildDropdown(
                          value: _selectedEducation,
                          items: _educations,
                          onChanged: (val) {
                            setState(() {
                              _selectedEducation = val!;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Language & Gender Preferred
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionHeader('LANGUAGE'),
                        const SizedBox(height: 8),
                        _buildDropdown(
                          value: _selectedLanguage,
                          items: _languages,
                          onChanged: (val) {
                            setState(() {
                              _selectedLanguage = val!;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionHeader('GENDER'),
                        const SizedBox(height: 8),
                        _buildDropdown(
                          value: _selectedGender,
                          items: _genders,
                          onChanged: (val) {
                            setState(() {
                              _selectedGender = val!;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Contract Length
              _buildSectionHeader('CONTRACT LENGTH'),
              const SizedBox(height: 8),
              _buildContractChips(),
              const SizedBox(height: 28),

              // Binary Switch/Toggle Benefits
              _buildSectionHeader('VERIFIED BENEFITS & SECURITY'),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    _buildSwitchTile('Accommodation Provided', _accommodation, (val) => setState(() => _accommodation = val)),
                    const Divider(color: AppColors.border, height: 1),
                    _buildSwitchTile('Food Included', _foodIncluded, (val) => setState(() => _foodIncluded = val)),
                    const Divider(color: AppColors.border, height: 1),
                    _buildSwitchTile('Medical Insurance Included', _medicalInsurance, (val) => setState(() => _medicalInsurance = val)),
                    const Divider(color: AppColors.border, height: 1),
                    _buildSwitchTile('Work Visa Included', _visaIncluded, (val) => setState(() => _visaIncluded = val)),
                    const Divider(color: AppColors.border, height: 1),
                    _buildSwitchTile('Round-Trip Air Ticket Provided', _airTicketIncluded, (val) => setState(() => _airTicketIncluded = val)),
                    const Divider(color: AppColors.border, height: 1),
                    _buildSwitchTile('Verified Government Agencies Only', _verifiedAgenciesOnly, (val) => setState(() => _verifiedAgenciesOnly = val)),
                  ],
                ),
              ),
              const SizedBox(height: 36),

              // Apply Filters Action
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    // Send back filter terms to jobs home
                    Navigator.pop(context, {
                      'country': _selectedCountry,
                      'category': '',
                      'query': '',
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.goldMedium,
                    foregroundColor: AppColors.background,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('APPLY PREMIUM FILTERS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.0)),
                ),
              ),
              const SizedBox(height: 20),
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
        letterSpacing: 1.2,
      ),
    );
  }

  Widget _buildCountryChips() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: _countries.map((c) {
        final isSelected = _selectedCountry == c;
        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedCountry = isSelected ? '' : c;
            });
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.goldDark.withOpacity(0.2) : AppColors.surface,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: isSelected ? AppColors.goldLight : AppColors.border,
                width: isSelected ? 1.5 : 1.0,
              ),
            ),
            child: Text(
              c,
              style: TextStyle(
                color: isSelected ? AppColors.goldLight : AppColors.textPrimary,
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSalarySlider() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text('\$${_minSalary.toInt()}', style: const TextStyle(color: AppColors.success, fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: FontWeight.bold)),
              const Text('TO', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
              Text('\$${_maxSalary.toInt()}+', style: const TextStyle(color: AppColors.success, fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: FontWeight.bold)),
            ],
          ),
          RangeSlider(
            values: RangeValues(_minSalary, _maxSalary),
            min: 500,
            max: 5000,
            divisions: 45,
            activeColor: AppColors.goldMedium,
            inactiveColor: AppColors.border,
            labels: RangeLabels('\$${_minSalary.toInt()}', '\$${_maxSalary.toInt()}'),
            onChanged: (RangeValues vals) {
              setState(() {
                _minSalary = vals.start;
                _maxSalary = vals.end;
              });
            },
          )
        ],
      ),
    );
  }

  Widget _buildDropdown({
    required String value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: value,
          dropdownColor: AppColors.card,
          icon: const Icon(Icons.arrow_drop_down, color: AppColors.goldLight),
          isExpanded: true,
          style: const TextStyle(color: Colors.white, fontSize: 12),
          onChanged: onChanged,
          items: items.map<DropdownMenuItem<String>>((String val) {
            return DropdownMenuItem<String>(
              value: val,
              child: Text(val),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildContractChips() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: _contracts.map((c) {
        final isSelected = _selectedContractLength == c;
        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedContractLength = c;
            });
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.goldDark.withOpacity(0.2) : AppColors.surface,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: isSelected ? AppColors.goldLight : AppColors.border,
                width: isSelected ? 1.5 : 1.0,
              ),
            ),
            child: Text(
              c,
              style: TextStyle(
                color: isSelected ? AppColors.goldLight : AppColors.textPrimary,
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSwitchTile(String label, bool value, ValueChanged<bool> onChanged) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(
            label,
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 12),
          ),
          Switch(
            value: value,
            activeColor: AppColors.goldMedium,
            activeTrackColor: AppColors.goldDark.withOpacity(0.3),
            inactiveThumbColor: AppColors.textMuted,
            inactiveTrackColor: AppColors.border,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}
