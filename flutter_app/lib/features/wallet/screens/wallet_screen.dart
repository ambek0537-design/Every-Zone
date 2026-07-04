import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

extension NumberFormatting on double {
  String toLocaleString() {
    return toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]},',
    );
  }
}

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> with SingleTickerProviderStateMixin {
  double _availableBalance = 18500.0;
  double _pendingBalance = 4200.0;
  double _escrowBalance = 12000.0;

  // Transaction history data
  final List<Map<String, dynamic>> _transactions = [
    {
      'id': 'TX-9081240',
      'title': 'Sabahar Heritage Weaves',
      'category': 'Shopping',
      'amount': -18500.0,
      'status': 'Secured in Escrow',
      'method': 'Every-zone Wallet',
      'date': 'July 3, 2026',
      'ref': 'CHAPA-9081240-TX',
      'icon': Icons.shopping_bag,
    },
    {
      'id': 'TX-9071239',
      'title': 'Deposit via Telebirr',
      'category': 'Top Up',
      'amount': 25000.0,
      'status': 'Completed',
      'method': 'Telebirr',
      'date': 'July 2, 2026',
      'ref': 'TELE-9071239-DP',
      'icon': Icons.add_circle,
    },
    {
      'id': 'TX-9051210',
      'title': 'Bole Atlas Penthouse Rental',
      'category': 'Real Estate',
      'amount': -12000.0,
      'status': 'Secured in Escrow',
      'method': 'Every-zone Escrow',
      'date': 'June 28, 2026',
      'ref': 'LAND-9051210-RT',
      'icon': Icons.home_work,
    },
    {
      'id': 'TX-9011190',
      'title': 'Sidamo Reserve Roasters',
      'category': 'Food & Drinks',
      'amount': -1850.0,
      'status': 'Completed',
      'method': 'Every-zone Wallet',
      'date': 'June 25, 2026',
      'ref': 'CAFE-9011190-TX',
      'icon': Icons.local_cafe,
    },
    {
      'id': 'TX-8980182',
      'title': 'Refund: Broken Gems Lab',
      'category': 'Refund',
      'amount': 4500.0,
      'status': 'Refunded',
      'method': 'Every-zone Wallet',
      'date': 'June 20, 2026',
      'ref': 'RFND-8980182-TX',
      'icon': Icons.undo,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () => Navigator.pop(context),
              )
            : null,
        title: const Text(
          'SECURE WALLET VAULT',
          style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black, letterSpacing: 1.5),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.security, color: AppColors.goldLight, size: 18),
            onPressed: _showVaultSecurityNotice,
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Premium Balance Card Panel
            _buildBalanceCardPanel(),
            const SizedBox(height: 28),

            // Quick Actions Title & Horizontal Grid
            const Text(
              'VAULT ACTIONS',
              style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.0),
            ),
            const SizedBox(height: 12),
            _buildQuickActionsGrid(),
            const SizedBox(height: 32),

            // Spending Analytics with custom line chart
            const Text(
              'MONTHLY SPENDING ANALYTICS',
              style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.0),
            ),
            const SizedBox(height: 12),
            _buildSpendingChartCard(),
            const SizedBox(height: 32),

            // Transaction History list
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text(
                  'RECENT TRANSACTIONS',
                  style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.0),
                ),
                Text(
                  '${_transactions.length} records',
                  style: const TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildTransactionHistoryList(),
          ],
        ),
      ),
    );
  }

  // 1. PREMIUM BALANCE CARD PANEL
  Widget _buildBalanceCardPanel() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: AppColors.goldDark.withOpacity(0.04),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: AppColors.goldGradient,
                    ),
                    alignment: Alignment.center,
                    child: const Text('✦', style: TextStyle(fontSize: 12, color: Colors.black, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'EVERY-ZONE PREMIER LEDGER',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 8.5, fontWeight: FontWeight.black, letterSpacing: 0.8),
                  ),
                ],
              ),
              const Row(
                children: [
                  Icon(Icons.wifi, color: AppColors.success, size: 11),
                  SizedBox(width: 4),
                  Text('SHIELDED', style: TextStyle(color: AppColors.success, fontSize: 8, fontWeight: FontWeight.black)),
                ],
              )
            ],
          ),
          const SizedBox(height: 24),

          // Main Balance node
          const Text('TOTAL AVAILABLE BALANCE', style: TextStyle(color: AppColors.textSecondary, fontSize: 9, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                _availableBalance.toLocaleString(),
                style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.black, letterSpacing: -1.0),
              ),
              const SizedBox(width: 6),
              const Text(
                'ETB',
                style: TextStyle(color: AppColors.goldLight, fontSize: 14, fontWeight: FontWeight.black),
              ),
            ],
          ),
          const Divider(color: AppColors.border, height: 28),

          // Secondary balances (Pending & Escrow)
          Row(
            children: [
              // Pending
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(width: 6, height: 6, decoration: const BoxDecoration(color: Colors.amber, shape: BoxShape.circle)),
                        const SizedBox(width: 6),
                        const Text('PENDING CLEARANCE', style: TextStyle(color: AppColors.textSecondary, fontSize: 8, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${_pendingBalance.toLocaleString()} ETB',
                      style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black),
                    ),
                  ],
                ),
              ),

              // Escrow
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(width: 6, height: 6, decoration: const BoxDecoration(color: AppColors.goldLight, shape: BoxShape.circle)),
                        const SizedBox(width: 6),
                        const Text('ESCROW SECURED', style: TextStyle(color: AppColors.textSecondary, fontSize: 8, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${_escrowBalance.toLocaleString()} ETB',
                      style: const TextStyle(color: AppColors.goldLight, fontSize: 13, fontWeight: FontWeight.black),
                    ),
                  ],
                ),
              ),
            ],
          )
        ],
      ),
    );
  }

  // 2. QUICK ACTIONS ROW
  Widget _buildQuickActionsGrid() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildActionItem('DEPOSIT', Icons.arrow_downward, _triggerDepositWorkflow),
        _buildActionItem('WITHDRAW', Icons.arrow_upward, _triggerWithdrawWorkflow),
        _buildActionItem('TRANSFER', Icons.swap_horiz, _triggerTransferWorkflow),
        _buildActionItem('PAY NODE', Icons.qr_code_scanner, _triggerPayNodeWorkflow),
        _buildActionItem('TOP UP', Icons.add_to_photos, _triggerTopUpWorkflow),
      ],
    );
  }

  Widget _buildActionItem(String label, IconData icon, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 4),
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AppColors.background, shape: BoxShape.circle),
                child: Icon(icon, color: AppColors.goldLight, size: 16),
              ),
              const SizedBox(height: 8),
              Text(
                label,
                style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.black, letterSpacing: 0.5),
              )
            ],
          ),
        ),
      ),
    );
  }

  // 3. CUSTOM PAINTED ANALYTICS CHART
  Widget _buildSpendingChartCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('EXPENSE FLOW OVERVIEW', style: TextStyle(color: AppColors.textSecondary, fontSize: 8.5, fontWeight: FontWeight.bold)),
                  SizedBox(height: 2),
                  Text('Average: 12,450 ETB / month', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.black)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: AppColors.goldDark.withOpacity(0.15), borderRadius: BorderRadius.circular(6)),
                child: const Text('Q2 TREND', style: TextStyle(color: AppColors.goldLight, fontSize: 7.5, fontWeight: FontWeight.bold)),
              )
            ],
          ),
          const SizedBox(height: 24),

          // Custom Painted Chart Area
          SizedBox(
            height: 120,
            width: double.infinity,
            child: CustomPaint(
              painter: WalletSpendingPainter(),
            ),
          ),
          const SizedBox(height: 12),

          // Month Labels row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text('JAN', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5, fontWeight: FontWeight.bold)),
              Text('FEB', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5, fontWeight: FontWeight.bold)),
              Text('MAR', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5, fontWeight: FontWeight.bold)),
              Text('APR', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5, fontWeight: FontWeight.bold)),
              Text('MAY', style: TextStyle(color: AppColors.textMuted, fontSize: 8.5, fontWeight: FontWeight.bold)),
              Text('JUN', style: TextStyle(color: Colors.white70, fontSize: 8.5, fontWeight: FontWeight.black)),
            ],
          ),
        ],
      ),
    );
  }

  // 4. TRANSACTION HISTORY LIST
  Widget _buildTransactionHistoryList() {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _transactions.length,
      itemBuilder: (context, index) {
        final tx = _transactions[index];
        final isNegative = tx['amount'] < 0;
        final isEscrow = tx['status'].toString().contains('Escrow');

        return Card(
          color: AppColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: AppColors.border),
          ),
          margin: const EdgeInsets.only(bottom: 10),
          child: ListTile(
            onTap: () => _showTransactionReceipt(tx),
            leading: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isNegative ? Colors.red.withOpacity(0.08) : Colors.green.withOpacity(0.08),
                shape: BoxShape.circle,
              ),
              child: Icon(
                tx['icon'] as IconData,
                color: isNegative ? Colors.redAccent : Colors.emerald,
                size: 16,
              ),
            ),
            title: Text(
              tx['title'].toString().toUpperCase(),
              style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.black),
            ),
            subtitle: Text(
              '${tx['date']} • ${tx['method']}',
              style: const TextStyle(color: AppColors.textSecondary, fontSize: 9),
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '${isNegative ? "" : "+"}${tx['amount'].toLocaleString()} ETB',
                  style: TextStyle(
                    color: isNegative ? Colors.white : AppColors.success,
                    fontSize: 11.5,
                    fontWeight: FontWeight.black,
                  ),
                ),
                const SizedBox(height: 2),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: isEscrow ? AppColors.goldDark.withOpacity(0.2) : AppColors.border,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    tx['status'].toString().toUpperCase(),
                    style: TextStyle(
                      color: isEscrow ? AppColors.goldLight : AppColors.textSecondary,
                      fontSize: 6.5,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // TRANSACTION RECEIPTS
  void _showTransactionReceipt(Map<String, dynamic> tx) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: const Row(
            children: [
              Icon(Icons.payment, color: AppColors.goldLight, size: 20),
              SizedBox(width: 8),
              Text('COMPLIED TRANSACTION', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildReceiptRow('Transaction Ref:', tx['id']),
              _buildReceiptRow('Beneficiary:', tx['title']),
              _buildReceiptRow('Category:', tx['category']),
              _buildReceiptRow('Paid via:', tx['method']),
              _buildReceiptRow('Gateway Ref:', tx['ref']),
              _buildReceiptRow('Status:', tx['status']),
              const Divider(color: AppColors.border, height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text('TOTAL VALUE', style: TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold)),
                  Text('${tx['amount'].toLocaleString()} ETB', style: const TextStyle(color: AppColors.goldLight, fontSize: 12, fontWeight: FontWeight.black)),
                ],
              )
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('📥 Digital invoice PDF dispatched to system downloads.'), backgroundColor: AppColors.success),
                );
              },
              child: const Text('DOWNLOAD PDF', style: TextStyle(color: AppColors.goldLight, fontSize: 9.5, fontWeight: FontWeight.bold)),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('🔗 Share link copied to secure clipboard.')),
                );
              },
              child: const Text('SHARE', style: TextStyle(color: Colors.white60, fontSize: 9.5)),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('CLOSE', style: TextStyle(color: AppColors.textMuted, fontSize: 9.5)),
            ),
          ],
        );
      },
    );
  }

  Widget _buildReceiptRow(String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 9.5)),
          Text(val, style: const TextStyle(color: Colors.white, fontSize: 9.5, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
        ],
      ),
    );
  }

  // DIALOG WORKFLOWS
  void _triggerDepositWorkflow() {
    final amountController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: const Text('SECURE FUNDS DEPOSIT', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Deposit directly to your Available wallet node from linked banking channels.', style: TextStyle(color: AppColors.textSecondary, fontSize: 10.5)),
              const SizedBox(height: 16),
              TextField(
                controller: amountController,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Amount (ETB)',
                  labelStyle: TextStyle(color: AppColors.textMuted),
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCEL', style: TextStyle(color: AppColors.textMuted))),
            ElevatedButton(
              onPressed: () {
                final amt = double.tryParse(amountController.text) ?? 0.0;
                if (amt <= 0) return;
                Navigator.pop(context);
                _runBiometricVerification(() {
                  setState(() {
                    _availableBalance += amt;
                    _transactions.insert(0, {
                      'id': 'TX-${DateTime.now().millisecondsSinceEpoch % 1000000}',
                      'title': 'Linked Bank Deposit',
                      'category': 'Top Up',
                      'amount': amt,
                      'status': 'Completed',
                      'method': 'CBE Mobile',
                      'date': 'Today',
                      'ref': 'DEPOSIT-${DateTime.now().millisecondsSinceEpoch % 1000}',
                      'icon': Icons.add_circle,
                    });
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('🎉 Deposited ${amt.toLocaleString()} ETB successfully!'), backgroundColor: AppColors.success),
                  );
                });
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium, foregroundColor: Colors.black),
              child: const Text('DEPOSIT VIA CBE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black)),
            ),
          ],
        );
      },
    );
  }

  void _triggerWithdrawWorkflow() {
    final amountController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: const Text('SECURE WITHDRAWAL', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Transfer funds out of your Every-zone Available balance to your Telebirr account.', style: TextStyle(color: AppColors.textSecondary, fontSize: 10.5)),
              const SizedBox(height: 16),
              TextField(
                controller: amountController,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Amount (ETB)',
                  labelStyle: TextStyle(color: AppColors.textMuted),
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCEL', style: TextStyle(color: AppColors.textMuted))),
            ElevatedButton(
              onPressed: () {
                final amt = double.tryParse(amountController.text) ?? 0.0;
                if (amt <= 0 || amt > _availableBalance) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('⚠️ Insufficient funds or invalid amount'), backgroundColor: AppColors.error));
                  return;
                }
                Navigator.pop(context);
                _runBiometricVerification(() {
                  setState(() {
                    _availableBalance -= amt;
                    _transactions.insert(0, {
                      'id': 'TX-${DateTime.now().millisecondsSinceEpoch % 1000000}',
                      'title': 'Withdraw to Telebirr',
                      'category': 'Withdrawal',
                      'amount': -amt,
                      'status': 'Completed',
                      'method': 'Telebirr Link',
                      'date': 'Today',
                      'ref': 'WTDW-${DateTime.now().millisecondsSinceEpoch % 1000}',
                      'icon': Icons.arrow_upward,
                    });
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('💸 Dispatched ${amt.toLocaleString()} ETB to Telebirr wallet.'), backgroundColor: AppColors.success),
                  );
                });
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium, foregroundColor: Colors.black),
              child: const Text('WITHDRAW TO TELEBIRR', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black)),
            ),
          ],
        );
      },
    );
  }

  void _triggerTransferWorkflow() {
    final phoneController = TextEditingController();
    final amountController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: const Text('SECURE DIRECT TRANSFER', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Send peer-to-peer instant digital cash to another Every-zone user phone.', style: TextStyle(color: AppColors.textSecondary, fontSize: 10.5)),
              const SizedBox(height: 16),
              TextField(
                controller: phoneController,
                keyboardType: TextInputType.phone,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Recipient Phone (+251...)',
                  labelStyle: TextStyle(color: AppColors.textMuted),
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: amountController,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Amount (ETB)',
                  labelStyle: TextStyle(color: AppColors.textMuted),
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCEL', style: TextStyle(color: AppColors.textMuted))),
            ElevatedButton(
              onPressed: () {
                final phone = phoneController.text;
                final amt = double.tryParse(amountController.text) ?? 0.0;
                if (phone.isEmpty || amt <= 0 || amt > _availableBalance) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('⚠️ Invalid inputs or insufficient funds'), backgroundColor: AppColors.error));
                  return;
                }
                Navigator.pop(context);
                _runBiometricVerification(() {
                  setState(() {
                    _availableBalance -= amt;
                    _transactions.insert(0, {
                      'id': 'TX-${DateTime.now().millisecondsSinceEpoch % 1000000}',
                      'title': 'Transfer to $phone',
                      'category': 'Transfer',
                      'amount': -amt,
                      'status': 'Completed',
                      'method': 'P2P Wallet',
                      'date': 'Today',
                      'ref': 'TRSF-${DateTime.now().millisecondsSinceEpoch % 1000}',
                      'icon': Icons.swap_horiz,
                    });
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('🚀 Transferred ${amt.toLocaleString()} ETB to $phone successfully!'), backgroundColor: AppColors.success),
                  );
                });
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium, foregroundColor: Colors.black),
              child: const Text('TRANSFER NOW', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black)),
            ),
          ],
        );
      },
    );
  }

  void _triggerPayNodeWorkflow() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: const Text('MERCHANT QR PAY', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Icon(Icons.qr_code, size: 100, color: Colors.white24),
              SizedBox(height: 12),
              Text(
                'To pay a merchant node, launch the contactless scanner on the top-right of your marketplace home tab.',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 10.5, height: 1.4),
                textAlign: TextAlign.center,
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('DISMISS', style: TextStyle(color: AppColors.textMuted))),
          ],
        );
      },
    );
  }

  void _triggerTopUpWorkflow() {
    final voucherController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: const Text('VOUCHER SCRATCH-CARD TOP UP', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Enter your 14-digit physical Every-zone refill voucher scratch code.', style: TextStyle(color: AppColors.textSecondary, fontSize: 10.5)),
              const SizedBox(height: 16),
              TextField(
                controller: voucherController,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Voucher Refill Code (14 digits)',
                  labelStyle: TextStyle(color: AppColors.textMuted),
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCEL', style: TextStyle(color: AppColors.textMuted))),
            ElevatedButton(
              onPressed: () {
                final code = voucherController.text;
                if (code.length < 10) return;
                Navigator.pop(context);
                _runBiometricVerification(() {
                  setState(() {
                    _availableBalance += 1000.0;
                    _transactions.insert(0, {
                      'id': 'TX-${DateTime.now().millisecondsSinceEpoch % 1000000}',
                      'title': 'Voucher Card Recharge',
                      'category': 'Top Up',
                      'amount': 1000.0,
                      'status': 'Completed',
                      'method': 'Physical Pin',
                      'date': 'Today',
                      'ref': 'VCH-${DateTime.now().millisecondsSinceEpoch % 1000}',
                      'icon': Icons.add_to_photos,
                    });
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('🎉 Credited 1,000 ETB via Scratch-Card Voucher!'), backgroundColor: AppColors.success),
                  );
                });
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium, foregroundColor: Colors.black),
              child: const Text('RECHARGE 1,000 ETB', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black)),
            ),
          ],
        );
      },
    );
  }

  void _runBiometricVerification(VoidCallback onSuccess) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: const Text('VAULT VERIFICATION REQUIRED', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.black)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Icon(Icons.fingerprint, size: 54, color: AppColors.goldLight),
              SizedBox(height: 14),
              Text(
                'Scan fingerprint to sign direct debit contract authorization.',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 10.5),
                textAlign: TextAlign.center,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('DECLINE', style: TextStyle(color: AppColors.error)),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                onSuccess();
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.goldMedium, foregroundColor: Colors.black),
              child: const Text('AUTHENTICATE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.black)),
            ),
          ],
        );
      },
    );
  }

  void _showVaultSecurityNotice() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: const BorderSide(color: AppColors.border)),
          title: const Row(
            children: [
              Icon(Icons.gpp_good, color: AppColors.success, size: 20),
              SizedBox(width: 8),
              Text('VAULT CRYPTO SECURITY', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.black)),
            ],
          ),
          content: Text(
            'The Every-zone wallet uses joint multi-sig smart contracts via Chapa and the Commercial Bank of Ethiopia. Funds held in Escrow cannot be disbursed unless delivery coordinates verify physical parcel completion. Safe, sovereign, shielded.',
            style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 10, height: 1.5),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('UNDERSTOOD', style: TextStyle(color: AppColors.goldLight, fontWeight: FontWeight.bold, fontSize: 10))),
          ],
        );
      },
    );
  }
}

// Custom Spent line graph
class WalletSpendingPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final points = [
      Offset(0, size.height * 0.8),
      Offset(size.width * 0.2, size.height * 0.75),
      Offset(size.width * 0.4, size.height * 0.85),
      Offset(size.width * 0.6, size.height * 0.4),
      Offset(size.width * 0.8, size.height * 0.55),
      Offset(size.width, size.height * 0.2), // Peak spending in June (Habesha dress!)
    ];

    final path = Path();
    path.moveTo(points[0].dx, points[0].dy);
    for (int i = 1; i < points.length; i++) {
      final pPrev = points[i - 1];
      final pCurr = points[i];
      // Draw curve using cubic bezier control points
      path.cubicTo(
        pPrev.dx + (pCurr.dx - pPrev.dx) / 2,
        pPrev.dy,
        pPrev.dx + (pCurr.dx - pPrev.dx) / 2,
        pCurr.dy,
        pCurr.dx,
        pCurr.dy,
      );
    }

    // Draw area under curve gradient
    final fillPath = Path.from(path);
    fillPath.lineTo(size.width, size.height);
    fillPath.lineTo(0, size.height);
    fillPath.close();

    final fillPaint = Paint()
      ..shader = LinearGradient(
        colors: [AppColors.goldMedium.withOpacity(0.2), AppColors.goldMedium.withOpacity(0.0)],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    canvas.drawPath(fillPath, fillPaint);

    // Draw main glowing spending line
    final linePaint = Paint()
      ..color = AppColors.goldLight
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 3.0;

    canvas.drawPath(path, linePaint);

    // Draw nodes/points
    final pointPaint = Paint()
      ..color = AppColors.background
      ..style = PaintingStyle.fill;

    final ringPaint = Paint()
      ..color = AppColors.goldLight
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    for (var pt in points) {
      canvas.drawCircle(pt, 4.5, ringPaint);
      canvas.drawCircle(pt, 3.0, pointPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
