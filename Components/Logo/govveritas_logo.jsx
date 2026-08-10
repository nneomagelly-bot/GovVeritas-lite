// Logo Component - GovVeritas Lite
// Navy (#001F3F) + Gold (#FFD700) branding

export function GovveritasLogo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { width: 40, height: 40, fontSize: 12 },
    md: { width: 60, height: 60, fontSize: 14 },
    lg: { width: 100, height: 100, fontSize: 18 },
    xl: { width: 140, height: 140, fontSize: 20 }
  };

  const { width, height, fontSize } = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Logo SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Navy Background G Shape */}
        <g>
          {/* Rounded rectangle for G */}
          <path
            d="M 50 60 Q 50 50 60 50 L 120 50 Q 130 50 130 60 L 130 90 L 100 90 L 100 110 L 130 110 Q 130 120 120 120 L 60 120 Q 50 120 50 110 L 50 60 Z"
            fill="#001F3F"
          />

          {/* Gold Checkmark */}
          <path
            d="M 85 85 L 100 100 L 140 60"
            stroke="#FFD700"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>

      {/* Text */}
      {showText && (
        <div className="text-center">
          <div
            style={{ fontSize: `${fontSize + 4}px` }}
            className="font-bold text-[#001F3F] leading-none"
          >
            GovVeritas
          </div>
          <div
            style={{ fontSize: `${fontSize - 2}px` }}
            className="font-semibold text-[#FFD700]"
          >
            LITE
          </div>
        </div>
      )}
    </div>
  );
}

// Header with Logo
export function GovveritasHeader({ stateName = null }) {
  return (
    <div className="bg-gradient-to-r from-[#001F3F] to-[#003366] text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <GovveritasLogo size="sm" showText={false} />
          <div>
            <h1 className="text-xl font-bold">GovVeritas Lite</h1>
            {stateName && (
              <p className="text-sm text-[#FFD700] font-semibold">
                {stateName} State Dashboard
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="text-right">
          <p className="text-xs opacity-75">Compliance Readiness Platform</p>
          <p className="text-xs opacity-75">World Bank HOPE-GOV Programme</p>
        </div>
      </div>

      {/* Gold Accent Line */}
      <div className="h-1 bg-[#FFD700]"></div>
    </div>
  );
}

// Logo Component for Sidebar
export function SidebarLogo() {
  return (
    <div className="bg-[#001F3F] text-white p-4 border-b-2 border-[#FFD700]">
      <div className="flex items-center justify-center gap-2">
        <GovveritasLogo size="sm" showText={false} />
        <div>
          <div className="font-bold text-sm">GovVeritas</div>
          <div className="text-xs text-[#FFD700]">LITE</div>
        </div>
      </div>
    </div>
  );
}
