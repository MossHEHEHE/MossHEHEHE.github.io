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
    const self = this; // To reference the instance inside event listeners
  
    // Mousemove event listener for dragging and rotating
    paper.addEventListener('mousemove', (e) => {
      if (!self.holdingPaper) return; // Only move or rotate if paper is being held
  
      // Calculate mouse velocity for dragging
      self.mouseX = e.clientX;
      self.mouseY = e.clientY;
      self.velX = self.mouseX - self.prevMouseX;
      self.velY = self.mouseY - self.prevMouseY;
  
      if (self.rotating) {
        // Calculate angle for rotating the paper
        const dirX = self.mouseX - self.mouseTouchX;
        const dirY = self.mouseY - self.mouseTouchY;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;
        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = 180 * angle / Math.PI;
        degrees = (360 + Math.round(degrees)) % 360;
        self.rotation = degrees;
      }
  
      if (!self.rotating) {
        // Move the paper (dragging)
        self.currentPaperX += self.velX;
        self.currentPaperY += self.velY;
        paper.style.transform = `translateX(${self.currentPaperX}px) translateY(${self.currentPaperY}px) rotateZ(${self.rotation}deg)`;
      }
  
      self.prevMouseX = self.mouseX;
      self.prevMouseY = self.mouseY;
    });
  
    // Mouse down event listener to pick up the paper
    paper.addEventListener('mousedown', (e) => {
      if (self.holdingPaper) return; // Prevent multiple holds
  
      self.holdingPaper = true;
      paper.style.zIndex = highestZ; // Bring paper to the top
      highestZ += 1;
  
      self.mouseTouchX = self.mouseX;
      self.mouseTouchY = self.mouseY;
      self.prevMouseX = self.mouseX;
      self.prevMouseY = self.mouseY;
  
      if (e.button === 2) { // Right-click for rotating
        self.rotating = true;
      }
    });
  
    // Mouse up event listener to drop the paper
    window.addEventListener('mouseup', () => {
      self.holdingPaper = false;
      self.rotating = false;
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
  paper.style.display = 'none'; // Ensure papers are hidden initially
});

// Envelope interaction
const envelope = document.querySelector('.envelope');
let currentPaperIndex = 0;
let isAnimating = false;

envelope.addEventListener('click', function() {
  if (isAnimating) return;

  if (!this.classList.contains('opened')) {
    // First click - open envelope fully
    this.classList.add('opened');
    setTimeout(() => {
      this.style.opacity = '0';
      this.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        this.style.display = 'none';
        showNextPaper();
      }, 500);
    }, 500);
  }
});

function showNextPaper() {
  if (currentPaperIndex >= papers.length || isAnimating) return;  // Check if we're out of papers or if already animating

  isAnimating = true; 

  // Get the current paper to show
  const paper = papers[currentPaperIndex];

  // Only show the paper at the current index (i.e., only one paper at a time)
  paper.style.display = 'block'; 
  paper.style.zIndex = 1000 + currentPaperIndex; 

  // You can trigger animations or effects on the paper here
  setTimeout(() => {
    paper.classList.add('animate-out');

    // Wait for animation to complete
    setTimeout(() => {
      isAnimating = false;
      currentPaperIndex++;  // Move to the next paper
    }, 1000); // Animation duration
  }, 100); // Delay before animation starts
}

// Button event listeners
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// Added button functionality inside the DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Grab elements for the "Yes" and "No" buttons
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const valentineRequest = document.getElementById('valentine-request');
  const responseMessage = document.getElementById('response-message');

  // Show the response message when "Yes" is clicked
  yesBtn.addEventListener('click', () => {
    // Hide the "Valentine's Request" paper
    valentineRequest.style.display = 'none';
    
    // Show the response message
    responseMessage.style.display = 'block';
    responseMessage.classList.add('animate-in');  // You can add any animation classes here
  });

  // Optionally, show some fun effect or behavior when "No" is clicked
  noBtn.addEventListener('click', () => {
    alert("Oh no, maybe next time!");
  });

  // Add the teleport effect on hover over "No" button
  noBtn.addEventListener('mouseover', (e) => {
    const btn = e.target;

    // Generate a random position on the screen for the button to teleport to
    const newX = Math.random() * (window.innerWidth - btn.offsetWidth);
    const newY = Math.random() * (window.innerHeight - btn.offsetHeight);

    // Apply the new position
    btn.style.position = 'fixed'; // Fix the button's position so it doesn't move with the page scroll
    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
  });
});
