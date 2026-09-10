import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDateAvailability } from '../data/bookingAvailability'

const FULL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CompactTwoMonthCalendarPopover({
  isOpen,
  onClose,
  selectedDate, // "YYYY-MM-DD"
  onSelectDate, // (formattedDDMMYYYY, yyyyMmDd) => void
  minDate, // "YYYY-MM-DD" (today)
  maxDate, // "YYYY-MM-DD" (1 year max)
  toggleBtnRef
}) {
  const popoverRef = useRef(null)

  // Parse today's year & month or selected date's year & month as starting view
  const initialYearMonth = useMemo(() => {
    if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [y, m] = selectedDate.split('-').map(Number)
      return { year: y, month: m - 1 }
    }
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  }, [selectedDate])

  const [viewState, setViewState] = useState(initialYearMonth)

  // Sync initial view state when popover opens if selectedDate is set
  useEffect(() => {
    if (isOpen) {
      if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
        const [y, m] = selectedDate.split('-').map(Number)
        setViewState({ year: y, month: m - 1 })
      }
    }
  }, [isOpen, selectedDate])

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        toggleBtnRef?.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, onClose, toggleBtnRef])

  // Escape key listener
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Month navigation: Move 1 month forward / backward
  const handlePrevMonth = () => {
    setViewState((prev) => {
      let newMonth = prev.month - 1
      let newYear = prev.year
      if (newMonth < 0) {
        newMonth = 11
        newYear -= 1
      }
      return { year: newYear, month: newMonth }
    })
  }

  const handleNextMonth = () => {
    setViewState((prev) => {
      let newMonth = prev.month + 1
      let newYear = prev.year
      if (newMonth > 11) {
        newMonth = 0
        newYear += 1
      }
      return { year: newYear, month: newMonth }
    })
  }

  // Calculate Month 1 and Month 2
  const month1 = viewState
  const month2 = useMemo(() => {
    let m2Month = viewState.month + 1
    let m2Year = viewState.year
    if (m2Month > 11) {
      m2Month = 0
      m2Year += 1
    }
    return { year: m2Year, month: m2Month }
  }, [viewState])

  // Check if prev month is before minDate (current month)
  const isPrevDisabled = useMemo(() => {
    const min = minDate ? new Date(minDate) : new Date()
    const minYear = min.getFullYear()
    const minMonth = min.getMonth()
    return viewState.year < minYear || (viewState.year === minYear && viewState.month <= minMonth)
  }, [viewState, minDate])

  // Generate grid for a given year & month
  const generateMonthGrid = (year, month) => {
    const firstWeekday = new Date(year, month, 1).getDay() // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells = []
    // Blank leading cells
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ isBlank: true, key: `blank-${year}-${month}-${i}` })
    }

    // Days 1..daysInMonth
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0')
      const dayStr = String(day).padStart(2, '0')
      const dateKey = `${year}-${monthStr}-${dayStr}`

      const isBeforeMin = minDate && dateKey < minDate
      const isAfterMax = maxDate && dateKey > maxDate

      let status = 'available'
      if (isBeforeMin || isAfterMax) {
        status = 'unavailable'
      } else {
        status = getDateAvailability(dateKey)
      }

      cells.push({
        isBlank: false,
        day,
        dateKey,
        status,
        isSelected: dateKey === selectedDate,
        key: dateKey
      })
    }

    return cells
  }

  const month1Grid = useMemo(() => generateMonthGrid(month1.year, month1.month), [month1, selectedDate, minDate, maxDate])
  const month2Grid = useMemo(() => generateMonthGrid(month2.year, month2.month), [month2, selectedDate, minDate, maxDate])

  const handleDateClick = (dateKey, status) => {
    if (status === 'unavailable') return
    const [y, m, d] = dateKey.split('-')
    const formattedDDMMYYYY = `${d}-${m}-${y}`
    onSelectDate(formattedDDMMYYYY, dateKey)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          role="dialog"
          aria-label="Select preferred dive date"
          className="absolute top-full left-0 mt-2 z-50 bg-white rounded-[28px] border border-navy/10 shadow-2xl p-4 sm:p-5 w-[92vw] sm:w-[580px] md:w-[620px] max-w-[620px] text-navy font-body select-none"
          style={{ textShadow: 'none' }}
        >
          {/* Header Bar with Navigation Arrows */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-navy/10">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={isPrevDisabled}
              aria-label="Previous month"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F0F2F5] text-navy hover:bg-navy hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#F0F2F5] disabled:hover:text-navy cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Desktop / Dual Header vs Mobile Single Header */}
            <div className="flex-1 flex items-center justify-around text-sm sm:text-base font-heading font-bold text-navy px-2">
              <span className="text-center">
                {FULL_MONTH_NAMES[month1.month]} {month1.year}
              </span>
              <span className="hidden sm:inline text-navy/20 font-light">|</span>
              <span className="hidden sm:inline text-center">
                {FULL_MONTH_NAMES[month2.month]} {month2.year}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F0F2F5] text-navy hover:bg-navy hover:text-white transition cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Dual Month Grids Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            
            {/* MONTH 1 */}
            <div>
              {/* Mobile subheader if single month mode */}
              <div className="sm:hidden text-center text-xs font-bold uppercase tracking-wider text-navy/60 mb-2">
                {FULL_MONTH_NAMES[month1.month]} {month1.year}
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 text-center mb-1">
                {WEEKDAY_NAMES.map((w) => (
                  <span key={w} className="text-[10px] font-bold text-navy/50 uppercase">
                    {w}
                  </span>
                ))}
              </div>

              {/* Date Cells Grid */}
              <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                {month1Grid.map((cell) => {
                  if (cell.isBlank) {
                    return <div key={cell.key} className="w-8 h-8" />
                  }
                  return (
                    <DateCell
                      key={cell.key}
                      cell={cell}
                      onClick={() => handleDateClick(cell.dateKey, cell.status)}
                    />
                  )
                })}
              </div>
            </div>

            {/* MONTH 2 (Hidden on extra small mobile screens, visible on sm and up) */}
            <div className="hidden sm:block">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 text-center mb-1">
                {WEEKDAY_NAMES.map((w) => (
                  <span key={w} className="text-[10px] font-bold text-navy/50 uppercase">
                    {w}
                  </span>
                ))}
              </div>

              {/* Date Cells Grid */}
              <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                {month2Grid.map((cell) => {
                  if (cell.isBlank) {
                    return <div key={cell.key} className="w-8 h-8" />
                  }
                  return (
                    <DateCell
                      key={cell.key}
                      cell={cell}
                      onClick={() => handleDateClick(cell.dateKey, cell.status)}
                    />
                  )
                })}
              </div>
            </div>

          </div>

          {/* Compact Legend Bar */}
          <div className="mt-4 pt-3 border-t border-navy/10 flex items-center justify-center gap-5 text-[11px] font-semibold text-navy/70">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Limited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>Unavailable</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DateCell({ cell, onClick }) {
  const { day, status, isSelected, dateKey } = cell
  const isUnavailable = status === 'unavailable'

  return (
    <button
      type="button"
      disabled={isUnavailable}
      onClick={onClick}
      aria-label={`${dateKey} - ${status}`}
      aria-selected={isSelected}
      className={`group relative flex flex-col items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-bold transition-all duration-150 ${
        isSelected
          ? 'bg-navy text-white shadow-md ring-2 ring-navy/20 scale-105'
          : isUnavailable
          ? 'text-navy/25 cursor-not-allowed bg-transparent'
          : 'text-navy hover:bg-navy/10 hover:scale-105 cursor-pointer'
      }`}
    >
      <span className="leading-none">{day}</span>
      {/* Availability indicator dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-colors ${
          status === 'available'
            ? isSelected ? 'bg-accent' : 'bg-emerald-500'
            : status === 'limited'
            ? isSelected ? 'bg-accent' : 'bg-amber-400'
            : 'bg-slate-300 opacity-60'
        }`}
      />
    </button>
  )
}
