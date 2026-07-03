import React, { useMemo } from 'react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';
import type { NcProgram } from '../types';
import { FileText } from 'lucide-react';
import { DataTable } from '@/shared/components/custom/DataTable';

interface NcProgramTableProps {
  programs: NcProgram[];
  total: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onAddVersion: (program: NcProgram) => void;
  onEditProgram: (program: NcProgram) => void;
  onShowVersions: (program: NcProgram) => void;
}

const columnHelper = createColumnHelper<NcProgram>();

const NcProgramTable: React.FC<NcProgramTableProps> = ({
  programs,
  total,
  pageIndex,
  pageSize,
  onPageChange,
  onAddVersion,
  onEditProgram,
  onShowVersions,
}) => {
  const columns: ColumnDef<NcProgram, unknown>[] = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Program Name',
        cell: (info) => {
          const program = info.row.original;
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {program.name}
              </span>
              <span className="text-xs text-gray-500">
                {program.versions?.length || 0} versions
              </span>
            </div>
          );
        },
      }) as ColumnDef<NcProgram, unknown>,

      columnHelper.display({
        id: 'latestVersion',
        header: 'Latest Version',
        cell: (info) => {
          const program = info.row.original;
          const versions = program.versions || [];
          const latest = versions[versions.length - 1];
          if (!latest) return <span className="text-gray-400">—</span>;
          return (
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                v{latest.versionNumber}
              </span>
              <span
                className="text-xs text-gray-500 max-w-[200px] truncate"
                title={latest.fileName || ''}
              >
                {latest.fileName || '—'}
              </span>
            </div>
          );
        },
      }) as ColumnDef<NcProgram, unknown>,

      columnHelper.display({
        id: 'status',
        header: 'Status',
        cell: (info) => {
          const program = info.row.original;
          const versions = program.versions || [];
          const latest = versions[versions.length - 1];
          if (!latest) return <span className="text-gray-400">—</span>;
          if (latest.isDeleted) {
            return (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Deleted
              </span>
            );
          }
          if (latest.isBlocked) {
            return (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Blocked
              </span>
            );
          }
          return (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Active
            </span>
          );
        },
      }) as ColumnDef<NcProgram, unknown>,

      columnHelper.accessor('createdAt', {
        header: 'Created On',
        cell: (info) => (
          <span className="text-sm text-gray-600">
            {new Date(info.getValue() as string).toLocaleDateString()}
          </span>
        ),
      }) as ColumnDef<NcProgram, unknown>,

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const program = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEditProgram(program)}
                className="h-8 px-3 text-xs font-semibold"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onAddVersion(program)}
                className="h-8 px-3 text-xs font-semibold text-blue-600"
              >
                + Version
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onShowVersions(program)}
                className="h-8 px-3 text-xs font-semibold text-indigo-600"
              >
                Versions
              </Button>
            </div>
          );
        },
      }) as ColumnDef<NcProgram, unknown>,
    ],
    [onEditProgram, onAddVersion, onShowVersions],
  );

  return (
    <div className="space-y-4">
      {programs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <FileText size={48} strokeWidth={1.2} className="mb-3" />
          <p className="text-sm font-medium">No NC Programs found</p>
          <p className="text-xs mt-1">
            Create your first NC Program to get started
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={programs}
          manualPagination={true}
          pageCount={Math.ceil(total / pageSize)}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default NcProgramTable;
