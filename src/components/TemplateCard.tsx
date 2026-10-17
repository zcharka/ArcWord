import React from 'react'
import type { TemplateItem } from '../types'

interface TemplateCardProps {
  template: TemplateItem
  onSelect: (template: TemplateItem) => void
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(template)}
      className="group flex flex-col items-center cursor-pointer w-[122px] select-none text-left"
    >
      {/* Thumbnail Card */}
      <div className="w-[108px] h-[142px] bg-white rounded-[2px] shadow-md border border-neutral-700/40 relative overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-1 group-active:scale-95 group-hover:ring-2 group-hover:ring-[#0078d4] group-hover:shadow-[0_8px_20px_rgba(0,120,212,0.25)] p-2 flex flex-col">
        {template.previewType === 'blank' && (
          <div className="w-full h-full bg-white" />
        )}

        {template.previewType === 'welcome' && (
          <div className="w-full h-full flex flex-col justify-between py-1">
            <div className="space-y-1">
              <div className="h-1.5 w-14 bg-[#2b579a] rounded-xs" />
              <div className="h-1 w-10 bg-neutral-300 rounded-xs" />
              <div className="h-1 w-16 bg-neutral-200 rounded-xs" />
            </div>
            <div className="border border-[#2b579a]/30 p-1 rounded bg-[#2b579a]/5 text-center">
              <span className="text-[7px] text-[#2b579a] font-semibold leading-none block">
                Skorzystaj z przewodnika
              </span>
              <div className="mt-1 w-4 h-4 bg-[#2b579a] rounded-full mx-auto flex items-center justify-center text-white text-[8px]">
                →
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-0.5 w-full bg-neutral-200" />
              <div className="h-0.5 w-4/5 bg-neutral-200" />
            </div>
          </div>
        )}

        {template.previewType === 'single' && (
          <div className="w-full h-full flex flex-col justify-start py-1">
            <span className="text-[10px] text-[#2b579a] font-bold block mb-1">Aa</span>
            <div className="h-0.5 w-full bg-[#2b579a] mb-2" />
            <div className="space-y-1">
              <div className="h-0.5 w-full bg-neutral-300" />
              <div className="h-0.5 w-5/6 bg-neutral-300" />
              <div className="h-0.5 w-full bg-neutral-300" />
              <div className="h-0.5 w-4/5 bg-neutral-300" />
            </div>
          </div>
        )}

        {template.previewType === 'resume1' && (
          <div className="w-full h-full flex flex-col justify-start py-0.5">
            <div className="flex gap-1 items-center mb-1">
              <div className="w-4 h-4 rounded-full bg-neutral-400 shrink-0" />
              <div className="space-y-0.5 flex-1">
                <div className="h-1 w-10 bg-[#2b579a]" />
                <div className="h-0.5 w-8 bg-neutral-300" />
              </div>
            </div>
            <div className="flex gap-1 h-full">
              <div className="w-2/3 space-y-1">
                <div className="h-0.5 w-8 bg-[#2b579a]" />
                <div className="h-0.5 w-full bg-neutral-200" />
                <div className="h-0.5 w-full bg-neutral-200" />
                <div className="h-0.5 w-6 bg-[#2b579a]" />
                <div className="h-0.5 w-full bg-neutral-200" />
              </div>
              <div className="w-1/3 bg-[#2b579a]/10 p-0.5 rounded-xs space-y-0.5">
                <div className="h-0.5 w-full bg-[#2b579a]" />
                <div className="h-0.5 w-3/4 bg-neutral-300" />
                <div className="h-0.5 w-full bg-neutral-300" />
              </div>
            </div>
          </div>
        )}

        {template.previewType === 'toc' && (
          <div className="w-full h-full flex flex-col justify-between py-1">
            <div className="space-y-1">
              <div className="h-1.5 w-16 bg-[#0078d4]" />
              <div className="h-0.5 w-10 bg-neutral-300" />
            </div>
            <div className="border border-[#0078d4]/40 bg-[#0078d4]/10 p-1 rounded-xs">
              <span className="text-[6.5px] text-[#0078d4] font-semibold block leading-tight">
                Wstawianie pierwszego Spisu treści
              </span>
            </div>
            <div className="h-3 w-full bg-neutral-100 flex items-center justify-center">
              <span className="text-[6px] text-neutral-400">1 ... 2 ... 3</span>
            </div>
          </div>
        )}

        {template.previewType === 'resume2' && (
          <div className="w-full h-full flex flex-col justify-start py-1">
            <div className="h-1 w-14 bg-[#107c41] mb-0.5" />
            <div className="h-0.5 w-10 bg-neutral-400 mb-1.5" />
            <div className="h-[0.5px] w-full bg-[#107c41] mb-1" />
            <div className="space-y-1">
              <div className="h-0.5 w-6 bg-[#107c41]" />
              <div className="h-0.5 w-full bg-neutral-200" />
              <div className="h-0.5 w-5/6 bg-neutral-200" />
              <div className="h-0.5 w-6 bg-[#107c41]" />
              <div className="h-0.5 w-full bg-neutral-200" />
            </div>
          </div>
        )}

        {template.previewType === 'cover1' && (
          <div className="w-full h-full flex flex-col justify-start py-1">
            <div className="self-end h-0.5 w-8 bg-neutral-300 mb-2" />
            <div className="h-0.5 w-10 bg-neutral-400 mb-0.5" />
            <div className="h-0.5 w-12 bg-neutral-300 mb-2" />
            <div className="h-0.5 w-14 bg-[#107c41] mb-1" />
            <div className="space-y-0.5">
              <div className="h-0.5 w-full bg-neutral-200" />
              <div className="h-0.5 w-full bg-neutral-200" />
              <div className="h-0.5 w-4/5 bg-neutral-200" />
            </div>
          </div>
        )}

        {template.previewType === 'cover2' && (
          <div className="w-full h-full flex flex-col justify-start py-0.5">
            <div className="h-1 w-full bg-[#2b579a] mb-1" />
            <div className="flex gap-1 items-center mb-1">
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-400 shrink-0" />
              <div className="space-y-0.5">
                <div className="h-0.5 w-10 bg-[#2b579a]" />
                <div className="h-0.5 w-8 bg-neutral-300" />
              </div>
            </div>
            <div className="space-y-1 mt-1">
              <div className="h-0.5 w-full bg-neutral-200" />
              <div className="h-0.5 w-full bg-neutral-200" />
              <div className="h-0.5 w-3/4 bg-neutral-200" />
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      <span className="mt-2 text-[12px] text-neutral-200 text-center leading-tight line-clamp-2 w-full px-1 group-hover:text-white">
        {template.title}
      </span>
    </div>
  )
}
