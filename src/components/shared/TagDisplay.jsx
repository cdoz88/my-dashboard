import React from 'react';
import { tagStyles } from '../../utils/constants';

export default function TagDisplay({ tags, className = "" }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tags.map(tag => (
        <span key={tag} className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border ${tagStyles[tag] || tagStyles['See Notes']}`}>
          {tag}
        </span>
      ))}
    </div>
  );
}