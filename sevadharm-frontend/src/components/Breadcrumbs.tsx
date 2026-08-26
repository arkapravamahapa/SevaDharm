import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 mb-6 overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
      {/* Home Icon (Always goes to Dashboard/Home) */}
      <div 
        onClick={items[0]?.onClick}
        className="flex items-center justify-center p-2 rounded-xl bg-white border border-neutral-200 text-neutral-500 hover:text-brand hover:border-brand/30 transition-all cursor-pointer shadow-sm"
      >
        <Home className="w-4 h-4" />
      </div>

      {items.map((item, index) => {
        const isFirst = index === 0;
        
        // Skip the first item if we want to use the Home icon for it instead
        if (isFirst) return null;

        return (
          <div key={item.label} className="flex items-center sm:space-x-2">
            <ChevronRight className="w-4 h-4 text-neutral-300 mx-1 shrink-0" />
            <button
              onClick={item.onClick}
              disabled={item.isCurrentPage || !item.onClick}
              className={`text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                item.isCurrentPage
                  ? 'bg-brand/10 text-brand border border-brand/20 cursor-default'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-brand cursor-pointer shadow-sm'
              }`}
            >
              {item.label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}