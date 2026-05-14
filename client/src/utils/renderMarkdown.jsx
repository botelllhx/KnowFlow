import React from 'react';

const renderInline = (text, key) => {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[2]) parts.push(<strong key={`b${i++}`}>{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={`i${i++}`}>{match[3]}</em>);
    else if (match[4]) parts.push(<code key={`c${i++}`} style={{ background: '#f1f5f9', padding: '1px 4px', borderRadius: 3, fontSize: '0.85em', fontFamily: 'monospace' }}>{match[4]}</code>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <span key={key}>{parts}</span>;
};

const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let ulItems = [];
  let olItems = [];
  let idx = 0;

  const flushUl = () => {
    if (ulItems.length) {
      elements.push(<ul key={`ul${idx++}`} style={{ paddingLeft: 16, margin: '4px 0' }}>{ulItems}</ul>);
      ulItems = [];
    }
  };
  const flushOl = () => {
    if (olItems.length) {
      elements.push(<ol key={`ol${idx++}`} style={{ paddingLeft: 16, margin: '4px 0' }}>{olItems}</ol>);
      olItems = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith('- ')) {
      flushOl();
      ulItems.push(<li key={i}>{renderInline(line.slice(2), i)}</li>);
    } else if (/^\d+\.\s/.test(line)) {
      flushUl();
      olItems.push(<li key={i}>{renderInline(line.replace(/^\d+\.\s/, ''), i)}</li>);
    } else {
      flushUl();
      flushOl();
      if (line.trim() === '') {
        elements.push(<br key={`br${i}`} />);
      } else {
        elements.push(<p key={i} style={{ margin: '2px 0' }}>{renderInline(line, i)}</p>);
      }
    }
  });
  flushUl();
  flushOl();

  return elements;
};

export default renderMarkdown;
