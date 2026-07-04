import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/job.dart';

class ApplicationFlowScreen extends StatefulWidget {
  const ApplicationFlowScreen({super.key});

  @override
  State<ApplicationFlowScreen> createState() => _ApplicationFlowScreenState();
}

class _ApplicationFlowScreenState extends State<ApplicationFlowScreen> {
  final OverseasState _state = OverseasState();
  
  // Emergency contact fields
  final _emergencyNameController = TextEditingController(text: 'Mulugeta Tesfaye');
  final _emergencyRelationController = TextEditingController(text: 'Father');
  final _emergencyPhoneController = TextEditingController(text: '+251 912 345 678');
  final _emergencyAddressController = TextEditingController(text: 'Addis Ababa, Bole Subcity');

  @override
  void initState() {
    super.initState();
    _state.addListener(_onStateChanged);
  }

  @override
  void dispose() {
    _state.removeListener(_onStateChanged);
    _emergencyNameController.dispose();
    _emergencyRelationController.dispose();
    _emergencyPhoneController.dispose();
    _emergencyAddressController.dispose();
    super.dispose();
  }

  void _onStateChanged() {
    if (mounted) setState(() {});
  }

  void _resumeLater() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Application progress saved. You can resume anytime from the portal!'),
        backgroundColor: AppColors.goldDark,
      ),
    );
    Navigator.pop(context);
  }

  void _submitApplication() {
    final job = _state.activeApplyingJob;
    if (job == null) return;
    
    // Trigger submit animation or simple success transition
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            // Simulated network sending
            Future.delayed(const Duration(milliseconds: 2000), () {
              if (context.mounted) {
                Navigator.pop(context); // close loader
                _showSuccessDialog(job);
              }
            });

            return AlertDialog(
              backgroundColor: AppColors.card,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: AppColors.border)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 16),
                  const CircularProgressIndicator(color: AppColors.goldLight),
                  const SizedBox(height: 24),
                  const Text(
                    'TRANSMITTING DOSSIER...',
                    style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.5),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Encrypting passport, CV, and credentials with the ${job.agency.name} node.',
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, height: 1.4),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showSuccessDialog(Job job) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.card,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24), side: const BorderSide(color: AppColors.goldLight, width: 1.5)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(color: AppColors.success, shape: BoxShape.circle),
                child: const Icon(Icons.verified_user, color: Colors.white, size: 40),
              ),
              const SizedBox(height: 24),
              const Text(
                'DOSSIER COMMITTED!',
                style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.success, fontSize: 13, fontWeight: FontWeight.black, letterSpacing: 1.5),
              ),
              const SizedBox(height: 12),
              Text(
                'Your application has been logged on the Every-zone blockchain gateway. Tracking timeline is now active.',
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, height: 1.4),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              // Compact summary card
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12)),
                child: Row(
                  children: [
                    Text(job.countryFlag, style: const TextStyle(fontSize: 24)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(job.title, style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
                          Text(job.company, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
                        ],
                      ),
                    )
                  ],
                ),
              ),
            ],
          ),
          actionsAlignment: MainAxisAlignment.center,
          actions: [
            ElevatedButton(
              onPressed: () {
                _state.completeApplication(job.id);
                Navigator.pop(context); // close dialog
                Navigator.pop(context); // exit application flow
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium, foregroundColor: AppColors.background),
              child: const Text('TRACK STATUS NOW', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
            )
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final job = _state.activeApplyingJob;
    if (job == null) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(child: Text('No active job selection.', style: TextStyle(color: Colors.white))),
      );
    }

    final int step = _state.currentFlowStep;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: _resumeLater,
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'APPLICATION FLOW',
              style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.5),
            ),
            const SizedBox(height: 2),
            Text(
              job.title,
              style: const TextStyle(color: AppColors.goldLight, fontSize: 10, overflow: TextOverflow.ellipsis),
            )
          ],
        ),
        actions: [
          TextButton(
            onPressed: _resumeLater,
            child: const Text(
              'RESUME LATER',
              style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldMedium, fontSize: 10, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Linear Progress Stepper Bar
            _buildStepperProgressHeader(step),
            
            // Stepper Content
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: _buildStepContent(step, job),
              ),
            ),

            // Navigation Sticky Bottom
            _buildNavigationBottom(step, job),
          ],
        ),
      ),
    );
  }

  Widget _buildStepperProgressHeader(int step) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: Column(
        children: [
          // Step names list
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                'STEP ${step + 1} OF 7',
                style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 10.5, fontWeight: FontWeight.bold),
              ),
              Text(
                _getStepTitle(step).toUpperCase(),
                style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // Custom glowing segment progress indicators
          Row(
            children: List.generate(7, (index) {
              final isActive = index <= step;
              final isCurrent = index == step;
              return Expanded(
                child: Container(
                  height: 4,
                  margin: EdgeInsets.only(right: index == 6 ? 0 : 4),
                  decoration: BoxDecoration(
                    color: isActive
                        ? (isCurrent ? AppColors.goldLight : AppColors.goldDark)
                        : AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                    boxShadow: isCurrent
                        ? [BoxShadow(color: AppColors.goldLight.withOpacity(0.4), blurRadius: 4)]
                        : null,
                  ),
                ),
              );
            }),
          )
        ],
      ),
    );
  }

  String _getStepTitle(int step) {
    switch (step) {
      case 0: return 'Profile Check';
      case 1: return 'Passport Upload';
      case 2: return 'CV Upload';
      case 3: return 'Certificates';
      case 4: return 'Photo Upload';
      case 5: return 'Emergency Contact';
      case 6: return 'Submit & Transmit';
      default: return '';
    }
  }

  Widget _buildStepContent(int step, Job job) {
    switch (step) {
      case 0: return _buildStepProfileCheck(job);
      case 1: return _buildStepPassport();
      case 2: return _buildStepCV();
      case 3: return _buildStepCertificates();
      case 4: return _buildStepPhoto();
      case 5: return _buildStepEmergency();
      case 6: return _buildStepSubmit(job);
      default: return const SizedBox.shrink();
    }
  }

  // STEP 1: Profile Check
  Widget _buildStepProfileCheck(Job job) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'AUTOMATIC VERIFICATION PROTOCOL',
          style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.2),
        ),
        const SizedBox(height: 8),
        const Text(
          'Before applying, the system runs an automatic gatekeeper qualification check on your primary Every-zone profile details.',
          style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
        ),
        const SizedBox(height: 20),
        
        _buildVerificationRow('Biometric Profile Complete', 'Standard clear checks', true),
        _buildVerificationRow('Valid Legal Age Verification', '18 - 45 (Ethiopian Labor Compliance)', true),
        _buildVerificationRow('Federal Police Record Cleared', 'No active infractions logged', true),
        _buildVerificationRow('GAMCA Medical fit status', 'Logged fit under GCC standards', true),
        _buildVerificationRow('Financial Escrow Wallet status', 'Secure limit verified', true),

        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.success.withOpacity(0.08),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.success.withOpacity(0.3)),
          ),
          child: const Row(
            children: [
              Icon(Icons.check_circle, color: AppColors.success, size: 24),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('GATEKEEPER QUALIFIED', style: TextStyle(color: AppColors.success, fontSize: 12, fontWeight: FontWeight.bold)),
                    SizedBox(height: 2),
                    Text('Your biometric dossier meets the baseline criteria. Advance to file pairing.', style: TextStyle(color: AppColors.textSecondary, fontSize: 10.5)),
                  ],
                ),
              )
            ],
          ),
        )
      ],
    );
  }

  Widget _buildVerificationRow(String title, String subtitle, bool isCleared) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
              ],
            ),
          ),
          Row(
            children: [
              const Text('CLEARED', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.success, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
              const SizedBox(width: 8),
              const Icon(Icons.check_circle_outline, color: AppColors.success, size: 16),
            ],
          )
        ],
      ),
    );
  }

  // STEP 2: Passport Upload
  Widget _buildStepPassport() {
    final doc = _state.documents.firstWhere((d) => d.id == 'doc_passport');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'PASSPORT DOSSIER LINKING',
          style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.2),
        ),
        const SizedBox(height: 8),
        const Text(
          'Your passport is automatically retrieved from your secure Every-zone Document Vault. If you wish to replace it, click replace.',
          style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
        ),
        const SizedBox(height: 20),
        _buildVaultLinkedCard(doc, 'doc_passport', 'Addis_Ababa_Passport_Scan_Certified.pdf'),
      ],
    );
  }

  // STEP 3: CV Upload
  Widget _buildStepCV() {
    final doc = _state.documents.firstWhere((d) => d.id == 'doc_cv');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'CURRICULUM VITAE (CV) LINKING',
          style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.2),
        ),
        const SizedBox(height: 8),
        const Text(
          'A modern hospitality or vocational CV must be linked. Ensure work reference numbers are visible.',
          style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
        ),
        const SizedBox(height: 20),
        _buildVaultLinkedCard(doc, 'doc_cv', 'My_Hospitality_Resume_2026.pdf'),
      ],
    );
  }

  // STEP 4: Certificates
  Widget _buildStepCertificates() {
    final doc = _state.documents.firstWhere((d) => d.id == 'doc_certs');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'TVET / TRAINING CERTIFICATIONS',
          style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.2),
        ),
        const SizedBox(height: 8),
        const Text(
          'Upload certificates detailing hospitality courses, English competency exams, or heavy machinery driving licenses.',
          style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
        ),
        const SizedBox(height: 20),
        _buildVaultLinkedCard(doc, 'doc_certs', 'Vocational_Hospitality_Accreditation.pdf'),
      ],
    );
  }

  // STEP 5: Photo Upload
  Widget _buildStepPhoto() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'BIOMETRIC HEADSHOT PHOTO',
          style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.2),
        ),
        const SizedBox(height: 8),
        const Text(
          'A clear passport-sized photo with white background is required by destination consulate systems.',
          style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
        ),
        const SizedBox(height: 20),
        Center(
          child: Container(
            width: 150,
            height: 180,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border, width: 1.5),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                const Icon(Icons.account_box, size: 80, color: Colors.white24),
                // Corner guides simulating scanner
                _buildCornerGuide(Alignment.topLeft),
                _buildCornerGuide(Alignment.topRight),
                _buildCornerGuide(Alignment.bottomLeft),
                _buildCornerGuide(Alignment.bottomRight),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        Center(
          child: ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Camera initialized. Face registered!'), backgroundColor: AppColors.success),
              );
            },
            icon: const Icon(Icons.camera_alt),
            label: const Text('INITIATE PHONE BIO-CAPTURE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.card, foregroundColor: Colors.white),
          ),
        ),
      ],
    );
  }

  Widget _buildCornerGuide(Alignment align) {
    return Positioned(
      left: align == Alignment.topLeft || align == Alignment.bottomLeft ? 8 : null,
      right: align == Alignment.topRight || align == Alignment.bottomRight ? 8 : null,
      top: align == Alignment.topLeft || align == Alignment.topRight ? 8 : null,
      bottom: align == Alignment.bottomLeft || align == Alignment.bottomRight ? 8 : null,
      child: Container(
        width: 14,
        height: 14,
        decoration: BoxDecoration(
          border: Border(
            top: align == Alignment.topLeft || align == Alignment.topRight ? const BorderSide(color: AppColors.goldLight, width: 2) : BorderSide.none,
            bottom: align == Alignment.bottomLeft || align == Alignment.bottomRight ? const BorderSide(color: AppColors.goldLight, width: 2) : BorderSide.none,
            left: align == Alignment.topLeft || align == Alignment.bottomLeft ? const BorderSide(color: AppColors.goldLight, width: 2) : BorderSide.none,
            right: align == Alignment.topRight || align == Alignment.bottomRight ? const BorderSide(color: AppColors.goldLight, width: 2) : BorderSide.none,
          ),
        ),
      ),
    );
  }

  // STEP 6: Emergency Contact Form
  Widget _buildStepEmergency() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'EMERGENCY CONTACT (NEXT OF KIN)',
          style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.2),
        ),
        const SizedBox(height: 8),
        const Text(
          'Under legal requirements of the Ministry of Labor and Skills of Ethiopia, a verified next of kin emergency contact is mandatory.',
          style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
        ),
        const SizedBox(height: 20),
        
        _buildTextField('FULL NAME', _emergencyNameController),
        _buildTextField('RELATIONSHIP', _emergencyRelationController),
        _buildTextField('PHONE NUMBER', _emergencyPhoneController, isPhone: true),
        _buildTextField('RESIDENTIAL ADDRESS', _emergencyAddressController),
      ],
    );
  }

  Widget _buildTextField(String label, TextEditingController ctrl, {bool isPhone = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.textMuted, fontSize: 8.5, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: ctrl,
            style: const TextStyle(color: Colors.white, fontSize: 12.5),
            keyboardType: isPhone ? TextInputType.phone : TextInputType.text,
            decoration: InputDecoration(
              filled: true,
              fillColor: AppColors.surface,
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppColors.border),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppColors.border),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppColors.goldLight),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // STEP 7: Submit Review
  Widget _buildStepSubmit(Job job) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'FINAL DOSSIER REVIEW',
          style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.2),
        ),
        const SizedBox(height: 8),
        const Text(
          'Please verify the compiled packet details. This action submits a legally binding employment request.',
          style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5, height: 1.4),
        ),
        const SizedBox(height: 20),

        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              _buildReviewRow('Job Opening', job.title),
              _buildReviewRow('Destination', '${job.countryFlag} ${job.country}'),
              _buildReviewRow('Contract Term', job.contractLength),
              _buildReviewRow('Primary Agency', job.agency.name),
              _buildReviewRow('Emergency contact', _emergencyNameController.text),
              _buildReviewRow('Contact Phone', _emergencyPhoneController.text),
            ],
          ),
        ),

        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.goldDark.withOpacity(0.12),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.goldMedium.withOpacity(0.35)),
          ),
          child: const Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(Icons.info_outline, color: AppColors.goldLight, size: 18),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'By proceeding, you authorize Every-zone to transfer your biometric vault dossier securely to the agency\'s terminal. Your data remains fully encrypted.',
                  style: TextStyle(color: AppColors.goldLight, fontSize: 10, height: 1.4),
                ),
              )
            ],
          ),
        )
      ],
    );
  }

  Widget _buildReviewRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.bold),
              textAlign: Alignment.centerRight.x > 0 ? TextAlign.end : TextAlign.start,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVaultLinkedCard(AppDocument doc, String docId, String simulatedFileName) {
    final bool hasFile = doc.fileName != 'Not Uploaded';
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: hasFile ? AppColors.goldDark.withOpacity(0.4) : AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: hasFile ? AppColors.goldDark.withOpacity(0.15) : Colors.white10,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  hasFile ? Icons.file_present_rounded : Icons.file_upload_outlined,
                  color: hasFile ? AppColors.goldLight : AppColors.textMuted,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(doc.title, style: const TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 2),
                    Text(
                      hasFile ? 'Linked: ${doc.fileName}' : 'No file linked from Document Vault',
                      style: TextStyle(
                        color: hasFile ? AppColors.success : AppColors.error,
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              if (hasFile)
                const Icon(Icons.check_circle, color: AppColors.success, size: 16),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: AppColors.border, height: 1),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: hasFile
                    ? TextButton.icon(
                        onPressed: () {
                          _state.deleteDocument(docId);
                        },
                        icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 14),
                        label: const Text('UNLINK', style: TextStyle(color: AppColors.error, fontSize: 9.5, fontWeight: FontWeight.bold)),
                      )
                    : TextButton.icon(
                        onPressed: () {
                          _state.uploadDocument(docId, simulatedFileName, 'PDF');
                        },
                        icon: const Icon(Icons.link, color: AppColors.goldLight, size: 14),
                        label: const Text('AUTO LINK', style: TextStyle(color: AppColors.goldLight, fontSize: 9.5, fontWeight: FontWeight.bold)),
                      ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Simulated file explorer trigger
                    _state.uploadDocument(docId, simulatedFileName, 'PDF');
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('File uploaded and cataloged in your secure Document Vault.'), backgroundColor: AppColors.success),
                    );
                  },
                  icon: const Icon(Icons.file_open, size: 14),
                  label: const Text('CHOOSE FILE', style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.black)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.card,
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: AppColors.border),
                  ),
                ),
              )
            ],
          )
        ],
      ),
    );
  }

  Widget _buildNavigationBottom(int step, Job job) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.border)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          // Back button
          if (step > 0)
            OutlinedButton(
              onPressed: () {
                _state.previousFlowStep();
              },
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppColors.border),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              ),
              child: const Text('BACK', style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
            )
          else
            const SizedBox(width: 1), // spacer dummy
            
          // Next / Submit button
          ElevatedButton(
            onPressed: () {
              if (step < 6) {
                // Ensure required files are linked
                if (step == 1) {
                  final doc = _state.documents.firstWhere((d) => d.id == 'doc_passport');
                  if (doc.fileName == 'Not Uploaded') {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please link your passport to proceed.'), backgroundColor: AppColors.error),
                    );
                    return;
                  }
                }
                if (step == 2) {
                  final doc = _state.documents.firstWhere((d) => d.id == 'doc_cv');
                  if (doc.fileName == 'Not Uploaded') {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please link your CV to proceed.'), backgroundColor: AppColors.error),
                    );
                    return;
                  }
                }
                
                _state.advanceFlowStep();
              } else {
                _submitApplication();
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.goldMedium,
              foregroundColor: AppColors.background,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            child: Text(
              step == 6 ? 'CONFIRM & TRANSMIT' : 'CONTINUE →',
              style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.black),
            ),
          )
        ],
      ),
    );
  }
}
