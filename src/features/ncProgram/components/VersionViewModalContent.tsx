import React from 'react';
import type { ProgramVersion } from '../types';
import { FileText, Download } from 'lucide-react';

interface VersionViewModalContentProps {
  version: ProgramVersion;
}

const VersionViewModalContent: React.FC<VersionViewModalContentProps> = ({
  version,
}) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Version
          </p>
          <p className="text-sm font-bold text-gray-900">
            v{version.versionNumber}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Status
          </p>
          <div>
            {version.isDeleted ? (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Deleted
              </span>
            ) : version.isBlocked ? (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Blocked
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Active
              </span>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            File Name
          </p>
          <p className="text-sm text-gray-800 flex items-center gap-1">
            <FileText size={13} className="text-gray-400" />
            {version.fileName || '—'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            File Size
          </p>
          <p className="text-sm text-gray-800">
            {version.fileSize
              ? `${(version.fileSize / 1024).toFixed(1)} KB`
              : '—'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Uploaded
          </p>
          <p className="text-sm text-gray-800">
            {new Date(version.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            MIME Type
          </p>
          <p className="text-sm text-gray-800">{version.mimeType || '—'}</p>
        </div>
      </div>

      {/* Description */}
      {version.description && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Description
          </p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3 border border-gray-100">
            {version.description}
          </p>
        </div>
      )}

      {/* Download link */}
      {version.fileUrl && (
        <div className="pt-2 border-t border-gray-100">
          <a
            href={version.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f46e5] hover:underline"
          >
            <Download size={15} />
            Download NC File
          </a>
        </div>
      )}
    </div>
  );
};

export default VersionViewModalContent;
