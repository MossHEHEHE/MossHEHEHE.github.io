let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    paper.addEventListener('animationend', (e) => {
      if (e.animationName === 'paperOut') {
        this.addDragListeners(paper);
      }
    });
  }

  addDragListeners(paper) {
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      
      if(this.rotating) {
        this.rotation = degrees;
      }
      
      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });
    
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }

  addSpecialEffects(paper) {
    paper.addEventListener('dblclick', () => {
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation + 360}deg)`;
      setTimeout(() => {
        paper.style.transition = 'transform 0.3s ease';
      }, 0);
    });
  }
}

// Initialize papers
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
  p.addSpecialEffects(paper);
});

// Hide all papers initially
papers.forEach(paper => {
  paper.style.display = 'none';
});

// Envelope interaction
const envelope = document.querySelector('.envelope'); // Get existing envelope instead of creating new one
let currentPaperIndex = 0;
let isAnimating = false;

envelope.addEventListener('click', function() {
  if (isAnimating) return;
  
  if (!this.classList.contains('opened')) {
    // First click - open envelope fully
    this.classList.add('opened');
    setTimeout(showNextPaper, 500);
  } else {
    showNextPaper();
  }
});

function showNextPaper() {
  if (currentPaperIndex >= papers.length || isAnimating) return;
  
  isAnimating = true;
  const paper = papers[currentPaperIndex];
  
  // Position paper inside envelope
  paper.style.display = 'block';
  paper.style.zIndex = 1000 + currentPaperIndex;
  
  // Trigger animation
  setTimeout(() => {
    paper.classList.add('animate-out');
    
    // Animation complete
    setTimeout(() => {
      isAnimating = false;
      currentPaperIndex++;
    }, 1000);
  }, 100);
}

// Button event listeners
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

yesBtn.addEventListener('click', () => {
  const responseMessage = document.getElementById('response-message');
  responseMessage.style.display = 'block';
  responseMessage.classList.add('celebrate');
  createHeartConfetti();
  document.getElementById('valentine-request').style.display = 'none';
  
  // Create extra flower celebration
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      createPetal();
    }, i * 100);
  }
  document.body.classList.add('celebrate-active');
  document.querySelector('.paper.heart').classList.add('show');
  createFlowerAnimation();
});

noBtn.addEventListener('mouseover', (e) => {
  const btn = e.target;
  const newX = Math.random() * (window.innerWidth - btn.offsetWidth);
  const newY = Math.random() * (window.innerHeight - btn.offsetHeight);
  btn.style.position = 'fixed';
  btn.style.left = newX + 'px';
  btn.style.top = newY + 'px';
});

function createHeartConfetti() {
  for (let i = 0; i < 50; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '-20px';
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
    document.body.appendChild(heart);
    setTimeout(() => {
      heart.remove();
    }, 5000);
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(360deg);
    }
  }
`;
document.head.appendChild(style);

// Create and animate flowers
function createFlowerAnimation() {
  // Create bouquet
  const bouquet = document.createElement('img');
  bouquet.src = 'https://i.imgur.com/8kHcfoF.png'; // Flower bouquet image
  bouquet.className = 'bouquet';
  document.body.appendChild(bouquet);

  // Create falling petals
  const petalImages = [
    '🌸', '🌺', '🌹', '🌷', '💐'
  ];

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'flower-petal';
    petal.innerHTML = petalImages[Math.floor(Math.random() * petalImages.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.fontSize = (Math.random() * 20 + 10) + 'px';
    petal.style.animationDuration = (Math.random() * 3 + 3) + 's';
    document.body.appendChild(petal);

    // Remove petal after animation
    setTimeout(() => {
      petal.remove();
    }, 6000);
  }

  // Create initial petals
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createPetal();
    }, i * 300);
  }

  // Continue creating petals
  setInterval(() => {
    createPetal();
  }, 1000);
}