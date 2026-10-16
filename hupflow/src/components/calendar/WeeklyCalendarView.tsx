'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
} from 'lucide-react';
import { getDaysOfWeek, isSameDay, formatDayName, formatWeekRange } from '@/lib/calendar/date-utils';
import { CalendarPost } from './RescheduleModal';

interface WeeklyCalendarViewProps {
  posts: CalendarPost[];
  onSelectPost: (post: CalendarPost) => void;
}

export function WeeklyCalendarView({ posts, onSelectPost }: WeeklyCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const daysOfWeek = getDaysOfWeek(currentDate);
  const today = new Date();

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-4">
      {/* Calendar Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-bold text-white tracking-wide">
            {formatWeekRange(daysOfWeek)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold"
          >
            Hoje
          </button>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={handlePrevWeek}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Semana Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextWeek}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Próxima Semana"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7 Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {daysOfWeek.map((day) => {
          const isCurrentDay = isSameDay(day, today);
          const dayPosts = posts.filter((p) => isSameDay(new Date(p.scheduledAt), day));

          return (
            <div
              key={day.toISOString()}
              className={`rounded-2xl border p-3 flex flex-col justify-between min-h-[300px] transition-all ${
                isCurrentDay
                  ? 'border-indigo-500/60 bg-indigo-950/20 shadow-lg shadow-indigo-500/5'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80'
              }`}
            >
              {/* Day Header */}
              <div className="border-b border-slate-800/80 pb-2.5 mb-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {formatDayName(day)}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-base font-extrabold ${
                        isCurrentDay ? 'text-indigo-400' : 'text-slate-200'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    {isCurrentDay && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-300">
                        Hoje
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] font-mono font-semibold text-slate-500">
                  {dayPosts.length} posts
                </span>
              </div>

              {/* Posts Cards in Day */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                {dayPosts.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-4 text-center">
                    <span className="text-[11px] text-slate-600 font-medium">Nenhum post agendado</span>
                  </div>
                ) : (
                  dayPosts.map((post) => {
                    const timeStr = new Date(post.scheduledAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={post.id}
                        onClick={() => onSelectPost(post)}
                        className="group p-2.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer transition-all space-y-1.5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-indigo-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeStr}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full ${
                              post.status === 'published'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-indigo-500/20 text-indigo-300'
                            }`}
                          >
                            {post.status === 'published' ? 'Enviado' : 'Fila'}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">
                          {post.topic}
                        </p>

                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          {post.networks.map((net) => (
                            <span
                              key={net}
                              className="text-[8px] font-mono px-1 py-0.2 rounded bg-slate-850 text-slate-400 border border-slate-750 uppercase"
                            >
                              {net === 'x' ? 'X' : net === 'linkedin' ? 'LI' : net === 'instagram' ? 'IG' : 'TH'}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
