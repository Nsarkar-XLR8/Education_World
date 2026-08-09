'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: '📚',
    title: 'Bookstore',
    description: 'Browse and buy books for school, college, and university. Discounts available for students.',
    color: 'var(--primary)',
    bg: 'var(--primary-50)',
  },
  {
    icon: '🎓',
    title: 'Find Tuition',
    description: 'Connect with tutors and students. Search by subject, location, and availability.',
    color: 'var(--secondary)',
    bg: '#E6FFF9',
  },
  {
    icon: '🧸',
    title: 'Kids Zone',
    description: 'Interactive books, educational games, and fun activities for children of all ages.',
    color: 'var(--accent-coral)',
    bg: '#FFE6E6',
  },
  {
    icon: '✈️',
    title: 'Study Abroad',
    description: 'Explore universities worldwide. Compare tuition fees, scholarships, and living costs.',
    color: 'var(--accent-sky)',
    bg: '#E6F3FF',
  },
  {
    icon: '🎙️',
    title: 'Voice Control',
    description: 'Navigate the platform hands-free using voice commands powered by Web Speech API.',
    color: 'var(--accent-warm)',
    bg: '#FFF9E6',
  },
  {
    icon: '💬',
    title: 'Messaging',
    description: 'Chat with tutors, students, and book sellers directly on the platform.',
    color: 'var(--accent-rose)',
    bg: '#FFE6F0',
  },
];

const stats = [
  { number: '10K+', label: 'Books Available' },
  { number: '5K+', label: 'Active Students' },
  { number: '1.2K+', label: 'Verified Tutors' },
  { number: '50+', label: 'Countries Covered' },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.hero-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.hero-actions', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
      });

      gsap.from('.hero-visual', {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out',
      });

      // Feature cards — staggered reveal on scroll
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
      });

      // Stats — count up animation
      gsap.from('.stat-number', {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      });

      // CTA section
      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="section-hero" ref={heroRef}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }}>
            <div>
              <h1 className="hero-title" style={{ marginBottom: 'var(--space-6)' }}>
                Learn Without <br />
                <span className="text-gradient">Boundaries</span>
              </h1>
              <p className="hero-subtitle" style={{ fontSize: 'var(--text-lg)', maxWidth: '520px', marginBottom: 'var(--space-8)' }}>
                One platform for books, tuition, games, and global education resources.
                Designed for learners of every age — from kids to university students.
              </p>
              <div className="hero-actions" style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <Link href="/signup" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link href="/books" className="btn btn-secondary btn-lg">
                  Browse Books
                </Link>
              </div>
            </div>
            <div className="hero-visual" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '420px',
                height: '380px',
                borderRadius: 'var(--radius-2xl)',
                background: 'linear-gradient(135deg, var(--primary-100) 0%, var(--secondary-light) 50%, var(--accent-warm) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '120px',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                📖
                <div style={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-10%',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-15%',
                  left: '-10%',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="section" ref={featuresRef}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
            <h2>Everything You Need to <span className="text-gradient">Succeed</span></h2>
            <p style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: 'var(--space-4) auto 0' }}>
              From interactive kids&apos; games to university-level resources, we&apos;ve got every stage of learning covered.
            </p>
          </div>
          <div className="grid grid-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card card"
                style={{ textAlign: 'center', padding: 'var(--space-8)' }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-xl)',
                  background: feature.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  margin: '0 auto var(--space-5)',
                }}>
                  {feature.icon}
                </div>
                <h4 style={{ marginBottom: 'var(--space-3)', color: feature.color }}>{feature.title}</h4>
                <p style={{ fontSize: 'var(--text-sm)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="section-alt" ref={statsRef}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-8)',
            textAlign: 'center',
          }}>
            {stats.map((stat, i) => (
              <div key={i} className="stat-number">
                <div style={{
                  fontSize: 'var(--text-5xl)',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--primary)',
                  marginBottom: 'var(--space-2)',
                }}>
                  {stat.number}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="section" ref={ctaRef}>
        <div className="container">
          <div className="cta-content card-gradient" style={{
            textAlign: 'center',
            padding: 'var(--space-16) var(--space-8)',
            borderRadius: 'var(--radius-2xl)',
          }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>
              Ready to Start Your <span className="text-gradient">Learning Journey</span>?
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', maxWidth: '500px', margin: '0 auto var(--space-8)' }}>
              Join thousands of students already using Education World. It&apos;s free to get started.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
              <Link href="/signup" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
