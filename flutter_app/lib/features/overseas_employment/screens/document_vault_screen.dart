import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../models/job.dart';

class DocumentVaultScreen extends StatefulWidget {
  const DocumentVaultScreen({super.key});

  @override
  State<DocumentVaultScreen> createState() => _DocumentVaultScreenState();
}

class _DocumentVaultScreenState extends State<DocumentVaultScreen> {
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

  void _replaceDocument(String id, String label) {
    _state.uploadDocument(id, 'Replaced_${label.replaceAll(' ', '_')}_2026.pdf', 'PDF');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Replaced $label file successfully.'), backgroundColor: AppColors.success),
    );
  }

  void _deleteDocument(String id, String label) {
    _state.deleteDocument(id);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Removed $label file. Status reset to pending.'), backgroundColor: AppColors.error),
    );
  }

  void _simulateDownload(String filename) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Downloading $filename. File saved to locally secure keychain folder.'),
        backgroundColor: AppColors.goldDark,
      ),
    );
  }

  void _openPDFViewer(AppDocument doc) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: AppColors.background,
          insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: AppColors.border),
          ),
          child: Column(
            children: [
              // Top Bar
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                  border: Border(bottom: BorderSide(color: AppColors.border)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(doc.title.toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.black)),
                          const SizedBox(height: 2),
                          Text(doc.fileName, style: const TextStyle(color: AppColors.textMuted, fontSize: 10), overflow: TextOverflow.ellipsis),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    )
                  ],
                ),
              ),

              // Simulated Page Render Area (High-Contrast technical sheet layout matching Ethiopian luxury system)
              Expanded(
                child: Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 15)],
                  ),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.picture_as_pdf, color: AppColors.error, size: 48),
                        const SizedBox(height: 16),
                        Text(
                          doc.title,
                          style: const TextStyle(color: Colors.black87, fontSize: 15, fontWeight: FontWeight.bold),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'SYSTEM VERIFIED ENCRYPTED FILE',
                          style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.green[800], fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 24),
                        const Divider(color: Colors.black12, height: 1),
                        const SizedBox(height: 16),
                        _buildPDFMetadataLine('AUTHOR', 'Habtamu Amsalu (Verified Ethio-ID)'),
                        _buildPDFMetadataLine('ENCRYPTION', 'AES-256 GCM Standards'),
                        _buildPDFMetadataLine('MINISTRY OF LABOR', 'Approved Gateway Signature'),
                        _buildPDFMetadataLine('BIOMETRICS', 'Fingerprints & Face Match Verified'),
                        const SizedBox(height: 24),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(color: Colors.green[50], borderRadius: BorderRadius.circular(6)),
                          child: Text(
                            'SHA-256 HASH VERIFIED',
                            style: TextStyle(fontFamily: 'JetBrains Mono', color: Colors.green[900], fontSize: 8, fontWeight: FontWeight.bold),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),

              // Bottom Actions Panel
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                decoration: const BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
                  border: Border(top: BorderSide(color: AppColors.border)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                          _simulateDownload(doc.fileName);
                        },
                        icon: const Icon(Icons.download, size: 14, color: Colors.white),
                        label: const Text('DOWNLOAD FILE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                        style: OutlinedButton.styleFrom(side: const BorderSide(color: AppColors.border)),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                          _replaceDocument(doc.id, doc.title);
                        },
                        icon: const Icon(Icons.published_with_changes, size: 14, color: AppColors.background),
                        label: const Text('REPLACE FILE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black)),
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldLight),
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
        );
      },
    );
  }

  Widget _buildPDFMetadataLine(String header, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(header, style: const TextStyle(color: Colors.black38, fontSize: 8, fontWeight: FontWeight.bold)),
          Text(value, style: const TextStyle(color: Colors.black87, fontSize: 9.5, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final docs = _state.documents;

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
          'SECURE DOCUMENT VAULT',
          style: TextStyle(
            color: Colors.white,
            fontSize: 12,
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
              // Vault banner info
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.goldDark.withOpacity(0.35)),
                ),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.shield_outlined, color: AppColors.goldLight, size: 24),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('SECURE KEYCHAIN STORAGE', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                          SizedBox(height: 4),
                          Text(
                            'All documents uploaded here are verified by federal agencies and encrypted with AES-256 standard. Approved employers can pull certified copies only upon permission.',
                            style: TextStyle(color: AppColors.textSecondary, fontSize: 10.5, height: 1.4),
                          )
                        ],
                      ),
                    )
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Text(
                'YOUR ARCHIVE FILE LISTING (${docs.length})',
                style: const TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 1.2),
              ),
              const SizedBox(height: 12),

              // Map documents lists
              ...docs.map((doc) => _buildDocumentTile(doc)).toList(),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDocumentTile(AppDocument doc) {
    final bool isUploaded = doc.fileName != 'Not Uploaded';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isUploaded ? AppColors.goldDark.withOpacity(0.25) : AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isUploaded ? AppColors.goldDark.withOpacity(0.12) : Colors.white10,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isUploaded ? Icons.verified_user : Icons.unpublished,
                  color: isUploaded ? AppColors.goldLight : AppColors.textMuted,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(doc.title, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 2),
                    Text(
                      isUploaded ? doc.fileName : 'Unlinked (Required for application)',
                      style: TextStyle(
                        color: isUploaded ? AppColors.success : AppColors.error,
                        fontSize: 10.5,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              if (isUploaded)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(6)),
                  child: const Text('VERIFIED', style: TextStyle(fontFamily: 'JetBrains Mono', color: AppColors.success, fontSize: 8, fontWeight: FontWeight.black)),
                )
            ],
          ),
          
          if (isUploaded) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.history, color: AppColors.textMuted, size: 12),
                const SizedBox(width: 4),
                Text('Uploaded: ${doc.uploadDate}', style: const TextStyle(color: AppColors.textMuted, fontSize: 9, fontFamily: 'JetBrains Mono')),
              ],
            )
          ],

          const SizedBox(height: 12),
          const Divider(color: AppColors.border, height: 1),
          const SizedBox(height: 10),

          Row(
            children: [
              if (isUploaded) ...[
                Expanded(
                  child: TextButton.icon(
                    onPressed: () => _openPDFViewer(doc),
                    icon: const Icon(Icons.picture_as_pdf_outlined, color: AppColors.goldLight, size: 14),
                    label: const Text('VIEW', style: TextStyle(color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ),
                Expanded(
                  child: TextButton.icon(
                    onPressed: () => _simulateDownload(doc.fileName),
                    icon: const Icon(Icons.download_for_offline_outlined, color: Colors.white70, size: 14),
                    label: const Text('DOWNLOAD', style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ),
                Expanded(
                  child: TextButton.icon(
                    onPressed: () => _deleteDocument(doc.id, doc.title),
                    icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 14),
                    label: const Text('DELETE', style: TextStyle(color: AppColors.error, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ),
              ] else ...[
                Expanded(
                  child: TextButton.icon(
                    onPressed: () {
                      _state.uploadDocument(doc.id, '${doc.title.replaceAll(' ', '_')}_Active.pdf', 'PDF');
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Uploaded ${doc.title} successfully.'), backgroundColor: AppColors.success),
                      );
                    },
                    icon: const Icon(Icons.upload_file_outlined, color: AppColors.goldLight, size: 14),
                    label: const Text('SELECT & PAIR FILE', style: TextStyle(color: AppColors.goldLight, fontSize: 10, fontWeight: FontWeight.black)),
                  ),
                )
              ]
            ],
          )
        ],
      ),
    );
  }
}
