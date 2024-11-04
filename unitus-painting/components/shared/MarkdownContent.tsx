"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Markdown components
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false
});

const RemarkGfm = dynamic(() => import('remark-gfm'), {
  ssr: false
});

// Dynamically import SyntaxHighlighter
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => mod.Prism),
  { ssr: false }
);

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content = '', className = '' }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="min-h-[200px] bg-gray-50 animate-pulse" />;
  }

  const components = {
    h1: ({ ...props }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 block" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-3xl font-semibold mt-8 mb-4 block" {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className="text-2xl font-semibold mt-6 mb-3 block" {...props} />
    ),
    h4: ({ ...props }) => (
      <h4 className="text-xl font-semibold mt-4 mb-2 block" {...props} />
    ),
    p: ({ ...props }) => (
      <p className="mt-4 mb-4 text-gray-700 leading-relaxed block whitespace-pre-wrap" {...props} />
    ),
    pre: ({ ...props }) => (
      <pre className="mt-4 mb-4 block overflow-auto" {...props} />
    ),
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          language={match[1]}
          PreTag="div"
          className="rounded-lg my-4"
          showLineNumbers
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[RemarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;