"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function FloatingBeans() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Device Pixel Ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resize);
    resize();

    // Mouse interaction
    let mouse = { x: width / 2, y: height / 2 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    class Bean {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotSpeed: number;
      baseX: number;
      baseY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 15 + 10;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1 - 0.5; // Drift slightly upwards
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw coffee bean shape
        ctx.fillStyle = "rgba(74, 54, 46, 0.4)"; // Dark brown, semi-transparent
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 1.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw the line in the middle
        ctx.strokeStyle = "rgba(43, 27, 20, 0.5)";
        ctx.lineWidth = this.size * 0.15;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(
          this.size * 0.5, -this.size * 0.5,
          -this.size * 0.5, this.size * 0.5,
          0, this.size
        );
        ctx.stroke();

        ctx.restore();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotSpeed;

        // Interaction with mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          
          this.x -= forceDirectionX * force * 5;
          this.y -= forceDirectionY * force * 5;
        }

        // Wrap around screen
        if (this.y < -this.size * 2) this.y = height + this.size * 2;
        if (this.y > height + this.size * 2) this.y = -this.size * 2;
        if (this.x < -this.size * 2) this.x = width + this.size * 2;
        if (this.x > width + this.size * 2) this.x = -this.size * 2;

        this.draw();
      }
    }

    const beansArray: Bean[] = [];
    for (let i = 0; i < 30; i++) {
      beansArray.push(new Bean());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < beansArray.length; i++) {
        beansArray[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.canvas
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
