# Training & tDCS — Flutter

**File:** `lib/screens/training_screen.dart`

The Training screen is the cognitive enhancement hub. It groups all active modalities — cognitive games, binaural audio, and tDCS neurostimulation — with a hardware gate that validates device connectivity before any session.

## Screen Structure

```
TrainingScreen
├── Cognitive Training Modules
│   ├── Focus Enhancement → ConcentrationPuzzleScreen
│   └── Memory Training → MemoryTrainingScreen
├── Binaural Beats Presets
│   ├── Alpha Wave Relaxation (30 min) — inline player
│   └── Theta Wave Meditation (45 min) — inline player
└── tDCS Settings
    ├── Intensity Slider (0–100%)
    └── "Start tDCS Session" button → hardware gate → TdcsSessionScreen
```

## Device Settings Sync

The screen loads the user's saved intensity preference from the backend on `initState`:

```dart
@override
void initState() {
  super.initState();
  _loadDeviceSettings();
}

Future<void> _loadDeviceSettings() async {
  final settings = await ApiService.getDeviceSettings();
  setState(() {
    _intensityLevel = (settings['intensityLevel'] as num?)?.toDouble() ?? 0.5;
  });
}

// Auto-saves on slider release (debounced by Flutter's onChangeEnd)
Future<void> _saveIntensity(double value) async {
  await ApiService.updateDeviceSettings(value);
}
```

**API calls:**
- `GET /users/me/device-settings` — load intensity
- `PUT /users/me/device-settings` — save intensity

## tDCS Hardware Gate

Before starting a tDCS session, the app **validates that a tDCS-compatible device is registered**:

```dart
Future<void> _startTdcsSession() async {
  final devices = await ApiService.getDevices();
  final hasTdcs = devices.any((d) =>
    d['name'].toString().toLowerCase().contains('tdcs') ||
    d['name'].toString().toLowerCase().contains('halo')
  );
  
  if (!hasTdcs) {
    showGlassToast(context, "Please connect a tDCS device first.");
    Navigator.push(context, GlassPageRoute(page: const MyDevicesScreen()));
    return;
  }
  
  // Show duration picker: 10 / 15 / 20 minutes
  _showDurationPicker();
}
```

This prevents users from starting a stimulation session without hardware attached.

## Duration Picker

An animated `AlertDialog` lets users choose 10, 15, or 20 minutes before confirming:

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: [10, 15, 20].map((duration) {
    final isSelected = selectedDuration == duration;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        color: isSelected ? const Color(0xFF8B5CF6) : Colors.transparent,
        border: Border.all(color: const Color(0xFF8B5CF6)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text("$duration min"),
    );
  }).toList(),
)
```

## tDCS Session Screen (`tdcs_session_screen.dart`)

The live stimulation session UI, launched with:

```dart
Navigator.push(context, GlassPageRoute(
  page: TdcsSessionScreen(
    initialIntensity: _intensityLevel,
    durationMinutes: selectedDuration,
  ),
));
```

**Features:**
- Animated pulsing visualization of stimulation waveform
- Live countdown timer
- Auto-creates a `FocusSession` via `POST /sessions` on start
- Auto-completes via `POST /sessions/:id/complete` on finish
- Fires notification: "Session Completed! 🎉"

## Memory Training (`memory_training_screen.dart`)

Pattern recall game with progressive difficulty:
- Shows a sequence of colored tiles
- User must reproduce the sequence from memory
- Difficulty increases with each successful round
- Score submitted: `POST /sessions/:id/score`

## Concentration Puzzle (`concentration_puzzle_screen.dart`)

Focus-based puzzle mechanics:
- Requires sustained attention to solve progressive puzzles
- Tracks completion time and accuracy
- Score and time submitted on completion

## Binaural Beats Player

Audio presets are toggled inline with a `StatefulWidget`:

```dart
void _toggleAudio(String title) {
  setState(() {
    _currentlyPlaying = (_currentlyPlaying == title) ? null : title;
  });
  if (_currentlyPlaying != null) {
    showGlassToast(context, "Now playing: $title...", isError: false);
  }
}
```

| Preset | Duration | Benefit |
|--------|----------|---------|
| Alpha Wave Relaxation | 30 min | Stress relief |
| Theta Wave Meditation | 45 min | Creative thinking |
