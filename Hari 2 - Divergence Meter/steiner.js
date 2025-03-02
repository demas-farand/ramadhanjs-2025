window.addEventListener('load', function() {
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.3;
    
    function startMusic() {
        bgMusic.play().catch(() => {
            document.addEventListener('click', startMusic, { once: true });
        });
    }
    
    startMusic();
});

class Digit {
    constructor(container) {
        this.container = container;
        this.digits = container.querySelector('.digits');
        this.currentValue = Math.floor(Math.random() * 10);
        this.digits.style.transform = `translateY(-${this.currentValue}em)`;
    }

    update(value) {
        const diff = (value - this.currentValue + 10) % 10;
        this.digits.style.transform = `translateY(-${value}em)`;
        this.currentValue = value;
    }
}

const digits = Array.from(document.querySelectorAll('.digit')).map(d => new Digit(d));

function generateDivergence() {
    return Array.from({length: 6}, () => Math.floor(Math.random() * 10)).join('');
}

function autoUpdate() {
    const newNumber = generateDivergence();
    digits.forEach((digit, i) => {
        setTimeout(() => {
            digit.update(parseInt(newNumber[i]));
        }, i * 50);
    });
}

digits.forEach(digit => {
    digit.digits.style.transition = 'none';
    digit.update(Math.floor(Math.random() * 10));
    void digit.digits.offsetHeight;
    digit.digits.style.transition = '';
});

setInterval(autoUpdate, 3000);

function createCircuitBackground(canvas) {
    const ctx = canvas.getContext('2d');
    const nodes = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createNodes() {
        nodes.length = 0;
        for(let i = 0; i < 50; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#FF450022';
        
       
        nodes.forEach((a, i) => {
            nodes.slice(i + 1).forEach(b => {
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if(dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            });
        });
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            if(node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if(node.y < 0 || node.y > canvas.height) node.vy *= -1;
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    createNodes();
    draw();
}
createCircuitBackground(document.getElementById('circuit'));

setTimeout(() => {
    document.getElementById('meter').click();
}, 1000);