class PomodoroTimer {
  constructor() {
    this.isRunning = false;
    this.isPaused = false;
    this.isWorkSession = true;
    this.timeLeft = 25 * 60; // 25분을 초로 변환
    this.completedSessions = 0;
    this.timer = null;
    
    this.initElements();
    this.initEventListeners();
    this.updateDisplay();
    this.loadSettings();
  }
  
  initElements() {
    this.minutesEl = document.getElementById('minutes');
    this.secondsEl = document.getElementById('seconds');
    this.timerLabelEl = document.getElementById('timer-label');
    this.startBtn = document.getElementById('start-btn');
    this.pauseBtn = document.getElementById('pause-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.workTimeInput = document.getElementById('work-time');
    this.breakTimeInput = document.getElementById('break-time');
    this.completedSessionsEl = document.getElementById('completed-sessions');
    this.timerDisplay = document.querySelector('.timer-display');
  }
  
  initEventListeners() {
    this.startBtn.addEventListener('click', () => this.start());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.resetBtn.addEventListener('click', () => this.reset());
    
    this.workTimeInput.addEventListener('change', () => this.updateWorkTime());
    this.breakTimeInput.addEventListener('change', () => this.updateBreakTime());
    
    // 페이지 가시성 변경 감지 (백그라운드에서도 타이머 동작)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isRunning) {
        this.lastTime = Date.now();
      } else if (!document.hidden && this.isRunning && this.lastTime) {
        const elapsed = Math.floor((Date.now() - this.lastTime) / 1000);
        this.timeLeft = Math.max(0, this.timeLeft - elapsed);
        this.updateDisplay();
        if (this.timeLeft === 0) {
          this.complete();
        }
      }
    });
  }
  
  start() {
    if (this.isPaused) {
      this.isPaused = false;
    }
    
    this.isRunning = true;
    this.startBtn.disabled = true;
    this.pauseBtn.disabled = false;
    this.timerDisplay.classList.add('running');
    
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      
      if (this.timeLeft <= 60 && this.timeLeft > 0) {
        this.timerDisplay.classList.add('warning');
      }
      
      if (this.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
  }
  
  pause() {
    this.isPaused = true;
    this.isRunning = false;
    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;
    this.timerDisplay.classList.remove('running');
    
    clearInterval(this.timer);
  }
  
  reset() {
    this.isRunning = false;
    this.isPaused = false;
    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;
    this.timerDisplay.classList.remove('running', 'warning');
    
    clearInterval(this.timer);
    
    if (this.isWorkSession) {
      this.timeLeft = parseInt(this.workTimeInput.value) * 60;
    } else {
      this.timeLeft = parseInt(this.breakTimeInput.value) * 60;
    }
    
    this.updateDisplay();
  }
  
  complete() {
    this.isRunning = false;
    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;
    this.timerDisplay.classList.remove('running', 'warning');
    
    clearInterval(this.timer);
    
    // 알림 및 진동
    this.notify();
    
    if (this.isWorkSession) {
      this.completedSessions++;
      this.completedSessionsEl.textContent = this.completedSessions;
      this.saveStats();
      
      // 휴식 시간으로 전환
      this.isWorkSession = false;
      this.timeLeft = parseInt(this.breakTimeInput.value) * 60;
      this.timerLabelEl.textContent = '휴식 시간';
    } else {
      // 작업 시간으로 전환
      this.isWorkSession = true;
      this.timeLeft = parseInt(this.workTimeInput.value) * 60;
      this.timerLabelEl.textContent = '집중 시간';
    }
    
    this.updateDisplay();
  }
  
  notify() {
    // 브라우저 알림
    if ('Notification' in window && Notification.permission === 'granted') {
      const message = this.isWorkSession ? '휴식 시간입니다!' : '집중 시간입니다!';
      new Notification('포모도로 타이머', {
        body: message,
        icon: '🍅'
      });
    }
    
    // 진동 (모바일)
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    // 오디오 알림 (간단한 beep 소리)
    this.playBeep();
  }
  
  playBeep() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }
  
  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    
    this.minutesEl.textContent = minutes.toString().padStart(2, '0');
    this.secondsEl.textContent = seconds.toString().padStart(2, '0');
  }
  
  updateWorkTime() {
    if (this.isWorkSession && !this.isRunning) {
      this.timeLeft = parseInt(this.workTimeInput.value) * 60;
      this.updateDisplay();
    }
    this.saveSettings();
  }
  
  updateBreakTime() {
    if (!this.isWorkSession && !this.isRunning) {
      this.timeLeft = parseInt(this.breakTimeInput.value) * 60;
      this.updateDisplay();
    }
    this.saveSettings();
  }
  
  saveSettings() {
    localStorage.setItem('pomodoroSettings', JSON.stringify({
      workTime: this.workTimeInput.value,
      breakTime: this.breakTimeInput.value
    }));
  }
  
  loadSettings() {
    const saved = localStorage.getItem('pomodoroSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      this.workTimeInput.value = settings.workTime;
      this.breakTimeInput.value = settings.breakTime;
      this.timeLeft = parseInt(settings.workTime) * 60;
      this.updateDisplay();
    }
    
    const stats = localStorage.getItem('pomodoroStats');
    if (stats) {
      this.completedSessions = parseInt(stats);
      this.completedSessionsEl.textContent = this.completedSessions;
    }
  }
  
  saveStats() {
    localStorage.setItem('pomodoroStats', this.completedSessions.toString());
  }
}

// 알림 권한 요청
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  new PomodoroTimer();
});
