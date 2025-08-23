'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

// FAQ data with keyword-rich content
const faqData = [
  {
    id: 'remove-spaces',
    question: 'Why remove spaces from filenames?',
    answer: `Removing spaces from filenames prevents broken URLs, upload errors, and SEO issues. Web servers often replace spaces with %20, which creates messy, unprofessional links. Search engines prefer clean, keyword-rich filenames, and developers avoid spaces because they break scripts, command lines, and APIs. FileFixer automatically converts spaces to hyphens (kebab-case), giving you web-safe, SEO-optimized filenames that work across Windows, macOS, Linux, and databases.`
  },
  {
    id: 'batch-rename',
    question: 'How to batch rename files online?',
    answer: `**Batch file renaming with FileFixer is fast and secure:**[MARGIN_BOTTOM_2REM]

**Upload your files** – drop up to 10 files free, or unlimited with Pro. Works for images, PDFs, videos, or documents.

**Choose a naming style** – lowercase, kebab-case, camelCase, PascalCase, or snake_case.

**Download instantly** – your cleaned files are zipped and ready no matter the size.

[MARGIN_TOP_2REM][MARGIN_BOTTOM_2REM]**Benefits of using FileFixer for bulk renaming:**
• Pro users can rename unlimited files. The free plan allows for 10 files per day.
• Web & SEO-friendly filenames for images, blogs, and ecommerce stores.
• Works on any device with a browser, with all processing done client-side for privacy.`
  },
  {
    id: 'naming-conventions',
    question: 'What is lowercase vs kebab-case vs camelCase, etc?',
    answer: '##Lowercase## (`myfilename.jpg`) filenames are strongly recommended for web uploads to avoid case-sensitivity issues.\n\n##Kebab-case## (`my-file-name.jpg`) is best for websites and SEO. Hyphens separate words, making filenames clean, readable, and search-engine friendly.\n\n##camelCase## (`myFileName.jpg`) is common in programming and JavaScript projects where compact naming is needed.\n\n##snake_case## (`my_file_name.jpg`) works well for Python, SQL, and databases.\n\n##PascalCase## (`MyFileName.jpg`) is used in some coding environments and APIs.\n\n[MARGIN_TOP_2REM]FileFixer supports all these naming conventions so your files stay organized, compatible, and professional.'
  },
  {
    id: 'security',
    question: 'Is FileFixer secure?',
    answer: `Yes. FileFixer is built by devs with privacy-first security:

• **100% client-side** - your files never leave your browser.
• **No uploads, no storage, no tracking** of file contents.
• **Encrypted HTTPS** for all connections.

[MARGIN_TOP_2REM][MARGIN_BOTTOM_2REM]Your files never leave your computer. All renaming happens securely within your browser, and we never see, save, or store any of your data.

[MARGIN_TOP_2REM][MARGIN_BOTTOM_2REM]Unlike many online tools, FileFixer never stores your original filenames, file data, or metadata.`
  },
  {
    id: 'pro-features',
    question: 'What does Pro include?',
    answer: `FileFixer Pro is designed for power users, businesses, and creators who need unlimited, ad-free file renaming:[MARGIN_BOTTOM_2REM]

• **Unlimited renaming**: no 10-file daily limit.
• **No Ads**
• **Priority support**: direct help via email with faster response times
• **Commercial use**: FileFixer Pro for client work and ecommerce projects.

[MARGIN_TOP_2REM]**Pricing**: £4/month, £29/year, or £59.99 lifetime (one-time).`
  },
  {
    id: 'contact-filefixer',
    question: 'How can I contact FileFixer?',
    answer: `FileFixer is built as a fast, self-service tool, so free users don't need to create an account or contact support. All instructions and features are available directly in the app.

[MARGIN_TOP_2REM][SignUpForPro](/pro) to become a File Wizard and receive priority technical support.`
  },
  {
    id: 'seo-images',
    question: 'Can I rename images for SEO?',
    answer: `Yes. Renaming images is one of the fastest ways to improve SEO. Search engines use filenames to understand image content.

[MARGIN_TOP_2REM][MARGIN_BOTTOM_2REM]**Best practices for SEO-optimized image filenames:**
• Use descriptive, keyword-rich names (modern-kitchen-design.jpg).
• Separate words with hyphens.
• Keep names short (<60 characters).
• Use lowercase letters only.

Clean image filenames improve Google Images ranking, accessibility for screen readers, and overall site SEO performance.`
  },
  {
    id: 'cancel-subscription',
    question: 'Can I cancel my FileFixer Pro subscription anytime?',
    answer: `Yes. FileFixer Pro is a no-contract subscription, and you can cancel anytime directly through the secure [Lemon Squeezy](https://www.lemonsqueezy.com/) customer portal. After cancellation, you'll still keep Pro benefits until the end of your billing period. [Lemon Squeezy](https://www.lemonsqueezy.com/) also lets you update payment details, switch between monthly and yearly plans, or view your billing history.`
  }
];

import Link from 'next/link';

export default function FAQ() {
  const { data: session } = useSession();
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Check if user is Pro for contact info
  const user = session?.user as { isPro?: boolean; role?: string } | undefined;
  const isPro = user?.isPro || user?.role === 'admin';

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, var(--color-turquoise), var(--color-chartreuse))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Frequently Asked Questions
          </h1>
          <p style={{ 
            fontSize: '1.1rem',
            color: 'white',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Everything you need to know about FileFixer&apos;s batch file renaming, 
            SEO optimization, and file cleaning services.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ marginBottom: '2rem' }}>
          {faqData
            .filter((item) => {
              // Hide contact FAQ for Pro users
              if (item.id === 'contact-filefixer' && isPro) {
                return false;
              }
              return true;
            })
            .map((item) => (
            <div 
              key={item.id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--border-radius)',
                marginBottom: '1rem',
                overflow: 'hidden',
                backgroundColor: 'var(--card-background)'
              }}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleItem(item.id)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-background)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ color: 'white' }}>{item.question}</span>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="var(--color-danger)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{
                    transform: openItems.includes(item.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    flexShrink: 0
                  }}
                >
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>

              {/* Answer Content */}
              {openItems.includes(item.id) && (
                <div style={{
                  padding: '2rem',
                  borderTop: '1px solid var(--border)',
                  backgroundColor: 'var(--background)'
                }}>
                  <div style={{
                    color: 'white',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-line'
                  }}>
                    {item.answer.split('\n').map((line, index) => {
                      // Handle margin indicators
                      let marginTop = '0';
                      let marginBottom = '0';
                      let cleanLine = line;
                      
                      if (line.includes('[MARGIN_TOP_2REM]')) {
                        marginTop = '2rem';
                        cleanLine = cleanLine.replace('[MARGIN_TOP_2REM]', '');
                      }
                      if (line.includes('[MARGIN_BOTTOM_2REM]')) {
                        marginBottom = '2rem';
                        cleanLine = cleanLine.replace('[MARGIN_BOTTOM_2REM]', '');
                      }
                      
                      // Convert **text** to bold, ##text## to colored headings, `code` to code styling, [text](url) to links, and [SignUpForPro](url) to special links
                      const parts = cleanLine.split(/(\*\*[^*]+\*\*|##[^#]+##|`[^`]+`|\[SignUpForPro\]\([^)]+\)|\[[^\]]+\]\([^)]+\))/g);
                      return (
                        <div key={index} style={{ marginTop, marginBottom }}>
                          {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong key={partIndex} style={{ fontWeight: 'bold' }}>
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            } else if (part.startsWith('##') && part.endsWith('##')) {
                              return (
                                <span key={partIndex} style={{ 
                                  fontWeight: 'bold',
                                  color: 'var(--color-warning)'
                                }}>
                                  {part.slice(2, -2)}
                                </span>
                              );
                            } else if (part.startsWith('`') && part.endsWith('`')) {
                              return (
                                <code key={partIndex} style={{ 
                                  backgroundColor: 'var(--color-turquoise)',
                                  color: 'var(--color-accent)',
                                  padding: '0.2rem 0.4rem',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.9em',
                                  fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                                }}>
                                  {part.slice(1, -1)}
                                </code>
                              );
                            } else if (part.match(/\[SignUpForPro\]\([^)]+\)/)) {
                              // Handle Sign up for Pro link with special styling
                              const linkMatch = part.match(/\[SignUpForPro\]\(([^)]+)\)/);
                              if (linkMatch) {
                                return (
                                  <Link
                                    key={partIndex}
                                    href={linkMatch[1]}
                                    style={{
                                      color: 'var(--color-warning)',
                                      textDecoration: 'none',
                                      fontWeight: 'bold',
                                      position: 'relative',
                                      display: 'inline-block'
                                    }}
                                    onMouseEnter={(e) => {
                                      const underline = e.currentTarget.querySelector('.signup-underline-animation') as HTMLElement;
                                      if (underline) {
                                        underline.style.width = '100%';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      const underline = e.currentTarget.querySelector('.signup-underline-animation') as HTMLElement;
                                      if (underline) {
                                        underline.style.width = '0%';
                                      }
                                    }}
                                  >
                                    Sign up for Pro
                                    <span 
                                      className="signup-underline-animation"
                                      style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '0',
                                        width: '0%',
                                        height: '2px',
                                        backgroundColor: 'var(--color-warning)',
                                        transition: 'width 0.3s ease'
                                      }}
                                    />
                                  </Link>
                                );
                              }
                            } else if (part.match(/\[[^\]]+\]\([^)]+\)/)) {
                              // Handle markdown links [text](url)
                              const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                              if (linkMatch) {
                                return (
                                  <a 
                                    key={partIndex} 
                                    href={linkMatch[2]} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{
                                      color: 'var(--color-warning)',
                                      textDecoration: 'underline',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {linkMatch[1]}
                                  </a>
                                );
                              }
                            }
                            return part;
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section - Only for Pro Users */}
        {isPro && (
          <div style={{
            padding: '1rem',
            border: '1px solid var(--color-turquoise)',
            borderRadius: 'var(--border-radius)',
            backgroundColor: 'var(--card-background)',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: 'var(--color-turquoise)'
            }}>
              Pro Support
            </h2>
            <p style={{ 
              color: 'white',
              marginBottom: '1rem'
            }}>
              Need help or have a feature request? As a Pro user, you have direct access to our support team.
            </p>
            <a 
              href="mailto:support@filefixer.app"
              style={{
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: '600',
                position: 'relative',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                const underline = e.currentTarget.querySelector('.underline-animation') as HTMLElement;
                if (underline) {
                  underline.style.width = '100%';
                }
              }}
              onMouseLeave={(e) => {
                const underline = e.currentTarget.querySelector('.underline-animation') as HTMLElement;
                if (underline) {
                  underline.style.width = '0%';
                }
              }}
            >
              support@filefixer.app
              <span 
                className="underline-animation"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '0%',
                  height: '2px',
                  backgroundColor: 'var(--color-danger)',
                  transition: 'width 0.3s ease'
                }}
              />
            </a>
          </div>
        )}

        {/* Back to App */}
        <div style={{ textAlign: 'center' }}>
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: 'var(--color-turquoise)',
              color: 'var(--color-warning)',
              textDecoration: 'none',
              borderRadius: 'var(--border-radius)',
              fontWeight: '600',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back to FileFixer
          </Link>
        </div>
      </div>
    </div>
  );
}
