// Blinking Deadline Alert Component
// Shows red (overdue), yellow (due soon), or green (met)

import React from 'react';

// CSS for blinking animation
const style = `
@keyframes pulse-blink {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

@keyframes color-pulse {
  0%, 100% {
    background-color: #ef4444;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  }
  50% {
    background-color: #dc2626;
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
  }
}

@keyframes warning-pulse {
  0%, 100% {
    background-color: #eab308;
    box-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
  }
  50% {
    background-color: #ca8a04;
    box-shadow: 0 0 20px rgba(234, 179, 8, 0.8);
  }
}

.blink-alert {
  animation: pulse-blink 1.5s ease-in-out infinite;
}

.blink-red {
  animation: color-pulse 1s ease-in-out infinite;
}

.blink-yellow {
  animation: warning-pulse 1.5s ease-in-out infinite;
}

.blink-green {
  background-color: #10b981;
  box-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
}
`;

export function BlinkingDeadlineAlert({ dli }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(dli.deadline);
  deadline.setHours(0, 0, 0, 0);

  const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  let status = 'met';
  let statusClass = 'blink-green';
  let statusIcon = '✓';
  let statusText = 'COMPLETED';
  let statusColor = 'text-green-700';

  if (daysUntil < 0) {
    // OVERDUE - RED BLINKING
    status = 'overdue';
    statusClass = 'blink-red blink-alert';
    statusIcon = '!';
    statusText = `OVERDUE (${Math.abs(daysUntil)} days)`;
    statusColor = 'text-red-700';
  } else if (daysUntil === 0) {
    // DUE TODAY - YELLOW BLINKING
    status = 'today';
    statusClass = 'blink-yellow blink-alert';
    statusIcon = '⚠';
    statusText = 'DUE TODAY';
    statusColor = 'text-yellow-700';
  } else if (daysUntil <= 7) {
    // DUE SOON - YELLOW BLINKING
    status = 'soon';
    statusClass = 'blink-yellow blink-alert';
    statusIcon = '⚠';
    statusText = `DUE IN ${daysUntil} DAYS`;
    statusColor = 'text-yellow-700';
  }

  return (
    <>
      <style>{style}</style>
      <div
        className={`rounded-lg p-4 border-l-4 ${statusClass}`}
        style={{
          borderLeftColor:
            status === 'overdue'
              ? '#ef4444'
              : status === 'today' || status === 'soon'
              ? '#eab308'
              : '#10b981'
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900">{dli.code}</h3>
              <span className="text-sm font-600 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {dli.program}
              </span>
            </div>
            <p className="text-gray-700 font-500 mb-2">{dli.name}</p>
            <p className="text-sm text-gray-600">
              Deadline:{' '}
              <span className="font-600">
                {deadline.toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </p>
          </div>

          {/* Status Badge - Blinking */}
          <div
            className={`px-4 py-2 rounded-lg font-bold text-white text-sm min-w-max ${statusClass}`}
          >
            <div className="flex items-center gap-1">
              <span className="text-lg">{statusIcon}</span>
              <span>{statusText}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {status === 'overdue' && (
          <div className="mt-3 w-full bg-red-100 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }} />
          </div>
        )}
        {(status === 'today' || status === 'soon') && (
          <div className="mt-3 w-full bg-yellow-100 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${100 - (daysUntil / 30) * 100}%` }}
            />
          </div>
        )}
        {status === 'met' && (
          <div className="mt-3 w-full bg-green-100 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
          </div>
        )}
      </div>
    </>
  );
}

// List of all DLIs with blinking alerts
export function DLIAlertsList({ dlis, state }) {
  const sortedDlis = [...dlis].sort((a, b) => {
    const aDate = new Date(a.deadline);
    const bDate = new Date(b.deadline);
    return aDate - bDate;
  });

  // Count by status
  const overdue = sortedDlis.filter(d => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(d.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  });

  const upcoming = sortedDlis.filter(d => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(d.deadline);
    deadline.setHours(0, 0, 0, 0);
    const daysUntil = (deadline - today) / (1000 * 60 * 60 * 24);
    return daysUntil >= 0 && daysUntil <= 7;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-600 font-500">OVERDUE</p>
              <p className="text-3xl font-bold text-red-700">{overdue.length}</p>
            </div>
            <span className="text-4xl opacity-20">!</span>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-600 font-500">DUE SOON (7 DAYS)</p>
              <p className="text-3xl font-bold text-yellow-700">{upcoming.length}</p>
            </div>
            <span className="text-4xl opacity-20">⚠</span>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-500">COMPLETED</p>
              <p className="text-3xl font-bold text-green-700">
                {sortedDlis.length - overdue.length - upcoming.length}
              </p>
            </div>
            <span className="text-4xl opacity-20">✓</span>
          </div>
        </div>
      </div>

      {/* Alert Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">DLI Deadline Tracker</h2>
        <p className="text-gray-600">
          All {sortedDlis.length} DLIs for {state} State - Status updates automatically
        </p>
      </div>

      {/* DLI Cards - All Sorted by Deadline */}
      <div className="space-y-4">
        {sortedDlis.map((dli) => (
          <BlinkingDeadlineAlert key={dli.code} dli={dli} />
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500 animate-pulse"></div>
            <span className="text-gray-700">
              <strong>Red Blinking:</strong> Overdue - Urgent action needed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500 animate-pulse"></div>
            <span className="text-gray-700">
              <strong>Yellow Blinking:</strong> Due within 7 days
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-gray-700">
              <strong>Green Solid:</strong> Completed on time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
