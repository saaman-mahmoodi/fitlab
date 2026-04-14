'use client';

export default function ProgressPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
        <p className="text-gray-500">Track client weight, measurements, and progress photos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-2">Weight Log</h3>
          <p className="text-gray-500 text-sm">Log and view client weight data over time with trend charts.</p>
          <p className="text-gray-400 text-xs mt-4">Select a client from the dropdown to view their progress data.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-2">Measurements</h3>
          <p className="text-gray-500 text-sm">Track body measurements like waist, arms, chest, and more.</p>
          <p className="text-gray-400 text-xs mt-4">Coming in full feature release.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-2">Progress Photos</h3>
          <p className="text-gray-500 text-sm">Upload and compare before/after progress photos.</p>
          <p className="text-gray-400 text-xs mt-4">Coming in full feature release.</p>
        </div>
      </div>
    </div>
  );
}