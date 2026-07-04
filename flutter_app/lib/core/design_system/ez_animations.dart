import 'package:flutter/material.dart';

class EZAnimations {
  // 1. Hero Widget Wrapper
  static Widget hero({
    required String tag,
    required Widget child,
  }) {
    return Hero(
      tag: tag,
      transitionOnUserGestures: true,
      child: Material(
        color: Colors.transparent,
        child: child,
      ),
    );
  }

  // 2. Fade In Enter Transition
  static Widget fadeIn({
    required Widget child,
    Duration duration = const Duration(milliseconds: 500),
    Curve curve = Curves.easeOut,
  }) {
    return _EZFadeTransition(
      duration: duration,
      curve: curve,
      child: child,
    );
  }

  // 3. Scale In Enter Transition
  static Widget scaleIn({
    required Widget child,
    Duration duration = const Duration(milliseconds: 400),
    Curve curve = Curves.backOut,
    double beginScale = 0.85,
  }) {
    return _EZScaleTransition(
      duration: duration,
      curve: curve,
      beginScale: beginScale,
      child: child,
    );
  }

  // 4. Slide In Transition
  static Widget slideIn({
    required Widget child,
    Duration duration = const Duration(milliseconds: 500),
    Curve curve = Curves.fastOutSlowIn,
    Offset beginOffset = const Offset(0.0, 0.2),
  }) {
    return _EZSlideTransition(
      duration: duration,
      curve: curve,
      beginOffset: beginOffset,
      child: child,
    );
  }

  // 5. Ripple Container Splash Wrapper
  static Widget ripple({
    required Widget child,
    required VoidCallback onTap,
    BorderRadius? borderRadius,
    Color? splashColor,
  }) {
    return Stack(
      children: [
        child,
        Positioned.fill(
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onTap,
              borderRadius: borderRadius,
              splashColor: splashColor ?? Colors.white.withOpacity(0.08),
              highlightColor: Colors.white.withOpacity(0.03),
              child: const SizedBox.expand(),
            ),
          ),
        ),
      ],
    );
  }

  // 6. Card Expansion Layout (Smoothly animates size when child dimensions change)
  static Widget cardExpansion({
    required Widget child,
    Duration duration = const Duration(milliseconds: 300),
    Curve curve = Curves.easeInOut,
  }) {
    return AnimatedSize(
      duration: duration,
      curve: curve,
      alignment: Alignment.topCenter,
      child: child,
    );
  }

  // 7. Page Transition (Custom sliding & fading route builder)
  static Route<T> pageTransition<T>(Widget page) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        final slideTween = Tween<Offset>(
          begin: const Offset(0.0, 0.05),
          end: Offset.zero,
        ).chain(CurveTween(curve: Curves.fastOutSlowIn));

        final fadeTween = Tween<double>(
          begin: 0.0,
          end: 1.0,
        ).chain(CurveTween(curve: Curves.easeIn));

        return SlideTransition(
          position: animation.drive(slideTween),
          child: FadeTransition(
            opacity: animation.drive(fadeTween),
            child: child,
          ),
        );
      },
    );
  }
}

// Private implementation for Fade Transition
class _EZFadeTransition extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final Curve curve;

  const _EZFadeTransition({
    required this.child,
    required this.duration,
    required this.curve,
  });

  @override
  State<_EZFadeTransition> createState() => _EZFadeTransitionState();
}

class _EZFadeTransitionState extends State<_EZFadeTransition> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    _animation = CurvedAnimation(parent: _controller, curve: widget.curve);
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _animation,
      child: widget.child,
    );
  }
}

// Private implementation for Scale Transition
class _EZScaleTransition extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final Curve curve;
  final double beginScale;

  const _EZScaleTransition({
    required this.child,
    required this.duration,
    required this.curve,
    required this.beginScale,
  });

  @override
  State<_EZScaleTransition> createState() => _EZScaleTransitionState();
}

class _EZScaleTransitionState extends State<_EZScaleTransition> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    _animation = Tween<double>(begin: widget.beginScale, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: widget.curve),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _animation,
      child: widget.child,
    );
  }
}

// Private implementation for Slide Transition
class _EZSlideTransition extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final Curve curve;
  final Offset beginOffset;

  const _EZSlideTransition({
    required this.child,
    required this.duration,
    required this.curve,
    required this.beginOffset,
  });

  @override
  State<_EZSlideTransition> createState() => _EZSlideTransitionState();
}

class _EZSlideTransitionState extends State<_EZSlideTransition> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    _animation = Tween<Offset>(begin: widget.beginOffset, end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: widget.curve),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: _animation,
      child: widget.child,
    );
  }
}
